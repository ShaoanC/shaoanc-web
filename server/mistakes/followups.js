const crypto = require('node:crypto');
const fs = require('node:fs');
const { rateLimit } = require('express-rate-limit');
const { db, followupDayStart, followupDayEnd, billableFollowup } = require('./database');
const { fail, requireSession, requireUser } = require('./auth');
const { assertWritable } = require('./backup-coordination');
const { readFollowupConfig, availableFollowupProfiles, defaultFollowupProfile, safeAiError } = require('./ai-config');
const { resolveVendorIcon } = require('../../shared/vendor-icon.mjs');
const { analysisImages } = require('./ai');
const { imagePath, questionForMistake } = require('./images');
const { markdownImages } = require('./question-images');
const { requestFollowup } = require('./followup-provider');

const active = new Map();
const rate = rateLimit({
    windowMs: 60000,
    limit: 6,
    keyGenerator: (req) => String(req.user.id),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => res.status(429).json({ success: false, code: 'RATE_LIMITED', message: '每分钟最多发起 6 次追问，请稍后再试' })
});

const pairSelect = `SELECT a.*, q.content AS question, CASE WHEN ${billableFollowup('a')} THEN a.credit_cost ELSE 0 END AS credits_charged
    FROM mistake_followups a JOIN mistake_followups q ON q.id = a.question_id`;
const pairFilter = "WHERE a.user_id = ? AND a.mistake_id = ? AND a.role = 'assistant'";

const sumCredits = db.prepare(`SELECT COALESCE(SUM(a.credit_cost), 0) AS used FROM mistake_followups a
    WHERE a.user_id = ? AND a.role = 'assistant' AND a.created_at >= ${followupDayStart}
    AND a.created_at < ${followupDayEnd} AND ${billableFollowup('a')}`);

function quota(userId, dailyCreditLimit) {
    const { used: dailyCreditsUsed } = sumCredits.get(userId);
    return { dailyCreditLimit, dailyCreditsUsed, dailyCreditsRemaining: Math.max(0, dailyCreditLimit - dailyCreditsUsed) };
}

function displayProfile(profile, defaultId) {
    const { id, name, model, tierLabel, creditCost, vision } = profile;
    return { id, name, tierLabel: tierLabel || name, model, vendorIcon: resolveVendorIcon(profile.vendorIcon, model, profile.baseUrl),
        creditCost, supportsVision: vision, isDefault: id === defaultId };
}

function topicContext(row) {
    const point = db.prepare('SELECT name, parent_id FROM knowledge_points WHERE id = ? AND (owner_user_id IS NULL OR owner_user_id = ?)');
    function path(id) {
        const entry = id && point.get(id, row.user_id);
        return entry ? [...path(entry.parent_id), entry.name] : [];
    }
    return {
        subject: db.prepare('SELECT name FROM subjects WHERE id = ?').get(row.subject_id)?.name || '',
        primaryKnowledgePoint: path(row.primary_knowledge_point_id),
        auxiliaryKnowledgePoints: JSON.parse(row.auxiliary_knowledge_point_ids).map(path),
        question: questionForMistake(row), answer: row.answer, analysis: row.analysis
    };
}

function contextRevision(context) {
    return crypto.createHash('sha256').update(JSON.stringify(context)).digest('hex');
}

function serialize(row) {
    return {
        id: row.id, question: row.question, content: row.content, status: row.status,
        error: row.error_message, createdAt: row.created_at, profileId: row.profile_id, model: row.model,
        vendorIcon: row.vendor_icon, creditCost: row.credit_cost, creditsCharged: row.credits_charged,
        imagesSkipped: Boolean(row.images_skipped), contextRevision: row.context_revision
    };
}

function findPair(row, id) {
    const message = db.prepare(pairSelect + ' ' + pairFilter + ' AND a.id = ?').get(row.user_id, row.id, Number(id));
    if (!message) fail(404, '追问不存在');
    return message;
}

function makeTurns(row, context, images, question, retryId) {
    const history = db.prepare(pairSelect + ' ' + pairFilter +
        " AND a.status = 'completed' AND (? IS NULL OR a.id < ?) ORDER BY a.id DESC LIMIT 8")
        .all(row.user_id, row.id, retryId, retryId).reverse();
    return [
        { role: 'user', text: '本题资料：\n' + JSON.stringify(context), images },
        ...history.flatMap((turn) => [{ role: 'user', text: turn.question }, { role: 'assistant', text: turn.content }]),
        { role: 'user', text: question }
    ];
}

const startTurn = db.transaction(({ row, question, retry, profile, revision, imagesSkipped }) => {
    const createdAt = new Date().toISOString();
    db.prepare(`DELETE FROM mistake_followups WHERE user_id = ? AND mistake_id IS NULL AND created_at < ${followupDayStart}`).run(row.user_id);
    let id = retry?.id;
    if (!id) {
        const questionId = db.prepare(
            "INSERT INTO mistake_followups (mistake_id, user_id, role, content, status, created_at) VALUES (?, ?, 'user', ?, 'completed', ?)"
        ).run(row.id, row.user_id, question, createdAt).lastInsertRowid;
        id = db.prepare(
            "INSERT INTO mistake_followups (mistake_id, user_id, role, question_id, status, created_at) VALUES (?, ?, 'assistant', ?, 'streaming', ?)"
        ).run(row.id, row.user_id, questionId, createdAt).lastInsertRowid;
    }
    db.prepare(`UPDATE mistake_followups SET content = '', status = 'streaming', error_message = NULL, token_usage = NULL,
        model = ?, profile_id = ?, vendor_icon = ?, credit_cost = ?, context_revision = ?, images_skipped = ?, created_at = ? WHERE id = ?`)
        .run(profile.model, profile.id, profile.vendorIcon, profile.creditCost, revision, Number(imagesSkipped), createdAt, id);
    return findPair(row, id);
});

function removeReplyImages(content) {
    // A generated reply must not add image requests when printed.
    for (const image of markdownImages(content).reverse()) {
        content = content.slice(0, image.start) + content.slice(image.end);
    }
    return content.trim();
}

async function generate(res, row, message, dailyCreditLimit, request, stream) {
    let content = '';
    let usage = null;
    let imagesSkipped = Boolean(message.images_skipped);
    let status = 'completed';
    let errorMessage = null;
    function write(event, data) {
        if (!res.destroyed && !res.writableEnded) res.write('event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n');
    }
    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();
    const metadata = { profileId: message.profile_id, vendorIcon: message.vendor_icon, creditCost: message.credit_cost };
    const meta = () => write('meta', { ...metadata, message: { ...serialize(message), imagesSkipped }, ...quota(row.user_id, dailyCreditLimit) });
    meta();
    const heartbeat = setInterval(() => {
        if (!res.destroyed && !res.writableEnded) res.write(': heartbeat\n\n');
    }, 15000);
    res.once('close', () => clearInterval(heartbeat));
    try {
        try {
            await requestFollowup({
                ...request, userId: row.user_id, signal: stream.controller.signal,
                onDelta(text) {
                    if (content.length + text.length > 24000) throw new Error('AI 回复达到长度限制，可重试');
                    content += text;
                    write('delta', { id: message.id, text });
                },
                onImagesSkipped() { imagesSkipped = true; meta(); },
                onUsage(value) { usage = value; }
            });
            content = removeReplyImages(content);
            if (!content) throw new Error('AI 未返回回复，可重试');
        } catch (error) {
            content = removeReplyImages(content);
            status = stream.stoppedByUser ? 'cancelled' : 'failed';
            if (status === 'failed') {
                errorMessage = stream.interruption || (/^AI .+可(?:重试|尝试换一种问法)$/.test(error.message) ? error.message : safeAiError(error));
            }
        }
        const { changes } = db.prepare('UPDATE mistake_followups SET content = ?, status = ?, error_message = ?, token_usage = ?, images_skipped = ? WHERE id = ?')
            .run(content, status, errorMessage, usage && JSON.stringify(usage), Number(imagesSkipped), message.id);
        if (!changes) return;
        write(status === 'failed' ? 'error' : 'done', {
            ...metadata, message: serialize(findPair(row, message.id)), ...quota(row.user_id, dailyCreditLimit)
        });
    } finally {
        clearInterval(heartbeat);
        if (!res.destroyed) res.end();
    }
}

function mountFollowups(router, { success, ownMistake }) {
    const route = '/:id/followups';
    router.get(route, requireSession, (req, res) => {
        const row = ownMistake(req, true);
        const before = req.query.before === undefined ? null : Number(req.query.before);
        if (before !== null && (!Number.isSafeInteger(before) || before <= 0)) fail(400, '无效的历史游标');
        const messages = db.prepare(pairSelect + ' ' + pairFilter + ' AND (? IS NULL OR a.id < ?) ORDER BY a.id DESC LIMIT 26')
            .all(row.user_id, row.id, before, before);
        const nextBefore = messages.length > 25 ? messages[24].id : null;
        const count = db.prepare("SELECT COUNT(*) AS count FROM mistake_followups WHERE user_id = ? AND mistake_id = ? AND role = 'assistant'").get(row.user_id, row.id).count;
        const stream = active.get(row.user_id);
        const settings = readFollowupConfig();
        const available = availableFollowupProfiles(settings);
        const defaultId = defaultFollowupProfile(settings, available)?.id;
        res.set('Cache-Control', 'no-store');
        success(res, {
            messages: messages.slice(0, 25).reverse().map(serialize), count, nextBefore,
            ...quota(row.user_id, settings.dailyCreditLimit),
            availableProfiles: available.map((profile) => displayProfile(profile, defaultId)),
            activeMessageId: stream?.mistakeId === row.id ? stream.id : null,
            contextRevision: contextRevision(topicContext(row)), updatedAt: row.updated_at,
            readOnly: !req.user.active || Boolean(row.deleted_at)
        });
    });

    router.post(route + '/stream', requireUser, (req, _res, next) => {
        if (active.has(req.user.id)) fail(409, '本账号有追问正在生成，请等待完成或停止生成');
        next();
    }, rate, async (req, res) => {
        assertWritable();
        if (active.has(req.user.id)) fail(409, '本账号有追问正在生成，请等待完成或停止生成');
        if (!db.prepare('SELECT active FROM users WHERE id = ?').get(req.user.id)?.active) {
            return res.status(403).json({ success: false, code: 'ACCOUNT_FROZEN', message: '您的账号已被冻结，仍可下载自己的数据。' });
        }
        const row = ownMistake(req);
        const { retryMessageId, question: input, profileId } = req.body || {};
        const retry = retryMessageId === undefined ? null : findPair(row, retryMessageId);
        if (retry && retry.status !== 'failed') fail(409, '只能重试失败的回复');
        const question = retry?.question ?? (typeof input === 'string' ? input.trim() : '');
        if (!question || question.length > 1000) fail(400, '请输入 1 至 1000 字的追问');
        const settings = readFollowupConfig();
        const available = availableFollowupProfiles(settings);
        const config = available.find(({ id }) => id === profileId) ?? defaultFollowupProfile(settings, available);
        if (!config) fail(503, '管理员尚未启用并配置错题追问 AI 服务');
        if (quota(row.user_id, settings.dailyCreditLimit).dailyCreditsRemaining < config.creditCost) {
            fail(429, '今日剩余积分不足，可切换更低倍率模型或明日再试');
        }
        const context = topicContext(row);
        const figures = analysisImages(context, row.id, row.user_id);
        const images = config.vision === false ? [] : figures.map((image) => fs.readFileSync(imagePath(image[image.variant + '_path'])).toString('base64'));
        const imagesSkipped = figures.length > 0 && images.length === 0;
        const turns = makeTurns(row, context, images, question, retry?.id ?? null);
        const message = startTurn({ row, question, retry, profile: displayProfile(config), revision: contextRevision(context), imagesSkipped });
        const stream = { id: message.id, mistakeId: row.id, controller: new AbortController() };
        active.set(row.user_id, stream);
        try {
            stream.finished = generate(res, row, message, settings.dailyCreditLimit, { config, turns }, stream);
            await stream.finished;
        } finally {
            active.delete(row.user_id);
        }
    });

    router.post(route + '/:msgId/cancel', requireUser, async (req, res) => {
        const row = ownMistake(req);
        const message = findPair(row, req.params.msgId);
        const stream = active.get(row.user_id);
        if (stream?.id === message.id) {
            stream.stoppedByUser = true;
            stream.controller.abort();
            await stream.finished;
        }
        success(res, serialize(findPair(row, message.id)));
    });

    router.delete(route, requireUser, (req, res) => {
        const row = ownMistake(req);
        if (active.get(row.user_id)?.mistakeId === row.id) fail(409, '请先停止生成再清空追问');
        db.prepare('DELETE FROM mistake_followups WHERE user_id = ? AND mistake_id = ?').run(row.user_id, row.id);
        success(res, null);
    });
}

function interruptFollowup(userId, reason, mistakeId) {
    const stream = active.get(userId);
    if (!stream || (mistakeId !== undefined && stream.mistakeId !== mistakeId)) return;
    stream.interruption = reason;
    stream.controller.abort();
    return stream.finished.catch(() => {
        // The request handler reports persistence failures.
    });
}

function pauseFollowups() {
    return Promise.all([...active.keys()].map((userId) => interruptFollowup(userId, '备份暂停了生成，可重试')));
}

function followupNotes(userId, mistakeId) {
    return db.prepare(pairSelect + ' ' + pairFilter + " AND a.status = 'completed' ORDER BY a.id")
        .all(userId, mistakeId).map(({ question, content }) => ({ question, content }));
}

module.exports = { mountFollowups, pauseFollowups, interruptFollowup, followupNotes };

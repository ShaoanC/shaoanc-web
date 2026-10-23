const crypto = require('node:crypto');
const fs = require('node:fs');
const { z } = require('zod');
const { db } = require('./database');
const { fail } = require('./auth');
const { publicConfig, safeAiError } = require('./ai-config');
const { recognitionMessages } = require('./ai-messages');
const { requestCompletion, requestAnalysis, aiErrorCategory } = require('./ai-request');
const { recognitionFormat, parseRecognitionJson, sourceImageId, figureLocation } = require('./ai-output');
const { imagePath, questionForMistake } = require('./images');
const { markdownImages, legacyFigureText } = require('./question-images');
const { plainText, updateCachedMistake } = require('./search');
const { createTaskScheduler, retryDelay } = require('./ai-scheduler');

const pendingStates = ['queued', 'running', 'retrying'];
const controllers = new Map();
let runtime;
let stopped = false;
const scheduled = createTaskScheduler({
    getTask: (id) => db.prepare('SELECT * FROM ai_jobs WHERE id = ?').get(id),
    getRunner: runtimeForJobs,
    run: runJob,
    onError: (id) => db.prepare("UPDATE ai_jobs SET status = 'failed', error = 'AI 任务无法启动，请重试', finished_at = ? WHERE id = ? AND status IN ('queued','running','retrying')").run(now(), id)
});
const now = () => new Date().toISOString();
const text = z.string().max(20000);
const inputSchema = z.object({ question: text, answer: text, analysis: text,
    subjectId: z.string().nullable(), primaryKnowledgePointId: z.number().int().nullable(), auxiliaryKnowledgePointIds: z.array(z.number().int()) });
const pathSchema = z.array(z.string().trim().min(1).max(100)).max(6);
const incompletePattern = /[\[【（(]\s*待(?:确认|补充)[^\]】）)]*[\]】）)]|\[\[figure:/u;

function normalizeResult(job, value, padFigures = false) {
    const field = job.type;
    const result = { ...value, [field]: text.min(1).parse(value[field]) };
    const pageEntry = job.mode === 'page-entry';
    if (pageEntry) result.answer = text.parse(value.answer ?? '');
    const imageIds = JSON.parse(job.image_ids);
    const allowed = new Set(imageIds);
    result.issues = Array.isArray(value.issues) ? value.issues.map((issue) => ({
        imageId: sourceImageId(issue, imageIds) || null,
        type: typeof issue?.type === 'string' ? issue.type : 'uncertain',
        description: typeof issue?.description === 'string' ? issue.description : '请检查图片中的不确定内容'
    })) : [];
    const addIssue = (type, description, imageId = null) => {
        if (!result.issues.some((issue) => issue.type === type && issue.description === description && issue.imageId === imageId)) result.issues.push({ imageId, type, description });
    };
    const usedIds = new Set();
    result.figures = (Array.isArray(value.figures) ? value.figures : []).map((figure, index) => {
        let id = typeof figure?.id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(figure.id) ? figure.id : `figure-${index + 1}`;
        if (usedIds.has(id)) { addIssue('duplicate_figure', `配图标识 ${id} 重复，请检查插入位置`); id = `${id}-${index + 1}`; }
        usedIds.add(id);
        // Add a small margin only when receiving a new question figure from AI.
        // Stored results and user-adjusted regions retain their exact coordinates.
        const padding = padFigures && field === 'question' && (!pageEntry || figure?.field !== 'answer') ? 0.01 : 0;
        const { imageId, box, error } = figureLocation(figure, imageIds, padding);
        const locationError = figure?.locationError || error;
        if (error) {
            const reason = { source: '未关联到本次图片，请选择来源图片并重新框选', format: '坐标格式不正确，请重新框选', bounds: '选框超出图片或范围为空，请重新框选' }[locationError] || '定位无效，请重新框选';
            addIssue('invalid_figure', `配图 ${id} ${reason}`, imageId || null);
        }
        return { id, imageId, box, ...(pageEntry ? { field: figure?.field === 'answer' ? 'answer' : 'question' } : {}), description: typeof figure?.description === 'string' ? figure.description : '题目配图',
            ...(error ? { locationError, rawLocation: figure?.rawLocation || {
                imageId: figure?.imageId, imageIndex: figure?.imageIndex, box_2d: figure?.box_2d, bounds: figure?.bounds, box: figure?.box, bbox: figure?.bbox
            } } : {}) };
    });
    // Historical tasks used whole uploaded crops. Expose them as editable full-image regions.
    if (!Array.isArray(value.figures) && Array.isArray(value.diagramImageIds)) {
        result.figures = [...new Set(value.diagramImageIds)].filter((id) => allowed.has(id))
            .map((imageId) => ({ id: `legacy-${imageId}`, imageId, box: [0, 0, 1, 1], description: '历史配图，请检查范围' }));
        result[field] = legacyFigureText(result[field], result.figures);
    }
    if (field === 'question') {
        if (result.subjectId && (typeof result.subjectId !== 'string' || !db.prepare('SELECT id FROM subjects WHERE id = ?').get(result.subjectId))) {
            result.subjectId = null;
            addIssue('classification', '学科无法确定，请保留文字并选择学科');
        }
        result.subjectId = result.subjectId || null;
        const primary = pathSchema.safeParse(result.primaryPath || []);
        const auxiliary = z.array(pathSchema).max(8).safeParse(result.auxiliaryPaths || []);
        result.primaryPath = primary.success ? primary.data : [];
        result.auxiliaryPaths = auxiliary.success ? auxiliary.data : [];
        if (!primary.success || !auxiliary.success) addIssue('classification', '知识点归类不完整，请校对');
        if (!result.subjectId) addIssue('classification', '学科暂缺，请校对归类');
        else if (!result.primaryPath.length && !Number.isSafeInteger(result.primaryKnowledgePointId)) addIssue('classification', '主知识点暂缺，请校对归类');
    }
    const combinedText = pageEntry ? `${result.question}\n${result.answer}` : result[field];
    const markers = [...combinedText.matchAll(/\[\[figure:([^\]]+)\]\]/g)].map((match) => match[1]);
    for (const marker of new Set(markers)) {
        if (!result.figures.some((figure) => figure.id === marker && figure.box)) addIssue('unmatched_figure', `配图标记 ${marker} 没有有效选框，请补画或明确移除`);
    }
    if (markdownImages(combinedText).length) addIssue('unlocated_figure', '识别结果包含未定位的图片链接，请检查并改用确认后的本站配图');
    if (pageEntry && !result.answer.trim()) addIssue('answer_missing', '未识别到可匹配的蓝笔答案，正确答案已留空');
    result.needsReview = pageEntry
        ? Boolean(result.figures.length || /\[\[figure:/.test(combinedText) || markdownImages(combinedText).length)
        : Boolean(value.needsReview || result.issues.length || result.figures.length || incompletePattern.test(result[field]));
    return result;
}

function inputFor(row) {
    return { question: questionForMistake(row), answer: row.answer, analysis: row.analysis, subjectId: row.subject_id,
        primaryKnowledgePointId: row.primary_knowledge_point_id, auxiliaryKnowledgePointIds: JSON.parse(row.auxiliary_knowledge_point_ids) };
}

function serializeJob(row) {
    const imageIds = JSON.parse(row.image_ids);
    const recognitionPrompt = JSON.parse(row.source_json || '{}').recognitionPrompt;
    const result = row.result_json ? normalizeResult(row, JSON.parse(row.result_json)) : null;
    return { id: row.id, mistakeId: row.mistake_id, type: row.type, mode: row.mode || 'single', status: row.status, applyStatus: row.apply_status,
        ...(recognitionPrompt ? { recognitionPrompt } : {}),
        input: JSON.parse(row.input_json), imageIds, result, mistakeDeleted: Boolean(row.mistake_deleted_at),
        error: row.error, attempts: row.attempts, maxAttempts: row.max_attempts, createdAt: row.created_at,
        startedAt: row.started_at, finishedAt: row.finished_at, nextAttemptAt: row.next_attempt_at };
}

function ownJob(id, userId) {
    const row = db.prepare('SELECT j.*, m.deleted_at AS mistake_deleted_at FROM ai_jobs j JOIN mistakes m ON m.id = j.mistake_id WHERE j.id = ? AND j.user_id = ?').get(Number(id), userId);
    if (!row) fail(404, 'AI 任务不存在');
    return row;
}

function activeMistake(id, userId) {
    const row = db.prepare('SELECT * FROM mistakes WHERE id = ? AND user_id = ?').get(id, userId);
    if (!row) fail(404, '错题不存在');
    if (row.deleted_at) fail(409, '请先恢复这道错题');
    return row;
}

function isShortAnswer(answer) {
    const content = plainText(answer);
    return Boolean(content.trim()) && [...content.replace(/\s/gu, '')].length <= 80
        && answer.split(/\r?\n/).filter((line) => line.trim() && !/^\s*\$\$\s*$/.test(line)).length <= 3;
}

function enqueueAutomatic(row) {
    const config = publicConfig(false, 'analysis');
    if (!config.enabled || !config.configured || row.deleted_at || !row.question.trim() || row.analysis.trim() || !isShortAnswer(row.answer)
        || incompletePattern.test(row.question) || incompletePattern.test(row.answer)) return null;
    try {
        return createJob(row.user_id, { mistakeId: row.id, type: 'analysis', input: inputFor(row), automatic: true });
    } catch (error) {
        // An image problem must not turn a successfully saved mistake into a failed save.
        if (error.status === 400) return null;
        throw error;
    }
}

function analysisImages(input, mistakeId, userId) {
    const references = [...markdownImages(input.question), ...markdownImages(input.answer)];
    const images = [];
    const seen = new Set();
    for (const reference of references) {
        // Only local, authenticated image endpoints are ever loaded.
        if (!reference.imageId) continue;
        const key = `${reference.imageId}/${reference.variant}`;
        if (seen.has(key)) continue;
        const image = db.prepare('SELECT * FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?')
            .get(reference.imageId, mistakeId, userId);
        if (!image) fail(400, '题干或答案的本站配图不存在或不属于当前错题，请检查后重试');
        images.push({ ...image, variant: reference.variant });
        seen.add(key);
    }
    if (images.length > 12) fail(400, '题干和答案引用的配图超过 12 张，请精简后生成解析');
    return images;
}

function analysisNoticeFor(row) {
    if (row.analysis.trim() || (!row.question.includes('![') && !row.answer.includes('!['))) return undefined;
    try { analysisImages(inputFor(row), row.id, row.user_id); } catch (error) {
        if (error.status === 400) return error.message;
        throw error;
    }
    return undefined;
}

function createJob(userId, body) {
    if (!['question', 'answer', 'analysis'].includes(body.type)) fail(400, '无效的 AI 任务类型');
    const mode = body.mode || 'single';
    if (!['single', 'page-entry'].includes(mode) || (mode === 'page-entry' && body.type !== 'question')) fail(400, '无效的识别模式');
    let source = {};
    if (mode === 'page-entry') {
        const page = db.prepare('SELECT id FROM page_imports WHERE id = ? AND user_id = ?').get(body.source?.pageImportId, userId);
        if (!page || typeof body.source?.label !== 'string') fail(400, '按页录题来源无效');
        source = { pageImportId: page.id, label: body.source.label, regionId: body.source.regionId };
    }
    if (body.type !== 'analysis' && body.recognitionPrompt !== undefined) {
        const prompt = z.string().trim().max(2000).safeParse(body.recognitionPrompt);
        if (!prompt.success) fail(400, '识别补充要求须为不超过 2000 字的文字');
        if (prompt.data) source.recognitionPrompt = prompt.data;
    }
    const clientId = body.clientId === undefined ? null : body.clientId;
    if (body.clientId !== undefined && (typeof clientId !== 'string' || !clientId.trim() || clientId.length > 100)) fail(400, '请提供有效的 AI 提交编号');
    const row = activeMistake(Number(body.mistakeId), userId);
    const parsed = inputSchema.safeParse(body.input);
    if (!parsed.success) fail(400, '请保存有效的题目内容后再识别');
    const input = parsed.data;
    let imageIds = Array.isArray(body.imageIds) ? [...new Set(body.imageIds)] : [];
    if (body.type !== 'analysis' && (!imageIds.length || imageIds.length > 12)) fail(400, '每次请选择 1–12 张裁剪图');
    if (body.type !== 'analysis' && imageIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) fail(400, '图片编号无效');
    for (const id of body.type === 'analysis' ? [] : imageIds) {
        const image = db.prepare('SELECT purpose FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?')
            .get(id, row.id, userId);
        if (!image || (image.purpose !== body.type && !(body.type === 'answer' && image.purpose === 'question'))) fail(400, '图片不存在或用途与任务不一致');
    }
    let references = [];
    if (body.type === 'analysis') {
        if (!input.question.trim()) fail(400, '请先填写题干');
        if (incompletePattern.test(input.question) || incompletePattern.test(input.answer)) fail(400, '题干或答案仍有待确认／待补充内容，请补全并保存后生成解析');
        references = analysisImages(input, row.id, userId);
        imageIds = [...new Set(references.map((image) => image.id))];
    }
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify([body.type, mode, source, input, imageIds,
        references.map((image) => [image.id, image.variant, image[`${image.variant}_path`]])])).digest('hex');
    const requestFingerprint = `${row.id}:${body.automatic ? 1 : 0}:${fingerprint}`;
    if (clientId) {
        const requested = db.prepare(`SELECT j.*, r.fingerprint AS request_fingerprint FROM ai_job_requests r JOIN ai_jobs j ON j.id = r.job_id
            WHERE r.user_id = ? AND r.client_id = ?`).get(userId, clientId);
        if (requested) {
            if (requested.request_fingerprint !== requestFingerprint) {
                fail(409, 'AI 提交编号已用于其他内容，请重新提交');
            }
            return serializeJob(requested);
        }
    }
    const config = publicConfig(false, body.type === 'analysis' ? 'analysis' : 'general');
    if (!config.enabled || !config.configured) fail(400, '管理员尚未启用并配置 AI 服务');
    const previous = db.prepare(`SELECT * FROM ai_jobs WHERE mistake_id = ? AND type = ? AND fingerprint = ?
        AND (status IN ('queued', 'running', 'retrying') OR (? = 1 AND automatic = 1)) ORDER BY id DESC LIMIT 1`)
        .get(row.id, body.type, fingerprint, body.automatic ? 1 : 0);
    const job = db.transaction(() => {
        let result = previous;
        if (!result) {
            const inserted = db.prepare(`INSERT INTO ai_jobs (mistake_id, user_id, type, mode, source_json, input_json, image_ids, automatic, fingerprint, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(row.id, userId, body.type, mode, JSON.stringify(source), JSON.stringify(input), JSON.stringify(imageIds), body.automatic ? 1 : 0, fingerprint, now());
            result = db.prepare('SELECT * FROM ai_jobs WHERE id = ?').get(inserted.lastInsertRowid);
        }
        if (clientId) db.prepare('INSERT INTO ai_job_requests (user_id, client_id, job_id, fingerprint) VALUES (?, ?, ?, ?)').run(userId, clientId, result.id, requestFingerprint);
        return result;
    })();
    if (previous) return serializeJob(job);
    schedule(job.id);
    return serializeJob(job);
}

function resolvePath(userId, subjectId, names) {
    let parentId = null;
    for (const raw of names) {
        const name = raw.normalize('NFKC').trim();
        const existing = db.prepare(`SELECT id FROM knowledge_points WHERE subject_id = ? AND parent_id IS ? AND name = ? COLLATE NOCASE
            AND (owner_user_id IS NULL OR owner_user_id = ?) ORDER BY owner_user_id IS NULL DESC, id LIMIT 1`).get(subjectId, parentId, name, userId);
        parentId = existing ? existing.id : Number(db.prepare('INSERT INTO knowledge_points (subject_id, parent_id, name, owner_user_id) VALUES (?, ?, ?, ?)')
            .run(subjectId, parentId, name, userId).lastInsertRowid);
    }
    return parentId;
}

function parseResult(job, raw) {
    return normalizeResult(job, parseRecognitionJson(raw), true);
}

async function requestResult(job, signal) {
    const input = JSON.parse(job.input_json);
    const imageIds = JSON.parse(job.image_ids);
    const directory = job.type === 'question' ? db.prepare(`SELECT id, subject_id AS subjectId, parent_id AS parentId, name FROM knowledge_points
        WHERE owner_user_id IS NULL OR owner_user_id = ? ORDER BY id`).all(job.user_id) : [];
    const subjects = job.type === 'question' ? db.prepare('SELECT id, name FROM subjects').all() : [];
    const sources = job.type === 'analysis' ? analysisImages(input, job.mistake_id, job.user_id) : imageIds.map((id) => ({
        ...db.prepare('SELECT * FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?').get(id, job.mistake_id, job.user_id), variant: 'crop'
    }));
    const images = sources.map((image) => {
        if (!image.id) throw Object.assign(new Error('Missing image'), { status: 400 });
        return { id: image.id, bytes: fs.readFileSync(imagePath(image[`${image.variant}_path`])) };
    });
    const context = { userId: job.user_id, jobId: job.id, type: job.type, mode: job.mode, attempt: job.attempts + 1, imageCount: images.length };
    if (job.type === 'analysis') return normalizeResult(job, await requestAnalysis({ input, images, signal, context }));
    let target;
    if (job.mode === 'page-entry') {
        target = JSON.parse(job.source_json);
        const page = db.prepare('SELECT * FROM page_imports WHERE id = ? AND user_id = ?').get(target.pageImportId, job.user_id);
        if (!page) throw Object.assign(new Error('Missing source page'), { status: 400 });
        if (images.length !== 2) throw Object.assign(new Error('Missing page image'), { status: 400 });
        context.imageCount = images.length;
    }
    return requestCompletion({ messages: recognitionMessages({ type: job.type, mode: job.mode, target, input, subjects, directory, images,
        recognitionPrompt: JSON.parse(job.source_json || '{}').recognitionPrompt }), responseFormat: recognitionFormat(job.type, job.mode), signal,
        context,
        interpret: (raw) => parseResult(job, raw) });
}

function applyJob(id, userId, options = {}) {
    const job = ownJob(id, userId);
    const row = activeMistake(job.mistake_id, userId);
    if (job.status === 'cancelled') fail(409, '任务已取消，请重试后再填入');
    if (job.status !== 'succeeded') fail(409, '任务尚未完成');
    if (job.apply_status === 'applied' && !options.force) return row;
    const input = JSON.parse(job.input_json);
    const result = normalizeResult(job, JSON.parse(job.result_json));
    const review = options.review;
    if (result.needsReview && !review) fail(409, '识别完成，待校对；请检查疑点和配图后再填入');
    if (review !== undefined && (!review || typeof review !== 'object' || Array.isArray(review))) fail(400, '请提供有效的校对结果');
    const finalText = review ? text.min(1).safeParse(review[job.type]) : { success: true, data: result[job.type] };
    if (!finalText.success) fail(400, '请提供校对后的完整文字');
    const answer = job.mode === 'page-entry' ? text.parse(review ? review.answer ?? result.answer : result.answer) : null;
    const combinedText = answer === null ? finalText.data : `${finalText.data}\n${answer}`;
    if (combinedText.includes('[[figure:')) fail(400, '仍有配图标记，请补画并上传配图或明确移除标记后再填入');
    const allowedImages = new Set(JSON.parse(job.image_ids));
    for (const reference of markdownImages(combinedText)) {
        const image = reference.imageId && db.prepare('SELECT id, source_image_id FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?')
            .get(reference.imageId, row.id, userId);
        if (!image || (!allowedImages.has(image.id) && !allowedImages.has(image.source_image_id))) fail(400, '校对配图必须属于当前用户、当前错题，并来自本次任务图片或其派生配图');
    }
    const current = inputFor(row);
    const fields = job.type === 'question' ? ['question', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds']
        : job.type === 'answer' ? ['answer'] : ['question', 'answer', 'analysis'];
    if (job.mode === 'page-entry') fields.push('answer');
    const expected = options.expectedInput === undefined ? input : inputSchema.safeParse(options.expectedInput);
    if (options.expectedInput !== undefined && !expected.success) fail(400, '校对内容快照无效');
    const expectedInput = options.expectedInput === undefined ? input : expected.data;
    if (!options.force && fields.some((field) => JSON.stringify(current[field]) !== JSON.stringify(expectedInput[field]))) {
        db.prepare("UPDATE ai_jobs SET apply_status = 'conflict' WHERE id = ?").run(id);
        fail(409, '内容已修改，识别结果已保留，请预览后选择填入');
    }
    if (!options.force && options.mode !== 'append' && row[job.type].trim() && row[job.type] !== finalText.data) {
        db.prepare("UPDATE ai_jobs SET apply_status = 'conflict' WHERE id = ?").run(id);
        fail(409, '当前字段已有内容，请校对后明确确认替换');
    }
    if (!options.force && answer !== null && row.answer.trim() && row.answer !== answer) {
        db.prepare("UPDATE ai_jobs SET apply_status = 'conflict' WHERE id = ?").run(id);
        fail(409, '正确答案已有内容，请校对后明确确认替换');
    }
    db.transaction(() => {
        const time = now();
        if (job.type === 'question') {
            const classification = { ...result, ...review };
            const subjectId = classification.subjectId || null;
            if (subjectId !== null && (typeof subjectId !== 'string' || !db.prepare('SELECT id FROM subjects WHERE id = ?').get(subjectId))) fail(400, '请选择有效学科');
            let primary = null;
            let auxiliary = [];
            const checkPoint = (pointId) => {
                if (pointId === null) return null;
                if (!Number.isSafeInteger(pointId) || !db.prepare('SELECT id FROM knowledge_points WHERE id = ? AND subject_id = ? AND (owner_user_id IS NULL OR owner_user_id = ?)')
                    .get(pointId, subjectId, userId)) fail(400, '校对知识点须属于所选学科且可供当前用户使用');
                return pointId;
            };
            if (review && Object.hasOwn(review, 'primaryPath')) {
                const path = pathSchema.safeParse(review.primaryPath);
                if (!path.success) fail(400, '主知识点路径格式不正确');
                if (subjectId) primary = resolvePath(userId, subjectId, path.data);
            } else if (review && Object.hasOwn(review, 'primaryKnowledgePointId')) primary = checkPoint(review.primaryKnowledgePointId);
            else if (subjectId) {
                const path = pathSchema.safeParse(classification.primaryPath || []);
                if (!path.success) fail(400, '主知识点路径格式不正确');
                primary = resolvePath(userId, subjectId, path.data);
            }
            if (review && Object.hasOwn(review, 'auxiliaryKnowledgePointIds')) {
                if (!Array.isArray(review.auxiliaryKnowledgePointIds)) fail(400, '辅助知识点须为编号列表');
                auxiliary = review.auxiliaryKnowledgePointIds.map(checkPoint);
            }
            if ((!review || !Object.hasOwn(review, 'auxiliaryKnowledgePointIds') || Object.hasOwn(review, 'auxiliaryPaths')) && subjectId) {
                const paths = z.array(pathSchema).max(8).safeParse(classification.auxiliaryPaths || []);
                if (!paths.success) fail(400, '辅助知识点路径格式不正确');
                auxiliary.push(...paths.data.map((names) => resolvePath(userId, subjectId, names)));
            }
            auxiliary = [...new Set(auxiliary)].filter((pointId) => pointId && pointId !== primary);
            db.prepare('UPDATE mistakes SET question = ?, subject_id = ?, primary_knowledge_point_id = ?, auxiliary_knowledge_point_ids = ?, updated_at = ? WHERE id = ?')
                .run(finalText.data, subjectId, primary, JSON.stringify(auxiliary), time, row.id);
            if (answer !== null) db.prepare('UPDATE mistakes SET answer = ? WHERE id = ?').run(answer, row.id);
        } else {
            const field = job.type;
            if (options.mode === 'append' && field !== 'answer') fail(400, '只有答案支持追加');
            const value = options.mode === 'append' && row[field].trim() ? `${row[field]}\n\n${finalText.data}` : finalText.data;
            db.prepare(`UPDATE mistakes SET ${field} = ?, updated_at = ? WHERE id = ?`).run(value, time, row.id);
        }
        db.prepare("UPDATE ai_jobs SET apply_status = 'applied' WHERE id = ?").run(id);
    })();
    const updated = activeMistake(row.id, userId);
    updateCachedMistake(userId, updated);
    if (job.type !== 'analysis') enqueueAutomatic(updated);
    return updated;
}

function canRetry(error, attempts) {
    if (error.name === 'AbortError') return false;
    if (['INCOMPLETE_AI_RESULT', 'AI_REFUSAL'].includes(error.code)) return false;
    if (aiErrorCategory(error) === 'format') return attempts < 2;
    return !error.status || [408, 409, 429].includes(error.status) || error.status >= 500;
}

async function runtimeForJobs(userId) {
    if (!runtime) runtime = Promise.all([import('p-queue'), import('p-retry')]).then(([queue, retry]) => ({
        queue: new queue.default({ concurrency: 2 }),
        adminQueue: new queue.default({ concurrency: 10 }),
        retry: retry.default, AbortError: retry.AbortError
    }));
    const runner = await runtime;
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId ?? null);
    return { ...runner, queue: user?.role === 'admin' ? runner.adminQueue : runner.queue };
}

async function runJob(id, runner) {
    const job = db.prepare('SELECT * FROM ai_jobs WHERE id = ?').get(id);
    if (stopped || !job || !pendingStates.includes(job.status)) return;
    const controller = new AbortController();
    controllers.set(id, controller);
    try {
        if (job.attempts >= job.max_attempts) throw new runner.AbortError('已达到最大尝试次数，请手动重试');
        try { activeMistake(job.mistake_id, job.user_id); } catch { throw new runner.AbortError('错题已移入回收站'); }
        db.prepare("UPDATE ai_jobs SET status = 'running', attempts = attempts + 1, started_at = COALESCE(started_at, ?), next_attempt_at = NULL, error = NULL WHERE id = ?").run(now(), id);
        const result = await requestResult(job, controller.signal);
        const current = db.prepare('SELECT status FROM ai_jobs WHERE id = ?').get(id);
        if (controller.signal.aborted || !current || !pendingStates.includes(current.status)) return;
        activeMistake(job.mistake_id, job.user_id);
        db.prepare("UPDATE ai_jobs SET status = 'succeeded', result_json = ?, finished_at = ?, error = NULL WHERE id = ?").run(JSON.stringify(result), now(), id);
        if (!result.needsReview && !JSON.parse(job.input_json)[job.type].trim()) {
            try { applyJob(id, job.user_id); } catch (error) { if (error.status !== 409 && error.status !== 404) throw error; }
        }
    } catch (error) {
        if (!stopped && !controller.signal.aborted) {
            const current = db.prepare('SELECT status, attempts, max_attempts FROM ai_jobs WHERE id = ?').get(id);
            if (current && pendingStates.includes(current.status)) {
                if (current.attempts < current.max_attempts && canRetry(error, current.attempts)) {
                    db.prepare("UPDATE ai_jobs SET status = 'retrying', error = ?, next_attempt_at = ? WHERE id = ?")
                        .run(safeAiError(error), new Date(Date.now() + retryDelay(error, current.attempts)).toISOString(), id);
                } else db.prepare("UPDATE ai_jobs SET status = 'failed', error = ?, finished_at = ?, next_attempt_at = NULL WHERE id = ?")
                    .run(safeAiError(error), now(), id);
            }
        }
    } finally { controllers.delete(id); }
}

function schedule(id) {
    if (!stopped) scheduled.schedule(id);
}

function recoverJobs() {
    stopped = false;
    scheduled.resume();
    db.prepare("UPDATE ai_jobs SET status = 'queued' WHERE status = 'running'").run();
    for (const job of db.prepare("SELECT id FROM ai_jobs WHERE status IN ('queued','retrying') ORDER BY id").all()) schedule(job.id);
    require('./page-imports').recoverPageImports();
}

function cancelJob(id, userId) {
    const job = ownJob(id, userId);
    if (job.status === 'succeeded' && job.apply_status === 'applied') fail(409, '任务结果已填入，无法取消');
    if (job.status !== 'cancelled') {
        db.prepare("UPDATE ai_jobs SET status = 'cancelled', finished_at = ?, next_attempt_at = NULL WHERE id = ?").run(now(), id);
        scheduled.cancel(id);
        controllers.get(id)?.abort();
    }
    return serializeJob(ownJob(id, userId));
}

function retryJob(id, userId) {
    const job = ownJob(id, userId);
    activeMistake(job.mistake_id, userId);
    if (!['failed', 'cancelled'].includes(job.status)) fail(409, '只能重试失败或已取消的任务');
    const config = publicConfig(false, job.type === 'analysis' ? 'analysis' : 'general');
    if (!config.enabled || !config.configured) fail(400, '管理员尚未启用并配置 AI 服务');
    const duplicate = db.prepare("SELECT id FROM ai_jobs WHERE mistake_id = ? AND type = ? AND fingerprint = ? AND status IN ('queued','running','retrying') AND id != ?")
        .get(job.mistake_id, job.type, job.fingerprint, id);
    if (duplicate) fail(409, '相同内容已有任务正在处理，请等待完成');
    db.prepare("UPDATE ai_jobs SET status = 'queued', apply_status = 'pending', result_json = NULL, attempts = 0, error = NULL, started_at = NULL, finished_at = NULL, next_attempt_at = NULL WHERE id = ?").run(id);
    // A cancelled request may still be unwinding. Queue again after its cleanup.
    const resume = () => { if (scheduled.has(id)) setTimeout(resume, 50).unref(); else schedule(id); };
    resume();
    return serializeJob(ownJob(id, userId));
}

function cancelMistakeJobs(ids) {
    for (const id of ids) for (const job of db.prepare("SELECT id, user_id FROM ai_jobs WHERE mistake_id = ? AND status IN ('queued','running','retrying')").all(id)) cancelJob(job.id, job.user_id);
}

async function stopJobs() {
    stopped = true;
    for (const controller of controllers.values()) controller.abort();
    await Promise.all([scheduled.stop(), require('./page-imports').stopPageImports()]);
    if (runtime) {
        const runner = await runtime;
        await Promise.all([runner.queue.onIdle(), runner.adminQueue.onIdle()]);
    }
}

async function pauseJobs() {
    await Promise.all([scheduled.pause(), require('./page-imports').pausePageImports()]);
    if (runtime) {
        const runner = await runtime;
        await Promise.all([runner.queue.onIdle(), runner.adminQueue.onIdle()]);
    }
}

function resumeJobs() {
    recoverJobs();
}

module.exports = { createJob, serializeJob, ownJob, applyJob, retryJob, cancelJob, cancelMistakeJobs, recoverJobs, stopJobs, pauseJobs, resumeJobs, enqueueAutomatic, inputFor, isShortAnswer, analysisNoticeFor, runtimeForJobs, canRetry };

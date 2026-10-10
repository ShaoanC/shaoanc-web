const crypto = require('node:crypto');
const express = require('express');
const { db } = require('./database');
const { generateTestMistakes } = require('./test-data');
const { searchMistakes, updateCachedMistake, removeCachedMistake, invalidateUser, invalidateAll } = require('./search');
const {
    fail, validateCredentials, validatePassword, hashPassword, verifyPassword, publicUser,
    createSession, clearSession, loadSession, requireUser, requireAdmin
} = require('./auth');

const router = express.Router();
const REVIEW_RESULTS = ['unknown', 'familiar', 'mastered'];
const STATUS_NAMES = { unreviewed: '未复习', unknown: '不会', familiar: '不熟', mastered: '掌握' };
const mistakeSelect = `
    SELECT m.*,
        COALESCE((SELECT result FROM reviews WHERE mistake_id = m.id ORDER BY id DESC LIMIT 1), 'unreviewed') AS latest_review_result,
        (SELECT COUNT(*) FROM reviews WHERE mistake_id = m.id) AS reviews_count
    FROM mistakes m
`;
const pointSelect = 'SELECT id, subject_id AS subjectId, parent_id AS parentId, name, sort_order AS sortOrder FROM knowledge_points';

function success(res, data, status = 200) {
    res.status(status).json({ success: true, data });
}

function idNumber(value) {
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id <= 0) {
        fail(400, '无效的编号');
    }
    return id;
}

function serializeMistake(row) {
    return {
        id: row.id,
        subjectId: row.subject_id,
        primaryKnowledgePointId: row.primary_knowledge_point_id,
        auxiliaryKnowledgePointIds: JSON.parse(row.auxiliary_knowledge_point_ids),
        lifecycle: row.lifecycle,
        isTest: Boolean(row.is_test),
        question: row.question,
        answer: row.answer,
        analysis: row.analysis,
        note: row.note,
        latestReviewResult: row.latest_review_result,
        reviewsCount: row.reviews_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function ownMistake(req) {
    const row = db.prepare(`${mistakeSelect} WHERE m.id = ? AND m.user_id = ?`).get(idNumber(req.params.id), req.user.id);
    if (!row) {
        fail(404, '错题不存在');
    }
    return row;
}

function subjectExists(id) {
    return typeof id === 'string' && Boolean(db.prepare('SELECT id FROM subjects WHERE id = ?').get(id));
}

function validateMistake(body, existing) {
    const values = { ...existing, ...body };
    if (!['draft', 'archived'].includes(values.lifecycle)) {
        fail(400, '请选择草稿或归档');
    }
    for (const field of ['question', 'answer', 'analysis', 'note']) {
        if (typeof values[field] !== 'string') {
            fail(400, '错题内容须为文本');
        }
    }
    if (values.subjectId === '') {
        values.subjectId = null;
    }
    if (values.subjectId !== null && !subjectExists(values.subjectId)) {
        fail(400, '请选择有效学科');
    }
    if (values.lifecycle === 'archived' && (!values.question.trim() || !values.subjectId)) {
        fail(400, '归档前请填写题干并选择学科');
    }
    if (values.primaryKnowledgePointId === '') {
        values.primaryKnowledgePointId = null;
    }
    if (values.primaryKnowledgePointId !== null && !Number.isSafeInteger(values.primaryKnowledgePointId)) {
        fail(400, '主知识点编号无效');
    }
    if (!Array.isArray(values.auxiliaryKnowledgePointIds) ||
        values.auxiliaryKnowledgePointIds.some((id) => !Number.isSafeInteger(id))) {
        fail(400, '辅助知识点须为编号列表');
    }
    values.auxiliaryKnowledgePointIds = [...new Set(values.auxiliaryKnowledgePointIds)]
        .filter((id) => id !== values.primaryKnowledgePointId);
    const pointIds = [...values.auxiliaryKnowledgePointIds];
    if (values.primaryKnowledgePointId !== null) {
        pointIds.push(values.primaryKnowledgePointId);
    }
    const pointQuery = db.prepare('SELECT subject_id FROM knowledge_points WHERE id = ?');
    for (const pointId of pointIds) {
        const point = pointQuery.get(pointId);
        if (!point || point.subject_id !== values.subjectId) {
            fail(400, '知识点必须属于所选学科');
        }
    }
    return values;
}

function serializeInvite(row) {
    return {
        id: row.id, code: row.code, maxUses: row.max_uses, usedCount: row.used_count,
        active: Boolean(row.active), expiresAt: row.expires_at, createdAt: row.created_at
    };
}

router.use(loadSession);

router.get('/auth/me', (req, res) => {
    success(res, { user: req.user ? publicUser(req.user) : null });
});

router.post('/auth/register', (req, res) => {
    const { password, inviteCode } = req.body || {};
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    validateCredentials(username, password);
    if (typeof inviteCode !== 'string' || !inviteCode.trim()) {
        fail(400, '请填写邀请码');
    }
    const passwordHash = hashPassword(password);
    const user = db.transaction(() => {
        const now = new Date().toISOString();
        const invite = db.prepare('SELECT * FROM invite_codes WHERE code = ?').get(inviteCode.trim().toUpperCase());
        if (!invite || !invite.active || invite.used_count >= invite.max_uses || (invite.expires_at && invite.expires_at <= now)) {
            fail(400, '邀请码无效、已用完或已过期');
        }
        if (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
            fail(409, '用户名已被使用');
        }
        const inserted = db.prepare('INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)')
            .run(username, passwordHash, now);
        db.prepare('UPDATE invite_codes SET used_count = used_count + 1 WHERE id = ?').run(invite.id);
        return db.prepare('SELECT * FROM users WHERE id = ?').get(inserted.lastInsertRowid);
    })();
    createSession(user.id, res);
    success(res, { user: publicUser(user) }, 201);
});

router.post('/auth/login', (req, res) => {
    const { password } = req.body || {};
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
        fail(401, '用户名或密码错误');
    }
    if (!user.active) {
        fail(403, '账号已停用，请联系管理员');
    }
    clearSession(req, res);
    createSession(user.id, res);
    success(res, { user: publicUser(user) });
});

router.post('/auth/logout', (req, res) => {
    clearSession(req, res);
    success(res, null);
});

router.use(requireUser);

router.patch('/auth/avatar', (req, res) => {
    const { avatar } = req.body || {};
    if (avatar !== null) {
        if (typeof avatar !== 'string' || avatar.length > 350000) {
            fail(400, '头像文件过大，请重新选择图片');
        }
        const match = avatar.match(/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/);
        if (!match) fail(400, '请上传 PNG 或 JPEG 图片');
        const bytes = Buffer.from(match[2], 'base64');
        const valid = match[1] === 'png'
            ? bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
            : bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
        if (!valid) fail(400, '图片格式无效');
    }
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, req.user.id);
    success(res, { user: publicUser({ ...req.user, avatar }) });
});

router.patch('/auth/password', (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!verifyPassword(currentPassword, req.user.password_hash)) {
        fail(400, '当前密码错误');
    }
    validatePassword(newPassword);
    db.transaction(() => {
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), req.user.id);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.user.id);
    })();
    createSession(req.user.id, res);
    success(res, { user: publicUser(req.user) });
});

router.get('/subjects', (req, res) => {
    success(res, db.prepare('SELECT id, name FROM subjects ORDER BY sort_order, id').all());
});

router.get('/knowledge-points', (req, res) => {
    if (req.query.subjectId && !subjectExists(req.query.subjectId)) {
        fail(400, '请选择有效学科');
    }
    const points = req.query.subjectId
        ? db.prepare(`${pointSelect} WHERE subject_id = ? ORDER BY sort_order, id`).all(req.query.subjectId)
        : db.prepare(`${pointSelect} ORDER BY subject_id, sort_order, id`).all();
    success(res, points);
});

function validatePoint(body, existing = {}) {
    const point = { subjectId: null, parentId: null, name: '', sortOrder: 0, ...existing, ...body };
    if (!subjectExists(point.subjectId)) {
        fail(400, '请选择有效学科');
    }
    if (typeof point.name !== 'string' || !point.name.trim() || point.name.length > 100) {
        fail(400, '知识点名称须为 1–100 个字符');
    }
    point.name = point.name.trim();
    if (!Number.isSafeInteger(point.sortOrder)) {
        fail(400, '排序须为整数');
    }
    if (point.parentId === '') {
        point.parentId = null;
    }
    if (point.parentId !== null) {
        const parentId = idNumber(point.parentId);
        const parent = db.prepare(`${pointSelect} WHERE id = ?`).get(parentId);
        if (!parent || parent.subjectId !== point.subjectId) {
            fail(400, '上级知识点须属于同一学科');
        }
        point.parentId = parentId;
        let ancestor = parent;
        while (ancestor) {
            if (ancestor.id === existing.id) {
                fail(400, '上级知识点不能是自身或自己的子节点');
            }
            ancestor = ancestor.parentId ? db.prepare(`${pointSelect} WHERE id = ?`).get(ancestor.parentId) : null;
        }
    }
    if (existing.id && existing.subjectId !== point.subjectId) {
        const referenced = db.prepare(`
            SELECT id FROM mistakes WHERE primary_knowledge_point_id = ? OR
                EXISTS (SELECT 1 FROM json_each(auxiliary_knowledge_point_ids) WHERE value = ?) LIMIT 1
        `).get(existing.id, existing.id);
        if (referenced || db.prepare('SELECT id FROM knowledge_points WHERE parent_id = ? LIMIT 1').get(existing.id)) {
            fail(400, '已被引用或包含子节点的知识点不能更换学科');
        }
    }
    return point;
}

router.post('/knowledge-points', requireAdmin, (req, res) => {
    const point = validatePoint(req.body || {});
    const inserted = db.prepare('INSERT INTO knowledge_points (subject_id, parent_id, name, sort_order) VALUES (?, ?, ?, ?)')
        .run(point.subjectId, point.parentId, point.name, point.sortOrder);
    success(res, db.prepare(`${pointSelect} WHERE id = ?`).get(inserted.lastInsertRowid), 201);
});

router.patch('/knowledge-points/:id', requireAdmin, (req, res) => {
    const id = idNumber(req.params.id);
    const existing = db.prepare(`${pointSelect} WHERE id = ?`).get(id);
    if (!existing) {
        fail(404, '知识点不存在');
    }
    const point = validatePoint(req.body || {}, existing);
    db.prepare('UPDATE knowledge_points SET subject_id = ?, parent_id = ?, name = ?, sort_order = ? WHERE id = ?')
        .run(point.subjectId, point.parentId, point.name, point.sortOrder, id);
    invalidateAll();
    success(res, db.prepare(`${pointSelect} WHERE id = ?`).get(id));
});

router.delete('/knowledge-points/:id', requireAdmin, (req, res) => {
    const id = idNumber(req.params.id);
    if (!db.prepare('SELECT id FROM knowledge_points WHERE id = ?').get(id)) {
        fail(404, '知识点不存在');
    }
    if (db.prepare('SELECT id FROM knowledge_points WHERE parent_id = ? LIMIT 1').get(id)) {
        fail(409, '请先移动或删除该知识点下的子节点');
    }
    db.transaction(() => {
        const now = new Date().toISOString();
        db.prepare('UPDATE mistakes SET primary_knowledge_point_id = NULL, updated_at = ? WHERE primary_knowledge_point_id = ?').run(now, id);
        const referenced = db.prepare(`
            SELECT id, auxiliary_knowledge_point_ids FROM mistakes
            WHERE EXISTS (SELECT 1 FROM json_each(auxiliary_knowledge_point_ids) WHERE value = ?)
        `).all(id);
        for (const mistake of referenced) {
            const points = JSON.parse(mistake.auxiliary_knowledge_point_ids).filter((pointId) => pointId !== id);
            db.prepare('UPDATE mistakes SET auxiliary_knowledge_point_ids = ?, updated_at = ? WHERE id = ?')
                .run(JSON.stringify(points), now, mistake.id);
        }
        db.prepare('DELETE FROM knowledge_points WHERE id = ?').run(id);
    })();
    invalidateAll();
    success(res, null);
});

router.get('/mistakes', (req, res) => {
    const lifecycle = req.query.lifecycle || 'archived';
    if (!['draft', 'archived', 'all'].includes(lifecycle)) {
        fail(400, '无效的错题类型');
    }
    const status = req.query.status;
    if (status && !Object.hasOwn(STATUS_NAMES, status)) {
        fail(400, '无效的复习状态');
    }
    const where = ['m.user_id = ?'];
    const parameters = [req.user.id];
    if (req.query.dataType) {
        if (!['test', 'formal'].includes(req.query.dataType)) {
            fail(400, '无效的数据类型');
        }
        where.push('m.is_test = ?');
        parameters.push(req.query.dataType === 'test' ? 1 : 0);
    }
    if (lifecycle !== 'all') {
        where.push('m.lifecycle = ?');
        parameters.push(lifecycle);
    }
    if (req.query.subjectId) {
        if (!subjectExists(req.query.subjectId)) {
            fail(400, '请选择有效学科');
        }
        where.push('m.subject_id = ?');
        parameters.push(req.query.subjectId);
    }
    if (req.query.knowledgePointId) {
        const pointId = idNumber(req.query.knowledgePointId);
        where.push(`EXISTS (
            WITH RECURSIVE point_tree(id) AS (
                SELECT id FROM knowledge_points WHERE id = ?
                UNION ALL
                SELECT k.id FROM knowledge_points k JOIN point_tree ON k.parent_id = point_tree.id
            )
            SELECT 1 FROM point_tree WHERE point_tree.id = m.primary_knowledge_point_id OR
                EXISTS (SELECT 1 FROM json_each(m.auxiliary_knowledge_point_ids) WHERE value = point_tree.id)
        )`);
        parameters.push(pointId);
    }
    if (status) {
        where.push("COALESCE((SELECT result FROM reviews WHERE mistake_id = m.id ORDER BY id DESC LIMIT 1), 'unreviewed') = ?");
        parameters.push(status);
    }
    if (req.query.keyword !== undefined && typeof req.query.keyword !== 'string') {
        fail(400, '关键词须为文本');
    }
    const rows = db.prepare(`${mistakeSelect} WHERE ${where.join(' AND ')} ORDER BY m.updated_at DESC, m.id DESC`).all(...parameters);
    if (req.query.keyword?.trim()) {
        const matches = searchMistakes(req.user.id, rows, req.query.keyword);
        return success(res, matches.map(({ row, search }) => ({ ...serializeMistake(row), search })));
    }
    success(res, rows.map(serializeMistake));
});

router.post('/mistakes', (req, res) => {
    const values = validateMistake(req.body || {}, {
        subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [],
        lifecycle: 'draft', question: '', answer: '', analysis: '', note: ''
    });
    const now = new Date().toISOString();
    const inserted = db.prepare(`
        INSERT INTO mistakes (user_id, subject_id, primary_knowledge_point_id, auxiliary_knowledge_point_ids,
            lifecycle, question, answer, analysis, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, values.subjectId, values.primaryKnowledgePointId, JSON.stringify(values.auxiliaryKnowledgePointIds),
        values.lifecycle, values.question, values.answer, values.analysis, values.note, now, now);
    const row = db.prepare(`${mistakeSelect} WHERE m.id = ?`).get(inserted.lastInsertRowid);
    updateCachedMistake(req.user.id, row);
    success(res, serializeMistake(row), 201);
});

router.post('/mistakes/test-data', requireAdmin, (req, res) => {
    const count = generateTestMistakes(req.user.id);
    invalidateUser(req.user.id);
    success(res, { count }, 201);
});

router.delete('/mistakes/test-data', requireAdmin, (req, res) => {
    const deleted = db.prepare('DELETE FROM mistakes WHERE user_id = ? AND is_test = 1').run(req.user.id);
    invalidateUser(req.user.id);
    success(res, { count: deleted.changes });
});

router.get('/mistakes/:id', (req, res) => {
    success(res, serializeMistake(ownMistake(req)));
});

router.patch('/mistakes/:id', (req, res) => {
    const row = ownMistake(req);
    const values = validateMistake(req.body || {}, serializeMistake(row));
    db.prepare(`
        UPDATE mistakes SET subject_id = ?, primary_knowledge_point_id = ?, auxiliary_knowledge_point_ids = ?,
            lifecycle = ?, question = ?, answer = ?, analysis = ?, note = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
    `).run(values.subjectId, values.primaryKnowledgePointId, JSON.stringify(values.auxiliaryKnowledgePointIds),
        values.lifecycle, values.question, values.answer, values.analysis, values.note, new Date().toISOString(), row.id, req.user.id);
    const updated = ownMistake(req);
    updateCachedMistake(req.user.id, updated);
    success(res, serializeMistake(updated));
});

router.delete('/mistakes/:id', (req, res) => {
    const row = ownMistake(req);
    db.prepare('DELETE FROM mistakes WHERE id = ? AND user_id = ?').run(row.id, req.user.id);
    removeCachedMistake(req.user.id, row.id);
    success(res, null);
});

router.get('/mistakes/:id/reviews', (req, res) => {
    const row = ownMistake(req);
    success(res, db.prepare('SELECT id, result, created_at AS createdAt FROM reviews WHERE mistake_id = ? ORDER BY id DESC').all(row.id));
});

router.post('/mistakes/:id/reviews', (req, res) => {
    const row = ownMistake(req);
    const { result } = req.body || {};
    if (row.lifecycle !== 'archived') {
        fail(400, '请先归档错题再开始复习');
    }
    if (!REVIEW_RESULTS.includes(result)) {
        fail(400, '请选择有效的复习结果');
    }
    const inserted = db.prepare('INSERT INTO reviews (mistake_id, result, created_at) VALUES (?, ?, ?)')
        .run(row.id, result, new Date().toISOString());
    success(res, db.prepare('SELECT id, result, created_at AS createdAt FROM reviews WHERE id = ?').get(inserted.lastInsertRowid), 201);
});

router.get('/stats', (req, res) => {
    const rows = db.prepare(`${mistakeSelect} WHERE m.user_id = ?`).all(req.user.id);
    const archived = rows.filter((row) => row.lifecycle === 'archived');
    const subjects = db.prepare('SELECT id, name FROM subjects ORDER BY sort_order, id').all();
    const points = db.prepare('SELECT id, name FROM knowledge_points ORDER BY subject_id, sort_order, id').all();
    const byKnowledgePoint = points.map((point) => ({
        ...point, count: archived.filter((row) => row.primary_knowledge_point_id === point.id).length
    })).filter((point) => point.count > 0);
    const unmarkedCount = archived.filter((row) => row.primary_knowledge_point_id === null).length;
    if (unmarkedCount) {
        byKnowledgePoint.push({ id: null, name: '未标注', count: unmarkedCount });
    }
    success(res, {
        total: rows.length,
        archived: archived.length,
        drafts: rows.length - archived.length,
        testCount: rows.filter((row) => row.is_test === 1).length,
        reviewCount: rows.reduce((total, row) => total + row.reviews_count, 0),
        bySubject: subjects.map((subject) => ({ ...subject, count: archived.filter((row) => row.subject_id === subject.id).length })),
        byStatus: Object.entries(STATUS_NAMES).map(([id, name]) => ({ id, name, count: archived.filter((row) => row.latest_review_result === id).length })),
        byKnowledgePoint
    });
});

router.use('/admin', requireAdmin);

router.get('/admin/invites', (req, res) => {
    success(res, db.prepare('SELECT * FROM invite_codes ORDER BY id DESC').all().map(serializeInvite));
});

router.post('/admin/invites', (req, res) => {
    const { maxUses = 1, expiresAt = null } = req.body || {};
    if (maxUses !== 1) {
        fail(400, '每个邀请码仅供一个账号注册');
    }
    let expiration = null;
    if (expiresAt !== null) {
        const parsed = typeof expiresAt === 'string' ? Date.parse(expiresAt) : NaN;
        if (!Number.isFinite(parsed) || parsed <= Date.now()) {
            fail(400, '过期时间须晚于当前时间');
        }
        expiration = new Date(parsed).toISOString();
    }
    const code = crypto.randomBytes(8).toString('hex').toUpperCase();
    const inserted = db.prepare('INSERT INTO invite_codes (code, max_uses, expires_at, created_by, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(code, maxUses, expiration, req.user.id, new Date().toISOString());
    success(res, serializeInvite(db.prepare('SELECT * FROM invite_codes WHERE id = ?').get(inserted.lastInsertRowid)), 201);
});

router.get('/admin/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all();
    success(res, users.map((user) => ({ ...publicUser(user), createdAt: user.created_at })));
});

router.patch('/admin/users/:id', (req, res) => {
    const id = idNumber(req.params.id);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
        fail(404, '用户不存在');
    }
    const { active = Boolean(user.active), password } = req.body || {};
    if (typeof active !== 'boolean') {
        fail(400, '账号状态须为布尔值');
    }
    if (!active && user.role === 'admin') {
        const adminCount = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND active = 1").get().count;
        if (id === req.user.id || (user.active && adminCount <= 1)) {
            fail(400, '不能停用当前管理员或最后一个有效管理员');
        }
    }
    if (password !== undefined) {
        validatePassword(password);
    }
    db.transaction(() => {
        db.prepare('UPDATE users SET active = ?, password_hash = ? WHERE id = ?')
            .run(active ? 1 : 0, password === undefined ? user.password_hash : hashPassword(password), id);
        if (!active || password !== undefined) {
            db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id);
        }
    })();
    if (id === req.user.id && password !== undefined) {
        createSession(id, res);
    }
    success(res, publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id)));
});

module.exports = router;

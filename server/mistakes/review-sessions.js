const { randomUUID } = require('node:crypto');
const { db } = require('./database');
const { fail } = require('./auth');

const reviewResults = ['unknown', 'familiar', 'mastered'];
const insertResult = db.prepare('INSERT INTO reviews (mistake_id, result, created_at) VALUES (?, ?, ?) RETURNING id, result, created_at AS createdAt');

function insertReview(mistakeId, result) {
    if (!reviewResults.includes(result)) fail(400, '请选择有效的复习结果');
    return insertResult.get(mistakeId, result, new Date().toISOString());
}

function mountReviewSessions(router, { mistakeSelect, serializeMistake, success }) {
    const findSession = db.prepare('SELECT * FROM review_sessions WHERE user_id = ?');
    const createSession = db.prepare(`INSERT OR REPLACE INTO review_sessions (user_id, id, mistake_ids)
        VALUES (?, ?, ?)`);
    const updateSession = db.prepare(`UPDATE review_sessions SET position = ?, results = ?, revealed = ?,
        finished = ?, revision = revision + 1 WHERE user_id = ?`);
    const eligible = "m.user_id = ? AND m.lifecycle = 'archived' AND m.deleted_at IS NULL";
    const selectQueue = db.prepare(`SELECT m.id FROM mistakes m JOIN json_each(?) AS q ON q.value = m.id
        WHERE ${eligible} ORDER BY q.key`);
    const selectQuestion = db.prepare(`${mistakeSelect} JOIN json_each(?) AS q ON q.value = m.id
        WHERE ${eligible} AND q.key >= ? ORDER BY q.key LIMIT 1`);

    function checkpoint(row) {
        if (!row) return null;
        const ids = JSON.parse(row.mistake_ids);
        const results = JSON.parse(row.results);
        const question = row.finished ? null : selectQuestion.get(row.mistake_ids, row.user_id, row.position);
        const position = row.finished ? row.position : question ? ids.indexOf(question.id, row.position) : ids.length;
        return {
            id: row.id,
            revision: row.revision,
            step: position,
            total: ids.length,
            results,
            revealed: Boolean(question && position === row.position && row.revealed),
            question: question ? serializeMistake(question) : null
        };
    }

    const start = db.transaction((userId, ids) => {
        const current = checkpoint(findSession.get(userId));
        if (current?.question) return current;
        const selected = selectQueue.all(JSON.stringify([...new Set(ids)]), userId).map(({ id }) => id);
        if (!selected.length) fail(400, '请选择已归档的错题');
        createSession.run(userId, randomUUID(), JSON.stringify(selected));
        return checkpoint(findSession.get(userId));
    });

    const change = db.transaction((userId, { id, revision, mistakeId, action, result }) => {
        const row = findSession.get(userId);
        const current = checkpoint(row);
        if (!current?.question || current.id !== id || current.revision !== revision || current.question.id !== mistakeId) {
            return { session: current, applied: false };
        }
        let { step, results, revealed } = current;
        if (action === 'reveal' || action === 'hide') {
            revealed = action === 'reveal';
        } else if (action === 'rate' || action === 'skip') {
            if (action === 'rate') {
                insertReview(mistakeId, result);
                results.push(result);
            }
            step += 1;
            revealed = false;
        }
        const finished = action === 'finish' || !selectQuestion.get(row.mistake_ids, userId, step);
        if (finished && action !== 'finish') step = current.total;
        updateSession.run(step, JSON.stringify(results), Number(revealed), Number(finished), userId);
        return { session: checkpoint(findSession.get(userId)), applied: true };
    });

    router.get('/review-session', (req, res) => {
        const current = checkpoint(findSession.get(req.user.id));
        res.set('Cache-Control', 'no-store');
        success(res, current && (current.question || current.id === req.query.id) ? current : null);
    });

    router.post('/review-session', (req, res) => {
        const { mistakeIds } = req.body || {};
        if (!Array.isArray(mistakeIds) || !mistakeIds.length || mistakeIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
            fail(400, '请选择要复习的错题');
        }
        success(res, start.immediate(req.user.id, mistakeIds));
    });

    router.patch('/review-session', (req, res) => {
        const body = req.body || {};
        if (typeof body.id !== 'string' || !Number.isSafeInteger(body.revision) || !Number.isSafeInteger(body.mistakeId) ||
            !['reveal', 'hide', 'rate', 'skip', 'finish'].includes(body.action)) {
            fail(400, '无效的复习操作');
        }
        success(res, change.immediate(req.user.id, body));
    });
}

module.exports = { mountReviewSessions, insertReview };

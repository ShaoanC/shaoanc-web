const { db } = require('./database');
const { fail, requireAdmin } = require('./auth');
const { uploadImages, saveImages, serializeImage, uploadsDirectory } = require('./images');
const { publicConfig, saveConfig, aiClient, safeAiError } = require('./ai-config');
const { createJob, serializeJob, ownJob, applyJob, retryJob, cancelJob } = require('./ai');

module.exports = function mountAiRoutes(router, { success, ownMistake, serializeMistake, cleanupExpiredTrash }) {
    router.get('/ai/config', (req, res) => { res.set('Cache-Control', 'no-store'); success(res, publicConfig()); });
    router.get('/admin/ai/config', requireAdmin, (req, res) => { res.set('Cache-Control', 'no-store'); success(res, publicConfig(true)); });
    router.patch('/admin/ai/config', requireAdmin, (req, res) => { res.set('Cache-Control', 'no-store'); success(res, saveConfig(req.body || {})); });
    router.post('/admin/ai/test', requireAdmin, async (req, res) => {
        try {
            const { client, config } = aiClient();
            await client.chat.completions.create({ model: config.model, messages: [{ role: 'user', content: '请回复：连接成功。' }] });
            success(res, { message: 'AI 连接成功，可上传题目进行图片识别。' });
        } catch (error) {
            res.status(400).json({ success: false, message: safeAiError(error) });
        }
    });
    router.get('/mistakes/:id/images', (req, res) => {
        const row = ownMistake(req, true);
        success(res, db.prepare('SELECT * FROM mistake_images WHERE mistake_id = ? ORDER BY id').all(row.id).map(serializeImage));
    });
    router.post('/mistakes/:id/images', (req, res, next) => { req.mistake = ownMistake(req); next(); }, uploadImages, (req, res) => {
        // The record may have been deleted while the upload was in flight.
        success(res, saveImages(req, ownMistake(req)), 201);
    });
    router.get('/images/:id/:variant', (req, res) => {
        cleanupExpiredTrash(Date.now(), req.user.id);
        const image = db.prepare('SELECT * FROM mistake_images WHERE id = ? AND user_id = ?').get(Number(req.params.id), req.user.id);
        if (!image || !['original', 'crop'].includes(req.params.variant)) fail(404, '图片不存在');
        res.set('Cache-Control', 'private, no-store');
        res.type('jpeg').sendFile(image[`${req.params.variant}_path`], { root: uploadsDirectory });
    });
    router.get('/ai/jobs', (req, res) => {
        const rows = req.query.mistakeId
            ? db.prepare('SELECT * FROM ai_jobs WHERE user_id = ? AND mistake_id = ? ORDER BY id DESC').all(req.user.id, Number(req.query.mistakeId))
            : db.prepare("SELECT * FROM ai_jobs WHERE user_id = ? AND (status IN ('queued','running','retrying') OR id IN (SELECT id FROM ai_jobs WHERE user_id = ? ORDER BY id DESC LIMIT 200)) ORDER BY id DESC").all(req.user.id, req.user.id);
        res.set('Cache-Control', 'no-store');
        success(res, rows.map(serializeJob));
    });
    router.post('/ai/jobs', (req, res) => success(res, createJob(req.user.id, req.body || {}), 201));
    router.get('/ai/jobs/:id', (req, res) => success(res, serializeJob(ownJob(req.params.id, req.user.id))));
    router.post('/ai/jobs/:id/retry', (req, res) => success(res, retryJob(Number(req.params.id), req.user.id)));
    router.post('/ai/jobs/:id/cancel', (req, res) => success(res, cancelJob(Number(req.params.id), req.user.id)));
    router.post('/ai/jobs/:id/apply', (req, res) => {
        const id = Number(req.params.id);
        const body = req.body || {};
        if (body.mode !== undefined && !['replace', 'append'].includes(body.mode)) fail(400, '无效的填入方式');
        applyJob(id, req.user.id, { force: body.force === true, mode: body.mode });
        const job = ownJob(id, req.user.id);
        req.params.id = String(job.mistake_id);
        success(res, { job: serializeJob(job), mistake: serializeMistake(ownMistake(req)) });
    });
};

const { db } = require('./database');
const { fail, requireAdmin } = require('./auth');
const { uploadImages, saveImages, serializeImage, uploadsDirectory } = require('./images');
const { publicConfig, saveConfig, safeAiError } = require('./ai-config');
const { testVision } = require('./ai-vision-test');
const { createJob, serializeJob, ownJob, applyJob, retryJob, cancelJob } = require('./ai');

module.exports = function mountAiRoutes(router, { success, ownMistake, serializeMistake, cleanupExpiredTrash }) {
    require('./page-imports').mountPageImportRoutes(router, { success });
    router.get('/ai/config', (req, res) => { res.set('Cache-Control', 'no-store'); success(res, publicConfig(false, req.query.profile || 'general')); });
    router.get('/admin/ai/config', requireAdmin, (req, res) => { res.set('Cache-Control', 'no-store'); success(res, publicConfig(true, req.query.profile || 'general')); });
    router.patch('/admin/ai/config', requireAdmin, (req, res) => { res.set('Cache-Control', 'no-store'); success(res, saveConfig(req.body || {}, req.query.profile || 'general')); });
    router.post('/admin/ai/test', requireAdmin, async (req, res) => {
        try {
            success(res, await testVision(req.query.profile || 'general'));
        } catch (error) {
            res.status(400).json({ success: false, message: safeAiError(error) });
        }
    });
    router.get('/photos', (req, res) => {
        cleanupExpiredTrash(Date.now(), req.user.id);
        res.set('Cache-Control', 'no-store');
        const images = db.prepare(`SELECT i.* FROM mistake_images i JOIN mistakes m ON m.id = i.mistake_id
            WHERE i.user_id = ? AND m.deleted_at IS NULL AND i.source_image_id IS NULL AND i.page_import_id IS NULL`).all(req.user.id)
            .map((image) => ({ key: `image-${image.id}`, ...serializeImage(image) }));
        const pages = db.prepare('SELECT * FROM page_imports WHERE user_id = ? AND deleted_at IS NULL').all(req.user.id)
            .map((page) => ({ key: `page-${page.id}`, mistakeId: null, purpose: null, originalName: page.original_name,
                originalUrl: `/api/mistakes/page-imports/${page.id}/image`, createdAt: page.created_at }));
        success(res, [...images, ...pages].sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.key.localeCompare(left.key)));
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
        const select = 'SELECT j.*, m.deleted_at AS mistake_deleted_at FROM ai_jobs j JOIN mistakes m ON m.id = j.mistake_id';
        const rows = req.query.mistakeId
            ? db.prepare(`${select} WHERE j.user_id = ? AND j.mistake_id = ? ORDER BY j.id DESC`).all(req.user.id, Number(req.query.mistakeId))
            : db.prepare(`${select} WHERE j.user_id = ? AND ((m.deleted_at IS NULL AND (j.status IN ('queued','running','retrying','failed') OR (j.status = 'succeeded' AND j.apply_status != 'applied'))) OR j.id IN (SELECT id FROM ai_jobs WHERE user_id = ? ORDER BY id DESC LIMIT 200)) ORDER BY j.id DESC`).all(req.user.id, req.user.id);
        res.set('Cache-Control', 'no-store');
        success(res, rows.map(serializeJob));
    });
    router.post('/ai/jobs', (req, res) => success(res, createJob(req.user.id, req.body || {}), 201));
    router.post('/ai/jobs/batch', (req, res) => {
        const { action, ids } = req.body || {};
        if (!['retry', 'cancel'].includes(action) || !Array.isArray(ids) || !ids.length || ids.length > 50
            || ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) fail(400, '请选择 1–50 个任务及有效操作');
        const jobs = [];
        const errors = [];
        for (const id of new Set(ids)) {
            try { jobs.push(action === 'retry' ? retryJob(id, req.user.id) : cancelJob(id, req.user.id)); }
            catch (error) {
                if (!error.status || error.status >= 500) throw error;
                errors.push({ id, message: error.message });
            }
        }
        success(res, { jobs, errors });
    });
    router.get('/ai/jobs/:id', (req, res) => success(res, serializeJob(ownJob(req.params.id, req.user.id))));
    router.post('/ai/jobs/:id/retry', (req, res) => success(res, retryJob(Number(req.params.id), req.user.id)));
    router.post('/ai/jobs/:id/cancel', (req, res) => success(res, cancelJob(Number(req.params.id), req.user.id)));
    router.post('/ai/jobs/:id/apply', (req, res) => {
        const id = Number(req.params.id);
        const body = req.body || {};
        if (body.mode !== undefined && !['replace', 'append'].includes(body.mode)) fail(400, '无效的填入方式');
        applyJob(id, req.user.id, { force: body.force === true, mode: body.mode, review: body.review, expectedInput: body.expectedInput });
        const job = ownJob(id, req.user.id);
        req.params.id = String(job.mistake_id);
        success(res, { job: serializeJob(job), mistake: serializeMistake(ownMistake(req)) });
    });
};

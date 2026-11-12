const fs = require('node:fs');
const sharp = require('sharp');
const { db } = require('./database');
const { fail } = require('./auth');
const { assertWritable } = require('./backup-coordination');
const { imagePath, saveImages, serializeImage } = require('./images');

// Bound retained previews and concurrent decoding across users.
const previews = new Map();
const pending = new Map();
let active = 0;
const waiting = [];
async function processImage(work) {
    if (active >= 2) await new Promise((resolve) => waiting.push(resolve));
    active += 1;
    try { return await work(); }
    finally { active -= 1; waiting.shift()?.(); }
}
function source(key, userId) {
    const match = /^(image|page)-(\d+)$/.exec(key || '');
    if (!match) fail(400, '图片编号无效');
    const row = match[1] === 'image'
        ? db.prepare(`SELECT i.original_path AS filename, i.original_name FROM mistake_images i JOIN mistakes m ON m.id = i.mistake_id
            WHERE i.id = ? AND i.user_id = ? AND m.deleted_at IS NULL AND i.reference_only = 0`).get(Number(match[2]), userId)
        : db.prepare('SELECT image_path AS filename, original_name FROM page_imports WHERE id = ? AND user_id = ? AND deleted_at IS NULL').get(Number(match[2]), userId);
    if (!row?.filename) fail(404, '图片不存在');
    return row;
}
function parseCursor(value) {
    if (!value) return null;
    let cursor;
    try { cursor = JSON.parse(Buffer.from(String(value), 'base64url').toString()); } catch { fail(400, '分页参数无效'); }
    if (!Array.isArray(cursor) || cursor.length !== 2 || cursor.some((part) => typeof part !== 'string' || part.length > 100)) fail(400, '分页参数无效');
    return cursor;
}
module.exports = function mount(router, { success, ownMistake }) {
    router.get('/photo-library', (req, res) => {
        const cursor = parseCursor(req.query.cursor);
        const rows = db.prepare(`SELECT * FROM (
            SELECT 'image-' || i.id AS key, i.original_name AS originalName, i.created_at AS createdAt, i.purpose, i.mistake_id AS mistakeId,
            '/api/mistakes/images/' || i.id || '/original' AS originalUrl
            FROM mistake_images i JOIN mistakes m ON m.id = i.mistake_id WHERE i.user_id = ? AND m.deleted_at IS NULL
                AND i.source_image_id IS NULL AND i.page_import_id IS NULL AND i.reference_only = 0 AND i.original_path <> '' AND i.crop_path <> ''
            UNION ALL SELECT 'page-' || id, original_name, created_at, NULL, NULL, '/api/mistakes/page-imports/' || id || '/image'
            FROM page_imports WHERE user_id = ? AND deleted_at IS NULL
        ) WHERE (? IS NULL OR (createdAt, key) < (?, ?)) ORDER BY createdAt DESC, key DESC LIMIT 25`)
            .all(req.user.id, req.user.id, cursor?.[0] ?? null, cursor?.[0] ?? null, cursor?.[1] ?? null);
        res.set('Cache-Control', 'no-store');
        success(res, { items: rows.slice(0, 24), nextCursor: rows.length > 24
            ? Buffer.from(JSON.stringify([rows[23].createdAt, rows[23].key])).toString('base64url') : null });
    });
    router.get('/photo-library/:key/:size', async (req, res) => {
        const row = source(req.params.key, req.user.id);
        const size = req.params.size === 'thumb' ? 400 : req.params.size === 'preview' ? 1600 : 0;
        if (!size) fail(404, '图片不存在');
        let stat;
        try { stat = await fs.promises.stat(imagePath(row.filename)); } catch (error) { if (error.code === 'ENOENT') fail(404, '图片不存在'); throw error; }
        const key = `${row.filename}:${stat.mtimeMs}:${size}`;
        let buffer = previews.get(key);
        if (!buffer) {
            if (!pending.has(key)) pending.set(key, processImage(() => sharp(imagePath(row.filename)).rotate()
                .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer())
                .then((result) => {
                    previews.set(key, result);
                    while (previews.size > 64) previews.delete(previews.keys().next().value);
                    return result;
                }).finally(() => pending.delete(key)));
            buffer = await pending.get(key);
        } else { previews.delete(key); previews.set(key, buffer); }
        source(req.params.key, req.user.id);
        res.set('Cache-Control', 'private, no-cache');
        res.type('jpeg').send(buffer);
    });
    router.post('/mistakes/:id/reuse-photo', async (req, res) => {
        assertWritable(); ownMistake(req);
        const { key, crop, rotation, purpose, clientId } = req.body || {};
        if (!['question', 'answer'].includes(purpose) || typeof clientId !== 'string' || !clientId.trim() || clientId.length > 100) fail(400, '图片参数无效');
        const previous = db.prepare('SELECT * FROM mistake_images WHERE mistake_id = ? AND user_id = ? AND client_id = ?').get(Number(req.params.id), req.user.id, clientId);
        if (previous) {
            if (previous.purpose !== purpose || previous.source_image_id !== null) fail(409, '上传编号已使用');
            return success(res, serializeImage(previous));
        }
        if (!crop || !['x', 'y', 'width', 'height'].every((field) => Number.isFinite(crop[field])) || crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0
            || crop.x + crop.width > 100.001 || crop.y + crop.height > 100.001 || !Number.isInteger(rotation) || rotation < 0 || rotation > 3) fail(400, '裁剪范围无效');
        const row = source(key, req.user.id);
        const files = await processImage(async () => {
            const original = await sharp(imagePath(row.filename)).autoOrient().rotate(rotation * 90).jpeg({ quality: 94 }).toBuffer();
            const meta = await sharp(original).metadata();
            const left = Math.min(meta.width - 1, Math.floor(meta.width * crop.x / 100));
            const top = Math.min(meta.height - 1, Math.floor(meta.height * crop.y / 100));
            const buffer = await sharp(original).extract({ left, top,
                width: Math.max(1, Math.min(meta.width - left, Math.round(meta.width * crop.width / 100))),
                height: Math.max(1, Math.min(meta.height - top, Math.round(meta.height * crop.height / 100))) })
                .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
            return { original: [{ buffer: original, originalname: row.original_name }], crop: [{ buffer }] };
        });
        // Revalidate after async processing; saveImages also deduplicates concurrent retries.
        assertWritable(); source(key, req.user.id);
        req.body = { purpose, clientId };
        req.files = files;
        success(res, saveImages(req, ownMistake(req)), 201);
    });
};

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');
const { db } = require('./database');
const { fail } = require('./auth');
const { questionWithImages } = require('./question-images');

const uploadsDirectory = path.resolve(process.env.MISTAKES_UPLOADS_PATH || path.join(__dirname, '..', '..', 'uploads', 'mistakes'));
const multipart = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024, files: 2, fields: 3, fieldSize: 256 },
    fileFilter(req, file, done) {
        if (file.mimetype !== 'image/jpeg') return done(Object.assign(new Error('请在客户端压缩为 JPEG 后上传'), { status: 400 }));
        done(null, true);
    }
}).fields([{ name: 'original', maxCount: 1 }, { name: 'crop', maxCount: 1 }]);

function uploadImages(req, res, next) {
    multipart(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            error.status = 400;
            error.message = error.code === 'LIMIT_FILE_SIZE' ? '单张图片不可超过 4MB，请重新压缩' : '图片上传格式不正确，请重新选择';
        }
        next(error);
    });
}

function serializeImage(row) {
    return {
        id: row.id, mistakeId: row.mistake_id, purpose: row.purpose, sourceImageId: row.source_image_id, originalName: row.original_name,
        originalUrl: row.original_path ? `/api/mistakes/images/${row.id}/original` : null,
        cropUrl: row.crop_path ? `/api/mistakes/images/${row.id}/crop` : null,
        sourceAvailable: !row.reference_only && Boolean(row.original_path && row.crop_path), createdAt: row.created_at
    };
}

function imagePath(filename) {
    return path.join(uploadsDirectory, path.basename(filename));
}

function questionForMistake(row) {
    if (!row.question.includes('![')) return row.question;
    const imageIds = db.prepare("SELECT id FROM mistake_images WHERE mistake_id = ? AND user_id = ? AND purpose = 'question'")
        .all(row.id, row.user_id).map((image) => image.id);
    return imageIds.length ? questionWithImages(row.question, imageIds) : row.question;
}

function saveImages(req, mistake) {
    const { purpose, clientId } = req.body || {};
    if (!['question', 'answer'].includes(purpose) || typeof clientId !== 'string' || !clientId.trim() || clientId.length > 100) {
        fail(400, '请选择图片用途并提供上传编号');
    }
    const sourceImageId = req.body.sourceImageId === undefined || req.body.sourceImageId === '' ? null : Number(req.body.sourceImageId);
    if (sourceImageId !== null) {
        if (!Number.isSafeInteger(sourceImageId) || !db.prepare('SELECT id FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?')
            .get(sourceImageId, mistake.id, req.user.id)) fail(400, '配图来源必须是当前用户、当前错题的图片');
    }
    const previous = db.prepare('SELECT * FROM mistake_images WHERE mistake_id = ? AND client_id = ? AND user_id = ?').get(mistake.id, clientId, req.user.id);
    if (previous) {
        if (previous.purpose !== purpose || previous.source_image_id !== sourceImageId) fail(409, '上传编号已用于其他图片，请重新上传');
        return serializeImage(previous);
    }
    const original = req.files?.original?.[0];
    const crop = req.files?.crop?.[0];
    for (const image of [original, crop]) {
        if (!image || image.buffer.length < 4 || image.buffer[0] !== 0xff || image.buffer[1] !== 0xd8 || image.buffer[2] !== 0xff) {
            fail(400, '请上传有效的 JPEG 整图及裁剪图');
        }
    }
    fs.mkdirSync(uploadsDirectory, { recursive: true });
    const key = crypto.randomUUID();
    const originalPath = `${key}-original.jpg`;
    const cropPath = `${key}-crop.jpg`;
    try {
        fs.writeFileSync(imagePath(originalPath), original.buffer, { flag: 'wx' });
        fs.writeFileSync(imagePath(cropPath), crop.buffer, { flag: 'wx' });
        const inserted = db.prepare(`INSERT INTO mistake_images
            (mistake_id, user_id, purpose, client_id, original_name, original_path, crop_path, source_image_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(mistake.id, req.user.id, purpose, clientId, path.basename(original.originalname), originalPath, cropPath, sourceImageId, new Date().toISOString());
        return serializeImage(db.prepare('SELECT * FROM mistake_images WHERE id = ?').get(inserted.lastInsertRowid));
    } catch (error) {
        fs.rmSync(imagePath(originalPath), { force: true });
        fs.rmSync(imagePath(cropPath), { force: true });
        throw error;
    }
}

function deleteMistakeFiles(mistakeIds) {
    const query = db.prepare('SELECT original_path, crop_path, page_import_id, reference_only FROM mistake_images WHERE mistake_id = ?');
    const deleting = new Set(mistakeIds);
    const references = db.prepare('SELECT mistake_id FROM mistake_images WHERE original_path = ? OR crop_path = ?');
    function removeFile(filename, referenceOnly) {
        if (!filename) return;
        if (referenceOnly && references.all(filename, filename).some((row) => !deleting.has(row.mistake_id))) return;
        fs.rmSync(imagePath(filename), { force: true });
    }
    const sourcePages = new Set();
    const removedRegions = new Map();
    for (const id of mistakeIds) {
        for (const item of db.prepare('SELECT page_import_id, region_id, crop_path FROM page_import_items WHERE mistake_id = ?').all(id)) {
            sourcePages.add(item.page_import_id);
            if (!removedRegions.has(item.page_import_id)) removedRegions.set(item.page_import_id, new Set());
            removedRegions.get(item.page_import_id).add(item.region_id);
            if (item.crop_path) fs.rmSync(imagePath(item.crop_path), { force: true });
        }
        for (const row of query.all(id)) {
            if (row.page_import_id) sourcePages.add(row.page_import_id);
            else removeFile(row.original_path, row.reference_only);
            if (!row.page_import_id || row.crop_path !== row.original_path) removeFile(row.crop_path, row.reference_only);
        }
    }
    for (const pageId of sourcePages) {
        const page = db.prepare('SELECT image_path, deleted_at FROM page_imports WHERE id = ?').get(pageId);
        const referenced = db.prepare(`SELECT mistake_id FROM mistake_images WHERE page_import_id = ?
            UNION SELECT mistake_id FROM page_import_items WHERE page_import_id = ? AND mistake_id IS NOT NULL`).all(pageId, pageId);
        if (page?.deleted_at && referenced.every((row) => deleting.has(row.mistake_id))) fs.rmSync(imagePath(page.image_path), { force: true });
    }
    db.transaction(() => {
        for (const id of mistakeIds) db.prepare('DELETE FROM page_import_items WHERE mistake_id = ?').run(id);
        for (const [pageId, regionIds] of removedRegions) {
            const page = db.prepare('SELECT regions_json FROM page_imports WHERE id = ?').get(pageId);
            if (!page) continue;
            const regions = JSON.parse(page.regions_json).map((region) => {
                if (!regionIds.has(region.id)) return region;
                const { mistakeId, jobId, status, applyStatus, error, mistakeDeleted, ...box } = region;
                return { ...box, selected: false };
            });
            db.prepare('UPDATE page_imports SET regions_json = ? WHERE id = ?').run(JSON.stringify(regions), pageId);
        }
    })();
}

module.exports = { uploadImages, serializeImage, saveImages, imagePath, questionForMistake, deleteMistakeFiles, uploadsDirectory };

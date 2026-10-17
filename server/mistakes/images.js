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
        originalUrl: `/api/mistakes/images/${row.id}/original`, cropUrl: `/api/mistakes/images/${row.id}/crop`, createdAt: row.created_at
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
        if (!Number.isSafeInteger(sourceImageId) || purpose !== 'question' || !db.prepare('SELECT id FROM mistake_images WHERE id = ? AND mistake_id = ? AND user_id = ?')
            .get(sourceImageId, mistake.id, req.user.id)) fail(400, '配图来源必须是当前错题的图片，派生配图须用于题干');
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
    const query = db.prepare('SELECT original_path, crop_path FROM mistake_images WHERE mistake_id = ?');
    for (const id of mistakeIds) {
        for (const row of query.all(id)) {
            fs.rmSync(imagePath(row.original_path), { force: true });
            fs.rmSync(imagePath(row.crop_path), { force: true });
        }
    }
}

module.exports = { uploadImages, serializeImage, saveImages, imagePath, questionForMistake, deleteMistakeFiles, uploadsDirectory };

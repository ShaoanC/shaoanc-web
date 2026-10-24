const path = require('node:path');
const Database = require('better-sqlite3');
const { questionWithImages, markdownImages } = require('./question-images');

// This connection must point at the disposable backup snapshot, never the live database.
function retainReferencedImages(filename) {
    const db = new Database(filename, { fileMustExist: true });
    try {
        db.pragma('foreign_keys = ON');
        db.pragma('journal_mode = DELETE');
        if (!db.prepare('PRAGMA table_info(mistake_images)').all().some((column) => column.name === 'reference_only')) {
            db.exec('ALTER TABLE mistake_images ADD COLUMN reference_only INTEGER NOT NULL DEFAULT 0');
        }
        const images = db.prepare('SELECT * FROM mistake_images').all();
        const byId = new Map(images.map((image) => [image.id, image]));
        const byMistake = new Map();
        for (const image of images) {
            if (!byMistake.has(image.mistake_id)) byMistake.set(image.mistake_id, []);
            byMistake.get(image.mistake_id).push(image);
        }
        const retained = new Map();
        const files = new Set();
        for (const mistake of db.prepare('SELECT id, user_id, question, answer FROM mistakes').iterate()) {
            const questionIds = (byMistake.get(mistake.id) || [])
                .filter((image) => image.user_id === mistake.user_id && image.purpose === 'question').map((image) => image.id);
            const question = questionWithImages(mistake.question, questionIds);
            const questionReferences = markdownImages(question).map((reference) => /^\d+$/.test(reference.url)
                ? { ...reference, imageId: Number(reference.url), variant: 'crop' } : reference);
            for (const reference of [...questionReferences, ...markdownImages(mistake.answer)]) {
                if (reference.imageId === null) continue;
                const image = byId.get(reference.imageId);
                if (!image || image.mistake_id !== mistake.id || image.user_id !== mistake.user_id) {
                    throw new Error(`错题 ${mistake.id} 的正文配图 ${reference.imageId} 不存在或不属于当前错题，无法备份`);
                }
                const imageFilename = image[`${reference.variant}_path`];
                if (!imageFilename || path.basename(imageFilename) !== imageFilename || /[\\/:\0]/.test(imageFilename) || imageFilename === '.' || imageFilename === '..') {
                    throw new Error(`错题 ${mistake.id} 的正文配图 ${image.id}/${reference.variant} 文件路径无效，无法备份`);
                }
                if (!retained.has(image.id)) retained.set(image.id, new Set());
                retained.get(image.id).add(reference.variant);
                files.add(imageFilename);
            }
        }

        function available(imageId, variant, owner) {
            const image = byId.get(imageId);
            return Boolean(image && image.mistake_id === owner.mistake_id && image.user_id === owner.user_id && retained.get(imageId)?.has(variant));
        }
        function markdownAvailable(markdown, owner) {
            return markdownImages(markdown || '').every((reference) => reference.imageId === null || available(reference.imageId, reference.variant, owner));
        }
        function jobAvailable(job) {
            const source = JSON.parse(job.source_json || '{}');
            // Recognition history is tied to uploaded/cropped source photos and cannot
            // safely offer review, recropping or retry after those sources are removed.
            if (job.type !== 'analysis' || job.mode === 'page-entry' || source.pageImportId) return false;
            const input = JSON.parse(job.input_json);
            if (!markdownAvailable(input.question, job) || !markdownAvailable(input.answer, job)) return false;
            if (job.result_json) {
                const result = JSON.parse(job.result_json);
                for (const field of ['question', 'answer', 'analysis']) {
                    if (!markdownAvailable(result[field], job)) return false;
                }
            }
            return true;
        }

        db.transaction(() => {
            // Remove source-dependent jobs and their idempotency keys together. Remaining analysis
            // jobs can still use their historical text input and the final image variants.
            const removeRequests = db.prepare('DELETE FROM ai_job_requests WHERE job_id = ?');
            const removeJob = db.prepare('DELETE FROM ai_jobs WHERE id = ?');
            for (const job of db.prepare('SELECT * FROM ai_jobs').all()) {
                if (!jobAvailable(job)) {
                    removeRequests.run(job.id);
                    removeJob.run(job.id);
                }
            }
            db.prepare('UPDATE mistake_images SET source_image_id = NULL, page_import_id = NULL').run();
            db.prepare('DELETE FROM page_import_items').run();
            db.prepare('DELETE FROM page_imports').run();
            const removeImage = db.prepare('DELETE FROM mistake_images WHERE id = ?');
            const updateImage = db.prepare('UPDATE mistake_images SET original_path = ?, crop_path = ?, reference_only = 1 WHERE id = ?');
            for (const image of images) {
                const variants = retained.get(image.id);
                if (!variants) removeImage.run(image.id);
                else updateImage.run(variants.has('original') ? image.original_path : '', variants.has('crop') ? image.crop_path : '', image.id);
            }
        })();
        return files;
    } finally { db.close(); }
}

module.exports = { retainReferencedImages };

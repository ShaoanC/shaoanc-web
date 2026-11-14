const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const { ZipFile } = require('yazl');
const { db } = require('./database');
const { publicUser, fail } = require('./auth');
const { uploadsDirectory, questionForMistake } = require('./images');
const { markdownImages } = require('./question-images');

const exporting = new Set();

function collectPersonalData(user) {
    return db.transaction(() => ({
        formatVersion: 1,
        exportedAt: new Date().toISOString(),
        account: { ...publicUser(user), createdAt: user.created_at },
        subjects: db.prepare('SELECT * FROM subjects').all(),
        knowledgePoints: db.prepare('SELECT * FROM knowledge_points WHERE owner_user_id IS NULL OR owner_user_id = ?').all(user.id),
        mistakes: db.prepare('SELECT * FROM mistakes WHERE user_id = ? ORDER BY id').all(user.id)
            .map((row) => ({ ...row, question: questionForMistake(row) })),
        reviews: db.prepare('SELECT r.* FROM reviews r JOIN mistakes m ON m.id = r.mistake_id WHERE m.user_id = ?').all(user.id),
        images: db.prepare('SELECT i.* FROM mistake_images i JOIN mistakes m ON m.id = i.mistake_id WHERE i.user_id = ? AND m.user_id = ?').all(user.id, user.id),
        pageImports: db.prepare('SELECT * FROM page_imports WHERE user_id = ?').all(user.id),
        pageItems: db.prepare('SELECT i.* FROM page_import_items i JOIN page_imports p ON p.id = i.page_import_id WHERE p.user_id = ?').all(user.id),
        aiJobs: db.prepare('SELECT j.* FROM ai_jobs j JOIN mistakes m ON m.id = j.mistake_id WHERE j.user_id = ? AND m.user_id = ?').all(user.id, user.id)
    }))();
}

async function downloadPersonalData(req, res) {
    if (exporting.has(req.user.id)) fail(409, '您的数据正在打包，请等待下载完成后再试');
    exporting.add(req.user.id);
    let directory;
    try {
        const data = collectPersonalData(req.user);
        directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'mistakes-personal-'));
        const content = path.join(directory, 'content');
        await fs.promises.mkdir(path.join(content, 'images'), { recursive: true });
        await fs.promises.mkdir(path.join(content, 'mistakes'));
        const filenames = new Set([
            ...data.images.flatMap((row) => [row.original_path, row.crop_path]),
            ...data.pageImports.map((row) => row.image_path),
            ...data.pageItems.map((row) => row.crop_path)
        ].filter(Boolean));
        data.missingFiles = [];
        for (const filename of filenames) {
            if (path.basename(filename) !== filename || /[\\/:\0]/.test(filename) || filename === '.' || filename === '..') {
                throw new Error('图片文件路径无效');
            }
            const source = path.join(uploadsDirectory, filename);
            try {
                if (!(await fs.promises.lstat(source)).isFile()) throw new Error('图片必须为普通文件');
                await fs.promises.copyFile(source, path.join(content, 'images', filename));
            } catch (error) {
                if (error.code !== 'ENOENT') throw error;
                data.missingFiles.push(filename);
            }
        }
        const images = new Map(data.images.map((row) => [row.id, row]));
        function localMarkdown(markdown, mistakeId) {
            for (const reference of markdownImages(markdown).reverse()) {
                const image = images.get(reference.imageId);
                if (!image || image.mistake_id !== mistakeId) continue;
                const filename = image[`${reference.variant}_path`];
                if (!filename) continue;
                const alt = reference.alt.replace(/([\\\[\]])/g, '\\$1');
                markdown = markdown.slice(0, reference.start) + `![${alt}](../images/${encodeURIComponent(filename)})` + markdown.slice(reference.end);
            }
            return markdown;
        }
        for (const mistake of data.mistakes) {
            const state = mistake.deleted_at ? '回收站' : mistake.lifecycle === 'draft' ? '草稿' : '已归档';
            const text = `# 错题 ${mistake.id}\n\n状态：${state}\n\n` +
                [['题干', mistake.question], ['答案', mistake.answer], ['解析', mistake.analysis], ['笔记', mistake.note]]
                    .map(([title, value]) => `## ${title}\n\n${localMarkdown(value, mistake.id)}\n`).join('\n');
            await fs.promises.writeFile(path.join(content, 'mistakes', `${mistake.id}.md`), text);
        }
        await fs.promises.writeFile(path.join(content, 'data.json'), JSON.stringify(data, null, 2));
        await fs.promises.writeFile(path.join(content, 'README.txt'),
            '拾题 · 我的数据\n\n解压后，mistakes 文件夹中是可阅读的错题、答案、解析和笔记（Markdown 格式）。\n' +
            'images 文件夹包含现存的本人配图和上传来源图。data.json 包含账号资料、草稿、回收站、知识点、复习记录及 AI / 分题记录。\n' +
            '图片记录中的文件名对应 images 文件夹。此包用于个人留存，不是全站恢复包。未保存的浏览器草稿不在其中。\n' +
            (data.missingFiles.length ? `\n以下图片文件已不存在，未能收录：\n${data.missingFiles.join('\n')}\n` : ''));
        const archive = path.join(directory, 'personal-data.zip');
        const imageFiles = await fs.promises.readdir(path.join(content, 'images'));
        const zip = new ZipFile();
        zip.on('error', (error) => zip.outputStream.destroy(error));
        for (const filename of ['README.txt', 'data.json']) {
            zip.addFile(path.join(content, filename), filename);
        }
        zip.addEmptyDirectory('mistakes');
        for (const mistake of data.mistakes) {
            const filename = `mistakes/${mistake.id}.md`;
            zip.addFile(path.join(content, filename), filename);
        }
        zip.addEmptyDirectory('images');
        for (const filename of imageFiles) {
            zip.addFile(path.join(content, 'images', filename), `images/${filename}`);
        }
        zip.end();
        await pipeline(zip.outputStream, fs.createWriteStream(archive));
        res.set('Cache-Control', 'no-store');
        res.type('application/zip');
        await new Promise((resolve, reject) => {
            res.download(archive, `shiti-my-data-${new Date().toISOString().slice(0, 10)}.zip`, (error) => error ? reject(error) : resolve());
        });
    } finally {
        exporting.delete(req.user.id);
        if (directory) await fs.promises.rm(directory, { recursive: true, force: true });
    }
}

module.exports = { downloadPersonalData };

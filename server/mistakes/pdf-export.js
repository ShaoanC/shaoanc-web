const fs = require('node:fs/promises');
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(__dirname, '../../data/.playwright');
const { chromium } = require('playwright');
const { db } = require('./database');
const { imagePath } = require('./images');
const { markdownImages } = require('./question-images');
const { fail } = require('./auth');

const publicDirectory = path.resolve(__dirname, '../../public/mistakes');
const renderOrigin = 'http://mistakes-export.local';
const defaults = {
    title: '错题', version: 'complete', includeNotes: true, fontSize: 12,
    layout: 'continuous', practiceSpace: 60, answerPlacement: 'inline'
};
const filterKeys = ['lifecycle', 'subjectId', 'knowledgePointId', 'status', 'rating', 'keyword', 'dataType'];
const contentTypes = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg'
};
let browserPromise;
let idleTimer;
let running = false;
const waiting = [];

function exportError(status, message) {
    return Object.assign(new Error(message), { status, expose: true });
}

function cancelled() {
    return exportError(499, '导出已取消');
}

async function closePdfBrowser() {
    clearTimeout(idleTimer);
    const pending = browserPromise;
    browserPromise = undefined;
    if (pending) await pending.then((browser) => browser.close()).catch(() => {});
}

function getBrowser() {
    clearTimeout(idleTimer);
    if (!browserPromise) {
        const pending = chromium.launch({
            headless: true,
            ...(process.env.MISTAKES_PDF_EXECUTABLE_PATH ? { executablePath: process.env.MISTAKES_PDF_EXECUTABLE_PATH } : {})
        }).then((browser) => {
            browser.on('disconnected', () => { if (browserPromise === pending) browserPromise = undefined; });
            return browser;
        }).catch((error) => {
            if (browserPromise === pending) browserPromise = undefined;
            console.error('PDF browser launch failed:', error.message);
            throw exportError(503, 'PDF 生成环境暂不可用，请联系管理员安装 Chromium。');
        });
        browserPromise = pending;
    }
    return browserPromise;
}

async function waitForBrowser(signal) {
    signal.throwIfAborted();
    let abort;
    const interrupted = new Promise((_, reject) => {
        abort = () => reject(signal.reason || cancelled());
        signal.addEventListener('abort', abort, { once: true });
    });
    try { return await Promise.race([getBrowser(), interrupted]); }
    finally { signal.removeEventListener('abort', abort); }
}

function withPdfSlot(task, signal) {
    return new Promise((resolve, reject) => {
        if (signal.aborted) return reject(cancelled());
        if (running && waiting.length >= 2) return reject(exportError(503, '导出任务较多，请稍后重试。'));
        clearTimeout(idleTimer);
        const job = { start, started: false, timer: undefined };
        function remove() {
            clearTimeout(job.timer);
            signal.removeEventListener('abort', abort);
            const index = waiting.indexOf(job);
            if (index !== -1) waiting.splice(index, 1);
        }
        function abort() {
            if (job.started) return;
            remove();
            reject(cancelled());
        }
        function start() {
            job.started = true;
            running = true;
            remove();
            const execution = new AbortController();
            const timeout = setTimeout(() => execution.abort(exportError(504, 'PDF 生成超时，请减少题目数量后重试。')), 60000);
            const combined = AbortSignal.any([signal, execution.signal]);
            void task(combined).then(resolve, reject).finally(() => {
                clearTimeout(timeout);
                running = false;
                const next = waiting.shift();
                if (next) next.start();
                else idleTimer = setTimeout(() => void closePdfBrowser(), 60000).unref();
            });
        }
        signal.addEventListener('abort', abort, { once: true });
        if (!running) start();
        else {
            waiting.push(job);
            job.timer = setTimeout(() => {
                remove();
                reject(exportError(503, '等待导出超时，请稍后重试。'));
            }, 30000);
        }
    });
}

function readOptions(input = {}) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail(400, '导出设置无效');
    const options = Object.fromEntries(Object.keys(defaults).map((key) => [key, input[key] ?? defaults[key]]));
    if (typeof options.title !== 'string' || options.title.trim().length > 80) fail(400, '标题请控制在 80 个字以内');
    options.title = options.title.trim() || defaults.title;
    if (!['complete', 'practice'].includes(options.version) || typeof options.includeNotes !== 'boolean' ||
        ![10.5, 12, 14].includes(options.fontSize) || !['continuous', 'per-question'].includes(options.layout) ||
        !Number.isInteger(options.practiceSpace) || options.practiceSpace < 10 || options.practiceSpace > 70 || options.practiceSpace % 5 !== 0 ||
        !['inline', 'appendix'].includes(options.answerPlacement)) {
        fail(400, '导出设置无效，请重新选择');
    }
    return options;
}

function readMistakes(source, userId, { listMistakes, serializeMistake, mistakeSelect }) {
    if (!source || typeof source !== 'object' || Array.isArray(source) ||
        (Object.hasOwn(source, 'ids') === Object.hasOwn(source, 'filters'))) fail(400, '请选择导出范围');
    if (Object.hasOwn(source, 'ids')) {
        if (!Array.isArray(source.ids) || !source.ids.length || source.ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
            fail(400, '请选择有效题目');
        }
        const query = db.prepare(`${mistakeSelect} WHERE m.id = ? AND m.user_id = ? AND m.deleted_at IS NULL`);
        return [...new Set(source.ids)].map((id) => {
            const row = query.get(id, userId);
            if (!row) fail(409, '部分已选题目已删除或不可访问，请刷新列表后重新选择。');
            return serializeMistake(row);
        });
    }
    if (!source.filters || typeof source.filters !== 'object' || Array.isArray(source.filters)) fail(400, '筛选条件无效');
    const filters = {};
    for (const key of filterKeys) {
        if (!Object.hasOwn(source.filters, key)) continue;
        if (typeof source.filters[key] !== 'string') fail(400, '筛选条件无效');
        filters[key] = source.filters[key];
    }
    return listMistakes(filters, userId);
}

async function documentImages(mistakes, options, userId) {
    const allowed = new Map();
    const query = db.prepare('SELECT original_path, crop_path FROM mistake_images WHERE id = ? AND user_id = ?');
    for (const [index, mistake] of mistakes.entries()) {
        const fields = [mistake.question];
        if (options.version === 'complete') {
            fields.push(mistake.answer, mistake.analysis);
            if (options.includeNotes) fields.push(mistake.note);
        }
        for (const field of fields) {
            for (const image of markdownImages(field)) {
                if (allowed.has(image.url)) continue;
                if (!image.imageId) fail(422, `第 ${index + 1} 题含不支持的外链配图，请将图片上传到本站后重试。`);
                const row = query.get(image.imageId, userId);
                if (!row) fail(422, `第 ${index + 1} 题的配图不可访问，请重新上传配图后重试。`);
                if (!row[`${image.variant}_path`]) fail(422, `第 ${index + 1} 题引用的配图未保留，请重新上传配图后重试。`);
                const filename = imagePath(row[`${image.variant}_path`]);
                try { await fs.access(filename); }
                catch { fail(422, `第 ${index + 1} 题的配图文件已丢失，请重新上传后重试。`); }
                allowed.set(image.url, filename);
            }
        }
    }
    return allowed;
}

async function renderPdf(data, images, signal) {
    let context;
    const abort = () => { if (context) void context.close().catch(() => {}); };
    signal.addEventListener('abort', abort, { once: true });
    try {
        await fs.access(path.join(publicDirectory, 'export.html')).catch(() => {
            throw exportError(503, 'PDF 排版资源尚未构建，请联系管理员运行 npm run build。');
        });
        const browser = await waitForBrowser(signal);
        signal.throwIfAborted();
        context = await browser.newContext({ serviceWorkers: 'block' });
        signal.throwIfAborted();
        const page = await context.newPage();
        await page.route('**/*', async (route) => {
            try {
                const request = route.request();
                const url = new URL(request.url());
                if (request.method() !== 'GET' || url.origin !== renderOrigin) return await route.abort();
                let filename = images.get(url.pathname);
                let contentType = 'image/jpeg';
                if (!filename && url.pathname.startsWith('/mistakes/')) {
                    filename = path.resolve(publicDirectory, decodeURIComponent(url.pathname.slice('/mistakes/'.length)));
                    if (!filename.startsWith(`${publicDirectory}${path.sep}`)) return await route.abort();
                    contentType = contentTypes[path.extname(filename)] || 'application/octet-stream';
                }
                if (!filename) return await route.abort();
                const body = await fs.readFile(filename);
                await route.fulfill({ status: 200, contentType, body });
            } catch {
                await route.abort().catch(() => {});
            }
        });
        await page.addInitScript((payload) => { window.__MISTAKE_EXPORT_DATA__ = payload; }, data);
        await page.emulateMedia({ media: 'print' });
        await page.goto(`${renderOrigin}/mistakes/export.html`, { waitUntil: 'load' });
        await page.waitForFunction(() => window.__MISTAKE_EXPORT_READY__ || window.__MISTAKE_EXPORT_ERROR__, null, { timeout: 55000 });
        const error = await page.evaluate(() => window.__MISTAKE_EXPORT_ERROR__);
        if (error) throw exportError(422, error);
        return await page.pdf({
            format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true,
            displayHeaderFooter: true, headerTemplate: '<span></span>',
            footerTemplate: '<div style="width:100%;text-align:center;font:9px Arial;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });
    } catch (error) {
        if (signal.aborted) throw signal.reason || cancelled();
        if (error.status) throw error;
        console.error('PDF render failed:', error.message);
        throw exportError(502, 'PDF 生成失败，请重试；若持续失败，请联系管理员检查排版资源。');
    } finally {
        signal.removeEventListener('abort', abort);
        if (context) await context.close().catch(() => {});
    }
}

function mountPdfExportRoutes(router, helpers) {
    router.post('/exports/pdf', async (req, res) => {
        const controller = new AbortController();
        const disconnected = () => { if (!res.writableEnded) controller.abort(cancelled()); };
        res.once('close', disconnected);
        try {
            const options = readOptions(req.body?.options);
            const mistakes = readMistakes(req.body?.source, req.user.id, helpers);
            if (!mistakes.length) fail(400, '没有可导出的题目，请调整筛选条件后重试。');
            const data = {
                mistakes, options,
                subjects: db.prepare('SELECT id, name FROM subjects ORDER BY sort_order, id').all(),
                knowledgePoints: db.prepare(`${helpers.pointSelect} WHERE owner_user_id IS NULL OR owner_user_id = ?`).all(req.user.id),
                date: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date())
            };
            const images = await documentImages(mistakes, options, req.user.id);
            const buffer = await withPdfSlot((signal) => renderPdf(data, images, signal), controller.signal);
            if (controller.signal.aborted) return;
            const title = options.title.replace(/[\u0000-\u001f\u007f/\\<>:"|?*]/g, '_');
            const filename = `${title}-${data.date}-${options.version === 'complete' ? '完整版' : '练习版'}.pdf`;
            res.set({
                'Content-Type': 'application/pdf', 'Cache-Control': 'private, no-store',
                'Content-Disposition': `attachment; filename="mistakes-${data.date}.pdf"; filename*=UTF-8''${encodeURIComponent(filename).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)}`,
                'X-Export-Question-Count': String(mistakes.length)
            }).send(buffer);
        } finally {
            res.removeListener('close', disconnected);
        }
    });
}

module.exports = { mountPdfExportRoutes, closePdfBrowser };

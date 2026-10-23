const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dataDirectory = path.resolve(__dirname, '../data');
const screenshotsDirectory = path.resolve(__dirname, '../docs/screenshots');
const temporaryDirectory = fs.mkdtempSync(path.join(dataDirectory, 'export-preview-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(temporaryDirectory, 'preview.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(temporaryDirectory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(temporaryDirectory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(dataDirectory, '.playwright');
const { chromium } = require('playwright');
let app;
let server;
let browser;

async function json(context, base, method, route, data) {
    const response = await context.request.fetch(`${base}/api/mistakes${route}`, { method, data });
    const result = await response.json();
    assert.ok(response.ok() && result.success, `${method} ${route}: ${JSON.stringify(result)}`);
    return result.data;
}

async function homeSnapshot(page) {
    return page.evaluate(() => {
        const selectors = ['html', 'body', '.app-shell', '.sidebar', '.sidebar .brand', '.sidebar nav', '.main-shell', '.topbar', '.main-content', '.page-header', '.mistake-row'];
        const styles = ['display', 'position', 'overflowX', 'overflowY', 'fontFamily', 'fontSize', 'lineHeight', 'margin', 'padding', 'boxSizing'];
        return {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            layout: selectors.map((selector) => {
                const element = document.querySelector(selector);
                if (!element) return { selector };
                const style = getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                return {
                    selector,
                    rect: [rect.x, rect.y, rect.width, rect.height].map((value) => Math.round(value * 10) / 10),
                    styles: Object.fromEntries(styles.map((key) => [key, style[key]])),
                };
            }),
        };
    });
}

async function waitPdf(page) {
    await page.waitForFunction(() => {
        const sheet = document.querySelector('[data-pdf-page="1"]');
        return sheet?.getAttribute('aria-busy') === 'false' && sheet.querySelector('canvas')?.width > 0 && sheet.querySelector('.textLayer')?.childElementCount > 0;
    }, null, { timeout: 30000 });
    const text = await page.locator('[data-pdf-page="1"] .textLayer').textContent();
    assert.match(text.replace(/\s/g, ''), /错题|求解方程/, 'The generated PDF contains selectable Chinese text');
    assert.equal(await page.locator('.export-paper-scroll').evaluate((element) => element.scrollWidth > element.clientWidth + 1), false, 'Fit preview stays within its viewport');
}

async function checkViewport(context, base, name, forceLoadFailure) {
    const page = await context.newPage();
    const errors = [];
    let exports = 0;
    let workerRequests = 0;
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
        if (request.method() === 'POST' && request.url().endsWith('/exports/pdf')) exports += 1;
    });
    if (forceLoadFailure) {
        // Model a static server without an .mjs JavaScript MIME mapping.
        await page.route('**/*.mjs', async (route) => {
            const response = await route.fetch();
            await route.fulfill({ response, contentType: 'application/octet-stream' });
        });
        await page.route('**/pdf.worker*.js', async (route) => {
            workerRequests += 1;
            if (workerRequests === 1) {
                await route.fulfill({ status: 503, contentType: 'text/javascript', body: '' });
            } else {
                await route.continue();
            }
        });
        // Fail only the preview's first read, after the server has returned a real PDF.
        await page.addInitScript(() => {
            // Simulate desktop browsers predating the latest Promise and URL APIs.
            Promise.try = undefined;
            URL.parse = undefined;
            const read = Blob.prototype.arrayBuffer;
            let failFirst = true;
            Blob.prototype.arrayBuffer = function (...args) {
                if (this.type.startsWith('application/pdf') && failFirst) {
                    failFirst = false;
                    return Promise.reject(new Error('Simulated first PDF read failure'));
                }
                return read.apply(this, args);
            };
        });
    }
    await page.goto(`${base}/mistakes/`, { waitUntil: 'networkidle' });
    await page.locator('.mistake-row').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const closeToast = page.locator('.Toastify__close-button');
    if (await closeToast.count()) await closeToast.first().click();
    await page.locator('.Toastify__toast').first().waitFor({ state: 'detached', timeout: 7000 }).catch(() => {});
    const before = await homeSnapshot(page);

    for (let attempt = 1; attempt <= 2; attempt += 1) {
        await page.getByRole('button', { name: '导出', exact: true }).click();
        assert.equal(await page.getByLabel('文档标题', { exact: true }).inputValue(), '错题');
        if (attempt === 1 && !forceLoadFailure) await page.screenshot({ path: path.join(screenshotsDirectory, 'mistakes-export-mobile-settings.png') });
        if (attempt === 1) {
            const notes = page.getByRole('checkbox', { name: /包含我的笔记/ });
            assert.equal(await notes.isChecked(), true);
            await page.getByRole('radio', { name: /练习版/ }).check();
            assert.equal(await notes.isChecked(), false, 'Practice mode clears notes');
            assert.equal(await notes.isDisabled(), true, 'Practice mode disables notes');
            await page.locator('.export-field').filter({ hasText: '题目排版' }).locator('select').selectOption('per-question');
            assert.equal(await page.locator('.export-field').filter({ hasText: '每题答题留白' }).count(), 0, 'One question per page needs no blank-space control');
            // Render the default complete PDF for the preview regression.
            await page.getByRole('radio', { name: /完整版/ }).check();
            await page.locator('.export-field').filter({ hasText: '题目排版' }).locator('select').selectOption('continuous');
        }
        await page.getByRole('button', { name: '预览 PDF', exact: true }).click();
        if (attempt === 1 && forceLoadFailure) {
            const retry = page.getByRole('button', { name: '重试预览', exact: true });
            await retry.waitFor();
            assert.equal(exports, 1);
            const workerFailure = page.waitForResponse((response) => /\/pdf\.worker[^/]*\.js$/.test(response.url()) && response.status() === 503);
            await retry.click({ timeout: 5000 });
            // A worker startup failure must also recover with an ordinary click.
            await workerFailure;
            await retry.waitFor();
            assert.equal(workerRequests, 1, 'The .js worker was requested and failed once');
            await retry.click({ timeout: 5000 });
        }
        await waitPdf(page);
        if (attempt === 1 && forceLoadFailure) assert.equal(workerRequests, 2, 'Retry creates a fresh worker after a failed startup');
        if (attempt === 1) await page.screenshot({ path: path.join(screenshotsDirectory, `mistakes-export-${forceLoadFailure ? 'desktop' : 'mobile'}.png`) });
        assert.equal(exports, attempt, 'Preview retry reads the cached PDF without requesting another export');
        await page.getByRole('button', { name: '关闭导出预览', exact: true }).click();
        await page.locator('#mistake-export-root').waitFor({ state: 'detached' });
        // Base UI restores scroll locking in the next task after removing the dialog.
        await page.waitForFunction((expected) => ['html', 'body'].every((selector) => {
            const actual = getComputedStyle(document.querySelector(selector));
            const saved = expected.find((entry) => entry.selector === selector).styles;
            return actual.overflowX === saved.overflowX && actual.overflowY === saved.overflowY;
        }), before.layout, { timeout: 1000 });
        assert.deepEqual(await homeSnapshot(page), before, `${name}: homepage layout and scrolling are restored after preview ${attempt}`);
    }
    assert.deepEqual(errors, [], `${name}: no uncaught browser errors`);
    await page.close();
}

async function checkPrintedLayout(context, base, mistakes) {
    const page = await context.newPage();
    await page.addInitScript((records) => {
        window.__MISTAKE_EXPORT_DATA__ = {
            mistakes: records,
            subjects: [{ id: 'math', name: '数学' }],
            knowledgePoints: [],
            date: '2026-10-23',
            options: { title: '错题', version: 'practice', includeNotes: false, fontSize: 12, layout: 'per-question', practiceSpace: 60, answerPlacement: 'inline' },
        };
    }, mistakes);
    await page.goto(`${base}/mistakes/export.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__MISTAKE_EXPORT_READY__ || window.__MISTAKE_EXPORT_ERROR__);
    assert.equal(await page.evaluate(() => window.__MISTAKE_EXPORT_ERROR__), '');
    assert.equal(await page.locator('.export-answer-space').count(), 0, 'Printed per-question pages have no artificial answer space');
    assert.deepEqual(await page.locator('.export-question').evaluateAll((questions) => questions.map((question) => getComputedStyle(question).borderBottomWidth)), mistakes.map(() => '0px'), 'Printed per-question pages have no question dividers');
    await page.close();
}

async function main() {
    fs.mkdirSync(screenshotsDirectory, { recursive: true });
    app = require('../server/app');
    const { hashPassword } = require('../server/mistakes/auth');
    app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)").run('export_preview_smoke', hashPassword('ExportPreview2026!'), new Date().toISOString());
    server = await new Promise((resolve, reject) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await desktop.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await json(desktop, base, 'POST', '/auth/login', { username: 'export_preview_smoke', password: 'ExportPreview2026!' });
    const mistakes = [];
    for (let index = 1; index <= 3; index += 1) {
        mistakes.push(await json(desktop, base, 'POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: `求解方程 ${index}：$x+${index}=5$。`, answer: `$x=${5 - index}$。`, analysis: '根据等式性质求解。', note: '我的笔记：检查计算结果。' }));
    }
    await checkViewport(desktop, base, 'desktop 1280x900', true);
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, storageState: await desktop.storageState() });
    await mobile.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await checkViewport(mobile, base, 'mobile 390x844', false);
    await checkPrintedLayout(desktop, base, mistakes);
    await mobile.close();
    await desktop.close();
    console.log('PDF preview smoke passed: desktop/mobile canvas and text, clickable retry reuses PDF, first/reopened preview restores homepage, export options and per-question print layout.');
}

async function cleanup() {
    await browser?.close();
    const pdfModule = require.resolve('../server/mistakes/pdf-export');
    if (require.cache[pdfModule]) await require(pdfModule).closePdfBrowser();
    if (server) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    }
    app?.db.close();
    const target = path.resolve(temporaryDirectory);
    assert.equal(path.dirname(target), dataDirectory);
    assert.match(path.basename(target), /^export-preview-smoke-/);
    fs.rmSync(target, { recursive: true, force: true });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(cleanup);

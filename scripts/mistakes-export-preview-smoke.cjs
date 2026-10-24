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

async function closeAnimatedView(page, dialog, desktopPopup, mobilePopup, content) {
    const mobile = page.viewportSize().width <= 640;
    const popup = page.locator(mobile ? mobilePopup : desktopPopup);
    if (mobile) {
        const handle = await dialog.locator('.mobile-filters-drag-area').boundingBox();
        assert.ok(handle, 'The mobile drawer provides a swipe handle');
        const session = await page.context().newCDPSession(page);
        const x = handle.x + handle.width / 2;
        const y = handle.y + handle.height / 2;
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 8; step += 1) {
            await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + (page.viewportSize().height - 16 - y) * step / 8 }] });
        }
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await session.detach();
    } else {
        await dialog.getByRole('button', { name: /^关闭/ }).click();
        const ending = page.locator(`${desktopPopup}[data-ending-style]`);
        await ending.waitFor({ state: 'attached' });
        assert.equal(await ending.locator(content).count(), 1, 'Desktop exit keeps dialog content mounted through its transition');
    }
    await popup.waitFor({ state: 'detached' });
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

    await page.getByRole('button', { name: '导出', exact: true }).click();
    const settingsDialog = page.getByRole('dialog', { name: '导出错题', exact: true });
    await settingsDialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    await closeAnimatedView(page, settingsDialog, '.export-dialog', '.export-mobile-drawer', '.export-settings-fields');

    for (let attempt = 1; attempt <= 2; attempt += 1) {
        await page.getByRole('button', { name: '导出', exact: true }).click();
        assert.equal(await page.getByLabel('文档标题', { exact: true }).inputValue(), '错题');
        await page.getByRole('dialog').evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
        assert.deepEqual(await page.locator('.export-dialog, .export-settings-body, .export-mobile-drawer, .export-mobile-drawer > .mobile-filters-content').evaluateAll((elements) => elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.className)), [], `${name}: export settings have no horizontal overflow`);
        if (attempt === 1 && !forceLoadFailure) await page.screenshot({ path: path.join(screenshotsDirectory, 'mistakes-export-mobile-settings.png') });
        if (attempt === 1) {
            const layout = page.getByRole('button', { name: /题目排版/ });
            await layout.click();
            await page.getByRole('listbox', { name: '题目排版', exact: true }).waitFor();
            await page.keyboard.press('Escape');
            assert.equal(await layout.getAttribute('aria-expanded'), 'false', 'Escape closes the shared select menu');
            assert.equal(await page.getByRole('dialog').isVisible(), true, 'Escape from a select keeps export settings open');
            const notes = page.getByRole('checkbox', { name: /包含我的笔记/ });
            assert.equal(await notes.isChecked(), true);
            await page.getByRole('radio', { name: /练习版/ }).check();
            assert.equal(await notes.isChecked(), false, 'Practice mode clears notes');
            assert.equal(await notes.isDisabled(), true, 'Practice mode disables notes');
            assert.match(await page.locator('.export-notes-option').getAttribute('class'), /\bis-disabled\b/, 'Practice notes show the disabled row style');
            const notesHint = page.getByText('练习版不包含笔记，切换到完整版后可用。', { exact: true });
            assert.equal(await notesHint.isVisible(), true, 'Practice notes explain how to enable them');
            const hintId = await notesHint.getAttribute('id');
            assert.ok(hintId && (await notes.getAttribute('aria-describedby'))?.split(/\s+/).includes(hintId), 'The checkbox describes its unavailable state');
            assert.deepEqual(await page.locator('.export-dialog, .export-settings-body, .export-mobile-drawer, .export-mobile-drawer > .mobile-filters-content').evaluateAll((elements) => elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.className)), [], `${name}: practice settings have no horizontal overflow`);
            if (!forceLoadFailure) {
                await notesHint.scrollIntoViewIfNeeded();
                await page.screenshot({ path: path.join(dataDirectory, 'mistakes-export-mobile-practice.png') });
            }
            await layout.click();
            await page.getByRole('option', { name: '每题另起一页', exact: true }).click();
            assert.equal(await page.locator('.export-field').filter({ hasText: '每题答题留白' }).count(), 0, 'One question per page needs no blank-space control');
            // Render the default complete PDF for the preview regression.
            await page.getByRole('radio', { name: /完整版/ }).check();
            await layout.click();
            await page.getByRole('option', { name: '连续排题', exact: true }).click();
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

async function checkAiTasksViewport(context, base, name) {
    const page = await context.newPage();
    const input = { question: '', answer: '', analysis: '', subjectId: 'math', primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [] };
    const common = { mistakeId: 1, mode: 'single', mistakeDeleted: false, applyStatus: 'pending', input, imageIds: [], result: null, error: null, attempts: 1, maxAttempts: 3, createdAt: '2026-10-24T02:00:00Z', startedAt: null, finishedAt: null, nextAttemptAt: null };
    const jobs = [
        { ...common, id: 9001, type: 'question', status: 'failed', input: { ...input, question: '识别失败示例' }, error: '图片暂时无法识别，可重新拍摄。' },
        { ...common, id: 9002, type: 'analysis', status: 'succeeded', applyStatus: 'applied', input: { ...input, question: '已完成解析示例' }, result: { analysis: '这是可校对的解析结果。' } },
    ];
    await page.route('**/api/mistakes/ai/jobs', (route) => route.fulfill({ json: { success: true, data: jobs } }));
    await page.route('**/api/mistakes/ai/config', (route) => route.fulfill({ json: { success: true, data: { enabled: true, configured: true, analysis: { enabled: true, configured: true } } } }));
    async function checkControls(root) {
        const type = root.getByRole('button', { name: /任务类型/ });
        await type.click();
        await page.getByRole('listbox', { name: '任务类型', exact: true }).waitFor();
        await page.keyboard.press('Escape');
        assert.equal(await type.getAttribute('aria-expanded'), 'false', `${name}: Escape closes the task type menu`);
        assert.equal(await root.isVisible(), true, `${name}: Escape keeps the task view open`);
        assert.equal(await root.getByRole('tab').count(), 6, `${name}: task states reuse shared tabs`);
        await type.click();
        await page.getByRole('option', { name: '生成解析', exact: true }).click();
        await root.locator('.task-row').filter({ hasText: '已完成解析示例' }).waitFor();
        assert.equal(await root.locator('.task-row').count(), 1, `${name}: task type filters results`);
        await root.getByRole('tab', { name: /已填入/ }).click();
        assert.equal(await root.getByRole('tab', { name: /已填入/ }).getAttribute('aria-selected'), 'true');
        const search = root.getByRole('searchbox', { name: '搜索 AI 任务', exact: true });
        await search.fill('不存在的任务');
        await root.locator('.task-row').waitFor({ state: 'hidden' });
        await search.fill('已完成解析示例');
        await root.locator('.task-row').waitFor();
        await root.locator('.task-result summary').click();
        await root.getByText('这是可校对的解析结果。', { exact: true }).waitFor();
        await root.locator('.tab-indicator').evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
        assert.equal(await root.locator('.task-filters').evaluate((element) => Math.abs(element.querySelector('.tab-indicator').getBoundingClientRect().left - element.querySelector('[aria-selected="true"]').getBoundingClientRect().left) < 1), true, `${name}: the sliding indicator settles under the selected task state`);
        assert.equal(await root.evaluate((element) => [element, ...element.querySelectorAll('.mobile-filters-content')].some((node) => node.scrollWidth > node.clientWidth + 1)), false, `${name}: task view has no horizontal overflow`);
    }
    await page.goto(`${base}/mistakes/`, { waitUntil: 'networkidle' });
    const welcomeClose = page.locator('.Toastify__close-button');
    if (await welcomeClose.count()) await welcomeClose.first().click();
    await page.getByRole('button', { name: /^AI 任务/ }).click();
    const dialog = page.getByRole('dialog', { name: 'AI 任务', exact: true });
    await dialog.locator('.task-row').first().waitFor();
    await checkControls(dialog);
    await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    await page.screenshot({ path: path.join(dataDirectory, `mistakes-ai-tasks-${name}.png`) });
    await closeAnimatedView(page, dialog, '.ai-tasks-dialog', '.ai-tasks-mobile-drawer', '.task-manager');
    await page.evaluate(() => { location.hash = '/ai-tasks'; });
    const manager = page.getByRole('region', { name: 'AI 任务列表', exact: true });
    await manager.locator('.task-row').first().waitFor();
    await checkControls(manager);
    await page.screenshot({ path: path.join(dataDirectory, `mistakes-ai-tasks-page-${name}.png`) });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), false, `${name}: AI tasks page stays within the viewport`);
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
    await checkAiTasksViewport(desktop, base, 'desktop');
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, storageState: await desktop.storageState() });
    await mobile.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await checkViewport(mobile, base, 'mobile 390x844', false);
    await checkAiTasksViewport(mobile, base, 'mobile');
    await checkPrintedLayout(desktop, base, mistakes);
    await mobile.close();
    await desktop.close();
    console.log('PDF preview and AI tasks smoke passed: desktop/mobile PDF rendering and retry, restored homepage layout, export options, task dialog/page controls and per-question print layout.');
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

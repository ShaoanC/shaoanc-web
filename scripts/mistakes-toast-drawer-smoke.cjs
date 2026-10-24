const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const dataDirectory = path.resolve(__dirname, '../data');
const directory = fs.mkdtempSync(path.join(dataDirectory, 'toast-drawer-smoke-'));
process.env.MISTAKES_ENV_PATH = path.join(directory, '.env');
process.env.MISTAKES_DB_PATH = path.join(directory, 'drawer.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(dataDirectory, '.playwright');
const { chromium } = require('playwright');
let app, server, browser, userId;

async function api(context, base, method, route, data) {
    const response = await context.request.fetch(`${base}/api/mistakes${route}`, { method, data });
    const body = await response.json();
    assert.ok(response.ok() && body.success, `${method} ${route}: ${JSON.stringify(body)}`);
    return body.data;
}

async function refreshJobs(page) {
    const response = page.waitForResponse((response) => response.url().endsWith('/ai/jobs') && response.request().method() === 'GET');
    await page.evaluate(() => window.dispatchEvent(new Event('mistakes:updated')));
    await response;
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function completeJobToast(page, record, type, review = false) {
    await page.locator('.Toastify__close-button').evaluateAll((buttons) => buttons.forEach((button) => button.click()));
    const input = Object.fromEntries(['question', 'answer', 'analysis', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds'].map((field) => [field, record[field]]));
    const jobId = app.db.prepare("INSERT INTO ai_jobs (mistake_id, user_id, type, status, input_json, fingerprint, created_at) VALUES (?, ?, ?, 'queued', ?, ?, ?)")
        .run(record.id, userId, type, JSON.stringify(input), crypto.randomUUID(), new Date().toISOString()).lastInsertRowid;
    await refreshJobs(page);
    const result = { [type]: '浏览器校对后的答案', needsReview: review, subjectId: 'math', primaryPath: [], issues: [] };
    app.db.prepare("UPDATE ai_jobs SET status = 'succeeded', apply_status = ?, result_json = ?, finished_at = ? WHERE id = ?")
        .run(review ? 'pending' : 'applied', JSON.stringify(result), new Date().toISOString(), jobId);
    await refreshJobs(page);
    const destination = `/mistakes/${record.id}${review ? `/edit?aiJob=${jobId}` : ''}`;
    const anchor = page.locator(`.Toastify__toast a.ai-toast-link[href="#${destination}"]`);
    await anchor.waitFor({ state: 'visible' });
    return { anchor, jobId, result, destination };
}

async function closeDrawer(page, swipe = false) {
    const drawer = page.locator('.record-view-drawer');
    if (swipe) {
        const handle = await drawer.locator('.mobile-filters-drag-area').boundingBox();
        assert.ok(handle, 'The record drawer uses the shared swipe handle');
        const session = await page.context().newCDPSession(page);
        const x = handle.x + handle.width / 2, y = handle.y + handle.height / 2;
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 8; step += 1) {
            await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + (page.viewportSize().height - 12 - y) * step / 8 }] });
        }
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await session.detach();
    } else await drawer.getByRole('button', { name: '关闭题目', exact: true }).click();
    await drawer.waitFor({ state: 'detached' });
}

async function completeDetailAfterClose(page, base, recordId, method, suffix, trigger) {
    const url = `${base}/api/mistakes/mistakes/${recordId}${suffix}`;
    let release, started;
    const gate = new Promise((resolve) => { release = resolve; });
    const ready = new Promise((resolve) => { started = resolve; });
    await page.route(url, async (route) => {
        if (route.request().method() !== method) { await route.continue(); return; }
        const response = await route.fetch();
        started();
        await gate;
        await route.fulfill({ response });
    });
    try {
        await page.evaluate((id) => window.dispatchEvent(new CustomEvent('mistakes:open-toast-record', { detail: { path: `/mistakes/${id}` } })), recordId);
        const drawer = page.locator('.record-view-drawer');
        await drawer.locator('.detail-document').waitFor();
        await trigger(drawer);
        await ready;
        await closeDrawer(page);
        const completed = page.waitForResponse((response) => response.url() === url && response.request().method() === method);
        const refreshed = page.waitForResponse((response) => response.url().startsWith(`${base}/api/mistakes/mistakes?`) && response.request().method() === 'GET');
        release();
        assert.equal((await completed).status(), 200);
        await refreshed;
    } finally {
        release();
        await page.unroute(url);
    }
}

async function mobileChecks(context, base) {
    const record = await api(context, base, 'POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: '抽屉保留：求解方程 x + 1 = 3', answer: 'x = 2' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/mistakes/#/mistakes`);
    await page.getByRole('textbox', { name: '搜索错题', exact: true }).fill('抽屉保留');
    await page.locator(`.mistake-row[data-mistake-id="${record.id}"]`).waitFor();
    await page.getByRole('button', { name: /^筛选错题/ }).click();
    const filters = page.getByRole('dialog', { name: '筛选错题', exact: true });
    await filters.getByRole('button', { name: '按学科筛选' }).click();
    await page.getByRole('option', { name: '数学', exact: true }).click();
    await filters.getByRole('button', { name: '应用筛选', exact: true }).click();
    await filters.waitFor({ state: 'hidden' });
    const originalHash = new URL(page.url()).hash;
    const completed = await completeJobToast(page, record, 'analysis');
    await completed.anchor.click();
    const drawer = page.locator('.record-view-drawer');
    await drawer.locator('.detail-document').waitFor();
    assert.equal(new URL(page.url()).hash, originalHash, 'Clicking the native toast anchor keeps the mobile background route');
    assert.equal(await drawer.locator('h1').count(), 0, 'The drawer heading replaces the duplicate page heading');
    assert.equal(await drawer.evaluate((element) => element.scrollWidth > element.clientWidth + 1), false);
    fs.mkdirSync(path.resolve(__dirname, '../docs/screenshots'), { recursive: true });
    await page.screenshot({ path: path.resolve(__dirname, '../docs/screenshots/toast-record-mobile.png') });
    await drawer.locator('.record-view-actions').getByRole('link', { name: '编辑错题', exact: true }).click();
    await drawer.locator('.question-editor').fill('抽屉保留：已在抽屉保存的新题干');
    await drawer.getByRole('button', { name: '保存操作', exact: true }).click();
    await drawer.getByRole('button', { name: '保存修改', exact: true }).click();
    await drawer.waitFor({ state: 'detached' });
    assert.equal(new URL(page.url()).hash, originalHash);
    assert.equal(await page.getByRole('textbox', { name: '搜索错题', exact: true }).inputValue(), '抽屉保留');
    assert.equal(await page.locator('.library-filter-count').textContent(), '1');
    await page.locator(`.mistake-row[data-mistake-id="${record.id}"]`).getByText('抽屉保留：已在抽屉保存的新题干', { exact: true }).first().waitFor();

    // Complete the response only after the drawer's editor has unmounted.
    let releasePatch, patchReady;
    const patchGate = new Promise((resolve) => { releasePatch = resolve; });
    const patchStarted = new Promise((resolve) => { patchReady = resolve; });
    const recordUrl = `${base}/api/mistakes/mistakes/${record.id}`;
    await page.route(recordUrl, async (route) => {
        if (route.request().method() !== 'PATCH') { await route.continue(); return; }
        const response = await route.fetch();
        patchReady();
        await patchGate;
        await route.fulfill({ response });
    });
    await page.evaluate((id) => window.dispatchEvent(new CustomEvent('mistakes:open-toast-record', { detail: { path: `/mistakes/${id}/edit` } })), record.id);
    await drawer.locator('.editor-workbench > .loading-content[aria-busy="false"]').waitFor();
    await drawer.locator('.question-editor').fill('抽屉保留：关闭期间完成保存的新题干');
    await drawer.getByRole('button', { name: '保存操作', exact: true }).click();
    await drawer.getByRole('button', { name: '保存修改', exact: true }).click();
    await patchStarted;
    await closeDrawer(page);
    const delayedPatch = page.waitForResponse((response) => response.url() === recordUrl && response.request().method() === 'PATCH');
    releasePatch();
    const delayedResponse = await delayedPatch;
    assert.equal(delayedResponse.status(), 200);
    assert.equal((await delayedResponse.json()).data.question, '抽屉保留：关闭期间完成保存的新题干');
    await page.locator(`.mistake-row[data-mistake-id="${record.id}"]`).getByText('抽屉保留：关闭期间完成保存的新题干', { exact: true }).first().waitFor();
    assert.equal(new URL(page.url()).hash, originalHash);
    assert.equal(await page.getByRole('textbox', { name: '搜索错题', exact: true }).inputValue(), '抽屉保留');
    await page.unroute(recordUrl);

    // Each detail mutation must refresh the filtered background after its drawer unmounts.
    const row = page.locator(`.mistake-row[data-mistake-id="${record.id}"]`);
    const detailMutations = [
        { method: 'PATCH', suffix: '', trigger: async (detail) => {
            const rating = detail.getByRole('slider', { name: '星级标记', exact: true });
            await rating.press('End');
            await rating.press('Enter');
        }, verify: () => row.getByRole('img', { name: '5 星', exact: true }).waitFor() },
        { method: 'DELETE', suffix: '', trigger: async (detail) => {
            await detail.getByRole('button', { name: '删除错题', exact: true }).click();
            await detail.getByRole('button', { name: '确认删除', exact: true }).click();
        }, verify: () => row.waitFor({ state: 'detached' }) },
        { method: 'POST', suffix: '/restore', trigger: (detail) => detail.getByRole('button', { name: '恢复错题', exact: true }).click(), verify: () => row.waitFor() },
    ];
    for (const mutation of detailMutations) {
        await completeDetailAfterClose(page, base, record.id, mutation.method, mutation.suffix, mutation.trigger);
        await mutation.verify();
        assert.equal(new URL(page.url()).hash, originalHash);
        assert.equal(await page.getByRole('textbox', { name: '搜索错题', exact: true }).inputValue(), '抽屉保留');
        assert.equal(await page.locator('.library-filter-count').textContent(), '1');
    }

    const reviewRecord = await api(context, base, 'POST', '/mistakes', { subjectId: 'math', question: '校对题目的题干', answer: '' });
    const reviewToast = await completeJobToast(page, reviewRecord, 'answer', true);
    await reviewToast.anchor.click();
    const review = page.getByRole('dialog', { name: '校对答案', exact: true });
    await review.getByRole('button', { name: '填入校对结果', exact: true }).waitFor();
    const applied = page.waitForResponse((response) => response.url().endsWith(`/ai/jobs/${reviewToast.jobId}/apply`));
    await review.getByRole('button', { name: '填入校对结果', exact: true }).click();
    assert.equal((await applied).status(), 200, 'AI review fills on its first click');
    await review.waitFor({ state: 'hidden' });
    assert.equal(await drawer.isVisible(), true, 'Filling review closes only its nested dialog');
    assert.equal((await api(context, base, 'GET', `/mistakes/${reviewRecord.id}`)).answer, reviewToast.result.answer);
    await closeDrawer(page);

    await page.goto(`${base}/mistakes/#/mistakes/${record.id}/edit`);
    await page.locator('.question-editor').fill('当前编辑器中尚未提交的题干');
    const questionNode = await page.locator('.question-editor').elementHandle();
    const editorHash = new URL(page.url()).hash;
    await page.evaluate((id) => window.dispatchEvent(new CustomEvent('mistakes:open-toast-record', { detail: { path: `/mistakes/${id}/edit?photo=answer` } })), record.id);
    await drawer.getByRole('tab', { name: '解答', exact: true }).waitFor();
    assert.equal(await drawer.getByRole('tab', { name: '解答', exact: true }).getAttribute('aria-selected'), 'true', 'Photo answer targets select the answer tab');
    assert.equal(await drawer.locator('.question-editor').evaluate((element, original) => element === original, questionNode), true, 'Promotion preserves the existing textarea node');
    assert.equal(await page.locator('.editor-workbench').count(), 1, 'Promotion creates no second editor');
    await drawer.getByRole('button', { name: '查看上传图片', exact: true }).click();
    const history = page.getByRole('dialog', { name: '之前上传的图片', exact: true });
    await history.getByText('这道题还没有上传图片。', { exact: true }).waitFor();
    await history.getByRole('button', { name: '关闭', exact: true }).click();
    await history.waitFor({ state: 'hidden' });
    await closeDrawer(page, true);
    assert.equal(new URL(page.url()).hash, editorHash);
    assert.equal(await page.locator('.record-page-slot .question-editor').evaluate((element, original) => element === original, questionNode), true, 'Swipe close restores the same editor node');
    assert.equal(await page.locator('.question-editor').inputValue(), '当前编辑器中尚未提交的题干');

    // An actual upload adopts a /new editor into its saved record URL before its real photo toast opens it.
    await page.goto(`${base}/mistakes/#/new`);
    await page.locator('.question-editor').fill('新增录题会话保留题干');
    const newNode = await page.locator('.question-editor').elementHandle();
    const png = await require('sharp')({ create: { width: 80, height: 80, channels: 3, background: '#ffffff' } }).png().toBuffer();
    await page.locator('.editor-question-block input[type="file"][multiple]').setInputFiles({ name: 'toast-upload.png', mimeType: 'image/png', buffer: png });
    const crop = page.getByRole('dialog', { name: '裁剪题目图片', exact: true });
    await crop.getByRole('button', { name: '仅保存图片', exact: true }).click();
    await crop.waitFor({ state: 'hidden' });
    const photoToast = page.locator('.Toastify__toast a.ai-toast-link[href$="/edit?photo=question"]');
    await photoToast.waitFor({ state: 'visible' });
    const adoptedHash = new URL(page.url()).hash;
    assert.match(adoptedHash, /^#\/mistakes\/\d+\/edit$/);
    await photoToast.click();
    await drawer.locator('.question-editor').waitFor();
    assert.equal(await drawer.locator('.question-editor').evaluate((element, original) => element === original, newNode), true, 'The adopted /new editor survives its real photo toast');
    assert.equal(await page.locator('.editor-workbench').count(), 1);
    await closeDrawer(page);
    assert.equal(new URL(page.url()).hash, adoptedHash);
    assert.equal(await page.locator('.record-page-slot .question-editor').evaluate((element, original) => element === original, newNode), true);
    assert.deepEqual(errors, [], 'Mobile drawer and nested dialogs produce no browser errors');
    await page.close();
}

async function main() {
    app = require('../server/app');
    const { hashPassword } = require('../server/mistakes/auth');
    userId = app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
        .run('toast_drawer_smoke', hashPassword('ToastDrawer2026!'), new Date().toISOString()).lastInsertRowid;
    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await api(mobile, base, 'POST', '/auth/login', { username: 'toast_drawer_smoke', password: 'ToastDrawer2026!' });
    await mobileChecks(mobile, base);
    await mobile.close();
    const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await api(desktop, base, 'POST', '/auth/login', { username: 'toast_drawer_smoke', password: 'ToastDrawer2026!' });
    const record = await api(desktop, base, 'POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: '桌面 toast 保持页面跳转' });
    const page = await desktop.newPage();
    await page.goto(`${base}/mistakes/#/mistakes`);
    await page.getByRole('heading', { name: '我的错题', exact: true }).waitFor();
    const completed = await completeJobToast(page, record, 'analysis');
    await completed.anchor.click();
    await page.locator('.detail-document').waitFor();
    assert.equal(new URL(page.url()).hash, `#/mistakes/${record.id}`, 'Desktop toast keeps standard route navigation');
    assert.equal(await page.locator('.record-view-drawer').count(), 0);
    await desktop.close();
    console.log('Toast drawer smoke passed: real mobile/desktop toast links, filter-preserving save/delete/restore/rating including late responses after close, first-click nested review, photo targets, same-editor and adopted /new node retention, nested image dialog and swipe close.');
}

async function cleanup() {
    await browser?.close();
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close();
    assert.equal(path.dirname(path.resolve(directory)), dataDirectory);
    assert.match(path.basename(directory), /^toast-drawer-smoke-/);
    fs.rmSync(directory, { recursive: true, force: true });
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(cleanup);

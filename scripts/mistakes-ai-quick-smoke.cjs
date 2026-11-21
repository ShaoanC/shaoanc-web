const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = path.resolve(__dirname, '../data');
const directory = fs.mkdtempSync(path.join(data, 'quick-panel-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(data, '.playwright');
const { chromium } = require('playwright');
let app, server, browser;
async function main() {
    app = require('../server/app');
    const { hashPassword } = require('../server/mistakes/auth');
    const user = app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)").run('quick_panel', hashPassword('QuickPanel2026!'), new Date().toISOString()).lastInsertRowid;
    server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    for (const width of [390, 1280]) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const api = async (method, route, body) => {
            const response = await context.request.fetch(`${base}/api/mistakes${route}`, { method, data: body });
            const result = await response.json(); assert.ok(result.success, JSON.stringify(result)); return result.data;
        };
        await api('POST', '/auth/login', { username: 'quick_panel', password: 'QuickPanel2026!' });
        const record = await api('POST', '/mistakes', { subjectId: 'math', question: '快速处理测试题', answer: '' });
        const input = Object.fromEntries(['question', 'answer', 'analysis', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds'].map(key => [key, record[key]]));
        const jobId = Number(app.db.prepare("INSERT INTO ai_jobs (mistake_id,user_id,type,status,input_json,result_json,fingerprint,created_at) VALUES (?,?,'answer','succeeded',?,?,?,?)").run(record.id, user, JSON.stringify(input), JSON.stringify({ answer: '校对后的答案', needsReview: true }), `quick-${width}`, new Date().toISOString()).lastInsertRowid);
        const page = await context.newPage();
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.route('**/api/mistakes/ai/config', route => route.fulfill({ json: { success: true, data: { enabled: true, configured: true, analysis: { enabled: true, configured: true } } } }));
        await page.goto(`${base}/mistakes/`);
        await page.locator('.navigation .nav-item').last().waitFor();
        assert.equal(await page.locator('.navigation .nav-item').count(), 5);
        assert.equal(await page.getByText('返回个人主页', { exact: true }).count(), 0);
        const trigger = page.locator('.ai-tasks-trigger:visible');
        const bounds = await trigger.boundingBox(); assert.ok(bounds.x > width / 2); assert.ok(bounds.height >= 44);
        const origin = page.url();
        const toast = page.locator('.Toastify__toast').first();
        await toast.waitFor();
        const toastBounds = await toast.boundingBox();
        const headerBounds = await page.locator(width < 961 ? '.sidebar' : '.topbar').boundingBox();
        assert.ok(toastBounds.y >= headerBounds.y + headerBounds.height + 10, 'toast clears the navigation');
        // First opening is a notification, before the quick panel has mounted its content.
        await page.evaluate(id => window.dispatchEvent(new CustomEvent('mistakes:open-ai-tasks', { detail: { path: `/ai-tasks?job=${id}&view=review` } })), jobId);
        const panel = page.getByRole('dialog', { name: 'AI 任务', exact: true });
        await panel.getByRole('button', { name: '填入校对结果', exact: true }).click();
        await panel.locator(`[data-job-id="${jobId}"]`).getByText('校对结果已填入').waitFor();
        assert.equal((await api('GET', `/mistakes/${record.id}`)).answer, '校对后的答案');
        assert.equal(page.url(), origin);
        await page.screenshot({ path: path.join(data, `ai-quick-${width}.png`) });
        await panel.getByRole('button', { name: '关闭 AI 任务' }).click();
        await panel.waitFor({ state: 'hidden' });
        // Reopened list excludes the completed item.
        await trigger.click();
        await panel.waitFor();
        assert.equal(await panel.locator(`[data-job-id="${jobId}"]`).count(), 0);
        await panel.getByRole('button', { name: '关闭 AI 任务' }).click();
        await panel.waitFor({ state: 'hidden' });
        app.db.prepare("UPDATE ai_jobs SET apply_status='pending' WHERE id=?").run(jobId);
        await page.evaluate(id => window.dispatchEvent(new CustomEvent('mistakes:open-ai-tasks', { detail: { path: `/ai-tasks?job=${id}&view=review` } })), jobId);
        await panel.getByRole('button', { name: '填入校对结果', exact: true }).waitFor();
        // Editing hands the visible strip to the text: the action bar and sheet chrome step aside for the keyboard.
        await panel.getByRole('button', { name: '编辑', exact: true }).click();
        const reviewText = panel.getByRole('textbox', { name: '校对识别文字' });
        await reviewText.focus();
        if (width < 641) {
            await page.setViewportSize({ width, height: 420 });
            await page.locator('.ai-quick-panel.is-typing').waitFor();
            assert.equal(await panel.getByRole('button', { name: '填入校对结果', exact: true }).isVisible(), false, 'keyboard hides the action bar');
            const textBox = await reviewText.boundingBox();
            assert.ok(textBox.y >= 0 && textBox.y + 80 <= 420, 'the edited text stays above the keyboard');
            await panel.getByRole('button', { name: '完成', exact: true }).click();
            await page.locator('.ai-quick-panel.is-typing').waitFor({ state: 'detached' });
            await page.setViewportSize({ width, height: 900 });
            await panel.getByRole('button', { name: '填入校对结果', exact: true }).waitFor();
        } else {
            await page.waitForTimeout(150);
            assert.equal(await page.locator('.ai-quick-panel.is-typing').count(), 0, 'a physical keyboard keeps the action bar');
        }
        await api('PATCH', `/mistakes/${record.id}`, { answer: '其他页面的新答案' });
        await panel.getByRole('button', { name: '填入校对结果', exact: true }).click();
        await panel.locator('[role="alert"]').filter({ hasText: /保留/ }).waitFor();
        assert.equal((await api('GET', `/mistakes/${record.id}`)).answer, '其他页面的新答案');
        await panel.getByRole('button', { name: '返回任务' }).click();
        const row = panel.locator(`[data-job-id="${jobId}"]`);
        await row.getByRole('button', { name: '取消任务' }).click();
        await row.getByText('已取消任务', { exact: true }).waitFor();
        await panel.getByRole('link', { name: '全部任务', exact: true }).click();
        await page.getByRole('searchbox', { name: '搜索 AI 任务' }).waitFor();
        assert.equal(await page.locator('.task-filters [role="tab"]').count(), 6);
        // Active editor session keeps its local note and uses the existing save/apply flow.
        app.db.prepare("UPDATE ai_jobs SET status='succeeded', apply_status='pending' WHERE id=?").run(jobId);
        await api('PATCH', `/mistakes/${record.id}`, { answer: '' });
        await page.goto(`${base}/mistakes/#/mistakes/${record.id}/edit`);
        await page.locator('.editor-workbench-state').waitFor();
        if (width < 641) await page.getByRole('tab', { name: '笔记', exact: true }).click();
        await page.getByRole('button', { name: '我的笔记：编辑' }).click();
        await page.getByPlaceholder('为什么会做错？下次遇到类似题目，要提醒自己什么？').fill('保留原页面的笔记');
        const editorUrl = page.url();
        await page.locator('.editor-uploaded').getByRole('button', { name: '查看 AI 任务', exact: true }).click();
        await panel.getByRole('button', { name: `本题 #${record.id}` }).waitFor();
        await panel.locator(`[data-job-id="${jobId}"]`).getByRole('button', { name: '校对并填入' }).click();
        await panel.getByRole('button', { name: '填入校对结果', exact: true }).click();
        await panel.getByText('校对结果已填入', { exact: true }).waitFor();
        await panel.getByRole('button', { name: '关闭 AI 任务' }).click();
        await panel.waitFor({ state: 'hidden' });
        assert.equal(page.url(), editorUrl);
        assert.equal(await page.getByPlaceholder('为什么会做错？下次遇到类似题目，要提醒自己什么？').inputValue(), '保留原页面的笔记');
        assert.equal((await api('GET', `/mistakes/${record.id}`)).note, '保留原页面的笔记');
        // Retry submits once and leaves the row in place for immediate feedback.
        app.db.prepare("UPDATE ai_jobs SET status='failed', error='测试失败' WHERE id=?").run(jobId);
        await page.route('**/api/mistakes/ai/jobs/batch', async route => {
            const payload = route.request().postDataJSON();
            if (payload.action !== 'retry') return route.continue();
            app.db.prepare("UPDATE ai_jobs SET status='queued', error=NULL WHERE id=?").run(jobId);
            const job = await api('GET', `/ai/jobs/${jobId}`);
            await route.fulfill({ json: { success: true, data: { jobs: [job], errors: [] } } });
        });
        await trigger.click();
        await panel.locator(`[data-job-id="${jobId}"]`).getByRole('button', { name: '重试', exact: true }).click();
        await panel.getByText('已重新加入队列', { exact: true }).waitFor();
        await panel.getByRole('button', { name: '关闭 AI 任务' }).click();
        await panel.waitFor({ state: 'hidden' });
        const icon = trigger.locator('.ai-task-icon');
        await trigger.locator('.ai-task-icon[data-phase="running"]').waitFor();
        await page.screenshot({ path: path.join(data, `ai-orbit-${width}.png`) });
        const iconBox = await icon.boundingBox();
        const orbitBox = await trigger.locator('.ai-orbit').boundingBox();
        assert.ok(orbitBox.x >= iconBox.x && orbitBox.x + orbitBox.width <= iconBox.x + iconBox.width, 'orbit stays within its reserved space');
        // Finishing closes the ring, then leaves nothing painted or animating behind.
        await page.unroute('**/api/mistakes/ai/jobs/batch');
        app.db.prepare("UPDATE ai_jobs SET status='succeeded', apply_status='pending' WHERE id=?").run(jobId);
        await trigger.locator('.ai-task-icon[data-phase="settling"]').waitFor({ timeout: 5000 });
        await trigger.locator('.ai-task-icon[data-phase="idle"]').waitFor({ timeout: 3000 });
        await page.waitForTimeout(400);
        assert.equal(await trigger.locator('.ai-orbit').evaluate((element) => getComputedStyle(element).visibility), 'hidden', 'orbit disappears once the task ends');
        assert.deepEqual(await icon.evaluate((element) => element.getAnimations({ subtree: true }).map((animation) => animation.animationName || 'transition')), [], 'no orbit animation keeps running after the task ends');

        // A tall crop has a different height before and after the image's load handler runs.
        const jpeg = await require('sharp')({ create: { width: 180, height: 720, channels: 3, background: '#fff' } }).jpeg().toBuffer();
        const photo = { name: 'tall-figure.jpg', mimeType: 'image/jpeg', buffer: jpeg };
        const uploaded = await context.request.post(`${base}/api/mistakes/mistakes/${record.id}/images`, { multipart: { original: photo, crop: photo, purpose: 'answer', clientId: `tall-figure-${width}` } });
        assert.ok(uploaded.ok(), await uploaded.text());
        const { data: image } = await uploaded.json();
        const result = { answer: '校对后的答案\n\n[[figure:tall]]', needsReview: true, figures: [{ id: 'tall', imageId: image.id, box: [0, 0, 1, 1], description: '狭长配图' }] };
        const figureJobId = app.db.prepare("INSERT INTO ai_jobs (mistake_id,user_id,type,status,input_json,image_ids,result_json,fingerprint,created_at) VALUES (?,?,'answer','succeeded',?,?,?,?,?)")
            .run(record.id, user, JSON.stringify(input), JSON.stringify([image.id]), JSON.stringify(result), `figure-${width}`, new Date().toISOString()).lastInsertRowid;
        await page.goto(origin);
        await trigger.click();
        await panel.locator(`[data-job-id="${figureJobId}"]`).getByRole('button', { name: '校对并填入' }).click();
        const figure = panel.getByRole('region', { name: '校对识别结果预览' }).locator('img[data-figure-lines="long"]');
        await figure.waitFor();
        const original = await figure.elementHandle();
        const height = await original.evaluate(element => element.offsetHeight);
        const sync = page.waitForResponse(response => new URL(response.url()).pathname === '/api/mistakes/ai/jobs');
        await page.evaluate(() => window.dispatchEvent(new Event('focus')));
        await (await sync).finished();
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await original.evaluate(element => element.isConnected && element.offsetHeight), height, 'Task sync keeps the loaded preview image and its height');
        assert.deepEqual(errors, []);
        await context.close();
        console.log(`Quick panel ${width}: navigation, first notification, apply, keyboard editing, conflict, cancel, reopening, full page, orbit settle and stable figure preview passed`);
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
    await browser?.close();
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    app?.db.close();
    assert.equal(path.dirname(directory), data);
    fs.rmSync(directory, { recursive: true, force: true });
});

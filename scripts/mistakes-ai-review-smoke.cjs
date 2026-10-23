const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dataDirectory = path.resolve(__dirname, '../data');
const directory = fs.mkdtempSync(path.join(dataDirectory, 'ai-review-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'review.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(dataDirectory, '.playwright');
const { chromium } = require('playwright');
let app, server, browser;

async function main() {
    app = require('../server/app');
    const { hashPassword } = require('../server/mistakes/auth');
    const userId = app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
        .run('ai_review_smoke', hashPassword('Review2026!'), new Date().toISOString()).lastInsertRowid;
    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
        const context = await browser.newContext({ viewport });
        async function api(method, route, data) {
            const response = await context.request.fetch(`${base}/api/mistakes${route}`, { method, data });
            const body = await response.json();
            assert.ok(response.ok() && body.success, JSON.stringify(body));
            return body.data;
        }
        await api('POST', '/auth/login', { username: 'ai_review_smoke', password: 'Review2026!' });
        for (const type of ['question', 'answer', 'analysis']) {
            const record = await api('POST', '/mistakes', { subjectId: 'math', question: type === 'question' ? '' : '已载入的题干', answer: '', analysis: '' });
            const input = Object.fromEntries(['question', 'answer', 'analysis', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds'].map((field) => [field, record[field]]));
            const result = { [type]: `已校对的${type}`, needsReview: true, subjectId: 'math', primaryPath: [], issues: [] };
            const jobId = app.db.prepare("INSERT INTO ai_jobs (mistake_id, user_id, type, status, input_json, result_json, fingerprint, created_at) VALUES (?, ?, ?, 'succeeded', ?, ?, ?, ?)")
                .run(record.id, userId, type, JSON.stringify(input), JSON.stringify(result), `${viewport.width}-${type}`, new Date().toISOString()).lastInsertRowid;
            const page = await context.newPage();
            // Jobs arrive first, while the record still shows its loading placeholder.
            let releaseRecord;
            const recordReady = new Promise((resolve) => { releaseRecord = resolve; });
            await page.route(`**/api/mistakes/mistakes/${record.id}`, async (route) => {
                if (route.request().method() === 'GET') await recordReady;
                await route.continue();
            });
            await page.goto(`${base}/mistakes/#/ai-tasks`);
            await page.locator(`[href="#/mistakes/${record.id}/edit?aiJob=${jobId}"]`).first().waitFor();
            await page.evaluate(({ recordId, jobId }) => { location.hash = `/mistakes/${recordId}/edit?aiJob=${jobId}`; }, { recordId: record.id, jobId });
            await page.locator('.editor-workbench .loading-content.is-loading').waitFor();
            releaseRecord();
            const dialog = page.getByRole('dialog');
            await dialog.getByRole('button', { name: '填入校对结果', exact: true }).waitFor();
            assert.equal(await dialog.getByRole('button', { name: '确认替换当前内容', exact: true }).count(), 0);
            const response = page.waitForResponse((response) => response.url().endsWith(`/ai/jobs/${jobId}/apply`));
            await dialog.getByRole('button', { name: '填入校对结果', exact: true }).click();
            assert.equal((await response).status(), 200, `${viewport.width}/${type}: first click fills an empty field`);
            await dialog.waitFor({ state: 'hidden' });
            assert.equal((await api('GET', `/mistakes/${record.id}`))[type], result[type]);
            // A real edit after opening review must still require explicit replacement.
            app.db.prepare("UPDATE ai_jobs SET apply_status = 'pending' WHERE id = ?").run(jobId);
            await page.reload();
            await dialog.getByRole('button', { name: '填入校对结果', exact: true }).waitFor();
            await api('PATCH', `/mistakes/${record.id}`, { [type]: '校对期间其他页面的新内容' });
            const conflict = page.waitForResponse((response) => response.url().endsWith(`/ai/jobs/${jobId}/apply`));
            await dialog.getByRole('button', { name: '填入校对结果', exact: true }).click();
            assert.equal((await conflict).status(), 409);
            assert.equal((await api('GET', `/mistakes/${record.id}`))[type], '校对期间其他页面的新内容');
            await dialog.getByRole('button', { name: '确认替换当前内容', exact: true }).waitFor();
            await page.close();
        }
        await context.close();
    }
    console.log('AI review smoke passed: desktop/mobile question, answer and analysis fill on first click; concurrent edits remain protected.');
}

async function cleanup() {
    await browser?.close();
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close();
    assert.equal(path.dirname(path.resolve(directory)), dataDirectory);
    assert.match(path.basename(directory), /^ai-review-smoke-/);
    fs.rmSync(directory, { recursive: true, force: true });
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(cleanup);

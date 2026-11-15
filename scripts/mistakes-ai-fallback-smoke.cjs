const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const directory = fs.mkdtempSync(path.resolve(__dirname, '../data/ai-fallback-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
const { chromium } = require('playwright');
const originalFetch = global.fetch;
let app, server, browser;
let failure = 'timeout';
let fallbackFailure = false;
let releaseFallback;
const calls = [];
const upgradeMarker = '[[UPGRADE_ANALYSIS_MODEL]]';
const completion = (content) => Response.json({ choices: [{ message: { content }, finish_reason: 'stop' }] });
global.fetch = async (url, options) => {
    if (!String(url).startsWith('https://ai-test.invalid/')) return originalFetch(url, options);
    options.signal.throwIfAborted();
    const request = JSON.parse(options.body);
    calls.push(request);
    if (request.model === 'primary') {
        if (failure === 'timeout') throw new DOMException('Timeout', 'TimeoutError');
        if (failure === 'cancel') throw new DOMException('Cancelled', 'AbortError');
        if (failure === 'upgrade' || failure === 'upgrade-twice') return completion(`  ${upgradeMarker}\n`);
        if (failure) return Response.json({ error: { message: 'mock error' } }, { status: Number(failure) });
    } else {
        assert.equal(options.headers.Authorization, 'Bearer stronger-secret');
        if (releaseFallback) await new Promise((resolve, reject) => {
            releaseFallback.resolve = resolve;
            options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
        });
        if (fallbackFailure) throw new DOMException('Timeout', 'TimeoutError');
        if (failure === 'upgrade-twice') return completion(upgradeMarker);
    }
    return completion('升级模型生成的解析。');
};

async function main() {
    app = require('../server/app');
    const ai = require('../server/mistakes/ai');
    const { saveConfig } = require('../server/mistakes/ai-config');
    const { hashPassword } = require('../server/mistakes/auth');
    const userId = Number(app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
        .run('fallback_admin', hashPassword('Fallback2026!'), new Date().toISOString()).lastInsertRowid);
    saveConfig({ enabled: true, baseUrl: 'https://ai-test.invalid/v1', model: 'primary', apiKey: 'primary-secret' }, 'analysis');
    const config = saveConfig({ enabled: true, baseUrl: 'https://ai-test.invalid/strong', model: 'stronger', apiKey: 'stronger-secret' }, 'analysisFallback');
    assert.equal(config.hasApiKey, true);
    assert.ok(!JSON.stringify(config).includes('stronger-secret'));
    saveConfig({ apiKey: '' }, 'analysisFallback');
    assert.throws(() => saveConfig({ baseUrl: 'https://ai-test.invalid/v1', model: 'primary' }, 'analysisFallback'), /须配置不同/);
    const time = new Date().toISOString();
    const mistakeId = Number(app.db.prepare("INSERT INTO mistakes (user_id, question, answer, analysis, created_at, updated_at) VALUES (?, '1+1?', '2', '保留已有解析', ?, ?)").run(userId, time, time).lastInsertRowid);
    const input = { question: '1+1?', answer: '2', analysis: '保留已有解析', subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [] };
    let sequence = 0;
    function create() { return ai.createJob(userId, { mistakeId, type: 'analysis', input: { ...input, question: `1+1? ${++sequence}` } }); }
    async function wait(job, predicate = (value) => ['succeeded', 'failed', 'cancelled'].includes(value.status)) {
        for (let i = 0; i < 200; i++) {
            const value = ai.serializeJob(ai.ownJob(job.id, userId));
            if (predicate(value)) return value;
            await delay(30);
        }
        throw new Error('Job did not settle');
    }
    for (const reason of ['timeout', '408', '504', 'upgrade']) {
        failure = reason;
        const before = calls.length;
        const result = await wait(create());
        assert.equal(result.status, 'succeeded');
        assert.equal(result.analysisRoute.model, 'stronger');
        assert.equal(result.model, 'stronger');
        assert.equal(result.analysisRoute.reason, reason === 'upgrade' ? 'model_request' : 'timeout');
        assert.equal(result.result.analysis, '升级模型生成的解析。');
        assert.deepEqual(calls.slice(before).map((call) => call.model), ['primary', 'stronger']);
        const [primary, stronger] = calls.slice(before);
        assert.ok(primary.messages[0].content.includes(upgradeMarker));
        assert.ok(!stronger.messages[0].content.includes(upgradeMarker));
        assert.deepEqual(primary.messages[1], stronger.messages[1], 'Routing preserves input');
    }
    for (const reason of ['', '401', 'cancel']) {
        failure = reason;
        const before = calls.length;
        const result = await wait(create());
        assert.equal(result.analysisRoute, null);
        assert.equal(result.model, 'primary');
        assert.deepEqual(calls.slice(before).map((call) => call.model), ['primary']);
    }
    failure = 'timeout'; fallbackFailure = true;
    const retry = create();
    await wait(retry, (job) => job.status === 'retrying');
    const beforeRetry = calls.length;
    fallbackFailure = false;
    app.db.prepare('UPDATE ai_jobs SET next_attempt_at = ? WHERE id = ?').run(time, retry.id);
    ai.recoverJobs();
    assert.equal((await wait(retry)).status, 'succeeded');
    assert.deepEqual(calls.slice(beforeRetry).map((call) => call.model), ['stronger'], 'Retry stays on stronger model');
    fallbackFailure = true;
    const exhausted = create();
    await wait(exhausted, (job) => job.status === 'retrying');
    app.db.prepare('UPDATE ai_jobs SET max_attempts = attempts + 1, next_attempt_at = ? WHERE id = ?').run(time, exhausted.id);
    ai.recoverJobs();
    assert.equal((await wait(exhausted)).status, 'failed', 'Fallback does not loop indefinitely');
    fallbackFailure = false;
    failure = '';
    const manual = await wait(ai.retryJob(exhausted.id, userId));
    assert.equal(manual.status, 'succeeded');
    assert.equal(manual.analysisRoute, null, 'Manual retry starts a fresh route');
    failure = 'upgrade-twice';
    const repeated = await wait(create());
    assert.equal(repeated.status, 'failed');
    assert.equal(repeated.attempts, 1);
    assert.equal(repeated.result, null);
    failure = 'timeout';
    saveConfig({ enabled: false }, 'analysisFallback');
    const disabled = create();
    assert.equal((await wait(disabled, (job) => job.status === 'retrying')).analysisRoute, null);
    ai.cancelJob(disabled.id, userId);
    failure = 'upgrade';
    const unavailable = await wait(create());
    assert.equal(unavailable.status, 'failed');
    assert.equal(unavailable.analysisRoute, null);
    assert.equal(unavailable.result, null);
    assert.match(unavailable.error, /AI 无法可靠生成解析/);
    saveConfig({ enabled: true }, 'analysisFallback');

    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
        const context = await browser.newContext({ viewport, reducedMotion: viewport.width === 390 ? 'reduce' : 'no-preference' });
        const login = await context.request.post(`${base}/api/mistakes/auth/login`, { data: { username: 'fallback_admin', password: 'Fallback2026!' } });
        assert.equal(login.status(), 200);
        const page = await context.newPage();
        await page.goto(`${base}/mistakes/#/settings`);
        await page.getByRole('tab', { name: 'AI 设置', exact: true }).click();
        const section = page.locator('.ai-profile-settings').filter({ has: page.getByRole('heading', { name: '解析模型升级', exact: true }) });
        await section.getByRole('button', { name: '保存解析模型升级配置' }).waitFor();
        assert.equal(await section.getByLabel('模型名称').inputValue(), 'stronger');
        await section.getByRole('button', { name: '保存解析模型升级配置' }).click();
        const savedToast = page.locator('.Toastify__toast').filter({ hasText: '解析模型升级配置已保存。' });
        await savedToast.locator('.Toastify__close-button').click();
        await savedToast.waitFor({ state: 'hidden' });
        let finishTest;
        const heldTest = new Promise((resolve) => { finishTest = resolve; });
        await page.route('**/admin/ai/test?profile=analysisFallback', async (route) => { await heldTest; await route.continue(); });
        await section.getByRole('button', { name: '测试升级模型', exact: true }).click();
        try {
            const spinner = page.locator('.Toastify__spinner');
            await spinner.waitFor();
            assert.equal(await spinner.evaluate((node) => getComputedStyle(node).animationIterationCount), 'infinite');
        } finally { finishTest(); }
        const testToast = page.locator('.Toastify__toast').filter({ hasText: '生成解析 API 连接测试通过。' });
        await testToast.waitFor();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
        await section.scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(os.tmpdir(), `ai-fallback-settings-${viewport.width}.png`) });
        releaseFallback = {};
        failure = viewport.width === 390 ? 'upgrade' : 'timeout';
        const routed = create();
        await wait(routed, (job) => Boolean(job.analysisRoute));
        await testToast.waitFor({ state: 'hidden' });
        await page.evaluate(() => window.dispatchEvent(new Event('mistakes:updated')));
        const reason = failure === 'upgrade' ? '常规模型请求升级' : '解析响应超时';
        await page.getByText(`记录 #${mistakeId} ${reason}，已自动切换至升级模型 stronger。`, { exact: true }).waitFor();
        await delay(400); // Let the toast entrance animation finish before capture.
        await page.screenshot({ path: path.join(os.tmpdir(), `ai-fallback-toast-${viewport.width}.png`) });
        ai.cancelJob(routed.id, userId);
        releaseFallback.resolve?.(); releaseFallback = null;
        assert.equal((await wait(routed)).status, 'cancelled');
        await page.goto(`${base}/mistakes/#/ai-tasks`);
        const task = (id) => page.locator(`.task-manager [data-job-id="${id}"]`);
        await task(routed.id).getByText('stronger', { exact: true }).waitFor();
        await task(manual.id).getByText('primary', { exact: true }).waitFor();
        await context.close();
    }
    console.log('AI analysis routing passed: model request, timeout/408/504, unrelated errors, retries, disabled fallback, cancellation, settings and toast on mobile/desktop.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    releaseFallback?.resolve?.();
    await browser?.close();
    if (app) await require('../server/mistakes/ai').stopJobs();
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close();
    global.fetch = originalFetch;
    fs.rmSync(directory, { recursive: true, force: true });
});

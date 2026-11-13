const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');

const dataDirectory = path.resolve(__dirname, '..', 'data');
const directory = fs.mkdtempSync(path.join(dataDirectory, 'draft-selection-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
let app, server, browser;

async function main() {
    for (const username of ['selection_owner', 'selection_other']) {
        const result = spawnSync(process.execPath, ['server/mistakes/create-admin.js'], {
            env: { ...process.env, MISTAKES_ADMIN_USERNAME: username, MISTAKES_ADMIN_PASSWORD: 'SelectionPassword123!' }
        });
        assert.equal(result.status, 0, result.stderr.toString());
    }
    app = require('../server/app');
    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(`${base}/api/mistakes/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'selection_owner', password: 'SelectionPassword123!' })
    });
    assert.equal(response.status, 200);
    const cookie = response.headers.getSetCookie().at(-1).split(';')[0];
    const owner = (await response.json()).data.user.id;
    const other = app.db.prepare('SELECT id FROM users WHERE username = ?').get('selection_other').id;
    const insert = app.db.prepare(`INSERT INTO mistakes (user_id, subject_id, lifecycle, question, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
    function fixture(userId, subject, lifecycle, question, deleted = false) {
        const now = new Date().toISOString();
        return Number(insert.run(userId, subject, lifecycle, question, now, now, deleted ? now : null).lastInsertRowid);
    }
    async function read(route) {
        const result = await fetch(`${base}/api/mistakes${route}`, { headers: { cookie } });
        assert.equal(result.status, 200, route);
        return (await result.json()).data;
    }
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    for (const width of [390, 1280]) {
        const marker = width === 390 ? 'Mobilebatchscope' : 'Desktopbatchscope';
        const ids = [];
        app.db.transaction(() => {
            for (let index = 0; index < 169; index++) ids.push(fixture(owner, 'math', 'draft', `${marker} 第${index}题`));
            ids.push(fixture(owner, null, 'draft', `${marker} 缺少学科`));
        })();
        const foreign = fixture(other, 'math', 'draft', marker);
        const archived = fixture(owner, 'math', 'archived', marker);
        const deleted = fixture(owner, 'math', 'draft', marker, true);
        const outside = fixture(owner, 'math', 'draft', `独立记录${width}`);
        require('../server/mistakes/search').invalidateUser(owner);
        const query = `lifecycle=draft&keyword=${encodeURIComponent(marker)}`;
        const selection = await read(`/mistakes/selection?${query}`);
        assert.deepEqual([...selection.ids].sort((a, b) => a - b), ids, 'Selection returns only matching live drafts owned by the account');
        assert.deepEqual(selection.ids, (await read(`/mistakes?${query}`)).map((item) => item.id), 'Selection follows the same search order as the list');
        const filtered = await read(`/mistakes/selection?${query}&subjectId=math&page=2&pageSize=24`);
        assert.equal(filtered.ids.length, 169, 'Selection ignores pagination and applies subject filters');
        const list = await read(`/mistakes?${query}&page=1&summary=true`);
        assert.equal(list.items.length, 24);

        const context = await browser.newContext({ viewport: { width, height: 844 } });
        context.setDefaultTimeout(15_000);
        try {
            const [name, value] = cookie.split('=');
            await context.addCookies([{ name, value, url: base }]);
            const page = await context.newPage();
            const batches = [];
            const listRequests = [];
            let failNextBatch = width === 390;
            await page.route('**/api/mistakes/mistakes?**', async (route) => {
                const url = new URL(route.request().url());
                if (failNextBatch && url.searchParams.get('keyword') === marker && url.searchParams.get('page') === '2') {
                    failNextBatch = false;
                    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ success: false, message: '模拟网络中断' }) });
                }
                await route.continue();
            });
            page.on('request', (request) => {
                const url = new URL(request.url());
                if (url.pathname === '/api/mistakes/mistakes/archive') batches.push(request.postDataJSON().ids);
                if (url.pathname === '/api/mistakes/mistakes') listRequests.push(url);
            });
            await page.goto(`${base}/mistakes/#/mistakes?lifecycle=draft`);
            await page.getByRole('button', { name: '选择题目', exact: true }).waitFor();
            await page.getByRole('textbox', { name: '搜索错题', exact: true }).fill(marker);
            await page.waitForFunction(() => document.querySelector('.results-toolbar strong')?.textContent === '170');
            await page.getByRole('button', { name: '选择题目', exact: true }).click();
            await page.getByRole('button', { name: '全选筛选结果（170）', exact: true }).click();
            await page.getByRole('button', { name: '归档所选（170）', exact: true }).waitFor();
            assert.equal(await page.locator('.mistake-row').count(), 32, 'Selecting all never renders hidden batches');
            const firstIds = await page.locator('.mistake-row').evaluateAll((rows) => rows.map((row) => row.dataset.mistakeId));
            for (const count of [64, 96, 128]) {
                await page.locator('.library-load-more').evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
                if (count === 64 && width === 390) {
                    await page.getByRole('button', { name: '重试加载', exact: true }).waitFor();
                    assert.equal(await page.locator('.mistake-row').count(), 32, 'Append failures keep existing questions');
                    await page.getByRole('button', { name: '重试加载', exact: true }).click();
                }
                await page.waitForFunction((expected) => document.querySelectorAll('.mistake-row').length === expected, count);
            }
            assert.deepEqual((await page.locator('.mistake-row').evaluateAll((rows) => rows.map((row) => row.dataset.mistakeId))).slice(0, 32), firstIds, 'Appending preserves existing order');
            assert.ok(listRequests.every((url) => url.searchParams.get('pageSize') === '32' && url.searchParams.get('summary') === 'true'), 'Every request loads 32 summaries');
            assert.ok(!listRequests.some((url) => url.searchParams.get('keyword') === marker && Number(url.searchParams.get('page')) > 4), 'The first UI page stops at 128 questions');
            await page.getByRole('button', { name: '下一页', exact: true }).click();
            await page.waitForFunction(() => document.querySelectorAll('.mistake-row.is-selected').length === 32);
            await page.locator('.library-load-more').evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
            await page.waitForFunction(() => document.querySelector('.library-pagination span')?.textContent === '第 2 / 2 页' && document.querySelectorAll('.mistake-row.is-selected').length === 42);
            assert.equal(await page.locator('.library-selection-count strong').textContent(), '170');
            await page.getByRole('checkbox', { name: '全选已加载', exact: true }).uncheck();
            await page.getByRole('button', { name: '归档所选（128）', exact: true }).waitFor();
            await page.getByRole('checkbox', { name: '全选已加载', exact: true }).check();
            await page.getByRole('button', { name: '归档所选（170）', exact: true }).waitFor();

            await page.getByRole('button', { name: '导出', exact: true }).click();
            await page.getByRole('dialog', { name: '导出错题', exact: true }).waitFor();
            const selectedScope = page.locator('input[name="export-scope"]').nth(1);
            assert.equal(await selectedScope.isChecked(), true);
            assert.match(await selectedScope.locator('..').textContent(), /170 道题/);
            await page.getByRole('button', { name: '关闭导出设置', exact: true }).click();
            await page.getByRole('dialog', { name: '导出错题', exact: true }).waitFor({ state: 'hidden' });
            await page.locator('.library-selection-toolbar').evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
            await page.screenshot({ path: path.join(dataDirectory, `draft-selection-${width}.png`), fullPage: false });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Selection controls fit the viewport');

            await page.getByRole('button', { name: '归档所选（170）', exact: true }).click();
            await page.getByRole('button', { name: '归档所选（1）', exact: true }).waitFor();
            await page.waitForFunction(() => document.querySelectorAll('.mistake-row').length === 1);
            assert.deepEqual(batches.map((batch) => batch.length), [100, 70], 'Large selections archive in bounded batches');
            assert.equal(new Set(batches.flat()).size, 170);
            assert.match(await page.locator('.library-archive-error').textContent(), /1 道未归档/);
            assert.equal((await read(`/mistakes/selection?${query}`)).ids.length, 1, 'Invalid drafts remain selected for correction');
            for (const id of [foreign, deleted, outside]) {
                assert.equal(app.db.prepare('SELECT lifecycle FROM mistakes WHERE id = ?').get(id).lifecycle, 'draft', 'Unselected records are untouched');
            }
            assert.equal(app.db.prepare('SELECT lifecycle FROM mistakes WHERE id = ?').get(archived).lifecycle, 'archived');
            await page.getByRole('textbox', { name: '搜索错题', exact: true }).fill(`独立记录${width}`);
            await page.waitForFunction(() => document.querySelector('.library-selection-count strong')?.textContent === '0');
        } finally { await context.close(); }
    }
    console.log('Draft selection smoke passed: 32-item automatic batches, append retry, 128-item page cap, filtered cross-page selection, exports and retained archive failures on mobile/desktop.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    await browser?.close();
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close();
    assert.equal(path.dirname(path.resolve(directory)), dataDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const dataDirectory = path.resolve(__dirname, '..', 'data');
const directory = fs.mkdtempSync(path.join(dataDirectory, 'filter-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(dataDirectory, '.playwright');
if (process.env.CHROMIUM_PATH) process.env.MISTAKES_PDF_EXECUTABLE_PATH = process.env.CHROMIUM_PATH;
const { chromium } = require('playwright');
let app, server, browser;

async function main() {
    const password = 'FilterSmoke2026!';
    const bootstrap = spawnSync(process.execPath, ['server/mistakes/create-admin.js'], {
        env: { ...process.env, MISTAKES_ADMIN_USERNAME: 'filter_owner', MISTAKES_ADMIN_PASSWORD: password }
    });
    assert.equal(bootstrap.status, 0, bootstrap.stderr.toString());
    app = require('../server/app');
    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    let cookie = '';
    async function api(method, route, body) {
        const response = await fetch(`${base}/api/mistakes${route}`, {
            method, headers: { cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) },
            ...(body ? { body: JSON.stringify(body) } : {})
        });
        for (const value of response.headers.getSetCookie()) cookie = value.split(';')[0];
        assert.ok(response.ok, `${method} ${route}: ${await response.clone().text()}`);
        return (await response.json()).data;
    }
    await api('POST', '/auth/login', { username: 'filter_owner', password });
    const points = await api('GET', '/knowledge-points');
    const math = points.find((point) => point.subjectId === 'math' && point.parentId);
    const physics = points.find((point) => point.subjectId === 'physics' && point.parentId);
    function pointLabel(point) {
        return point.parentId ? `${pointLabel(points.find((item) => item.id === point.parentId))} / ${point.name}` : point.name;
    }
    const records = [];
    for (const [subjectId, question, point, rating, result] of [
        ['math', '多选数学A', math, 0, null],
        ['math', '多选数学B', math, 3.5, 'familiar'],
        ['physics', '多选物理', physics, 4.5, 'unknown'],
        ['english', '多选英语', null, 2.5, 'mastered']
    ]) {
        const record = await api('POST', '/mistakes', { subjectId, question, rating, lifecycle: 'archived', primaryKnowledgePointId: point?.id || null });
        if (result) await api('POST', `/mistakes/${record.id}/reviews`, { result });
        records.push(record);
    }
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    for (const width of [390, 1280]) {
        const mobile = width === 390;
        await api('PATCH', `/mistakes/${records[0].id}`, { rating: 0 });
        const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: mobile });
        context.setDefaultTimeout(12_000);
        try {
            const [name, value] = cookie.split('=');
            await context.addCookies([{ name, value, url: base }]);
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));
            const count = (expected) => page.waitForFunction((number) => document.querySelector('.results-toolbar strong')?.textContent === String(number), expected);
            async function openFilters() {
                if (mobile) await page.getByRole('button', { name: /^筛选错题/ }).click();
            }
            async function select(label, labels, review = false) {
                await page.getByRole('button', { name: new RegExp(`^${review ? `复习${label}` : `按${label}筛选`}：`) }).click();
                const list = page.getByRole('listbox');
                assert.equal(await list.getAttribute('aria-multiselectable'), 'true');
                const search = page.getByRole('combobox');
                for (const item of labels) {
                    if (label === '知识点') await search.fill(item);
                    await list.getByRole('option', { name: item, exact: true }).click();
                    assert.equal(await list.isVisible(), true, 'Multi-select remains open after choosing');
                }
                await page.keyboard.press('Escape');
            }
            async function apply() {
                if (mobile) {
                    await page.getByRole('button', { name: '应用筛选', exact: true }).click();
                    await page.getByRole('dialog', { name: '筛选错题', exact: true }).waitFor({ state: 'hidden' });
                }
            }
            await page.goto(`${base}/mistakes/#/mistakes`);
            await count(4);
            await openFilters();
            await select('学科', ['数学', '物理', '物理', '物理']);
            assert.match(await page.getByRole('button', { name: /^按学科筛选：/ }).getAttribute('aria-label'), /数学、物理/);
            if (mobile) assert.equal(await page.locator('.results-toolbar strong').textContent(), '4', 'Mobile changes wait for Apply');
            await apply();
            await count(3);
            if (mobile) assert.equal(await page.locator('.library-filter-count').textContent(), '1');

            await openFilters();
            await select('知识点', [pointLabel(math), pointLabel(physics)]);
            await select('学科', ['数学']);
            assert.equal(await page.getByRole('button', { name: /^按知识点筛选：/ }).getAttribute('aria-label'), `按知识点筛选：${pointLabel(physics)}`,
                'Removing a subject drops only its selected knowledge points');
            await apply();
            await count(1);
            await openFilters();
            await select('学科', ['全部学科']);
            assert.match(await page.getByRole('button', { name: /^按知识点筛选：/ }).getAttribute('aria-label'), new RegExp(physics.name), 'Unlimited subjects preserve selected knowledge');
            await select('知识点', ['全部知识点']);
            await select('掌握程度', ['未复习', '不会']);
            await select('星级', ['未标记', '4.5 星']);
            await apply();
            await count(2);
            if (mobile) {
                assert.equal(await page.locator('.library-filter-count').textContent(), '2', 'Badge counts filter categories');
                await openFilters();
                await select('学科', ['英语']);
                await page.getByRole('button', { name: '关闭筛选', exact: true }).click();
                await page.getByRole('dialog', { name: '筛选错题', exact: true }).waitFor({ state: 'hidden' });
                await openFilters();
                assert.equal(await page.getByRole('button', { name: /^按学科筛选：/ }).getAttribute('aria-label'), '按学科筛选：全部学科', 'Closing discards unapplied changes');
                await select('星级', []);
                await page.getByRole('button', { name: /^按星级筛选：/ }).click();
                await page.screenshot({ path: path.join(dataDirectory, `filter-multiselect-${width}.png`), animations: 'disabled' });
                await page.keyboard.press('Escape');
                await apply();
            } else {
                await page.getByRole('button', { name: /^按星级筛选：/ }).click();
                await page.screenshot({ path: path.join(dataDirectory, `filter-multiselect-${width}.png`), animations: 'disabled' });
                await page.keyboard.press('Escape');
            }
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Filters fit the viewport');

            await page.getByRole('button', { name: '导出', exact: true }).click();
            const responsePromise = page.waitForResponse((response) => response.url().endsWith('/exports/pdf'));
            const downloadPromise = page.waitForEvent('download');
            await page.getByRole('button', { name: '下载 PDF', exact: true }).click();
            const response = await responsePromise;
            assert.equal(response.status(), 200);
            assert.equal(response.headers()['x-export-question-count'], '2');
            const source = response.request().postDataJSON().source;
            assert.equal(source.filters.rating, '0,4.5');
            assert.equal(source.filters.status, 'unknown,unreviewed');
            const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const download = await downloadPromise;
            const pdfTask = getDocument({ data: new Uint8Array(fs.readFileSync(await download.path())) });
            const document = await pdfTask.promise;
            let text = '';
            for (let number = 1; number <= document.numPages; number++) text += (await (await document.getPage(number)).getTextContent()).items.map((item) => item.str || '').join('');
            assert.ok(text.includes('多选数学A') && text.includes('多选物理') && !text.includes('多选数学B') && !text.includes('多选英语'), 'PDF contains exactly the filtered questions');
            await pdfTask.destroy();
            await page.getByRole('button', { name: '关闭导出设置', exact: true }).click();
            await page.getByRole('dialog', { name: '导出错题', exact: true }).waitFor({ state: 'hidden' });

            const row = page.locator(`[data-mistake-id="${records[0].id}"]`);
            async function rate(value) {
                if (mobile) {
                    await row.scrollIntoViewIfNeeded();
                    const box = await row.boundingBox();
                    const session = await context.newCDPSession(page);
                    const y = box.y + box.height / 2;
                    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 20, y }] });
                    for (let step = 1; step <= 10; step++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + 20 + step * 18, y }] });
                    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
                    await session.detach();
                } else await row.getByRole('button', { name: '调整星级', exact: true }).click();
                const slider = page.getByRole('slider', { name: '星级标记', exact: true });
                await slider.press('Home');
                for (let step = 0; step < value * 2; step++) await slider.press('ArrowRight');
                const saved = page.waitForResponse((response) => response.request().method() === 'PATCH' && response.url().endsWith(`/mistakes/${records[0].id}`));
                await slider.press('Enter');
                assert.equal((await saved).status(), 200);
                await slider.waitFor({ state: 'hidden' });
                if (mobile) await page.waitForFunction((id) => {
                    const element = document.querySelector(`[data-mistake-id="${id}"]`);
                    return !element || element.dataset.ratingPhase === 'idle';
                }, records[0].id);
            }
            await rate(4.5);
            await count(2);
            assert.equal(await row.count(), 1, 'Changing to another selected star level retains the row');
            await rate(3.5);
            await count(1);
            assert.equal(await row.count(), 0, 'Changing outside the selected levels removes the row');

            await page.getByRole('button', { name: '清除筛选', exact: true }).click();
            await count(4);
            await page.goto(`${base}/mistakes/#/review`);
            await page.locator('.review-candidate').first().waitFor();
            await select('学科', ['数学', '物理'], true);
            await select('掌握程度', ['未复习', '不会'], true);
            await select('星级', ['3.5 星', '4.5 星'], true);
            await page.waitForFunction(() => document.querySelectorAll('.review-candidate').length === 2);
            await page.getByRole('checkbox', { name: '全选当前结果', exact: true }).check();
            assert.equal(await page.locator('.selection-toolbar strong').textContent(), '2');
            await select('学科', ['数学'], true);
            await page.waitForFunction(() => document.querySelectorAll('.review-candidate').length === 1 && document.querySelector('.selection-toolbar strong')?.textContent === '1');
            const subjectTrigger = page.getByRole('button', { name: /^复习学科：/ });
            await subjectTrigger.press('Home');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Space');
            assert.equal(await page.getByRole('option', { name: '数学', exact: true }).getAttribute('aria-selected'), 'true');
            await page.keyboard.press('Space');
            assert.equal(await page.getByRole('option', { name: '数学', exact: true }).getAttribute('aria-selected'), 'false');
            await page.keyboard.press('Escape');
            assert.equal(await subjectTrigger.evaluate((element) => element === document.activeElement), true, 'Escape restores trigger focus');
            assert.deepEqual(errors, [], 'No client runtime errors');
        } finally { await context.close(); }
    }
    console.log('Filter smoke passed: mobile/desktop continuous selection, subject/knowledge linkage, apply/cancel, PDF contents, rating membership and review selection.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    await browser?.close();
    if (app) await require('../server/mistakes/pdf-export').closePdfBrowser();
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close();
    assert.equal(path.dirname(path.resolve(directory)), dataDirectory);
    fs.rmSync(directory, { recursive: true, force: true });
});

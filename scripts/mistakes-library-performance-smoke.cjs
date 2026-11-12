const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'library-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
let server, app;
(async () => {
    for (const username of ['library_test', 'library_other']) {
        const bootstrap = spawnSync(process.execPath, ['server/mistakes/create-admin.js'], { env: { ...process.env, MISTAKES_ADMIN_USERNAME: username, MISTAKES_ADMIN_PASSWORD: 'TestingPassword123!' } });
        assert.equal(bootstrap.status, 0, bootstrap.stderr.toString());
    }
    app = require('../server/app');
    server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    let cookie;
    async function request(route, body, status = 200) {
        const response = await fetch(`${base}/api/mistakes${route}`, { method: body ? 'POST' : 'GET', headers: { ...(cookie ? { cookie } : {}), ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
        cookie = response.headers.getSetCookie().at(-1)?.split(';')[0] || cookie;
        assert.equal(response.status, status, route);
        return (await response.json()).data;
    }
    await request('/auth/login', { username: 'library_test', password: 'TestingPassword123!' });
    const subjects = await request('/subjects');
    const good = await request('/mistakes', { question: '测试', subjectId: subjects[0].id }, 201);
    const draft = await request('/mistakes', {}, 201);
    const result = await request('/mistakes/archive', { ids: [good.id, draft.id, 999999] });
    assert.deepEqual(result.archivedIds, [good.id]); assert.equal(result.failures.length, 2);
    assert.deepEqual((await request('/mistakes/archive', { ids: [good.id, good.id] })).archivedIds, [good.id]);
    assert.equal((await request(`/mistakes/${good.id}`)).question, '测试');
    const jpeg = await require('sharp')({ create: { width: 2000, height: 1000, channels: 3, background: '#aabbcc' } }).jpeg().toBuffer();
    const form = new FormData();
    for (const name of ['original', 'crop']) form.append(name, new Blob([jpeg], { type: 'image/jpeg' }), 'test.jpg');
    form.append('purpose', 'question'); form.append('clientId', 'source');
    const source = await request(`/mistakes/${draft.id}/images`, form, 201);
    const library = await request('/photo-library'); assert.equal(library.items.length, 1);
    const key = library.items[0].key;
    const thumbUrl = `${base}/api/mistakes/photo-library/${key}/thumb`;
    const thumb = await fetch(thumbUrl, { headers: { cookie } });
    assert.equal(thumb.status, 200);
    assert.equal((await require('sharp')(Buffer.from(await thumb.arrayBuffer())).metadata()).width, 400);
    assert.equal((await fetch(thumbUrl, { cache: 'force-cache', headers: { cookie, 'If-None-Match': thumb.headers.get('etag') } })).status, 304);
    assert.equal((await fetch(thumbUrl)).status, 401);
    const params = { key, crop: { x: 0, y: 0, width: 50, height: 100 }, rotation: 1, purpose: 'question', clientId: 'reuse' };
    const copy = await request(`/mistakes/${good.id}/reuse-photo`, params, 201);
    assert.equal((await request(`/mistakes/${good.id}/reuse-photo`, params)).id, copy.id);
    const crop = await fetch(`${base}${copy.cropUrl}`, { headers: { cookie } });
    const dimensions = await require('sharp')(Buffer.from(await crop.arrayBuffer())).metadata();
    assert.equal(dimensions.width, 500); assert.equal(dimensions.height, 2000);
    await request(`/mistakes/${good.id}/reuse-photo`, { ...params, clientId: 'bad', crop: { x: -1, y: 0, width: 50, height: 100 } }, 400);
    const ownerCookie = cookie;
    cookie = undefined;
    await request('/auth/login', { username: 'library_other', password: 'TestingPassword123!' });
    assert.equal((await request('/photo-library')).items.length, 0);
    assert.equal((await fetch(thumbUrl, { headers: { cookie } })).status, 404);
    assert.equal((await request('/mistakes/archive', { ids: [good.id] })).failures.length, 1);
    const other = await request('/mistakes', {}, 201);
    await request(`/mistakes/${other.id}/reuse-photo`, { ...params, clientId: 'foreign' }, 404);
    cookie = ownerCookie;
    const insert = app.db.prepare(`INSERT INTO mistake_images (mistake_id, user_id, purpose, client_id, original_name, original_path, crop_path, created_at)
        SELECT mistake_id, user_id, purpose, ?, original_name, original_path, crop_path, created_at FROM mistake_images WHERE id = ?`);
    const extras = [];
    for (let i = 0; i < 25; i++) extras.push(Number(insert.run(`paging-${i}`, source.id).lastInsertRowid));
    const firstPage = await request('/photo-library');
    const nextPage = await request(`/photo-library?cursor=${firstPage.nextCursor}`);
    assert.equal(firstPage.items.length, 24);
    assert.equal(new Set([...firstPage.items, ...nextPage.items].map((item) => item.key)).size, 27);
    for (const id of extras) app.db.prepare('DELETE FROM mistake_images WHERE id = ?').run(id);
    for (const suffix of ['', '/permanent']) {
        assert.equal((await fetch(`${base}/api/mistakes/mistakes/${draft.id}${suffix}`, { method: 'DELETE', headers: { cookie } })).status, 200);
    }
    assert.equal((await fetch(`${base}${copy.originalUrl}`, { headers: { cookie } })).status, 200, 'Copy survives permanent source deletion');
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    try {
        for (const width of [390, 1280]) {
            const context = await browser.newContext({ viewport: { width, height: 844 } });
            const [name, value] = cookie.split('=');
            await context.addCookies([{ name, value, url: base }]);
            const page = await context.newPage();
            const originals = [];
            page.on('request', (request) => { if (/\/images\/\d+\/original/.test(request.url())) originals.push(request.url()); });
            await page.goto(`${base}/mistakes/#/new`);
            await page.getByRole('button', { name: '选择已上传的照片', exact: true }).first().click();
            await page.locator('.photo-library-photo').first().click();
            await page.getByRole('button', { name: '右转 90°', exact: true }).waitFor();
            await page.waitForFunction(() => { const button = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('右转 90°')); return button && !button.disabled; });
            await page.getByRole('button', { name: '右转 90°', exact: true }).click();
            await page.waitForFunction(() => { const button = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('右转 90°')); return button && !button.disabled; });
            assert.equal(originals.length, 0, 'Picker and rotation never download the original');
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await context.close();
        }
    } finally { await browser.close(); }
    console.log('Library performance smoke passed: batch results, paging, thumbnail cache/auth, crop rotation, retries, source deletion, mobile and desktop picker.');
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
    app?.db.close(); fs.rmSync(directory, { recursive: true, force: true });
});

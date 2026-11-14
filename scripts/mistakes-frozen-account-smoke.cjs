const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const directory = fs.mkdtempSync(path.join(root, 'data', 'frozen-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(directory, 'db.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'uploads');
process.env.MISTAKES_BACKUPS_PATH = path.join(directory, 'backups');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
const app = require('../server/app');
const { hashPassword } = require('../server/mistakes/auth');
const { cleanupExpiredTrash } = require('../server/mistakes/trash');
const password = 'FrozenSmoke2026!';
let server, browser;

async function run() {
    const db = app.db;
    const now = new Date().toISOString();
    const insertUser = db.prepare('INSERT INTO users (username,password_hash,role,created_at) VALUES (?,?,?,?)');
    const hash = hashPassword(password);
    const adminId = Number(insertUser.run('frozen_admin', hash, 'admin', now).lastInsertRowid);
    const userId = Number(insertUser.run('frozen_user', hash, 'user', now).lastInsertRowid);
    const otherId = Number(insertUser.run('other_user', hash, 'user', now).lastInsertRowid);
    const insertMistake = db.prepare("INSERT INTO mistakes (user_id, question, note, created_at, updated_at, deleted_at) VALUES (?,?,?,?,?,?)");
    const mistakeId = Number(insertMistake.run(userId, '我的错题', '我的笔记', now, now, '2020-01-01T00:00:00.000Z').lastInsertRowid);
    const otherMistake = Number(insertMistake.run(otherId, 'PRIVATE_OTHER_QUESTION', '', now, now, null).lastInsertRowid);
    fs.mkdirSync(process.env.MISTAKES_UPLOADS_PATH);
    fs.writeFileSync(path.join(process.env.MISTAKES_UPLOADS_PATH, 'own.jpg'), 'own image');
    fs.writeFileSync(path.join(process.env.MISTAKES_UPLOADS_PATH, 'other.jpg'), 'private image');
    const insertImage = db.prepare("INSERT INTO mistake_images (mistake_id,user_id,purpose,client_id,original_name,original_path,crop_path,created_at) VALUES (?,?,'question',?,'photo.jpg',?,?,?)");
    const imageId = Number(insertImage.run(mistakeId, userId, 'own', 'own.jpg', 'own.jpg', now).lastInsertRowid);
    insertImage.run(otherMistake, otherId, 'other', 'other.jpg', 'other.jpg', now);
    db.prepare('UPDATE mistakes SET question = ? WHERE id = ?').run(`我的错题 ![图](${imageId})`, mistakeId);
    db.prepare("INSERT INTO reviews (mistake_id,result,created_at) VALUES (?,'familiar',?)").run(mistakeId, now);
    db.prepare("INSERT INTO knowledge_points (subject_id,name,owner_user_id) VALUES ('math','我的知识点',?)").run(userId);
    db.prepare("INSERT INTO knowledge_points (subject_id,name,owner_user_id) VALUES ('math','PRIVATE_OTHER_POINT',?)").run(otherId);
    server = await new Promise((resolve) => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const base = `${origin}/api/mistakes`;
    function client() {
        let cookie = '';
        return async (route, method = 'GET', body, status = 200) => {
            const response = await fetch(base + route, { method, headers: { Cookie: cookie, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
            for (const value of response.headers.getSetCookie()) cookie = value.split(';')[0];
            assert.equal(response.status, status, route);
            return response;
        };
    }
    const user = client(), admin = client(), anonymous = client();
    await user('/auth/login', 'POST', { username: 'frozen_user', password });
    await admin('/auth/login', 'POST', { username: 'frozen_admin', password });
    await admin(`/admin/users/${userId}`, 'PATCH', { active: false });
    assert.equal((await (await user('/auth/me')).json()).data.user.active, false);
    assert.equal((await (await user('/mistakes', 'GET', null, 403)).json()).code, 'ACCOUNT_FROZEN');
    await user(`/mistakes/${mistakeId}`, 'PATCH', { note: 'blocked' }, 403);
    await user('/admin/backups', 'GET', null, 403);
    await user(`/images/${imageId}/crop`, 'GET', null, 403);
    await anonymous('/auth/data-export', 'GET', null, 401);
    await anonymous('/auth/login', 'POST', { username: 'frozen_user', password: 'WrongPassword!' }, 401);
    await user('/auth/login', 'POST', { username: 'frozen_user', password });
    cleanupExpiredTrash();
    assert.ok(db.prepare('SELECT id FROM mistakes WHERE id = ?').get(mistakeId), 'Frozen trash is retained');
    const response = await user(`/auth/data-export?userId=${otherId}`);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.equal(response.headers.get('content-type'), 'application/zip');
    assert.match(response.headers.get('content-disposition'), /shiti-my-data-\d{4}-\d{2}-\d{2}\.zip/);
    const archive = path.join(directory, 'export.zip');
    fs.writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
    const extracted = path.join(directory, 'extracted');
    fs.mkdirSync(extracted);
    if (process.platform === 'win32') {
        execFileSync('tar.exe', ['-xf', archive, '-C', extracted]);
    } else {
        execFileSync('unzip', ['-q', archive, '-d', extracted]);
    }
    const text = fs.readFileSync(path.join(extracted, 'data.json'), 'utf8');
    const data = JSON.parse(text);
    assert.equal(data.account.id, userId);
    assert.equal(data.mistakes.length, 1);
    assert.equal(data.reviews.length, 1);
    assert.equal(data.mistakes[0].note, '我的笔记');
    assert.doesNotMatch(text, /PRIVATE_OTHER|password_hash|token_hash/);
    assert.deepEqual(fs.readdirSync(path.join(extracted, 'images')), ['own.jpg']);
    assert.match(fs.readFileSync(path.join(extracted, 'mistakes', `${mistakeId}.md`), 'utf8'), /\.\.\/images\/own.jpg/);

    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
    for (const width of [390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`${origin}/mistakes/`);
        await page.getByLabel('用户名', { exact: true }).fill('frozen_user');
        await page.getByLabel('密码', { exact: true }).fill(password);
        await page.getByRole('button', { name: '登录', exact: true }).click();
        await page.getByRole('heading', { name: '您的账号已被冻结' }).waitFor();
        await page.reload();
        await page.getByRole('heading', { name: '您的账号已被冻结' }).waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.route('**/auth/data-export', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: '模拟下载失败' }) }), { times: 1 });
        await page.getByRole('button', { name: '下载我的数据' }).click();
        await page.getByRole('alert').filter({ hasText: '模拟下载失败' }).waitFor();
        const download = page.waitForEvent('download');
        await page.getByRole('button', { name: '下载我的数据' }).click();
        const downloaded = await download;
        assert.equal(await downloaded.failure(), null);
        assert.match(downloaded.suggestedFilename(), /^shiti-my-data-\d{4}-\d{2}-\d{2}\.zip$/);
        await page.screenshot({ path: path.join(root, 'data', `frozen-account-${width}.png`), fullPage: true });
        await page.getByRole('button', { name: '退出登录' }).click();
        await page.getByRole('button', { name: '登录', exact: true }).waitFor();
        assert.deepEqual(errors, []);
        await context.close();
    }
    await admin(`/admin/users/${userId}`, 'PATCH', { active: true });
    await user('/subjects');
    await user('/auth/logout', 'POST', {});
    await user('/auth/data-export', 'GET', null, 401);
    assert.ok(adminId);
    console.log('Frozen account smoke passed: restricted login, owner-only archive, retained trash, reactivation, mobile/desktop download/retry/logout.');
}

run().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    await browser?.close();
    await require('../server/mistakes/ai').stopJobs();
    if (server) await new Promise((resolve) => server.close(resolve));
    app.db.close();
    assert.equal(path.dirname(directory), path.join(root, 'data'));
    fs.rmSync(directory, { recursive: true, force: true });
});

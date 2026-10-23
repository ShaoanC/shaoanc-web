const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const Database = require('better-sqlite3');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const directory = fs.mkdtempSync(path.join(root, 'data', 'backup-smoke-'));
const paths = {
    databasePath: path.join(directory, 'source.sqlite'), uploadsPath: path.join(directory, 'images'),
    backupsPath: path.join(directory, 'backups'), envPath: path.join(directory, '.env'), aiConfigPath: path.join(directory, '.env.ai')
};
Object.assign(process.env, {
    NODE_ENV: 'test', FRIENDLY_CAPTCHA_ENABLED: 'false', MISTAKES_DB_PATH: paths.databasePath,
    MISTAKES_UPLOADS_PATH: paths.uploadsPath, MISTAKES_BACKUPS_PATH: paths.backupsPath,
    MISTAKES_ENV_PATH: paths.envPath, MISTAKES_AI_CONFIG_PATH: paths.aiConfigPath
});
fs.writeFileSync(paths.envPath, 'BACKUP_TEST_SECRET=server-test-secret\nMISTAKES_DB_PATH=/old/server/database.sqlite\n');
let app, server, provider, releaseAi;
let calls = 0, aborted = false;
const listen = (handler) => new Promise((resolve) => { const listener = handler.listen(0, '127.0.0.1', () => resolve(listener)); });
const close = (listener) => listener && new Promise((resolve) => { listener.closeAllConnections(); listener.close(resolve); });
async function until(check) {
    for (let attempt = 0; attempt < 300; attempt += 1) {
        if (await check()) return;
        await delay(20);
    }
    throw new Error('等待备份状态超时');
}

async function run() {
    try {
        provider = await listen(http.createServer(async (req, res) => {
            for await (const chunk of req) { /* Consume the local mock request. */ }
            calls += 1;
            res.on('close', () => { if (!res.writableEnded) aborted = true; });
            await new Promise((resolve) => { releaseAi = resolve; });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ choices: [{ message: { content: '两边减去 2，得到 x=3。' }, finish_reason: 'stop' }] }));
        }));
        app = require('../server/app');
        const db = app.db;
        const ai = require('../server/mistakes/ai');
        const coordination = require('../server/mistakes/backup-coordination');
        const { hashPassword } = require('../server/mistakes/auth');
        const { saveConfig } = require('../server/mistakes/ai-config');
        const { createBackupService, nextDailyRun } = require('../server/mistakes/backups');
        const { extractAndValidate } = require('../server/mistakes/backup-archive');
        const { restoreBackup } = require('../server/mistakes/backup-restore');
        const { acquireRuntimeLock } = require('../server/mistakes/runtime-lock');
        const now = new Date().toISOString();
        const password = 'BackupSmoke2026!';
        const insertUser = db.prepare('INSERT INTO users (username,password_hash,role,created_at) VALUES (?,?,?,?)');
        const adminId = Number(insertUser.run('backup_admin', hashPassword(password), 'admin', now).lastInsertRowid);
        insertUser.run('backup_user', hashPassword(password), 'user', now);
        saveConfig({ enabled: true, baseUrl: `http://127.0.0.1:${provider.address().port}/v1`, model: 'mock-backup', apiKey: 'ai-test-secret' }, 'analysis');
        const insertMistake = db.prepare("INSERT INTO mistakes (user_id,subject_id,lifecycle,question,answer,created_at,updated_at,deleted_at) VALUES (?,'math','archived',?,?,?,?,?)");
        const mistakeId = Number(insertMistake.run(adminId, '求解 x+2=5', 'x=3', now, now, null).lastInsertRowid);
        const old = new Date(Date.now() - 45 * 86400000).toISOString();
        const trashId = Number(insertMistake.run(adminId, '回收站中的原题', '', now, now, old).lastInsertRowid);
        db.prepare("INSERT INTO reviews (mistake_id,result,created_at) VALUES (?,'familiar',?)").run(mistakeId, now);
        fs.mkdirSync(paths.uploadsPath, { recursive: true });
        const jpeg = await sharp({ create: { width: 100, height: 100, channels: 3, background: 'white' } }).jpeg().toBuffer();
        fs.writeFileSync(path.join(paths.uploadsPath, 'shared-page.jpg'), jpeg);
        fs.writeFileSync(path.join(paths.uploadsPath, 'crop.jpg'), jpeg);
        const nextAttempt = new Date(Date.now() + 86400000).toISOString();
        const pageId = Number(db.prepare("INSERT INTO page_imports (user_id,client_id,batch_id,original_name,image_path,width,height,status,created_at,next_attempt_at) VALUES (?,'page','batch','试卷.jpg','shared-page.jpg',100,100,'retrying',?,?)").run(adminId, now, nextAttempt).lastInsertRowid);
        const insertImage = db.prepare("INSERT INTO mistake_images (mistake_id,user_id,purpose,client_id,original_name,original_path,crop_path,page_import_id,created_at) VALUES (?,?,'question',?,'试卷.jpg','shared-page.jpg',?,?,?)");
        insertImage.run(mistakeId, adminId, 'shared-1', 'crop.jpg', pageId, now);
        insertImage.run(trashId, adminId, 'shared-2', 'shared-page.jpg', pageId, now);
        db.prepare("INSERT INTO page_import_items (page_import_id,region_id,mistake_id,status,crop_path,region_json,input_json) VALUES (?,'region',?,'preparing','pending.jpg',?,?)")
            .run(pageId, mistakeId, JSON.stringify({ box: [0, 0, 1, 1], label: '1' }), JSON.stringify(ai.inputFor(db.prepare('SELECT * FROM mistakes WHERE id=?').get(mistakeId))));
        db.prepare("INSERT INTO ai_jobs (mistake_id,user_id,type,status,input_json,fingerprint,created_at,next_attempt_at) VALUES (?,?,'analysis','retrying',?,'pending-restore',?,?)")
            .run(mistakeId, adminId, JSON.stringify(ai.inputFor(db.prepare('SELECT * FROM mistakes WHERE id=?').get(mistakeId))), now, nextAttempt);
        server = await listen(app);
        const base = `http://127.0.0.1:${server.address().port}/api/mistakes`;
        function client() {
            let cookie = '';
            return async (method, route, body, status = 200) => {
                const response = await fetch(base + route, { method, headers: { Cookie: cookie, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
                for (const setCookie of response.headers.getSetCookie()) cookie = setCookie.split(';')[0];
                if (route.endsWith('/download') && status === 200) {
                    assert.equal(response.status, status);
                    assert.match(response.headers.get('cache-control'), /no-store/);
                    return Buffer.from(await response.arrayBuffer());
                }
                const payload = await response.json();
                assert.equal(response.status, status, `${method} ${route}: ${JSON.stringify(payload)}`);
                return status < 400 ? payload.data : payload;
            };
        }
        const admin = client(), user = client(), anonymous = client();
        await anonymous('GET', '/admin/backups', undefined, 401);
        await admin('POST', '/auth/login', { username: 'backup_admin', password });
        await user('POST', '/auth/login', { username: 'backup_user', password });
        await user('GET', '/admin/backups', undefined, 403);
        await user('POST', '/admin/backups', {}, 403);
        assert.equal((await admin('GET', '/admin/backups/settings')).enabled, false);

        // A genuine in-flight AI request must finish naturally before the snapshot.
        const active = ai.createJob(adminId, { mistakeId, type: 'analysis', input: ai.inputFor(db.prepare('SELECT * FROM mistakes WHERE id=?').get(mistakeId)) });
        await until(() => releaseAi);
        assert.ok(fs.statSync(`${paths.databasePath}-wal`).size > 0);
        const service = app.getBackupService();
        const task = await admin('POST', '/admin/backups', {}, 202);
        assert.equal((await admin('GET', '/system/status')).readOnly, true);
        assert.equal((await admin('PATCH', `/mistakes/${mistakeId}`, { note: '应被保留在编辑器' }, 503)).code, 'BACKUP_READ_ONLY');
        await admin('POST', '/admin/backups', {}, 409);
        await admin('GET', `/mistakes/${mistakeId}`);
        assert.ok(db.prepare('SELECT id FROM mistakes WHERE id=?').get(trashId), 'GET 清理在备份阶段暂停');
        assert.equal(service.list().current.id, task.id);
        releaseAi();
        await service.awaitIdle();
        assert.equal(aborted, false);
        assert.equal(calls, 1);
        assert.equal(coordination.isReadOnly(), false);
        assert.equal(service.list().backups[0].status, 'completed');
        assert.equal(db.prepare('SELECT status FROM ai_jobs WHERE id=?').get(active.id).status, 'succeeded');
        const archive = service.download(task.id);
        assert.ok((await admin('GET', `/admin/backups/${task.id}/download`)).length > 0);
        const extracted = path.join(directory, 'verify');
        await extractAndValidate(archive, extracted);
        const snapshot = new Database(path.join(extracted, 'db.sqlite'), { readonly: true });
        assert.equal(snapshot.prepare('SELECT COUNT(*) AS n FROM users').get().n, 2);
        assert.equal(snapshot.prepare('SELECT COUNT(*) AS n FROM reviews').get().n, 1);
        assert.ok(snapshot.prepare('SELECT id FROM mistakes WHERE id=?').get(trashId));
        assert.match(snapshot.prepare('SELECT analysis FROM mistakes WHERE id=?').get(mistakeId).analysis, /两边减去/);
        snapshot.close();
        assert.deepEqual(fs.readFileSync(path.join(extracted, 'uploads/shared-page.jpg')), jpeg);
        assert.match(fs.readFileSync(path.join(extracted, 'config/server.env'), 'utf8'), /server-test-secret/);
        assert.match(fs.readFileSync(path.join(extracted, 'config/ai.env'), 'utf8'), /ai-test-secret/);

        await admin('PATCH', '/admin/backups/settings', { enabled: false, retention: 1, time: '03:00' });
        for (let index = 0; index < 2; index += 1) { service.create('automatic'); await service.awaitIdle(); }
        assert.equal(service.list().backups.filter((item) => item.source === 'automatic' && item.status === 'completed').length, 1);
        assert.ok(fs.existsSync(archive), '自动轮换不删除手动备份');
        assert.equal(nextDailyRun('03:00', Date.parse('2026-10-23T02:59:59+08:00')), '2026-10-22T19:00:00.000Z');
        assert.equal(nextDailyRun('03:00', Date.parse('2026-10-23T03:00:00+08:00')), '2026-10-23T19:00:00.000Z');

        const failed = createBackupService({ ...paths, db, backupsPath: path.join(directory, 'failed'), pauseJobs: async () => { throw new Error('模拟暂停失败'); } });
        failed.create(); await failed.awaitIdle();
        assert.equal(failed.list().backups[0].status, 'failed');
        assert.equal(coordination.isReadOnly(), false, '失败必须解除只读');
        assert.ok(fs.existsSync(archive));

        // Exercise the actual timer, including skipping a simultaneous manual backup.
        let clock = Date.parse('2026-10-23T02:59:59.970+08:00'), releaseSchedule;
        const scheduleGate = new Promise((resolve) => { releaseSchedule = resolve; });
        const scheduled = createBackupService({ ...paths, db, backupsPath: path.join(directory, 'scheduled'), now: () => clock, pauseJobs: () => scheduleGate });
        scheduled.saveSettings({ enabled: true }); scheduled.create(); scheduled.start(); clock += 100;
        await delay(70);
        assert.equal(scheduled.getSettings().lastRun.status, 'skipped');
        assert.equal(scheduled.getSettings().nextRunAt, '2026-10-23T19:00:00.000Z');
        releaseSchedule(); await scheduled.awaitIdle(); scheduled.stop();
        const stateFile = path.join(directory, 'scheduled/state.json');
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        state.backups[0].status = 'running'; fs.writeFileSync(stateFile, JSON.stringify(state));
        assert.equal(createBackupService({ ...paths, db, backupsPath: path.join(directory, 'scheduled') }).list().backups[0].status, 'interrupted');

        const target = {
            databasePath: path.join(directory, 'target/restored.sqlite'), uploadsPath: path.join(directory, 'target/images'),
            backupsPath: path.join(directory, 'target/backups'), envPath: path.join(directory, 'target/.env'), aiConfigPath: path.join(directory, 'target/.env.ai')
        };
        await restoreBackup(archive, { ...target, confirm: true });
        const restored = new Database(target.databasePath);
        assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM sessions').get().n, 0);
        assert.equal(restored.prepare("SELECT status FROM ai_jobs WHERE fingerprint='pending-restore'").get().status, 'cancelled');
        assert.equal(restored.prepare('SELECT status FROM page_imports WHERE id=?').get(pageId).status, 'cancelled');
        assert.equal(restored.prepare("SELECT status FROM page_import_items WHERE region_id='region'").get().status, 'cancelled');
        restored.prepare('UPDATE mistakes SET note=? WHERE id=?').run('恢复失败时应保留', mistakeId); restored.close();
        assert.deepEqual(fs.readFileSync(path.join(target.uploadsPath, 'shared-page.jpg')), jpeg);
        const targetEnvironment = require('dotenv').parse(fs.readFileSync(target.envPath));
        assert.equal(path.resolve(targetEnvironment.MISTAKES_DB_PATH), target.databasePath);
        assert.equal(targetEnvironment.BACKUP_TEST_SECRET, 'server-test-secret');
        const releaseLock = acquireRuntimeLock(target.databasePath);
        try {
            await assert.rejects(restoreBackup(archive, { ...target, confirm: true }), /服务仍在运行/);
            const command = spawnSync(process.execPath, [path.join(root, 'scripts/mistakes-backup-restore.cjs'), archive, '--confirm'], { encoding: 'utf8', env: { ...process.env, MISTAKES_DB_PATH: target.databasePath } });
            assert.equal(command.status, 1); assert.match(command.stderr, /服务仍在运行/);
        } finally { releaseLock(); }
        await assert.rejects(restoreBackup(archive, { ...target, confirm: true, afterReplace: async (name) => { if (name === target.uploadsPath) throw new Error('模拟替换失败'); } }), /模拟替换失败/);
        const unchanged = new Database(target.databasePath, { readonly: true });
        assert.equal(unchanged.prepare('SELECT note FROM mistakes WHERE id=?').get(mistakeId).note, '恢复失败时应保留'); unchanged.close();
        assert.deepEqual(fs.readFileSync(path.join(target.uploadsPath, 'shared-page.jpg')), jpeg);
        const result = await restoreBackup(archive, { ...target, confirm: true });
        assert.ok(fs.existsSync(result.rollbackBackup));
        const roundTrip = new Database(target.databasePath, { readonly: true });
        assert.equal(roundTrip.prepare('SELECT note FROM mistakes WHERE id=?').get(mistakeId).note, ''); roundTrip.close();
        await assert.rejects(restoreBackup(archive, target), /confirm/);
        await admin('DELETE', `/admin/backups/${task.id}`);
        assert.equal(fs.existsSync(archive), false);
        console.log('Backup smoke passed: WAL/data/images/config, graceful AI drain/read-only, permissions/rotation/timer, failure recovery and offline restore/rollback.');
    } finally {
        releaseAi?.();
        if (app) { app.getBackupService().stop(); await require('../server/mistakes/ai').stopJobs(); }
        await close(server); await close(provider);
        app?.db.close();
        assert.equal(path.dirname(path.resolve(directory)), path.join(root, 'data'));
        assert.match(path.basename(directory), /^backup-smoke-/);
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

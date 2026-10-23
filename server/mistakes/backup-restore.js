const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Database = require('better-sqlite3');
const { resolveBackupPaths, removeWithin } = require('./backup-paths');
const { extractAndValidate, copyRegularTree } = require('./backup-archive');
const { createBackupService } = require('./backups');
const { acquireRuntimeLock } = require('./runtime-lock');

function storageEnvironment(contents, paths) {
    const values = {
        MISTAKES_DB_PATH: paths.database,
        MISTAKES_UPLOADS_PATH: paths.uploads,
        MISTAKES_BACKUPS_PATH: paths.backups,
        MISTAKES_ENV_PATH: paths.serverEnv,
        MISTAKES_AI_CONFIG_PATH: paths.aiEnv
    };
    const preserved = contents.split(/\r?\n/).filter((line) => !/^\s*(?:export\s+)?MISTAKES_(?:DB_PATH|UPLOADS_PATH|BACKUPS_PATH|ENV_PATH|AI_CONFIG_PATH)\s*=/.test(line));
    // Forward slashes also work on Windows and avoid dotenv treating backslashes as escapes.
    for (const [key, value] of Object.entries(values)) preserved.push(`${key}=${JSON.stringify(value.replace(/\\/g, '/'))}`);
    return `${preserved.join('\n').replace(/^\n+|\n+$/g, '')}\n`;
}

function prepareDatabase(filename) {
    const database = new Database(filename);
    try {
        database.transaction(() => {
            const now = new Date().toISOString();
            const message = '数据已恢复，请确认后手动重试';
            database.prepare('DELETE FROM sessions').run();
            database.prepare("UPDATE ai_jobs SET status = 'cancelled', error = ?, finished_at = ?, next_attempt_at = NULL WHERE status IN ('queued','running','retrying')").run(message, now);
            database.prepare("UPDATE page_imports SET status = 'cancelled', error = ?, finished_at = ?, next_attempt_at = NULL WHERE status IN ('queued','running','retrying')").run(message, now);
            database.prepare("UPDATE page_import_items SET status = 'cancelled', error = ? WHERE status = 'preparing'").run(message);
        })();
        database.pragma('wal_checkpoint(TRUNCATE)');
        database.pragma('journal_mode = DELETE');
    } finally { database.close(); }
}

function removeSibling(target, sibling) {
    const resolvedTarget = path.resolve(target);
    const resolvedSibling = path.resolve(sibling);
    if (path.dirname(resolvedTarget) !== path.dirname(resolvedSibling) || !path.basename(resolvedSibling).startsWith(`${path.basename(resolvedTarget)}.restore-`)) {
        throw new Error('拒绝清理恢复目标之外的文件');
    }
    fs.rmSync(resolvedSibling, { recursive: true, force: true });
}

async function restoreBackup(filename, options = {}) {
    if (!options.confirm) throw new Error('恢复会覆盖当前数据，请先停服并使用 --confirm 确认');
    const paths = resolveBackupPaths(options);
    if (paths.database === ':memory:') throw new Error('内存数据库不支持恢复');
    const release = acquireRuntimeLock(paths.database);
    let directory = null;
    const replacements = [];
    let rollbackBackup = null;
    let completed = false;
    try {
        fs.mkdirSync(paths.backups, { recursive: true, mode: 0o700 });
        directory = fs.mkdtempSync(path.join(paths.backups, '.restore-'));
        const incoming = path.join(directory, 'incoming.tar.gz');
        fs.copyFileSync(path.resolve(filename), incoming);
        const extracted = path.join(directory, 'contents');
        const manifest = await extractAndValidate(incoming, extracted);

        // Validation finishes before touching the current database or uploads.
        if (fs.existsSync(paths.database)) {
            const currentDatabase = new Database(paths.database, { fileMustExist: true });
            const service = createBackupService({ ...options, db: currentDatabase, coordination: {
                isReadOnly: () => false, beginReadOnly() {}, endReadOnly() {}
            }, pauseJobs: async () => {}, resumeJobs: async () => {} });
            try {
                const task = service.create('pre-restore');
                await service.awaitIdle();
                const result = service.list().backups.find((item) => item.id === task.id);
                if (result.status !== 'completed') throw new Error(`恢复前回退包创建失败：${result.error}`);
                rollbackBackup = service.download(task.id);
            } finally { service.stop(); currentDatabase.close(); }
        }

        prepareDatabase(path.join(extracted, 'db.sqlite'));
        const existingServer = manifest.configurations.server.exists ? fs.readFileSync(path.join(extracted, 'config/server.env'), 'utf8') : '';
        fs.writeFileSync(path.join(extracted, 'config/server.env'), storageEnvironment(existingServer, paths), { mode: 0o600 });
        const token = crypto.randomUUID();
        const targets = [
            { target: paths.database, source: path.join(extracted, 'db.sqlite') },
            { target: paths.uploads, source: path.join(extracted, 'uploads'), directory: true },
            { target: paths.serverEnv, source: path.join(extracted, 'config/server.env') },
            { target: paths.aiEnv, source: manifest.configurations.ai.exists ? path.join(extracted, 'config/ai.env') : null },
            { target: `${paths.database}-wal`, source: null },
            { target: `${paths.database}-shm`, source: null }
        ];
        for (const item of targets) {
            fs.mkdirSync(path.dirname(item.target), { recursive: true });
            item.replacement = `${item.target}.restore-new-${token}`;
            item.previous = `${item.target}.restore-old-${token}`;
            item.moved = false;
            item.installed = false;
            replacements.push(item);
            if (item.source) {
                if (item.directory) copyRegularTree(item.source, item.replacement);
                else fs.copyFileSync(item.source, item.replacement, fs.constants.COPYFILE_EXCL);
            }
        }
        try {
            for (const item of replacements) {
                if (fs.existsSync(item.target)) {
                    fs.renameSync(item.target, item.previous);
                    item.moved = true;
                }
                if (item.source) {
                    fs.renameSync(item.replacement, item.target);
                    item.installed = true;
                }
                // A smoke test can inject a failure without mocking filesystem operations.
                if (options.afterReplace) await options.afterReplace(item.target);
            }
        } catch (error) {
            const rollbackErrors = [];
            for (const item of [...replacements].reverse()) {
                try {
                    if (item.installed) {
                        // Move the installed target back to its exact, checked sibling before cleanup.
                        fs.renameSync(item.target, item.replacement);
                        item.installed = false;
                    }
                    if (item.moved) {
                        fs.renameSync(item.previous, item.target);
                        item.moved = false;
                    }
                } catch (rollbackError) { rollbackErrors.push(rollbackError.message); }
            }
            if (rollbackErrors.length) throw new Error(`恢复失败，部分文件未能回滚；请保留 .restore-old 文件并使用回退包 ${rollbackBackup || ''}：${rollbackErrors.join('；')}`);
            throw error;
        }
        completed = true;
        return { manifest, rollbackBackup, paths };
    } finally {
        try {
            for (const item of replacements) {
                // On a failed rollback, the previous file remains beside its target for manual recovery.
                if (fs.existsSync(item.replacement)) removeSibling(item.target, item.replacement);
                if (completed && fs.existsSync(item.previous)) removeSibling(item.target, item.previous);
            }
            if (directory) removeWithin(paths.backups, directory);
        } finally { release(); }
    }
}

module.exports = { restoreBackup, storageEnvironment };

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function lockPath(databasePath) {
    if (databasePath === ':memory:') throw new Error('内存数据库不支持停服恢复');
    return `${path.resolve(databasePath)}.service.lock`;
}

function activeLock(filename) {
    if (!fs.existsSync(filename)) return null;
    let lock;
    try { lock = JSON.parse(fs.readFileSync(filename, 'utf8')); } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw new Error('运行锁无法读取，请确认服务已停止后检查运行锁文件');
    }
    if (!Number.isSafeInteger(lock.pid) || lock.pid <= 0) throw new Error('运行锁无效，请确认服务已停止后检查运行锁文件');
    try {
        process.kill(lock.pid, 0);
        return lock;
    } catch (error) {
        if (error.code !== 'ESRCH') return lock;
        return null;
    }
}

function assertServiceStopped(databasePath) {
    if (activeLock(lockPath(databasePath))) throw new Error('服务仍在运行或恢复中，请先停止服务再恢复');
}

function acquireRuntimeLock(databasePath) {
    const filename = lockPath(databasePath);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    const token = crypto.randomUUID();
    const contents = JSON.stringify({ pid: process.pid, token, createdAt: new Date().toISOString() });
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            fs.writeFileSync(filename, contents, { flag: 'wx', mode: 0o600 });
            break;
        } catch (error) {
            if (error.code !== 'EEXIST') throw error;
            if (attempt > 0 || activeLock(filename)) throw new Error('服务仍在运行或恢复中，请先停止服务再恢复');
            try { fs.unlinkSync(filename); } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') throw unlinkError;
            }
        }
    }
    return () => {
        try {
            const current = JSON.parse(fs.readFileSync(filename, 'utf8'));
            if (current.token === token) fs.unlinkSync(filename);
        } catch (error) {
            if (error.code !== 'ENOENT') console.error('无法清理运行锁:', error.message);
        }
    };
}

module.exports = { acquireRuntimeLock, assertServiceStopped };

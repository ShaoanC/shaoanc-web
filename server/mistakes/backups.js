const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { resolveBackupPaths, removeWithin } = require('./backup-paths');
const { snapshotContent, compressContent } = require('./backup-archive');

const defaults = { enabled: false, time: '03:00', retention: 7, timezone: 'Asia/Shanghai', lastRun: null };

function fail(status, message) {
    throw Object.assign(new Error(message), { status, expose: true });
}

function nextDailyRun(time, after = Date.now()) {
    const [hours, minutes] = time.split(':').map(Number);
    const beijing = new Date(after + 8 * 60 * 60 * 1000);
    let next = Date.UTC(beijing.getUTCFullYear(), beijing.getUTCMonth(), beijing.getUTCDate(), hours - 8, minutes);
    if (next <= after) next += 24 * 60 * 60 * 1000;
    return new Date(next).toISOString();
}

function createBackupService(options = {}) {
    const db = options.db || require('./database').db;
    const coordination = options.coordination || require('./backup-coordination');
    const paths = resolveBackupPaths({ ...options, db });
    const pauseJobs = options.pauseJobs || (async () => {});
    const resumeJobs = options.resumeJobs || (async () => {});
    const clock = options.now || (() => Date.now());
    fs.mkdirSync(paths.backups, { recursive: true, mode: 0o700 });
    const statePath = path.join(paths.backups, 'state.json');
    let state = { settings: { ...defaults }, backups: [] };
    if (fs.existsSync(statePath)) {
        const saved = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        state = { settings: { ...defaults, ...saved.settings, timezone: 'Asia/Shanghai' }, backups: saved.backups || [] };
    }
    let active = null;
    let timer = null;
    let started = false;
    let scheduledAt = null;

    function persist() {
        const temporary = `${statePath}.tmp`;
        fs.writeFileSync(temporary, JSON.stringify(state, null, 2), { mode: 0o600 });
        fs.renameSync(temporary, statePath);
    }

    let interrupted = false;
    for (const task of state.backups) {
        if (task.status !== 'running') continue;
        task.status = 'interrupted';
        task.stage = 'interrupted';
        task.error = '服务已重启，备份中断，请重新创建';
        state.settings.lastRun = { status: 'interrupted', at: new Date(clock()).toISOString(), message: task.error };
        interrupted = true;
    }
    // Only these service-owned temporary names are removed after a restart.
    for (const entry of fs.readdirSync(paths.backups)) {
        if (/^\.backup-[0-9a-f-]{36}$/.test(entry) || /^[0-9a-f-]{36}\.tar\.gz\.partial$/.test(entry)) removeWithin(paths.backups, path.join(paths.backups, entry));
    }
    if (interrupted) persist();

    function currentTask() { return state.backups.find((task) => task.status === 'running') || null; }
    function list() {
        const current = currentTask();
        return { backups: state.backups.map((task) => ({ ...task })), current: current ? { ...current } : null, readOnly: coordination.isReadOnly() };
    }
    function getSettings() {
        return { ...state.settings, nextRunAt: state.settings.enabled ? scheduledAt || nextDailyRun(state.settings.time, clock()) : null };
    }
    function schedule() {
        clearTimeout(timer);
        timer = null;
        scheduledAt = null;
        if (!started || !state.settings.enabled) return;
        scheduledAt = nextDailyRun(state.settings.time, clock());
        timer = setTimeout(() => {
            timer = null;
            scheduledAt = null;
            try {
                if (currentTask()) {
                    state.settings.lastRun = { status: 'skipped', at: new Date(clock()).toISOString(), message: '已有备份正在执行，本次自动备份已跳过' };
                    persist();
                } else create('automatic');
            } catch (error) {
                state.settings.lastRun = { status: 'failed', at: new Date(clock()).toISOString(), message: error.message };
                persist();
            }
            schedule();
        }, Math.max(1, new Date(scheduledAt).getTime() - clock()));
        timer.unref?.();
    }
    function saveSettings(body) {
        if (!body || typeof body !== 'object') fail(400, '备份设置格式不正确');
        if (body.enabled !== undefined && typeof body.enabled !== 'boolean') fail(400, '自动备份开关须为布尔值');
        if (body.time !== undefined && (typeof body.time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time))) fail(400, '请输入有效的北京时间，例如 03:00');
        if (body.retention !== undefined && (!Number.isSafeInteger(body.retention) || body.retention < 1 || body.retention > 365)) fail(400, '自动备份保留数量须为 1 至 365 份');
        for (const key of ['enabled', 'time', 'retention']) if (body[key] !== undefined) state.settings[key] = body[key];
        persist();
        schedule();
        return getSettings();
    }
    function download(id) {
        const task = state.backups.find((item) => item.id === id);
        if (!task) fail(404, '备份不存在');
        if (task.status !== 'completed' || !task.filename) fail(409, '备份尚未完成，无法下载');
        const filename = path.join(paths.backups, `${task.id}.tar.gz`);
        if (!fs.existsSync(filename)) fail(404, '备份文件已不存在');
        return filename;
    }
    function remove(id) {
        const task = state.backups.find((item) => item.id === id);
        if (!task) fail(404, '备份不存在');
        if (task.status === 'running') fail(409, '正在执行的备份无法删除');
        if (task.filename) fs.rmSync(path.join(paths.backups, `${task.id}.tar.gz`), { force: true });
        state.backups = state.backups.filter((item) => item.id !== id);
        persist();
    }
    function rotateAutomatic() {
        const completed = state.backups.filter((task) => task.source === 'automatic' && task.status === 'completed');
        for (const task of completed.slice(state.settings.retention)) remove(task.id);
    }
    async function execute(task) {
        const directory = path.join(paths.backups, `.backup-${task.id}`);
        const partial = path.join(paths.backups, `${task.id}.tar.gz.partial`);
        let readOnly = false;
        try {
            try {
                await coordination.beginReadOnly();
                readOnly = true;
                await pauseJobs();
                await snapshotContent({ db, paths, directory, id: task.id, source: task.source, createdAt: task.createdAt,
                    onStage(stage) { task.stage = stage; persist(); } });
            } finally {
                if (readOnly) {
                    try { await resumeJobs(); } finally { coordination.endReadOnly(); readOnly = false; }
                }
            }
            task.stage = 'compressing';
            persist();
            await compressContent(directory, partial);
            fs.chmodSync(partial, 0o600);
            const filename = path.join(paths.backups, `${task.id}.tar.gz`);
            fs.renameSync(partial, filename);
            task.status = 'completed';
            task.stage = 'completed';
            task.size = fs.statSync(filename).size;
            task.filename = path.basename(filename);
            state.settings.lastRun = { status: 'completed', at: new Date(clock()).toISOString(), message: task.source === 'automatic' ? '自动备份已完成' : '备份已完成' };
            persist();
            if (task.source === 'automatic') {
                try { rotateAutomatic(); } catch (error) {
                    state.settings.lastRun = { status: 'completed', at: new Date(clock()).toISOString(), message: `自动备份已完成，旧备份清理失败：${error.message}` };
                    persist();
                }
            }
        } catch (error) {
            task.status = 'failed';
            task.stage = 'failed';
            task.error = error.message || '备份失败，请重试';
            state.settings.lastRun = { status: 'failed', at: new Date(clock()).toISOString(), message: task.error };
            persist();
        } finally {
            if (readOnly) coordination.endReadOnly();
            removeWithin(paths.backups, directory);
            fs.rmSync(partial, { force: true });
        }
    }
    function create(source = 'manual') {
        if (!['manual', 'automatic', 'pre-restore'].includes(source)) fail(400, '备份来源不正确');
        if (currentTask() || active) fail(409, '已有备份正在执行');
        const task = { id: crypto.randomUUID(), createdAt: new Date(clock()).toISOString(), source, status: 'running', stage: 'waiting', size: null, error: null, filename: null };
        state.backups.unshift(task);
        persist();
        active = execute(task).finally(() => { active = null; });
        // No rejected background promise should escape a request handler.
        active.catch((error) => console.error('备份状态写入失败:', error.message));
        return { ...task };
    }
    function start() { started = true; schedule(); }
    function stop() { started = false; clearTimeout(timer); timer = null; scheduledAt = null; }
    async function awaitIdle() { if (active) await active; }
    return { list, getSettings, saveSettings, create, download, remove, start, stop, awaitIdle, paths };
}

module.exports = { createBackupService, nextDailyRun };

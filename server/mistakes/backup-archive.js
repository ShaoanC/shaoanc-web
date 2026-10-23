const fs = require('node:fs');
const path = require('node:path');
const tar = require('tar');
const Database = require('better-sqlite3');
const { version: appVersion } = require('../../package.json');

function copyRegularTree(source, destination) {
    fs.mkdirSync(destination, { recursive: true });
    if (!fs.existsSync(source)) return;
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
        const from = path.join(source, entry.name);
        const to = path.join(destination, entry.name);
        if (entry.isDirectory()) copyRegularTree(from, to);
        else if (entry.isFile()) fs.copyFileSync(from, to);
        else throw new Error('图片目录包含符号链接或特殊文件，请移除后重新备份');
    }
}

async function copySnapshotTree(source, destination) {
    await fs.promises.mkdir(destination, { recursive: true });
    let entries;
    try { entries = await fs.promises.readdir(source, { withFileTypes: true }); } catch (error) {
        if (error.code === 'ENOENT') return;
        throw error;
    }
    for (const entry of entries) {
        const from = path.join(source, entry.name);
        const to = path.join(destination, entry.name);
        if (entry.isDirectory()) await copySnapshotTree(from, to);
        else if (entry.isFile()) await fs.promises.copyFile(from, to);
        else throw new Error('图片目录包含符号链接或特殊文件，请移除后重新备份');
    }
}

function listFiles(directory, prefix = '') {
    const files = [];
    for (const entry of fs.readdirSync(path.join(directory, prefix), { withFileTypes: true })) {
        const name = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) files.push(...listFiles(directory, name));
        else if (entry.isFile()) files.push({ path: name, size: fs.statSync(path.join(directory, name)).size });
        else throw new Error('备份内容包含不支持的文件');
    }
    return files.sort((left, right) => left.path.localeCompare(right.path));
}

async function snapshotContent({ db, paths, directory, id, source, createdAt, onStage = () => {} }) {
    fs.mkdirSync(path.join(directory, 'config'), { recursive: true, mode: 0o700 });
    onStage('snapshot');
    await db.backup(path.join(directory, 'db.sqlite'));
    onStage('copying');
    await copySnapshotTree(paths.uploads, path.join(directory, 'uploads'));
    const configurations = {};
    for (const [name, target, archivePath] of [['server', paths.serverEnv, 'config/server.env'], ['ai', paths.aiEnv, 'config/ai.env']]) {
        const exists = fs.existsSync(target);
        if (exists) {
            if (!fs.lstatSync(target).isFile()) throw new Error('配置路径必须为普通文件');
            fs.copyFileSync(target, path.join(directory, archivePath));
        }
        configurations[name] = { path: archivePath, exists };
    }
    const manifest = { formatVersion: 1, appVersion, id, source, createdAt, configurations, files: listFiles(directory) };
    fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2), { mode: 0o600 });
    return manifest;
}

async function compressContent(directory, filename) {
    await tar.c({ gzip: true, portable: true, cwd: directory, file: filename, noMtime: false, strict: true }, ['manifest.json', 'db.sqlite', 'uploads', 'config']);
}

function validArchivePath(name) {
    return typeof name === 'string' && name.length > 0 && !name.includes('\\') && !name.includes(':') && !name.includes('\0') && !name.startsWith('/')
        && !name.replace(/\/$/, '').split('/').some((part) => !part || part === '.' || part === '..');
}

async function extractAndValidate(filename, directory) {
    const entries = new Map();
    let invalid = null;
    await tar.t({ file: filename, strict: true, preservePaths: true, onReadEntry(entry) {
        const name = entry.path.replace(/\/$/, '');
        const allowed = name === 'manifest.json' || name === 'db.sqlite' || name === 'uploads' || name.startsWith('uploads/') || name === 'config' || name === 'config/server.env' || name === 'config/ai.env';
        if (!validArchivePath(entry.path) || !allowed || !['File', 'Directory'].includes(entry.type) || entry.linkpath || entries.has(name)
            || (entry.type === 'Directory' && !(name === 'uploads' || name.startsWith('uploads/') || name === 'config'))
            || (entry.type === 'File' && ['uploads', 'config'].includes(name))) {
            invalid = new Error('备份包包含无效路径、链接或重复文件');
        }
        entries.set(name, { type: entry.type, size: entry.size });
    } });
    if (invalid) throw invalid;
    if (entries.get('manifest.json')?.type !== 'File' || entries.get('db.sqlite')?.type !== 'File') throw new Error('备份包缺少清单或数据库');
    fs.mkdirSync(directory, { recursive: true });
    await tar.x({ file: filename, cwd: directory, strict: true, preservePaths: false, noChmod: true });
    const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
    if (manifest.formatVersion !== 1 || manifest.appVersion !== appVersion || !Array.isArray(manifest.files)) {
        throw new Error('备份格式或应用版本不匹配，请使用创建备份时的应用版本恢复');
    }
    const expected = new Map();
    for (const item of manifest.files) {
        if (!item || !validArchivePath(item.path) || item.path === 'manifest.json' || !Number.isSafeInteger(item.size) || item.size < 0 || expected.has(item.path)) {
            throw new Error('备份文件清单无效');
        }
        expected.set(item.path, item.size);
    }
    const actual = listFiles(directory).filter((item) => item.path !== 'manifest.json');
    if (actual.length !== expected.size || actual.some((item) => expected.get(item.path) !== item.size)) throw new Error('备份文件与清单不一致');
    for (const [key, name] of [['server', 'config/server.env'], ['ai', 'config/ai.env']]) {
        const config = manifest.configurations?.[key];
        if (!config || config.path !== name || typeof config.exists !== 'boolean' || config.exists !== expected.has(name)) throw new Error('备份配置清单无效');
    }
    const database = new Database(path.join(directory, 'db.sqlite'), { readonly: true, fileMustExist: true });
    try {
        if (database.pragma('quick_check', { simple: true }) !== 'ok') throw new Error('备份数据库检查未通过');
        for (const table of ['users', 'mistakes', 'sessions', 'ai_jobs', 'page_imports', 'page_import_items']) {
            if (!database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)) throw new Error('备份数据库缺少业务数据表');
        }
    } finally { database.close(); }
    return manifest;
}

module.exports = { snapshotContent, compressContent, extractAndValidate, copyRegularTree, listFiles };

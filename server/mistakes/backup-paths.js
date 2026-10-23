const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');

function resolvedPath(filename) {
    let existing = path.resolve(filename);
    const suffix = [];
    while (!fs.existsSync(existing)) {
        const parent = path.dirname(existing);
        if (parent === existing) break;
        suffix.unshift(path.basename(existing));
        existing = parent;
    }
    return path.join(fs.realpathSync(existing), ...suffix);
}

function containsPath(directory, filename) {
    const relative = path.relative(directory, filename);
    return !relative || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function resolveBackupPaths(options = {}) {
    const root = path.resolve(options.root || repositoryRoot);
    const paths = {
        root,
        database: options.databasePath || options.db?.name || process.env.MISTAKES_DB_PATH || path.join(root, 'data', 'mistakes.sqlite'),
        uploads: path.resolve(options.uploadsPath || process.env.MISTAKES_UPLOADS_PATH || path.join(root, 'uploads', 'mistakes')),
        backups: path.resolve(options.backupsPath || process.env.MISTAKES_BACKUPS_PATH || path.join(root, 'data', 'backups')),
        serverEnv: path.resolve(options.envPath || process.env.MISTAKES_ENV_PATH || path.join(root, '.env')),
        aiEnv: path.resolve(options.aiConfigPath || process.env.MISTAKES_AI_CONFIG_PATH || path.join(root, '.env.ai')),
        public: path.resolve(options.publicPath || path.join(root, 'public'))
    };
    if (paths.database !== ':memory:') paths.database = path.resolve(paths.database);
    const actual = Object.fromEntries(Object.entries(paths).filter(([key]) => key !== 'root').map(([key, value]) => [key, value === ':memory:' ? value : resolvedPath(value)]));
    for (const directory of ['backups', 'uploads']) {
        if (containsPath(actual[directory], resolvedPath(root)) || containsPath(actual.public, actual[directory]) || containsPath(actual[directory], actual.public)) {
            throw new Error('备份和图片目录必须位于项目静态目录之外，且不能包含整个项目');
        }
    }
    if (containsPath(actual.backups, actual.uploads) || containsPath(actual.uploads, actual.backups)) {
        throw new Error('备份目录不能与图片目录重叠');
    }
    for (const name of ['database', 'serverEnv', 'aiEnv']) {
        if (actual[name] === ':memory:') continue;
        if (containsPath(actual.backups, actual[name]) || containsPath(actual.uploads, actual[name]) || containsPath(actual.public, actual[name])) {
            throw new Error('数据库与配置文件不能放在备份、图片或静态目录中');
        }
    }
    if (actual.serverEnv === actual.aiEnv || actual.database === actual.serverEnv || actual.database === actual.aiEnv) {
        throw new Error('数据库与配置文件必须使用不同的路径');
    }
    return paths;
}

function removeWithin(directory, target) {
    const resolvedDirectory = path.resolve(directory);
    const resolvedTarget = path.resolve(target);
    if (resolvedDirectory === resolvedTarget || !containsPath(resolvedDirectory, resolvedTarget)) throw new Error('拒绝清理目标目录之外的文件');
    fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

module.exports = { repositoryRoot, resolveBackupPaths, containsPath, removeWithin };

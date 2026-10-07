const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const databasePath = process.env.MISTAKES_DB_PATH || path.join(__dirname, '..', '..', 'data', 'mistakes.sqlite');
if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}
const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS invite_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        max_uses INTEGER NOT NULL DEFAULT 1,
        used_count INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        expires_at TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS knowledge_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id TEXT NOT NULL REFERENCES subjects(id),
        parent_id INTEGER REFERENCES knowledge_points(id) ON DELETE RESTRICT,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS knowledge_subject ON knowledge_points(subject_id, parent_id);
    CREATE TABLE IF NOT EXISTS mistakes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject_id TEXT REFERENCES subjects(id),
        primary_knowledge_point_id INTEGER REFERENCES knowledge_points(id) ON DELETE SET NULL,
        auxiliary_knowledge_point_ids TEXT NOT NULL DEFAULT '[]',
        lifecycle TEXT NOT NULL DEFAULT 'draft' CHECK (lifecycle IN ('draft', 'archived')),
        is_test INTEGER NOT NULL DEFAULT 0,
        question TEXT NOT NULL DEFAULT '',
        answer TEXT NOT NULL DEFAULT '',
        analysis TEXT NOT NULL DEFAULT '',
        note TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS mistakes_user ON mistakes(user_id, lifecycle, updated_at);
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mistake_id INTEGER NOT NULL REFERENCES mistakes(id) ON DELETE CASCADE,
        result TEXT NOT NULL CHECK (result IN ('unknown', 'familiar', 'mastered')),
        created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS reviews_mistake ON reviews(mistake_id, id);
`);

// Upgrade existing accounts without changing their data.
if (!db.prepare('PRAGMA table_info(users)').all().some((column) => column.name === 'avatar')) {
    db.exec('ALTER TABLE users ADD COLUMN avatar TEXT');
}
if (!db.prepare('PRAGMA table_info(mistakes)').all().some((column) => column.name === 'is_test')) {
    db.exec('ALTER TABLE mistakes ADD COLUMN is_test INTEGER NOT NULL DEFAULT 0');
}

const initialDirectory = [
    ['math', '数学', [
        ['集合与逻辑', ['集合及其运算', '充分条件与必要条件', '全称与存在量词']],
        ['函数', ['函数性质', '二次函数', '指数函数', '对数函数', '函数与方程']],
        ['三角函数', ['三角函数图象与性质', '三角恒等变换', '解三角形']],
        ['平面向量', ['向量的概念与运算', '向量的数量积', '平面向量的应用']],
        ['复数', ['复数的概念', '复数运算']],
        ['概率与统计', ['随机事件与概率', '统计抽样', '统计图表与数据分析']]
    ]],
    ['physics', '物理', [
        ['运动学', ['运动的描述', '匀变速直线运动', '自由落体运动']],
        ['相互作用', ['重力与弹力', '摩擦力', '力的合成与分解']],
        ['牛顿运动定律', ['牛顿三定律', '动力学应用']],
        ['曲线运动', ['平抛运动', '圆周运动']],
        ['机械能', ['功与功率', '动能定理', '机械能守恒']],
        ['万有引力', ['万有引力定律', '天体运动']],
        ['力学实验', ['匀变速运动实验', '力的合成实验', '牛顿第二定律实验', '机械能守恒实验']]
    ]],
    ['english', '英语', [
        ['词汇', ['词义辨析', '词形变化', '固定搭配']],
        ['语法', ['时态与语态', '非谓语动词', '定语从句', '名词性从句', '状语从句']],
        ['阅读', ['细节理解', '推理判断', '主旨大意', '词义猜测']],
        ['完形与语篇', ['完形填空', '七选五', '语法填空']],
        ['写作', ['应用文', '读后续写']],
        ['听力', ['信息获取', '意图推断']]
    ]]
];

db.transaction(() => {
    const insertSubject = db.prepare('INSERT OR IGNORE INTO subjects (id, name, sort_order) VALUES (?, ?, ?)');
    const insertPoint = db.prepare('INSERT INTO knowledge_points (subject_id, parent_id, name, sort_order) VALUES (?, ?, ?, ?)');
    for (const [subjectOrder, [subjectId, subjectName, chapters]] of initialDirectory.entries()) {
        const inserted = insertSubject.run(subjectId, subjectName, subjectOrder);
        if (!inserted.changes) {
            continue;
        }
        for (const [chapterOrder, [chapterName, points]] of chapters.entries()) {
            const chapterId = Number(insertPoint.run(subjectId, null, chapterName, chapterOrder).lastInsertRowid);
            for (const [pointOrder, pointName] of points.entries()) {
                insertPoint.run(subjectId, chapterId, pointName, pointOrder);
            }
        }
    }
})();

module.exports = { db };

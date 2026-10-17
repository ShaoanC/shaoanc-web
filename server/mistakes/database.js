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
        rating REAL NOT NULL DEFAULT 0 CHECK (rating IN (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)),
        question TEXT NOT NULL DEFAULT '',
        answer TEXT NOT NULL DEFAULT '',
        analysis TEXT NOT NULL DEFAULT '',
        note TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT
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
if (!db.prepare('PRAGMA table_info(mistakes)').all().some((column) => column.name === 'deleted_at')) {
    db.exec('ALTER TABLE mistakes ADD COLUMN deleted_at TEXT');
}
if (!db.prepare('PRAGMA table_info(mistakes)').all().some((column) => column.name === 'rating')) {
    db.exec('ALTER TABLE mistakes ADD COLUMN rating REAL NOT NULL DEFAULT 0 CHECK (rating IN (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5))');
}
db.exec('CREATE INDEX IF NOT EXISTS mistakes_trash ON mistakes(user_id, deleted_at)');
if (!db.prepare('PRAGMA table_info(knowledge_points)').all().some((column) => column.name === 'owner_user_id')) {
    db.exec('ALTER TABLE knowledge_points ADD COLUMN owner_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE');
}
db.exec(`
    CREATE INDEX IF NOT EXISTS knowledge_owner ON knowledge_points(owner_user_id, subject_id, parent_id);
    CREATE TABLE IF NOT EXISTS mistake_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mistake_id INTEGER NOT NULL REFERENCES mistakes(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        purpose TEXT NOT NULL CHECK (purpose IN ('question', 'answer')),
        client_id TEXT NOT NULL,
        original_name TEXT NOT NULL,
        original_path TEXT NOT NULL,
        crop_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE (mistake_id, client_id)
    );
    CREATE TABLE IF NOT EXISTS ai_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mistake_id INTEGER NOT NULL REFERENCES mistakes(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('question', 'answer', 'analysis')),
        status TEXT NOT NULL DEFAULT 'queued',
        apply_status TEXT NOT NULL DEFAULT 'pending',
        input_json TEXT NOT NULL,
        image_ids TEXT NOT NULL DEFAULT '[]',
        result_json TEXT,
        error TEXT,
        attempts INTEGER NOT NULL DEFAULT 0,
        max_attempts INTEGER NOT NULL DEFAULT 3,
        automatic INTEGER NOT NULL DEFAULT 0,
        fingerprint TEXT NOT NULL,
        created_at TEXT NOT NULL,
        started_at TEXT,
        finished_at TEXT,
        next_attempt_at TEXT
    );
    CREATE INDEX IF NOT EXISTS ai_jobs_owner ON ai_jobs(user_id, id);
    CREATE INDEX IF NOT EXISTS ai_jobs_pending ON ai_jobs(status);
    CREATE UNIQUE INDEX IF NOT EXISTS ai_jobs_automatic_input ON ai_jobs(mistake_id, type, fingerprint) WHERE automatic = 1;
`);

const initialDirectory = [
    ['math', '数学', [
        ['集合与逻辑', ['集合及其运算', '充分条件与必要条件', '全称与存在量词']],
        ['函数', ['函数性质', '二次函数', '指数函数', '对数函数', '函数与方程']],
        ['三角函数', ['三角函数图象与性质', '三角恒等变换', '解三角形']],
        ['平面向量', ['向量的概念与运算', '向量的数量积', '平面向量的应用']],
        ['复数', ['复数的概念', '复数运算']],
        ['概率与统计', ['随机事件与概率', '统计抽样', '统计图表与数据分析']]
    ]],
    ['english', '英语', [
        ['词汇', ['词义辨析', '词形变化', '固定搭配']],
        ['语法', ['时态与语态', '非谓语动词', '定语从句', '名词性从句', '状语从句']],
        ['阅读', ['细节理解', '推理判断', '主旨大意', '词义猜测']],
        ['完形与语篇', ['完形填空', '七选五', '语法填空']],
        ['写作', ['应用文', '读后续写']],
        ['听力', ['信息获取', '意图推断']]
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
    ['chemistry', '化学', [
        ['化学基础', ['物质的分类', '物质的量', '离子反应', '氧化还原反应']],
        ['元素与化合物', ['金属及其化合物', '非金属及其化合物', '元素周期律']],
        ['化学反应原理', ['反应热', '反应速率与化学平衡', '水溶液中的离子平衡', '电化学']],
        ['有机化学', ['有机物的结构与性质', '烃及其衍生物', '有机合成']],
        ['化学实验', ['实验基本操作', '物质的分离与提纯', '物质的检验', '实验方案设计']]
    ]],
    ['biology', '生物', [
        ['分子与细胞', ['细胞的分子组成', '细胞结构', '物质跨膜运输', '细胞代谢', '细胞增殖与分化']],
        ['遗传与进化', ['遗传规律', '遗传的分子基础', '变异与育种', '生物进化']],
        ['稳态与调节', ['内环境与稳态', '神经调节', '体液调节', '免疫调节', '植物激素调节']],
        ['生物与环境', ['种群与群落', '生态系统', '生物多样性与保护']],
        ['生物技术与实验', ['发酵工程', '细胞工程', '基因工程', '生物实验设计']]
    ]],
    ['geography', '地理', [
        ['地球与地图', ['地图与等高线', '地球运动', '时间与日期计算']],
        ['自然地理', ['大气运动与气候', '水循环与洋流', '地貌与地质作用', '自然环境的整体性与差异性']],
        ['人文地理', ['人口与城镇化', '农业区位', '工业区位', '服务业与交通运输']],
        ['区域发展', ['区域特征', '资源开发与调配', '区域协调发展', '生态环境保护']],
        ['地理实践', ['地理图表判读', '野外观察与调查', '地理信息技术']]
    ]]
];

db.transaction(() => {
    const insertSubject = db.prepare('INSERT OR IGNORE INTO subjects (id, name, sort_order) VALUES (?, ?, ?)');
    const updateSubjectOrder = db.prepare('UPDATE subjects SET sort_order = ? WHERE id = ?');
    const insertPoint = db.prepare('INSERT INTO knowledge_points (subject_id, parent_id, name, sort_order) VALUES (?, ?, ?, ?)');
    for (const [subjectOrder, [subjectId, subjectName, chapters]] of initialDirectory.entries()) {
        const inserted = insertSubject.run(subjectId, subjectName, subjectOrder);
        updateSubjectOrder.run(subjectOrder, subjectId);
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

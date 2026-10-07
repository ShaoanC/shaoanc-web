const { db } = require('./database');

const examples = [
    {
        subjectId: 'math', knowledgePoint: '二次函数',
        question: '已知二次函数 f(x) = x² - 4x + 3，求函数的最小值及对应的 x。',
        answer: '当 x = 2 时，f(x) 的最小值为 -1。',
        analysis: '配方得 f(x) = (x - 2)² - 1。因为平方项不小于 0，所以当 x = 2 时取得最小值 -1。',
        note: '注意区分最小值与取得最小值时的自变量。', reviewResult: 'familiar'
    },
    {
        subjectId: 'math', knowledgePoint: '随机事件与概率',
        question: '同时掷两枚均匀骰子，求点数之和等于 7 的概率。',
        answer: '1/6。',
        analysis: '共有 6 × 6 = 36 种等可能结果，其中和为 7 的结果有 (1,6)、(2,5)、(3,4)、(4,3)、(5,2)、(6,1)，概率为 6/36 = 1/6。',
        note: '两枚骰子有顺序，不能把 (1,6) 和 (6,1) 合并。'
    },
    {
        subjectId: 'physics', knowledgePoint: '匀变速直线运动',
        question: '物体从静止开始做匀加速直线运动，加速度为 2 m/s²。求前 3 s 内的位移。',
        answer: '9 m。',
        analysis: '由位移公式 s = v₀t + ½at²，代入 v₀ = 0、a = 2 m/s²、t = 3 s，得 s = 9 m。',
        note: '初速度为零时，位移与时间的平方成正比。', reviewResult: 'mastered'
    },
    {
        subjectId: 'physics', knowledgePoint: '牛顿三定律',
        question: '质量为 2 kg 的物体在水平面上受到 10 N 的水平拉力，摩擦力为 4 N，求物体的加速度。',
        answer: '3 m/s²，方向与拉力方向相同。',
        analysis: '水平方向的合力为 F合 = 10 - 4 = 6 N。由牛顿第二定律 F合 = ma，得 a = 6/2 = 3 m/s²。',
        note: '应用牛顿第二定律时应使用合力。', reviewResult: 'unknown'
    },
    {
        subjectId: 'english', knowledgePoint: '时态与语态',
        question: '用括号中动词的适当形式填空：She ______ (live) in Shanghai since 2020.',
        answer: 'has lived。',
        analysis: 'since 2020 表示动作从过去持续到现在，应使用现在完成时。主语 She 是第三人称单数，因此填 has lived。',
        note: '留意 since 与表示起点的时间搭配。'
    },
    {
        subjectId: 'english', knowledgePoint: '定语从句', lifecycle: 'draft',
        question: '选择正确的关系词：The book ______ I bought yesterday is interesting. (A. who B. which C. where)',
        answer: 'B. which。',
        analysis: '先行词是表示物的 the book，关系词在定语从句中作 bought 的宾语，所以可用 which。who 指人，where 作地点状语。',
        note: '这是一道测试草稿，可以尝试编辑并归档。'
    }
];

const generateTestMistakes = db.transaction((userId) => {
    const now = new Date().toISOString();
    const findPoint = db.prepare('SELECT id FROM knowledge_points WHERE subject_id = ? AND name = ? LIMIT 1');
    const insertMistake = db.prepare(`
        INSERT INTO mistakes (user_id, subject_id, primary_knowledge_point_id, lifecycle, is_test,
            question, answer, analysis, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
    `);
    const insertReview = db.prepare('INSERT INTO reviews (mistake_id, result, created_at) VALUES (?, ?, ?)');
    for (const example of examples) {
        const point = findPoint.get(example.subjectId, example.knowledgePoint);
        const inserted = insertMistake.run(userId, example.subjectId, point?.id || null, example.lifecycle || 'archived',
            example.question, example.answer, example.analysis, example.note, now, now);
        if (example.reviewResult) {
            insertReview.run(inserted.lastInsertRowid, example.reviewResult, now);
        }
    }
    return examples.length;
});

module.exports = { generateTestMistakes };

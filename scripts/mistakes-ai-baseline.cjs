const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const compact = (value) => value.replace(/\s+/gu, '');

function loadDataset(filename) {
    const { jpegDimensions } = require('../server/mistakes/ai-messages');
    const manifest = JSON.parse(fs.readFileSync(filename, 'utf8'));
    if (!['real', 'synthetic'].includes(manifest.source)) throw new Error('清单 source 须为 real 或 synthetic。');
    if (!Array.isArray(manifest.cases) || manifest.cases.length !== 8) throw new Error('清单须包含 8 个识别案例；订正图分别检查题干与答案。');
    const files = new Map();
    const ids = new Set();
    for (const item of manifest.cases) {
        if (!item.id || ids.has(item.id) || !['question', 'answer'].includes(item.type) || !item.images?.length) throw new Error('案例须有唯一 id、question/answer 类型和图片路径。');
        ids.add(item.id);
        for (const name of item.images) {
            const absolute = path.resolve(path.dirname(filename), name);
            if (files.has(absolute)) continue;
            if (!fs.existsSync(absolute)) throw new Error(`缺少题图：${absolute}。请放入实际发送模型的 JPEG 裁剪图。`);
            const bytes = fs.readFileSync(absolute);
            const size = jpegDimensions(bytes);
            if (!size) throw new Error(`无法读取 JPEG 尺寸：${absolute}`);
            files.set(absolute, { bytes, ...size, sha256: hash(bytes) });
        }
    }
    if (files.size !== 8) throw new Error('基线须包含 8 张不同路径的题图。');
    return { manifest, files };
}

function markdownReport(report) {
    return `# 图片识别基线：${report.label}\n\n来源：${report.source}；模型：${report.model || '未知'}；每例请求一次，不自动重试。\n\n` +
        '| 案例 | 状态 | 耗时 ms | 调用数 | 缺少关键片段 | 混入禁止片段 | 配图数/预期 |\n|---|---|---:|---:|---|---|---|\n' +
        report.cases.map((item) => `| ${item.id} | ${item.errorCategory || '成功'} | ${item.elapsedMs ?? '未知'} | ${item.calls} | ${JSON.stringify(item.checks?.missingRequired ?? null)} | ${JSON.stringify(item.checks?.foundForbidden ?? null)} | ${item.result?.figures?.length ?? 0}/${item.expectedFigureCount ?? '未标注'} |`).join('\n') +
        '\n\n请在同名 JSON 的 review 中填写人工评分：criticalContentErrors（关键条件/公式错误数）、figureComplete（配图及标注完整）、handwritingLeak（作答混入）、manualEdits（人工修改次数）、notes。null 表示未评分，不视为通过。片段匹配仅供辅助，不能代替逐图校对。\n';
}

async function runBaseline(filename, label, { checkOnly = false } = {}) {
    const { manifest, files } = loadDataset(filename);
    if (checkOnly) return { source: manifest.source, images: files.size, cases: manifest.cases.length };
    const { recognitionMessages } = require('../server/mistakes/ai-messages');
    const { requestCompletion, aiErrorCategory } = require('../server/mistakes/ai-request');
    const { recognitionFormat, parseRecognitionJson } = require('../server/mistakes/ai-output');
    const { readConfig } = require('../server/mistakes/ai-config');
    const config = readConfig();
    if (!config.enabled || !config.apiKey || !config.baseUrl || !config.model) throw new Error('请先配置并启用 AI；也可用 --check 只检查题图清单。');
    const report = { label, source: manifest.source, createdAt: new Date().toISOString(), model: config.model, cases: [] };
    for (const item of manifest.cases) {
        const images = item.images.map((name, index) => ({ id: index + 1, ...files.get(path.resolve(path.dirname(filename), name)) }));
        const messages = recognitionMessages({ type: item.type, subjects: manifest.subjects, directory: manifest.directory, images });
        const record = { id: item.id, type: item.type, images: images.map(({ id, width, height, sha256 }) => ({ id, width, height, sha256 })),
            promptSha256: hash(JSON.stringify(messages.systemInstruction)),
            calls: 0, elapsedMs: 0, result: null, errorCategory: null, expectedFigureCount: item.expectedFigureCount ?? null,
            review: { criticalContentErrors: null, figureComplete: null, handwritingLeak: null, manualEdits: null, notes: '' } };
        try {
            record.result = await requestCompletion({ messages, responseFormat: recognitionFormat(item.type), context: { type: 'baseline', label, caseId: item.id, imageCount: images.length },
                onMetrics: ({ elapsedMs, usage }) => { record.calls += 1; record.elapsedMs += elapsedMs; record.usage = usage; }, interpret: (raw) => {
                    record.raw = raw;
                    const value = parseRecognitionJson(raw);
                    if (!value || typeof value[item.type] !== 'string' || !value[item.type].trim()) throw Object.assign(new Error('Missing transcription'), { code: 'INVALID_AI_RESULT' });
                    return value;
                } });
            const recognized = compact(record.result[item.type]);
            record.checks = { missingRequired: (item.required || []).filter((text) => !recognized.includes(compact(text))),
                foundForbidden: (item.forbidden || []).filter((text) => recognized.includes(compact(text))) };
        } catch (error) { record.errorCategory = aiErrorCategory(error); }
        report.cases.push(record);
    }
    return report;
}

function compareReports(before, after) {
    const rows = after.cases.map((item) => {
        const previous = before.cases.find((value) => value.id === item.id && value.type === item.type);
        const sameImages = Boolean(previous && JSON.stringify(previous.images) === JSON.stringify(item.images));
        const reviews = [previous?.review, item.review];
        const scored = reviews.every((review) => review && Number.isInteger(review.criticalContentErrors) && Number.isInteger(review.manualEdits)
            && typeof review.figureComplete === 'boolean' && typeof review.handwritingLeak === 'boolean');
        const verdict = !scored ? '待人工评分' : item.errorCategory ? '识别失败'
            : item.review.criticalContentErrors > previous.review.criticalContentErrors || (previous.review.figureComplete && !item.review.figureComplete)
                || (!previous.review.handwritingLeak && item.review.handwritingLeak) ? '出现退化' : '关键内容未退化';
        return `| ${item.id} | ${previous?.elapsedMs ?? '未知'} → ${item.elapsedMs ?? '未知'} | ${previous?.calls ?? '未知'} → ${item.calls} | ${previous?.review?.manualEdits ?? '未评'} → ${item.review.manualEdits ?? '未评'} | ${sameImages ? '相同' : '不同，需核对来源'} | ${verdict} |`;
    });
    return `# 基线对比：${before.label} → ${after.label}\n\n模型：${before.model} → ${after.model}；来源：${before.source} → ${after.source}。人工核对模型及图片变化后再解释差异；耗时仅指模型请求，不含浏览器裁剪压缩时间。\n\n| 案例 | 耗时 ms | 调用数 | 人工修改次数 | 图片内容 | 内容验收 |\n|---|---|---|---|---|---|\n${rows.join('\n')}\n`;
}

async function main() {
    const args = process.argv.slice(2);
    if (args[0] === '--compare') {
        const before = JSON.parse(fs.readFileSync(args[1], 'utf8'));
        const after = JSON.parse(fs.readFileSync(args[2], 'utf8'));
        const output = path.resolve(path.dirname(args[2]), 'comparison.md');
        fs.writeFileSync(output, compareReports(before, after));
        console.log(output);
        return;
    }
    if (!args[0]) throw new Error('用法：npm run baseline:ai -- 清单.json before|after [--check]；或 --compare before.json after.json');
    // Loading the existing AI config imports auth/database. Keep that database isolated.
    const temporary = fs.mkdtempSync(path.join(root, 'data', 'ai-baseline-'));
    process.env.MISTAKES_DB_PATH = path.join(temporary, 'baseline.sqlite');
    try {
        const label = args[1] || 'baseline';
        const report = await runBaseline(path.resolve(args[0]), label, { checkOnly: args.includes('--check') });
        if (args.includes('--check')) { console.log(JSON.stringify(report)); return; }
        const output = path.join(root, 'data', `ai-baseline-${label.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}`);
        fs.writeFileSync(`${output}.json`, JSON.stringify(report, null, 2));
        fs.writeFileSync(`${output}.md`, markdownReport(report));
        console.log(`${output}.json\n${output}.md`);
        if (report.cases.some((item) => item.errorCategory)) process.exitCode = 1;
    } finally {
        const databasePath = require.resolve('../server/mistakes/database');
        if (require.cache[databasePath]) require.cache[databasePath].exports.db.close();
        if (path.dirname(path.resolve(temporary)) !== path.join(root, 'data')) throw new Error('评测临时目录不在 data 内。');
        fs.rmSync(temporary, { recursive: true, force: true });
    }
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { loadDataset, runBaseline, markdownReport, compareReports };

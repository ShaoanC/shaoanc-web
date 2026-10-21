const fs = require('node:fs');
const path = require('node:path');
const { requestCompletion, requestAnalysis } = require('./ai-request');
const { parseRecognitionJson } = require('./ai-output');

async function testVision(profile = 'general') {
    if (profile === 'analysis') {
        await requestAnalysis({ input: { question: '计算 1 + 1。', answer: '2' }, context: { type: 'analysis_test', imageCount: 0 } });
        return { message: '生成解析 API 连接测试通过。' };
    }
    const bytes = fs.readFileSync(path.join(__dirname, 'fixtures', 'vision-test.jpg'));
    const segmentation = profile === 'segmentation';
    return requestCompletion({ profile, context: { type: segmentation ? 'segmentation_test' : 'vision_test', imageCount: 1 }, messages: { contents: [{ role: 'user', parts: [
        { text: segmentation ? '请对图片中的文字区域执行 Segmentation。仅返回 JSON 对象 {"regions":[{"label":"文字","box_2d":[ymin,xmin,ymax,xmax],"mask":"Base64 PNG 分割蒙版"}]}。box_2d 为 0–1000 归一化整数坐标，至少返回一个有效文字区域。' : '请仅输出图片中的一行英文和数字字符串，保留短横线，不加引号、解释或代码围栏。' },
        { inlineData: { mimeType: 'image/jpeg', data: bytes.toString('base64') } }
    ] }] }, interpret: (raw) => {
        if (segmentation) {
            const result = parseRecognitionJson(raw);
            const valid = Array.isArray(result.regions) && result.regions.some((region) => {
                const box = region?.box_2d;
                return typeof region?.label === 'string' && Array.isArray(box) && box.length === 4
                    && box.every((value) => Number.isInteger(value) && value >= 0 && value <= 1000)
                    && box[0] < box[2] && box[1] < box[3];
            });
            if (!valid) throw Object.assign(new Error('Segmentation test mismatch'), { code: 'SEGMENTATION_TEST_MISMATCH' });
            return { message: '页面分题 API 连接及区域识别测试通过。' };
        }
        if (raw.trim() !== 'READ-5827') throw Object.assign(new Error('Vision test mismatch'), { code: 'VISION_TEST_MISMATCH' });
        return { message: 'AI 连接及图片识别测试通过。' };
    } });
}

module.exports = { testVision };

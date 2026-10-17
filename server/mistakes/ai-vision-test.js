const fs = require('node:fs');
const path = require('node:path');
const { requestCompletion } = require('./ai-request');

async function testVision() {
    const bytes = fs.readFileSync(path.join(__dirname, 'fixtures', 'vision-test.jpg'));
    return requestCompletion({ context: { type: 'vision_test', imageCount: 1 }, messages: [{ role: 'user', content: [
        { type: 'text', text: '请仅输出图片中的一行英文和数字字符串，保留短横线，不加引号、解释或代码围栏。' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${bytes.toString('base64')}`, detail: 'high' } }
    ] }], interpret: (raw) => {
        if (raw.trim() !== 'READ-5827') throw Object.assign(new Error('Vision test mismatch'), { code: 'VISION_TEST_MISMATCH' });
        return { message: 'AI 连接及图片识别测试通过。' };
    } });
}

module.exports = { testVision };

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const sharp = require('sharp');

const projectDirectory = path.resolve(__dirname, '..');
const dataDirectory = path.join(projectDirectory, 'data');
const temporaryDirectory = fs.mkdtempSync(path.join(dataDirectory, 'export-smoke-'));
const password = 'ExportSmoke2026!';
const defaults = {
    title: '中文错题导出验收', version: 'complete', includeNotes: true, fontSize: 12,
    layout: 'continuous', practiceSpace: 60, answerPlacement: 'inline'
};
let app;
let server;
let baseUrl;

function client() {
    let cookie = '';
    async function request(method, route, body) {
        const form = body instanceof FormData;
        const response = await fetch(`${baseUrl}${route}`, {
            method,
            headers: {
                ...(body === undefined || form ? {} : { 'Content-Type': 'application/json' }),
                ...(cookie ? { Cookie: cookie } : {})
            },
            ...(body === undefined ? {} : { body: form ? body : JSON.stringify(body) })
        });
        for (const value of response.headers.getSetCookie()) cookie = value.split(';', 1)[0];
        return response;
    }
    return {
        request,
        async json(method, route, body, expectedStatus = 200) {
            const response = await request(method, route, body);
            const result = await response.json();
            assert.equal(response.status, expectedStatus, `${method} ${route}: ${JSON.stringify(result)}`);
            assert.equal(result.success, expectedStatus < 400);
            return result.data;
        }
    };
}

function multiplyTransforms(left, right) {
    return [
        left[0] * right[0] + left[2] * right[1], left[1] * right[0] + left[3] * right[1],
        left[0] * right[2] + left[2] * right[3], left[1] * right[2] + left[3] * right[3],
        left[0] * right[4] + left[2] * right[5] + left[4], left[1] * right[4] + left[3] * right[5] + left[5]
    ];
}

async function inspectPdf(response, expectedCount, expectedTitle = defaults.title, reviewPath) {
    assert.equal(response.status, 200, response.ok ? '' : await response.text());
    assert.match(response.headers.get('content-type') || '', /^application\/pdf/);
    assert.equal(Number(response.headers.get('x-export-question-count')), expectedCount);
    const disposition = response.headers.get('content-disposition') || '';
    assert.match(disposition, /filename\*=UTF-8''/i, 'Downloads expose a UTF-8 filename');
    assert.ok(decodeURIComponent(disposition).includes(expectedTitle));
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(Buffer.from(bytes.subarray(0, 5)).toString(), '%PDF-');
    if (reviewPath) fs.writeFileSync(path.resolve(reviewPath), bytes);
    const { getDocument, OPS } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = getDocument({ data: bytes, useSystemFonts: false });
    const document = await task.promise;
    try {
        const pages = [];
        const textItems = [];
        const images = [];
        const links = [];
        let imageCount = 0;
        for (let number = 1; number <= document.numPages; number += 1) {
            const page = await document.getPage(number);
            const content = await page.getTextContent();
            const items = content.items.filter((item) => 'str' in item).map((item) => ({ text: item.str.replace(/\s/g, ''), y: item.transform[5] }));
            textItems.push(items);
            pages.push(items.map((item) => item.text).join(''));
            const operators = await page.getOperatorList();
            imageCount += operators.fnArray.filter((operation) => [OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject].includes(operation)).length;
            const viewport = page.getViewport({ scale: 1 });
            assert.ok(Math.abs(viewport.width - 595.28) < 2 && Math.abs(viewport.height - 841.89) < 2, 'PDF pages use A4 portrait');
            let transform = [1, 0, 0, 1, 0, 0];
            const stack = [];
            for (const [index, operation] of operators.fnArray.entries()) {
                const args = operators.argsArray[index];
                if (operation === OPS.save) stack.push(transform);
                else if (operation === OPS.restore) transform = stack.pop();
                else if (operation === OPS.transform) transform = multiplyTransforms(transform, args);
                else if ([OPS.paintImageXObject, OPS.paintInlineImageXObject].includes(operation)) {
                    const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => [
                        transform[0] * x + transform[2] * y + transform[4], transform[1] * x + transform[3] * y + transform[5]
                    ]);
                    const left = Math.min(...corners.map(([x]) => x));
                    const right = Math.max(...corners.map(([x]) => x));
                    const bottom = Math.min(...corners.map(([, y]) => y));
                    const top = Math.max(...corners.map(([, y]) => y));
                    images.push({ page: number - 1, left, right, bottom, top, width: right - left, height: top - bottom,
                        sourceWidth: operation === OPS.paintImageXObject ? args[1] : args[0].width,
                        sourceHeight: operation === OPS.paintImageXObject ? args[2] : args[0].height });
                }
            }
            links.push(...(await page.getAnnotations()).filter((annotation) => annotation.url).map((annotation) => annotation.url));
            page.cleanup();
        }
        return { pages, text: pages.join('\n'), textItems, imageCount, images, links };
    } finally {
        await task.destroy();
    }
}

function textPosition(pdf, marker) {
    const page = pdf.pages.findIndex((text) => text.includes(marker));
    assert.ok(page >= 0, `PDF retains text marker ${marker}`);
    const offset = pdf.pages[page].indexOf(marker);
    let length = 0;
    const item = pdf.textItems[page].find((entry) => {
        length += entry.text.length;
        return length > offset;
    });
    return page * 841.89 + 841.89 - item.y;
}

function inspectPhotos(pdf, expected) {
    const margin = 15 * 72 / 25.4;
    assert.equal(pdf.imageCount, expected.length, 'Each included photo is drawn exactly once, without page slices');
    assert.equal(pdf.images.length, expected.length);
    for (const [index, image] of pdf.images.entries()) {
        const fixture = expected[index];
        assert.equal(image.sourceWidth, fixture.width, `${fixture.name}: photos retain their submitted order`);
        assert.equal(image.sourceHeight, fixture.height, `${fixture.name}: the full source photo is embedded`);
        assert.ok(Math.abs((image.width / image.height) / (fixture.width / fixture.height) - 1) < .02, `${fixture.name}: aspect ratio is preserved`);
        assert.ok(image.width <= fixture.width * .75 + 1 && image.height <= fixture.height * .75 + 1, `${fixture.name}: photos are never enlarged`);
        assert.ok(image.height <= 230 * 72 / 25.4 + 1, `${fixture.name}: the normal height limit remains 230mm`);
        assert.ok(image.left >= margin - 1 && image.right <= 595.28 - margin + 1 && image.bottom >= margin - 1 && image.top <= 841.89 - margin + 1,
            `${fixture.name}: the whole photo remains inside one page's content area`);
        assert.ok(Math.abs((image.left + image.right) / 2 - 595.28 / 2) < 1, `${fixture.name}: photos are horizontally centered`);
        if (index) {
            const previous = pdf.images[index - 1];
            assert.ok(image.page > previous.page || image.page === previous.page && image.top <= previous.bottom + 1, 'Photos flow in document order without overlap');
        }
        if (fixture.before) assert.ok(textPosition(pdf, fixture.before) <= image.page * 841.89 + 841.89 - image.top + 1, `${fixture.name}: preceding text stays before its photo`);
        if (fixture.after) assert.ok(textPosition(pdf, fixture.after) >= image.page * 841.89 + 841.89 - image.bottom - 1, `${fixture.name}: following text stays after its photo`);
    }
}

async function expectExportFailure(session, source, pattern) {
    const response = await session.request('POST', '/exports/pdf', { source, options: defaults });
    assert.ok(response.status >= 400 && response.status < 500, `Expected a client error, received ${response.status}`);
    const result = await response.json();
    assert.equal(result.success, false);
    assert.match(result.message, pattern);
}

async function upload(session, mistakeId, { width = 80, height = 40, name = 'figure', purpose = 'question' } = {}) {
    const band = Math.min(50, height / 4);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#e4eee8"/><rect width="100%" height="${band}" fill="#79c8a4"/><rect y="${height - band}" width="100%" height="${band}" fill="#e9ab83"/><rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#176448" stroke-width="2"/></svg>`;
    const jpeg = await sharp(Buffer.from(svg)).jpeg().toBuffer();
    const form = new FormData();
    form.append('purpose', purpose);
    form.append('clientId', `export-smoke-${mistakeId}-${name}`);
    form.append('original', new Blob([jpeg], { type: 'image/jpeg' }), 'figure.jpg');
    form.append('crop', new Blob([jpeg], { type: 'image/jpeg' }), 'figure.jpg');
    return session.json('POST', `/mistakes/${mistakeId}/images`, form, 201);
}

async function main() {
    process.env.MISTAKES_DB_PATH = path.join(temporaryDirectory, 'mistakes.sqlite');
    process.env.MISTAKES_UPLOADS_PATH = path.join(temporaryDirectory, 'images');
    process.env.MISTAKES_AI_CONFIG_PATH = path.join(temporaryDirectory, '.env.ai');
    process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
    process.env.NODE_ENV = 'test';
    for (const username of ['export_alice', 'export_bob']) {
        const bootstrap = spawnSync(process.execPath, ['server/mistakes/create-admin.js'], {
            cwd: projectDirectory, encoding: 'utf8',
            env: { ...process.env, MISTAKES_ADMIN_USERNAME: username, MISTAKES_ADMIN_PASSWORD: password }
        });
        assert.equal(bootstrap.status, 0, bootstrap.stderr || bootstrap.stdout);
    }
    app = require('../server/app');
    server = await new Promise((resolve, reject) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/api/mistakes`;
    const alice = client();
    const bob = client();
    const anonymous = client();
    await alice.json('POST', '/auth/login', { username: 'export_alice', password });
    await bob.json('POST', '/auth/login', { username: 'export_bob', password });
    await anonymous.json('POST', '/exports/pdf', { source: { ids: [1] }, options: defaults }, 401);

    const records = [];
    for (let index = 1; index <= 30; index += 1) {
        records.push(await alice.json('POST', '/mistakes', {
            subjectId: 'math', lifecycle: 'archived',
            question: `导出样本${String(index).padStart(2, '0')}：计算 $x+${index}$。`,
            answer: `答案标记${String(index).padStart(2, '0')}：$x=${index}$`,
            analysis: `解析标记${String(index).padStart(2, '0')}：先移项再计算。`,
            note: `笔记标记${String(index).padStart(2, '0')}：留意符号。`
        }, 201));
    }
    const figure = await upload(alice, records[0].id);
    const richQuestion = [
        records[0].question,
        '中文公式与配图：$\\frac{1}{2}+\\sqrt{x}$。',
        '$$\\sum_{n=1}^{10}n=55$$',
        '| 条件 | 数值 |\n| --- | --- |\n| 正数 | 3 |\n| 负数 | -2 |',
        `![几何配图](${figure.cropUrl})`
    ].join('\n\n');
    await alice.json('PATCH', `/mistakes/${records[0].id}`, { question: richQuestion });
    const notePhoto = { name: 'note', width: 100, height: 50, purpose: 'answer' };
    const noteFigure = await upload(alice, records[4].id, notePhoto);
    await alice.json('PATCH', `/mistakes/${records[4].id}`, { note: `${records[4].note}\n\n![笔记图](${noteFigure.cropUrl})` });
    const outsideFilter = await alice.json('POST', '/mistakes', { subjectId: 'physics', lifecycle: 'archived', question: '筛选外物理题' }, 201);
    const foreign = await bob.json('POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: '其他账号私有题' }, 201);
    const foreignFigure = await upload(bob, foreign.id);

    const filtered = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { filters: { lifecycle: 'archived', subjectId: 'math' } }, options: defaults
    }), 30);
    for (let index = 1; index <= 30; index += 1) assert.ok(filtered.text.includes(`导出样本${String(index).padStart(2, '0')}`), `Filtered export includes sample ${index}`);
    assert.ok(filtered.text.includes('中文错题导出验收') && filtered.text.includes('解析标记01') && filtered.text.includes('笔记标记01'), 'Chinese text, analysis and notes retain a selectable text layer');
    assert.ok(!filtered.text.includes('筛选外物理题') && !filtered.text.includes('其他账号私有题'));
    assert.equal(filtered.imageCount, 2, 'Question photos and photos in included notes are embedded');

    const photos = [
        { name: 'first-tall', width: 180, height: 4000, after: '图后标记一' },
        { name: 'small', width: 80, height: 40, before: '小图前标记', after: '小图后标记' },
        { name: 'landscape', width: 1600, height: 700, before: '同段图前标记', after: '同段图后标记' },
        { name: 'portrait', width: 600, height: 1300, before: '同段图前标记', after: '同段图后标记' },
        { name: 'linked', width: 720, height: 240, before: '同段图前标记', after: '同段图后标记' },
        { name: 'appendix-tall', width: 420, height: 3600, purpose: 'answer', after: '答案标记05' },
        { name: 'analysis', width: 1000, height: 300, purpose: 'answer', before: '解析图前标记', after: '解析图后标记' }
    ];
    const photoImages = [];
    for (const photo of photos) photoImages.push(await upload(alice, records[4].id, photo));
    await alice.json('PATCH', `/mistakes/${records[4].id}`, {
        question: [
            `![首张超长图](${photoImages[0].cropUrl})`,
            '导出样本05：照片分页组合。图后标记一。',
            '小图前标记。', `![小图](${photoImages[1].cropUrl})`, '小图后标记。',
            '同段图前标记。',
            `![横图](${photoImages[2].cropUrl})\n![竖图](${photoImages[3].cropUrl})\n[![链接图](${photoImages[4].cropUrl})](https://example.com/photo-review)`,
            '同段图后标记。'
        ].join('\n\n'),
        answer: `![附录超长图](${photoImages[5].cropUrl})\n\n答案标记05：附录长图后。`,
        analysis: `解析标记05：解析图前标记。\n\n![解析图](${photoImages[6].cropUrl})\n\n解析图后标记。`
    });

    const selected = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { ids: [records[4].id, records[1].id] },
        options: { ...defaults, title: '', includeNotes: false, answerPlacement: 'appendix', layout: 'per-question', fontSize: 10.5 }
    }), 2, '错题', process.env.MISTAKES_EXPORT_REVIEW_PATH);
    assert.ok(selected.pages[0].includes('错题'), 'An empty title uses the default document title');
    assert.ok(selected.text.indexOf('导出样本05') < selected.text.indexOf('导出样本02'), 'Explicit selection preserves the submitted display order');
    assert.ok(!selected.text.includes('导出样本01') && !selected.text.includes('笔记标记'), 'Selected export contains only its questions and respects omitted notes');
    const lastQuestionPage = selected.pages.findIndex((page) => page.includes('导出样本02'));
    const answerPage = selected.pages.findIndex((page) => page.includes('答案标记05'));
    assert.ok(lastQuestionPage > 0 && answerPage > lastQuestionPage, 'Each question starts a new page and the answer appendix follows on a later page');
    assert.ok(selected.text.indexOf('答案标记05') < selected.text.indexOf('答案标记02'));
    inspectPhotos(selected, photos);
    assert.ok(Math.abs(selected.images[1].width - 60) < 1 && Math.abs(selected.images[1].height - 30) < 1, 'The small 80×40 photo keeps its natural CSS size');
    assert.ok(selected.images[2].width > 490 && selected.images[3].height > 640, 'Landscape and portrait photos use the available width or normal height cap');
    assert.ok(selected.pages[selected.images[0].page].includes('第1题'), 'A first tall photo remains on the same page as its question number');
    assert.ok(selected.pages[selected.images[5].page].includes('第1题') && selected.pages[selected.images[5].page].includes('正确答案'), 'An appendix first photo remains with its number and answer heading');
    assert.ok(selected.images[2].page < selected.images[3].page, 'Multiple photos from one Markdown paragraph can move independently to later pages');
    assert.ok(selected.links.includes('https://example.com/photo-review'), 'A linked photo retains its PDF link annotation');

    await alice.json('PATCH', `/mistakes/${records[0].id}`, {
        question: `${richQuestion}\n\n${Array.from({ length: 55 }, (_, index) => `长题第${index + 1}段：根据已知条件列式，写出必要的推导过程并验证计算结果。`).join('\n\n')}`
    });
    const practice = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { ids: [records[0].id] }, options: { ...defaults, version: 'practice', fontSize: 14, practiceSpace: 60 }
    }), 1);
    assert.ok(practice.pages.length > 1 && practice.text.includes('长题第55段'), 'A long single question continues across pages without losing its final paragraph');
    assert.equal(practice.imageCount, 1, 'Practice exports include the question photo without answer or note photos');
    assert.ok(!/答案标记|解析标记|笔记标记/.test(practice.text), 'Practice exports omit answers, analysis and notes');

    await expectExportFailure(alice, { ids: [foreign.id] }, /错题|题目|选择|权限/);
    await alice.json('DELETE', `/mistakes/${outsideFilter.id}`);
    await expectExportFailure(alice, { ids: [outsideFilter.id] }, /错题|题目|选择|恢复/);
    const invalidFigure = await alice.json('POST', '/mistakes', {
        subjectId: 'math', lifecycle: 'archived', question: `越权图片检查\n\n![私有图](${foreignFigure.cropUrl})`
    }, 201);
    await expectExportFailure(alice, { ids: [invalidFigure.id] }, /配图|图片|第1题|第 1 题/);
    console.log('PDF export smoke passed: complete filtered results, selected order, long practice, appendix pagination, Chinese text, photo sizing/centering/page bounds/order, image links, notes and ownership.');
}

async function cleanup() {
    const pdfPath = require.resolve('../server/mistakes/pdf-export');
    if (require.cache[pdfPath]) await require(pdfPath).closePdfBrowser();
    if (server) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    }
    app?.db.close();
    const resolved = path.resolve(temporaryDirectory);
    assert.equal(path.dirname(resolved), dataDirectory);
    assert.match(path.basename(resolved), /^export-smoke-/);
    fs.rmSync(resolved, { recursive: true, force: true });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(cleanup);

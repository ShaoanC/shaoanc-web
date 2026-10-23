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
    layout: 'continuous', practiceSpace: 40, answerPlacement: 'inline'
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

async function inspectPdf(response, expectedCount, expectedTitle = defaults.title) {
    assert.equal(response.status, 200, response.ok ? '' : await response.text());
    assert.match(response.headers.get('content-type') || '', /^application\/pdf/);
    assert.equal(Number(response.headers.get('x-export-question-count')), expectedCount);
    const disposition = response.headers.get('content-disposition') || '';
    assert.match(disposition, /filename\*=UTF-8''/i, 'Downloads expose a UTF-8 filename');
    assert.ok(decodeURIComponent(disposition).includes(expectedTitle));
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(Buffer.from(bytes.subarray(0, 5)).toString(), '%PDF-');
    const { getDocument, OPS } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = getDocument({ data: bytes, useSystemFonts: false });
    const document = await task.promise;
    try {
        const pages = [];
        let imageCount = 0;
        for (let number = 1; number <= document.numPages; number += 1) {
            const page = await document.getPage(number);
            const content = await page.getTextContent();
            pages.push(content.items.filter((item) => 'str' in item).map((item) => item.str).join('').replace(/\s/g, ''));
            const operators = await page.getOperatorList();
            imageCount += operators.fnArray.filter((operation) => [OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject].includes(operation)).length;
            const viewport = page.getViewport({ scale: 1 });
            assert.ok(Math.abs(viewport.width - 595.28) < 2 && Math.abs(viewport.height - 841.89) < 2, 'PDF pages use A4 portrait');
            page.cleanup();
        }
        return { pages, text: pages.join('\n'), imageCount };
    } finally {
        await task.destroy();
    }
}

async function expectExportFailure(session, source, pattern) {
    const response = await session.request('POST', '/exports/pdf', { source, options: defaults });
    assert.ok(response.status >= 400 && response.status < 500, `Expected a client error, received ${response.status}`);
    const result = await response.json();
    assert.equal(result.success, false);
    assert.match(result.message, pattern);
}

async function upload(session, mistakeId) {
    const jpeg = await sharp({ create: { width: 80, height: 40, channels: 3, background: '#176448' } }).jpeg().toBuffer();
    const form = new FormData();
    form.append('purpose', 'question');
    form.append('clientId', `export-smoke-${mistakeId}`);
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
    const outsideFilter = await alice.json('POST', '/mistakes', { subjectId: 'physics', lifecycle: 'archived', question: '筛选外物理题' }, 201);
    const foreign = await bob.json('POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: '其他账号私有题' }, 201);
    const foreignFigure = await upload(bob, foreign.id);

    const filtered = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { filters: { lifecycle: 'archived', subjectId: 'math' } }, options: defaults
    }), 30);
    for (let index = 1; index <= 30; index += 1) assert.ok(filtered.text.includes(`导出样本${String(index).padStart(2, '0')}`), `Filtered export includes sample ${index}`);
    assert.ok(filtered.text.includes('中文错题导出验收') && filtered.text.includes('解析标记01') && filtered.text.includes('笔记标记01'), 'Chinese text, analysis and notes retain a selectable text layer');
    assert.ok(!filtered.text.includes('筛选外物理题') && !filtered.text.includes('其他账号私有题'));
    assert.ok(filtered.imageCount > 0, 'An authorized local illustration is embedded in the PDF');

    const selected = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { ids: [records[4].id, records[1].id] },
        options: { ...defaults, title: '', includeNotes: false, answerPlacement: 'appendix', layout: 'per-question', fontSize: 10.5 }
    }), 2, '错题');
    assert.ok(selected.pages[0].includes('错题'), 'An empty title uses the default document title');
    assert.ok(selected.text.indexOf('导出样本05') < selected.text.indexOf('导出样本02'), 'Explicit selection preserves the submitted display order');
    assert.ok(!selected.text.includes('导出样本01') && !selected.text.includes('笔记标记'), 'Selected export contains only its questions and respects omitted notes');
    const lastQuestionPage = selected.pages.findIndex((page) => page.includes('导出样本02'));
    const answerPage = selected.pages.findIndex((page) => page.includes('答案标记05'));
    assert.ok(lastQuestionPage > 0 && answerPage > lastQuestionPage, 'Each question starts a new page and the answer appendix follows on a later page');
    assert.ok(selected.text.indexOf('答案标记05') < selected.text.indexOf('答案标记02'));

    await alice.json('PATCH', `/mistakes/${records[0].id}`, {
        question: `${richQuestion}\n\n${Array.from({ length: 55 }, (_, index) => `长题第${index + 1}段：根据已知条件列式，写出必要的推导过程并验证计算结果。`).join('\n\n')}`
    });
    const practice = await inspectPdf(await alice.request('POST', '/exports/pdf', {
        source: { ids: [records[0].id] }, options: { ...defaults, version: 'practice', fontSize: 14, practiceSpace: 60 }
    }), 1);
    assert.ok(practice.pages.length > 1 && practice.text.includes('长题第55段'), 'A long single question continues across pages without losing its final paragraph');
    assert.ok(practice.imageCount > 0);
    assert.ok(!/答案标记|解析标记|笔记标记/.test(practice.text), 'Practice exports omit answers, analysis and notes');

    await expectExportFailure(alice, { ids: [foreign.id] }, /错题|题目|选择|权限/);
    await alice.json('DELETE', `/mistakes/${outsideFilter.id}`);
    await expectExportFailure(alice, { ids: [outsideFilter.id] }, /错题|题目|选择|恢复/);
    const invalidFigure = await alice.json('POST', '/mistakes', {
        subjectId: 'math', lifecycle: 'archived', question: `越权图片检查\n\n![私有图](${foreignFigure.cropUrl})`
    }, 201);
    await expectExportFailure(alice, { ids: [invalidFigure.id] }, /配图|图片|第1题|第 1 题/);
    console.log('PDF export smoke passed: complete filtered results, selected order, single long practice, appendix pagination, Chinese text, local figures and ownership.');
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

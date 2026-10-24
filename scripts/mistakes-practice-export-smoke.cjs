const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dataDirectory = path.resolve(__dirname, '../data');
const reviewDirectory = path.join(dataDirectory, 'practice-export-qa');
const temporaryDirectory = fs.mkdtempSync(path.join(dataDirectory, 'practice-export-smoke-'));
process.env.MISTAKES_DB_PATH = path.join(temporaryDirectory, 'practice.sqlite');
process.env.MISTAKES_UPLOADS_PATH = path.join(temporaryDirectory, 'uploads');
process.env.MISTAKES_AI_CONFIG_PATH = path.join(temporaryDirectory, '.env.ai');
process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
process.env.NODE_ENV = 'test';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(dataDirectory, '.playwright');
const { chromium } = require('playwright');
let app;
let server;
let browser;

async function json(context, base, method, route, data) {
    const response = await context.request.fetch(`${base}/api/mistakes${route}`, { method, data });
    const result = await response.json();
    assert.ok(response.ok() && result.success, `${method} ${route}: ${JSON.stringify(result)}`);
    return result.data;
}

async function practiceSettings(context, base) {
    const page = await context.newPage();
    await page.goto(`${base}/mistakes/`, { waitUntil: 'networkidle' });
    await page.locator('.mistake-row').first().waitFor();
    const closeToast = page.locator('.Toastify__close-button');
    if (await closeToast.count()) await closeToast.first().click();
    await page.getByRole('button', { name: '导出', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: '导出错题', exact: true });
    await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
    await page.getByRole('radio', { name: /练习版/ }).check();
    const picker = page.getByRole('spinbutton', { name: '每题答题留白', exact: true });
    await picker.waitFor();
    assert.equal(await picker.getAttribute('aria-valuenow'), '60', 'Practice answer space defaults to 60mm');
    return { page, dialog, picker };
}

async function desktopControls(context, base) {
    const { page, picker } = await practiceSettings(context, base);
    const increase = page.getByRole('button', { name: '增加答题留白', exact: true });
    const decrease = page.getByRole('button', { name: '减少答题留白', exact: true });
    await increase.click();
    assert.equal(await picker.inputValue(), '61');
    await decrease.click();
    assert.equal(await picker.inputValue(), '60');
    for (const [value, disabledButton, key] of [[10, decrease, 'ArrowDown'], [70, increase, 'ArrowUp']]) {
        await picker.fill(String(value));
        await picker.press('Tab');
        assert.equal(await picker.getAttribute('aria-valuenow'), String(value));
        assert.equal(await disabledButton.isDisabled(), true, `The ${value}mm boundary disables its arrow`);
        await picker.press(key);
        assert.equal(await picker.inputValue(), String(value), 'Arrow keys cannot exceed the supported range');
    }
    await picker.fill('60');
    await picker.press('Tab');
    await page.screenshot({ path: path.join(reviewDirectory, 'desktop.png') });
    await page.close();
}

async function touchDrag(page, box, deltaY) {
    const session = await page.context().newCDPSession(page);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    try {
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 10; step += 1) {
            await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + deltaY * step / 10 }] });
            await page.waitForTimeout(30);
        }
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally {
        await session.detach();
    }
}

async function wheelSettled(picker) {
    let previous;
    let stable = 0;
    for (let attempt = 0; attempt < 40; attempt += 1) {
        const value = await picker.getAttribute('aria-valuenow');
        stable = value === previous ? stable + 1 : 0;
        if (stable >= 4) return Number(value);
        previous = value;
        await picker.page().waitForTimeout(100);
    }
    assert.fail('The wheel did not settle');
}

async function mobileControls(context, base) {
    const { page, dialog, picker } = await practiceSettings(context, base);
    const content = dialog.locator('.mobile-filters-content');
    await picker.scrollIntoViewIfNeeded();
    const before = await content.evaluate((element) => ({ top: element.scrollTop, page: window.scrollY }));
    const wheel = picker.locator('[data-rwp]').first();
    const box = await wheel.boundingBox();
    assert.ok(box, 'The mobile wheel is present');
    await touchDrag(page, box, -45);
    const upValue = await wheelSettled(picker);
    assert.ok(upValue > 60 && upValue <= 70, `A real upward touch drag selects a larger value (${upValue})`);
    await touchDrag(page, await wheel.boundingBox(), 45);
    const downValue = await wheelSettled(picker);
    assert.ok(downValue < upValue && downValue >= 10, `A real downward touch drag selects a smaller value (${downValue})`);
    assert.equal(await dialog.isVisible(), true, 'Wheel drags keep the export drawer open');
    assert.deepEqual(await content.evaluate((element) => ({ top: element.scrollTop, page: window.scrollY })), before, 'Wheel gestures leave both the drawer content and page scroll unchanged');

    await content.evaluate((element) => { element.scrollTop = 0; });
    const contentBox = await content.boundingBox();
    assert.ok(contentBox, 'The drawer scroll area is present');
    // Drag an ordinary settings row near the top, clear of the wheel.
    await touchDrag(page, { x: contentBox.x + 12, y: contentBox.y + 120, width: 24, height: 40 }, -85);
    await page.waitForFunction(() => document.querySelector('.export-mobile-drawer .mobile-filters-content').scrollTop > 20);
    assert.equal(await dialog.isVisible(), true, 'Scrolling other settings keeps the drawer open');

    await picker.scrollIntoViewIfNeeded();
    await picker.press('End');
    assert.equal(await picker.getAttribute('aria-valuenow'), '70');
    await picker.press('ArrowUp');
    assert.equal(await picker.getAttribute('aria-valuenow'), '70', 'The mobile wheel respects its upper boundary');
    await picker.press('Home');
    await picker.press('ArrowDown');
    assert.equal(await picker.getAttribute('aria-valuenow'), '10', 'The mobile wheel respects its lower boundary');
    await picker.press('End');
    await wheelSettled(picker);
    await page.screenshot({ path: path.join(reviewDirectory, 'mobile.png') });
    const requestPromise = page.waitForRequest((request) => request.method() === 'POST' && request.url().endsWith('/exports/pdf'));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '下载 PDF', exact: true }).click();
    const request = await requestPromise;
    assert.equal(request.postDataJSON().options.practiceSpace, 70, 'The mobile selected value is sent to PDF export');
    const download = await downloadPromise;
    await download.saveAs(path.join(reviewDirectory, 'mobile70.pdf'));
    assert.equal(await download.failure(), null, 'The API accepts the mobile 70mm selection and downloads a PDF');
    await page.close();
}

async function printedLayout(context, base, mistakes) {
    const measured = {};
    for (const [version, practiceSpace] of [['practice', 60], ['practice', 10], ['practice', 70], ['complete', 60]]) {
        const page = await context.newPage();
        await page.addInitScript((payload) => { window.__MISTAKE_EXPORT_DATA__ = payload; }, {
            mistakes,
            subjects: [{ id: 'math', name: '数学' }],
            knowledgePoints: [],
            date: '2026-10-24',
            options: { title: '练习版留白验收', version, includeNotes: false, fontSize: 12, layout: 'continuous', practiceSpace, answerPlacement: 'inline' },
        });
        await page.emulateMedia({ media: 'print' });
        await page.goto(`${base}/mistakes/export.html`, { waitUntil: 'load' });
        await page.waitForFunction(() => window.__MISTAKE_EXPORT_READY__ || window.__MISTAKE_EXPORT_ERROR__);
        assert.equal(await page.evaluate(() => window.__MISTAKE_EXPORT_ERROR__), '');
        const layout = await page.locator('.export-question').evaluateAll((questions) => questions.map((question) => {
            const blank = question.querySelector('.export-answer-space');
            return {
                border: getComputedStyle(question).borderBottomWidth,
                top: question.querySelector('h2').getBoundingClientRect().top,
                blankHeight: blank?.getBoundingClientRect().height,
                blankBorder: blank && getComputedStyle(blank).borderBottomWidth,
            };
        }));
        if (version === 'practice') {
            for (const question of layout) {
                assert.equal(question.border, '0px', 'Practice questions have no divider');
                assert.equal(question.blankBorder, '0px', 'Practice answer space has no divider');
                assert.ok(Math.abs(question.blankHeight - practiceSpace * 96 / 25.4) < .1, `Practice answer space is ${practiceSpace}mm`);
            }
            measured[practiceSpace] = layout[1].top - layout[0].top;
        } else {
            assert.ok(parseFloat(layout[0].border) > 0, 'Complete exports retain the question divider');
        }
        await page.close();
    }
    assert.ok(measured[10] < measured[60] && measured[60] < measured[70], 'The selected answer space adjusts the distance between questions');
    return measured[60];
}

async function defaultPdf(context, base, mistakes, expectedHeadingDistance) {
    const source = { ids: mistakes.map((mistake) => mistake.id) };
    for (const practiceSpace of [9, 71, 10.5]) {
        const response = await context.request.post(`${base}/api/mistakes/exports/pdf`, { data: { source, options: { version: 'practice', practiceSpace } } });
        assert.equal(response.status(), 400, `${practiceSpace}mm is rejected without PDF generation`);
    }
    const response = await context.request.post(`${base}/api/mistakes/exports/pdf`, { data: { source, options: { title: '练习版留白验收', version: 'practice', includeNotes: false } } });
    assert.equal(response.status(), 200, response.ok() ? '' : await response.text());
    assert.match(response.headers()['content-type'], /^application\/pdf/);
    const bytes = await response.body();
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    fs.writeFileSync(path.join(reviewDirectory, 'default60.pdf'), bytes);
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: false });
    try {
        const document = await task.promise;
        const firstPage = await document.getPage(1);
        const content = await firstPage.getTextContent();
        const items = content.items.filter((item) => 'str' in item).map((item) => ({ text: item.str.replace(/\s/g, ''), y: item.transform[5] }));
        const text = items.map((item) => item.text).join('');
        function headingY(marker) {
            const position = text.indexOf(marker);
            assert.ok(position >= 0, `${marker} is present on the first PDF page`);
            let length = 0;
            return items.find((item) => { length += item.text.length; return length > position; }).y;
        }
        const distance = (headingY('第1题') - headingY('第2题')) * 96 / 72;
        assert.ok(Math.abs(distance - expectedHeadingDistance) < 2, `An omitted practiceSpace uses the same 60mm layout (${distance.toFixed(1)}px)`);
    } finally {
        await task.destroy();
    }
}

async function main() {
    fs.mkdirSync(reviewDirectory, { recursive: true });
    app = require('../server/app');
    const { hashPassword } = require('../server/mistakes/auth');
    app.db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)").run('practice_export_smoke', hashPassword('PracticeExport2026!'), new Date().toISOString());
    server = await new Promise((resolve, reject) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await desktop.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await json(desktop, base, 'POST', '/auth/login', { username: 'practice_export_smoke', password: 'PracticeExport2026!' });
    const mistakes = [];
    for (let index = 1; index <= 2; index += 1) {
        mistakes.push(await json(desktop, base, 'POST', '/mistakes', { subjectId: 'math', lifecycle: 'archived', question: '求解方程：$x+2=5$。', answer: '$x=3$。', analysis: '根据等式性质求解。' }));
    }
    await desktopControls(desktop, base);
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, storageState: await desktop.storageState() });
    await mobile.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await mobileControls(mobile, base);
    const expectedHeadingDistance = await printedLayout(desktop, base, mistakes);
    await defaultPdf(desktop, base, mistakes, expectedHeadingDistance);
    await mobile.close();
    await desktop.close();
    console.log('Practice PDF smoke passed: 10–70mm controls, default 60mm, contained mobile touch scrolling, PDF spacing and practice-only divider removal.');
}

async function cleanup() {
    await browser?.close();
    const pdfModule = require.resolve('../server/mistakes/pdf-export');
    if (require.cache[pdfModule]) await require(pdfModule).closePdfBrowser();
    if (server) {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    }
    app?.db.close();
    const target = path.resolve(temporaryDirectory);
    assert.equal(path.dirname(target), dataDirectory);
    assert.match(path.basename(target), /^practice-export-smoke-/);
    fs.rmSync(target, { recursive: true, force: true });
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(cleanup);

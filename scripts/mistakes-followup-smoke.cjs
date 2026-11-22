const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { once } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');
const { resolveVendorIcon } = require('../shared/vendor-icon.mjs');

const root = path.resolve(__dirname, '..');
const directory = fs.mkdtempSync(path.join(root, 'data', 'followup-smoke-'));
const exportText = '导出追问独有词';
const replyOnlyText = '钨铼合金反应堆';
const password = 'FollowupSmoke2026!';
const geminiKey = 'local-gemini-smoke-key';
const calls = [];
let base;
let app;
let server;
let browser;
let cancelled = false;
let failedOnce = false;
let loadingResponse;
function claudeEvent(type, fields = {}) {
    return 'event: ' + type + '\r\ndata: ' + JSON.stringify({ type, ...fields }) + '\r\n\r\n';
}
function claudeText(text) {
    return claudeEvent('content_block_delta', { index: 2, delta: { type: 'text_delta', text } });
}
const claudeFinish = claudeEvent('content_block_stop', { index: 2 })
    + claudeEvent('message_delta', { delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 500 } })
    + claudeEvent('message_stop');
const provider = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks));
    const gemini = Boolean(body.contents);
    const last = gemini ? body.contents.at(-1).parts[0].text : (body.input || body.messages).at(-1).content;
    calls.push({ path: req.url, body, last });
    function json(status, value) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(value));
    }
    if (req.url === '/v1/messages') {
        if (!req.headers['x-api-key'] || req.headers['anthropic-version'] !== '2023-06-01') {
            return json(401, { error: { message: 'Missing Messages API credentials or version' } });
        }
        const usage = { input_tokens: 1000, cache_creation_input_tokens: 100, cache_read_input_tokens: 400, output_tokens: 1 };
        if (last === '非流式思考摘要') {
            if (body.stream) return json(400, { error: { message: 'Streaming is not supported' } });
            return json(200, { type: 'message', stop_reason: 'end_turn', usage: { ...usage, output_tokens: 500 }, content: [
                { type: 'thinking', thinking: '列式' }, { type: 'redacted_thinking', data: 'opaque' }, { type: 'text', text: '解题' }
            ] });
        }
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        res.write(claudeEvent('message_start', { message: { type: 'message', content: [], usage } })
            + claudeEvent('content_block_start', { index: 0, content_block: { type: 'thinking', thinking: '' } })
            + claudeEvent('content_block_delta', { index: 0, delta: { type: 'thinking_delta', thinking: '核对' } })
            + claudeEvent('ping')
            + claudeEvent('content_block_delta', { index: 0, delta: { type: 'thinking_delta', thinking: '条件' } })
            + claudeEvent('content_block_delta', { index: 0, delta: { type: 'signature_delta', signature: 'opaque' } })
            + claudeEvent('content_block_stop', { index: 0 })
            + claudeEvent('content_block_start', { index: 1, content_block: { type: 'redacted_thinking', data: 'opaque' } })
            + claudeEvent('content_block_stop', { index: 1 })
            + claudeEvent('content_block_start', { index: 2, content_block: { type: 'text', text: '' } }));
        if (last === '逐步推导') {
            loadingResponse = res;
            res.write(claudeText('') + claudeText(' \n\t'));
        } else {
            res.end(claudeText('解') + claudeText('题') + claudeFinish);
        }
        return;
    }
    if (last === '暂时故障' && !failedOnce) {
        failedOnce = true;
        return json(502, { error: { message: 'temporary failure' } });
    }
    if (last === '兼容接口非流式') {
        if (body.stream) return json(400, { error: { message: 'Streaming is not supported' } });
        return json(200, { choices: [{ message: { content: '兼容接口完整回复 $x=4$' }, finish_reason: 'stop' }] });
    }
    if (gemini && last === '文字降级') {
        if (body.contents[0].parts.some((part) => part.inlineData)) {
            return json(400, { error: { message: 'Image inputs are not supported by this model' } });
        }
        if (req.url.includes(':streamGenerateContent')) return json(501, { error: { message: 'Streaming unsupported' } });
        return json(200, { candidates: [{ content: { parts: [{ text: '非流式完整回答 $x=4$' }] }, finishReason: 'STOP' }] });
    }
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    const packet = (value) => 'data: ' + JSON.stringify(value) + '\r\n\r\n';
    if (req.url.endsWith('/responses')) {
        const status = calls.filter((call) => call.last === last).length === 1 ? 'incomplete' : 'completed';
        if (status === 'incomplete') res.write(packet({ type: 'response.reasoning_summary_text.delta', delta: '先列' }));
        res.write(packet({ type: 'response.output_text.delta', delta: '得到两个根' }));
        res.end(packet({ type: 'response.' + status, response: {
            output: [{ type: 'reasoning', summary: [{ type: 'summary_text', text: '先列方程' }] },
                { type: 'message', content: [{ type: 'output_text', text: '得到两个根' }] }],
            status, usage: { input_tokens: 1800, input_tokens_details: { cached_tokens: 500 }, output_tokens: 700, total_tokens: 2500 }
        } }));
        return;
    }
    const reply = last === '验证搜索隔离' ? replyOnlyText : last === '暂时故障' ? exportText
        : last === '停止测试' ? '答'.repeat(99) + ' ![](https://smoke.invalid/image.png) '
            : last === '足量停止' ? '答'.repeat(100) : '模拟回复';
    if (gemini) {
        res.write(packet({ candidates: [{ content: { parts: [{ text: '内部推理', thought: true }, { text: 'Gemini 流式答复 ' }] } }] }));
        res.end(packet({ candidates: [{ content: { parts: [{ text: '$x=4$' }] }, finishReason: 'STOP' }],
            usageMetadata: { promptTokenCount: 1000, cachedContentTokenCount: 500, candidatesTokenCount: 700, thoughtsTokenCount: 300, totalTokenCount: 2000 } }));
        return;
    }
    if (last === '暂时故障' || last === '切换错题') {
        const delta = last === '暂时故障' ? { reasoning: '检查题目条件' } : {
            reasoning_details: [{ type: 'reasoning.encrypted', data: 'opaque' }, { type: 'reasoning.summary', summary: '检查题目条件' }]
        };
        res.write(packet({ choices: [{ delta }] }));
        if (last === '切换错题') await delay(300);
    }
    if (last === '断连继续') res.write(packet({ choices: [{ delta: { reasoning_content: '验证两边相等' } }] }));
    const first = packet({ choices: [{ delta: { content: reply } }],
        ...(last === '停止测试' && { usage: { prompt_tokens: 10, completion_tokens: 99, total_tokens: 109 } }) });
    res.write(first.slice(0, -2));
    res.write(first.slice(-2));
    if (last === '停止测试' || last === '足量停止') {
        res.on('close', () => { cancelled = true; });
        return;
    }
    if (last === '断连继续') await delay(750);
    if (last === '切换错题') await delay(1800);
    const total = last === '用完最后积分' ? 4000 : last === '小数倍率舍入' ? 10000 : 2000;
    if (!res.destroyed) res.end(packet({ choices: [{ delta: { content: ' $x=4$' }, finish_reason: 'stop' }] })
        + packet({ choices: [], usage: { prompt_tokens: 1500, completion_tokens: total - 1500, total_tokens: total,
            ...(last === '断连继续' && { prompt_cache_hit_tokens: 1000 }),
            ...(last === '用完最后积分' && { prompt_tokens_details: { cached_tokens: 1500 } }) } }) + 'data: [DONE]\n\n');
});

function client() {
    let cookie = '';
    async function request(method, route, body, signal) {
        const response = await fetch(base + '/api/mistakes' + route, {
            method, signal, headers: { Cookie: cookie, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
        for (const value of response.headers.getSetCookie()) cookie = value.split(';', 1)[0];
        return response;
    }
    async function data(method, route, body, expected = 200) {
        const response = await request(method, route, body);
        const result = await response.json();
        assert.equal(response.status, expected, method + ' ' + route + ' ' + JSON.stringify(result));
        return expected < 400 ? result.data : result;
    }
    return {
        request, data, get cookie() { return cookie; },
        async login(username) { return data('POST', '/auth/login', { username, password }); }
    };
}

async function events(response, receive = () => {}) {
    assert.equal(response.status, 200, response.ok ? '' : await response.text());
    assert.match(response.headers.get('content-type'), /^text\/event-stream/);
    assert.equal(response.headers.get('x-accel-buffering'), 'no');
    const frames = [];
    let buffer = '';
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
        buffer += chunk;
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop();
        for (const block of blocks) {
            const [type, data] = block.split('\n');
            if (!type.startsWith('event:')) continue;
            const frame = { type: type.slice(7), ...JSON.parse(data.slice(6)) };
            frames.push(frame);
            await receive(frame);
        }
    }
    return frames;
}

const followups = (id) => '/' + id + '/followups';
const configRoute = '/admin/ai/config?profile=followup';
const ask = async (actor, id, question, profileId) => events(await actor.request('POST', followups(id) + '/stream', { question, profileId }));

function assertIcon(vendor, model, baseUrl, expected) {
    assert.equal(resolveVendorIcon(vendor, model, baseUrl), expected, model || baseUrl || vendor);
}

function checkVendorIcons() {
    for (const [model, expected] of Object.entries({
        'gpt-5-mini': 'openai', 'openai/o3-mini': 'openai', 'claude-sonnet': 'anthropic', 'gemma-4': 'google',
        'deepseek-v4': 'deepseek', 'qwen3': 'qwen', 'kimi-k2': 'kimi', 'glm-5': 'zhipu', 'grok-4': 'xai',
        'llama-4': 'meta', 'meta/muse': 'meta', 'minimax-m2': 'minimax', 'mimo-v2': 'xiaomi', 'mixtral': 'mistral',
    })) assertIcon('', model, 'https://proxy.invalid', expected);
    assertIcon('', 'unknown', 'https://api.moonshot.cn/v1', 'kimi');
    assertIcon('', 'gemini-3', 'https://api.openai.com/v1', 'google');
    assertIcon('openai', 'claude-sonnet', '', 'openai');
    assertIcon('default', 'gpt-5', '', 'default');
    assertIcon('', 'unknown', 'https://openai.com.proxy.invalid/v1', 'default');
}

async function pdfText(data) {
    assert.ok(data.byteLength, 'Expected non-empty PDF bytes');
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = getDocument({ data: new Uint8Array(data), useSystemFonts: false });
    try {
        const document = await task.promise;
        let text = '';
        for (let i = 1; i <= document.numPages; i++) {
            const content = await (await document.getPage(i)).getTextContent();
            text += content.items.map((item) => item.str || '').join('');
        }
        return text.replace(/\s/g, '');
    } finally { await task.destroy(); }
}

async function downloadPdf(actor, options) {
    const response = await actor.request('POST', '/exports/pdf', options);
    assert.equal(response.status, 200, response.ok ? '' : await response.text());
    return pdfText(await response.arrayBuffer());
}

async function checkStreamingStates(actor, mistakeId, width) {
    const mobile = width < 640;
    const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: mobile, hasTouch: mobile });
    try {
        await context.addCookies([{
            name: 'mistakes_session', value: actor.cookie.split('=')[1], domain: '127.0.0.1', path: '/api/mistakes'
        }]);
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        await page.goto(base + '/mistakes/#/mistakes/' + mistakeId, { waitUntil: 'domcontentloaded' });
        await page.getByRole('button', { name: /追问 AI/ }).click();
        const drawer = page.getByRole('dialog', { name: '追问 AI' });
        const turn = drawer.locator('.followup-turn').last();
        const thoughtToggle = turn.getByRole('button', { name: '思考过程', exact: true });
        const thoughtText = turn.locator('.followup-thought-text');
        const word = turn.locator('.followup-thinking-word');
        const wave = turn.locator('.followup-wave');
        const writing = turn.locator('.followup-writing');
        const stop = drawer.getByRole('button', { name: '停止生成' });
        const send = drawer.getByRole('button', { name: '发送', exact: true });
        const scroll = drawer.locator('.followup-scroll, .mobile-filters-content');
        const jump = drawer.getByRole('button', { name: '滚动到底部' });
        const fits = () => drawer.evaluate((panel) => document.documentElement.scrollWidth <= innerWidth + 1
            && [panel, panel.querySelector('.followup-scroll, .mobile-filters-content'), panel.querySelector('.followup-turn:last-child .followup-answer')]
                .every((part) => part.scrollWidth <= part.clientWidth + 1));

        for (const outcome of ['completed', 'cancelled', 'failed']) {
            await drawer.getByRole('textbox', { name: '输入追问' }).fill('逐步推导');
            await send.click();
            await wave.waitFor();
            await thoughtText.waitFor();
            assert.equal(await thoughtText.textContent(), '核对条件');
            assert.equal(await thoughtToggle.getAttribute('aria-expanded'), 'true');
            assert.equal(await drawer.getByRole('button', { name: '思考过程', exact: true }).count(), 1);
            await drawer.locator('.followup-turn:not(:last-child) .followup-thought-toggle').waitFor({ state: 'detached' });
            const initialWord = await word.innerText();
            assert.match(initialWord, /^[A-Z][a-z ]+\.\.\.$/);
            assert.equal(await turn.getByText(/正在生成/).count(), 0);
            assert.equal(await writing.count(), 0);
            assert.ok(await stop.isEnabled() && await fits());
            if (outcome === 'completed') {
                const bars = wave.locator(':scope > span');
                assert.ok(await bars.count() >= 8);
                assert.equal(await bars.first().evaluate((bar) => getComputedStyle(bar, '::before').animationName), 'followup-wave');
                await page.waitForFunction((first) => document.querySelector('.followup-thinking-word')?.textContent !== first, initialWord);
                assert.notEqual(await word.innerText(), initialWord);
                await page.emulateMedia({ reducedMotion: 'reduce' });
                assert.equal(await bars.first().evaluate((bar) => getComputedStyle(bar, '::before').animationName), 'none');
                assert.equal(await wave.evaluate((group) => getComputedStyle(group).animationName), 'followup-breathe');
                await page.emulateMedia({ reducedMotion: 'no-preference' });
            }
            if (outcome === 'failed') {
                loadingResponse.end(claudeEvent('error', { error: { type: 'overloaded_error', message: 'Overloaded' } }));
                await turn.getByRole('button', { name: '重试' }).waitFor();
            } else {
                loadingResponse.write(claudeText('解'));
                await turn.locator('.followup-answer-text').getByText('解', { exact: true }).waitFor();
                await writing.waitFor();
                assert.equal(await thoughtToggle.getAttribute('aria-expanded'), 'false');
                await thoughtText.waitFor({ state: 'hidden' });
                assert.equal(await turn.getByText(/书写中/).count(), 0);
                const dots = writing.locator('.followup-dots > i');
                const animations = () => dots.evaluateAll((items) => items.map((dot) => getComputedStyle(dot).animationName));
                assert.deepEqual(await animations(), Array(3).fill('followup-dot-bounce'));
                const delays = await dots.evaluateAll((items) => items.map((dot) => parseFloat(getComputedStyle(dot).animationDelay)));
                assert.ok(delays[0] < delays[1] && delays[1] < delays[2]);
                if (outcome === 'completed') {
                    await thoughtToggle.click();
                    await thoughtText.waitFor();
                    loadingResponse.write(claudeText('题'));
                    const answer = turn.locator('.followup-answer-text');
                    const newText = answer.locator('.followup-stream-chunk').filter({ hasText: /^题\s*$/ });
                    await page.waitForFunction(() => document.querySelector('.followup-turn:last-child .followup-answer-text')?.textContent.trim() === '解题');
                    assert.equal(await newText.count(), 1, await answer.innerHTML());
                    assert.equal(await newText.evaluate((text) => getComputedStyle(text).animationName), 'followup-text-reveal');
                    assert.equal(await thoughtToggle.getAttribute('aria-expanded'), 'true');
                    assert.ok(await thoughtText.evaluate((text) => getComputedStyle(text.parentElement).transitionProperty.includes('height')));
                    await page.emulateMedia({ reducedMotion: 'reduce' });
                    assert.deepEqual(await animations(), Array(3).fill('none'));
                    assert.equal(await newText.evaluate((text) => getComputedStyle(text).animationName), 'none');
                    assert.equal(await thoughtText.evaluate((text) => getComputedStyle(text.parentElement).transitionProperty), 'none');
                    await page.emulateMedia({ reducedMotion: 'no-preference' });
                    const previousTop = await scroll.evaluate((element) => {
                        element.scrollTop = element.scrollHeight;
                        return element.scrollTop;
                    });
                    loadingResponse.write(claudeText('\n\n' + '逐步验证等式的两边。\n\n'.repeat(36)));
                    await answer.getByText('逐步验证等式的两边。', { exact: true }).first().waitFor();
                    await jump.waitFor();
                    assert.equal(await scroll.evaluate((element) => element.scrollTop), previousTop);
                    const arrow = await jump.boundingBox();
                    const input = await drawer.getByRole('textbox', { name: '输入追问' }).boundingBox();
                    assert.ok(Math.abs(arrow.x + arrow.width / 2 - input.x - input.width / 2) < 2);
                    assert.ok(arrow.y + arrow.height < input.y);
                    await jump.click();
                    await jump.waitFor({ state: 'hidden' });
                    assert.ok(await scroll.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop <= 6));
                }
                assert.equal(await word.count() + await wave.count(), 0);
                assert.ok(await stop.isEnabled() && await fits());
                if (outcome === 'cancelled') {
                    await stop.click();
                    await turn.getByText('已停止生成', { exact: true }).waitFor();
                } else {
                    loadingResponse.end(claudeFinish);
                }
            }
            await send.waitFor();
            assert.equal(await turn.locator('.followup-thinking, .followup-writing').count(), 0);
        }
    } finally { await context.close(); }
}

async function checkViewport(owner, first, second, width) {
    const mobile = width < 640;
    const context = await browser.newContext({ viewport: { width, height: 850 }, isMobile: mobile, hasTouch: mobile });
    try {
        await context.addCookies([{
            name: 'mistakes_session', value: owner.cookie.split('=')[1], domain: '127.0.0.1', path: '/api/mistakes'
        }]);
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        const appUrl = base + '/mistakes/#';
        const entry = page.getByRole('button', { name: /追问 AI/ });
        await page.goto(appUrl + '/mistakes/' + first.id);
        await entry.click();
        const drawer = page.getByRole('dialog', { name: '追问 AI' });
        const newChat = drawer.getByRole('button', { name: '新对话', exact: true });
        const confirm = page.getByRole('alertdialog', { name: '新对话', exact: true });
        const chips = drawer.getByRole('group', { name: '快捷提问' }).getByRole('button');
        const input = drawer.getByRole('textbox', { name: '输入追问' });
        const send = drawer.getByRole('button', { name: '发送', exact: true });
        const stop = drawer.getByRole('button', { name: '停止生成', exact: true });
        const modelPicker = drawer.getByRole('button', { name: /追问模型/ });
        const notices = page.locator('.followup-toast');
        await newChat.waitFor();
        await drawer.locator('.katex').first().waitFor();
        await page.waitForFunction(() => document.querySelector('.followup-side, .followup-mobile')?.getAnimations().length === 0);
        assert.equal(await drawer.locator('.followup-answer').filter({ hasText: exportText }).count(), 1);
        assert.equal(await drawer.getByRole('button', { name: '追加到解析', exact: true }).count(), 0);
        const marker = drawer.locator('.followup-reply-marker');
        assert.equal(await marker.count(), 1);
        assert.ok(await marker.evaluate((line) => {
            const latest = line.parentElement.querySelector('.followup-turn:last-child .followup-answer').getBoundingClientRect();
            const bounds = line.getBoundingClientRect();
            const transitions = getComputedStyle(line).transitionProperty;
            return Math.abs(bounds.top - latest.top) <= 1 && Math.abs(bounds.height - latest.height) <= 1
                && transitions.includes('transform') && transitions.includes('height');
        }));
        const bounds = await drawer.boundingBox();
        assert.ok(mobile ? bounds.y > 250 && bounds.y < 460 : bounds.x > width / 2 && bounds.x + bounds.width <= width + 1);
        assert.ok(await input.isVisible());
        await checkComposeAction(send);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        assert.ok(await drawer.evaluate((element) => [...element.querySelectorAll('.followup-heading, .mobile-filters-heading, .followup-compose')]
            .every((part) => part.scrollWidth <= part.clientWidth + 1)));
        const credits = await owner.data('GET', followups(first.id));
        assert.equal(await drawer.locator('.followup-quota-value').textContent(), '∞');
        assert.equal(await drawer.locator('.followup-quota .lucide-coins').count(), 1);
        assert.ok(await newChat.evaluate((button) => {
            const balance = button.parentElement.querySelector('.followup-quota');
            const action = getComputedStyle(button);
            return balance.tagName === 'SPAN' && getComputedStyle(balance).borderTopWidth === '0px'
                && action.borderTopStyle === 'solid' && action.borderTopColor !== 'rgba(0, 0, 0, 0)';
        }));
        const replies = drawer.locator('.followup-reply-meta');
        const deepReply = replies.filter({ hasText: "Claude's text" });
        const latestThought = drawer.locator('.followup-turn').last();
        const thoughtToggle = latestThought.getByRole('button', { name: '思考过程', exact: true });
        assert.equal(await thoughtToggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await drawer.getByRole('button', { name: '思考过程', exact: true }).count(), 1);
        await thoughtToggle.click();
        await latestThought.locator('.followup-thought-text').waitFor();
        await thoughtToggle.click();
        await latestThought.locator('.followup-thought-text').waitFor({ state: 'hidden' });
        assert.ok(await deepReply.getByText('2,000 token').isVisible());
        assert.ok(await deepReply.locator('.followup-reply-tokens > .lucide-cpu:first-child').isVisible());
        assert.equal(await deepReply.getByText('-3', { exact: true }).count(), 1);
        assert.equal(await deepReply.locator('.followup-reply-charge > .lucide-coins:first-child').count(), 1);
        assert.equal(await deepReply.locator('.followup-reply-charge').getAttribute('title'), '扣除 3 积分');
        assert.match(await deepReply.locator('time').getAttribute('datetime'), /^PT\d+(\.\d+)?S$/);
        assert.match(await deepReply.locator('time').textContent(), /\d+\.\d s$/);
        assert.equal(await replies.filter({ hasText: /claude-sonnet|gpt-5-mini/ }).count(), 0);
        assert.equal(await replies.filter({ hasText: '极速' }).getByText('-1', { exact: true }).count(), credits.dailyCreditsUsed === 4.6 ? 1 : 2);
        const oldReply = drawer.locator('.followup-turn').filter({ hasText: '验证搜索隔离' });
        assert.equal(await oldReply.locator('.followup-reply-profile').textContent(), '极速');
        assert.equal(await oldReply.locator('time').count(), 0);
        await assertVisibleLogo(modelPicker, 'openai', 18);
        const controlShape = (button) => [button.offsetHeight, getComputedStyle(button).borderRadius];
        assert.deepEqual(await modelPicker.evaluate(controlShape), await newChat.evaluate(controlShape));
        await modelPicker.click();
        const menu = drawer.getByRole('listbox', { name: '追问模型' });
        await menu.waitFor();
        const premium = menu.getByRole('option', { name: /旗舰.*12×/ });
        assert.ok(await premium.isEnabled());
        assert.equal(await menu.getByLabel('支持图片输入').count(), 0);
        assert.doesNotMatch(await menu.textContent(), /claude-sonnet|gpt-5-mini|gemini-3-flash-preview|mimo-v2/);
        const menuBounds = await menu.boundingBox();
        assert.ok(menuBounds.x >= 0 && menuBounds.x + menuBounds.width <= width + 1);
        assert.ok(await menu.evaluate((element) => element.scrollWidth <= element.clientWidth + 1));
        const deep = menu.getByRole('option', { name: /^深度\s*3×$/ });
        await assertVisibleLogo(deep, 'anthropic', 18);
        await deep.click();
        await assertVisibleLogo(modelPicker, 'anthropic', 18);
        assert.match(await modelPicker.textContent(), /深度3×/);
        await page.reload();
        await entry.click();
        await assertVisibleLogo(modelPicker, 'anthropic', 18);
        if (mobile) {
            await modelPicker.click();
            await menu.getByRole('option', { name: /^极速\s*1×$/ }).click();
        }
        await newChat.click();
        await confirm.waitFor();
        const compact = await confirm.boundingBox();
        assert.ok(compact.width <= 300 && compact.height < 185 && compact.x >= 16);
        assert.ok(await confirm.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return element.contains(document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2));
        }));
        assert.ok(await page.evaluate(() => document.elementFromPoint(8, 8)?.matches('.followup-confirm-backdrop')));
        await confirm.getByRole('button', { name: '取消', exact: true }).click();
        await confirm.waitFor({ state: 'hidden' });
        assert.ok(await drawer.getByText(exportText, { exact: false }).count());
        if (mobile) {
            const cdp = await context.newCDPSession(page);
            async function drag(target, distance) {
                const box = await target.boundingBox();
                const x = Math.round(box.x + box.width / 2);
                const y = Math.round(box.y + box.height / 2);
                const travel = Math.min(distance, page.viewportSize().height - y - 4);
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
                for (const progress of [.12, .3, .5, .75, 1]) {
                    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + Math.round(travel * progress) }] });
                }
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            }
            const waitForExpanded = () => page.waitForFunction(() => {
                const popup = document.querySelector('.followup-mobile');
                return popup && Math.abs(popup.getBoundingClientRect().top) < 2 && popup.getAnimations().length === 0;
            });
            const waitForPeek = () => page.waitForFunction(() => {
                const popup = document.querySelector('.followup-mobile');
                const top = popup?.getBoundingClientRect().top;
                return top > 360 && top < 430 && popup.getAnimations().length === 0;
            });
            const pageY = await page.evaluate(() => scrollY);
            const handle = drawer.locator('.mobile-filters-drag-area');
            await drag(drawer.getByRole('heading', { name: '追问 AI' }), -200);
            await waitForExpanded();
            await drag(input, -120);
            assert.equal(await page.evaluate(() => scrollY), pageY);
            await input.fill('切换错题');
            // Model a keyboard that shrinks only the visual viewport, as on iOS.
            await page.evaluate(() => {
                Object.defineProperty(visualViewport, 'height', { configurable: true, value: innerHeight - 320 });
                visualViewport.dispatchEvent(new Event('resize'));
            });
            await page.waitForFunction(() => Math.abs(document.querySelector('.followup-mobile .mobile-filters-footer')
                .getBoundingClientRect().bottom - visualViewport.height) < 2);
            assert.ok(await drawer.evaluate((popup) => {
                const backing = getComputedStyle(popup.parentElement, '::after');
                return backing.backgroundColor === getComputedStyle(popup).backgroundColor
                    && parseFloat(backing.height) >= innerHeight - visualViewport.height;
            }), 'The area behind the keyboard toolbar is covered by the drawer surface');
            await drag(handle, 200);
            await drawer.waitFor({ state: 'hidden' });
            await page.evaluate(() => {
                delete visualViewport.height;
                visualViewport.dispatchEvent(new Event('resize'));
            });
            assert.equal(await page.evaluate(() => scrollY), pageY);
            for (const [action, title] of [['查看上传图片', '之前上传的图片'], ['导出这道题', '导出错题']]) {
                await page.getByRole('button', { name: action, exact: true }).click();
                const sheet = page.getByRole('dialog', { name: title, exact: true });
                await sheet.evaluate((popup) => Promise.all(popup.getAnimations().map((animation) => animation.finished)));
                await drag(sheet.getByRole('heading', { name: title, exact: true }), 400);
                await sheet.waitFor({ state: 'hidden' });
            }
            await cdp.detach();
            await entry.click();
            await waitForPeek();
            assert.equal(await input.inputValue(), '切换错题');
            await send.click();
            await drawer.locator('.followup-turn').last().getByRole('button', { name: '思考过程', exact: true }).waitFor();
            await drawer.locator('.followup-writing').waitFor();
            await waitForExpanded();
            await checkComposeAction(stop);
            assert.equal(await drawer.locator('.followup-wave').count(), 0);
            await page.evaluate((id) => { location.hash = '/mistakes/' + id; }, second.id);
            await page.getByText(second.question, { exact: true }).waitFor();
            await page.evaluate(() => { Math.random = () => 0; });
            await entry.click();
            await chips.first().waitFor();
            const firstDraw = (await chips.allTextContents()).map((text) => text.trim());
            assert.equal(new Set(firstDraw).size, 4);
            assert.ok(firstDraw.includes('拆解长难句结构'));
            await drawer.getByRole('button', { name: '关闭追问' }).click();
            await drawer.waitFor({ state: 'hidden' });
            await page.evaluate(() => { Math.random = () => .999; });
            await entry.click();
            await chips.first().waitFor();
            const secondDraw = (await chips.allTextContents()).map((text) => text.trim());
            assert.equal(new Set(secondDraw).size, 4);
            assert.notDeepEqual(firstDraw, secondDraw);
            assert.equal(await drawer.getByText('切换错题', { exact: true }).count(), 0);
        } else {
            const updateNotice = '题面已更新，后续追问将使用最新内容。';
            await owner.data('PATCH', '/mistakes/' + first.id, { question: first.question + '\n\n请检验答案。' });
            await page.evaluate(() => window.dispatchEvent(new Event('focus')));
            await notices.getByText(updateNotice, { exact: true }).waitFor();
            assert.equal(await drawer.getByText(updateNotice, { exact: true }).count(), 0);
        }
        await drawer.getByRole('button', { name: '关闭追问' }).click();
        await drawer.waitFor({ state: 'hidden' });

        await page.goto(appUrl + '/review?mistakeId=' + first.id);
        if (mobile) {
            await page.getByRole('button', { name: '开始复习' }).click();
            assert.equal(await entry.count(), 0);
            assert.equal(await page.locator('.followup-turn').count(), 0);
            await page.getByRole('button', { name: '思考完成，查看答案与分析' }).click();
        } else {
            await entry.waitFor();
            assert.equal(await page.getByRole('button', { name: '答案、分析与笔记' }).getAttribute('aria-expanded'), 'true');
        }
        await page.waitForFunction(() => document.querySelector('.answer-reveal.open')?.getAnimations().length === 0);
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        await entry.scrollIntoViewIfNeeded();
        const y = await page.evaluate(() => scrollY);
        await entry.click();
        await drawer.getByText(exportText, { exact: false }).waitFor();
        const openedY = await page.evaluate(() => scrollY);
        assert.equal(await drawer.getByRole('button', { name: '追加到解析', exact: true }).count(), 0);
        await drawer.getByRole('button', { name: '关闭追问' }).click();
        await drawer.waitFor({ state: 'hidden' });
        assert.equal(await page.getByRole('button', { name: '答案、分析与笔记' }).getAttribute('aria-expanded'), 'true');
        const closedY = await page.evaluate(() => scrollY);
        assert.ok(Math.abs(closedY - y) < 3, `Review preserves its scroll position (${y} → ${openedY} → ${closedY})`);
        if (mobile) {
            await page.getByRole('button', { name: '稍后继续' }).click();
            await page.waitForURL('**/#/mistakes');
        } else {
            await page.getByRole('button', { name: '结束本次' }).click();
            await page.getByRole('heading', { name: '本次复习已结束' }).waitFor();
        }

        if (!mobile) {
            // Verify the opt-in reaches the same paginated PDF viewed in the browser.
            await page.goto(appUrl + '/mistakes/' + first.id);
            await page.getByRole('button', { name: '导出这道题' }).click();
            const checkbox = page.getByRole('checkbox', { name: '包含追问笔记' });
            assert.equal(await checkbox.isChecked(), false);
            await checkbox.check();
            const printed = page.waitForResponse((response) => response.url().endsWith('/exports/pdf') && response.ok());
            await page.getByRole('button', { name: '预览 PDF' }).click();
            const response = await printed;
            assert.equal(response.request().postDataJSON().options.includeFollowups, true);
            const preview = page.getByRole('dialog', { name: '导出预览' });
            await preview.locator('canvas').first().waitFor();
            const pdfUrl = await preview.getByRole('link', { name: '打开 / 打印' }).getAttribute('href');
            const bytes = await page.evaluate(async (url) => Array.from(new Uint8Array(await (await fetch(url)).arrayBuffer())), pdfUrl);
            assert.match(await pdfText(Uint8Array.from(bytes)), new RegExp(exportText));

        }

        await page.goto(appUrl + '/settings');
        await page.getByRole('tab', { name: 'AI 设置' }).click();
        const settings = page.locator('.followup-settings');
        const row = settings.getByRole('button', { name: '编辑 深度' });
        await assertVisibleLogo(row, 'anthropic', 20);
        assert.match(await row.textContent(), /3×/);
        await row.click();
        const logoSelector = settings.getByRole('button', { name: /厂商 Logo/ });
        await assertVisibleLogo(logoSelector, 'anthropic', 18);
        await logoSelector.click();
        const vendorMenu = page.getByRole('listbox', { name: '厂商 Logo' });
        await assertVisibleLogo(vendorMenu.getByRole('option', { name: '自动识别' }), 'anthropic', 18);
        await assertVisibleLogo(vendorMenu.getByRole('option', { name: 'OpenAI' }), 'openai', 18);
        const allLogos = await vendorMenu.locator('.vendor-logo').evaluateAll((logos) => logos.map((logo) => getComputedStyle(logo).maskImage));
        assert.equal(new Set(allLogos).size, 13);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        await vendorMenu.getByRole('option', { name: 'OpenAI' }).click();
        await assertVisibleLogo(row, 'openai', 20);
        if (!mobile) {
            await settings.getByRole('spinbutton', { name: '普通账号每日追问积分上限' }).fill('34');
            await settings.getByRole('spinbutton', { name: '积分倍率' }).fill('4');
            await settings.getByRole('textbox', { name: '配置名称' }).fill('更新后的配置名称');
            await settings.getByRole('spinbutton', { name: '排序权重' }).fill('9');
            await settings.getByRole('button', { name: /思考强度/ }).click();
            await page.getByRole('option', { name: '超高 (xhigh)' }).click();
            await settings.getByRole('checkbox', { name: '开放 深度' }).uncheck();
            await settings.getByRole('button', { name: /默认选中模型/ }).click();
            await page.getByRole('option', { name: '均衡' }).click();
        }

        await settings.getByRole('button', { name: '添加追问模型' }).click();
        const added = settings.locator('.followup-settings-profile').last();
        const sourcePicker = added.getByRole('button', { name: /沿用已有接口/ });
        const apiUrl = added.getByLabel('API 基础地址');
        const apiKey = added.getByLabel('API 密钥');
        assert.match(await sourcePicker.textContent(), /Claude's text/);
        await sourcePicker.click();
        await page.getByRole('option', { name: '独立填写' }).click();
        assert.ok(await apiUrl.isEditable() && await apiKey.isEditable());
        await added.getByRole('button', { name: /接口协议/ }).click();
        await page.getByRole('option', { name: 'Claude Messages' }).click();
        assert.equal(await apiUrl.getAttribute('placeholder'), 'https://api.anthropic.com');
        await sourcePicker.click();
        await page.getByRole('option', { name: /Google.*gemini-3-flash-preview/ }).click();
        assert.match(await apiUrl.inputValue(), /\/v1beta$/);
        assert.equal(await apiKey.inputValue(), '');
        assert.equal(await apiKey.getAttribute('placeholder'), '沿用已有密钥');
        assert.equal(await added.getByRole('button', { name: /接口协议.*Gemini 原生/ }).isDisabled(), true);
        const effortPicker = added.getByRole('button', { name: /思考强度/ });
        await effortPicker.click();
        await page.getByRole('option', { name: '低 (low)' }).click();
        assert.match(await effortPicker.textContent(), /低 \(low\)/);

        if (!mobile) {
            await added.getByLabel('配置名称').fill('复用接口测试');
            await added.getByLabel('模型名称').fill('gemini-shared');
            await added.getByRole('spinbutton', { name: '积分倍率' }).fill('0.125');
            await added.getByRole('checkbox', { name: '开放 复用接口测试' }).check();
            const saveRequest = page.waitForRequest((request) => request.method() === 'PATCH' && request.url().endsWith(configRoute));
            await settings.getByRole('button', { name: '保存错题追问配置' }).click();
            await page.getByText('错题追问配置已保存。', { exact: true }).waitFor();
            const draft = (await saveRequest).postDataJSON().profiles.find(({ name }) => name === '复用接口测试');
            assert.equal(draft.endpointSourceId, 'native');
            assert.equal(draft.apiKey, undefined);
            const saved = await owner.data('GET', configRoute);
            assert.equal(saved.dailyCreditLimit, 34);
            assert.equal(saved.defaultProfileId, 'native');
            const edited = saved.profiles.find(({ id }) => id === 'deep');
            assert.deepEqual([edited.creditCost, edited.sortOrder, edited.thinkingEffort, edited.vendorIcon, edited.enabledForFollowup], [4, 9, 'xhigh', 'openai', false]);
            const copy = saved.profiles.find(({ id }) => id === draft.id);
            assert.equal(copy.baseUrl, saved.profiles.find(({ id }) => id === 'native').baseUrl);
            assert.deepEqual([copy.protocol, copy.hasApiKey, copy.thinkingEffort, copy.enabledForFollowup], ['gemini', true, 'low', true]);
            assert.equal(copy.creditCost, 0.125);
            assert.equal(copy.apiKey, undefined);
            assert.equal(copy.endpointSourceId, undefined);
            const { readFollowupConfig } = require('../server/mistakes/ai-config');
            assert.equal(readFollowupConfig().profiles.find(({ id }) => id === copy.id).apiKey, geminiKey);
            await page.goto(appUrl + '/mistakes/' + first.id);
            await entry.click();
            await assertVisibleLogo(modelPicker, 'google', 18);
            await modelPicker.click();
            await menu.getByRole('option', { name: /复用接口测试.*0\.125×/ }).waitFor();
            await menu.press('Escape');
            await drawer.locator('.followup-reply-meta').filter({ hasText: "Claude's text" }).getByText('-3', { exact: true }).waitFor();
            await newChat.click();
            await confirm.getByRole('button', { name: '开始新对话', exact: true }).click();
            await notices.getByText('已开始新对话。', { exact: true }).waitFor();
            await chips.first().waitFor();
            assert.equal(await drawer.locator('.followup-turn').count(), 0);
            await page.route('**/followups/stream', (route) => route.fulfill({
                status: 200, contentType: 'text/event-stream',
                body: 'event: done\ndata: ' + JSON.stringify({
                    dailyCreditLimit: 34, dailyCreditsUsed: 12, dailyCreditsRemaining: 22,
                    message: { id: 9999, question: '用键盘提问', content: '测试回复', status: 'completed' }
                }) + '\n\n'
            }));
            await input.fill('用键盘提问');
            await input.press('Shift+Enter');
            assert.equal(await input.inputValue(), '用键盘提问\n');
            const keyboardSend = page.waitForRequest((request) => request.method() === 'POST' && request.url().endsWith('/followups/stream'));
            await input.press('Enter');
            assert.deepEqual((await keyboardSend).postDataJSON(), { question: '用键盘提问', profileId: 'native' });
        }
    } finally { await context.close(); }
}

async function assertVisibleLogo(parent, vendor, size) {
    const logo = parent.locator('.vendor-logo[data-vendor-icon="' + vendor + '"]');
    await logo.waitFor();
    const layout = await logo.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const line = element.parentElement.getBoundingClientRect();
        return { width: rect.width, height: rect.height, start: rect.left - line.left, end: line.right - rect.right,
            local: getComputedStyle(element).maskImage.includes('data:image/svg+xml') };
    });
    assert.ok(Math.abs(layout.width - size) < .5 && Math.abs(layout.height - size) < .5
        && layout.start >= -1 && layout.end >= -1 && layout.local, vendor + ' ' + JSON.stringify(layout));
}

async function checkComposeAction(action) {
    await action.waitFor();
    assert.equal(await action.textContent(), '');
    assert.equal(await action.locator('svg').count(), 1);
    assert.ok(await action.evaluate((button) => {
        const field = button.closest('.followup-compose-field')?.getBoundingClientRect();
        const bounds = button.getBoundingClientRect();
        return field && bounds.top > field.top && bounds.left > field.left
            && field.right - bounds.right > 0 && field.right - bounds.right < 12
            && field.bottom - bounds.bottom > 0 && field.bottom - bounds.bottom < 12;
    }));
}

async function main() {
    checkVendorIcons();
    Object.assign(process.env, {
        NODE_ENV: 'test',
        MISTAKES_DB_PATH: path.join(directory, 'db.sqlite'),
        MISTAKES_UPLOADS_PATH: path.join(directory, 'uploads'),
        MISTAKES_AI_CONFIG_PATH: path.join(directory, '.env.ai'),
        MISTAKES_ENV_PATH: path.join(directory, '.env'),
        PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(root, 'data', '.playwright')
    });
    const executablePath = process.env.CHROMIUM_PATH || process.env.MISTAKES_PDF_EXECUTABLE_PATH;
    if (executablePath) process.env.MISTAKES_PDF_EXECUTABLE_PATH = executablePath;
    provider.listen(0, '127.0.0.1');
    await once(provider, 'listening');
    const upstream = 'http://127.0.0.1:' + provider.address().port;
    app = require('../server/app');
    const { db } = app;
    const { hashPassword } = require('../server/mistakes/auth');
    const now = new Date().toISOString();
    const addUser = db.prepare('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)');
    const ownerId = addUser.run('followup_admin', hashPassword(password), 'admin', now).lastInsertRowid;
    const otherId = addUser.run('followup_other', hashPassword(password), 'user', now).lastInsertRowid;
    addUser.run('followup_rate', hashPassword(password), 'user', now);
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    base = 'http://127.0.0.1:' + server.address().port;
    const [owner, other, limited] = [client(), client(), client()];
    await owner.login('followup_admin');
    await other.login('followup_other');
    await limited.login('followup_rate');
    const endpoint = { baseUrl: upstream + '/v1', apiKey: 'local-smoke-key' };
    assert.deepEqual(await owner.data('GET', configRoute), { dailyCreditLimit: 100, defaultProfileId: null, profiles: [] });
    fs.writeFileSync(process.env.MISTAKES_AI_CONFIG_PATH, "MISTAKES_AI_FOLLOWUP_DAILY_CREDIT_LIMIT='60'\n");
    assert.equal((await owner.data('GET', configRoute)).dailyCreditLimit, 100);
    const models = [
        { ...endpoint, id: 'fast', name: '极速', model: 'gpt-5-mini', enabledForFollowup: true },
        { ...endpoint, id: 'deep', name: "Claude's text", tierLabel: '深度', model: 'claude-sonnet', vision: false,
            enabledForFollowup: true, creditCost: 3, thinkingEffort: 'high' },
        { ...endpoint, id: 'native', name: 'Google', tierLabel: '均衡', model: 'gemini-3-flash-preview',
            protocol: 'gemini', baseUrl: upstream + '/v1beta', apiKey: geminiKey,
            enabledForFollowup: true, creditCost: 6, sortOrder: 0, thinkingEffort: 'low' },
        { ...endpoint, id: 'premium', name: '旗舰', model: 'mimo-v2', enabledForFollowup: true, creditCost: 12 },
        { id: 'disabled', name: '停用档', model: 'mistral', enabledForFollowup: false, creditCost: 2 },
    ];
    const settings = await owner.data('PATCH', configRoute, { dailyCreditLimit: 16, defaultProfileId: 'fast', profiles: models });
    assert.equal(settings.defaultProfileId, 'fast');
    assert.equal(settings.profiles.find(({ id }) => id === 'deep').name, "Claude's text");
    assert.ok(settings.profiles.find(({ id }) => id === 'native').hasApiKey);
    assert.ok(!JSON.stringify(settings).includes(endpoint.apiKey));
    await other.data('PATCH', configRoute, { dailyCreditLimit: 5 }, 403);
    const create = (actor, fields) => actor.data('POST', '/mistakes', { lifecycle: 'archived', subjectId: 'math',
        question: '求方程的根', answer: '$x=4$', analysis: '先整理方程。', ...fields }, 201);
    const longQuestion = Array.from({ length: 16 }, (_, i) => '检查第 ' + (i + 1) + ' 项已知条件。').join('\n\n');
    const first = await create(owner, { question: longQuestion, analysis: '先整理方程。\n\n### 追问补充\n\n之前已保存的解析内容。' });
    const second = await create(owner, { subjectId: 'english', question: '分析句子结构' });
    const gemini = await create(other, { question: '结合本题配图' });
    const speed = await create(limited, {});

    await client().data('GET', followups(first.id), undefined, 401);
    await other.data('GET', followups(first.id), undefined, 404);
    await other.data('POST', followups(first.id) + '/stream', { question: '越权提问' }, 404);
    const initial = await owner.data('GET', followups(first.id));
    assert.deepEqual(initial.availableProfiles, [
        { id: 'native', name: 'Google', tierLabel: '均衡', model: 'gemini-3-flash-preview',
            vendorIcon: 'google', creditCost: 6, supportsVision: true, isDefault: false },
        { id: 'fast', name: '极速', tierLabel: '极速', model: 'gpt-5-mini', vendorIcon: 'openai', creditCost: 1, supportsVision: true, isDefault: true },
        { id: 'deep', name: "Claude's text", tierLabel: '深度', model: 'claude-sonnet', vendorIcon: 'anthropic', creditCost: 3, supportsVision: false, isDefault: false },
        { id: 'premium', name: '旗舰', tierLabel: '旗舰', model: 'mimo-v2', vendorIcon: 'xiaomi', creditCost: 12, supportsVision: true, isDefault: false },
    ]);
    assert.ok(!JSON.stringify(initial).includes(endpoint.apiKey) && !JSON.stringify(initial).includes(upstream));
    const result = await events(await owner.request('POST', followups(first.id) + '/stream', {
        question: '验证搜索隔离', context: '不可信题面', profileId: 'disabled'
    }));
    assert.deepEqual(result.map((event) => event.type), ['meta', 'delta', 'delta', 'done']);
    const completed = result.at(-1).message;
    assert.equal(completed.status, 'completed');
    assert.equal(calls.at(-1).body.model, 'gpt-5-mini');
    for (const frame of [result[0], result.at(-1)]) {
        assert.deepEqual([frame.profileId, frame.vendorIcon, frame.creditCost, frame.dailyCreditsRemaining, frame.dailyCreditLimit], ['fast', 'openai', 1, null, null]);
    }
    assert.equal(completed.creditsCharged, 1);
    assert.equal(result[0].message.profileName, '极速');
    assert.equal(result[0].message.durationMs, null);
    assert.equal(completed.profileName, '极速');
    assert.ok(Number.isInteger(completed.durationMs) && completed.durationMs >= 0);
    db.prepare('UPDATE mistake_followups SET profile_name = NULL, duration_ms = NULL WHERE id = ?').run(completed.id);
    assert.ok(calls.at(-1).body.messages[1].content.includes(longQuestion.split('\n')[0]));
    assert.ok(!JSON.stringify(calls.at(-1)).includes('不可信题面'));
    assert.match(completed.content, new RegExp(replyOnlyText));
    await owner.data('POST', followups(first.id) + '/' + completed.id + '/append-analysis', { updatedAt: first.updatedAt }, 404);
    assert.equal((await owner.data('GET', '/mistakes/' + first.id)).analysis, first.analysis);
    assert.equal((await owner.data('GET', '/mistakes?keyword=' + encodeURIComponent(replyOnlyText))).length, 0);
    await other.data('POST', followups(first.id) + '/' + completed.id + '/cancel', {}, 404);

    const slow = await owner.request('POST', followups(first.id) + '/stream', { question: '停止测试' });
    const stopped = await events(slow, async (frame) => {
        if (frame.type !== 'delta') return;
        const active = await owner.data('GET', followups(first.id));
        assert.equal(active.activeMessageId, frame.id);
        await owner.data('POST', followups(second.id) + '/stream', { question: '重复生成' }, 409);
        const result = await owner.data('POST', followups(first.id) + '/' + frame.id + '/cancel', {});
        assert.equal(result.status, 'cancelled');
        assert.equal(result.content, '答'.repeat(99));
    });
    assert.equal(stopped.at(-1).message.status, 'cancelled');
    assert.equal(stopped.at(-1).message.creditsCharged, 0);
    assert.equal(stopped.at(-1).message.totalTokens, null);
    assert.ok(Number.isInteger(stopped.at(-1).message.durationMs));
    assert.equal(stopped.at(-1).dailyCreditsRemaining, null);
    await owner.data('PATCH', configRoute, { dailyCreditLimit: 1 });
    for (let i = 0; i < 20 && !cancelled; i++) await delay(50);
    assert.equal(cancelled, true);
    const failed = (await ask(owner, first.id, '暂时故障', 'deep')).at(-1);
    const failure = failed.message;
    assert.equal(failure.status, 'failed');
    assert.equal(failure.creditsCharged, 0);
    assert.ok(Number.isInteger(failure.durationMs));
    assert.equal(failed.dailyCreditsRemaining, null);
    assert.equal(calls.at(-1).body.reasoning_effort, 'high');
    const retried = await events(await owner.request('POST', followups(first.id) + '/stream', { retryMessageId: failure.id, profileId: 'deep' }));
    assert.equal(retried.at(-1).message.id, failure.id);
    assert.equal(retried[0].message.durationMs, null);
    assert.deepEqual([retried.at(-1).message.model, retried.at(-1).message.creditsCharged, retried.at(-1).dailyCreditsRemaining], ['claude-sonnet', 3, null]);
    await owner.data('PATCH', configRoute, { dailyCreditLimit: 16 });
    assert.match(calls.at(-1).body.messages[3].content, new RegExp(replyOnlyText));
    assert.match(retried.at(-1).message.content, new RegExp(exportText));

    const disconnect = new AbortController();
    const stream = await owner.request('POST', followups(first.id) + '/stream', { question: '断连继续' }, disconnect.signal);
    const reader = stream.body.getReader();
    await reader.read();
    disconnect.abort();
    reader.releaseLock();
    for (let i = 0; i < 30; i++) {
        if (!(await owner.data('GET', followups(first.id))).activeMessageId) break;
        await delay(100);
    }
    const history = await owner.data('GET', followups(first.id));
    assert.equal(history.messages.at(-1).status, 'completed');
    assert.ok(history.messages.at(-1).durationMs >= 700);
    assert.equal(history.messages[0].profileName, '极速');
    assert.equal(history.messages[0].durationMs, null);
    assert.equal(history.messages.length, 4);
    assert.equal(history.dailyCreditsUsed, 4.6);
    assert.equal(history.dailyCreditsRemaining, null);
    assert.equal(history.messages.at(-1).cachedReadTokens, 1000);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM ai_jobs').get().count, 0);

    const file = 'owned-followup.jpg';
    fs.mkdirSync(process.env.MISTAKES_UPLOADS_PATH, { recursive: true });
    fs.copyFileSync(path.join(root, 'server', 'mistakes', 'fixtures', 'vision-test.jpg'), path.join(process.env.MISTAKES_UPLOADS_PATH, file));
    const imageId = db.prepare('INSERT INTO mistake_images (mistake_id,user_id,purpose,client_id,original_name,original_path,crop_path,created_at) VALUES (?,?,?,?,?,?,?,?)')
        .run(gemini.id, otherId, 'answer', 'fixture', file, file, file, now).lastInsertRowid;
    const image = '![](/api/mistakes/images/' + imageId + '/crop)';
    const another = await create(other, { answer: image });
    await other.data('POST', followups(another.id) + '/stream', { question: '越权引用图片' }, 400);
    await other.data('PATCH', '/mistakes/' + gemini.id, { answer: '$x=4$\n\n' + image });
    const native = await ask(other, gemini.id, '原生流式', 'native');
    assert.equal(native.at(-1).message.content, 'Gemini 流式答复 $x=4$');
    assert.deepEqual(calls.at(-1).body.generationConfig.thinkingConfig, { thinkingLevel: 'LOW', includeThoughts: true });
    assert.equal(native.find((frame) => frame.type === 'thought').text, native.at(-1).message.thought);
    assert.ok(calls.at(-1).body.contents[0].parts.some((part) => part.inlineData));
    const fallback = await ask(other, gemini.id, '文字降级', 'native');
    assert.equal(fallback.at(-1).message.content, '非流式完整回答 $x=4$');
    assert.equal(fallback.at(-1).message.imagesSkipped, true);
    assert.match(calls.at(-1).path, /:generateContent$/);
    assert.equal(calls.at(-1).body.contents[0].parts.length, 1);
    assert.equal(calls.at(-1).body.contents.length, 4);
    assert.equal(native.at(-1).message.totalTokens, 2000);
    assert.equal(native.at(-1).message.creditsCharged, 4.7);
    const longStop = await other.request('POST', followups(gemini.id) + '/stream', { question: '足量停止', profileId: 'deep' });
    const longStopped = await events(longStop, async (frame) => {
        if (frame.type === 'delta') await other.data('POST', followups(gemini.id) + '/' + frame.id + '/cancel', {});
    });
    assert.equal(longStopped[0].message.imagesSkipped, true);
    assert.equal(typeof calls.at(-1).body.messages[1].content, 'string');
    assert.equal(longStopped.at(-1).message.status, 'cancelled');
    assert.equal(longStopped.at(-1).message.creditsCharged, 3);
    assert.equal(longStopped.at(-1).dailyCreditsRemaining, 2.3);
    const pairCount = db.prepare('SELECT COUNT(*) AS count FROM mistake_followups WHERE mistake_id = ?');
    const before = pairCount.get(gemini.id).count;
    const rejected = await other.data('POST', followups(gemini.id) + '/stream', { question: '额度不足', profileId: 'deep' }, 429);
    assert.match(rejected.message, /剩余积分不足/);
    assert.equal(pairCount.get(gemini.id).count, before);

    await owner.data('PATCH', '/admin/users/' + otherId, { active: false });
    assert.equal((await other.data('GET', followups(gemini.id))).readOnly, true);
    for (const [method, suffix] of [['POST', '/stream'], ['DELETE', ''], ['POST', '/' + native.at(-1).message.id + '/cancel']]) {
        const error = await other.data(method, followups(gemini.id) + suffix, {}, 403);
        assert.equal(error.code, 'ACCOUNT_FROZEN');
    }
    await owner.data('PATCH', '/admin/users/' + otherId, { active: true });
    await other.data('DELETE', followups(gemini.id));
    const cleared = await other.data('GET', followups(gemini.id));
    assert.equal(cleared.messages.length, 0);
    assert.equal(cleared.dailyCreditsRemaining, 2.3);
    const speedUser = db.prepare('SELECT user_id FROM mistakes WHERE id = ?').get(speed.id).user_id;
    const seed = db.prepare('INSERT INTO mistake_followups (mistake_id, user_id, role, question_id, content, status, created_at) VALUES (?,?,?,?,?,?,?)');
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    for (let index = 1; index <= 9; index++) {
        const question = seed.run(speed.id, speedUser, 'user', null, '历史问题' + index, 'completed', yesterday).lastInsertRowid;
        seed.run(speed.id, speedUser, 'assistant', question, '历史回答' + index, 'completed', yesterday);
    }
    assert.equal((await limited.data('GET', followups(speed.id))).dailyCreditsUsed, 0);
    const fractional = [
        { id: 'fractional-high', creditCost: 0.8 },
        { id: 'fractional-low', creditCost: 0.2 },
        { id: 'free', creditCost: 0 }
    ].map((profile) => ({ ...endpoint, enabledForFollowup: true, model: 'gpt-5-mini', name: profile.id, ...profile }));
    await owner.data('PATCH', configRoute, { dailyCreditLimit: 1, profiles: [...settings.profiles, ...fractional] });
    const firstCharge = (await ask(limited, speed.id, '兼容接口非流式', 'fractional-high')).at(-1);
    assert.match(firstCharge.message.content, /兼容接口完整回复/);
    assert.deepEqual([firstCharge.message.creditsCharged, firstCharge.dailyCreditsRemaining], [0.8, 0.2]);
    const messages = calls.at(-1).body.messages;
    assert.equal(messages.length, 19);
    assert.equal(messages[2].content, '历史问题2');
    assert.equal(messages.at(-2).content, '历史回答9');
    const lastCharge = (await ask(limited, speed.id, '用完最后积分', 'fractional-low')).at(-1);
    assert.deepEqual([lastCharge.message.creditsCharged, lastCharge.dailyCreditsRemaining], [0.2, 0]);
    assert.equal(lastCharge.message.totalTokens, 4000);
    assert.equal(lastCharge.message.cachedReadTokens, 1500);
    assert.match((await limited.data('POST', followups(speed.id) + '/stream', { question: '积分用完', profileId: 'fractional-low' }, 429)).message, /积分不足/);
    for (let index = 0; index < 3; index++) {
        const free = (await ask(limited, speed.id, '频率测试', 'free')).at(-1);
        assert.deepEqual([free.message.status, free.message.creditsCharged, free.dailyCreditsUsed], ['completed', 0, 1]);
    }
    assert.equal((await limited.data('POST', followups(speed.id) + '/stream', { question: '频率测试' }, 429)).code, 'RATE_LIMITED');
    await limited.data('DELETE', '/mistakes/' + speed.id);
    await limited.data('DELETE', '/mistakes/' + speed.id + '/permanent');
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM mistake_followups WHERE mistake_id = ?').get(speed.id).count, 0);
    await owner.data('PATCH', configRoute, { dailyCreditLimit: 16, profiles: settings.profiles });

    const snapshot = path.join(directory, 'snapshot.sqlite');
    db.prepare("UPDATE mistake_followups SET status = 'streaming' WHERE id = ?").run(failure.id);
    await db.backup(snapshot);
    const previousSchema = new (require('better-sqlite3'))(snapshot);
    previousSchema.exec('DROP TRIGGER retain_today_followup_charge');
    previousSchema.prepare('DELETE FROM mistake_followups WHERE user_id = ?').run(speedUser);
    previousSchema.exec(`
        ALTER TABLE mistake_followups RENAME COLUMN credit_cost TO fractional_cost;
        ALTER TABLE mistake_followups ADD COLUMN credit_cost INTEGER NOT NULL DEFAULT 1 CHECK (credit_cost > 0);
        UPDATE mistake_followups SET credit_cost = fractional_cost;
        ALTER TABLE mistake_followups DROP COLUMN fractional_cost;
        ALTER TABLE mistake_followups DROP COLUMN profile_name;
        ALTER TABLE mistake_followups DROP COLUMN duration_ms;
        ALTER TABLE mistake_followups DROP COLUMN credits_charged;
        ALTER TABLE mistake_followups DROP COLUMN thought;
    `);
    previousSchema.close();
    execFileSync(process.execPath, ['-e', `
        const { db } = require('./server/mistakes/database');
        const assert = require('node:assert/strict');
        const row = db.prepare('SELECT * FROM mistake_followups WHERE id = ?').get(Number(process.argv[1]));
        assert.equal(row.status, 'failed');
        assert.match(row.error_message, /服务重启中断/);
        assert.equal(row.profile_name, null);
        assert.equal(row.duration_ms, null);
        assert.equal(row.credit_cost, 3);
        assert.equal(db.prepare('PRAGMA table_info(mistake_followups)').all().find(({ name }) => name === 'credit_cost').type, 'REAL');
        assert.equal(db.prepare('SELECT SUM(credits_charged) AS used FROM mistake_followups WHERE user_id = ?').get(row.user_id).used, 2);
    `, String(failure.id)], {
        cwd: root, env: { ...process.env, MISTAKES_DB_PATH: snapshot }, stdio: 'inherit', windowsHide: true
    });
    db.prepare("UPDATE mistake_followups SET status = 'completed' WHERE id = ?").run(failure.id);
    addUser.run('responses_user', hashPassword(password), 'user', now);
    const responsesUser = client();
    await responsesUser.login('responses_user');
    const responsesQuestion = await create(responsesUser, {});
    const responsesProfile = { ...models[0], id: 'responses-model', protocol: 'responses', creditCost: 2 };
    await owner.data('PATCH', configRoute, { profiles: [...settings.profiles, responsesProfile] });
    const incomplete = (await ask(responsesUser, responsesQuestion.id, '摘要流式回答', responsesProfile.id)).at(-1);
    assert.deepEqual([incomplete.message.status, incomplete.message.creditsCharged], ['failed', 2.1]);
    assert.equal(incomplete.message.thought, '先列方程');
    const responseEvents = await events(await responsesUser.request('POST', followups(responsesQuestion.id) + '/stream',
        { retryMessageId: incomplete.message.id, profileId: responsesProfile.id }));
    assert.equal(calls.at(-1).body.reasoning.summary, 'auto');
    assert.deepEqual(responseEvents.map((frame) => frame.type), ['meta', 'delta', 'thought', 'done']);
    const settled = responseEvents.at(-1);
    assert.deepEqual([settled.message.thought, settled.message.content, settled.message.totalTokens,
        settled.message.creditsCharged, settled.dailyCreditsUsed], ['先列方程', '得到两个根', 2500, 2.1, 4.2]);
    await responsesUser.data('DELETE', followups(responsesQuestion.id));
    assert.equal((await responsesUser.data('GET', followups(responsesQuestion.id))).dailyCreditsUsed, 4.2);
    const roundingProfile = { ...models[0], id: 'rounding', creditCost: 0.29 };
    await owner.data('PATCH', configRoute, { profiles: [...settings.profiles, roundingProfile] });
    const rounded = (await ask(responsesUser, responsesQuestion.id, '小数倍率舍入', roundingProfile.id)).at(-1);
    assert.deepEqual([rounded.message.creditsCharged, rounded.dailyCreditsUsed], [1.5, 5.7]);
    await owner.data('PATCH', configRoute, { profiles: settings.profiles });
    assert.equal(db.prepare('SELECT user_id FROM mistakes WHERE id = ?').get(first.id).user_id, ownerId);

    const defaults = { source: { ids: [first.id] }, options: { answerPlacement: 'appendix' } };
    const normal = await downloadPdf(owner, defaults);
    assert.ok(!normal.includes(exportText));
    const practice = await downloadPdf(owner, { ...defaults, options: { version: 'practice', includeFollowups: true } });
    assert.ok(!practice.includes(exportText));
    const { chromium } = require('playwright');
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    addUser.run('followup_loading', hashPassword(password), 'user', now);
    const loadingUser = client();
    await loadingUser.login('followup_loading');
    const loadingMistake = await create(loadingUser, {});
    const claude = { ...models[0], id: 'claude-native', name: 'Claude Messages', model: 'claude-sonnet-4-6',
        baseUrl: upstream, protocol: 'anthropic', thinkingEffort: 'high' };
    await owner.data('PATCH', configRoute, { profiles: [...settings.profiles, claude], defaultProfileId: claude.id });
    const nativeFrames = await ask(responsesUser, responsesQuestion.id, '原生思考摘要', claude.id);
    assert.deepEqual(nativeFrames.map((frame) => frame.type), ['meta', 'thought', 'thought', 'delta', 'delta', 'done']);
    const nativeMessage = nativeFrames.at(-1).message;
    assert.deepEqual([nativeMessage.thought, nativeMessage.content, nativeMessage.totalTokens, nativeMessage.cachedReadTokens,
        nativeMessage.creditsCharged], ['核对条件', '解题', 2000, 400, 0.8]);
    const claudeBody = calls.at(-1).body;
    assert.ok(claudeBody.system && claudeBody.stream && claudeBody.max_tokens > 0);
    assert.deepEqual(claudeBody.thinking, { type: 'adaptive', display: 'summarized' });
    assert.deepEqual(claudeBody.output_config, { effort: 'high' });
    const legacy = { ...claude, model: 'claude-haiku-4-5', baseUrl: upstream + '/v1' };
    await owner.data('PATCH', configRoute, { profiles: [...settings.profiles, legacy] });
    const full = (await ask(responsesUser, responsesQuestion.id, '非流式思考摘要', claude.id)).at(-1).message;
    assert.deepEqual([full.status, full.thought, full.content, full.totalTokens], ['completed', '列式', '解题', 2000]);
    assert.equal(calls.at(-1).body.thinking.type, 'enabled');
    assert.ok(calls.at(-1).body.thinking.budget_tokens < calls.at(-1).body.max_tokens);
    await owner.data('PATCH', configRoute, { profiles: [...settings.profiles, claude] });
    await checkStreamingStates(loadingUser, loadingMistake.id, 390);
    await checkStreamingStates(loadingUser, loadingMistake.id, 1440);
    await owner.data('PATCH', configRoute, { profiles: settings.profiles, defaultProfileId: settings.defaultProfileId });
    await checkViewport(owner, first, second, 390);
    await checkViewport(owner, first, second, 1440);
    console.log('Mistake follow-up smoke passed: two-stage streaming on mobile and desktop, multi-profile routing, credit settlement, cancellation threshold, detached completion, rate limit, recovery, selectors, settings and PDF.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
    await browser?.close();
    if (app) {
        await require('../server/mistakes/followups').pauseFollowups();
        await require('../server/mistakes/pdf-export').closePdfBrowser();
    }
    provider.closeAllConnections();
    provider.close();
    server?.closeAllConnections();
    if (server) await new Promise((resolve) => server.close(resolve));
    app?.db.close();
    fs.rmSync(directory, { recursive: true, force: true });
});

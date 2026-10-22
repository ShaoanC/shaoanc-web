const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { setTimeout: delay } = require('node:timers/promises');
const { figureLocation, sourceImageId, parseRecognitionJson, recognitionFormat } = require('../server/mistakes/ai-output');

// Cover observed invalid locations and compatibility cases with non-sequential IDs.
const imageIds = [9, 11];
assert.equal(sourceImageId({ imageIndex: '2' }, imageIds), 11);
assert.equal(sourceImageId({ imageId: '9' }, imageIds), 9);
assert.equal(sourceImageId({ imageId: 1 }, imageIds), 0, 'Do not guess that an ID means an index');
assert.equal(sourceImageId({ imageIndex: 0 }, imageIds), 0);
assert.equal(sourceImageId({}, imageIds), 0, 'Missing source requires human selection');
const named = { imageIndex: 2, bounds: { left: 0.25, top: 0.125, right: 0.75, bottom: 0.875 } };
assert.deepEqual(figureLocation(named, imageIds), { imageId: 11, box: [0.25, 0.125, 0.5, 0.75], error: null });
assert.deepEqual(figureLocation({ imageIndex: 2, box_2d: [125, 250, 875, 750] }, imageIds), { imageId: 11, box: [0.25, 0.125, 0.5, 0.75], error: null }, 'Gemini y/x corner coordinates on a 0–1000 scale become normalized x/y/width/height');
assert.deepEqual(figureLocation({ imageId: '9', bbox: [0.25, 0.125, 0.5, 0.75] }, imageIds).box, [0.25, 0.125, 0.5, 0.75]);
assert.equal(figureLocation({ imageId: 0, box: [0, 0, 1, 1] }, imageIds).error, 'source');
assert.equal(figureLocation({ imageId: 9, box: null }, imageIds).error, 'format');
assert.equal(figureLocation({ imageId: 9, box: [100, 200, 800, 900] }, imageIds).error, 'bounds');
assert.equal(figureLocation({ ...named, bounds: { ...named.bounds, left: 0.9 } }, imageIds).error, 'bounds');
assert.ok(figureLocation({ imageId: 9, box: [0.1, 0.2, 0.90000000001, 0.8] }, imageIds).box, 'Floating-point edge rounding is tolerated');
const padded = figureLocation({ imageIndex: 1, box_2d: [125, 125, 500, 500] }, imageIds, 0.01);
assert.deepEqual(padded.box, [0.115, 0.115, 0.395, 0.395], 'AI question figures receive a small margin on every side');
assert.deepEqual(figureLocation(padded, imageIds).box, padded.box, 'Reading stored coordinates never adds another margin');
assert.deepEqual(figureLocation({ imageIndex: 1, box_2d: [0, 0, 1000, 1000] }, imageIds, 0.01).box, [0, 0, 1, 1], 'Margins stop at image edges');
const formula = { question: '$\\frac{1}{2}$ 与 $\\sqrt{x}$\n第二行' };
assert.deepEqual(parseRecognitionJson('识别结果：\n```json\n' + JSON.stringify(formula) + '\n```'), formula);
assert.throws(() => parseRecognitionJson(String.raw`{"question":"$\sqrt{x}$"}`), SyntaxError);
assert.throws(() => parseRecognitionJson(String.raw`{"question":"$\frac{1}{2}$"}`), SyntaxError, 'Do not silently accept a form-feed in a formula');
assert.throws(() => parseRecognitionJson('{"question":"incomplete'), SyntaxError);
assert.equal(recognitionFormat('question').responseJsonSchema.properties.figures.items.properties.imageIndex.type[0], 'integer');
assert.equal(recognitionFormat('question').responseJsonSchema.properties.figures.items.properties.box_2d.minItems, 4);

async function runAiSmoke() {
    const directory = fs.mkdtempSync(path.join(__dirname, '..', 'data', 'ai-smoke-'));
    process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
    process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'images');
    process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
    process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
    process.env.NODE_ENV = 'test';
    let mock;
    let server;
    let app;
    let ai;
    let failures = 0;
    let failureStatus = 500;
    let rejectFormat = '';
    let visionReply = 'READ-5827';
    let responseMode = '';
    let includeUsage = true;
    let hold = 0;
    let calls = 0;
    let questionFixture = 'plain';
    let answerFixture = 'plain';
    const requests = {};
    const metrics = [];
    const originalInfo = console.info;
    console.info = (message) => {
        if (typeof message === 'string' && message.startsWith('{"event":"mistakes.ai.request"')) metrics.push(JSON.parse(message));
        else originalInfo(message);
    };
    const listen = (listener) => new Promise((resolve) => { const server = listener.listen(0, '127.0.0.1', () => resolve(server)); });
    const close = (listener) => listener && new Promise((resolve) => { listener.closeAllConnections(); listener.close(resolve); });
    try {
        mock = await listen(http.createServer(async (req, res) => {
            let body = '';
            for await (const part of req) body += part;
            calls += 1;
            assert.equal(req.method, 'POST');
            const request = JSON.parse(body);
            if (failures > 0) { failures -= 1; res.writeHead(failureStatus, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'temporary', type: 'server_error' } })); return; }
            if (hold) await delay(hold);
            if (req.url === '/v1/chat/completions') {
                assert.equal(req.headers.authorization, 'Bearer analysis-secret');
                assert.equal(req.headers['x-goog-api-key'], undefined, 'Analysis uses only its own OpenAI credentials');
                assert.equal(request.model, 'mock-analysis');
                assert.equal(request.reasoning_effort, 'medium', 'Analysis explicitly enables medium reasoning');
                assert.equal(request.max_completion_tokens, 8192, 'Analysis reserves completion tokens beyond reasoning');
                assert.equal(request.messages[0].role, 'developer');
                assert.ok(request.messages[0].content.includes('不要校对、评判或质疑给定答案'), 'The independent analysis API retains the latest answer-explanation instructions');
                assert.equal(request.messages[1].role, 'user');
                const content = request.messages[1].content;
                const imageIndices = content.filter((part) => part.type === 'text' && part.text.startsWith('题干或答案引用的本站配图')).map((part) => Number(part.text.match(/(\d+)$/)[1]));
                const imageUrls = content.filter((part) => part.type === 'image_url').map((part) => part.image_url.url);
                assert.deepEqual(imageIndices, imageUrls.map((_, index) => index + 1));
                assert.ok(imageUrls.every((url) => url.startsWith('data:image/jpeg;base64,')), 'Owned images are sent inline');
                requests.analysis = { system: request.messages[0].content, imageIndices, imageUrls, body };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: '由 $x^2=4$ 得 $x=\\pm2$，因 $x>0$，故 $x=2$。' }, finish_reason: 'stop' }], ...(includeUsage ? { usage: { prompt_tokens: 11, completion_tokens: 7, total_tokens: 18 } } : {}) }));
                return;
            }
            if (req.url === '/v1beta/models/mock-segmentation:generateContent') {
                assert.equal(req.headers['x-goog-api-key'], 'segmentation-secret');
                assert.ok(request.contents[0].parts.some((part) => part.inlineData?.data));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ regions: [{ label: '文字', box_2d: [100, 100, 900, 900], mask: 'test-mask' }] }) }] }, finishReason: 'STOP' }] }));
                return;
            }
            assert.equal(req.url, '/v1beta/models/mock-vision:generateContent');
            assert.equal(req.headers['x-goog-api-key'], 'test-secret');
            assert.equal(request.contents.length, 1);
            assert.equal(request.contents[0].role, 'user');
            if (request.generationConfig?.responseJsonSchema && rejectFormat) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: rejectFormat } })); return;
            }
            const usage = includeUsage ? { usageMetadata: { promptTokenCount: 11, candidatesTokenCount: 7, totalTokenCount: 18 } } : {};
            if (!request.systemInstruction) {
                assert.ok(request.contents[0].parts.some((part) => part.inlineData?.mimeType === 'image/jpeg' && part.inlineData.data));
                assert.equal(JSON.stringify(request.contents).includes('READ-5827'), false, 'The expected text is only in the image, not leaked in the prompt');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: visionReply }] }, finishReason: 'STOP' }], ...usage }));
                return;
            }
            const system = request.systemInstruction.parts.map((part) => part.text).join('');
            const example = JSON.parse(system.split('返回结构示例：')[1].split('。仅输出')[0]);
            const type = 'question' in example ? 'question' : 'answer' in example ? 'answer' : 'analysis';
            const content = request.contents[0].parts;
            const imageIndices = content.filter((part) => part.text?.startsWith('图片顺序')).map((part) => Number(part.text.match(/imageIndex=(\d+)/)[1]));
            const imageUrls = content.filter((part) => part.inlineData).map((part) => `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            for (const id of imageIndices) assert.ok(content.some((part) => part.text?.includes('宽 640 像素，高 160 像素')), `Actual dimensions are provided for image ${id}`);
            requests[type] = { system, imageIndices, imageUrls, body };
            if (!rejectFormat) {
                assert.equal(request.generationConfig.responseMimeType, 'application/json');
                assert.equal(request.generationConfig.responseJsonSchema.type, 'object');
            }
            assert.deepEqual(imageIndices, imageUrls.map((_, index) => index + 1));
            assert.ok(system.includes(JSON.stringify({ formula: '$\\frac{1}{2}$' })));
            if (type === 'question') {
                const supplied = JSON.parse(content[0].text);
                assert.equal('input' in supplied, false, 'Question OCR does not receive saved field snapshots');
                assert.ok(supplied.subjects.some((subject) => subject.id === example.subjectId));
                assert.ok(Array.isArray(supplied.directory));
                assert.ok(system.includes('subjectId 必须原样使用 subjects 中某项的 id'));
            } else if (type === 'answer') {
                const supplied = JSON.parse(content[0].text);
                assert.equal('input' in supplied, false, 'Answer OCR does not receive saved field snapshots');
                assert.equal('subjects' in supplied, false, 'Answer OCR receives no classification catalog');
                assert.equal('directory' in supplied, false);
            }
            let result = type === 'question'
                ? { question: '已知 $x^2=4$，求正数 $x$。', subjectId: 'math', primaryPath: ['函数', 'AI 私有知识点'], auxiliaryPaths: [['函数', '函数性质']], issues: [], figures: [], needsReview: false }
                : type === 'answer' ? { answer: '$x=2$', issues: [], figures: [], needsReview: false }
                    : { analysis: '由 $x^2=4$ 得 $x=\\pm2$，因 $x>0$，故 $x=2$。' };
            if (type === 'question' && questionFixture === 'multiple') {
                result = { ...result, question: '1. 已知 $x^2=4$。\n\n[[figure:geometry]]\n\n(1) 根据图形回答。\n\n[[figure:table]]', primaryPath: ['函数', '校对后才创建'], figures: [
                    { id: 'geometry', imageIndex: 1, box_2d: [125, 125, 500, 500], description: '几何图及原题标注' },
                    { id: 'table', imageIndex: 1, box_2d: [500, 500, 875, 875], description: '复杂数据表格' }
                ] };
            } else if (type === 'question' && questionFixture === 'invalid') {
                result = { ...result, question: '函数图像如下。\n\n[[figure:invalid]]', figures: [{ id: 'invalid', imageIndex: 1, box_2d: [900, 900, 1100, 1100], description: '越界区域' }] };
            } else if (type === 'question' && questionFixture === 'unmatched') {
                result = { ...result, question: '保留无法分类的原题文字。\n\n[[figure:missing]]', subjectId: null, primaryPath: [], auxiliaryPaths: [] };
            } else if (type === 'answer' && answerFixture === 'multiple') {
                result = { ...result, answer: '根据图表可得 $x=2$。\n\n[[figure:answer-chart]]', figures: [
                    { id: 'answer-chart', imageIndex: 1, bounds: { left: 0.25, top: 0.625, right: 0.625, bottom: 0.875 }, description: '答案中的图表' }
                ] };
            } else if (type === 'answer' && answerFixture === 'uncertain') {
                result = { ...result, answer: '(1) $x=2$；(2) [待确认]', issues: [{ imageIndex: 1, type: 'uncertain', description: '订正与原作答重叠，请检查。' }] };
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const output = responseMode === 'json' ? '{invalid' : responseMode === 'schema' ? '{"answer":12}' : responseMode === 'empty' ? '' : JSON.stringify(result);
            const parts = responseMode === 'parts' ? [{ thought: true, text: 'internal reasoning' }, { text: output.slice(0, 12) }, { text: output.slice(12) }] : responseMode === 'refusal' ? [] : [{ text: output }];
            res.end(JSON.stringify({ candidates: [{ content: { role: 'model', parts }, finishReason: responseMode === 'truncated' ? 'MAX_TOKENS' : responseMode === 'refusal' ? 'SAFETY' : 'STOP' }], ...usage }));
        }));
        app = require('../server/app');
        ai = require('../server/mistakes/ai');
        const { hashPassword } = require('../server/mistakes/auth');
        const password = 'SmokePhoto2026!';
        const users = {};
        for (const [name, role] of [['admin', 'admin'], ['alice', 'user'], ['bobby', 'user']]) {
            users[name] = Number(app.db.prepare('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)').run(name, hashPassword(password), role, new Date().toISOString()).lastInsertRowid);
        }
        server = await listen(app);
        const base = `http://127.0.0.1:${server.address().port}/api/mistakes`;
        function client() {
            let cookie = '';
            return async (method, route, body, status = 200) => {
                const response = await fetch(base + route, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}) });
                for (const setCookie of response.headers.getSetCookie()) cookie = setCookie.split(';')[0];
                if (response.headers.get('content-type')?.startsWith('image/')) { assert.equal(response.status, status); return Buffer.from(await response.arrayBuffer()); }
                const payload = await response.json();
                assert.equal(response.status, status, `${method} ${route}: ${JSON.stringify(payload)}`);
                return payload.success ? payload.data : payload;
            };
        }
        const alice = client(), bob = client(), admin = client(), anonymous = client();
        await admin('POST', '/auth/login', { username: 'admin', password });
        await alice('POST', '/auth/login', { username: 'alice', password });
        await bob('POST', '/auth/login', { username: 'bobby', password });
        await alice('GET', '/admin/ai/config', null, 403);
        const configured = await admin('PATCH', '/admin/ai/config', { enabled: true, baseUrl: `http://127.0.0.1:${mock.address().port}/v1beta`, apiKey: 'test-secret', model: 'mock-vision' });
        assert.equal(configured.hasApiKey, true);
        assert.equal(JSON.stringify(configured).includes('test-secret'), false);
        assert.deepEqual(await alice('GET', '/ai/config'), { enabled: true, configured: true, segmentation: { enabled: false, configured: false }, analysis: { enabled: false, configured: false } });
        const analysisConfig = await admin('PATCH', '/admin/ai/config?profile=analysis', { enabled: true, baseUrl: `http://127.0.0.1:${mock.address().port}/v1`, apiKey: 'analysis-secret', model: 'mock-analysis' });
        assert.equal(analysisConfig.hasApiKey, true);
        assert.equal(JSON.stringify(analysisConfig).includes('analysis-secret'), false);
        await admin('PATCH', '/admin/ai/config?profile=segmentation', { enabled: true, baseUrl: `http://127.0.0.1:${mock.address().port}/v1beta`, apiKey: 'segmentation-secret', model: 'mock-segmentation' });
        await admin('PATCH', '/admin/ai/config?profile=general', { apiKey: '' });
        assert.deepEqual(await alice('GET', '/ai/config'), { enabled: true, configured: true, segmentation: { enabled: true, configured: true }, analysis: { enabled: true, configured: true } });
        assert.equal((await admin('GET', '/admin/ai/config?profile=analysis')).model, 'mock-analysis', 'Saving general preserves other profiles');
        assert.match((await admin('POST', '/admin/ai/test?profile=analysis', {})).message, /生成解析 API 连接测试通过/);
        assert.match((await admin('POST', '/admin/ai/test?profile=segmentation', {})).message, /区域识别测试通过/);
        assert.match((await admin('POST', '/admin/ai/test', {})).message, /图片识别测试通过/);
        visionReply = '连接成功'; includeUsage = false;
        assert.match((await admin('POST', '/admin/ai/test', {}, 400)).message, /已连通.*未正确读出/);
        assert.equal(metrics.at(-1).errorCategory, 'vision_mismatch');
        assert.equal(metrics.at(-1).usage, null, 'Missing provider usage is unknown, not zero');
        visionReply = 'READ-5827'; includeUsage = true;
        failureStatus = 400; failures = 1;
        assert.match((await admin('POST', '/admin/ai/test', {}, 400)).message, /不支持此请求/);
        failureStatus = 500;
        const mistake = await alice('POST', '/mistakes', {}, 201);
        const input = (item) => ({ question: item.question, answer: item.answer, analysis: item.analysis, subjectId: item.subjectId, primaryKnowledgePointId: item.primaryKnowledgePointId, auxiliaryKnowledgePointIds: item.auxiliaryKnowledgePointIds });
        const jpeg = fs.readFileSync(path.join(__dirname, '..', 'server', 'mistakes', 'fixtures', 'vision-test.jpg'));
        const originalJpeg = Buffer.concat([jpeg, Buffer.from('original')]);
        async function upload(purpose, clientId, sourceImageId, request = alice, mistakeId = mistake.id, status = 201) {
            const form = new FormData();
            form.append('original', new Blob([originalJpeg], { type: 'image/jpeg' }), 'source.jpg');
            form.append('crop', new Blob([jpeg], { type: 'image/jpeg' }), 'crop.jpg');
            form.append('purpose', purpose); form.append('clientId', clientId);
            if (sourceImageId !== undefined) form.append('sourceImageId', String(sourceImageId));
            return request('POST', `/mistakes/${mistakeId}/images`, form, status);
        }
        const first = await upload('question', 'first');
        const second = await upload('question', 'second');
        const answerImage = await upload('answer', 'answer');
        assert.equal((await upload('question', 'first')).id, first.id, 'Upload retries are idempotent');
        assert.deepEqual(await alice('GET', first.cropUrl.replace('/api/mistakes', '')), jpeg);
        await bob('GET', first.cropUrl.replace('/api/mistakes', ''), null, 404);
        await anonymous('GET', first.cropUrl.replace('/api/mistakes', ''), null, 401);
        async function completed(job, request = alice) {
            for (let index = 0; index < 250; index += 1) {
                const current = await request('GET', `/ai/jobs/${job.id}`);
                if (!['queued', 'running', 'retrying'].includes(current.status)) return current;
                await delay(50);
            }
            throw new Error(`Task ${job.id} did not finish`);
        }
        const latest = () => alice('GET', `/mistakes/${mistake.id}`);
        const jobCount = async (type) => (await alice('GET', '/ai/jobs')).filter((job) => job.type === type).length;

        failures = 1;
        const questionRequest = { clientId: 'background-question', mistakeId: mistake.id, type: 'question', input: input(mistake), imageIds: [first.id, second.id] };
        const question = await alice('POST', '/ai/jobs', questionRequest, 201);
        assert.equal((await alice('POST', '/ai/jobs', questionRequest, 201)).id, question.id, 'Background request retries reuse an active job');
        const sameQuestionRequest = { ...questionRequest, clientId: 'background-question-second' };
        assert.equal((await alice('POST', '/ai/jobs', sameQuestionRequest, 201)).id, question.id, 'Different request IDs preserve active fingerprint deduplication');
        const recognized = await completed(question);
        for (const request of [questionRequest, sameQuestionRequest]) {
            assert.equal((await alice('POST', '/ai/jobs', request, 201)).id, question.id, 'A lost creation response never creates another job after completion');
        }
        await alice('POST', '/ai/jobs', { ...questionRequest, input: { ...questionRequest.input, question: 'changed' } }, 409);
        await alice('POST', '/ai/jobs', { ...questionRequest, imageIds: [second.id, first.id] }, 409);
        await alice('POST', '/ai/jobs', { ...questionRequest, automatic: true }, 409);
        await alice('POST', '/ai/jobs', { ...questionRequest, clientId: '' }, 400);
        assert.equal(recognized.status, 'succeeded', `${recognized.error} (mock calls: ${calls})`);
        assert.equal(recognized.attempts, 2);
        assert.equal(recognized.applyStatus, 'applied', 'Ordinary OCR fills an empty question automatically');
        assert.equal(recognized.result.needsReview, false);
        assert.deepEqual(recognized.result.figures, []);
        assert.equal(requests.question.imageUrls.length, 2);
        assert.equal((await latest()).question, recognized.result.question, 'New OCR never appends the whole source image');
        await bob('GET', `/ai/jobs/${question.id}`, null, 404);
        const privatePoint = (await alice('GET', '/knowledge-points')).find((point) => point.name === 'AI 私有知识点');
        assert.equal(privatePoint.ownerUserId, users.alice);
        assert.equal((await bob('GET', '/knowledge-points')).some((point) => point.id === privatePoint.id), false);
        await bob('POST', '/mistakes', { subjectId: 'math', primaryKnowledgePointId: privatePoint.id }, 400);
        await admin('PATCH', `/knowledge-points/${privatePoint.id}`, { name: 'other' }, 404);
        const firstAnswer = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
        assert.equal((await completed(firstAnswer)).applyStatus, 'applied', 'Ordinary OCR fills an empty answer automatically');
        const auto = (await alice('GET', '/ai/jobs')).find((job) => job.type === 'analysis');
        assert.ok(auto, 'Short recognized answer queues analysis');
        assert.equal((await completed(auto)).applyStatus, 'applied');
        await alice('PATCH', `/mistakes/${mistake.id}`, { analysis: '', generateAnalysis: true });
        assert.equal(await jobCount('analysis'), 1, 'Unchanged inputs are not automatically regenerated');
        await alice('PATCH', `/mistakes/${mistake.id}`, { answer: '详细步骤。'.repeat(30), generateAnalysis: true });
        assert.equal(await jobCount('analysis'), 1, 'Long answers do not queue automatic analysis');

        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '私密题干快照不发模型', answer: '私密答案快照不发模型', analysis: '私密解析快照不发模型' });
        questionFixture = 'multiple';
        answerFixture = 'multiple';
        const sourceSnapshot = await latest();
        const multipleRequest = { clientId: 'background-figures-question', mistakeId: mistake.id, type: 'question', input: input(sourceSnapshot), imageIds: [first.id, second.id] };
        const reuseFiguresRequest = { ...multipleRequest, clientId: 'background-figures-answer', type: 'answer' };
        const [multiple, reuseFigures] = await Promise.all([
            alice('POST', '/ai/jobs', multipleRequest, 201),
            alice('POST', '/ai/jobs', reuseFiguresRequest, 201)
        ]);
        const [multipleResult, reuseFiguresResult] = await Promise.all([completed(multiple), completed(reuseFigures)]);
        answerFixture = 'plain';
        assert.equal(multipleResult.status, 'succeeded');
        assert.equal(multipleResult.result.needsReview, true, 'The server derives review from figures even when the model says false');
        for (const job of [multipleResult, reuseFiguresResult]) {
            assert.equal(job.status, 'succeeded');
            assert.equal(job.applyStatus, 'pending', 'Concurrent photo recognition waits for manual figure confirmation');
            assert.equal(job.result.needsReview, true);
            assert.deepEqual(job.imageIds, [first.id, second.id], 'Question and answer reuse retain the same ordered source crops');
            assert.ok(job.result[job.type].includes('[[figure:'));
            await alice('POST', `/ai/jobs/${job.id}/apply`, {}, 409);
            await alice('POST', `/ai/jobs/${job.id}/apply`, { force: true }, 409);
        }
        assert.equal((await alice('POST', '/ai/jobs', multipleRequest, 201)).id, multiple.id, 'A creation retry returns the pending question review');
        assert.equal((await alice('POST', '/ai/jobs', reuseFiguresRequest, 201)).id, reuseFigures.id, 'A creation retry returns the pending answer review');
        assert.equal(multipleResult.result.figures.length, 2, 'One image supports multiple independent regions');
        assert.deepEqual(multipleResult.result.figures.map((figure) => figure.box), [[0.115, 0.115, 0.395, 0.395], [0.49, 0.49, 0.395, 0.395]]);
        assert.deepEqual(reuseFiguresResult.result.figures[0].box, [0.25, 0.625, 0.375, 0.25]);
        assert.equal((await latest()).question, sourceSnapshot.question);
        assert.equal((await latest()).answer, sourceSnapshot.answer, 'Background answer reuse does not fill unconfirmed figures');
        for (const secret of ['私密题干快照不发模型', '私密答案快照不发模型', '私密解析快照不发模型']) assert.equal(requests.question.body.includes(secret), false);
        assert.equal((await alice('GET', '/knowledge-points')).some((point) => point.name === '校对后才创建'), false, 'Recognition creates no knowledge points before review is applied');
        await alice('POST', `/ai/jobs/${multiple.id}/apply`, { review: { question: multipleResult.result.question } }, 400);
        const geometry = await upload('question', 'figure-geometry', first.id);
        const table = await upload('question', 'figure-table', first.id);
        assert.equal(geometry.sourceImageId, first.id);
        assert.equal((await upload('question', 'figure-geometry', first.id)).id, geometry.id, 'A retried figure upload reuses the same image ID');
        const answerFigure = await upload('answer', 'figure-answer-chart', first.id);
        assert.equal(answerFigure.purpose, 'answer', 'A confirmed answer figure retains its answer purpose');
        assert.equal(answerFigure.sourceImageId, first.id);
        const figureHistory = await alice('GET', `/mistakes/${mistake.id}/images`);
        assert.ok(figureHistory.filter((image) => image.purpose === 'answer').some((image) => image.id === answerFigure.id), 'Confirmed answer figures appear in answer image history');
        assert.equal(figureHistory.filter((image) => image.purpose === 'question').some((image) => image.id === answerFigure.id), false, 'Answer figures never enter question image history');
        const otherMistake = await alice('POST', '/mistakes', {}, 201);
        const otherImage = await upload('question', 'other', undefined, alice, otherMistake.id);
        const bobMistake = await bob('POST', '/mistakes', {}, 201);
        const bobImage = await upload('question', 'bob', undefined, bob, bobMistake.id);
        const photos = await alice('GET', '/photos');
        assert.ok(photos.some((image) => image.key === `image-${first.id}`) && photos.some((image) => image.key === `image-${otherImage.id}`), 'Photo choices include uploads from all of the current user\'s mistakes');
        assert.equal(photos.some((image) => image.key === `image-${bobImage.id}` || image.key === `image-${geometry.id}`), false, 'Photo choices exclude other users and derived figures');
        await anonymous('GET', '/photos', null, 401);
        const sourcePhoto = photos.find((image) => image.key === `image-${first.id}`);
        const originalBytes = await alice('GET', sourcePhoto.originalUrl.replace('/api/mistakes', ''));
        assert.deepEqual(originalBytes, originalJpeg, 'Re-cropping starts from the entire original photo');
        const copyForm = new FormData();
        const recropped = Buffer.concat([jpeg, Buffer.from('new-crop')]);
        copyForm.append('original', new Blob([originalBytes], { type: 'image/jpeg' }), sourcePhoto.originalName);
        copyForm.append('crop', new Blob([recropped], { type: 'image/jpeg' }), 'recropped.jpg');
        copyForm.append('purpose', 'question'); copyForm.append('clientId', 'photo-copy');
        const photoCopy = await alice('POST', `/mistakes/${otherMistake.id}/images`, copyForm, 201);
        assert.notEqual(photoCopy.id, first.id, 'Reusing a photo creates a separate image record');
        assert.deepEqual(await alice('GET', photoCopy.cropUrl.replace('/api/mistakes', '')), recropped);
        assert.deepEqual(await alice('GET', first.cropUrl.replace('/api/mistakes', '')), jpeg, 'Re-cropping leaves the previous crop unchanged');
        await alice('POST', '/ai/jobs', { ...questionRequest, mistakeId: otherMistake.id, imageIds: [otherImage.id] }, 409);
        const bobRequest = { ...questionRequest, mistakeId: bobMistake.id, input: input(bobMistake), imageIds: [bobImage.id] };
        const bobJob = await completed(await bob('POST', '/ai/jobs', bobRequest, 201), bob);
        assert.notEqual(bobJob.id, question.id, 'Request IDs are scoped to their owner');
        assert.equal((await bob('POST', '/ai/jobs', bobRequest, 201)).id, bobJob.id);
        const unrelated = await upload('question', 'unrelated');
        await upload('question', 'invalid-derived-owner', bobImage.id, alice, mistake.id, 400);
        await upload('question', 'invalid-derived-mistake', otherImage.id, alice, mistake.id, 400);
        const finalQuestion = `1. 校对后的条件 $x^2=4$。\n\n![几何图](${geometry.cropUrl})\n\n(1) 根据图形回答。\n\n![复杂数据表格](${table.cropUrl})`;
        const review = { question: finalQuestion, subjectId: 'math', primaryPath: ['函数', '校对后才创建'], auxiliaryPaths: [['函数', '函数性质']] };
        for (const forbidden of [bobImage, otherImage, unrelated]) await alice('POST', `/ai/jobs/${multiple.id}/apply`, { review: { ...review, question: `![非法配图](${forbidden.cropUrl})` } }, 400);
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '校对期间人工修改的题目' });
        await alice('POST', `/ai/jobs/${multiple.id}/apply`, { review }, 409);
        assert.equal((await latest()).question, '校对期间人工修改的题目');
        assert.equal((await alice('GET', `/ai/jobs/${multiple.id}`)).result.question, multipleResult.result.question, 'Editing conflicts preserve the original OCR result');
        const applied = await alice('POST', `/ai/jobs/${multiple.id}/apply`, { review, force: true });
        assert.equal(applied.mistake.question, finalQuestion, 'The final text and diagram order are applied exactly as reviewed');
        assert.equal(applied.job.result.question, multipleResult.result.question, 'Review does not overwrite the original recognition result');
        assert.equal((await alice('GET', '/knowledge-points')).some((point) => point.name === '校对后才创建'), true);
        const answerAfterQuestionReview = await alice('GET', `/ai/jobs/${reuseFigures.id}`);
        assert.equal(answerAfterQuestionReview.applyStatus, 'pending', 'Confirming the question leaves the answer review pending');
        assert.deepEqual(answerAfterQuestionReview.imageIds, reuseFiguresResult.imageIds);
        assert.deepEqual(answerAfterQuestionReview.result.figures, reuseFiguresResult.result.figures, 'Confirming question crops never changes answer source coordinates');
        const finalAnswer = `根据图表校对后的答案 $x=2$。\n\n![答案图表](${answerFigure.cropUrl})`;
        const reviewedAnswer = await alice('POST', `/ai/jobs/${reuseFigures.id}/apply`, { review: { answer: finalAnswer }, force: true });
        assert.equal(reviewedAnswer.mistake.answer, finalAnswer);
        assert.equal(reviewedAnswer.mistake.question, finalQuestion, 'Confirming the answer preserves the reviewed question');
        assert.deepEqual(await alice('GET', first.cropUrl.replace('/api/mistakes', '')), jpeg, 'Manual figure confirmation leaves the reused source crop unchanged');
        assert.equal((await alice('POST', '/ai/jobs', reuseFiguresRequest, 201)).id, reuseFigures.id, 'A lost creation response still returns the original job after manual confirmation');
        assert.deepEqual((await alice('GET', `/ai/jobs/${reuseFigures.id}`)).result.figures, reuseFiguresResult.result.figures);

        questionFixture = 'invalid';
        const invalid = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'question', input: input(await latest()), imageIds: [first.id] }, 201));
        assert.equal(invalid.status, 'succeeded', 'Invalid coordinates retain the transcription instead of failing the whole task');
        assert.equal(invalid.result.needsReview, true);
        assert.equal(invalid.result.figures[0].box, null, 'Invalid regions are never turned into automatic crops');
        assert.ok(invalid.result.issues.some((issue) => issue.imageId === first.id));
        assert.equal(invalid.result.figures[0].locationError, 'bounds');
        assert.deepEqual(invalid.result.figures[0].rawLocation.box_2d, [900, 900, 1100, 1100], 'Original Gemini coordinates survive normalization and repeated reads');
        await alice('POST', `/ai/jobs/${invalid.id}/apply`, { review: { question: invalid.result.question } }, 400);
        await alice('POST', `/ai/jobs/${invalid.id}/apply`, { review: { question: '明确移除无效配图后的题干。' }, force: true });
        questionFixture = 'unmatched';
        const unmatched = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'question', input: input(await latest()), imageIds: [first.id] }, 201));
        assert.equal(unmatched.status, 'succeeded');
        assert.equal(unmatched.result.subjectId, null, 'Uncertain classification preserves recognized text');
        assert.equal(unmatched.result.needsReview, true, 'An unmatched diagram marker requires review');
        assert.ok(unmatched.result.question.includes('保留无法分类的原题文字'));
        await alice('POST', `/ai/jobs/${unmatched.id}/apply`, { review: { question: unmatched.result.question } }, 400);
        await alice('POST', `/ai/jobs/${unmatched.id}/apply`, { review: { question: '保留无法分类的原题文字。', subjectId: null, primaryPath: [], auxiliaryPaths: [] }, force: true });
        questionFixture = 'plain';
        const legacyJob = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'question', input: input(await latest()), imageIds: [first.id] }, 201));
        app.db.prepare("UPDATE ai_jobs SET result_json = ?, apply_status = 'pending' WHERE id = ?").run(JSON.stringify({ question: `旧任务题干\n\n![旧配图](${first.id})`, subjectId: 'math', primaryPath: ['函数'], auxiliaryPaths: [], diagramImageIds: [first.id] }), legacyJob.id);
        const legacy = await alice('GET', `/ai/jobs/${legacyJob.id}`);
        assert.equal(legacy.result.needsReview, true);
        assert.equal(legacy.result.figures[0].imageId, first.id);
        assert.deepEqual(legacy.result.figures[0].box, [0, 0, 1, 1], 'Old diagramImageIds open as editable full-image regions');
        assert.ok(legacy.result.question.includes('[[figure:'));
        assert.equal(legacy.result.question.includes('![题目配图]'), false);
        await alice('POST', `/ai/jobs/${legacy.id}/apply`, { review: { question: `旧任务题干\n\n![旧配图](${first.cropUrl})` }, force: true });
        const { questionWithImages } = require('../server/mistakes/question-images');
        const reference = '![图\\[1\\]][diagram]\n\n[diagram]: ' + first.id + ' "结构图"\n\n`![示例](' + first.id + ')`';
        assert.ok(questionWithImages(reference, [first.id], [first.id]).startsWith(`![图\\[1\\]](${first.cropUrl} "结构图")`));
        assert.ok(questionWithImages(reference, [first.id]).includes('`![示例](' + first.id + ')`'), 'Code samples keep their original source');

        const imagesBeforeReuse = (await alice('GET', `/mistakes/${mistake.id}/images`)).length;
        const reused = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [second.id, first.id] }, 201));
        assert.equal(reused.status, 'succeeded');
        assert.deepEqual(reused.imageIds, [second.id, first.id], 'Answer recognition preserves displayed image order');
        assert.deepEqual(requests.answer.imageUrls, [jpeg, jpeg].map((image) => `data:image/jpeg;base64,${image.toString('base64')}`), 'Reused sources send cropped bytes, not originals');
        assert.equal((await alice('GET', `/mistakes/${mistake.id}/images`)).length, imagesBeforeReuse);
        assert.equal(requests.answer.body.includes('私密答案快照不发模型'), false);
        await alice('PATCH', `/mistakes/${mistake.id}`, { answer: '用户的新答案' });
        await alice('POST', `/ai/jobs/${reused.id}/apply`, {}, 409);
        const appended = await alice('POST', `/ai/jobs/${reused.id}/apply`, { force: true, mode: 'append' });
        assert.match(appended.mistake.answer, /用户的新答案\n\n\$x=2\$/);
        answerFixture = 'uncertain';
        const uncertain = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201));
        assert.equal(uncertain.result.needsReview, true);
        assert.equal(uncertain.result.issues[0].imageId, answerImage.id);
        assert.notEqual(uncertain.applyStatus, 'applied');
        await alice('POST', `/ai/jobs/${uncertain.id}/apply`, {}, 409);
        await alice('POST', `/ai/jobs/${uncertain.id}/apply`, { review: { answer: '(1) $x=2$；(2) $y=3$' }, force: true });
        answerFixture = 'plain';

        await alice('PATCH', `/mistakes/${mistake.id}`, { question: `根据图形求解。\n\n![几何图](${geometry.cropUrl})\n\n![外部图](https://example.invalid/no-fetch.jpg)`, answer: `$x=2$\n\n![答案图](${answerImage.cropUrl})`, analysis: '', generateAnalysis: true });
        const illustrated = (await alice('GET', '/ai/jobs')).find((job) => job.type === 'analysis');
        assert.equal((await completed(illustrated)).applyStatus, 'applied');
        assert.deepEqual(requests.analysis.imageIndices, [1, 2], 'Analysis labels images in submitted order');
        assert.equal(requests.analysis.imageUrls.length, 2, 'External image URLs are never fetched');
        assert.deepEqual(illustrated.imageIds, [geometry.id, answerImage.id], 'Automatic job fingerprints include the resolved image IDs');
        let illustratedCount = await jobCount('analysis');
        await alice('PATCH', `/mistakes/${mistake.id}`, { analysis: '', generateAnalysis: true });
        assert.equal(await jobCount('analysis'), illustratedCount, 'An identical text and image snapshot is not generated twice');
        await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'analysis', input: { ...input(await latest()), question: `![别题配图](${otherImage.cropUrl})` } }, 400);
        const manyImages = [first, second, geometry, table, unrelated];
        for (let index = manyImages.length; index < 13; index += 1) manyImages.push(await upload('question', `limit-${index}`));
        const twelveQuestion = '十二张配图仍可解析。\n\n' + manyImages.slice(0, 12).map((image, index) => `![图${index + 1}](${image.cropUrl})`).join('\n\n');
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: twelveQuestion, answer: '2', analysis: '', generateAnalysis: true });
        const atLimit = (await alice('GET', '/ai/jobs')).find((job) => job.type === 'analysis');
        assert.equal((await completed(atLimit)).applyStatus, 'applied');
        assert.equal(requests.analysis.imageUrls.length, 12, 'Exactly twelve owned images are accepted');
        illustratedCount = await jobCount('analysis');
        const tooManyQuestion = '检查配图数量。\n\n' + manyImages.map((image, index) => `![图${index + 1}](${image.cropUrl})`).join('\n\n');
        const tooMany = await alice('PATCH', `/mistakes/${mistake.id}`, { question: tooManyQuestion, answer: '2', analysis: '', generateAnalysis: true });
        assert.equal(await jobCount('analysis'), illustratedCount, 'Automatic analysis skips more than twelve images without failing the save');
        assert.ok(tooMany.analysisNotice?.includes('12'), 'The user is asked to simplify excessive analysis images');
        await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'analysis', input: input(await latest()) }, 400);
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '题干[待补充]', answer: '2', generateAnalysis: true });
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '完整的题干', answer: '[待确认]', generateAnalysis: true });
        assert.equal(await jobCount('analysis'), illustratedCount, 'Unresolved question or answer markers suppress automatic analysis');
        await alice('PATCH', `/mistakes/${mistake.id}`, { answer: '2', generateAnalysis: true });
        const resumed = (await alice('GET', '/ai/jobs')).find((job) => job.type === 'analysis');
        assert.notEqual(resumed.id, illustrated.id, 'Saving completed text restores the automatic trigger');
        assert.equal((await completed(resumed)).applyStatus, 'applied');
        const conflictSnapshot = await latest();
        await alice('PATCH', `/mistakes/${mistake.id}`, { analysis: '' });
        hold = 250;
        const conflict = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'analysis', input: { ...input(conflictSnapshot), analysis: '' } }, 201);
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '解析期间人工修改后的题目' });
        assert.equal((await completed(conflict)).applyStatus, 'conflict');
        assert.equal((await latest()).analysis, '');
        hold = 0;
        for (const job of await alice('GET', '/ai/jobs')) if (['queued', 'running', 'retrying'].includes(job.status)) await completed(job);
        for (const [mode, attempts, category] of [['json', 2, 'format'], ['schema', 2, 'format'], ['empty', 2, 'format'], ['truncated', 1, 'truncated'], ['refusal', 1, 'refusal']]) {
            responseMode = mode;
            const beforeCalls = calls;
            const bad = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
            const result = await completed(bad);
            assert.equal(result.status, 'failed');
            assert.equal(result.attempts, attempts);
            assert.equal(calls - beforeCalls, attempts, `${mode} never resends the batch beyond its retry budget`);
            assert.equal(metrics.at(-1).errorCategory, category);
            if (mode === 'truncated') assert.match(result.error, /减少单次图片数量/);
        }
        responseMode = 'parts';
        const multipart = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201));
        assert.equal(multipart.status, 'succeeded', 'Gemini text parts are joined before JSON parsing');
        responseMode = '';
        rejectFormat = 'responseJsonSchema is not supported by this model';
        const beforeFallback = calls;
        const fallback = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201));
        assert.equal(fallback.status, 'succeeded');
        assert.equal(calls - beforeFallback, 2, 'Explicit unsupported-format rejection allows one fallback');
        assert.deepEqual(metrics.slice(-2).map((item) => item.responseFormat), ['json_schema', 'text']);
        rejectFormat = 'Invalid schema for responseJsonSchema: required is missing';
        const beforeBadSchema = calls;
        const badSchema = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201));
        assert.equal(badSchema.status, 'failed');
        assert.equal(calls - beforeBadSchema, 1, 'Invalid schema is not treated as a capability rejection');
        rejectFormat = '';
        failureStatus = 429; failures = 1;
        const limited = await completed(await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201));
        assert.equal(limited.status, 'succeeded'); assert.equal(limited.attempts, 2);
        failureStatus = 500;

        const datasetDirectory = path.join(directory, 'baseline');
        fs.mkdirSync(path.join(datasetDirectory, 'images'), { recursive: true });
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'mistakes-ai-baseline.example.json'), 'utf8'));
        manifest.source = 'synthetic';
        for (const name of new Set(manifest.cases.flatMap((item) => item.images))) fs.writeFileSync(path.join(datasetDirectory, name), jpeg);
        const manifestPath = path.join(datasetDirectory, 'manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest));
        const { runBaseline, markdownReport, compareReports } = require('./mistakes-ai-baseline.cjs');
        assert.deepEqual(await runBaseline(manifestPath, 'check', { checkOnly: true }), { source: 'synthetic', images: 8, cases: 8 });
        const beforeBaselineCalls = calls;
        const baseline = await runBaseline(manifestPath, 'synthetic-smoke');
        assert.equal(calls - beforeBaselineCalls, 8, 'A baseline makes exactly one call per case');
        assert.equal(baseline.cases.every((item) => item.calls === 1 && !item.errorCategory && item.review.manualEdits === null), true);
        assert.ok(markdownReport(baseline).includes('null 表示未评分'));
        assert.ok(compareReports(baseline, baseline).includes('待人工评分'));
        const scored = structuredClone(baseline);
        for (const item of scored.cases) item.review = { criticalContentErrors: 0, manualEdits: 0, figureComplete: true, handwritingLeak: false };
        const regressed = structuredClone(scored); regressed.cases[0].review.criticalContentErrors = 1;
        assert.ok(compareReports(scored, regressed).includes('出现退化'));
        assert.deepEqual(metrics.at(-1).usage, { inputTokens: 11, outputTokens: 7, totalTokens: 18 });
        assert.ok(metrics.every((entry) => entry.elapsedMs >= 0));
        assert.equal(/test-secret|analysis-secret|segmentation-secret|data:image|私密/.test(JSON.stringify(metrics)), false, 'Request logs contain metadata only');
        failures = 3;
        const failed = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
        const failedResult = await completed(failed);
        assert.equal(failedResult.status, 'failed'); assert.equal(failedResult.attempts, 3);
        await bob('POST', `/ai/jobs/${failed.id}/cancel`, {}, 404);
        assert.equal((await alice('POST', `/ai/jobs/${failed.id}/cancel`, {})).status, 'cancelled', 'Failed tasks can be dismissed');
        assert.equal((await alice('POST', `/ai/jobs/${failed.id}/cancel`, {})).status, 'cancelled', 'Cancellation is idempotent');
        await alice('POST', `/ai/jobs/${failed.id}/retry`, {});
        assert.equal((await completed(failed)).status, 'succeeded');

        const beforeDiscard = input(await latest());
        const dismissed = await alice('POST', '/ai/jobs/batch', { action: 'cancel', ids: [badSchema.id, multipart.id, conflict.id, question.id] });
        assert.deepEqual(dismissed.jobs.map((job) => job.id), [badSchema.id, multipart.id, conflict.id], 'Batch cancellation supports failed, pending review and conflicted results');
        assert.ok(dismissed.jobs.every((job) => job.status === 'cancelled'));
        assert.equal(dismissed.errors[0].id, question.id, 'Applied results cannot be cancelled');
        assert.equal((await alice('GET', `/ai/jobs/${question.id}`)).applyStatus, 'applied');
        assert.deepEqual(dismissed.jobs[1].result, multipart.result, 'Cancelled review results remain available for reference');
        await alice('POST', `/ai/jobs/${conflict.id}/apply`, { force: true }, 409);
        assert.deepEqual(input(await latest()), beforeDiscard, 'Cancelling review tasks never changes saved mistake content');
        const freshConflict = await alice('POST', `/ai/jobs/${conflict.id}/retry`, {});
        assert.equal(freshConflict.result, null, 'Retry discards the cancelled result before running again');
        assert.equal(freshConflict.applyStatus, 'pending', 'Retry resets the previous conflict');
        assert.equal((await completed(conflict)).applyStatus, 'conflict');
        await ai.stopJobs();
        const recovery = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
        app.db.prepare("UPDATE ai_jobs SET status = 'running', attempts = 1 WHERE id = ?").run(recovery.id);
        ai.recoverJobs();
        assert.equal((await completed(recovery)).attempts, 2, 'Recovery preserves consumed attempts');
        hold = 250;
        const cancelled = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
        await alice('POST', `/ai/jobs/${cancelled.id}/cancel`, {});
        await delay(350);
        assert.equal((await alice('GET', `/ai/jobs/${cancelled.id}`)).status, 'cancelled');
        const duplicate = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(await latest()), imageIds: [answerImage.id] }, 201);
        await alice('POST', `/ai/jobs/${cancelled.id}/retry`, {}, 409);
        const privateBatch = await bob('POST', '/ai/jobs/batch', { action: 'cancel', ids: [duplicate.id] });
        assert.equal(privateBatch.jobs.length, 0);
        assert.equal(privateBatch.errors[0].id, duplicate.id, 'Batch operations enforce ownership per job');
        const cancelledBatch = await alice('POST', '/ai/jobs/batch', { action: 'cancel', ids: [duplicate.id, duplicate.id, 9999999] });
        assert.equal(cancelledBatch.jobs.length, 1, 'Duplicate selections are processed once');
        assert.equal(cancelledBatch.jobs[0].status, 'cancelled');
        assert.equal(cancelledBatch.errors[0].id, 9999999, 'One missing job does not prevent other operations');
        await alice('POST', '/ai/jobs/batch', { action: 'retry', ids: Array(51).fill(cancelled.id) }, 400);
        require('../server/mistakes/ai-config').saveConfig({ enabled: false });
        await alice('POST', `/ai/jobs/${cancelled.id}/retry`, {}, 400);
        require('../server/mistakes/ai-config').saveConfig({ enabled: true });
        await delay(350);
        hold = 0;
        const retriedBatch = await alice('POST', '/ai/jobs/batch', { action: 'retry', ids: [cancelled.id, question.id] });
        assert.equal(retriedBatch.jobs[0].id, cancelled.id);
        assert.equal(retriedBatch.errors[0].id, question.id, 'Completed jobs cannot be retried through the batch endpoint');
        assert.equal((await completed(cancelled)).status, 'succeeded');

        const history = app.db.prepare(`INSERT INTO ai_jobs (mistake_id, user_id, type, status, apply_status, input_json, result_json, fingerprint, created_at)
            VALUES (?, ?, 'analysis', ?, ?, ?, ?, ?, ?)`);
        const historyIds = app.db.transaction(() => Array.from({ length: 203 }, (_, index) => Number(history.run(mistake.id, users.alice,
            index === 0 ? 'failed' : 'succeeded', index < 2 ? 'pending' : 'applied', JSON.stringify(input(mistake)),
            index === 0 ? null : JSON.stringify({ analysis: '历史解析' }), `history-${index}`, new Date().toISOString()).lastInsertRowid)))();
        const historyList = await alice('GET', '/ai/jobs');
        assert.ok(historyList.some((job) => job.id === historyIds[0]), 'Old failed jobs stay visible beyond the recent history limit');
        assert.ok(historyList.some((job) => job.id === historyIds[1]), 'Old review candidates stay visible beyond the recent history limit');
        assert.ok(!historyList.some((job) => job.id === historyIds[2]), 'Applied history remains bounded');
        const cancelledHistory = await alice('POST', '/ai/jobs/batch', { action: 'cancel', ids: historyIds.slice(0, 2) });
        assert.equal(cancelledHistory.jobs.length, 2);
        assert.ok(!(await alice('GET', '/ai/jobs')).some((job) => historyIds.slice(0, 2).includes(job.id)), 'Cancelled old failures and review tasks no longer remain in the attention queue');
        const imageRows = app.db.prepare('SELECT original_path, crop_path FROM mistake_images WHERE mistake_id = ?').all(mistake.id);
        await alice('DELETE', `/mistakes/${mistake.id}`);
        assert.equal((await alice('GET', '/photos')).some((image) => image.mistakeId === mistake.id), false, 'Trashed mistakes do not appear as photo sources');
        assert.equal((await alice('GET', `/ai/jobs/${cancelled.id}`)).mistakeDeleted, true);
        assert.ok((await alice('GET', '/ai/jobs')).filter((job) => job.mistakeId === mistake.id).every((job) => job.mistakeDeleted), 'Task lists identify records in trash');
        assert.equal((await alice('GET', `/mistakes/${mistake.id}/images`)).length, imageRows.length, 'Trash retains source and derived images');
        await alice('DELETE', `/mistakes/${mistake.id}/permanent`);
        assert.equal(app.db.prepare('SELECT COUNT(*) AS total FROM ai_job_requests WHERE user_id = ?').get(users.alice).total, 0, 'Permanent deletion removes the request mappings');
        for (const row of imageRows) for (const filename of [row.original_path, row.crop_path]) assert.equal(fs.existsSync(path.join(process.env.MISTAKES_UPLOADS_PATH, filename)), false, 'Permanent deletion removes source and derived files');
        await alice('GET', first.cropUrl.replace('/api/mistakes', ''), null, 404);
        assert.ok(calls > 0);
        console.log('Photo AI smoke passed: OCR privacy, multi-region review, ownership, legacy diagrams, illustrated analysis, retries, cancellation, conflicts and cleanup.');
    } finally {
        console.info = originalInfo;
        if (ai) await ai.stopJobs();
        await close(server); await close(mock);
        app?.db.close();
        const root = path.resolve(__dirname, '..', 'data');
        assert.equal(path.dirname(path.resolve(directory)), root);
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

if (require.main === module) runAiSmoke().catch((error) => { console.error(error); process.exitCode = 1; });
module.exports = { runAiSmoke };

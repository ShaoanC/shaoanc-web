const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { setTimeout: delay } = require('node:timers/promises');

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
    let hold = 0;
    let calls = 0;
    let lastImages = 0;
    const listen = (listener) => new Promise((resolve) => { const server = listener.listen(0, '127.0.0.1', () => resolve(server)); });
    const close = (listener) => listener && new Promise((resolve) => { listener.closeAllConnections(); listener.close(resolve); });
    try {
        mock = await listen(http.createServer(async (req, res) => {
            let body = '';
            for await (const part of req) body += part;
            calls += 1;
            if (failures > 0) { failures -= 1; res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'temporary', type: 'server_error' } })); return; }
            if (hold) await delay(hold);
            const request = JSON.parse(body);
            const system = request.messages[0].content;
            const example = JSON.parse(system.split('返回结构示例：')[1].split('。仅输出')[0]);
            if ('question' in example) {
                const supplied = JSON.parse(request.messages[1].content[0].text);
                assert.ok(supplied.subjects.some((subject) => subject.id === example.subjectId));
                assert.deepEqual(example.diagramImageIds, []);
                assert.ok(system.includes('subjectId 必须原样使用 subjects 中某项的 id'));
            }
            assert.ok(system.includes(JSON.stringify({ formula: '$\\frac{1}{2}$' })));
            const content = request.messages[1]?.content || [];
            lastImages = Array.isArray(content) ? content.filter((part) => part.type === 'image_url').length : 0;
            const imageIds = Array.isArray(content) ? content.filter((part) => part.type === 'text' && part.text.startsWith('图片编号')).map((part) => Number(part.text.split(' ')[1])) : [];
            const result = system.includes('只转写题干') ? { question: '已知 $x^2=4$，求正数 $x$。', subjectId: 'math', primaryPath: ['函数', 'AI 私有知识点'], auxiliaryPaths: [['函数', '函数性质']], diagramImageIds: imageIds.slice(0, 1) }
                : system.includes('转写答案') ? { answer: '$x=2$' } : { analysis: '由 $x^2=4$ 得 $x=\\pm2$，因 $x>0$，故 $x=2$。' };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: JSON.stringify(result) }, finish_reason: 'stop' }] }));
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
                return payload.data;
            };
        }
        const alice = client(), bob = client(), admin = client(), anonymous = client();
        await admin('POST', '/auth/login', { username: 'admin', password });
        await alice('POST', '/auth/login', { username: 'alice', password });
        await bob('POST', '/auth/login', { username: 'bobby', password });
        await alice('GET', '/admin/ai/config', null, 403);
        const configured = await admin('PATCH', '/admin/ai/config', { enabled: true, baseUrl: `http://127.0.0.1:${mock.address().port}/v1`, apiKey: 'test-secret', model: 'mock-vision' });
        assert.equal(configured.hasApiKey, true);
        assert.equal(JSON.stringify(configured).includes('test-secret'), false);
        assert.deepEqual(await alice('GET', '/ai/config'), { enabled: true, configured: true });
        const mistake = await alice('POST', '/mistakes', {}, 201);
        const input = (item) => ({ question: item.question, answer: item.answer, analysis: item.analysis, subjectId: item.subjectId, primaryKnowledgePointId: item.primaryKnowledgePointId, auxiliaryKnowledgePointIds: item.auxiliaryKnowledgePointIds });
        const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0xff, 0xd9]);
        async function upload(purpose, clientId) {
            const form = new FormData(); form.append('original', new Blob([jpeg], { type: 'image/jpeg' }), 'source.jpg'); form.append('crop', new Blob([jpeg], { type: 'image/jpeg' }), 'crop.jpg'); form.append('purpose', purpose); form.append('clientId', clientId);
            return alice('POST', `/mistakes/${mistake.id}/images`, form, 201);
        }
        const first = await upload('question', 'first');
        const second = await upload('question', 'second');
        const answerImage = await upload('answer', 'answer');
        assert.equal((await upload('question', 'first')).id, first.id, 'Upload retries are idempotent');
        assert.equal((await alice('GET', `/mistakes/${mistake.id}/images`)).length, 3);
        assert.deepEqual(await alice('GET', first.cropUrl.replace('/api/mistakes', '')), jpeg);
        await bob('GET', first.cropUrl.replace('/api/mistakes', ''), null, 404);
        await anonymous('GET', first.cropUrl.replace('/api/mistakes', ''), null, 401);
        async function completed(job) {
            for (let index = 0; index < 250; index += 1) {
                const current = await alice('GET', `/ai/jobs/${job.id}`);
                if (!['queued', 'running', 'retrying'].includes(current.status)) return current;
                await delay(50);
            }
            throw new Error(`Task ${job.id} did not finish`);
        }
        failures = 1;
        const question = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'question', input: input(mistake), imageIds: [first.id, second.id] }, 201);
        const recognized = await completed(question);
        assert.equal(recognized.status, 'succeeded'); assert.equal(recognized.attempts, 2); assert.equal(lastImages, 2);
        await bob('GET', `/ai/jobs/${question.id}`, null, 404);
        let applied = await alice('POST', `/ai/jobs/${question.id}/apply`, {});
        assert.match(applied.mistake.question, /\$x\^2=4\$/);
        assert.match(applied.mistake.question, /!\[题目配图\]/);
        const ownPoints = await alice('GET', '/knowledge-points');
        const privatePoint = ownPoints.find((point) => point.name === 'AI 私有知识点');
        assert.equal(privatePoint.ownerUserId, users.alice);
        assert.equal((await bob('GET', '/knowledge-points')).some((point) => point.id === privatePoint.id), false);
        await bob('POST', '/mistakes', { subjectId: 'math', primaryKnowledgePointId: privatePoint.id }, 400);
        await admin('PATCH', `/knowledge-points/${privatePoint.id}`, { name: 'other' }, 404);
        const answer = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(applied.mistake), imageIds: [answerImage.id] }, 201);
        assert.equal((await completed(answer)).status, 'succeeded');
        applied = await alice('POST', `/ai/jobs/${answer.id}/apply`, {});
        const auto = (await alice('GET', '/ai/jobs')).find((job) => job.type === 'analysis');
        assert.ok(auto, 'Short recognized answer queues analysis');
        assert.equal((await completed(auto)).applyStatus, 'applied');
        assert.match((await alice('GET', `/mistakes/${mistake.id}`)).analysis, /x=2/);
        await alice('PATCH', `/mistakes/${mistake.id}`, { analysis: '', generateAnalysis: true });
        assert.equal((await alice('GET', '/ai/jobs')).filter((job) => job.type === 'analysis').length, 1, 'Unchanged inputs are not automatically regenerated');
        await alice('PATCH', `/mistakes/${mistake.id}`, { answer: '详细步骤。'.repeat(30), generateAnalysis: true });
        assert.equal((await alice('GET', '/ai/jobs')).filter((job) => job.type === 'analysis').length, 1, 'Long answer does not queue analysis');
        const manual = await alice('POST', '/mistakes', { subjectId: 'math', question: '求 1+1', answer: '2', generateAnalysis: true }, 201);
        const manualAnalysis = (await alice('GET', '/ai/jobs')).find((job) => job.mistakeId === manual.id);
        assert.ok(manualAnalysis, 'Saving manual short answer queues analysis');
        await completed(manualAnalysis);
        const latest = await alice('GET', `/mistakes/${mistake.id}`);
        hold = 250;
        const conflict = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'analysis', input: input(latest) }, 201);
        await alice('PATCH', `/mistakes/${mistake.id}`, { question: '人工修改后的题目' });
        assert.equal((await completed(conflict)).applyStatus, 'conflict');
        assert.equal((await alice('GET', `/mistakes/${mistake.id}`)).analysis, '');
        hold = 0;
        const replacement = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(latest), imageIds: [answerImage.id] }, 201);
        await completed(replacement);
        await alice('PATCH', `/mistakes/${mistake.id}`, { answer: '用户的新答案' });
        await alice('POST', `/ai/jobs/${replacement.id}/apply`, {}, 409);
        const appended = await alice('POST', `/ai/jobs/${replacement.id}/apply`, { force: true, mode: 'append' });
        assert.match(appended.mistake.answer, /用户的新答案\n\n\$x=2\$/);
        for (const job of await alice('GET', '/ai/jobs')) if (['queued', 'running', 'retrying'].includes(job.status)) await completed(job);
        failures = 3;
        const failed = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(appended.mistake), imageIds: [answerImage.id] }, 201);
        const failedResult = await completed(failed);
        assert.equal(failedResult.status, 'failed'); assert.equal(failedResult.attempts, 3);
        await alice('POST', `/ai/jobs/${failed.id}/retry`, {});
        assert.equal((await completed(failed)).status, 'succeeded');
        await ai.stopJobs();
        const recovery = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(appended.mistake), imageIds: [answerImage.id] }, 201);
        app.db.prepare("UPDATE ai_jobs SET status = 'running', attempts = 1 WHERE id = ?").run(recovery.id);
        ai.recoverJobs();
        assert.equal((await completed(recovery)).attempts, 2, 'Recovery preserves consumed attempts');
        hold = 250;
        const cancelled = await alice('POST', '/ai/jobs', { mistakeId: mistake.id, type: 'answer', input: input(appended.mistake), imageIds: [answerImage.id] }, 201);
        await alice('POST', `/ai/jobs/${cancelled.id}/cancel`, {});
        await delay(350);
        assert.equal((await alice('GET', `/ai/jobs/${cancelled.id}`)).status, 'cancelled');
        await alice('DELETE', `/mistakes/${mistake.id}`);
        assert.equal((await alice('GET', `/mistakes/${mistake.id}/images`)).length, 3, 'Trash retains images');
        await alice('DELETE', `/mistakes/${mistake.id}/permanent`);
        assert.equal(fs.readdirSync(process.env.MISTAKES_UPLOADS_PATH).length, 0, 'Permanent deletion removes image files');
        await alice('GET', first.cropUrl.replace('/api/mistakes', ''), null, 404);
        assert.ok(calls > 0);
        console.log('Photo AI smoke passed: uploads, multi-image OCR, private branches, short answers, retries, recovery, conflicts and cleanup.');
    } finally {
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

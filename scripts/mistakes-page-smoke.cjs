const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { setTimeout: delay } = require('node:timers/promises');
const sharp = require('sharp');

async function run() {
    const directory = fs.mkdtempSync(path.join(__dirname, '..', 'data', 'page-smoke-'));
    process.env.MISTAKES_DB_PATH = path.join(directory, 'test.sqlite');
    process.env.MISTAKES_UPLOADS_PATH = path.join(directory, 'images');
    process.env.MISTAKES_AI_CONFIG_PATH = path.join(directory, '.env.ai');
    process.env.FRIENDLY_CAPTCHA_ENABLED = 'false';
    process.env.NODE_ENV = 'test';
    const listen = (handler) => new Promise((resolve) => { const listener = handler.listen(0, '127.0.0.1', () => resolve(listener)); });
    const close = (listener) => listener && new Promise((resolve) => { listener.closeAllConnections(); listener.close(resolve); });
    let mock, server, app, ai;
    let active = 0, peak = 0, segmentCalls = 0, recognitionCalls = 0, analysisCalls = 0;
    let failRecognition = false, holdRecognition = 0, omitAnswer = false;
    const calls = [];
    const pageSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400"><rect width="1000" height="1400" fill="white"/><g font-family="Arial" font-size="30" fill="#222"><text x="60" y="100">1. Choose: 2 + 2 = (    )</text><text x="70" y="160">A. 3    B. 4    C. 5    D. 6</text><text x="60" y="760">2. Find x in the triangle.</text><path d="M200 1100 L400 850 L600 1100 Z" fill="none" stroke="#222" stroke-width="4"/><text x="400" y="820">x</text></g><g font-family="Arial" font-size="38" fill="#155bd7"><text x="750" y="190">1: B</text><text x="760" y="1200">2: 60</text></g></svg>';
    const jpeg = await sharp(Buffer.from(pageSvg)).jpeg().toBuffer();
    fs.writeFileSync(path.join(directory, 'page.jpg'), jpeg);
    try {
        mock = await listen(http.createServer(async (req, res) => {
            let raw = '';
            for await (const chunk of req) raw += chunk;
            const body = JSON.parse(raw);
            active += 1; peak = Math.max(peak, active);
            try {
                if (req.url === '/v1/chat/completions') {
                    analysisCalls += 1;
                    assert.equal(req.headers.authorization, 'Bearer analysis-secret');
                    assert.equal(body.model, 'page-analysis');
                    assert.ok(Array.isArray(body.messages));
                    calls.push({ type: 'analysis', body });
                    await delay(25);
                    res.end(JSON.stringify({ choices: [{ message: { content: '按已知条件得到答案。' }, finish_reason: 'stop' }], usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 } }));
                    return;
                }
                if (req.url === '/v1beta/models/page-seg:generateContent') {
                    segmentCalls += 1;
                    assert.equal(req.headers['x-goog-api-key'], 'seg-secret');
                    assert.ok(body.contents[0].parts.some((part) => part.inlineData));
                    await delay(40);
                    const result = { regions: [
                        { label: '1', box_2d: [30, 40, 400, 960], mask: [[40, 30], [960, 30], [960, 400], [40, 400]] },
                        { label: '2', box_2d: [500, 40, 950, 960], mask: [[40, 500], [960, 500], [960, 950], [40, 950]] }
                    ] };
                    res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] }, finishReason: 'STOP' }] }));
                    return;
                }
                recognitionCalls += 1;
                assert.equal(req.url, '/v1beta/models/page-ocr:generateContent');
                assert.equal(req.headers['x-goog-api-key'], 'general-secret');
                const prompt = body.systemInstruction.parts[0].text;
                assert.ok(prompt.includes('蓝笔最终正确答案'));
                const target = JSON.parse(body.contents[0].parts.find((part) => part.text?.includes('targetLabel')).text);
                const images = body.contents[0].parts.filter((part) => part.inlineData);
                assert.equal(images.length, 2, 'One call includes the crop and full-page context');
                assert.equal(images[1].inlineData.data, jpeg.toString('base64'));
                calls.push({ type: 'entry', target: target.targetLabel, body });
                await delay(holdRecognition || 35);
                if (failRecognition) { res.statusCode = 400; res.end(JSON.stringify({ error: { message: 'unsupported test request' } })); return; }
                const illustrated = target.targetLabel === '2';
                const result = { question: illustrated ? '求图中角度。\n\n[[figure:triangle]]' : '2+2=（ ）。\n\nA.3 B.4 C.5 D.6',
                    answer: omitAnswer ? '' : illustrated ? '60°' : 'B', subjectId: 'math', primaryPath: ['函数'], auxiliaryPaths: [],
                    issues: illustrated ? [] : [{ imageIndex: 1, type: 'unclear', description: '文字疑点仅提示' }],
                    figures: illustrated ? [{ id: 'triangle', imageIndex: 1, box_2d: [100, 100, 800, 800], field: 'question', description: '三角形' }] : [] };
                res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(result) }] }, finishReason: 'STOP' }] }));
            } finally { active -= 1; }
        }));
        app = require('../server/app'); ai = require('../server/mistakes/ai');
        const { hashPassword } = require('../server/mistakes/auth');
        const password = 'PageSmoke2026!';
        for (const [username, role] of [['pageadmin', 'admin'], ['pageuser', 'user'], ['pageother', 'user']]) {
            app.db.prepare('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)').run(username, hashPassword(password), role, new Date().toISOString());
        }
        const runners = await Promise.all(['pageadmin', 'pageuser', 'pageother'].map((username) =>
            ai.runtimeForJobs(app.db.prepare('SELECT id FROM users WHERE username = ?').get(username).id)));
        assert.equal(runners[1].queue, runners[2].queue, 'Ordinary users retain their shared queue');
        let releaseQueue;
        const queueGate = new Promise((resolve) => { releaseQueue = resolve; });
        const queued = runners.slice(0, 2).map((runner) => Array.from({ length: 12 }, () => runner.queue.add(() => queueGate)));
        await delay(0);
        try {
            assert.equal(runners[0].queue.pending, 10, 'Administrators run ten tasks at once');
            assert.equal(runners[1].queue.pending, 2, 'Ordinary users still run two tasks at once');
        } finally {
            releaseQueue();
            await Promise.all(queued.flat());
        }
        server = await listen(app);
        const origin = `http://127.0.0.1:${server.address().port}`;
        const base = `${origin}/api/mistakes`;
        function client() {
            let cookie = '';
            return async (method, route, body, expected = 200) => {
                const response = await fetch(base + route, { method, headers: { Cookie: cookie, ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) },
                    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}) });
                for (const entry of response.headers.getSetCookie()) cookie = entry.split(';')[0];
                if (response.headers.get('content-type')?.startsWith('image/')) { assert.equal(response.status, expected); return Buffer.from(await response.arrayBuffer()); }
                const result = await response.json();
                assert.equal(response.status, expected, `${method} ${route}: ${JSON.stringify(result)}`);
                return result.success ? result.data : result;
            };
        }
        const admin = client(), user = client(), other = client();
        await admin('POST', '/auth/login', { username: 'pageadmin', password });
        await user('POST', '/auth/login', { username: 'pageuser', password });
        await other('POST', '/auth/login', { username: 'pageother', password });
        const endpoint = `http://127.0.0.1:${mock.address().port}`;
        await admin('PATCH', '/admin/ai/config', { enabled: true, baseUrl: `${endpoint}/v1beta`, model: 'page-ocr', apiKey: 'general-secret' });
        await admin('PATCH', '/admin/ai/config?profile=segmentation', { enabled: true, baseUrl: `${endpoint}/v1beta`, model: 'page-seg', apiKey: 'seg-secret' });
        let config = await user('GET', '/ai/config');
        assert.equal(config.analysis.enabled, false, 'New profiles start disabled');
        await admin('PATCH', '/admin/ai/config?profile=analysis', { enabled: true, baseUrl: `${endpoint}/v1`, model: 'page-analysis', apiKey: 'analysis-secret' });
        await admin('PATCH', '/admin/ai/config?profile=segmentation', { apiKey: '' });
        assert.equal(require('../server/mistakes/ai-config').readConfig().apiKey, 'general-secret');
        assert.equal(require('../server/mistakes/ai-config').readConfig('segmentation').apiKey, 'seg-secret');
        assert.equal(require('../server/mistakes/ai-config').readConfig('analysis').apiKey, 'analysis-secret');
        config = await user('GET', '/ai/config');
        assert.equal(config.analysis.configured, true); assert.equal(config.segmentation.configured, true);
        assert.equal(JSON.stringify(config).includes('secret'), false);
        await user('GET', '/admin/ai/config?profile=analysis', null, 403);
        async function upload(clientId, request = user) {
            const form = new FormData();
            form.append('file', new Blob([jpeg], { type: 'image/jpeg' }), 'exam-page.jpg');
            form.append('clientId', clientId); form.append('batchId', clientId); form.append('pageOrder', '0');
            return request('POST', '/page-imports', form, 201);
        }
        async function finished(route, request = user) {
            for (let index = 0; index < 300; index += 1) {
                const value = await request('GET', route);
                if (!['queued', 'running', 'retrying'].includes(value.status)) return value;
                await delay(40);
            }
            throw new Error(`Timed out: ${route}`);
        }
        async function prepared(pageId, request = user) {
            for (let index = 0; index < 300; index += 1) {
                const page = await request('GET', `/page-imports/${pageId}`);
                if (page.items.length && page.items.every((item) => item.jobId || item.status === 'failed')) {
                    assert.ok(page.items.every((item) => item.jobId), JSON.stringify(page.items));
                    return page;
                }
                await delay(30);
            }
            throw new Error(`Preparation timed out: ${pageId}`);
        }
        const source = await upload('first');
        let page = await finished(`/page-imports/${source.id}`);
        assert.equal(page.status, 'succeeded');
        assert.ok(page.regions.every((region) => !region.selected));
        assert.deepEqual(page.regions[0].box, [0.04, 0.03, 0.92, 0.37]);
        assert.ok(page.regions[0].mask);
        assert.equal((await upload('first')).id, page.id);
        assert.equal(segmentCalls, 1, 'Lost upload responses do not repeat segmentation');
        await other('GET', `/page-imports/${page.id}`, null, 404);
        await other('GET', `/page-imports/${page.id}/image`, null, 404);
        const regions = page.regions.map((region) => ({ id: region.id, label: region.label, box: region.box, selected: true }));
        await user('PATCH', `/page-imports/${page.id}`, { regions });
        const before = recognitionCalls;
        page = await user('POST', `/page-imports/${page.id}/import`, { regions });
        const repeated = await user('POST', `/page-imports/${page.id}/import`, { regions });
        assert.deepEqual(repeated.items.map((item) => item.mistakeId), page.items.map((item) => item.mistakeId));
        page = await prepared(page.id);
        const jobs = await Promise.all(page.items.map((item) => finished(`/ai/jobs/${item.jobId}`)));
        assert.equal(recognitionCalls - before, 2, 'Each selected question makes one general Gemini call');
        assert.ok(jobs.every((job) => job.mode === 'page-entry'));
        const ordinary = jobs.find((job) => !job.result.figures.length), illustrated = jobs.find((job) => job.result.figures.length);
        assert.equal(ordinary.applyStatus, 'applied', 'Text issues never block filling a page-entry draft');
        assert.equal((await user('GET', `/mistakes/${ordinary.mistakeId}`)).answer, 'B');
        assert.equal(illustrated.applyStatus, 'pending');
        await user('POST', `/ai/jobs/${illustrated.id}/apply`, {}, 409);
        let analyses = (await user('GET', '/ai/jobs')).filter((job) => job.type === 'analysis');
        assert.equal(analyses.length, 1, 'Only confirmed text entries generate analysis');
        await finished(`/ai/jobs/${analyses[0].id}`);
        const form = new FormData();
        form.append('original', new Blob([jpeg], { type: 'image/jpeg' }), 'figure.jpg');
        form.append('crop', new Blob([jpeg], { type: 'image/jpeg' }), 'figure.jpg');
        form.append('purpose', 'question'); form.append('clientId', 'confirmed-figure'); form.append('sourceImageId', String(illustrated.imageIds[0]));
        const figure = await user('POST', `/mistakes/${illustrated.mistakeId}/images`, form, 201);
        const applied = await user('POST', `/ai/jobs/${illustrated.id}/apply`, { review: { question: `求图中角度。\n\n![三角形](${figure.cropUrl})`, answer: '60°', subjectId: 'math' } });
        assert.equal(applied.mistake.answer, '60°');
        analyses = (await user('GET', '/ai/jobs')).filter((job) => job.type === 'analysis');
        await Promise.all(analyses.map((job) => finished(`/ai/jobs/${job.id}`)));
        assert.equal(analyses.length, 2);
        assert.ok(calls.filter((call) => call.type === 'analysis').some((call) => JSON.stringify(call.body).includes('image_url')));
        const normalPeak = peak;
        assert.ok(normalPeak <= 2, `Shared queue concurrency was ${normalPeak}`);
        // Editing an answer while OCR runs preserves both fields and the original result.
        holdRecognition = 200;
        const conflictPage = await finished(`/page-imports/${(await upload('conflict')).id}`);
        const conflictRegions = conflictPage.regions.map((region, index) => ({ ...region, selected: index === 0 }));
        await user('POST', `/page-imports/${conflictPage.id}/import`, { regions: conflictRegions });
        const conflictImport = await prepared(conflictPage.id);
        const conflictItem = conflictImport.items[0];
        await user('PATCH', `/mistakes/${conflictItem.mistakeId}`, { answer: '人工输入' });
        assert.equal((await finished(`/ai/jobs/${conflictItem.jobId}`)).applyStatus, 'conflict');
        assert.equal((await user('GET', `/mistakes/${conflictItem.mistakeId}`)).answer, '人工输入');
        const conflictDraft = await user('GET', `/mistakes/${conflictItem.mistakeId}`);
        const expectedInput = { question: conflictDraft.question, answer: conflictDraft.answer, analysis: conflictDraft.analysis,
            subjectId: conflictDraft.subjectId, primaryKnowledgePointId: conflictDraft.primaryKnowledgePointId, auxiliaryKnowledgePointIds: conflictDraft.auxiliaryKnowledgePointIds };
        await user('POST', `/ai/jobs/${conflictItem.jobId}/apply`, { review: { question: '识别题干', answer: 'B' }, expectedInput }, 409);
        holdRecognition = 0;
        // Failure + retry and restart reuse the same draft, job and source crop.
        failRecognition = true;
        const retryPage = await finished(`/page-imports/${(await upload('retry')).id}`);
        const retryRegions = retryPage.regions.map((region, index) => ({ ...region, selected: index === 0 }));
        await user('POST', `/page-imports/${retryPage.id}/import`, { regions: retryRegions });
        const retryImport = await prepared(retryPage.id);
        const retryItem = retryImport.items[0];
        assert.equal((await finished(`/ai/jobs/${retryItem.jobId}`)).status, 'failed');
        failRecognition = false;
        await user('POST', `/ai/jobs/${retryItem.jobId}/retry`, {});
        assert.equal((await finished(`/ai/jobs/${retryItem.jobId}`)).applyStatus, 'applied');
        assert.equal((await user('POST', `/page-imports/${retryPage.id}/import`, { regions: retryRegions })).items[0].mistakeId, retryItem.mistakeId);
        await ai.stopJobs();
        const recoveryPage = await upload('recovery');
        app.db.prepare("UPDATE page_imports SET status = 'running', attempts = 1 WHERE id = ?").run(recoveryPage.id);
        ai.recoverJobs();
        const recovered = await finished(`/page-imports/${recoveryPage.id}`);
        assert.equal(recovered.attempts, 2, 'Restart retains consumed segmentation attempts');
        omitAnswer = true;
        await ai.stopJobs();
        const pending = await user('POST', `/page-imports/${recovered.id}/import`, { regions: recovered.regions.map((region, index) => ({ ...region, selected: index === 0 })) });
        assert.equal(pending.items[0].status, 'preparing'); assert.equal(pending.items[0].jobId, null);
        ai.recoverJobs();
        const missing = await prepared(recovered.id);
        assert.equal(missing.items[0].mistakeId, pending.items[0].mistakeId, 'Restart resumes confirmed image preparation without another draft');
        const missingJob = await finished(`/ai/jobs/${missing.items[0].jobId}`);
        assert.equal(missingJob.applyStatus, 'applied'); assert.equal(missingJob.result.answer, '');
        assert.ok(missingJob.result.issues.some((issue) => issue.type === 'answer_missing'));
        assert.equal((await user('GET', '/ai/jobs')).some((job) => job.type === 'analysis' && job.mistakeId === missingJob.mistakeId), false);
        omitAnswer = false;
        // A failed crop remains independently retryable without creating another draft.
        const preparationPage = await finished(`/page-imports/${(await upload('preparation-retry')).id}`);
        await ai.stopJobs();
        const paused = await user('POST', `/page-imports/${preparationPage.id}/import`, { regions: preparationPage.regions.map((region, index) => ({ ...region, selected: index === 0 })) });
        const pageFile = path.join(process.env.MISTAKES_UPLOADS_PATH, app.db.prepare('SELECT image_path FROM page_imports WHERE id = ?').get(preparationPage.id).image_path);
        fs.renameSync(pageFile, `${pageFile}.held`);
        ai.recoverJobs();
        for (let index = 0; index < 100; index += 1) {
            const failed = await user('GET', `/page-imports/${preparationPage.id}`);
            if (failed.items[0].status === 'failed') break;
            await delay(30);
        }
        assert.equal((await user('GET', `/page-imports/${preparationPage.id}`)).items[0].status, 'failed');
        fs.renameSync(`${pageFile}.held`, pageFile);
        await user('POST', `/page-imports/${preparationPage.id}/items/${paused.items[0].regionId}/retry`, {});
        const preparedAgain = await prepared(preparationPage.id);
        assert.equal(preparedAgain.items[0].mistakeId, paused.items[0].mistakeId);
        assert.equal((await finished(`/ai/jobs/${preparedAgain.items[0].jobId}`)).applyStatus, 'applied');
        // Remove the page from import history; shared source remains until its last draft is removed.
        const sourcePath = app.db.prepare('SELECT image_path FROM page_imports WHERE id = ?').get(page.id).image_path;
        await user('DELETE', `/page-imports/${page.id}`);
        assert.ok(fs.existsSync(path.join(process.env.MISTAKES_UPLOADS_PATH, sourcePath)));
        for (const [index, item] of page.items.entries()) {
            await user('DELETE', `/mistakes/${item.mistakeId}`);
            await user('DELETE', `/mistakes/${item.mistakeId}/permanent`);
            assert.equal(fs.existsSync(path.join(process.env.MISTAKES_UPLOADS_PATH, sourcePath)), index !== page.items.length - 1);
        }
        console.log(`Page import smoke passed: profiles, segmentation, per-question OCR, review, analysis, conflicts, retries, recovery, cleanup. Normal queue peak ${normalPeak}.`);
        if (process.argv.includes('--preview')) {
            // Leave one ready source page and one queued selection available for browser QA.
            const preview = await finished(`/page-imports/${(await upload('preview', admin)).id}`, admin);
            console.log(`Preview: ${origin}/mistakes/#/page-imports | pageadmin / ${password} | fixture ${path.join(directory, 'page.jpg')} | page ${preview.id}`);
            await new Promise(() => {});
        }
    } finally {
        if (ai) await ai.stopJobs();
        await close(server); await close(mock);
        if (app) app.db.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

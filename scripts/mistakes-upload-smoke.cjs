const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const { File } = require('node:buffer');

const input = { question: '题干', answer: '', analysis: '', subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [] };
const photo = (clientId) => ({ clientId, originalName: `${clientId}.jpg`, original: new File(['original'], `${clientId}.jpg`, { type: 'image/jpeg' }), crop: new File(['crop'], 'crop.jpg', { type: 'image/jpeg' }) });
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => ({ success: status >= 200 && status < 300, data, message: '模拟上传失败' }) });
const disconnectedResponse = () => ({ ...response(null, 201), json: async () => { throw new TypeError('响应读取期间连接断开'); } });
const tick = () => new Promise((resolve) => setImmediate(resolve));

async function queueRuntime() {
    let fetchHandler;
    let expireRequests = false;
    const timers = new Set();
    const retryDelays = [];
    const context = vm.createContext({
        AbortController, FormData, File, Event, Error, TypeError,
        crypto: { randomUUID },
        window: { dispatchEvent() {} },
        fetch: (...args) => fetchHandler(...args),
        setTimeout(callback, delay) {
            const retry = [1000, 2000, 4000].includes(delay);
            if (retry) retryDelays.push(delay);
            const requestTimeout = expireRequests && [30000, 90000].includes(delay);
            const timer = setTimeout(() => { timers.delete(timer); callback(); }, retry || requestTimeout ? 0 : delay);
            timers.add(timer);
            return timer;
        },
        clearTimeout(timer) { clearTimeout(timer); timers.delete(timer); },
    });
    // Use the frontend's existing bundler; TypeScript 7 no longer ships transpileModule.
    const { rolldown } = await import('rolldown');
    const source = path.join(__dirname, '..', 'client', 'mistakes', 'src').replaceAll('\\', '/');
    const bundle = await rolldown({
        input: 'upload-smoke-entry',
        plugins: [{
            name: 'upload-smoke-entry',
            resolveId(id) { if (id === 'upload-smoke-entry') return '\0upload-smoke-entry'; },
            load(id) {
                if (id === '\0upload-smoke-entry') return `export { PhotoUploadQueue } from ${JSON.stringify(`${source}/photo-upload-queue.ts`)}; export { getActiveApiRequestCount } from ${JSON.stringify(`${source}/api.ts`)};`;
            },
        }],
    });
    let code;
    try { code = (await bundle.generate({ format: 'cjs' })).output[0].code; }
    finally { await bundle.close(); }
    const exported = { exports: {} };
    new vm.Script(`(function (module, exports) { ${code}\n})`, { filename: 'upload-smoke-bundle.cjs' }).runInContext(context)(exported, exported.exports);
    return {
        PhotoUploadQueue: exported.exports.PhotoUploadQueue,
        api: exported.exports,
        timers,
        retryDelays,
        mock(handler) { fetchHandler = handler; },
        expireRequests(enabled) { expireRequests = enabled; },
    };
}

function waitFor(queue, condition) {
    if (condition(queue.getSnapshot())) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => { unsubscribe(); reject(new Error('后台上传状态等待超时')); }, 3000);
        const unsubscribe = queue.subscribe(() => {
            if (!condition(queue.getSnapshot())) return;
            clearTimeout(timeout);
            unsubscribe();
            resolve();
        });
    });
}

async function run() {
    const runtime = await queueRuntime();
    const queue = new runtime.PhotoUploadQueue();
    try {
        const uploads = [];
        const jobs = [];
        let releaseFirst;
        const firstUpload = new Promise((resolve) => { releaseFirst = resolve; });
        runtime.mock(async (url, options) => {
            if (url.endsWith('/images')) {
                const clientId = options.body.get('clientId');
                uploads.push(clientId);
                if (uploads.length === 1) { await firstUpload; return response(null, 503); }
                return response({ id: clientId === 'first' ? 101 : 102 });
            }
            assert.equal(url, '/api/mistakes/ai/jobs');
            jobs.push(JSON.parse(options.body));
            return response({ id: jobs.length });
        });

        const questionRequest = { mistakeId: 1, purpose: 'question', input, files: [photo('first'), photo('second')], recognize: true, recognitionPrompt: '  只包含第 2 问  ' };
        const batchId = queue.enqueue(questionRequest);
        questionRequest.recognitionPrompt = '后续编辑的题目提示词';
        assert.equal(queue.getSnapshot(), queue.getSnapshot(), 'Snapshot stays stable between updates');
        assert.equal(runtime.api.getActiveApiRequestCount(), 0, 'Uploads do not block foreground requests');
        assert.equal(queue.reuse(batchId, input, '  只识别第 2 问的蓝色答案  '), true);
        assert.equal(queue.reuse(batchId, input, '不应替换原提示词'), false, 'Repeated reuse is deduplicated');
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'waiting', 'Reuse is recorded before uploads finish');
        assert.deepEqual(jobs, []);
        releaseFirst();
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.deepEqual(uploads, ['first', 'first', 'second'], 'Retry preserves the image client ID and upload order');
        assert.deepEqual([...queue.getSnapshot()[0].imageIds], [101, 102]);
        assert.deepEqual(jobs.map((job) => job.type), ['question', 'answer']);
        assert.deepEqual(jobs.map((job) => job.recognitionPrompt), ['只包含第 2 问', '只识别第 2 问的蓝色答案'], 'Question and answer reuse keep independent, trimmed prompt snapshots');
        assert.ok(jobs.every((job) => job.clientId && job.imageIds.join(',') === '101,102'));
        assert.notEqual(jobs[0].clientId, jobs[1].clientId);
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'submitted');

        const resumedUploads = [];
        const resumedSignals = [];
        const resumedJobs = [];
        let allowResume = false;
        runtime.expireRequests(true);
        runtime.mock(async (url, options) => {
            if (url.endsWith('/images')) {
                const clientId = options.body.get('clientId');
                resumedUploads.push(clientId);
                assert.equal(options.signal.aborted, false, 'Each upload starts with a usable request signal');
                if (clientId === 'remaining') resumedSignals.push(options.signal);
                if (clientId === 'remaining' && !allowResume) return new Promise((_resolve, reject) => {
                    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
                });
                return response({ id: clientId === 'saved' ? 201 : 202 });
            }
            resumedJobs.push(JSON.parse(options.body));
            return response({ id: 3 });
        });
        const resumeRequest = { mistakeId: 2, purpose: 'question', input, files: [photo('saved'), photo('remaining')], recognize: true, recognitionPrompt: '  只包含第 3 问  ' };
        const resumeId = queue.enqueue(resumeRequest);
        resumeRequest.recognitionPrompt = '重试前修改的提示词';
        assert.equal(queue.getSnapshot()[0].id, resumeId, 'Newest batch is listed first');
        assert.equal(queue.reuse(resumeId, input), true);
        await waitFor(queue, (batches) => batches[0].status === 'failed');
        assert.deepEqual(resumedUploads, ['saved', 'remaining', 'remaining', 'remaining', 'remaining']);
        assert.deepEqual([...queue.getSnapshot()[0].imageIds], [201]);
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'waiting', 'Failed uploads keep the answer reuse intent');
        assert.deepEqual(runtime.retryDelays, [1000, 1000, 2000, 4000]);
        assert.equal(resumedSignals.length, 4, 'Request timeouts exhaust the automatic retry budget');
        assert.ok(resumedSignals.every((signal) => signal.aborted), 'Timed out requests are aborted');
        allowResume = true;
        queue.retry(resumeId);
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.deepEqual(resumedUploads, ['saved', 'remaining', 'remaining', 'remaining', 'remaining', 'remaining'], 'Manual retry only uploads the unfinished image');
        assert.deepEqual(resumedJobs.map((job) => job.type), ['question', 'answer']);
        assert.deepEqual(resumedJobs.map((job) => job.recognitionPrompt), ['只包含第 3 问', undefined], 'Manual upload retry keeps the captured prompt without inheriting it for answer reuse');
        assert.ok(resumedJobs.every((job) => job.imageIds.join(',') === '201,202'));
        assert.equal(new Set(resumedSignals).size, 5, 'Automatic and manual retries each get a fresh request signal');
        assert.equal(resumedSignals.at(-1).aborted, false, 'Manual retry succeeds without reusing an aborted signal');
        runtime.expireRequests(false);

        const interruptedUploads = [];
        runtime.mock(async (url, options) => {
            assert.ok(url.endsWith('/images'));
            interruptedUploads.push(options.body.get('clientId'));
            return interruptedUploads.length === 1 ? disconnectedResponse() : response({ id: 301 }, 201);
        });
        queue.enqueue({ mistakeId: 3, purpose: 'question', input, files: [photo('body-disconnected')], recognize: false });
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.deepEqual(interruptedUploads, ['body-disconnected', 'body-disconnected'], 'A lost response body retries the same accepted image request');
        assert.deepEqual([...queue.getSnapshot()[0].imageIds], [301]);

        const interruptedJobs = [];
        let recognitionUploads = 0;
        runtime.mock(async (url, options) => {
            if (url.endsWith('/images')) {
                recognitionUploads += 1;
                return response({ id: 401 }, 201);
            }
            assert.equal(url, '/api/mistakes/ai/jobs');
            interruptedJobs.push(JSON.parse(options.body));
            return interruptedJobs.length === 1 ? disconnectedResponse() : response({ id: 501 }, 201);
        });
        queue.enqueue({ mistakeId: 4, purpose: 'answer', input, files: [photo('recognition-body-disconnected')], recognize: true, recognitionPrompt: '  只包含第 4 问的答案  ' });
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.equal(recognitionUploads, 1, 'Retrying an accepted recognition request does not reupload its image');
        assert.equal(interruptedJobs.length, 2);
        assert.deepEqual(interruptedJobs[0], interruptedJobs[1], 'A lost AI response retries the identical submission and client ID');
        assert.equal(interruptedJobs[0].recognitionPrompt, '只包含第 4 问的答案', 'Automatic recognition retry preserves the trimmed prompt');
        assert.ok(interruptedJobs[0].clientId);

        let aborted = false;
        runtime.mock((_url, options) => new Promise((_resolve, reject) => {
            options.signal.addEventListener('abort', () => { aborted = true; reject(options.signal.reason); }, { once: true });
        }));
        queue.enqueue({ mistakeId: 5, purpose: 'answer', input, files: [photo('cancelled')], recognize: false });
        queue.dispose();
        await tick();
        assert.equal(aborted, true, 'Dispose aborts the active upload');
        assert.equal(queue.getSnapshot().length, 0);
        assert.equal(runtime.timers.size, 0, 'Dispose clears request and retry timers');
        console.log('Photo upload smoke passed: background reuse, connection recovery, timeout resume, idempotent submissions, and disposal.');
    } finally {
        queue.dispose();
        for (const timer of runtime.timers) clearTimeout(timer);
    }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

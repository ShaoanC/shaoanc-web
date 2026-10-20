const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const { File } = require('node:buffer');

const input = { question: '题干', answer: '', analysis: '', subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [] };
const photo = (clientId) => ({ clientId, originalName: `${clientId}.jpg`, original: new File(['original'], `${clientId}.jpg`, { type: 'image/jpeg' }), crop: new File(['crop'], 'crop.jpg', { type: 'image/jpeg' }) });
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => ({ success: status === 200, data, message: '模拟上传失败' }) });
const tick = () => new Promise((resolve) => setImmediate(resolve));

async function queueRuntime() {
    let fetchHandler;
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
            const timer = setTimeout(() => { timers.delete(timer); callback(); }, retry ? 0 : delay);
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

        const batchId = queue.enqueue({ mistakeId: 1, purpose: 'question', input, files: [photo('first'), photo('second')], recognize: true });
        assert.equal(queue.getSnapshot(), queue.getSnapshot(), 'Snapshot stays stable between updates');
        assert.equal(runtime.api.getActiveApiRequestCount(), 0, 'Uploads do not block foreground requests');
        assert.equal(queue.reuse(batchId, input), true);
        assert.equal(queue.reuse(batchId, input), false, 'Repeated reuse is deduplicated');
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'waiting', 'Reuse is recorded before uploads finish');
        assert.deepEqual(jobs, []);
        releaseFirst();
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.deepEqual(uploads, ['first', 'first', 'second'], 'Retry preserves the image client ID and upload order');
        assert.deepEqual([...queue.getSnapshot()[0].imageIds], [101, 102]);
        assert.deepEqual(jobs.map((job) => job.type), ['question', 'answer']);
        assert.ok(jobs.every((job) => job.clientId && job.imageIds.join(',') === '101,102'));
        assert.notEqual(jobs[0].clientId, jobs[1].clientId);
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'submitted');

        const resumedUploads = [];
        const resumedJobs = [];
        let allowResume = false;
        runtime.mock(async (url, options) => {
            if (url.endsWith('/images')) {
                const clientId = options.body.get('clientId');
                resumedUploads.push(clientId);
                if (clientId === 'remaining' && !allowResume) return response(null, 503);
                return response({ id: clientId === 'saved' ? 201 : 202 });
            }
            resumedJobs.push(JSON.parse(options.body));
            return response({ id: 3 });
        });
        const resumeId = queue.enqueue({ mistakeId: 2, purpose: 'question', input, files: [photo('saved'), photo('remaining')], recognize: true });
        assert.equal(queue.getSnapshot()[0].id, resumeId, 'Newest batch is listed first');
        assert.equal(queue.reuse(resumeId, input), true);
        await waitFor(queue, (batches) => batches[0].status === 'failed');
        assert.deepEqual(resumedUploads, ['saved', 'remaining', 'remaining', 'remaining', 'remaining']);
        assert.deepEqual([...queue.getSnapshot()[0].imageIds], [201]);
        assert.equal(queue.getSnapshot()[0].reuseStatus, 'waiting', 'Failed uploads keep the answer reuse intent');
        assert.deepEqual(runtime.retryDelays, [1000, 1000, 2000, 4000]);
        allowResume = true;
        queue.retry(resumeId);
        await waitFor(queue, (batches) => batches[0].status === 'completed');
        assert.deepEqual(resumedUploads, ['saved', 'remaining', 'remaining', 'remaining', 'remaining', 'remaining'], 'Manual retry only uploads the unfinished image');
        assert.deepEqual(resumedJobs.map((job) => job.type), ['question', 'answer']);
        assert.ok(resumedJobs.every((job) => job.imageIds.join(',') === '201,202'));

        let aborted = false;
        runtime.mock((_url, options) => new Promise((_resolve, reject) => {
            options.signal.addEventListener('abort', () => { aborted = true; reject(options.signal.reason); }, { once: true });
        }));
        queue.enqueue({ mistakeId: 3, purpose: 'answer', input, files: [photo('cancelled')], recognize: false });
        queue.dispose();
        await tick();
        assert.equal(aborted, true, 'Dispose aborts the active upload');
        assert.equal(queue.getSnapshot().length, 0);
        assert.equal(runtime.timers.size, 0, 'Dispose clears request and retry timers');
        console.log('Photo upload smoke passed: background reuse, ordered retries, resume, and disposal.');
    } finally {
        queue.dispose();
        for (const timer of runtime.timers) clearTimeout(timer);
    }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

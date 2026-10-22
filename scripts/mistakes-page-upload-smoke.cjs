const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const { File } = require('node:buffer');

async function run() {
    const { rolldown } = await import('rolldown');
    const source = path.join(__dirname, '..', 'client', 'mistakes', 'src').replaceAll('\\', '/');
    const bundle = await rolldown({ input: 'page-upload-smoke-entry', plugins: [{
        name: 'page-upload-smoke-entry',
        resolveId(id) { if (id === 'page-upload-smoke-entry') return '\0page-upload-smoke-entry'; },
        load(id) {
            if (id === '\0page-upload-smoke-entry') return `export * from ${JSON.stringify(`${source}/page-upload.ts`)}; export * from ${JSON.stringify(`${source}/latest-request.ts`)};`;
        },
    }] });
    let code;
    try { code = (await bundle.generate({ format: 'cjs' })).output[0].code; }
    finally { await bundle.close(); }
    const context = vm.createContext({ File, FormData, AbortController, crypto: { randomUUID } });
    const exported = { exports: {} };
    new vm.Script(`(function(module, exports) { ${code}\n})`).runInContext(context)(exported, exported.exports);
    const { assignPageUploadBatch, uploadPageBatch, LatestRequest } = exported.exports;
    const entry = (id) => ({ id, file: new File(['photo'], `${id}.jpg`, { type: 'image/jpeg' }), url: `blob:${id}`, error: '' });
    const first = assignPageUploadBatch(Array.from({ length: 12 }, (_, index) => entry(`first-${index}`)));
    assert.deepEqual(Array.from(first, (page) => page.pageOrder), Array.from({ length: 12 }, (_, index) => index));
    const failed = [];
    const requests = [];
    const options = {
        signal: new AbortController().signal,
        prepare: async (file) => file,
        onProgress() {}, onSuccess() {},
        onError(page) { failed.push(page); },
        async send(body, signal) {
            requests.push({ id: body.get('clientId'), batchId: body.get('batchId'), pageOrder: Number(body.get('pageOrder')) });
            assert.equal(signal, this.signal);
            if (body.get('clientId') === 'first-11') throw new TypeError('response lost');
            return {};
        },
    };
    assert.equal(await uploadPageBatch(first, options), 11);
    assert.equal(failed.length, 1);
    const next = assignPageUploadBatch([...failed, ...Array.from({ length: 11 }, (_, index) => entry(`new-${index}`))]);
    assert.equal(next[0].batchId, first[11].batchId, 'A failed upload keeps its original batch identity');
    assert.equal(next[0].id, first[11].id, 'A retry keeps the original idempotency key after response loss');
    assert.equal(next[0].pageOrder, 11, 'A retry retains its original position');
    assert.notEqual(next[1].batchId, first[0].batchId, 'New pages do not fill an already partly uploaded batch');
    assert.deepEqual(Array.from(next.slice(1), (page) => page.pageOrder), Array.from({ length: 11 }, (_, index) => index));
    const retryRequests = [];
    assert.equal(await uploadPageBatch(next, { ...options, async send(body) {
        retryRequests.push({ id: body.get('clientId'), batchId: body.get('batchId'), pageOrder: Number(body.get('pageOrder')) });
        return {};
    } }), 12);
    assert.deepEqual(retryRequests[0], requests[11], 'Retry requests reuse the exact original upload identity');

    const compressionAbort = new AbortController();
    let finishCompression;
    const compressed = new Promise((resolve) => { finishCompression = resolve; });
    let sends = 0;
    const cancelled = uploadPageBatch(first, { ...options, signal: compressionAbort.signal,
        prepare: () => compressed,
        async send() { sends += 1; return {}; },
    });
    compressionAbort.abort();
    finishCompression(first[0].file);
    await assert.rejects(cancelled, { name: 'AbortError' });
    assert.equal(sends, 0, 'Leaving the page or logging out during compression prevents any later request');

    const requestAbort = new AbortController();
    let prepared = 0;
    const active = uploadPageBatch(first, { ...options, signal: requestAbort.signal,
        async prepare(file) { prepared += 1; return file; },
        send(body, signal) {
            sends += 1;
            return new Promise((resolve, reject) => {
                signal.addEventListener('abort', () => reject(signal.reason), { once: true });
                requestAbort.abort();
            });
        },
    });
    await assert.rejects(active, { name: 'AbortError' });
    assert.equal(sends, 1);
    assert.equal(prepared, 1, 'Cancelling an active upload also prevents later pages from starting');

    const latest = new LatestRequest();
    const state = { data: '', error: '', loading: false };
    const pending = [];
    const load = () => latest.run((signal) => new Promise((resolve, reject) => pending.push({ signal, resolve, reject })), {
        start() { state.loading = true; state.error = ''; },
        success(data) { state.data = data; },
        error(error) { state.error = error.message; },
        finish() { state.loading = false; },
    });
    const old = load();
    const fresh = load();
    assert.equal(pending[0].signal.aborted, true, 'A new filter aborts the previous request');
    pending[0].resolve('old filter'); await old;
    assert.equal(state.data, '');
    assert.equal(state.loading, true, 'The old request cannot stop the latest loading indicator');
    pending[1].resolve('latest filter'); await fresh;
    assert.deepEqual(state, { data: 'latest filter', error: '', loading: false });
    const oldError = load();
    const newest = load();
    pending[3].resolve('newest filter'); await newest;
    pending[2].reject(new Error('stale network error')); await oldError;
    assert.deepEqual(state, { data: 'newest filter', error: '', loading: false }, 'A late error cannot replace a successful newer result');
    const leaving = load();
    latest.cancel();
    assert.equal(pending[4].signal.aborted, true);
    pending[4].resolve('after unmount'); await leaving;
    assert.equal(state.data, 'newest filter', 'Unmounted requests cannot update the review selection');
    console.log('Page upload/review request smoke passed: stable retry batches, upload cancellation, stale response/error/loading isolation.');
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

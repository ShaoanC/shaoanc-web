const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { File } = require('node:buffer');

async function compressionRuntime() {
    let compress;
    let timerId = 0;
    const timers = new Map();
    const context = vm.createContext({
        AbortController, Error,
        compressMock: (...args) => compress(...args),
        setTimeout(callback, delay) {
            assert.equal(delay, 30_000, 'Worker compression has a 30 second deadline');
            timers.set(++timerId, callback);
            return timerId;
        },
        clearTimeout(id) { timers.delete(id); },
    });
    const { rolldown } = await import('rolldown');
    const bundle = await rolldown({
        input: path.join(__dirname, '..', 'client', 'mistakes', 'src', 'photo-compression.ts'),
        plugins: [{
            name: 'photo-preparation-mocks',
            resolveId(id) {
                if (id === 'browser-image-compression') return '\0compression-mock';
                if (id.endsWith('browser-image-compression.js?url')) return '\0compression-worker-url';
            },
            load(id) {
                if (id === '\0compression-mock') return 'export default (...args) => globalThis.compressMock(...args);';
                if (id === '\0compression-worker-url') return 'export default "/mistakes/assets/compression-worker.js";';
            },
        }],
    });
    let code;
    try { code = (await bundle.generate({ format: 'cjs' })).output[0].code; }
    finally { await bundle.close(); }
    const exported = { exports: {} };
    new vm.Script(`(function (module, exports) { ${code}\n})`, { filename: 'photo-preparation-smoke-bundle.cjs' }).runInContext(context)(exported, exported.exports);
    return {
        compressJpeg: exported.exports.compressJpeg,
        mock(handler) { compress = handler; },
        expire() {
            assert.equal(timers.size, 1);
            const [id, callback] = timers.entries().next().value;
            timers.delete(id);
            callback();
        },
        timers,
    };
}

async function run() {
    const runtime = await compressionRuntime();
    const original = new File(['original'], 'photo.jpg', { type: 'image/jpeg' });
    const compressed = new File(['compressed'], 'photo.jpg', { type: 'image/jpeg' });
    const calls = [];

    runtime.mock(async (file, options) => {
        calls.push(options);
        assert.equal(file, original);
        return compressed;
    });
    assert.equal(await runtime.compressJpeg(original), compressed);
    assert.equal(calls.length, 1, 'Successful worker compression needs no extra attempt');
    assert.equal(calls[0].useWebWorker, true);
    assert.equal(calls[0].maxSizeMB, 1.5);
    assert.equal(calls[0].maxWidthOrHeight, 2560);
    assert.equal(calls[0].fileType, 'image/jpeg');
    assert.equal(calls[0].initialQuality, .88);
    assert.equal(runtime.timers.size, 0, 'Successful compression clears the deadline');

    calls.length = 0;
    runtime.mock((file, options) => {
        calls.push(options);
        if (!options.useWebWorker) return Promise.resolve(compressed);
        return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }));
    });
    const stalled = runtime.compressJpeg(original);
    runtime.expire();
    assert.equal(await stalled, compressed, 'A stalled worker falls back and successfully compresses the same image');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].signal.aborted, true, 'The stalled worker receives an abort');
    assert.equal(calls[1].useWebWorker, false);
    assert.equal('signal' in calls[1], false, 'Main thread compression does not inherit the aborted signal');
    assert.equal(runtime.timers.size, 0);

    calls.length = 0;
    const failure = new Error('图片无法压缩');
    runtime.mock(async (file, options) => { calls.push(options); throw failure; });
    await assert.rejects(runtime.compressJpeg(original), (error) => error === failure);
    assert.equal(calls.length, 1, 'Ordinary library failures are not redundantly retried');
    assert.equal(runtime.timers.size, 0, 'Failed compression clears the deadline');
    console.log('Photo preparation smoke checks passed.');
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

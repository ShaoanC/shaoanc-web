const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');

async function loadDraftTools() {
    const { rolldown } = await import('rolldown');
    const bundle = await rolldown({ input: path.join(__dirname, '../client/mistakes/src/editor-draft.ts') });
    try {
        const code = (await bundle.generate({ format: 'cjs' })).output[0].code;
        const module = { exports: {} };
        new vm.Script(`(function(module, exports) { ${code}\n})`).runInThisContext()(module, module.exports);
        return module.exports;
    } finally { await bundle.close(); }
}

function memoryStorage() {
    const values = new Map();
    return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

function editorRuntime(tools, saved, storage = memoryStorage(), creationInput) {
    const source = fs.readFileSync(path.join(__dirname, '../client/mistakes/src/pages/EditorPage.tsx'), 'utf8');
    const start = source.indexOf('  async function persist(');
    const end = source.indexOf('  async function recognize(', start);
    const context = {
        ...tools,
        data: { ...tools.emptyEditorForm, subjectId: 'math', question: '原题', lifecycle: 'draft' },
        pendingSave: { current: null }, mounted: { current: true }, leaving: { current: false },
        recordRef: { current: saved?.id }, baseline: { current: saved }, creationInput: { current: creationInput }, clientId: { current: 'same-draft-id' },
        saving: null, applying: null, resolvingConflict: false, pendingPhotos: { current: { question: false, answer: false } },
        window: { localStorage: storage, history: { replaceState() {} } }, user: { id: 1 },
        AbortController, setTimeout, clearTimeout,
        json: (body, method) => ({ method, body }),
        setAnalysisNotice() {}, setRecordId() {}, onCreated() {}, setSaving() {}, setError() {}, setTab() {}, setSaveOpen() {},
        notify() {}, refresh: async () => {}, setDraftNotice(message) { context.notice = message; },
        setSaveConflict(value) { context.saveConflict = value; }, setResolvingConflict(value) { context.resolvingConflict = value; },
        ApiError: class extends Error { constructor(message, status) { super(message); this.status = status; } },
        navigate(url) { context.destination = url; },
    };
    context.same = tools.sameEditorValue;
    context.dataRef = { current: context.data };
    context.syncDraft = () => tools.writeEditorDraft(storage, 1, context.recordRef.current, {
        version: 1, clientId: context.clientId.current, data: tools.editorForm(context.dataRef.current),
        baseline: context.baseline.current ? tools.editorForm(context.baseline.current) : null,
        creationInput: context.creationInput.current, updatedAt: Date.now(),
    });
    context.update = (patch) => { context.dataRef.current = { ...context.dataRef.current, ...patch }; context.syncDraft(); };
    vm.runInNewContext(stripTypeScriptTypes(source.slice(start, end)) + '\nglobalThis.saveEditor = save; globalThis.resolveEditor = resolveSaveConflict;', context);
    return context;
}

async function run() {
    const tools = await loadDraftTools();
    const initial = { ...tools.emptyEditorForm, id: 7, subjectId: 'math', question: '原题', note: '旧笔记', lifecycle: 'draft' };

    // Exercise the actual save functions with a response held while the user continues typing.
    const existing = editorRuntime(tools, initial);
    existing.dataRef.current = tools.editorForm(initial);
    let finishSave;
    existing.api = async (_url, options) => {
        assert.deepEqual(JSON.parse(JSON.stringify(options.body.expectedFields)), { lifecycle: 'draft' });
        return new Promise((resolve) => { finishSave = resolve; });
    };
    const saving = existing.saveEditor('archived');
    existing.update({ note: '请求发出后补写的笔记' });
    finishSave({ ...initial, lifecycle: 'archived' });
    await saving;
    assert.equal(existing.dataRef.current.note, '请求发出后补写的笔记');
    assert.equal(existing.destination, undefined, 'New edits must keep the editor open');
    assert.match(existing.notice, /再次保存/);
    assert.equal(tools.readEditorDraft(existing.window.localStorage, 1, 7).data.note, '请求发出后补写的笔记');

    existing.api = async (_url, options) => {
        assert.deepEqual(JSON.parse(JSON.stringify(options.body.expectedFields)), { note: '旧笔记' });
        return { ...initial, lifecycle: 'archived', note: options.body.note };
    };
    await existing.saveEditor('archived');
    assert.equal(existing.destination, '/mistakes/7');
    assert.equal(tools.readEditorDraft(existing.window.localStorage, 1, 7), null, 'A fully saved editor removes its local draft');

    // A POST that reached the server but lost its response must reuse its ID without discarding later edits.
    const storage = memoryStorage();
    const first = editorRuntime(tools, null, storage);
    first.api = async (_url, options) => {
        assert.equal(options.body.clientId, 'same-draft-id');
        throw new TypeError('response lost');
    };
    await first.saveEditor('draft');
    first.update({ question: '断线后继续修改的题干' });
    const local = tools.readEditorDraft(storage, 1);
    assert.equal(local.clientId, 'same-draft-id');
    assert.equal(local.creationInput.question, '原题');
    assert.equal(tools.readEditorDraft(storage, 2), null, 'Accounts must not share drafts');
    const retry = editorRuntime(tools, null, storage, local.creationInput);
    retry.dataRef.current = tools.editorForm(local.data);
    retry.api = async (_url, options) => {
        assert.equal(options.body.clientId, local.clientId);
        return { ...initial, id: 8, note: '' };
    };
    await retry.saveEditor('draft');
    assert.equal(retry.recordRef.current, 8);
    assert.equal(retry.dataRef.current.question, '断线后继续修改的题干');
    assert.equal(retry.destination, undefined);
    assert.equal(tools.readEditorDraft(storage, 1), null, 'An acknowledged create migrates the local draft to its record');
    assert.equal(tools.readEditorDraft(storage, 1, 8).data.question, '断线后继续修改的题干');

    const recovered = tools.restoreEditorDraft({ ...local, data: { ...tools.editorForm(initial), note: '我的未提交笔记' }, baseline: tools.editorForm(initial) }, { ...initial, question: '其他页面的新题干', note: '其他页面的新笔记' });
    assert.equal(recovered.data.question, '其他页面的新题干', 'Untouched fields follow the current server record');
    assert.equal(recovered.data.note, '我的未提交笔记');
    assert.deepEqual(tools.editorSavePayload(recovered.data, recovered.baseline, local.clientId).expectedFields, { note: '旧笔记' }, 'Restoring a draft retains the original edited-field values for 409 conflict checks');

    const conflict = editorRuntime(tools, { ...initial, ...recovered.baseline });
    conflict.dataRef.current = tools.editorForm(recovered.data);
    conflict.api = async () => { throw new conflict.ApiError('其他页面已修改', 409); };
    await conflict.saveEditor('draft');
    assert.equal(conflict.saveConflict, true);
    assert.equal(conflict.destination, undefined);
    const latest = { ...initial, question: '其他页面的新题干', note: '其他页面的新笔记' };
    conflict.api = async () => latest;
    await conflict.resolveEditor(true);
    assert.equal(conflict.dataRef.current.question, latest.question);
    assert.equal(conflict.dataRef.current.note, '我的未提交笔记');
    conflict.api = async (_url, options) => {
        assert.equal(options.body.expectedFields.note, '其他页面的新笔记');
        return { ...latest, note: options.body.note };
    };
    await conflict.saveEditor('draft');
    assert.equal(conflict.destination, '/mistakes/7', 'An explicit keep-local decision rebases the conflict so the next save can finish');

    console.log('Editor save, retry, draft recovery and account isolation smoke checks passed.');
}

run().catch((error) => { console.error(error); process.exitCode = 1; });

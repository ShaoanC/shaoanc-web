const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectDirectory = path.resolve(__dirname, '..');
const dataDirectory = path.join(projectDirectory, 'data');
const temporaryDirectory = fs.mkdtempSync(path.join(dataDirectory, 'smoke-'));
const databasePath = path.join(temporaryDirectory, 'mistakes.sqlite');
const initialPassword = 'SmokePassword2026!';
let app;
let server;
let baseUrl;

function client() {
    let cookie = '';
    return async (method, route, body, expectedStatus = 200) => {
        const response = await fetch(`${baseUrl}${route}`, {
            method,
            headers: {
                ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                ...(cookie ? { Cookie: cookie } : {})
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
        for (const setCookie of response.headers.getSetCookie()) {
            cookie = setCookie.split(';', 1)[0];
        }
        const payload = await response.json();
        assert.equal(response.status, expectedStatus, `${method} ${route}: ${JSON.stringify(payload)}`);
        assert.equal(payload.success, expectedStatus < 400, `${method} ${route}: success flag`);
        return payload.data;
    };
}

async function cleanup() {
    if (server) {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
    if (app?.db) {
        app.db.close();
    }
    const resolvedTemporaryDirectory = path.resolve(temporaryDirectory);
    assert.equal(path.dirname(resolvedTemporaryDirectory), dataDirectory);
    assert.match(path.basename(resolvedTemporaryDirectory), /^smoke-/);
    fs.rmSync(resolvedTemporaryDirectory, { recursive: true, force: true });
}

async function main() {
    process.env.MISTAKES_DB_PATH = databasePath;
    const bootstrap = spawnSync(process.execPath, ['server/mistakes/create-admin.js'], {
        cwd: projectDirectory,
        encoding: 'utf8',
        env: {
            ...process.env,
            MISTAKES_ADMIN_USERNAME: 'smoke_admin',
            MISTAKES_ADMIN_PASSWORD: initialPassword
        }
    });
    assert.equal(bootstrap.status, 0, bootstrap.stderr || bootstrap.stdout || 'Admin bootstrap failed');
    app = require('../server/app.js');
    server = await new Promise((resolve, reject) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/api/mistakes`;

    const admin = client();
    const alice = client();
    const bob = client();
    const anonymous = client();
    const login = await admin('POST', '/auth/login', { username: 'smoke_admin', password: initialPassword });
    assert.equal(login.user.role, 'admin');

    const inviteAlice = await admin('POST', '/admin/invites', { maxUses: 1 }, 201);
    const inviteBob = await admin('POST', '/admin/invites', { maxUses: 1 }, 201);
    const registrationAlice = await alice('POST', '/auth/register', {
        username: 'smoke_alice', password: initialPassword, inviteCode: inviteAlice.code
    }, 201);
    assert.equal(registrationAlice.user.role, 'user');
    await anonymous('POST', '/auth/register', {
        username: 'smoke_reuse', password: initialPassword, inviteCode: inviteAlice.code
    }, 400);
    const registrationBob = await bob('POST', '/auth/register', {
        username: 'smoke_bob', password: initialPassword, inviteCode: inviteBob.code
    }, 201);
    const invites = await admin('GET', '/admin/invites');
    assert.equal(invites.find((invite) => invite.id === inviteAlice.id).usedCount, 1);

    const avatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
    await anonymous('PATCH', '/auth/avatar', { avatar }, 401);
    assert.equal((await alice('PATCH', '/auth/avatar', { avatar })).user.avatar, avatar);
    assert.equal((await alice('GET', '/auth/me')).user.avatar, avatar);
    assert.equal((await bob('GET', '/auth/me')).user.avatar, null);
    await alice('PATCH', '/auth/avatar', { avatar: 'data:image/png;base64,YmFk' }, 400);
    await alice('PATCH', '/auth/avatar', { avatar: 'x'.repeat(350001) }, 400);
    assert.equal((await alice('GET', '/auth/me')).user.avatar, avatar);
    assert.equal((await alice('PATCH', '/auth/avatar', { avatar: null })).user.avatar, null);

    const knowledgePoints = await alice('GET', '/knowledge-points');
    const mathPoints = knowledgePoints.filter((point) => point.subjectId === 'math' && point.parentId !== null);
    const physicsPoint = knowledgePoints.find((point) => point.subjectId === 'physics');
    assert.ok(mathPoints.length >= 2 && physicsPoint, 'Seeded knowledge points are available');
    const mistakeFields = {
        subjectId: 'math',
        primaryKnowledgePointId: mathPoints[0].id,
        auxiliaryKnowledgePointIds: [mathPoints[1].id],
        question: 'Smoke question: solve x + 2 = 5',
        answer: 'x = 3',
        analysis: 'Subtract 2 from both sides.',
        note: 'Check the signs.',
        lifecycle: 'draft'
    };
    const aliceMistake = await alice('POST', '/mistakes', mistakeFields, 201);
    const bobMistake = await bob('POST', '/mistakes', {
        ...mistakeFields,
        subjectId: 'physics',
        primaryKnowledgePointId: physicsPoint.id,
        auxiliaryKnowledgePointIds: [],
        question: 'Bob private smoke question'
    }, 201);
    assert.equal((await alice('GET', '/mistakes')).length, 0, 'Drafts stay outside the default archived list');
    const drafts = await alice('GET', '/mistakes?lifecycle=draft');
    assert.deepEqual(drafts.map((mistake) => mistake.id), [aliceMistake.id]);
    const draftStats = await alice('GET', '/stats');
    assert.deepEqual(
        [draftStats.total, draftStats.archived, draftStats.drafts, draftStats.reviewCount],
        [1, 0, 1, 0]
    );

    const savedMistake = await alice('PATCH', `/mistakes/${aliceMistake.id}`, {
        ...mistakeFields, lifecycle: 'archived', note: 'Updated smoke note'
    });
    assert.equal(savedMistake.lifecycle, 'archived');
    const loadedMistake = await alice('GET', `/mistakes/${aliceMistake.id}`);
    assert.equal(loadedMistake.note, 'Updated smoke note');
    assert.equal(loadedMistake.answer, mistakeFields.answer);
    assert.deepEqual(loadedMistake.auxiliaryKnowledgePointIds, mistakeFields.auxiliaryKnowledgePointIds);
    const filters = new URLSearchParams({
        subjectId: 'math', knowledgePointId: String(mathPoints[0].id), status: 'unreviewed', keyword: 'Smoke question'
    });
    const filteredMistakes = await alice('GET', `/mistakes?${filters}`);
    assert.deepEqual(filteredMistakes.map((mistake) => mistake.id), [aliceMistake.id]);
    const chapterMistakes = await alice('GET', `/mistakes?knowledgePointId=${mathPoints[0].parentId}`);
    assert.deepEqual(chapterMistakes.map((mistake) => mistake.id), [aliceMistake.id], 'Chapter filters include descendant knowledge points');
    const unmarkedMistake = await alice('POST', '/mistakes', {
        subjectId: 'math', question: 'An archived question awaiting classification', lifecycle: 'archived',
        primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: []
    }, 201);
    assert.equal(unmarkedMistake.lifecycle, 'archived');
    assert.equal(unmarkedMistake.primaryKnowledgePointId, null, 'Archived questions may remain unmarked');
    await alice('DELETE', `/mistakes/${unmarkedMistake.id}`);

    const bobList = await bob('GET', '/mistakes?lifecycle=all');
    assert.deepEqual(bobList.map((mistake) => mistake.id), [bobMistake.id], 'Users only list their own records');
    await bob('GET', `/mistakes/${aliceMistake.id}`, undefined, 404);
    await bob('PATCH', `/mistakes/${aliceMistake.id}`, { note: 'Foreign edit' }, 404);
    await bob('DELETE', `/mistakes/${aliceMistake.id}`, undefined, 404);
    await bob('POST', `/mistakes/${aliceMistake.id}/reviews`, { result: 'mastered' }, 404);
    await anonymous('GET', '/mistakes', undefined, 401);

    await alice('POST', `/mistakes/${aliceMistake.id}/reviews`, { result: 'familiar' }, 201);
    const reviews = await alice('GET', `/mistakes/${aliceMistake.id}/reviews`);
    assert.equal(reviews.length, 1);
    assert.equal(reviews[0].result, 'familiar');
    const reviewStats = await alice('GET', '/stats');
    assert.deepEqual(
        [reviewStats.total, reviewStats.archived, reviewStats.drafts, reviewStats.reviewCount],
        [1, 1, 0, 1]
    );
    assert.equal(reviewStats.byStatus.find((status) => status.id === 'familiar').count, 1);
    assert.equal(reviewStats.bySubject.find((subject) => subject.id === 'math').count, 1);

    const previousSession = client();
    await previousSession('POST', '/auth/login', { username: 'smoke_alice', password: initialPassword });
    const newPassword = 'ChangedSmokePassword2026!';
    await alice('PATCH', '/auth/password', { currentPassword: initialPassword, newPassword });
    assert.equal((await alice('GET', '/auth/me')).user.id, registrationAlice.user.id);
    await previousSession('GET', '/mistakes', undefined, 401);
    await anonymous('POST', '/auth/login', { username: 'smoke_alice', password: initialPassword }, 401);
    const changedLogin = await anonymous('POST', '/auth/login', { username: 'smoke_alice', password: newPassword });
    assert.equal(changedLogin.user.id, registrationAlice.user.id);

    await bob('DELETE', `/mistakes/${bobMistake.id}`);
    await alice('DELETE', `/mistakes/${aliceMistake.id}`);
    await alice('GET', `/mistakes/${aliceMistake.id}`, undefined, 404);
    const finalStats = await alice('GET', '/stats');
    assert.deepEqual([finalStats.total, finalStats.reviewCount], [0, 0], 'Deleting a mistake also removes its reviews');

    await admin('PATCH', `/admin/users/${registrationBob.user.id}`, { active: false });
    await bob('GET', '/mistakes', undefined, 401);
    await client()('POST', '/auth/login', { username: 'smoke_bob', password: initialPassword }, 403);
}

async function run() {
    try {
        await main();
    } finally {
        await cleanup();
    }
    console.log('Mistakes smoke test passed.');
}

run()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });

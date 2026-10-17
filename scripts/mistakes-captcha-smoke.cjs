const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dataDirectory = path.resolve(__dirname, '..', 'data');
const temporaryDirectory = fs.mkdtempSync(path.join(dataDirectory, 'captcha-smoke-'));
const password = 'CaptchaSmoke2026!';
const sitekey = 'FCsmoke';
const nativeFetch = global.fetch;
const consumedTokens = new Set();
let app;
let server;
let baseUrl;
let verificationCount = 0;
let nextAddress = 1;
let nextToken = 1;

function address() {
    return `198.51.100.${nextAddress++}`;
}

function validToken() {
    return `valid-${nextToken++}`;
}

function installVerificationMock() {
    global.fetch = async (input, options) => {
        if (String(input) !== 'https://global.frcapi.com/api/v2/captcha/siteverify') {
            return nativeFetch(input, options);
        }
        verificationCount += 1;
        assert.equal(options.method, 'POST');
        assert.equal(new Headers(options.headers).get('X-API-Key'), 'test-server-key');
        const body = JSON.parse(options.body);
        assert.equal(body.sitekey, sitekey);
        assert.equal(typeof body.response, 'string');
        const token = body.response;
        if (token === 'connection-error') {
            throw new TypeError('Mock connection failure');
        }
        if (token === 'timeout') {
            throw new DOMException('Mock verification timeout', 'TimeoutError');
        }
        if (token.startsWith('http-')) {
            return Response.json({ success: false }, { status: Number(token.slice(5)) });
        }
        if (token === 'malformed') {
            return Response.json({});
        }
        if (token.startsWith('valid-') && !consumedTokens.has(token)) {
            consumedTokens.add(token);
            return Response.json({ success: true });
        }
        return Response.json({ success: false, error: { error_code: 'response_invalid' } });
    };
}

async function request(route, body, { status = 200, code, ip = address() } = {}) {
    const response = await fetch(`${baseUrl}${route}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
            'X-Forwarded-For': ip,
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const payload = await response.json();
    assert.equal(response.status, status, `${route}: ${JSON.stringify(payload)}`);
    assert.equal(payload.success, status < 400, `${route}: success flag`);
    if (code) {
        assert.equal(payload.code, code, `${route}: error code`);
    }
    if (status === 429) {
        assert.ok(Number(response.headers.get('Retry-After')) > 0, 'Limited requests include Retry-After');
    }
    return { payload, response };
}

function login(captchaResponse, overrides = {}) {
    return { username: 'captcha_active', password, captchaResponse, ...overrides };
}

function registration(captchaResponse, username = 'captcha_new') {
    return { username, password, inviteCode: 'CAPTCHA-INVITE', captchaResponse };
}

async function main() {
    process.env.MISTAKES_DB_PATH = path.join(temporaryDirectory, 'mistakes.sqlite');
    process.env.FRIENDLY_CAPTCHA_ENABLED = 'true';
    process.env.FRIENDLY_CAPTCHA_SITEKEY = sitekey;
    process.env.FRIENDLY_CAPTCHA_API_KEY = 'test-server-key';
    installVerificationMock();
    app = require('../server/app.js');
    const { hashPassword } = require('../server/mistakes/auth');
    const hash = hashPassword(password);
    const createdAt = new Date().toISOString();
    for (const [username, active] of [['captcha_active', 1], ['captcha_disabled', 0]]) {
        app.db.prepare('INSERT INTO users (username, password_hash, active, created_at) VALUES (?, ?, ?, ?)')
            .run(username, hash, active, createdAt);
    }
    app.db.prepare('INSERT INTO invite_codes (code, max_uses, created_at) VALUES (?, ?, ?)')
        .run('CAPTCHA-INVITE', 100, createdAt);
    server = await new Promise((resolve, reject) => {
        const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        listener.once('error', reject);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}/api/mistakes`;

    const config = await request('/auth/config');
    assert.deepEqual(config.payload.data, { enabled: true, sitekey });
    assert.ok(!JSON.stringify(config.payload).includes('test-server-key'), 'Public configuration excludes API key');
    const loggedIn = await request('/auth/login', login(validToken()));
    assert.equal(loggedIn.payload.data.user.username, 'captcha_active');
    assert.ok(loggedIn.response.headers.get('Set-Cookie'), 'Verified login creates a session');
    const registered = await request('/auth/register', registration(validToken()), { status: 201 });
    assert.equal(registered.payload.data.user.role, 'user');

    const beforeMissing = verificationCount;
    await request('/auth/login', login(undefined), { status: 400, code: 'CAPTCHA_REQUIRED' });
    await request('/auth/register', registration(undefined), { status: 400, code: 'CAPTCHA_REQUIRED' });
    assert.equal(verificationCount, beforeMissing, 'Missing CAPTCHA is rejected before contacting the provider');
    for (const token of ['invalid', 'expired', '.ERROR', 'malformed']) {
        await request('/auth/login', login(token), { status: 400, code: 'CAPTCHA_INVALID' });
    }
    await request('/auth/register', registration('invalid'), { status: 400, code: 'CAPTCHA_INVALID' });
    const reused = validToken();
    await request('/auth/login', login(reused));
    await request('/auth/login', login(reused), { status: 400, code: 'CAPTCHA_INVALID' });
    assert.equal(app.db.prepare('SELECT used_count AS count FROM invite_codes').get().count, 1,
        'Rejected registrations do not consume an invitation');

    for (const token of ['connection-error', 'timeout', 'http-429', 'http-503']) {
        await request('/auth/login', login(token));
        await request('/auth/register', registration(token), { status: 503, code: 'CAPTCHA_UNAVAILABLE' });
    }
    await request('/auth/login', login('http-503', { password: 'WrongPassword2026!' }), { status: 401 });
    await request('/auth/login', login('http-503', { username: 'captcha_disabled' }), { status: 403 });
    for (const token of ['http-400', 'http-401']) {
        await request('/auth/login', login(token), { status: 503, code: 'CAPTCHA_CONFIG' });
    }

    const failureAddress = address();
    for (let index = 0; index < 5; index += 1) {
        await request('/auth/login', login(index < 3 ? 'invalid' : validToken(),
            index < 3 ? {} : { password: 'WrongPassword2026!' }), {
            status: index < 3 ? 400 : 401,
            ...(index < 3 ? { code: 'CAPTCHA_INVALID' } : {}),
            ip: failureAddress
        });
    }
    const beforeAccountLimit = verificationCount;
    await request('/auth/login', login(validToken()), { status: 429, code: 'RATE_LIMITED', ip: failureAddress });
    assert.equal(verificationCount, beforeAccountLimit, 'Account limiter runs before verification');
    await request('/auth/login', login(validToken()), { ip: address() });

    const successAddress = address();
    for (let index = 0; index < 6; index += 1) {
        await request('/auth/login', login(validToken()), { ip: successAddress });
    }
    const configurationAddress = address();
    for (let index = 0; index < 6; index += 1) {
        await request('/auth/login', login('http-401'), {
            status: 503, code: 'CAPTCHA_CONFIG', ip: configurationAddress
        });
    }
    await request('/auth/login', login(validToken()), { ip: configurationAddress });

    const loginAddress = address();
    for (let index = 0; index < 60; index += 1) {
        await request('/auth/login', login(undefined, { username: `captcha_attempt_${index}` }), {
            status: 400, code: 'CAPTCHA_REQUIRED', ip: loginAddress
        });
    }
    await request('/auth/login', login(validToken()), { status: 429, code: 'RATE_LIMITED', ip: loginAddress });

    const registerAddress = address();
    for (let index = 0; index < 20; index += 1) {
        await request('/auth/register', registration(undefined, `captcha_attempt_${index}`), {
            status: 400, code: 'CAPTCHA_REQUIRED', ip: registerAddress
        });
    }
    await request('/auth/register', registration(validToken(), 'captcha_limited'), {
        status: 429, code: 'RATE_LIMITED', ip: registerAddress
    });
    assert.equal(app.db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 3,
        'Only the verified registration creates an account');
}

async function cleanup() {
    global.fetch = nativeFetch;
    if (server) {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
    app?.db?.close();
    const resolvedTemporaryDirectory = path.resolve(temporaryDirectory);
    assert.equal(path.dirname(resolvedTemporaryDirectory), dataDirectory);
    assert.match(path.basename(resolvedTemporaryDirectory), /^captcha-smoke-/);
    fs.rmSync(resolvedTemporaryDirectory, { recursive: true, force: true });
}

async function run() {
    try {
        await main();
    } finally {
        await cleanup();
    }
    console.log('Mistakes CAPTCHA smoke test passed.');
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

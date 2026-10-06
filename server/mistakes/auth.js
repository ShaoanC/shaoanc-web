const crypto = require('node:crypto');
const { db } = require('./database');

const COOKIE_NAME = 'mistakes_session';
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/mistakes'
};

function fail(status, message) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

function validateCredentials(username, password) {
    if (typeof username !== 'string' || !/^[^\s\u0000-\u001f]{3,32}$/.test(username)) {
        fail(400, '用户名须为 3–32 个字符，不能包含空格');
    }
    validatePassword(password);
}

function validatePassword(password) {
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        fail(400, '密码须为 8–128 个字符');
    }
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
    if (typeof password !== 'string' || password.length > 128) {
        return false;
    }
    const [salt, hash] = storedHash.split(':');
    const actual = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

function publicUser(user) {
    return { id: user.id, username: user.username, role: user.role, active: Boolean(user.active) };
}

function tokenHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function createSession(userId, res) {
    const now = new Date();
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now.toISOString());
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(
        tokenHash(token), userId, new Date(now.getTime() + SESSION_SECONDS * 1000).toISOString(), now.toISOString()
    );
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: SESSION_SECONDS * 1000 });
}

function clearSession(req, res) {
    if (req.sessionToken) {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(req.sessionToken));
    }
    res.clearCookie(COOKIE_NAME, cookieOptions);
}

function loadSession(req, res, next) {
    const cookie = (req.headers.cookie || '').split(';').map((part) => part.trim())
        .find((part) => part.startsWith(`${COOKIE_NAME}=`));
    req.sessionToken = cookie ? cookie.slice(COOKIE_NAME.length + 1) : null;
    if (req.sessionToken) {
        const hashedToken = tokenHash(req.sessionToken);
        const session = db.prepare(`
            SELECT users.*, sessions.expires_at FROM sessions
            JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ?
        `).get(hashedToken);
        if (session && session.active && session.expires_at > new Date().toISOString()) {
            req.user = session;
        } else {
            db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashedToken);
            res.clearCookie(COOKIE_NAME, cookieOptions);
        }
    }
    next();
}

function requireUser(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ success: false, message: '请先登录' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: '需要管理员权限' });
    }
    next();
}

module.exports = {
    fail, validateCredentials, validatePassword, hashPassword, verifyPassword, publicUser,
    createSession, clearSession, loadSession, requireUser, requireAdmin
};

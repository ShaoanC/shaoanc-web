const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

function createLimiter(identifier, options) {
    return rateLimit({
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        identifier,
        handler(req, res) {
            console.warn(JSON.stringify({ event: 'auth_rate_limited', bucket: identifier }));
            res.status(429).json({ success: false, code: 'RATE_LIMITED', message: '操作过于频繁，请稍后重试' });
        },
        ...options
    });
}

const loginIpLimit = createLimiter('login-ip', {
    windowMs: 15 * 60 * 1000,
    limit: 60
});

const loginFailureLimit = createLimiter('login-failures', {
    windowMs: 15 * 60 * 1000,
    limit: 5,
    keyGenerator(req) {
        const username = typeof req.body?.username === 'string' ? req.body.username.trim().slice(0, 32) : '';
        return `${ipKeyGenerator(req.ip)}:${username}`;
    },
    skipSuccessfulRequests: true,
    requestWasSuccessful(req, res) {
        return res.statusCode < 400 || res.statusCode >= 500;
    }
});

const registrationLimit = createLimiter('registration-ip', {
    windowMs: 60 * 60 * 1000,
    limit: 20
});

module.exports = { loginIpLimit, loginFailureLimit, registrationLimit };

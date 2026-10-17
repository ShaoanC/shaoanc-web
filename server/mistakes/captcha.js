const SITEVERIFY_URL = 'https://global.frcapi.com/api/v2/captcha/siteverify';
const enabled = process.env.FRIENDLY_CAPTCHA_ENABLED === 'true';
const sitekey = process.env.FRIENDLY_CAPTCHA_SITEKEY?.trim() || '';
const apiKey = process.env.FRIENDLY_CAPTCHA_API_KEY?.trim() || '';

if (enabled && (!sitekey || !apiKey)) {
    throw new Error('启用 Friendly Captcha 时必须配置 FRIENDLY_CAPTCHA_SITEKEY 和 FRIENDLY_CAPTCHA_API_KEY');
}

function captchaError(status, code, message) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    error.expose = true;
    throw error;
}

function getPublicCaptchaConfig() {
    return { enabled, sitekey: enabled ? sitekey : '' };
}

function unavailable(action, reason) {
    console.warn(JSON.stringify({ event: 'captcha_upstream_unavailable', action, reason, loginDegraded: action === 'login' }));
    if (action !== 'login') {
        captchaError(503, 'CAPTCHA_UNAVAILABLE', '人机验证服务暂时不可用，注册已暂停，请稍后重试');
    }
}

function configurationError(reason) {
    console.error(JSON.stringify({ event: 'captcha_configuration_error', reason }));
    captchaError(503, 'CAPTCHA_CONFIG', '人机验证服务配置异常，请联系管理员');
}

async function verifyCaptcha(response, action) {
    if (!enabled) return;
    if (typeof response !== 'string' || !response.trim()) {
        captchaError(400, 'CAPTCHA_REQUIRED', '请先完成人机验证');
    }

    let verification;
    try {
        verification = await fetch(SITEVERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
            body: JSON.stringify({ response, sitekey }),
            signal: AbortSignal.timeout(5000)
        });
    } catch (error) {
        if (error instanceof TypeError || ['AbortError', 'TimeoutError'].includes(error.name)) {
            return unavailable(action, 'connection_or_timeout');
        }
        return configurationError('unexpected_request_error');
    }

    if (verification.status === 429 || verification.status >= 500) {
        return unavailable(action, `http_${verification.status}`);
    }
    if (verification.status !== 200) {
        return configurationError(`http_${verification.status}`);
    }

    let result;
    try {
        result = await verification.json();
    } catch (error) {
        if (error instanceof TypeError || ['AbortError', 'TimeoutError'].includes(error.name)) {
            return unavailable(action, 'response_connection_or_timeout');
        }
        return configurationError('invalid_json');
    }
    if (result?.success === true) return;
    captchaError(400, 'CAPTCHA_INVALID', '人机验证未通过或已过期，请重新验证');
}

module.exports = { getPublicCaptchaConfig, verifyCaptcha };

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const { fail } = require('./auth');

const configPath = path.resolve(process.env.MISTAKES_AI_CONFIG_PATH || path.join(__dirname, '..', '..', '.env.ai'));

function readConfig() {
    const saved = fs.existsSync(configPath) ? dotenv.parse(fs.readFileSync(configPath)) : {};
    return {
        enabled: saved.MISTAKES_AI_ENABLED === 'true',
        baseUrl: saved.MISTAKES_AI_BASE_URL || '',
        model: saved.MISTAKES_AI_MODEL || '',
        apiKey: saved.MISTAKES_AI_API_KEY || ''
    };
}

function publicConfig(admin = false) {
    const config = readConfig();
    const configured = Boolean(config.baseUrl && config.model && config.apiKey);
    return {
        enabled: config.enabled, configured,
        ...(admin ? { baseUrl: config.baseUrl, model: config.model, hasApiKey: Boolean(config.apiKey) } : {})
    };
}

function saveConfig(body) {
    const existing = readConfig();
    const config = { ...existing };
    if (body.enabled !== undefined) {
        if (typeof body.enabled !== 'boolean') fail(400, '启用状态须为布尔值');
        config.enabled = body.enabled;
    }
    for (const key of ['baseUrl', 'model', 'apiKey']) {
        if (body[key] === undefined || (key === 'apiKey' && body[key] === '')) continue;
        if (typeof body[key] !== 'string' || /[\r\n\u0000]/.test(body[key]) || body[key].length > 2048) fail(400, 'AI 配置格式不正确');
        config[key] = body[key].trim();
    }
    if (config.baseUrl) {
        let url;
        try { url = new URL(config.baseUrl); } catch { fail(400, '请输入有效的 AI 接口地址'); }
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) fail(400, 'AI 接口须为 HTTP(S) 基础地址');
        config.baseUrl = config.baseUrl.replace(/\/+$/, '');
    }
    if (config.enabled && (!config.baseUrl || !config.model || !config.apiKey)) fail(400, '启用前请填写接口地址、模型和密钥');
    // dotenv supports quoted values; reject all quote forms so one key cannot escape its line.
    for (const value of [config.baseUrl, config.model, config.apiKey]) {
        if (/["'`]/.test(value)) fail(400, 'AI 配置不能包含引号');
    }
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    const temporaryPath = `${configPath}.tmp`;
    fs.writeFileSync(temporaryPath, `MISTAKES_AI_ENABLED=${config.enabled}\nMISTAKES_AI_BASE_URL="${config.baseUrl}"\nMISTAKES_AI_MODEL="${config.model}"\nMISTAKES_AI_API_KEY="${config.apiKey}"\n`, { mode: 0o600 });
    fs.renameSync(temporaryPath, configPath);
    return publicConfig(true);
}

function aiClient() {
    const config = readConfig();
    if (!config.enabled || !config.baseUrl || !config.model || !config.apiKey) fail(503, '管理员尚未启用并配置 AI 服务');
    return { config, client: new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl, maxRetries: 0, timeout: 90000 }) };
}

function safeAiError(error) {
    if (error.status === 401 || error.status === 403) return 'AI 服务鉴权失败，请联系管理员检查密钥和模型权限';
    if (error.status === 429) return 'AI 服务请求过多或额度不足，请稍后重试';
    if (error.status === 400 || error.status === 404 || error.status === 422) return 'AI 接口或模型不支持此请求，请联系管理员检查配置';
    if (error.name === 'APIConnectionTimeoutError' || error.name === 'TimeoutError') return 'AI 响应超时，请重试';
    if (error.code === 'INCOMPLETE_AI_RESULT') return 'AI 返回内容被截断，请减少单次图片数量后重新识别';
    if (error.code === 'INVALID_AI_SUBJECT') return 'AI 返回的学科编号无效，请重新识别';
    if (error instanceof SyntaxError) return 'AI 返回的 JSON 无法解析，请重新识别';
    if (error.name === 'ZodError' || error.code === 'INVALID_AI_RESULT') return 'AI 返回的字段缺失或类型不正确，请重新识别';
    return error.status === 503 && error.message === '管理员尚未启用并配置 AI 服务' ? error.message : 'AI 服务暂时不可用，请稍后重试';
}

module.exports = { readConfig, publicConfig, saveConfig, aiClient, safeAiError };

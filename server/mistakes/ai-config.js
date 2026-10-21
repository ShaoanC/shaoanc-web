const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { fail } = require('./auth');

const configPath = path.resolve(process.env.MISTAKES_AI_CONFIG_PATH || path.join(__dirname, '..', '..', '.env.ai'));
const profiles = {
    general: { prefix: 'MISTAKES_AI', name: '通用识别' },
    segmentation: { prefix: 'MISTAKES_AI_SEGMENTATION', name: '页面分题' },
    analysis: { prefix: 'MISTAKES_AI_ANALYSIS', name: '生成解析' }
};

function configProfile(profile = 'general') {
    if (!Object.hasOwn(profiles, profile)) fail(400, '无效的 AI 配置类型');
    return profiles[profile];
}

function readConfig(profile = 'general') {
    const { prefix } = configProfile(profile);
    const saved = fs.existsSync(configPath) ? dotenv.parse(fs.readFileSync(configPath)) : {};
    return {
        enabled: saved[`${prefix}_ENABLED`] === 'true',
        baseUrl: saved[`${prefix}_BASE_URL`] || '',
        model: saved[`${prefix}_MODEL`] || '',
        apiKey: saved[`${prefix}_API_KEY`] || ''
    };
}

function publicConfig(admin = false, profile = 'general') {
    const config = readConfig(profile);
    const configured = Boolean(config.baseUrl && config.model && config.apiKey);
    return {
        enabled: config.enabled, configured,
        ...(profile === 'general' ? { segmentation: publicConfig(false, 'segmentation'), analysis: publicConfig(false, 'analysis') } : {}),
        ...(admin ? { baseUrl: config.baseUrl, model: config.model, hasApiKey: Boolean(config.apiKey) } : {})
    };
}

function saveConfig(body, profile = 'general') {
    const { prefix } = configProfile(profile);
    const existing = readConfig(profile);
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
    const values = { [`${prefix}_ENABLED`]: String(config.enabled), [`${prefix}_BASE_URL`]: config.baseUrl,
        [`${prefix}_MODEL`]: config.model, [`${prefix}_API_KEY`]: config.apiKey };
    const saved = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
    const retained = saved.split(/\r?\n/).filter((line) => !Object.hasOwn(values, line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1] || ''));
    fs.writeFileSync(temporaryPath, retained.join('\n').replace(/\n*$/, '\n') + Object.entries(values).map(([key, value]) => `${key}='${value}'`).join('\n') + '\n', { mode: 0o600 });
    fs.renameSync(temporaryPath, configPath);
    return publicConfig(true, profile);
}

function requireAiConfig(profile = 'general') {
    const { name } = configProfile(profile);
    const config = readConfig(profile);
    if (!config.enabled || !config.baseUrl || !config.model || !config.apiKey) fail(503, `管理员尚未启用并配置${name} AI 服务`);
    return config;
}

function safeAiError(error) {
    if (error.code === 'AI_REFUSAL') return 'AI 未提供识别结果，请检查图片内容后重试';
    if (error.code === 'VISION_TEST_MISMATCH') return 'AI 请求已连通，但未正确读出测试图片内容，请检查模型的图片输入能力';
    if (error.code === 'SEGMENTATION_TEST_MISMATCH') return 'AI 请求已连通，但未返回有效的分题区域，请检查模型的分割能力';
    if (error.status === 401 || error.status === 403) return 'AI 服务鉴权失败，请联系管理员检查密钥和模型权限';
    if (error.status === 429) return 'AI 服务请求过多或额度不足，请稍后重试';
    if (error.status === 400 || error.status === 404 || error.status === 422) return 'AI 接口或模型不支持此请求，请联系管理员检查配置';
    if (error.name === 'TimeoutError') return 'AI 响应超时，请重试';
    if (error.code === 'INCOMPLETE_AI_RESULT') return 'AI 返回内容被截断，请减少单次图片数量后重新识别';
    if (error.code === 'INVALID_AI_SUBJECT') return 'AI 返回的学科编号无效，请重新识别';
    if (error instanceof SyntaxError) return 'AI 返回的 JSON 无法解析，请重新识别';
    if (error.name === 'ZodError' || error.code === 'INVALID_AI_RESULT') return 'AI 返回的字段缺失或类型不正确，请重新识别';
    return error.status === 503 && /^管理员尚未启用并配置/.test(error.message) ? error.message : 'AI 服务暂时不可用，请稍后重试';
}

module.exports = { readConfig, publicConfig, saveConfig, requireAiConfig, safeAiError };

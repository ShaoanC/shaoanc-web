const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { fail } = require('./auth');
const { resolveVendorIcon, vendorNames } = require('../../shared/vendor-icon.mjs');

const configPath = path.resolve(process.env.MISTAKES_AI_CONFIG_PATH || path.join(__dirname, '..', '..', '.env.ai'));
const profiles = {
    general: { prefix: 'MISTAKES_AI', name: '通用识别' },
    segmentation: { prefix: 'MISTAKES_AI_SEGMENTATION', name: '页面分题' },
    analysis: { prefix: 'MISTAKES_AI_ANALYSIS', name: '生成解析' },
    analysisFallback: { prefix: 'MISTAKES_AI_ANALYSIS_FALLBACK', name: '解析模型升级' }
};
const followupPrefix = 'MISTAKES_AI_FOLLOWUP';
const FOLLOWUP_CREDIT_DECIMALS = 6;

function configProfile(profile = 'general') {
    if (!Object.hasOwn(profiles, profile)) fail(400, '无效的 AI 配置类型');
    return profiles[profile];
}

function readSavedConfig() {
    return fs.existsSync(configPath) ? dotenv.parse(fs.readFileSync(configPath)) : {};
}

function readConfig(profile = 'general') {
    const { prefix } = configProfile(profile);
    const saved = readSavedConfig();
    return {
        enabled: saved[`${prefix}_ENABLED`] === 'true',
        baseUrl: saved[`${prefix}_BASE_URL`] || '',
        model: saved[`${prefix}_MODEL`] || '',
        apiKey: saved[`${prefix}_API_KEY`] || ''
    };
}

function publicConfig(admin = false, profile = 'general') {
    if (profile === 'followup') {
        const settings = readFollowupConfig();
        const enabled = availableFollowupProfiles(settings).length > 0;
        if (!admin) return { enabled, configured: enabled };
        return {
            ...settings,
            profiles: settings.profiles.map(({ apiKey, ...entry }) => ({ ...entry, hasApiKey: Boolean(apiKey) }))
        };
    }
    const config = readConfig(profile);
    const configured = Boolean(config.baseUrl && config.model && config.apiKey);
    return {
        enabled: config.enabled, configured,
        ...(profile === 'general' ? { segmentation: publicConfig(false, 'segmentation'), analysis: publicConfig(false, 'analysis') } : {}),
        ...(admin ? { baseUrl: config.baseUrl, model: config.model, hasApiKey: Boolean(config.apiKey) } : {})
    };
}

function configureEndpoint(body, existing, enabled) {
    const config = { baseUrl: existing.baseUrl, model: existing.model, apiKey: existing.apiKey };
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
    if (enabled && (!config.baseUrl || !config.model || !config.apiKey)) fail(400, '启用前请填写接口地址、模型和密钥');
    return config;
}

function saveConfig(body, profile = 'general') {
    if (profile === 'followup') return saveFollowupConfig(body);
    const { prefix } = configProfile(profile);
    const existing = readConfig(profile);
    const { enabled = existing.enabled } = body;
    if (typeof enabled !== 'boolean') fail(400, '启用状态须为布尔值');
    const config = { ...configureEndpoint(body, existing, enabled), enabled };
    if (profile === 'analysis' || profile === 'analysisFallback') {
        const other = readConfig(profile === 'analysis' ? 'analysisFallback' : 'analysis');
        if (config.enabled && other.enabled && config.baseUrl === other.baseUrl && config.model === other.model) {
            fail(400, '解析模型升级须配置不同于生成解析的接口或模型');
        }
    }
    // dotenv supports quoted values; reject all quote forms so one key cannot escape its line.
    for (const value of [config.baseUrl, config.model, config.apiKey]) {
        if (/["'`]/.test(value)) fail(400, 'AI 配置不能包含引号');
    }
    writeConfig({
        [`${prefix}_ENABLED`]: String(config.enabled), [`${prefix}_BASE_URL`]: config.baseUrl,
        [`${prefix}_MODEL`]: config.model, [`${prefix}_API_KEY`]: config.apiKey
    });
    return publicConfig(true, profile);
}

function writeConfig(values) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    const temporaryPath = `${configPath}.tmp`;
    const saved = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
    const retained = saved.split(/\r?\n/).filter((line) => !Object.hasOwn(values, line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1] || ''));
    fs.writeFileSync(temporaryPath, retained.join('\n').replace(/\n*$/, '\n') + Object.entries(values).map(([key, value]) => `${key}='${value}'`).join('\n') + '\n', { mode: 0o600 });
    fs.renameSync(temporaryPath, configPath);
}

function followupProfile(entry, savedKey = '') {
    if (!entry || typeof entry.id !== 'string' || !/^[\w-]{1,64}$/.test(entry.id)) fail(400, '无效的追问模型配置编号');
    const {
        id, name = '', tierLabel = '', enabledForFollowup = false, creditCost = 1,
        thinkingEffort = '', vendorIcon = '', sortOrder = null, protocol = 'openai', vision = true
    } = entry;
    if (typeof name !== 'string' || !name.trim() || typeof tierLabel !== 'string') fail(400, '请填写追问配置名称');
    if (typeof enabledForFollowup !== 'boolean' || typeof vision !== 'boolean' || !['openai', 'gemini'].includes(protocol)) {
        fail(400, '请选择有效的启用、接口协议和图片输入设置');
    }
    if (!Number.isFinite(creditCost) || creditCost < 0 || creditCost > Number.MAX_SAFE_INTEGER
        || Number(creditCost.toFixed(FOLLOWUP_CREDIT_DECIMALS)) !== creditCost) {
        fail(400, `积分倍率须为非负数，最多 ${FOLLOWUP_CREDIT_DECIMALS} 位小数`);
    }
    if (sortOrder !== null && !Number.isFinite(sortOrder)) fail(400, '排序须为数字');
    if (typeof thinkingEffort !== 'string' || thinkingEffort.length > 32) fail(400, '无效的思考强度');
    if (typeof vendorIcon !== 'string' || (vendorIcon && !Object.hasOwn(vendorNames, vendorIcon))) fail(400, '请选择有效的厂商 Logo');
    const endpoint = configureEndpoint(entry, { baseUrl: '', model: '', apiKey: savedKey }, enabledForFollowup);
    return {
        id, name: name.trim(), tierLabel: tierLabel.trim(), enabledForFollowup, creditCost, thinkingEffort: thinkingEffort.trim(),
        vendorIcon, sortOrder, protocol, vision, ...endpoint
    };
}

function readFollowupConfig() {
    const saved = readSavedConfig();
    const dailyCreditLimit = Number(saved[`${followupPrefix}_DAILY_CREDIT_LIMIT`] || 60);
    let entries;
    try { entries = JSON.parse(saved[`${followupPrefix}_PROFILES`] || '[]'); } catch { fail(400, '追问模型配置须为 JSON 数组'); }
    if (!Array.isArray(entries)) fail(400, '追问模型配置须为 JSON 数组');
    return {
        profiles: entries.map((entry) => followupProfile(entry)),
        defaultProfileId: saved[`${followupPrefix}_DEFAULT_PROFILE_ID`] || null,
        dailyCreditLimit: Number.isSafeInteger(dailyCreditLimit) && dailyCreditLimit > 0 ? dailyCreditLimit : 60
    };
}

function availableFollowupProfiles(settings) {
    return settings.profiles.filter((entry) => entry.enabledForFollowup)
        .sort((a, b) => (a.sortOrder ?? a.creditCost) - (b.sortOrder ?? b.creditCost) || a.creditCost - b.creditCost);
}

function defaultFollowupProfile(settings, available) {
    return available.find(({ id }) => id === settings.defaultProfileId) ?? available[0];
}

function saveFollowupConfig(body) {
    const existing = readFollowupConfig();
    const { dailyCreditLimit = existing.dailyCreditLimit, defaultProfileId = existing.defaultProfileId } = body;
    if (!Number.isSafeInteger(dailyCreditLimit) || dailyCreditLimit < 1) fail(400, '每日追问积分上限须为正整数');
    if (body.profiles !== undefined && !Array.isArray(body.profiles)) fail(400, '追问模型配置须为数组');
    const savedProfiles = new Map(existing.profiles.map((entry) => [entry.id, entry]));
    const entries = body.profiles?.map((entry) => {
        if (entry?.endpointSourceId == null) return followupProfile(entry, savedProfiles.get(entry?.id)?.apiKey);
        const source = savedProfiles.get(entry.endpointSourceId);
        if (!source?.baseUrl || !source.apiKey) fail(400, '沿用的接口已不可用，请重新选择');
        return followupProfile({ ...entry, baseUrl: source.baseUrl, apiKey: source.apiKey, protocol: source.protocol });
    }) ?? existing.profiles;
    if (new Set(entries.map(({ id }) => id)).size !== entries.length) fail(400, '追问模型配置编号不能重复');
    const selected = defaultFollowupProfile({ defaultProfileId }, availableFollowupProfiles({ profiles: entries }));
    writeConfig({
        [`${followupPrefix}_DAILY_CREDIT_LIMIT`]: String(dailyCreditLimit),
        [`${followupPrefix}_DEFAULT_PROFILE_ID`]: selected?.id || '',
        [`${followupPrefix}_PROFILES`]: JSON.stringify(entries).replace(/'/g, '\\u0027')
    });
    return publicConfig(true, 'followup');
}

function requireAiConfig(profile = 'general') {
    const { name } = configProfile(profile);
    const config = readConfig(profile);
    if (!config.enabled || !config.baseUrl || !config.model || !config.apiKey) fail(503, `管理员尚未启用并配置${name} AI 服务`);
    return config;
}

function safeAiError(error, { details = false } = {}) {
    const providerMessage = error.providerMessage || '';
    const providerReasons = (Array.isArray(error.error?.details) ? error.error.details : []).map((detail) => detail?.reason || '').join(' ');
    const providerFailure = `${error.providerCode || ''} ${providerReasons} ${providerMessage}`;
    let requestError;
    if (error.status) {
        if (/location.*not supported|unsupported.*(?:location|region)|country.*not supported/i.test(providerFailure)) {
            requestError = 'AI 服务不支持当前服务器的出口地区，请检查服务器网络出口';
        } else if (/API_KEY_INVALID|API_KEY_EXPIRED|api key not valid|invalid api key|expired.*key|key.*expired/i.test(providerFailure) || [401, 403].includes(error.status)) {
            requestError = 'AI 服务鉴权失败，请联系管理员检查密钥和模型权限';
        } else if (error.status === 402 || /billing|paid tier|payment|prepay|credit balance/i.test(providerFailure)) {
            requestError = 'AI 服务需要检查项目计费状态或可用余额，请联系管理员';
        } else if (error.status === 429) {
            requestError = 'AI 服务请求过多或额度不足，请稍后重试';
        } else if (/FAILED_PRECONDITION/i.test(providerFailure)) {
            requestError = 'AI 服务的调用前提未满足，请由管理员测试查看具体原因';
        } else if (error.status === 404) {
            requestError = 'AI 接口地址或模型不存在，请联系管理员检查配置';
        } else if ([400, 422].includes(error.status)) {
            requestError = 'AI 请求参数被接口拒绝，请由管理员测试查看具体原因';
        }
        if (requestError || (details && providerMessage)) {
            const message = requestError || 'AI 服务暂时不可用，请稍后重试';
            return details && providerMessage ? `${message}（HTTP ${error.status}${error.providerCode ? `，${error.providerCode}` : ''}）：${providerMessage}` : message;
        }
    }
    if (error.code === 'AI_REFUSAL') return 'AI 未提供识别结果，请检查图片内容后重试';
    if (error.code === 'ANALYSIS_UPGRADE_REQUESTED') return 'AI 无法可靠生成解析，请检查题干、答案和配图，或联系管理员确认升级模型配置';
    if (error.code === 'VISION_TEST_MISMATCH') return 'AI 请求已连通，但未正确读出测试图片内容，请检查模型的图片输入能力';
    if (error.code === 'SEGMENTATION_TEST_MISMATCH') return 'AI 请求已连通，但未返回有效的分题区域，请检查模型的分割能力';
    if (error.name === 'TimeoutError') return 'AI 响应超时，请重试';
    if (error.code === 'INCOMPLETE_AI_RESULT') return 'AI 返回内容被截断，请减少单次图片数量后重新识别';
    if (error.code === 'INVALID_AI_SUBJECT') return 'AI 返回的学科编号无效，请重新识别';
    if (error instanceof SyntaxError) return 'AI 返回的 JSON 无法解析，请重新识别';
    if (error.name === 'ZodError' || error.code === 'INVALID_AI_RESULT') return 'AI 返回的字段缺失或类型不正确，请重新识别';
    return error.status === 503 && /^管理员尚未启用并配置/.test(error.message) ? error.message : 'AI 服务暂时不可用，请稍后重试';
}

module.exports = { readConfig, publicConfig, saveConfig, requireAiConfig, safeAiError,
    readFollowupConfig, availableFollowupProfiles, defaultFollowupProfile, FOLLOWUP_CREDIT_DECIMALS };

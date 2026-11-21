export const vendorNames = Object.freeze({
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google',
    deepseek: 'DeepSeek',
    qwen: '通义千问',
    kimi: '月之暗面',
    zhipu: '智谱',
    xai: 'xAI',
    meta: 'Meta',
    minimax: 'MiniMax',
    xiaomi: '小米',
    mistral: 'Mistral',
    default: '通用 AI'
});

const models = {
    openai: /openai|gpt(?:[-_.]|$)|(?:^|[/:\s])o[1-9](?:[-_.]|$)/,
    anthropic: /claude|anthropic/,
    google: /gemini|gemma|google/,
    deepseek: /deepseek/,
    qwen: /qwen|tongyi/,
    kimi: /kimi|moonshot/,
    zhipu: /zhipu|(?:^|[/:\s-])(?:chat)?glm|^z\.ai\//,
    xai: /grok|^xai\//,
    meta: /llama|(?:^|[/:\s-])muse(?:[-_.]|$)|^meta\//,
    minimax: /minimax|abab/,
    xiaomi: /mimo|xiaomi/,
    mistral: /mistral|mixtral|codestral|pixtral|devstral|magistral/
};

const domains = {
    openai: ['openai.com', 'openai.azure.com'],
    anthropic: ['anthropic.com'],
    google: ['googleapis.com', 'google.com'],
    deepseek: ['deepseek.com'],
    qwen: ['aliyuncs.com', 'alibabacloud.com', 'qwen.ai'],
    kimi: ['moonshot.cn', 'moonshot.ai', 'kimi.com'],
    zhipu: ['bigmodel.cn', 'zhipuai.cn', 'z.ai'],
    xai: ['x.ai'],
    meta: ['meta.com', 'llama.com'],
    minimax: ['minimax.io', 'minimax.chat', 'minimaxi.com'],
    xiaomi: ['xiaomi.com', 'xiaomimimo.com'],
    mistral: ['mistral.ai']
};

export function resolveVendorIcon(vendorIcon = '', modelName = '', baseUrl = '') {
    const explicit = vendorIcon.trim().toLowerCase();
    if (explicit) return Object.hasOwn(vendorNames, explicit) ? explicit : 'default';
    const model = modelName.trim().toLowerCase();
    for (const [vendor, pattern] of Object.entries(models)) {
        if (pattern.test(model)) return vendor;
    }
    let host;
    try { host = new URL(baseUrl).hostname.toLowerCase(); } catch { return 'default'; }
    for (const [vendor, suffixes] of Object.entries(domains)) {
        if (suffixes.some((suffix) => host === suffix || host.endsWith('.' + suffix))) return vendor;
    }
    return 'default';
}

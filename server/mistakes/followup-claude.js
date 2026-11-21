const manualBudgets = { minimal: 1024, low: 1024, medium: 2048, high: 4096, xhigh: 6144, max: 6144 };

function claudeUsage(usage) {
    if (!usage || !Number.isSafeInteger(usage.input_tokens) || !Number.isSafeInteger(usage.output_tokens)) return null;
    const cachedReadTokens = usage.cache_read_input_tokens ?? 0;
    const inputTokens = usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + cachedReadTokens;
    return { inputTokens, outputTokens: usage.output_tokens, cachedReadTokens, totalTokens: inputTokens + usage.output_tokens };
}

function createClaudeMessages(model, system) {
    // Claude 3.7 and the Claude 4 models before 4.6 use a token budget instead of adaptive thinking.
    let manual = /claude-(?:3[.-]7|(?:haiku|sonnet|opus)-4(?:[.-][0-5])?(?:$|-latest|-\d{8}))/i.test(model);
    let displaySummary = true;
    let startUsage;

    function thinkingOptions(effort, includeThoughts) {
        if (effort === 'none') {
            return { thinking: { type: /claude-sonnet-5[.-]5\b/i.test(model) ? 'between_tools' : 'disabled' } };
        }
        if (!includeThoughts) return {};
        if (manual) return { thinking: { type: 'enabled', budget_tokens: manualBudgets[effort] ?? 2048 } };
        return {
            thinking: { type: 'adaptive', ...(displaySummary && { display: 'summarized' }) },
            ...(effort && { output_config: { effort: effort === 'minimal' ? 'low' : effort } })
        };
    }

    return {
        url({ baseUrl }) {
            if (baseUrl.endsWith('/messages')) return baseUrl;
            return baseUrl + (baseUrl.endsWith('/v1') ? '/messages' : '/v1/messages');
        },
        auth: (key) => ({ 'x-api-key': key, 'anthropic-version': '2023-06-01' }),
        body: (config, turns, stream, _includeUsage, includeThoughts) => ({
            model, system, stream, max_tokens: 8192, ...thinkingOptions(config.thinkingEffort, includeThoughts),
            messages: turns.map(({ role, text, images }) => ({
                role, content: images?.length ? [
                    ...images.map((data) => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } })),
                    { type: 'text', text }
                ] : text
            }))
        }),
        retryThinking(error) {
            if (manual || ![400, 422].includes(error.status)) return false;
            if (/budget_tokens|adaptive/i.test(error.providerMessage)) manual = true;
            else if (displaySummary && /thinking.*display|display.*thinking/i.test(error.providerMessage)) displaySummary = false;
            else return false;
            return true;
        },
        read(packet) {
            switch (packet.type) {
                case 'message_start':
                    startUsage = packet.message?.usage;
                    return {};
                case 'content_block_start': {
                    const block = packet.content_block;
                    if (block?.type === 'thinking') return { thought: block.thinking };
                    if (block?.type === 'text') return { text: block.text };
                    return {};
                }
                case 'content_block_delta': {
                    const delta = packet.delta;
                    if (delta?.type === 'thinking_delta') return { thought: delta.thinking };
                    if (delta?.type === 'text_delta') return { text: delta.text };
                    return {};
                }
                case 'message_stop': return { done: true };
                case 'message_delta':
                case 'message': {
                    const full = packet.type === 'message';
                    const reason = full ? packet.stop_reason : packet.delta?.stop_reason;
                    const blocks = full ? packet.content : [];
                    // message_delta counts are cumulative and may contain only the output count.
                    return {
                        thought: blocks.filter((block) => block.type === 'thinking').map((block) => block.thinking).join('\n'),
                        text: blocks.filter((block) => block.type === 'text').map((block) => block.text).join(''),
                        done: full, finalUsage: Boolean(reason),
                        truncated: reason === 'max_tokens' || reason === 'model_context_window_exceeded',
                        refusal: reason === 'refusal',
                        usage: packet.usage && claudeUsage(full ? packet.usage : { ...startUsage, ...packet.usage })
                    };
                }
                default: return {};
            }
        }
    };
}

module.exports = { createClaudeMessages };

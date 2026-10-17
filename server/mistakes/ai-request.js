const { aiClient } = require('./ai-config');

function aiErrorCategory(error) {
    if (error.code === 'INCOMPLETE_AI_RESULT') return 'truncated';
    if (error.code === 'VISION_TEST_MISMATCH') return 'vision_mismatch';
    if (error instanceof SyntaxError || error.name === 'ZodError' || ['INVALID_AI_RESULT', 'INVALID_AI_SUBJECT'].includes(error.code)) return 'format';
    if (['AbortError', 'APIUserAbortError'].includes(error.name)) return 'cancelled';
    if (['APIConnectionTimeoutError', 'TimeoutError'].includes(error.name)) return 'timeout';
    if ([401, 403].includes(error.status)) return 'authentication';
    if (error.status === 429) return 'rate_limit';
    if (error.status) return `http_${error.status}`;
    return 'network';
}

async function requestCompletion({ messages, signal, context, interpret, onMetrics }) {
    const { client, config } = aiClient();
    const started = Date.now();
    let response;
    let category = null;
    try {
        response = await client.chat.completions.create({ model: config.model, messages }, { signal });
        const choice = response.choices?.[0];
        if (choice?.finish_reason === 'length') throw Object.assign(new Error('Truncated AI result'), { code: 'INCOMPLETE_AI_RESULT' });
        return interpret(choice?.message?.content || '');
    } catch (error) {
        category = aiErrorCategory(error);
        throw error;
    } finally {
        const usage = response?.usage;
        // Deliberately log metadata only: no image bytes, user content, URLs or keys.
        const record = { event: 'mistakes.ai.request', ...context, model: config.model,
            elapsedMs: Date.now() - started, status: category ? 'failed' : 'succeeded', errorCategory: category,
            usage: usage ? { inputTokens: usage.prompt_tokens ?? null, outputTokens: usage.completion_tokens ?? null, totalTokens: usage.total_tokens ?? null } : null };
        console.info(JSON.stringify(record));
        onMetrics?.(record);
    }
}

module.exports = { requestCompletion, aiErrorCategory };

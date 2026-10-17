const { aiClient } = require('./ai-config');

function aiErrorCategory(error) {
    if (error.code === 'AI_REFUSAL') return 'refusal';
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

function unsupportedFormat(error) {
    const message = String(error.error?.message || error.message || '');
    return [400, 422].includes(error.status) && /response_format|json_schema/i.test(message)
        && /not supported|unsupported|does not support|unknown (?:parameter|field)|unrecognized (?:parameter|field)/i.test(message)
        && !/invalid schema|schema.*(?:invalid|required|additionalProperties)/i.test(message);
}

async function requestCompletion({ messages, responseFormat, signal, context, interpret, onMetrics }) {
    const { client, config } = aiClient();
    // Only an explicit unsupported-format rejection permits a plain-request fallback.
    try {
        return await request(responseFormat);
    } catch (error) {
        if (!responseFormat || !unsupportedFormat(error)) throw error;
        return request(undefined);
    }

    async function request(format) {
        const started = Date.now();
        let response;
        let category = null;
        try {
            response = await client.chat.completions.create({ model: config.model, messages, ...(format ? { response_format: format } : {}) }, { signal });
            const choice = response.choices?.[0];
            if (choice?.finish_reason === 'length') throw Object.assign(new Error('Truncated AI result'), { code: 'INCOMPLETE_AI_RESULT' });
            if (choice?.message?.refusal || choice?.finish_reason === 'content_filter') throw Object.assign(new Error('AI declined recognition'), { code: 'AI_REFUSAL' });
            const content = choice?.message?.content;
            const raw = typeof content === 'string' ? content : Array.isArray(content)
                ? content.filter((part) => part?.type === 'text' && typeof part.text === 'string').map((part) => part.text).join('') : '';
            if (!raw.trim()) throw Object.assign(new Error('Empty AI result'), { code: 'INVALID_AI_RESULT' });
            return interpret(raw);
        } catch (error) {
            category = aiErrorCategory(error);
            throw error;
        } finally {
            const usage = response?.usage;
            // Deliberately log metadata only: no image bytes, user content, URLs or keys.
            const record = { event: 'mistakes.ai.request', ...context, model: config.model,
                elapsedMs: Date.now() - started, status: category ? 'failed' : 'succeeded', errorCategory: category, responseFormat: format?.type || 'text',
                usage: usage ? { inputTokens: usage.prompt_tokens ?? null, outputTokens: usage.completion_tokens ?? null, totalTokens: usage.total_tokens ?? null } : null };
            console.info(JSON.stringify(record));
            onMetrics?.(record);
        }
    }
}

module.exports = { requestCompletion, aiErrorCategory };

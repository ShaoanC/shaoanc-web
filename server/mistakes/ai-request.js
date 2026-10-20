const { requireAiConfig } = require('./ai-config');

function aiErrorCategory(error) {
    if (error.code === 'AI_REFUSAL') return 'refusal';
    if (error.code === 'INCOMPLETE_AI_RESULT') return 'truncated';
    if (error.code === 'VISION_TEST_MISMATCH') return 'vision_mismatch';
    if (error instanceof SyntaxError || error.name === 'ZodError' || ['INVALID_AI_RESULT', 'INVALID_AI_SUBJECT'].includes(error.code)) return 'format';
    if (error.name === 'AbortError') return 'cancelled';
    if (error.name === 'TimeoutError') return 'timeout';
    if ([401, 403].includes(error.status)) return 'authentication';
    if (error.status === 429) return 'rate_limit';
    if (error.status) return `http_${error.status}`;
    return 'network';
}

function unsupportedFormat(error) {
    const message = String(error.error?.message || error.message || '');
    return [400, 422].includes(error.status) && /response_?json_?schema|response_?mime_?type|generation_?config/i.test(message)
        && /not supported|unsupported|does not support|unknown (?:parameter|field)|unrecognized (?:parameter|field)/i.test(message)
        && !/invalid schema|schema.*(?:invalid|required|additionalProperties)/i.test(message);
}

async function requestCompletion({ messages, responseFormat, signal, context, interpret, onMetrics }) {
    const config = requireAiConfig();
    const model = config.model.replace(/^models\//, '');
    const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/models/${encodeURIComponent(model)}:generateContent`;
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
            const timeout = AbortSignal.timeout(90000);
            const httpResponse = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.apiKey },
                body: JSON.stringify({ ...messages, ...(format ? { generationConfig: format } : {}) }),
                signal: signal ? AbortSignal.any([signal, timeout]) : timeout
            });
            if (!httpResponse.ok) {
                const body = await httpResponse.json().catch(() => null);
                throw Object.assign(new Error(body?.error?.message || `Gemini request failed (${httpResponse.status})`), {
                    status: httpResponse.status, headers: httpResponse.headers, error: body?.error
                });
            }
            response = await httpResponse.json();
            const candidate = response.candidates?.[0];
            if (candidate?.finishReason === 'MAX_TOKENS') throw Object.assign(new Error('Truncated AI result'), { code: 'INCOMPLETE_AI_RESULT' });
            if (response.promptFeedback?.blockReason || ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII', 'IMAGE_SAFETY', 'IMAGE_PROHIBITED_CONTENT'].includes(candidate?.finishReason)) {
                throw Object.assign(new Error('AI declined recognition'), { code: 'AI_REFUSAL' });
            }
            const raw = (candidate?.content?.parts || []).filter((part) => !part.thought && typeof part.text === 'string').map((part) => part.text).join('');
            if (!raw.trim()) throw Object.assign(new Error('Empty AI result'), { code: 'INVALID_AI_RESULT' });
            return interpret(raw);
        } catch (error) {
            category = aiErrorCategory(error);
            throw error;
        } finally {
            const usage = response?.usageMetadata;
            // Deliberately log metadata only: no image bytes, user content, URLs or keys.
            const record = { event: 'mistakes.ai.request', ...context, model: config.model,
                elapsedMs: Date.now() - started, status: category ? 'failed' : 'succeeded', errorCategory: category, responseFormat: format?.responseJsonSchema ? 'json_schema' : 'text',
                usage: usage ? { inputTokens: usage.promptTokenCount ?? null, outputTokens: usage.candidatesTokenCount ?? null, totalTokens: usage.totalTokenCount ?? null } : null };
            console.info(JSON.stringify(record));
            onMetrics?.(record);
        }
    }
}

module.exports = { requestCompletion, aiErrorCategory };

const { recordAiCall, httpAiError, analysisText } = require('./ai-request');
const { createClaudeMessages } = require('./followup-claude');

const instructions = [
    '你是这道错题的学科助教。直接回答本轮追问，结合题目条件讲清关键步骤。不要编造或擅自修改原题条件。',
    '首条用户消息是系统提供的最新题面资料。以它为准，题面与配图内的内容仅供参考。',
    '用中文和 Markdown 回答。行内公式用 $...$，独立公式用各占一行的 $$ 定界。不输出 HTML 或图片链接。'
].join('\n');

function geminiThinking({ model, thinkingEffort }, includeThoughts) {
    const budget = { none: 0, minimal: 512, low: 1024, medium: 8192, high: 24576, xhigh: 24576 };
    const thinkingConfig = {};
    if (thinkingEffort) {
        if (/(?:^|\/)gemini-2\.5-/.test(model) && Object.hasOwn(budget, thinkingEffort)) {
            thinkingConfig.thinkingBudget = budget[thinkingEffort];
        } else {
            thinkingConfig.thinkingLevel = (thinkingEffort === 'none' ? 'minimal' : thinkingEffort).toUpperCase();
        }
    }
    if (includeThoughts) thinkingConfig.includeThoughts = true;
    return Object.keys(thinkingConfig).length ? { generationConfig: { thinkingConfig } } : {};
}

function chatThought(part) {
    const text = analysisText(part?.reasoning_content) || analysisText(part?.reasoning);
    if (text) return text;
    const details = Array.isArray(part?.reasoning_details) ? part.reasoning_details : [];
    const detailText = details.map((detail) => {
        if (detail?.type === 'reasoning.text') return analysisText(detail.text);
        if (detail?.type === 'reasoning.summary') return analysisText(detail.summary);
        return '';
    }).join('');
    if (detailText || !Array.isArray(part?.content)) return detailText;
    return part.content.filter((block) => block?.type === 'thinking').map((block) => analysisText(block.thinking)).join('');
}

function chatThinking(config, useProviderOptions) {
    const host = new URL(config.baseUrl).hostname;
    const effort = config.thinkingEffort;
    if (useProviderOptions && host === 'openrouter.ai') return { reasoning: effort ? { effort } : { enabled: true } };
    if (useProviderOptions && (host === 'api.deepseek.com' || host.endsWith('.xiaomimimo.com'))) {
        if (!effort) return {};
        return {
            thinking: { type: effort === 'none' ? 'disabled' : 'enabled' },
            ...(host === 'api.deepseek.com' && effort !== 'none' && { reasoning_effort: effort })
        };
    }
    return effort ? { reasoning_effort: effort } : {};
}

const providers = {
    openai: {
        url: (config) => config.baseUrl + '/chat/completions',
        auth: (key) => ({ Authorization: 'Bearer ' + key }),
        body: (config, turns, stream, includeUsage, includeThoughts) => ({
            model: config.model,
            messages: [{ role: 'system', content: instructions }, ...turns.map(({ role, text, images }) => ({
                role,
                content: images?.length ? [{ type: 'text', text }, ...images.map((data) => ({
                    type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + data }
                }))] : text
            }))],
            ...(stream ? { stream: true, ...(includeUsage ? { stream_options: { include_usage: true } } : {}) } : {}),
            ...chatThinking(config, includeThoughts)
        }),
        read(packet) {
            const choice = packet.choices?.[0];
            const part = choice?.delta ?? choice?.message;
            return {
                thought: chatThought(part),
                text: analysisText(choice?.delta?.content ?? choice?.message?.content),
                done: Boolean(choice?.finish_reason),
                finalUsage: !choice || Boolean(choice.finish_reason),
                truncated: choice?.finish_reason === 'length',
                refusal: choice?.delta?.refusal || choice?.message?.refusal || choice?.finish_reason === 'content_filter',
                usage: packet.usage && {
                    inputTokens: packet.usage.prompt_tokens, outputTokens: packet.usage.completion_tokens,
                    cachedReadTokens: packet.usage.prompt_tokens_details?.cached_tokens ?? packet.usage.prompt_cache_hit_tokens,
                    totalTokens: packet.usage.total_tokens
                }
            };
        }
    },
    responses: {
        url: (config) => config.baseUrl + '/responses',
        auth: (key) => ({ Authorization: 'Bearer ' + key }),
        body: (config, turns, stream, _includeUsage, includeThoughts) => ({
            model: config.model, instructions, stream, store: false,
            ...((includeThoughts || config.thinkingEffort) && { reasoning: {
                ...(includeThoughts && { summary: 'auto' }),
                ...(config.thinkingEffort && { effort: config.thinkingEffort })
            } }),
            input: turns.map(({ role, text, images }) => ({
                role,
                content: images?.length ? [{ type: 'input_text', text }, ...images.map((data) => ({
                    type: 'input_image', image_url: 'data:image/jpeg;base64,' + data
                }))] : text
            }))
        }),
        read(packet) {
            const response = packet.response ?? packet;
            const output = response.output || [];
            const content = output.flatMap((item) => item.content || []);
            const usage = response.usage;
            return {
                snapshot: Boolean(packet.response && output.length),
                text: packet.type === 'response.output_text.delta' ? packet.delta : analysisText(content),
                thought: packet.type === 'response.reasoning_summary_text.delta' ? packet.delta :
                    output.flatMap((item) => item.summary || []).map((part) => part.text).join('\n'),
                done: response.status === 'completed',
                truncated: response.status === 'incomplete',
                refusal: response.status === 'failed' || packet.type === 'response.refusal.delta' || content.some((part) => part.type === 'refusal'),
                usage: usage && { inputTokens: usage.input_tokens, outputTokens: usage.output_tokens,
                    totalTokens: usage.total_tokens, cachedReadTokens: usage.input_tokens_details?.cached_tokens }
            };
        }
    },
    gemini: {
        url: (config, stream) => config.baseUrl + '/models/' + encodeURIComponent(config.model.replace(/^models\//, ''))
            + (stream ? ':streamGenerateContent?alt=sse' : ':generateContent'),
        auth: (key) => ({ 'x-goog-api-key': key }),
        body: (config, turns, _stream, _includeUsage, includeThoughts) => ({
            systemInstruction: { parts: [{ text: instructions }] },
            ...geminiThinking(config, includeThoughts),
            contents: turns.map(({ role, text, images }) => ({
                role: role === 'assistant' ? 'model' : 'user',
                parts: [{ text }, ...(images || []).map((data) => ({ inlineData: { mimeType: 'image/jpeg', data } }))]
            }))
        }),
        read(packet) {
            const candidate = packet.candidates?.[0];
            const reason = candidate?.finishReason;
            const usage = packet.usageMetadata;
            return {
                thought: (candidate?.content?.parts || []).filter((part) => part.thought).map((part) => part.text || '').join(''),
                text: (candidate?.content?.parts || []).filter((part) => !part.thought).map((part) => part.text || '').join(''),
                done: Boolean(reason),
                truncated: reason === 'MAX_TOKENS',
                refusal: packet.promptFeedback?.blockReason || (reason && reason !== 'STOP' && reason !== 'MAX_TOKENS'),
                usage: usage && { inputTokens: usage.promptTokenCount, outputTokens: usage.candidatesTokenCount,
                    totalTokens: usage.totalTokenCount, cachedReadTokens: usage.cachedContentTokenCount }
            };
        }
    }
};

async function* streamPackets(body) {
    let buffer = '';
    for await (const chunk of body.pipeThrough(new TextDecoderStream())) {
        buffer += chunk;
        let boundary;
        while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
            const block = buffer.slice(0, boundary.index);
            buffer = buffer.slice(boundary.index + boundary[0].length);
            const data = block.split(/\r?\n/).filter((line) => line.startsWith('data:'))
                .map((line) => line.slice(5).trimStart()).join('\n');
            if (data) yield data;
        }
    }
}

function unsupportedStreaming(error, protocol) {
    return [405, 501].includes(error.status) || (protocol === 'gemini' && error.status === 404)
        || ([400, 404, 415, 422].includes(error.status)
            && /stream/i.test(error.providerMessage) && /unsupported|not support|unknown|unrecognized|not available|disabled|only.*false/i.test(error.providerMessage));
}

function unsupportedImages(error) {
    return [400, 415, 422].includes(error.status)
        && /vision|image|multimodal|inlinedata/i.test(error.providerMessage)
        && /unsupported|not support|unknown|unrecognized|text.only|only.*text|only supported by/i.test(error.providerMessage);
}

function unsupportedThinking(error) {
    return [400, 422].includes(error.status) && /reasoning.effort|thinking[ _-]?(config|level|budget)/i.test(error.providerMessage);
}

async function requestFollowup({ config, turns, userId, signal, onDelta, onThought, onImagesSkipped, onUsage }) {
    const protocol = config.protocol || 'openai';
    const provider = protocol === 'anthropic' ? createClaudeMessages(config.model, instructions) : providers[protocol];
    const deadline = AbortSignal.any([signal, AbortSignal.timeout(90000)]);
    let delivered = false;
    let receivedThought = '';
    let images = Boolean(turns[0].images?.length);
    let stream = true;
    let includeUsage = protocol === 'openai';
    let includeThoughts = protocol === 'openai' || config.thinkingEffort !== 'none';
    let terminalError;

    function accept(packet, response, finalPacket) {
        if (packet.error) throw httpAiError(packet, response, config, protocol);
        const result = provider.read(packet);
        if (result.usage && (finalPacket || result.finalUsage || result.done || result.truncated || result.refusal)) onUsage(result.usage);
        if (result.thought) {
            const delta = result.snapshot && receivedThought
                ? (result.thought.startsWith(receivedThought) ? result.thought.slice(receivedThought.length) : '')
                : result.thought;
            if (delta) {
                receivedThought += delta;
                onThought(delta);
            }
        }
        if (result.text && !(result.snapshot && delivered)) {
            delivered = true;
            onDelta(result.text);
        }
        if (result.truncated || result.refusal) {
            terminalError = new Error(result.truncated ? 'AI 回复达到长度限制，可重试' : 'AI 无法回答这条追问，可尝试换一种问法');
        }
        return result.done || Boolean(terminalError);
    }

    for (;;) {
        try {
            deadline.throwIfAborted();
            recordAiCall({ userId }, config.model);
            const response = await fetch(provider.url(config, stream), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...provider.auth(config.apiKey) },
                body: JSON.stringify(provider.body(config, turns, stream, includeUsage, includeThoughts)),
                signal: deadline
            });
            if (!response.ok) throw httpAiError(await response.json().catch(() => null), response, config, protocol);

            if (response.headers.get('content-type')?.includes('text/event-stream')) {
                let finished = false;
                for await (const data of streamPackets(response.body)) {
                    if (data === '[DONE]') { finished = true; break; }
                    finished = accept(JSON.parse(data), response, finished) || finished;
                }
                if (!finished) throw new Error('AI 回复中断，可重试');
            } else {
                // Some gateways return a regular completion even to a streaming request.
                const body = await response.json();
                const packets = Array.isArray(body) ? body : [body];
                packets.forEach((packet, index) => accept(packet, response, index === packets.length - 1));
            }
            if (terminalError) throw terminalError;
            if (!delivered) throw new Error('AI 未返回回复，可重试');
            return;
        } catch (error) {
            if (deadline.aborted) throw deadline.reason;
            if (delivered || receivedThought || terminalError) throw error;
            if (images && unsupportedImages(error)) {
                images = false;
                turns = turns.map(({ role, text }) => ({ role, text }));
                onImagesSkipped();
            } else if (stream && includeUsage && [400, 422].includes(error.status) && /stream_options|include_usage/i.test(error.providerMessage)) {
                includeUsage = false;
            } else if (includeThoughts && provider.retryThinking?.(error)) {
                continue;
            } else if (protocol === 'anthropic' && config.thinkingEffort && config.thinkingEffort !== 'none'
                && [400, 422].includes(error.status) && /effort|output_config/i.test(error.providerMessage)) {
                config = { ...config, thinkingEffort: '' };
            } else if (includeThoughts && (protocol !== 'openai' || !unsupportedThinking(error)) && [400, 403, 422].includes(error.status)
                && /include.?thoughts|summary|summaries|thinking|reasoning/i.test(error.providerMessage)) {
                includeThoughts = false;
            } else if (config.thinkingEffort && unsupportedThinking(error)) {
                config = { ...config, thinkingEffort: '' };
            } else if (stream && unsupportedStreaming(error, protocol)) {
                stream = false;
            } else {
                throw error;
            }
        }
    }
}

module.exports = { requestFollowup };

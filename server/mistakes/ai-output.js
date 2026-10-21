const object = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

function recognitionFormat(type, mode = 'single') {
    const string = { type: 'string' };
    const properties = { [type]: string };
    if (type !== 'analysis') {
        const coordinate = { type: 'integer', minimum: 0, maximum: 1000 };
        properties.figures = { type: 'array', items: object({
            id: string, imageIndex: { type: ['integer', 'null'], minimum: 1 },
            box_2d: { type: ['array', 'null'], items: coordinate, minItems: 4, maxItems: 4,
                description: 'Bounding box [ymin, xmin, ymax, xmax], normalized to 0–1000 relative to the submitted image.' },
            description: string
        }) };
        properties.issues = { type: 'array', items: object({ imageIndex: { type: ['integer', 'null'], minimum: 1 }, type: string, description: string }) };
    }
    if (type === 'question') {
        properties.subjectId = { type: ['string', 'null'] };
        properties.primaryPath = { type: 'array', items: string };
        properties.auxiliaryPaths = { type: 'array', items: { type: 'array', items: string } };
    }
    if (mode === 'page-entry') {
        properties.answer = string;
        properties.figures.items.properties.field = { type: 'string', enum: ['question', 'answer'] };
        properties.figures.items.required.push('field');
    }
    return { responseMimeType: 'application/json', responseJsonSchema: object(properties) };
}

function parseRecognitionJson(raw) {
    const content = raw.trim();
    // Accept one fenced object, including a gateway/model's introductory sentence.
    // Never repair escapes or infer missing braces: this could silently change formulas.
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const value = JSON.parse(content.startsWith('{') ? content : fenced ? fenced[1] : content);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Object.assign(new Error('Invalid AI result'), { code: 'INVALID_AI_RESULT' });
    for (const field of ['question', 'answer', 'analysis']) {
        if (typeof value[field] === 'string' && /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value[field])) {
            throw new SyntaxError('Invalid control character in recognition text; check LaTeX escaping');
        }
    }
    return value;
}

function sourceImageId(value, imageIds) {
    const integer = (value) => typeof value === 'number' && Number.isSafeInteger(value) ? value
        : typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : null;
    // Explicit indices refer to submitted order, never to database IDs.
    if (value?.imageIndex != null) return imageIds[integer(value.imageIndex) - 1] || 0;
    const id = integer(value?.imageId);
    return imageIds.includes(id) ? id : 0;
}

function figureLocation(figure, imageIds) {
    const imageId = sourceImageId(figure, imageIds);
    const bounds = figure?.bounds;
    const nativeBox = figure?.box_2d;
    // Gemini uses y/x corner coordinates; stored/client boxes use x/y/width/height.
    const candidate = nativeBox !== undefined
        ? Array.isArray(nativeBox) && nativeBox.length === 4 && nativeBox.every(Number.isFinite)
            ? [nativeBox[1] / 1000, nativeBox[0] / 1000, (nativeBox[3] - nativeBox[1]) / 1000, (nativeBox[2] - nativeBox[0]) / 1000] : null
        : bounds && typeof bounds === 'object' && !Array.isArray(bounds)
            ? [bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top]
            : figure?.box ?? figure?.bbox;
    const numeric = Array.isArray(candidate) && candidate.length === 4 && candidate.every(Number.isFinite)
        && (nativeBox !== undefined || !bounds || [bounds.left, bounds.top, bounds.right, bounds.bottom].every(Number.isFinite));
    const valid = numeric && candidate[0] >= 0 && candidate[0] < 1 && candidate[1] >= 0 && candidate[1] < 1 && candidate[2] > 0 && candidate[3] > 0
        && candidate[0] + candidate[2] <= 1.000001 && candidate[1] + candidate[3] <= 1.000001;
    const error = !imageId ? 'source' : !numeric ? 'format' : !valid ? 'bounds' : null;
    return { imageId, box: error ? null : [candidate[0], candidate[1], Math.min(candidate[2], 1 - candidate[0]), Math.min(candidate[3], 1 - candidate[1])], error };
}

module.exports = { recognitionFormat, parseRecognitionJson, sourceImageId, figureLocation };

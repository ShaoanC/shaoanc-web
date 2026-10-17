const { unified } = require('unified');
const remarkParse = require('remark-parse').default;
const remarkGfm = require('remark-gfm').default;
const remarkMath = require('remark-math').default;

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

function markdownImages(markdown) {
    const tree = parser.parse(markdown);
    const definitions = new Map();
    const images = [];
    function visit(node, callback) {
        callback(node);
        node.children?.forEach((child) => visit(child, callback));
    }
    visit(tree, (node) => {
        if (node.type === 'definition' && !definitions.has(node.identifier)) definitions.set(node.identifier, node);
    });
    visit(tree, (node) => {
        if (node.type !== 'image' && node.type !== 'imageReference') return;
        const source = node.type === 'image' ? node : definitions.get(node.identifier);
        if (!source) return;
        const match = source.url.match(/^\/api\/mistakes\/images\/(\d+)\/(crop|original)$/);
        images.push({ url: source.url, imageId: match ? Number(match[1]) : null, variant: match?.[2] || null,
            alt: node.alt || '', start: node.position.start.offset, end: node.position.end.offset });
    });
    return images;
}

function legacyFigureText(markdown, figures) {
    const byImage = new Map(figures.map((figure) => [figure.imageId, figure]));
    const included = new Set();
    const replacements = [];
    for (const image of markdownImages(markdown)) {
        const id = image.imageId || (/^\d+$/.test(image.url) ? Number(image.url) : null);
        const figure = byImage.get(id);
        if (!figure) continue;
        const marker = `[[figure:${figure.id}]]`;
        replacements.push({ ...image, replacement: included.has(id) ? '' : marker });
        included.add(id);
    }
    for (const image of replacements.reverse()) markdown = markdown.slice(0, image.start) + image.replacement + markdown.slice(image.end);
    for (const figure of figures) {
        if (!included.has(figure.imageId)) markdown += `\n\n[[figure:${figure.id}]]`;
    }
    return markdown;
}

function questionWithImages(question, imageIds, diagramImageIds = []) {
    const allowed = new Set(imageIds);
    const embedded = new Set();
    const replacements = [];
    const tree = parser.parse(question);
    const definitions = new Map();
    function visit(node, callback) {
        callback(node);
        node.children?.forEach((child) => visit(child, callback));
    }
    visit(tree, (node) => {
        if (node.type === 'definition' && !definitions.has(node.identifier)) definitions.set(node.identifier, node);
    });
    visit(tree, (node) => {
        if (node.type !== 'image' && node.type !== 'imageReference') return;
        const source = node.type === 'image' ? node : definitions.get(node.identifier);
        if (!source) return;
        const numeric = /^\d+$/.test(source.url);
        const match = source.url.match(/^\/api\/mistakes\/images\/(\d+)\/(?:crop|original)$/);
        const imageId = numeric ? Number(source.url) : match ? Number(match[1]) : null;
        if (!allowed.has(imageId)) return;
        let replacement;
        if (embedded.has(imageId) && node.alt === '题目配图') {
            replacement = '';
        } else if (numeric) {
            const alt = (node.alt || '').replace(/([\\\[\]])/g, '\\$1');
            const title = source.title ? ` "${source.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : '';
            replacement = `![${alt}](/api/mistakes/images/${imageId}/crop${title})`;
        }
        embedded.add(imageId);
        if (replacement !== undefined) replacements.push({ start: node.position.start.offset, end: node.position.end.offset, replacement });
    });
    // Replace only image nodes so formulas, code and the rest of the source keep their formatting.
    for (const { start, end, replacement } of replacements.reverse()) {
        question = question.slice(0, start) + replacement + question.slice(end);
    }
    for (const imageId of new Set(diagramImageIds)) {
        if (!allowed.has(imageId) || embedded.has(imageId)) continue;
        question += `\n\n![题目配图](/api/mistakes/images/${imageId}/crop)`;
        embedded.add(imageId);
    }
    return question;
}

module.exports = { questionWithImages, markdownImages, legacyFigureText };

const { unified } = require('unified');
const remarkParse = require('remark-parse').default;
const remarkGfm = require('remark-gfm').default;
const remarkMath = require('remark-math').default;

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

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

module.exports = { questionWithImages };

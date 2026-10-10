const MiniSearch = require('minisearch');
const { unified } = require('unified');
const remarkParse = require('remark-parse').default;
const remarkGfm = require('remark-gfm').default;
const remarkMath = require('remark-math').default;
const { db } = require('./database');

const MAX_CACHED_USERS = 10;
const SNIPPET_LENGTH = 120;
const BODY_FIELDS = ['question', 'answer', 'analysis', 'note'];
const SEARCH_FIELDS = [...BODY_FIELDS, 'subject', 'knowledgePoints'];
const FIELD_BOOSTS = { question: 4, answer: 2, analysis: 1, note: 1, subject: 2, knowledgePoints: 3 };
const wordSegmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
const graphemeSegmenter = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' });
const markdownParser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
const indexes = new Map();

function normalize(text) {
    return text.normalize('NFKC').toLowerCase();
}

function nodeText(node) {
    switch (node.type) {
        case 'text':
        case 'inlineCode':
        case 'code':
        case 'inlineMath':
        case 'math':
            return node.value;
        case 'image':
        case 'imageReference':
            return node.alt || '';
        case 'definition':
        case 'footnoteReference':
        case 'html':
            return '';
        case 'break':
        case 'thematicBreak':
            return ' ';
        case 'link': {
            const label = node.children.map(nodeText).join('');
            return label === node.url || `mailto:${label}` === node.url ? '' : label;
        }
        case 'paragraph':
        case 'heading':
        case 'strong':
        case 'emphasis':
        case 'delete':
        case 'linkReference':
        case 'tableCell':
            return node.children.map(nodeText).join('');
        default:
            return node.children ? node.children.map(nodeText).join(' ') : '';
    }
}

function plainText(markdown) {
    return nodeText(markdownParser.parse(markdown)).replace(/\s+/gu, ' ').trim();
}

function queryTokens(text) {
    const tokens = [];
    const runs = normalize(text).match(/\p{Script=Han}+|[^\p{Script=Han}]+/gu) || [];
    for (const run of runs) {
        // Keep common two-character queries intact, even if ICU splits them.
        if (/^\p{Script=Han}{2}$/u.test(run)) {
            tokens.push(run);
        } else {
            for (const segment of wordSegmenter.segment(run)) {
                if (segment.isWordLike) tokens.push(segment.segment);
            }
        }
    }
    return [...new Set(tokens)];
}

function visitIndexTokens(text, visit) {
    for (const segment of wordSegmenter.segment(text)) {
        if (segment.isWordLike) visit(segment.segment, segment.index, segment.index + segment.segment.length);
    }
    for (const run of text.matchAll(/\p{Script=Han}+/gu)) {
        const characters = [...run[0]];
        let offset = run.index;
        for (let index = 0; index < characters.length; index += 1) {
            const character = characters[index];
            visit(character, offset, offset + character.length);
            if (index + 1 < characters.length) {
                const pair = character + characters[index + 1];
                visit(pair, offset, offset + pair.length);
            }
            offset += character.length;
        }
    }
}

function indexTokens(text) {
    const normalized = normalize(text);
    const tokens = [];
    for (const segment of wordSegmenter.segment(normalized)) {
        if (segment.isWordLike) tokens.push(segment.segment);
    }
    const existing = new Set(tokens);
    const supplements = new Set();
    for (const run of normalized.matchAll(/\p{Script=Han}+/gu)) {
        const characters = [...run[0]];
        for (let index = 0; index < characters.length; index += 1) {
            supplements.add(characters[index]);
            if (index + 1 < characters.length) supplements.add(characters[index] + characters[index + 1]);
        }
    }
    for (const term of supplements) {
        if (!existing.has(term)) tokens.push(term);
    }
    return tokens;
}

function loadDirectory() {
    return {
        subjects: new Map(db.prepare('SELECT id, name FROM subjects').all().map((row) => [row.id, row.name])),
        points: new Map(db.prepare('SELECT id, name FROM knowledge_points').all().map((row) => [row.id, row.name]))
    };
}

function fieldText(row, field, directory) {
    if (BODY_FIELDS.includes(field)) return plainText(row[field]);
    if (field === 'subject') return directory.subjects.get(row.subject_id) || '';
    const ids = [row.primary_knowledge_point_id, ...JSON.parse(row.auxiliary_knowledge_point_ids)];
    return [...new Set(ids)].map((id) => directory.points.get(id)).filter(Boolean).join(' · ');
}

function documentFor(row, directory) {
    return Object.fromEntries([['id', row.id], ...SEARCH_FIELDS.map((field) => [field, fieldText(row, field, directory)])]);
}

function cachedIndex(userId) {
    const index = indexes.get(userId);
    if (index) {
        indexes.delete(userId);
        indexes.set(userId, index);
    }
    return index;
}

function userIndex(userId, directory) {
    const existing = cachedIndex(userId);
    if (existing) return existing;
    const index = new MiniSearch({
        fields: SEARCH_FIELDS,
        storeFields: [],
        tokenize: indexTokens,
        processTerm: normalize
    });
    for (const row of db.prepare('SELECT * FROM mistakes WHERE user_id = ?').iterate(userId)) {
        index.add(documentFor(row, directory));
    }
    indexes.set(userId, index);
    if (indexes.size > MAX_CACHED_USERS) indexes.delete(indexes.keys().next().value);
    return index;
}

function updateCachedMistake(userId, row) {
    const index = cachedIndex(userId);
    if (!index) return;
    const document = documentFor(row, loadDirectory());
    if (index.has(row.id)) index.replace(document);
    else index.add(document);
}

function removeCachedMistake(userId, id) {
    const index = cachedIndex(userId);
    if (index && index.has(id)) index.discard(id);
}

function invalidateUser(userId) {
    indexes.delete(userId);
}

function invalidateAll() {
    indexes.clear();
}

function supportsPrefix(term, terms) {
    return term === terms[terms.length - 1] && /^[a-z]{2,}$/.test(term);
}

function supportsFuzzy(term) {
    return /^[a-z]{5,}$/.test(term);
}

function withinOneEdit(first, second) {
    if (Math.abs(first.length - second.length) > 1) return false;
    let left = 0;
    let right = 0;
    let edits = 0;
    while (left < first.length && right < second.length) {
        if (first[left] === second[right]) {
            left += 1;
            right += 1;
        } else {
            edits += 1;
            if (edits > 1) return false;
            if (first.length >= second.length) left += 1;
            if (second.length >= first.length) right += 1;
        }
    }
    return edits + (first.length - left) + (second.length - right) <= 1;
}

function relatedQueryTerms(actualTerm, queryTerms) {
    return queryTerms.filter((term) => actualTerm === term ||
        (supportsPrefix(term, queryTerms) && actualTerm.startsWith(term)) ||
        (supportsFuzzy(term) && withinOneEdit(actualTerm, term)));
}

function normalizedProjection(text) {
    let normalized = '';
    const starts = [];
    const ends = [];
    for (const segment of graphemeSegmenter.segment(text)) {
        const value = normalize(segment.segment);
        normalized += value;
        for (let index = 0; index < value.length; index += 1) {
            starts.push(segment.index);
            ends.push(segment.index + segment.segment.length);
        }
    }
    return { normalized, starts, ends };
}

function snippetSegments(text, matchedTerms) {
    const projection = normalizedProjection(text);
    const ranges = [];
    visitIndexTokens(projection.normalized, (term, start, end) => {
        if (matchedTerms.has(term)) {
            ranges.push({ start: projection.starts[start], end: projection.ends[end - 1] });
        }
    });
    ranges.sort((first, second) => first.start - second.start || first.end - second.end);
    const merged = [];
    for (const range of ranges) {
        const previous = merged[merged.length - 1];
        if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
        else merged.push({ ...range });
    }
    if (!merged.length) return [];

    const characters = [...text];
    const offsets = [0];
    for (const character of characters) offsets.push(offsets[offsets.length - 1] + character.length);
    let hit = offsets.findIndex((offset) => offset >= merged[0].start);
    if (hit < 0) hit = 0;
    const startCharacter = Math.max(0, hit - 35);
    const start = offsets[startCharacter];
    const end = offsets[Math.min(characters.length, startCharacter + SNIPPET_LENGTH)];
    const segments = [];
    if (start > 0) segments.push({ text: '…', matched: false });
    let cursor = start;
    for (const range of merged) {
        if (range.start >= end) break;
        if (range.end <= start) continue;
        const rangeStart = Math.max(range.start, start);
        const rangeEnd = Math.min(range.end, end);
        if (cursor < rangeStart) segments.push({ text: text.slice(cursor, rangeStart), matched: false });
        segments.push({ text: text.slice(rangeStart, rangeEnd), matched: true });
        cursor = rangeEnd;
    }
    if (cursor < end) segments.push({ text: text.slice(cursor, end), matched: false });
    if (end < text.length) segments.push({ text: '…', matched: false });
    return segments;
}

function searchMetadata(row, result, terms, directory) {
    const fields = new Map();
    for (const [actualTerm, fieldNames] of Object.entries(result.match)) {
        const related = relatedQueryTerms(actualTerm, terms);
        for (const field of fieldNames) {
            if (!fields.has(field)) fields.set(field, { field, terms: new Set(), queries: new Set() });
            const entry = fields.get(field);
            entry.terms.add(actualTerm);
            for (const query of related) entry.queries.add(query);
        }
    }
    const snippets = [...fields.values()]
        .sort((first, second) => second.queries.size - first.queries.size ||
            FIELD_BOOSTS[second.field] - FIELD_BOOSTS[first.field] ||
            SEARCH_FIELDS.indexOf(first.field) - SEARCH_FIELDS.indexOf(second.field))
        .slice(0, 2)
        .map((entry) => ({ field: entry.field, segments: snippetSegments(fieldText(row, entry.field, directory), entry.terms) }))
        .filter((snippet) => snippet.segments.length);
    return { matchedTermCount: new Set(result.queryTerms).size, totalTermCount: terms.length, snippets };
}

function searchMistakes(userId, rows, keyword) {
    const terms = queryTokens(keyword);
    if (!terms.length || !rows.length) return [];
    const directory = loadDirectory();
    const allowedRows = new Map(rows.map((row) => [row.id, row]));
    const matches = userIndex(userId, directory).search(keyword, {
        tokenize: () => terms,
        combineWith: 'OR',
        boost: FIELD_BOOSTS,
        prefix: (term) => supportsPrefix(term, terms),
        fuzzy: (term) => supportsFuzzy(term) ? 1 : false,
        filter: (result) => allowedRows.has(result.id)
    });
    matches.sort((first, second) => new Set(second.queryTerms).size - new Set(first.queryTerms).size ||
        second.score - first.score ||
        allowedRows.get(second.id).updated_at.localeCompare(allowedRows.get(first.id).updated_at) || second.id - first.id);
    return matches.map((result) => {
        const row = allowedRows.get(result.id);
        return { row, search: searchMetadata(row, result, terms, directory) };
    });
}

module.exports = { searchMistakes, updateCachedMistake, removeCachedMistake, invalidateUser, invalidateAll };

const assert = require('node:assert/strict');

const snippetFields = new Set(['question', 'answer', 'analysis', 'note', 'subject', 'knowledgePoints']);

function assertSearchMetadata(mistake) {
    assert.ok(mistake.search, 'Keyword results include search metadata');
    const { matchedTermCount, totalTermCount, snippets } = mistake.search;
    assert.ok(Number.isInteger(matchedTermCount) && matchedTermCount > 0);
    assert.ok(Number.isInteger(totalTermCount) && totalTermCount >= matchedTermCount);
    assert.ok(Array.isArray(snippets) && snippets.length > 0);
    for (const snippet of snippets) {
        assert.ok(snippetFields.has(snippet.field));
        assert.ok(Array.isArray(snippet.segments) && snippet.segments.length > 0);
        assert.ok(snippet.segments.every((segment) => typeof segment.text === 'string' && typeof segment.matched === 'boolean'));
        assert.ok(snippet.segments.every((segment) => segment.type === undefined ||
            (segment.type === 'math' && typeof segment.display === 'boolean')));
        assert.ok(snippet.segments.some((segment) => segment.matched));
    }
}

function assertHighlighted(mistake, field, pattern) {
    assertSearchMetadata(mistake);
    const marked = mistake.search.snippets
        .filter((snippet) => snippet.field === field)
        .flatMap((snippet) => snippet.segments.filter((segment) => segment.matched))
        .map((segment) => segment.text.normalize('NFKC'))
        .join(' ');
    assert.match(marked, pattern, `The ${field} snippet highlights its actual matched text`);
}

async function runSearchSmoke({ alice, bob, admin }) {
    const mistakes = new Map();
    const points = new Set();
    let hasTestData = false;
    const search = (actor, keyword, filters = {}) => actor('GET', `/mistakes?${new URLSearchParams({ keyword, ...filters })}`);
    const createPoint = async (name, parentId = null) => {
        const point = await admin('POST', '/knowledge-points', { subjectId: 'math', name, parentId }, 201);
        points.add(point.id);
        return point;
    };
    const createMistake = async (actor, body) => {
        const mistake = await actor('POST', '/mistakes', {
            subjectId: 'math', lifecycle: 'archived', primaryKnowledgePointId: null,
            auxiliaryKnowledgePointIds: [], answer: '', analysis: '', note: '', ...body
        }, 201);
        mistakes.set(mistake.id, actor);
        return mistake;
    };
    try {
        const rootPoint = await createPoint('SearchRootTag');
        const primaryPoint = await createPoint('AlgebraOldTag', rootPoint.id);
        const auxiliaryPoint = await createPoint('AuxiliaryTag', rootPoint.id);
        const full = await createMistake(alice, {
            primaryKnowledgePointId: primaryPoint.id,
            auxiliaryKnowledgePointIds: [auxiliaryPoint.id],
            question: '## 二次函数与导数\n\n**函数**的图像：ＧＥＯＭＥＴＲＹ，$f(x)=x^2$。\n\n[公式资料](https://hiddenurlslug.example/path)',
            answer: '$x=2$', analysis: '计算导数并判断极值。', note: '检查符号。'
        });
        const partial = await createMistake(alice, {
            primaryKnowledgePointId: primaryPoint.id,
            question: '三角函数的图像与性质 DeleteOnlyMarker'
        });
        const sequence = await createMistake(alice, {
            auxiliaryKnowledgePointIds: [auxiliaryPoint.id], question: '等差数列与微积分'
        });
        const draft = await createMistake(alice, {
            primaryKnowledgePointId: primaryPoint.id, lifecycle: 'draft', question: '函数与导数的草稿'
        });
        const physics = await createMistake(alice, { subjectId: 'physics', question: '函数与导数用于描述运动' });
        const foreign = await createMistake(bob, {
            primaryKnowledgePointId: auxiliaryPoint.id, auxiliaryKnowledgePointIds: [primaryPoint.id],
            question: '二次函数与导数；私有账号'
        });

        // Chinese segmentation, partial matches, normalization and readable highlights.
        for (const keyword of ['函数 导数', '函数导数']) {
            const results = await search(alice, keyword, { subjectId: 'math' });
            assert.equal(results[0].id, full.id, 'All query terms rank before partial matches');
            assert.equal(results[0].search.matchedTermCount, 2);
            assert.equal(results[0].search.totalTermCount, 2);
            const partialResult = results.find((mistake) => mistake.id === partial.id);
            assert.ok(partialResult, 'A result matching only one word remains visible');
            assert.equal(partialResult.search.matchedTermCount, 1);
            assert.ok(results.every((mistake) => mistake.id !== foreign.id && mistake.id !== draft.id));
            assertHighlighted(results[0], 'question', /函数/);
        }
        for (const [keyword, expectedId] of [['数', sequence.id], ['数列', sequence.id], ['积分', sequence.id]]) {
            assert.ok((await search(alice, keyword)).some((mistake) => mistake.id === expectedId),
                'Short Chinese keywords match inside compound words');
        }
        for (const keyword of ['ＧＥＯＭＥＴＲＹ', 'geom', 'geometty']) {
            const results = await search(alice, keyword);
            assert.deepEqual(results.map((mistake) => mistake.id), [full.id]);
            assertHighlighted(results[0], 'question', /geometry/i);
            const text = results[0].search.snippets.flatMap((snippet) => snippet.segments).map((segment) => segment.text).join('');
            assert.ok(!text.includes('https://') && !text.includes('##') && !text.includes('**'),
                'Snippets contain readable Markdown text rather than syntax or URL destinations');
        }
        assert.deepEqual(await search(alice, 'hiddenurlslug'), [], 'Markdown link destinations are not indexed');

        // Search remains account-scoped and composes with the existing SQL filters.
        assert.deepEqual((await search(bob, '函数 导数')).map((mistake) => mistake.id), [foreign.id]);
        await alice('POST', `/mistakes/${full.id}/reviews`, { result: 'mastered' }, 201);
        const combined = await search(alice, '函数 导数', {
            subjectId: 'math', knowledgePointId: String(rootPoint.id), status: 'mastered', dataType: 'formal'
        });
        assert.deepEqual(combined.map((mistake) => mistake.id), [full.id]);
        assert.ok(!combined.some((mistake) => mistake.id === physics.id));
        const descendants = await search(alice, '数学', { knowledgePointId: String(rootPoint.id) });
        assert.deepEqual(descendants.map((mistake) => mistake.id).sort((a, b) => a - b),
            [full.id, partial.id, sequence.id].sort((a, b) => a - b));
        assertHighlighted(descendants.find((mistake) => mistake.id === sequence.id), 'subject', /数学/);
        assert.deepEqual((await search(alice, '数列', { knowledgePointId: String(auxiliaryPoint.id) }))
            .map((mistake) => mistake.id), [sequence.id], 'Auxiliary knowledge points participate in filters');
        assert.deepEqual((await search(alice, '函数 导数', { lifecycle: 'draft' })).map((mistake) => mistake.id), [draft.id]);
        const primaryMatches = await search(alice, 'AlgebraOldTag');
        assertHighlighted(primaryMatches.find((mistake) => mistake.id === full.id), 'knowledgePoints', /algebraoldtag/i);
        const auxiliaryMatches = await search(alice, 'AuxiliaryTag');
        assertHighlighted(auxiliaryMatches.find((mistake) => mistake.id === sequence.id), 'knowledgePoints', /auxiliarytag/i);

        // Excerpts strip Markdown formatting while preserving complete, typed formulas.
        const inlineFormula = String.raw`f(x)=\frac{MathSignal^2}{2}`;
        const displayFormula = String.raw`\tag{1} DisplaySignal=\sqrt{4}`;
        const formulaMistake = await createMistake(alice, {
            question: `## 摘要样例\n\n**SnippetSignal** 与 $${inlineFormula}$；[链接文字](https://snippet-hidden.example/path)。`,
            answer: `计算步骤：\n\n$$\n${displayFormula}\n$$`
        });
        const mixedResults = await search(alice, 'SnippetSignal');
        assert.deepEqual(mixedResults.map((mistake) => mistake.id), [formulaMistake.id]);
        assertHighlighted(mixedResults[0], 'question', /SnippetSignal/i);
        const mixedSegments = mixedResults[0].search.snippets.find((snippet) => snippet.field === 'question').segments;
        assert.deepEqual(mixedSegments.filter((segment) => segment.type === 'math'), [
            { text: inlineFormula, matched: false, type: 'math', display: false }
        ], 'Text matches retain nearby formulas without falsely highlighting them');
        const mixedText = mixedSegments.map((segment) => segment.text).join('');
        assert.ok(mixedText.includes('摘要样例') && mixedText.includes('链接文字'));
        assert.ok(!/##|\*\*|https:\/\/|\$/.test(mixedText), 'Excerpts exclude Markdown markers and formula delimiters');
        const mathResults = await search(alice, 'MathSignal');
        assert.deepEqual(mathResults.map((mistake) => mistake.id), [formulaMistake.id]);
        assertSearchMetadata(mathResults[0]);
        const mathSegments = mathResults[0].search.snippets.find((snippet) => snippet.field === 'question').segments;
        assert.deepEqual(mathSegments.filter((segment) => segment.matched), [
            { text: inlineFormula, matched: true, type: 'math', display: false }
        ], 'A match inside a formula highlights its complete source');
        const displayResults = await search(alice, 'DisplaySignal');
        assert.deepEqual(displayResults.map((mistake) => mistake.id), [formulaMistake.id]);
        assertSearchMetadata(displayResults[0]);
        assert.deepEqual(displayResults[0].search.snippets.find((snippet) => snippet.field === 'answer').segments
            .filter((segment) => segment.type === 'math'), [
            { text: displayFormula, matched: true, type: 'math', display: true }
        ], 'Display formulas retain their original rendering mode');

        const longFormula = `${Array.from({ length: 32 }, (_, index) => `a_{${index}}`).join('+')}+BoundarySignal`;
        const boundaryMistake = await createMistake(alice, {
            question: `**WindowSignal** ${'前文'.repeat(24)} $${longFormula}$ ${'后文'.repeat(50)}`
        });
        for (const keyword of ['WindowSignal', 'BoundarySignal']) {
            const boundaryResults = await search(alice, keyword);
            assert.deepEqual(boundaryResults.map((mistake) => mistake.id), [boundaryMistake.id]);
            assertSearchMetadata(boundaryResults[0]);
            const boundarySegments = boundaryResults[0].search.snippets.find((snippet) => snippet.field === 'question').segments;
            assert.deepEqual(boundarySegments.filter((segment) => segment.type === 'math'), [
                { text: longFormula, matched: keyword === 'BoundarySignal', type: 'math', display: false }
            ], 'A formula remains whole when either context boundary falls inside it');
            assert.ok(boundarySegments.some((segment) => segment.text === '…'), 'Long excerpts still indicate omitted context');
        }

        // Writes update the shared index, including metadata changes across accounts.
        await alice('PATCH', `/mistakes/${full.id}`, { question: 'ReplacementSignal 的新题干' });
        assert.deepEqual(await search(alice, 'geometry'), [], 'Editing removes the old indexed text immediately');
        assert.deepEqual((await search(alice, 'ReplacementSignal')).map((mistake) => mistake.id), [full.id]);
        assert.deepEqual((await search(alice, 'DeleteOnlyMarker')).map((mistake) => mistake.id), [partial.id]);
        await alice('DELETE', `/mistakes/${partial.id}`);
        assert.deepEqual(await search(alice, 'DeleteOnlyMarker'), [], 'Soft deletion invalidates the active search cache');
        const trashSearch = await search(alice, 'DeleteOnlyMarker', { deleted: 'true', lifecycle: 'all' });
        assert.deepEqual(trashSearch.map((mistake) => mistake.id), [partial.id], 'Trash supports the same keyword search');
        assertSearchMetadata(trashSearch[0]);
        assert.deepEqual(await search(bob, 'DeleteOnlyMarker', { deleted: 'true', lifecycle: 'all' }), []);
        await alice('POST', `/mistakes/${partial.id}/restore`);
        assert.deepEqual((await search(alice, 'DeleteOnlyMarker')).map((mistake) => mistake.id), [partial.id],
            'Restoring invalidates a warm search cache and makes the mistake searchable again');
        assert.deepEqual(await search(alice, 'DeleteOnlyMarker', { deleted: 'true', lifecycle: 'all' }), []);
        await alice('DELETE', `/mistakes/${partial.id}`);
        await admin('PATCH', `/knowledge-points/${primaryPoint.id}`, { name: 'TopologyNewTag' });
        for (const [actor, expectedId] of [[alice, full.id], [bob, foreign.id]]) {
            assert.deepEqual(await search(actor, 'AlgebraOldTag'), [], 'Renaming invalidates old metadata for every account');
            assert.ok((await search(actor, 'TopologyNewTag')).some((mistake) => mistake.id === expectedId));
        }
        assert.deepEqual((await search(alice, 'TopologyNewTag', { deleted: 'true', lifecycle: 'all' }))
            .map((mistake) => mistake.id), [partial.id], 'Knowledge-point renaming also updates trash search');
        await admin('DELETE', `/knowledge-points/${primaryPoint.id}`);
        points.delete(primaryPoint.id);
        assert.deepEqual(await search(alice, 'TopologyNewTag'), []);
        assert.deepEqual(await search(bob, 'TopologyNewTag'), []);
        assert.equal((await alice('GET', `/mistakes/${full.id}`)).primaryKnowledgePointId, null);
        assert.equal((await alice('GET', `/mistakes/${partial.id}`)).primaryKnowledgePointId, null,
            'Deleting metadata clears references on trashed mistakes');
        assert.deepEqual((await bob('GET', `/mistakes/${foreign.id}`)).auxiliaryKnowledgePointIds, [],
            'Deleting metadata clears primary and auxiliary references across accounts');
        assert.equal((await admin('POST', '/mistakes/test-data', undefined, 201)).count, 6);
        hasTestData = true;
        const samples = await search(admin, '数学', { lifecycle: 'all', dataType: 'test' });
        assert.ok(samples.length > 0 && samples.every((mistake) => mistake.isTest));
        assert.deepEqual(await search(admin, '数学', { lifecycle: 'all', dataType: 'formal' }), []);
        assert.equal((await admin('DELETE', '/mistakes/test-data')).count, 6);
        hasTestData = false;
        assert.deepEqual(await search(admin, '数学', { lifecycle: 'all', dataType: 'test' }), [],
            'Bulk deletion removes generated samples from the search index');
        const ordinary = await alice('GET', '/mistakes');
        const whitespace = await search(alice, '   ');
        assert.deepEqual(whitespace.map((mistake) => mistake.id), ordinary.map((mistake) => mistake.id));
        assert.ok(whitespace.every((mistake) => !Object.hasOwn(mistake, 'search')), 'Blank searches retain ordinary list responses');
        assert.deepEqual(await search(alice, '!!!'), [], 'A nonblank query without searchable terms returns no results');
    } finally {
        if (hasTestData) await admin('DELETE', '/mistakes/test-data');
        await admin('DELETE', '/mistakes/trash');
        for (const [id, actor] of mistakes) {
            await actor('DELETE', `/mistakes/${id}`);
            await actor('DELETE', `/mistakes/${id}/permanent`);
        }
        for (const id of [...points].reverse()) await admin('DELETE', `/knowledge-points/${id}`);
    }
}

module.exports = { runSearchSmoke };

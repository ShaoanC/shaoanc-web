import { useMemo } from 'react';
import katex from 'katex';
import type { MistakeSearch } from './types';
import { leadingPunctuation } from './text-layout';
import 'katex/dist/katex.min.css';
import './text-layout.css';

const FIELD_LABELS: Record<MistakeSearch['snippets'][number]['field'], string> = {
  question: '题干',
  answer: '答案',
  analysis: '解析',
  note: '笔记',
  subject: '学科',
  knowledgePoints: '知识点',
};

export function SearchSummary({ search }: { search?: MistakeSearch }) {
  const snippets = search?.snippets.filter((snippet) => snippet.field !== 'question').slice(0, 2) || [];
  if (snippets.length === 0) return null;

  return <div className="search-summary">
    {snippets.map((snippet, snippetIndex) => <p className="search-snippet" key={`${snippet.field}-${snippetIndex}`}>
      <span className="search-snippet-label">{FIELD_LABELS[snippet.field]}</span>
      <SearchSnippetText snippet={snippet} />
    </p>)}
  </div>;
}

export function SearchSnippetText({ snippet }: { snippet: MistakeSearch['snippets'][number] }) {
  const segments = snippet.segments.map((segment) => ({ ...segment }));
  return <span className="search-snippet-text">{segments.map((segment, index) => {
    const next = segments[index + 1];
    const punctuation = segment.type === 'math' && next && next.type !== 'math' ? next.text.match(leadingPunctuation)?.[0] : null;
    if (!punctuation) return <SearchSegment key={index} segment={segment} />;
    next.text = next.text.slice(punctuation.length);
    return <span className="math-punctuation" key={index}><SearchSegment segment={segment} /><SearchSegment segment={{ ...next, text: punctuation }} /></span>;
  })}</span>;
}

function SearchSegment({ segment }: { segment: MistakeSearch['snippets'][number]['segments'][number] }) {
  const formula = useMemo(() => {
    if (segment.type !== 'math') return null;
    try {
      return katex.renderToString(segment.text, { displayMode: Boolean(segment.display), throwOnError: true });
    } catch {
      return null;
    }
  }, [segment.type, segment.text, segment.display]);
  const Tag = segment.matched ? 'mark' : 'span';

  if (formula === null) return <Tag>{segment.text}</Tag>;
  return <Tag className={`search-snippet-math${segment.display ? ' is-display' : ''}`} dangerouslySetInnerHTML={{ __html: formula }} />;
}

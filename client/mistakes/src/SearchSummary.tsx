import { useMemo } from 'react';
import katex from 'katex';
import type { MistakeSearch } from './types';
import 'katex/dist/katex.min.css';

const FIELD_LABELS: Record<MistakeSearch['snippets'][number]['field'], string> = {
  question: '题干',
  answer: '答案',
  analysis: '解析',
  note: '笔记',
  subject: '学科',
  knowledgePoints: '知识点',
};

export function SearchSummary({ search }: { search?: MistakeSearch }) {
  if (!search || search.snippets.length === 0) return null;

  return <div className="search-summary">
    {search.snippets.slice(0, 2).map((snippet, snippetIndex) => <p className="search-snippet" key={`${snippet.field}-${snippetIndex}`}>
      <span className="search-snippet-label">{FIELD_LABELS[snippet.field]}</span>
      <span className="search-snippet-text">{snippet.segments.map((segment, segmentIndex) => <SearchSegment key={segmentIndex} segment={segment} />)}</span>
    </p>)}
  </div>;
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

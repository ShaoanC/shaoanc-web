import type { MistakeSearch } from './types';

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
      <span className="search-snippet-text">{snippet.segments.map((segment, segmentIndex) => segment.matched
        ? <mark key={segmentIndex}>{segment.text}</mark>
        : <span key={segmentIndex}>{segment.text}</span>)}</span>
    </p>)}
  </div>;
}

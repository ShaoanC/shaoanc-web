import { knowledgeLabel, useApp } from './context';
import { Select } from './Select';
import { RATING_OPTIONS } from './StarRating';
import { knowledgeForSubjects, updateMistakeFilter, type MistakeFilters } from './mistake-filters';

export function MistakeFilterFields({ filters, onChange, portalContainer, withLabels = false, review = false }: {
  filters: MistakeFilters;
  onChange: (filters: MistakeFilters) => void;
  portalContainer?: HTMLElement | null;
  withLabels?: boolean;
  review?: boolean;
}) {
  const { subjects, knowledgePoints } = useApp();
  const subjectKnowledge = knowledgeForSubjects(filters.subjectId, knowledgePoints);
  const fields = [
    { key: 'subjectId' as const, label: '学科', options: [{ value: '', label: '全部学科' }, ...subjects.map((subject) => ({ value: subject.id, label: subject.name }))] },
    { key: 'knowledgePointId' as const, label: '知识点', searchable: true, options: [{ value: '', label: '全部知识点' }, ...subjectKnowledge.map((point) => ({ value: String(point.id), label: knowledgeLabel(knowledgePoints, point.id) }))] },
    { key: 'status' as const, label: '掌握程度', options: [{ value: '', label: '全部掌握程度' }, { value: 'unreviewed', label: '未复习' }, { value: 'unknown', label: '不会' }, { value: 'familiar', label: '不熟' }, { value: 'mastered', label: '掌握' }] },
    { key: 'rating' as const, label: '星级', options: RATING_OPTIONS },
  ];
  return <>{fields.map((field) => {
    const control = <Select key={field.key} multiple ariaLabel={review ? `复习${field.label}` : `按${field.label}筛选`} value={filters[field.key]} searchable={field.searchable} options={field.options} portalContainer={portalContainer}
      onChange={(values) => onChange(updateMistakeFilter(filters, field.key, values, knowledgePoints))} />;
    return withLabels ? <div key={field.key} className="field library-filter-field" data-base-ui-swipe-ignore=""><span>{field.label}</span>{control}</div> : control;
  })}</>;
}

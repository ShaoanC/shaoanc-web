import type { KnowledgePoint } from './types';

export type MistakeFilters = { subjectId: string[]; knowledgePointId: string[]; status: string[]; rating: string[] };
export const EMPTY_FILTERS: MistakeFilters = { subjectId: [], knowledgePointId: [], status: [], rating: [] };

export function knowledgeForSubjects(subjectIds: string[], knowledgePoints: KnowledgePoint[]) {
  return knowledgePoints.filter((point) => !subjectIds.length || subjectIds.includes(point.subjectId));
}

export function updateMistakeFilter(filters: MistakeFilters, key: keyof MistakeFilters, values: string[], knowledgePoints: KnowledgePoint[]): MistakeFilters {
  return {
    ...filters,
    [key]: values,
    ...(key === 'subjectId' ? { knowledgePointId: filters.knowledgePointId.filter((id) =>
      knowledgeForSubjects(values, knowledgePoints).some((point) => String(point.id) === id)) } : {}),
  };
}

export function mistakeFilterQuery(filters: MistakeFilters, initial: Record<string, string> = {}) {
  const query = new URLSearchParams(initial);
  for (const key of Object.keys(filters) as (keyof MistakeFilters)[]) {
    if (filters[key].length) query.set(key, [...filters[key]].sort().join(','));
  }
  return query;
}

import type { KnowledgePoint, Mistake, Subject } from './types';

export interface ExportOptions {
  title: string;
  version: 'complete' | 'practice';
  includeNotes: boolean;
  fontSize: 10.5 | 12 | 14;
  layout: 'continuous' | 'per-question';
  practiceSpace: number;
  answerPlacement: 'inline' | 'appendix';
}

export const defaultExportOptions: ExportOptions = {
  title: '错题', version: 'complete', includeNotes: true, fontSize: 12,
  layout: 'continuous', practiceSpace: 60, answerPlacement: 'inline',
};

export type ExportSource = { ids: number[] } | { filters: Record<string, string> };
export interface ExportRequest { source: ExportSource; options: ExportOptions }
export interface ExportDocumentData {
  mistakes: Mistake[];
  subjects: Subject[];
  knowledgePoints: KnowledgePoint[];
  options: ExportOptions;
  date: string;
}

export interface ExportFile { blob: Blob; url: string; filename: string; count: number }

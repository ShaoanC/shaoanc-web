import type { AiInput } from './ai-types';
import type { Lifecycle } from './types';

export type EditorForm = AiInput & { note: string; rating: number; lifecycle: Lifecycle };
export const editorFormKeys: (keyof EditorForm)[] = ['question', 'answer', 'analysis', 'note', 'rating', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds', 'lifecycle'];
export const emptyEditorForm: EditorForm = { question: '', answer: '', analysis: '', note: '', rating: 0, subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [], lifecycle: 'draft' };
export const sameEditorValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export interface EditorDraft {
  version: 1;
  clientId: string;
  data: EditorForm;
  baseline: EditorForm | null;
  creationInput?: EditorForm;
  updatedAt: number;
}

export function editorForm(value: EditorForm): EditorForm {
  return { question: value.question, answer: value.answer, analysis: value.analysis, note: value.note, rating: value.rating, subjectId: value.subjectId, primaryKnowledgePointId: value.primaryKnowledgePointId, auxiliaryKnowledgePointIds: [...value.auxiliaryKnowledgePointIds], lifecycle: value.lifecycle };
}

export function editorChanges(data: EditorForm, baseline: EditorForm | null): (keyof EditorForm)[] {
  return editorFormKeys.filter((key) => !baseline || !sameEditorValue(data[key], baseline[key]));
}

export function hasEditorChanges(data: EditorForm, baseline: EditorForm | null): boolean {
  // Selecting the default subject alone does not create an empty local draft.
  return editorChanges(data, baseline || { ...emptyEditorForm, subjectId: data.subjectId }).length > 0;
}

export function editorSavePayload(data: EditorForm, baseline: EditorForm | null, clientId: string) {
  const keys = editorChanges(data, baseline);
  const changed = Object.fromEntries(keys.map((key) => [key, data[key]]));
  return baseline
    ? { ...changed, expectedFields: Object.fromEntries(keys.map((key) => [key, baseline[key]])) }
    : { ...changed, clientId };
}

/** Keep edits made during the request, including when a repeated POST returns an older saved snapshot. */
export function reconcileEditorSave(current: EditorForm, submitted: EditorForm, saved: EditorForm): EditorForm {
  const next = editorForm(current);
  for (const key of editorFormKeys) {
    if (!sameEditorValue(current[key], submitted[key])) continue;
    Object.assign(next, { [key]: saved[key] });
  }
  return next;
}

/** Refresh untouched fields while retaining the original values of edited fields for conflict checking. */
export function restoreEditorDraft(draft: EditorDraft, latest: EditorForm): { data: EditorForm; baseline: EditorForm } {
  const data = editorForm(latest);
  const baseline = editorForm(latest);
  for (const key of editorChanges(draft.data, draft.baseline)) {
    Object.assign(data, { [key]: draft.data[key] });
    if (draft.baseline) Object.assign(baseline, { [key]: draft.baseline[key] });
  }
  return { data, baseline };
}

export const editorDraftKey = (userId: number, recordId?: number) => `mistakes-editor-draft:${userId}:${recordId || 'new'}`;

export function readEditorDraft(storage: Storage, userId: number, recordId?: number): EditorDraft | null {
  try {
    const value = JSON.parse(storage.getItem(editorDraftKey(userId, recordId)) || 'null') as EditorDraft | null;
    if (!value || value.version !== 1 || typeof value.clientId !== 'string' || !value.data) return null;
    const form = value.data;
    if (!['question', 'answer', 'analysis', 'note'].every((key) => typeof form[key as keyof EditorForm] === 'string') || !Array.isArray(form.auxiliaryKnowledgePointIds)) return null;
    return value;
  } catch { return null; }
}

export function clearEditorDraft(storage: Storage, userId: number, recordId: number | undefined, clientId: string): void {
  if (readEditorDraft(storage, userId, recordId)?.clientId === clientId) storage.removeItem(editorDraftKey(userId, recordId));
}

export function writeEditorDraft(storage: Storage, userId: number, recordId: number | undefined, draft: EditorDraft): void {
  if (hasEditorChanges(draft.data, draft.baseline)) storage.setItem(editorDraftKey(userId, recordId), JSON.stringify(draft));
  else clearEditorDraft(storage, userId, recordId, draft.clientId);
}

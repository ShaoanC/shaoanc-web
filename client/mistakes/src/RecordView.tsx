import { createContext, useContext } from 'react';

export interface RecordView {
  path: string;
  requestId: number;
  navigate: (path: string) => void;
  saved: () => void;
  updated: (id: number) => void;
  registerLeaveCheck: (check: () => boolean) => () => void;
  actionsContainer: HTMLElement | null;
  retainsEditor: boolean;
}

export const RecordViewContext = createContext<RecordView | null>(null);
export const useRecordView = () => useContext(RecordViewContext);

export function recordTarget(path: string) {
  const match = path.split('?')[0].match(/^\/mistakes\/(\d+)(\/edit)?$/);
  return match ? { id: Number(match[1]), editing: Boolean(match[2]) } : null;
}

export const RECORD_TOAST_EVENT = 'mistakes:open-toast-record';

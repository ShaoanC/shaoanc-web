import { createContext, useContext } from 'react';
import type { KnowledgePoint, Subject, User } from './types';

export interface AppState {
  user: User;
  subjects: Subject[];
  knowledgePoints: KnowledgePoint[];
  refreshDirectory: () => Promise<void>;
  notify: (message: string, kind?: 'success' | 'error') => void;
  logout: () => Promise<void>;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('App context is missing.');
  return context;
}

export function knowledgeLabel(points: KnowledgePoint[], id: number | null): string {
  const point = points.find((item) => item.id === id);
  if (!point) return '暂未标注知识点';
  return point.parentId ? `${knowledgeLabel(points, point.parentId)} / ${point.name}` : point.name;
}

export function sortDirectory(points: KnowledgePoint[], subjects: Subject[]): KnowledgePoint[] {
  const ordered: KnowledgePoint[] = [];
  const sort = (left: KnowledgePoint, right: KnowledgePoint) => (left.sortOrder || 0) - (right.sortOrder || 0) || left.id - right.id;
  function addBranch(point: KnowledgePoint) {
    ordered.push(point);
    points.filter((item) => item.parentId === point.id).sort(sort).forEach(addBranch);
  }
  subjects.forEach((subject) => points.filter((point) => point.subjectId === subject.id && !point.parentId).sort(sort).forEach(addBranch));
  return ordered;
}

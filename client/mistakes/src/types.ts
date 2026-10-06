export type ReviewResult = 'unknown' | 'familiar' | 'mastered';
export type KnowledgeStatus = ReviewResult | 'unreviewed';
export type Lifecycle = 'draft' | 'archived';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  active: boolean;
}

export interface Subject {
  id: string;
  name: string;
}

export interface KnowledgePoint {
  id: number;
  subjectId: string;
  name: string;
  parentId: number | null;
  sortOrder?: number;
}

export interface Mistake {
  id: number;
  subjectId: string | null;
  primaryKnowledgePointId: number | null;
  auxiliaryKnowledgePointIds: number[];
  question: string;
  answer: string;
  analysis: string;
  note: string;
  lifecycle: Lifecycle;
  latestReviewResult: ReviewResult | null;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  result: ReviewResult;
  createdAt: string;
}

export interface Stats {
  total: number;
  archived: number;
  drafts: number;
  reviewCount: number;
  bySubject: { id: string; name: string; count: number }[];
  byStatus: { id: string; name: string; count: number }[];
  byKnowledgePoint: { id: number | null; name: string; count: number }[];
}

export interface Invite {
  id: number;
  code: string;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  unreviewed: '未复习',
  unknown: '不会',
  familiar: '不熟',
  mastered: '掌握',
};

export type ReviewResult = 'unknown' | 'familiar' | 'mastered';
export type KnowledgeStatus = ReviewResult | 'unreviewed';
export type Lifecycle = 'draft' | 'archived';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  active: boolean;
  avatar: string | null;
  aiCallCount?: number;
  lastSeenAt?: string | null;
}

export interface Subject {
  id: string;
  name: string;
}

export interface KnowledgePoint {
  id: number;
  ownerUserId: number | null;
  subjectId: string;
  name: string;
  parentId: number | null;
  sortOrder?: number;
}

export interface MistakeSearch {
  matchedTermCount: number;
  totalTermCount: number;
  snippets: {
    field: 'question' | 'answer' | 'analysis' | 'note' | 'subject' | 'knowledgePoints';
    segments: { text: string; matched: boolean; type?: 'math'; display?: boolean }[];
  }[];
}

export interface Mistake {
  summary?: boolean;
  analysisNotice?: string;
  isTest: boolean;
  id: number;
  subjectId: string | null;
  primaryKnowledgePointId: number | null;
  auxiliaryKnowledgePointIds: number[];
  question: string;
  answer: string;
  analysis: string;
  note: string;
  rating: number;
  lifecycle: Lifecycle;
  latestReviewResult: ReviewResult | null;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  search?: MistakeSearch;
}

export interface MistakePage {
  items: Mistake[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Review {
  id: number;
  result: ReviewResult;
  createdAt: string;
}

export interface Stats {
  trashCount: number;
  testCount: number;
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

export interface Backup {
  id: string;
  createdAt: string;
  source: 'manual' | 'automatic' | 'pre-restore';
  status: 'running' | 'completed' | 'failed' | 'interrupted';
  stage: 'waiting' | 'snapshot' | 'copying' | 'compressing' | 'completed' | 'failed' | 'interrupted';
  size: number | null;
  error: string | null;
  filename: string | null;
}

export interface BackupSettings {
  enabled: boolean;
  time: string;
  retention: number;
  timezone: string;
  nextRunAt: string | null;
  lastRun: { status: string; at: string; message: string } | null;
}

export const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  unreviewed: '未复习',
  unknown: '不会',
  familiar: '不熟',
  mastered: '掌握',
};

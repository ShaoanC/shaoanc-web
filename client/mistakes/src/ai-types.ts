import type { Mistake } from './types';

export type AiJobType = 'question' | 'answer' | 'analysis';
export type ImagePurpose = 'question' | 'answer';
export interface MistakeImage {
  id: number;
  mistakeId: number;
  purpose: ImagePurpose;
  originalName: string;
  originalUrl: string;
  cropUrl: string;
  createdAt: string;
}
export interface AiInput {
  question: string;
  answer: string;
  analysis: string;
  subjectId: string | null;
  primaryKnowledgePointId: number | null;
  auxiliaryKnowledgePointIds: number[];
}
export interface AiJob {
  id: number;
  mistakeId: number;
  type: AiJobType;
  status: 'queued' | 'running' | 'retrying' | 'succeeded' | 'failed' | 'cancelled';
  applyStatus: 'pending' | 'applied' | 'conflict';
  input: AiInput;
  imageIds: number[];
  result: (Partial<AiInput> & { primaryPath?: string[]; auxiliaryPaths?: string[][]; diagramImageIds?: number[] }) | null;
  error: string | null;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  nextAttemptAt: string | null;
}
export interface AiJobRequest {
  mistakeId: number;
  type: AiJobType;
  imageIds?: number[];
  input: AiInput;
  automatic?: boolean;
}
export interface AiApplyResult { job: AiJob; mistake: Mistake }
export interface AiConfig {
  enabled: boolean;
  configured: boolean;
  baseUrl?: string;
  model?: string;
  hasApiKey?: boolean;
}

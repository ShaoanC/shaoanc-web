import type { Mistake } from './types';

export type AiJobType = 'question' | 'answer' | 'analysis';
export type ImagePurpose = 'question' | 'answer';
export interface UploadedPhoto {
  key: string;
  mistakeId: number | null;
  purpose: ImagePurpose | null;
  originalName: string;
  originalUrl: string;
  createdAt: string;
}
export interface MistakeImage {
  id: number;
  mistakeId: number;
  purpose: ImagePurpose;
  originalName: string;
  originalUrl: string;
  cropUrl: string;
  createdAt: string;
  sourceImageId?: number | null;
}
export type FigureBox = [number, number, number, number];
export interface AiFigure { id: string; imageId: number; box: FigureBox | null; description: string; field?: ImagePurpose }
export interface AiIssue { imageId: number | null; type: string; description: string }
export interface AiReviewResult extends Partial<AiInput> { primaryPath?: string[]; auxiliaryPaths?: string[][]; figures?: AiFigure[]; diagramImageIds?: number[]; issues?: AiIssue[]; needsReview?: boolean }
export interface AiApplyOptions { force?: boolean; mode?: 'replace' | 'append'; review?: AiReviewResult; expectedInput?: AiInput }
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
  mode?: 'single' | 'page-entry';
  mistakeDeleted: boolean;
  status: 'queued' | 'running' | 'retrying' | 'succeeded' | 'failed' | 'cancelled';
  applyStatus: 'pending' | 'applied' | 'conflict';
  input: AiInput;
  imageIds: number[];
  result: AiReviewResult | null;
  error: string | null;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  nextAttemptAt: string | null;
}
export interface AiJobRequest {
  clientId?: string;
  mistakeId: number;
  type: AiJobType;
  mode?: 'single' | 'page-entry';
  imageIds?: number[];
  input: AiInput;
  automatic?: boolean;
}
export interface AiApplyResult { job: AiJob; mistake: Mistake }
export interface AiServiceConfig {
  enabled: boolean;
  configured: boolean;
  baseUrl?: string;
  model?: string;
  hasApiKey?: boolean;
}
export interface AiConfig extends AiServiceConfig {
  segmentation?: AiServiceConfig;
  analysis?: AiServiceConfig;
}

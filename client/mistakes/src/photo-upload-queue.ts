import { api, ApiError, json } from './api';
import type { AiInput, AiJob, ImagePurpose, MistakeImage } from './ai-types';

export interface PreparedPhoto {
  clientId: string;
  original: File;
  crop: File;
  originalName: string;
}

export interface PhotoUploadBatch {
  id: string;
  mistakeId: number;
  purpose: ImagePurpose;
  total: number;
  imageIds: number[];
  status: 'uploading' | 'retrying' | 'processing' | 'completed' | 'failed';
  message: string;
  reuseRequested: boolean;
  reuseStatus?: 'waiting' | 'submitting' | 'submitted' | 'failed';
}

export interface PhotoUploadRequest {
  mistakeId: number;
  purpose: ImagePurpose;
  input: AiInput;
  files: PreparedPhoto[];
  recognize: boolean;
}

interface PendingBatch {
  view: PhotoUploadBatch;
  files: PreparedPhoto[];
  input: AiInput;
  recognize: boolean;
  recognitionSubmitted: boolean;
  recognitionError?: string;
  recognitionClientId: string;
  reuseInput?: AiInput;
  reuseError?: string;
  reuseClientId: string;
  running: boolean;
  controller: AbortController;
}

class RequestTimeout extends Error {
  constructor() { super('请求超时，请重试。'); }
}

const retryDelays = [1000, 2000, 4000];
const copyInput = (input: AiInput): AiInput => ({ ...input, auxiliaryKnowledgePointIds: [...input.auxiliaryKnowledgePointIds] });
const errorMessage = (error: unknown) => error instanceof Error ? error.message : '请求失败，请重试。';
const canRetry = (error: unknown) => error instanceof ApiError
  ? error.status === 408 || error.status === 429 || (error.status >= 500 && error.status < 600)
  : error instanceof TypeError || error instanceof RequestTimeout;

/** Keeps compressed photos and submission intent alive independently of the editor. */
export class PhotoUploadQueue {
  private batches = new Map<string, PendingBatch>();
  private listeners = new Set<() => void>();
  private snapshot: PhotoUploadBatch[] = [];

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  getSnapshot = (): PhotoUploadBatch[] => this.snapshot;

  enqueue({ mistakeId, purpose, input, files, recognize }: PhotoUploadRequest): string {
    const id = crypto.randomUUID();
    const batch: PendingBatch = {
      view: { id, mistakeId, purpose, total: files.length, imageIds: [], status: 'uploading', message: '图片已压缩，正在后台上传…', reuseRequested: false },
      files: [...files],
      input: copyInput(input),
      recognize,
      recognitionSubmitted: false,
      recognitionClientId: crypto.randomUUID(),
      reuseClientId: crypto.randomUUID(),
      running: false,
      controller: new AbortController(),
    };
    this.batches.set(id, batch);
    this.publish();
    void this.run(batch);
    return id;
  }

  reuse(batchId: string, input: AiInput): boolean {
    const batch = this.batches.get(batchId);
    if (!batch || batch.view.purpose !== 'question' || batch.view.reuseRequested) return false;
    batch.reuseInput = copyInput(input);
    this.update(batch, { reuseRequested: true, reuseStatus: 'waiting' });
    // A failed upload stays available for manual retry; the answer intent is retained.
    if (batch.view.imageIds.length === batch.view.total) void this.run(batch);
    return true;
  }

  retry(batchId: string): void {
    const batch = this.batches.get(batchId);
    if (!batch || batch.running || batch.view.status !== 'failed') return;
    batch.recognitionError = undefined;
    batch.reuseError = undefined;
    if (batch.view.reuseStatus === 'failed') this.update(batch, { reuseStatus: 'waiting' });
    void this.run(batch);
  }

  dispose(): void {
    for (const batch of this.batches.values()) {
      batch.controller.abort();
      batch.files = [];
    }
    this.batches.clear();
    if (this.snapshot.length) this.publish();
  }

  private publish(): void {
    this.snapshot = Array.from(this.batches.values(), (batch) => batch.view).reverse();
    this.listeners.forEach((listener) => listener());
  }

  private update(batch: PendingBatch, changes: Partial<PhotoUploadBatch>): void {
    if (batch.controller.signal.aborted) return;
    batch.view = { ...batch.view, ...changes };
    this.publish();
  }

  private async run(batch: PendingBatch): Promise<void> {
    if (batch.running || batch.controller.signal.aborted) return;
    batch.running = true;
    try {
      try {
        while (batch.view.imageIds.length < batch.view.total) {
          const index = batch.view.imageIds.length;
          const photo = batch.files[index];
          const image = await this.request<MistakeImage>(batch, 'uploading', `正在后台上传第 ${index + 1}/${batch.view.total} 张图片…`, 90000, (signal) => {
            const form = new FormData();
            form.append('original', photo.original, photo.originalName.replace(/\.[^.]+$/, '') + '.jpg');
            form.append('crop', photo.crop, 'crop.jpg');
            form.append('purpose', batch.view.purpose);
            form.append('clientId', photo.clientId);
            return api<MistakeImage>(`/mistakes/${batch.view.mistakeId}/images`, { method: 'POST', body: form, signal }, { background: true });
          });
          this.update(batch, { imageIds: [...batch.view.imageIds, image.id] });
        }
        // Only IDs are needed from here on, including for a later answer reuse.
        batch.files = [];
      } catch (error) {
        if (!batch.controller.signal.aborted) this.update(batch, { status: 'failed', message: `图片上传失败：${errorMessage(error)}` });
        return;
      }

      if (batch.recognize && !batch.recognitionSubmitted && !batch.recognitionError) {
        try {
          await this.submitRecognition(batch, batch.view.purpose, batch.input, batch.recognitionClientId);
          batch.recognitionSubmitted = true;
        } catch (error) {
          if (batch.controller.signal.aborted) return;
          batch.recognitionError = errorMessage(error);
        }
      }

      // Answer reuse has its own submission state: a question error must not block it.
      if (batch.reuseInput && batch.view.reuseStatus === 'waiting') {
        this.update(batch, { reuseStatus: 'submitting' });
        try {
          await this.submitRecognition(batch, 'answer', batch.reuseInput, batch.reuseClientId);
          this.update(batch, { reuseStatus: 'submitted' });
        } catch (error) {
          if (batch.controller.signal.aborted) return;
          batch.reuseError = errorMessage(error);
          this.update(batch, { reuseStatus: 'failed' });
        }
      }

      const errors = [batch.recognitionError && `识别任务提交失败：${batch.recognitionError}`, batch.reuseError && `答案复用提交失败：${batch.reuseError}`].filter(Boolean);
      this.update(batch, {
        status: errors.length ? 'failed' : 'completed',
        message: errors.length ? errors.join('；') : batch.view.reuseStatus === 'submitted'
          ? '图片已上传，答案复用已交给后台识别。'
          : batch.recognize ? '图片已上传，已交给后台识别。' : `${batch.view.total} 张图片已上传。`,
      });
    } finally {
      batch.running = false;
      // A subscriber can request reuse as the completion update is delivered.
      if (!batch.controller.signal.aborted && batch.view.imageIds.length === batch.view.total && batch.view.reuseStatus === 'waiting') void this.run(batch);
    }
  }

  private submitRecognition(batch: PendingBatch, type: ImagePurpose, input: AiInput, clientId: string): Promise<AiJob> {
    return this.request(batch, 'processing', `正在后台提交${type === 'question' ? '题目' : '答案'}识别…`, 30000, (signal) => api<AiJob>('/ai/jobs', {
      ...json({ clientId, mistakeId: batch.view.mistakeId, type, imageIds: batch.view.imageIds, input }),
      signal,
    }, { background: true }));
  }

  private async request<T>(batch: PendingBatch, status: 'uploading' | 'processing', message: string, timeout: number, perform: (signal: AbortSignal) => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt += 1) {
      batch.controller.signal.throwIfAborted();
      this.update(batch, { status, message });
      try {
        return await this.withTimeout(batch, timeout, perform);
      } catch (error) {
        if (batch.controller.signal.aborted || !canRetry(error) || attempt >= retryDelays.length) throw error;
        const delay = retryDelays[attempt];
        this.update(batch, { status: 'retrying', message: `网络请求失败，${delay / 1000} 秒后自动重试（${attempt + 1}/${retryDelays.length}）…` });
        await this.wait(batch, delay);
      }
    }
  }

  private async withTimeout<T>(batch: PendingBatch, timeout: number, perform: (signal: AbortSignal) => Promise<T>): Promise<T> {
    batch.controller.signal.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort();
    batch.controller.signal.addEventListener('abort', abort, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeout);
    try {
      return await perform(controller.signal);
    } catch (error) {
      if (timedOut) throw new RequestTimeout();
      throw error;
    } finally {
      clearTimeout(timer);
      batch.controller.signal.removeEventListener('abort', abort);
    }
  }

  private wait(batch: PendingBatch, delay: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const signal = batch.controller.signal;
      const abort = () => { clearTimeout(timer); reject(signal.reason); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, delay);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
  }
}

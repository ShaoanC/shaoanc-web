export interface PendingPage {
  id: string;
  file: File;
  url: string;
  error: string;
  batchId?: string;
  pageOrder?: number;
  // Quarter turns still to apply to file, which is kept as the untouched original.
  rotation?: number;
}

export function assignPageUploadBatch(entries: PendingPage[]): PendingPage[] {
  const batchId = crypto.randomUUID();
  let pageOrder = 0;
  return entries.map((entry) => entry.batchId ? entry : { ...entry, batchId, pageOrder: pageOrder++ });
}

export async function uploadPageBatch<T>(entries: PendingPage[], options: {
  signal: AbortSignal;
  prepare: (file: File, rotation: number) => Promise<File>;
  send: (body: FormData, signal: AbortSignal) => Promise<T>;
  onProgress: (index: number) => void;
  onSuccess: (entry: PendingPage, result: T) => void;
  onError: (entry: PendingPage, error: Error) => void;
}): Promise<number> {
  const { signal } = options;
  let uploaded = 0;
  for (const [index, entry] of entries.entries()) {
    signal.throwIfAborted();
    try {
      options.onProgress(index);
      const file = await options.prepare(entry.file, entry.rotation || 0);
      signal.throwIfAborted();
      const body = new FormData();
      body.append('file', file, entry.file.name.replace(/\.[^.]+$/, '') + '.jpg');
      body.append('clientId', entry.id);
      body.append('batchId', entry.batchId!);
      body.append('pageOrder', String(entry.pageOrder));
      signal.throwIfAborted();
      const result = await options.send(body, signal);
      signal.throwIfAborted();
      options.onSuccess(entry, result);
      uploaded += 1;
    } catch (error) {
      signal.throwIfAborted();
      options.onError(entry, error as Error);
    }
  }
  return uploaded;
}

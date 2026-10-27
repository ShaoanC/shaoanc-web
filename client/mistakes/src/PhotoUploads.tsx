import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { PhotoUploadQueue, type PhotoUploadBatch } from './photo-upload-queue';
import { useActivityToast, type ActivityNotice } from './useActivityToast';

const Context = createContext<{ queue: PhotoUploadQueue; batches: PhotoUploadBatch[] } | null>(null);

export function usePhotoUploads() {
  const value = useContext(Context);
  if (!value) throw new Error('Photo uploads context missing');
  return value;
}

export function PhotoUploadsProvider({ children }: { children: ReactNode }) {
  const [queue] = useState(() => new PhotoUploadQueue());
  const shown = useRef(new Map<string, PhotoUploadBatch>());
  const batches = useSyncExternalStore(queue.subscribe, queue.getSnapshot);
  const report = useActivityToast('photo-uploads');
  useEffect(() => () => {
    queue.dispose();
  }, [queue]);
  useEffect(() => {
    const updates: ActivityNotice[] = [];
    for (const batch of batches) {
      if (shown.current.get(batch.id) === batch) continue;
      shown.current.set(batch.id, batch);
      const path = `/mistakes/${batch.mistakeId}/edit?photo=${batch.purpose}`;
      updates.push({ id: batch.id, path, message: `记录 #${batch.mistakeId} · ${batch.message}`,
        status: batch.status === 'failed' ? 'failed' : batch.status === 'completed' ? 'completed' : 'active',
        retry: batch.status === 'failed' ? () => queue.retry(batch.id) : undefined });
    }
    report(updates);
  }, [batches, queue, report]);
  return <Context.Provider value={{ queue, batches }}>{children}</Context.Provider>;
}

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { PhotoUploadQueue, type PhotoUploadBatch } from './photo-upload-queue';
import { toastDestination } from './toast-navigation';

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
  useEffect(() => () => {
    queue.getSnapshot().forEach((batch) => toast.dismiss(`photo-upload-${batch.id}`));
    queue.dispose();
  }, [queue]);
  useEffect(() => {
    for (const batch of batches) {
      if (shown.current.get(batch.id) === batch) continue;
      shown.current.set(batch.id, batch);
      const toastId = `photo-upload-${batch.id}`;
      const finished = batch.status === 'completed' || batch.status === 'failed';
      const path = `/mistakes/${batch.mistakeId}/edit?photo=${batch.purpose}`;
      const content = <div className="ai-toast-copy"><a className="ai-toast-link" href={`#${path}`}><span>记录 #{batch.mistakeId} · {batch.message}</span><small>点击打开题目处理</small></a>{batch.status === 'failed' && <button type="button" onClick={(event) => { event.stopPropagation(); queue.retry(batch.id); }}>重试</button>}</div>;
      const options = { type: batch.status === 'failed' ? 'error' as const : batch.status === 'completed' ? 'success' as const : 'info' as const, isLoading: !finished, autoClose: batch.status === 'completed' ? 4500 : false as const, closeButton: finished, ...toastDestination(path) };
      if (toast.isActive(toastId)) toast.update(toastId, { render: content, ...options });
      else toast(content, { toastId, ...options });
    }
  }, [batches, queue]);
  return <Context.Provider value={{ queue, batches }}>{children}</Context.Provider>;
}

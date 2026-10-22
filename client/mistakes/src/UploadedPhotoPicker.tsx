import { useEffect, useState } from 'react';
import { Images } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, formatDate } from './api';
import { AiDialog } from './AiDialog';
import type { UploadedPhoto } from './ai-types';

export function UploadedPhotoPicker({ disabled, onSelect }: { disabled?: boolean; onSelect: (image: UploadedPhoto) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<UploadedPhoto[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true); setError('');
    api<UploadedPhoto[]>('/photos').then((items) => { if (active) setImages(items); })
      .catch((err: Error) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, revision]);
  async function select(image: UploadedPhoto) {
    setSelecting(image.key);
    try { await onSelect(image); setOpen(false); }
    catch (err) { toast.error((err as Error).message); }
    finally { setSelecting(null); }
  }
  return <>
    <button type="button" className="button secondary" disabled={disabled} onClick={() => setOpen(true)}><Images size={16} />选择已上传的照片</button>
    <AiDialog open={open} onClose={() => { if (!selecting) setOpen(false); }} title="选择已上传的照片" description="选择整图的副本重新框选，不会影响之前的图片和选框。" wide>
      {loading && <p role="status">正在加载照片…</p>}
      {error && <p className="form-error" role="alert">{error} <button type="button" className="table-button" onClick={() => setRevision((value) => value + 1)}>重试</button></p>}
      {!loading && !error && !images.length && <p className="ai-empty">还没有上传过照片。先拍照或从相册选择图片。</p>}
      {!loading && !error && <div className="photo-library-grid">{images.map((image) => <button type="button" key={image.key} className="photo-library-photo" disabled={Boolean(selecting)} onClick={() => void select(image)}>
        <img src={image.originalUrl} alt={image.originalName} loading="lazy" />
        <strong className="photo-library-name">{image.originalName}</strong>
        <span className="photo-library-meta">{selecting === image.key ? '正在创建副本…' : image.purpose === 'question' ? '题干照片' : image.purpose === 'answer' ? '答案照片' : '整页照片'}</span>
        <span className="photo-library-meta">{formatDate(image.createdAt, true)}</span>
      </button>)}</div>}
    </AiDialog>
  </>;
}

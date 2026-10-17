import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Images } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, formatDate } from './api';
import { AiDialog } from './AiDialog';
import type { MistakeImage, ImagePurpose } from './ai-types';

export function ImageHistory({ mistakeId, onRecrop, onRecognize }: { mistakeId?: number; onRecrop?: (image: MistakeImage) => void; onRecognize?: (purpose: ImagePurpose, ids: number[]) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<MistakeImage[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [full, setFull] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open || !mistakeId) return;
    setLoading(true); setError('');
    api<MistakeImage[]>(`/mistakes/${mistakeId}/images`).then(setImages).catch((err) => { setError(err.message); toast.error(err.message); }).finally(() => setLoading(false));
  }, [open, mistakeId]);
  async function recognize(purpose: ImagePurpose) {
    if (!onRecognize) return;
    setBusy(true);
    try { await onRecognize(purpose, images.filter((image) => selected.includes(image.id) && image.purpose === purpose).map((image) => image.id)); setOpen(false); }
    catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
  }
  function move(id: number, direction: -1 | 1) {
    setImages((items) => {
      const image = items.find((item) => item.id === id);
      if (!image) return items;
      const matching = items.filter((item) => item.purpose === image.purpose);
      const index = matching.findIndex((item) => item.id === id);
      const next = matching[index + direction];
      if (!next) return items;
      const copy = [...items]; const first = copy.findIndex((item) => item.id === id), second = copy.findIndex((item) => item.id === next.id);
      [copy[first], copy[second]] = [copy[second], copy[first]]; return copy;
    });
  }
  return <>
    <button type="button" className="button secondary" disabled={!mistakeId} onClick={() => setOpen(true)}><Images size={16} />查看上传图片</button>
    <AiDialog open={open} onClose={() => setOpen(false)} title="之前上传的图片" description="按显示序号提交识别，可前后移动调整顺序。点击图片放大查看。" wide>
      {loading && <p>正在加载图片…</p>}{error && <p className="form-error">{error}</p>}{!loading && !error && !images.length && <p className="ai-empty">这道题还没有上传图片。</p>}
      {(['question', 'answer'] as const).map((purpose) => images.some((image) => image.purpose === purpose) && <section key={purpose}>
        <h3>{purpose === 'question' ? '题干图片' : '答案图片'}</h3>
        {images.filter((image) => image.purpose === purpose).map((image, index, group) => <article key={image.id} className="photo-history-item">
          <div className="photo-history-order"><span className="photo-history-number">图片 {index + 1}{image.sourceImageId ? ' · 派生配图' : ''}</span><button type="button" className="table-button" aria-label={`图片 ${index + 1} 向前移动`} disabled={busy || index === 0} onClick={() => move(image.id, -1)}><ArrowUp size={14} />向前</button><button type="button" className="table-button" aria-label={`图片 ${index + 1} 向后移动`} disabled={busy || index === group.length - 1} onClick={() => move(image.id, 1)}><ArrowDown size={14} />向后</button></div>
          <h3>{onRecognize && <input type="checkbox" aria-label={`选择图片 ${image.id}`} checked={selected.includes(image.id)} onChange={(event) => setSelected((items) => event.target.checked ? [...items, image.id] : items.filter((id) => id !== image.id))} />} {image.originalName} <small>{formatDate(image.createdAt, true)}</small></h3>
          <div className="photo-history-pair">{[['整图', image.originalUrl], ['裁剪图', image.cropUrl]].map(([label, url]) => <figure key={url}><button type="button" className="photo-thumbnail" onClick={() => setFull(url)} aria-label={`放大${label} ${image.id}`}><img src={url} alt={label} loading="lazy" /></button><figcaption>{label}</figcaption></figure>)}</div>
          {onRecrop && <div className="photo-actions"><button type="button" className="table-button" onClick={() => { setOpen(false); onRecrop(image); }}>重新裁剪</button></div>}
        </article>)}
        {onRecognize && <div className="photo-actions"><button type="button" className="button primary" disabled={busy || !selected.some((id) => images.find((image) => image.id === id)?.purpose === purpose)} onClick={() => void recognize(purpose)}>识别所选{purpose === 'question' ? '题干' : '答案'}图片</button></div>}
      </section>)}
    </AiDialog>
    <AiDialog open={Boolean(full)} onClose={() => setFull(null)} title="查看图片" wide>{full && <img className="photo-full-image" src={full} alt="上传的图片" />}</AiDialog>
  </>;
}

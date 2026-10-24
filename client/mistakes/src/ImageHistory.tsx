import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Images } from 'lucide-react';
import { toast } from 'react-toastify';
import { Gallery, Item } from 'react-photoswipe-gallery';
import type PhotoSwipe from 'photoswipe';
import type { PhotoSwipeOptions, SlideData } from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';
import { api, formatDate } from './api';
import { AiDialog } from './AiDialog';
import { RecognitionPrompt } from './RecognitionPrompt';
import type { MistakeImage, ImagePurpose } from './ai-types';

const galleryOptions: PhotoSwipeOptions = {
  mainClass: 'photo-history-lightbox',
  // Move focus into PhotoSwipe so the parent dialog cannot swallow arrow keys.
  initialPointerPos: null,
  loop: false,
  wheelToZoom: true,
  closeTitle: '关闭图片预览',
  zoomTitle: '放大或缩小',
  arrowPrevTitle: '上一张',
  arrowNextTitle: '下一张',
  errorMsg: '图片加载失败，请关闭后重试。',
  padding: { top: 60, bottom: 60, left: 16, right: 16 },
};

function prepareGallery(photoswipe: PhotoSwipe) {
  const loading = new Set<number>();
  photoswipe.addFilter('itemData', (data) => {
    const thumbnail = data.element as HTMLImageElement;
    return { ...data, w: data.w || thumbnail.naturalWidth, h: data.h || thumbnail.naturalHeight };
  });
  // Lazy thumbnails may not have loaded when a neighbouring slide is opened.
  photoswipe.on('contentLoad', (event) => {
    const { content } = event;
    if (content.width && content.height) return;
    event.preventDefault();
    if (loading.has(content.index)) return;
    loading.add(content.index);
    content.state = 'loading';
    const image = new Image();
    image.onload = () => {
      if (photoswipe.isDestroying) return;
      const data = (photoswipe.options.dataSource as SlideData[])[content.index];
      data.w = image.naturalWidth;
      data.h = image.naturalHeight;
      loading.delete(content.index);
      photoswipe.refreshSlideContent(content.index);
    };
    image.onerror = () => { loading.delete(content.index); if (!photoswipe.isDestroying) content.onError(); };
    image.src = content.data.src!;
  });
}

export function ImageHistory({ mistakeId, onRecrop, onRecognize }: { mistakeId?: number; onRecrop?: (image: MistakeImage) => void; onRecognize?: (purpose: ImagePurpose, ids: number[], recognitionPrompt?: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<MistakeImage[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [prompts, setPrompts] = useState({ question: '', answer: '' });
  useEffect(() => {
    if (!open || !mistakeId) return;
    setLoading(true); setError('');
    api<MistakeImage[]>(`/mistakes/${mistakeId}/images`).then((items) => { setImages(items.filter((image) => image.sourceAvailable !== false && image.originalUrl && image.cropUrl)); setSelected([]); }).catch((err) => { setError(err.message); toast.error(err.message); }).finally(() => setLoading(false));
  }, [open, mistakeId]);
  async function recognize(purpose: ImagePurpose) {
    if (!onRecognize) return;
    setBusy(true);
    try { await onRecognize(purpose, images.filter((image) => selected.includes(image.id) && image.purpose === purpose).map((image) => image.id), prompts[purpose].trim()); setOpen(false); }
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
    <AiDialog open={open} onClose={() => setOpen(false)} suspended={galleryOpen} title="之前上传的图片" description="按显示序号提交识别，可前后移动调整顺序。点击图片放大查看，支持缩放和左右切换。" wide>
      {loading && <p>正在加载图片…</p>}{error && <p className="form-error">{error}</p>}{!loading && !error && !images.length && <p className="ai-empty">没有可用的来源图片。备份恢复后仅保留正文配图，可重新上传照片进行识别。</p>}
      <Gallery withCaption options={galleryOptions} onBeforeOpen={(photoswipe) => {
        setGalleryOpen(true);
        prepareGallery(photoswipe);
        photoswipe.on('destroy', () => setGalleryOpen(false));
      }}>
      {(['question', 'answer'] as const).map((purpose) => images.some((image) => image.purpose === purpose) && <section key={purpose}>
        <h3>{purpose === 'question' ? '题干图片' : '答案图片'}</h3>
        {images.filter((image) => image.purpose === purpose).map((image, index, group) => <article key={image.id} className="photo-history-item">
          <div className="photo-history-order"><span className="photo-history-number">图片 {index + 1}{image.sourceImageId ? ' · 派生配图' : ''}</span><button type="button" className="table-button" aria-label={`图片 ${index + 1} 向前移动`} disabled={busy || index === 0} onClick={() => move(image.id, -1)}><ArrowUp size={14} />向前</button><button type="button" className="table-button" aria-label={`图片 ${index + 1} 向后移动`} disabled={busy || index === group.length - 1} onClick={() => move(image.id, 1)}><ArrowDown size={14} />向后</button></div>
          <h3>{onRecognize && <input type="checkbox" aria-label={`选择图片 ${image.id}`} checked={selected.includes(image.id)} onChange={(event) => setSelected((items) => event.target.checked ? [...items, image.id] : items.filter((id) => id !== image.id))} />} {image.originalName} <small>{formatDate(image.createdAt, true)}</small></h3>
          <div className="photo-history-pair">{[['整图', image.originalUrl], ['裁剪图', image.cropUrl]].filter((pair): pair is [string, string] => Boolean(pair[1])).map(([label, url]) => <figure key={label}><Item<HTMLImageElement> original={url} thumbnail={url} alt={`${purpose === 'question' ? '题干' : '答案'}图片 ${index + 1} · ${label}`} caption={`${purpose === 'question' ? '题干' : '答案'}图片 ${index + 1} · ${label}`}>
            {({ ref, open: openImage }) => <button type="button" className="photo-thumbnail" onClick={openImage} aria-label={`放大${label} ${image.id}`}><img ref={ref} src={url} alt={label} loading="lazy" /></button>}
          </Item><figcaption>{label}</figcaption></figure>)}</div>
          {onRecrop && <div className="photo-actions"><button type="button" className="table-button" onClick={() => { setOpen(false); onRecrop(image); }}>重新裁剪</button></div>}
        </article>)}
        {onRecognize && <><RecognitionPrompt purpose={purpose} value={prompts[purpose]} onChange={(value) => setPrompts((current) => ({ ...current, [purpose]: value }))} disabled={busy} /><div className="photo-actions"><button type="button" className="button primary" disabled={busy || !selected.some((id) => images.find((image) => image.id === id)?.purpose === purpose)} onClick={() => void recognize(purpose)}>识别所选{purpose === 'question' ? '题干' : '答案'}图片</button></div></>}
      </section>)}
      </Gallery>
    </AiDialog>
  </>;
}

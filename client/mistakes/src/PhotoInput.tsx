import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import compressionWorkerUrl from 'browser-image-compression/dist/browser-image-compression.js?url';
import { ArrowLeft, ArrowRight, Camera, Crop, ImagePlus, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from './api';
import { AiDialog } from './AiDialog';
import type { ImagePurpose, MistakeImage } from './ai-types';
import type { Mistake } from './types';
import 'react-image-crop/dist/ReactCrop.css';

type Entry = { key: string; clientId: string; file: File; url: string; crop: PercentCrop; uploaded?: MistakeImage };
export interface PhotoInputHandle { reuse: (image: MistakeImage) => Promise<void> }
const fullCrop: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 };
const compressJpeg = (file: File) => imageCompression(file, { maxSizeMB: 1.5, maxWidthOrHeight: 2560, fileType: 'image/jpeg', initialQuality: .88, useWebWorker: true, libURL: compressionWorkerUrl });
// The compression library's PNG helper quantizes colors; native PNG preserves the canvas pixels.
const losslessFile = (canvas: HTMLCanvasElement, name: string) => new Promise<File>((resolve, reject) => {
  canvas.toBlob((blob) => blob ? resolve(new File([blob], name, { type: 'image/png', lastModified: Date.now() })) : reject(new Error('浏览器无法生成裁剪图片，请重试。')), 'image/png');
});
async function jpeg(file: File) {
  if (file.type !== 'image/png') return compressJpeg(file);
  const url = URL.createObjectURL(file);
  try {
    const image = await imageCompression.loadImage(url);
    const scale = Math.min(1, 2560 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('浏览器无法处理图片，请重试。');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const encoded = await new Promise<File>((resolve, reject) => canvas.toBlob((blob) => blob
      ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: Date.now() }))
      : reject(new Error('浏览器无法压缩图片，请重试。')), 'image/jpeg', .88));
    // The library also caps output at input file size. Small lossless PNGs must not force JPEG quality below .88.
    return encoded.size <= 1.5 * 1024 * 1024 ? encoded : compressJpeg(encoded);
  } finally { URL.revokeObjectURL(url); }
}

export function PhotoInput({ purpose, ensureSaved, onRecognize, onUploaded, actions, aiAvailable, ref }: { purpose: ImagePurpose; ensureSaved: () => Promise<Mistake>; onRecognize: (ids: number[]) => Promise<void>; onUploaded?: (ids: number[]) => void; actions?: ReactNode; aiAvailable: boolean; ref?: Ref<PhotoInputHandle> }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [imageReady, setImageReady] = useState(false);
  const camera = useRef<HTMLInputElement>(null);
  const album = useRef<HTMLInputElement>(null);
  const urls = useRef(new Set<string>());
  const photo = useRef<HTMLImageElement>(null);
  const current = entries[selected];
  const label = purpose === 'question' ? '题目' : '答案';
  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);
  useEffect(() => setImageReady(false), [current?.key, current?.url]);
  function objectUrl(file: Blob) { const url = URL.createObjectURL(file); urls.current.add(url); return url; }
  function add(files: File[]) {
    const valid = files.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    if (valid.length !== files.length) toast.error('请选择 JPG、PNG 或 WebP 图片。');
    if (!valid.length) return;
    if (entries.length + valid.length > 12) { toast.error('每次最多选择 12 张图片。'); return; }
    const added = valid.map((file) => ({ key: crypto.randomUUID(), clientId: crypto.randomUUID(), file, url: objectUrl(file), crop: { ...fullCrop } }));
    setEntries((items) => [...items, ...added]); setSelected(entries.length); setOpen(true);
  }
  useImperativeHandle(ref, () => ({ async reuse(image: MistakeImage) {
    try {
      const response = await fetch(image.originalUrl, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('无法读取历史图片');
      add([new File([await response.blob()], image.originalName, { type: 'image/jpeg' })]);
    } catch (err) { toast.error((err as Error).message); }
  } }));
  function changeCrop(crop: PercentCrop) { setEntries((items) => items.map((entry, index) => index === selected ? { ...entry, crop, uploaded: undefined, clientId: crypto.randomUUID() } : entry)); }
  async function rotate(direction: -1 | 1) {
    if (!current || busy) return;
    setBusy(true); setImageReady(false);
    try {
      const image = await imageCompression.loadImage(current.url);
      const canvas = document.createElement('canvas'); canvas.width = image.naturalHeight; canvas.height = image.naturalWidth;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('浏览器无法旋转图片，请重试。');
      context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.translate(canvas.width / 2, canvas.height / 2); context.rotate(direction * Math.PI / 2);
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      const file = await losslessFile(canvas, current.file.name.replace(/\.[^.]+$/, '') + '.png');
      const url = objectUrl(file);
      setEntries((items) => items.map((entry) => entry.key === current.key ? { ...entry, file, url, crop: { ...fullCrop }, uploaded: undefined, clientId: crypto.randomUUID() } : entry));
      URL.revokeObjectURL(current.url); urls.current.delete(current.url);
    } catch (err) { setImageReady(true); toast.error((err as Error).message); }
    finally { setBusy(false); }
  }
  function move(index: number, offset: number) {
    const next = index + offset;
    if (next < 0 || next >= entries.length) return;
    const copy = [...entries]; [copy[index], copy[next]] = [copy[next], copy[index]]; setEntries(copy); setSelected(next);
  }
  function remove(index: number) {
    const entry = entries[index]; URL.revokeObjectURL(entry.url); urls.current.delete(entry.url);
    setEntries((items) => items.filter((_, n) => n !== index)); setSelected(Math.max(0, Math.min(selected, entries.length - 2)));
  }
  async function croppedFile(entry: Entry) {
    const image = await imageCompression.loadImage(entry.url);
    const crop = entry.crop;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * crop.width / 100));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * crop.height / 100));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('浏览器无法处理图片，请换一个浏览器重试');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, image.naturalWidth * crop.x / 100, image.naturalHeight * crop.y / 100, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    // Keep crop pixels lossless until the final size-limited JPEG compression.
    return losslessFile(canvas, entry.file.name.replace(/\.[^.]+$/, '') + '-crop.png');
  }
  async function upload(recognize: boolean) {
    if (!entries.length || busy) return;
    setBusy(true);
    const toastId = toast.loading(`正在保存${label}图片…`);
    const snapshot = [...entries];
    try {
      const item = await ensureSaved();
      const ids: number[] = [];
      for (const [index, entry] of snapshot.entries()) {
        if (entry.uploaded) { ids.push(entry.uploaded.id); continue; }
        const report = (value: string) => { setStage(value); toast.update(toastId, { render: value }); };
        report(`正在压缩第 ${index + 1}/${snapshot.length} 张图片…`);
        const original = await jpeg(entry.file);
        const crop = await jpeg(await croppedFile(entry));
        const form = new FormData();
        form.append('original', original, entry.file.name.replace(/\.[^.]+$/, '') + '.jpg');
        form.append('crop', crop, 'crop.jpg'); form.append('purpose', purpose); form.append('clientId', entry.clientId);
        report(`正在上传第 ${index + 1}/${snapshot.length} 张图片…`);
        const uploaded = await api<MistakeImage>(`/mistakes/${item.id}/images`, { method: 'POST', body: form });
        ids.push(uploaded.id);
        setEntries((items) => items.map((value) => value.key === entry.key ? { ...value, uploaded } : value));
      }
      toast.update(toastId, { render: `${snapshot.length} 张${label}图片已备份。`, type: 'success', isLoading: false, autoClose: 4500 });
      onUploaded?.(ids);
      if (recognize) await onRecognize(ids);
      setOpen(false);
    } catch (err) { toast.update(toastId, { render: (err as Error).message, type: 'error', isLoading: false, autoClose: false, closeButton: true }); }
    finally { setBusy(false); setStage(''); }
  }
  function fileInput(event: React.ChangeEvent<HTMLInputElement>) { add(Array.from(event.target.files || [])); event.target.value = ''; }
  return <div className="photo-entry">
    <div className="photo-entry-title"><Camera size={18} />{purpose === 'question' ? '从图片录入题目' : '也可以拍下答案'}</div>
    <p>{purpose === 'question' ? '选中错题部分，多张图片按顺序一起识别。' : '题目和答案在同一张图里时，可直接复用题干图片识别答案。'}</p>
    <input ref={camera} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={fileInput} disabled={busy} />
    <input ref={album} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={fileInput} disabled={busy} />
    <div className="photo-actions"><button type="button" className="button secondary" disabled={busy} onClick={() => camera.current?.click()}><Camera size={16} />拍照{purpose === 'answer' ? '识别答案' : ''}</button><button type="button" className="button secondary" disabled={busy} onClick={() => album.current?.click()}><ImagePlus size={16} />选择图片</button>{actions}{entries.length > 0 && <button type="button" className="table-button" onClick={() => setOpen(true)}><Crop size={15} />{entries.length} 张待选图片</button>}</div>
    <AiDialog open={open} onClose={() => { if (!busy) setOpen(false); }} title={`裁剪${label}图片`} description="拖动选框保留需要的部分。可逐张调整，再按当前顺序识别。" wide>
      <div className="photo-thumbnails">{entries.map((entry, index) => <div className={`photo-thumbnail${selected === index ? ' active' : ''}`} key={entry.key}>
        <button type="button" disabled={busy} onClick={() => setSelected(index)} aria-label={`选择第 ${index + 1} 张图片`}><img src={entry.url} alt={`${label}图片 ${index + 1}`} /><small>{index + 1}. {entry.file.name}</small></button>
        <div className="photo-thumbnail-controls"><button type="button" className="icon-button" aria-label="向前移动" disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowLeft size={14} /></button><button type="button" className="icon-button" aria-label="移出本次识别" disabled={busy} onClick={() => remove(index)}><Trash2 size={14} /></button><button type="button" className="icon-button" aria-label="向后移动" disabled={busy || index === entries.length - 1} onClick={() => move(index, 1)}><ArrowRight size={14} /></button></div>
      </div>)}</div>
      {current && <div className="photo-rotation-actions"><button type="button" className="button secondary" disabled={busy || !imageReady} onClick={() => void rotate(-1)}><RotateCcw size={16} />左转 90°</button><button type="button" className="button secondary" disabled={busy || !imageReady} onClick={() => void rotate(1)}><RotateCw size={16} />右转 90°</button></div>}
      {current ? <div className="photo-crop-stage"><ReactCrop crop={current.crop} onChange={(_, percent) => changeCrop(percent)} minWidth={20} minHeight={20} disabled={busy}>
        <img ref={photo} src={current.url} onLoad={() => setImageReady(true)} onError={() => { setImageReady(false); toast.error('图片无法读取，请移除后重新选择。'); }} alt={`裁剪第 ${selected + 1} 张${label}图片`} />
      </ReactCrop></div> : <p className="ai-empty">添加图片开始裁剪。</p>}
      <div className="photo-crop-footer"><button type="button" className="button ghost" disabled={busy} onClick={() => album.current?.click()}><ImagePlus size={16} />追加图片</button><p>{stage || '旋转会重置选框。按显示方向备份整图与裁剪图，保留彩色笔迹。'}</p></div>
      {!aiAvailable && <p className="ai-notice">AI 尚未启用，可以先保存图片。</p>}
      <div className="photo-actions"><button type="button" className="button primary" disabled={busy || !entries.length || !imageReady || !aiAvailable} onClick={() => void upload(true)}>{busy ? '正在处理…' : `上传并识别${label}`}</button><button type="button" className="button secondary" disabled={busy || !entries.length || !imageReady} onClick={() => void upload(false)}>仅保存图片</button></div>
    </AiDialog>
  </div>;
}

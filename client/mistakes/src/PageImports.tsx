import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { compressJpeg } from './photo-compression';
import { canvasBlob, predecode, quarterTurns, rotatedPreview, rotateOnto, withImage } from './photo-rotation';
import { useQuarterTurn } from './motion';
import { ArrowDown, ArrowLeft, ArrowUp, Check, CheckSquare, ImagePlus, LoaderCircle, Maximize2, Move, MousePointer2, Plus, RefreshCw, RotateCcw, RotateCw, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, formatDate, json } from './api';
import { useApp } from './context';
import { assignPageUploadBatch, uploadPageBatch, type PendingPage } from './page-upload';
import { AiDialog } from './AiDialog';
import { useAiTasks } from './AiTasks';
import { validBox } from './ImageRegions';
import type { FigureBox } from './ai-types';
import './page-imports.css';

type ImportStatus = 'queued' | 'running' | 'retrying' | 'succeeded' | 'failed' | 'cancelled';
export interface PageRegion {
  id: string; label: string; box: FigureBox; selected: boolean; mask?: unknown;
  mistakeId?: number | null; jobId?: number | null;
}
export interface PageImportItem {
  regionId: string; mistakeId: number; jobId: number | null; status: ImportStatus | 'preparing';
  applyStatus: 'pending' | 'applied' | 'conflict'; error?: string | null;
}
export interface PageImport {
  id: number; originalName: string; imageUrl: string; status: ImportStatus;
  batchId: string; pageOrder: number;
  regions: PageRegion[]; items: PageImportItem[]; error: string | null; attempts: number; createdAt: string;
}
const statusLabel: Record<ImportStatus, string> = { queued: '等待分题', running: '正在分题', retrying: '等待重试', succeeded: '分题完成', failed: '分题失败', cancelled: '已取消' };
const activeStatus = (status: ImportStatus) => ['queued', 'running', 'retrying'].includes(status);
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

async function preparePage(file: File, rotation: number) {
  let input = file;
  if (file.type !== 'image/jpeg' || rotation) {
    // Rotation is applied here, once, at the same 3200px cap as the upload itself.
    const blob = await withImage(file, (image) => canvasBlob(rotateOnto(image, rotation, 3200), 'image/jpeg', .92));
    input = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
    if (input.size <= 3.8 * 1024 * 1024) return input;
  }
  return compressJpeg(input, { maxSizeMB: 3.8, maxWidthOrHeight: 3200, initialQuality: .92 });
}

function sortPages(pages: PageImport[]) {
  const newest = new Map<string, number>();
  for (const page of pages) newest.set(page.batchId, Math.max(newest.get(page.batchId) || 0, page.id));
  return [...pages].sort((a, b) => a.batchId === b.batchId ? a.pageOrder - b.pageOrder || a.id - b.id : (newest.get(b.batchId) || b.id) - (newest.get(a.batchId) || a.id));
}

export function PageImportsPage() {
  const { user } = useApp();
  const tasks = useAiTasks();
  const [pages, setPages] = useState<PageImport[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pending, setPending] = useState<PendingPage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [rotatingId, setRotatingId] = useState('');
  const [uploadStage, setUploadStage] = useState('');
  const [busyIds, setBusyIds] = useState(new Set<number>());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const album = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const urls = useRef(new Set<string>());
  const revision = useRef(0);
  const mounted = useRef(true);
  const inflight = useRef(false);
  const uploadController = useRef<AbortController | null>(null);
  const drafts = useRef(new Map<number, PageRegion[]>());
  const configured = tasks.config?.segmentation?.configured && tasks.config.segmentation.enabled;
  const recognition = tasks.config;
  const canRecognize = recognition?.configured && recognition.enabled;
  const current = pages.find((page) => page.id === selectedId) || pages[0];
  const quarterTurn = useQuarterTurn();
  const { settle } = quarterTurn;
  // A rotated page remounts with its new preview; clear the held spin before that frame paints.
  useLayoutEffect(settle, [pending, settle]);

  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    const version = revision.current;
    try {
      const result = await api<PageImport[]>('/page-imports', {}, { background: true });
      if (mounted.current && version === revision.current) { setPages(sortPages(result)); setError(''); }
    } catch (err) { if (mounted.current) setError((err as Error).message); }
    finally { inflight.current = false; if (mounted.current) setLoaded(true); }
  }, []);
  useEffect(() => {
    mounted.current = true;
    const cancelUploads = () => { uploadController.current?.abort(); };
    void refresh();
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 3000);
    const focus = () => { void refresh(); };
    window.addEventListener('focus', focus);
    window.addEventListener('mistakes:session-ending', cancelUploads);
    return () => { mounted.current = false; cancelUploads(); clearInterval(timer); window.removeEventListener('focus', focus); window.removeEventListener('mistakes:session-ending', cancelUploads); };
  }, [refresh, user.id]);
  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);
  function mergePage(page: PageImport) {
    revision.current += 1;
    if (!mounted.current) return;
    setPages((items) => sortPages([page, ...items.filter((item) => item.id !== page.id)]));
  }
  function makeUrl(file: Blob) { const url = URL.createObjectURL(file); urls.current.add(url); return url; }
  function releaseUrl(url: string) { URL.revokeObjectURL(url); urls.current.delete(url); }
  function add(files: File[]) {
    const valid = files.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    if (valid.length !== files.length) toast.error('请选择 JPG、PNG 或 WebP 图片。');
    if (pending.length + valid.length > 12) { toast.error('每次最多选择 12 张页面图片。'); return; }
    setPending((items) => [...items, ...valid.map((file) => ({ id: crypto.randomUUID(), file, url: makeUrl(file), error: '' }))]);
  }
  function move(index: number, offset: number) {
    setPending((items) => { const copy = [...items]; [copy[index], copy[index + offset]] = [copy[index + offset], copy[index]]; return copy; });
  }
  function remove(id: string) {
    const entry = pending.find((item) => item.id === id);
    if (entry) releaseUrl(entry.url);
    setPending((items) => items.filter((item) => item.id !== id));
  }
  // The thumbnail is object-fit: contain, so scale the spin until the rotated page fits the same box.
  function spinThumbnail(trigger: HTMLElement, direction: number) {
    const image = trigger.closest('li')?.querySelector<HTMLImageElement>('.page-pending-preview img');
    if (!image?.naturalWidth) return Promise.resolve();
    const { width: boxWidth, height: boxHeight } = image.getBoundingClientRect();
    const shownHeight = image.naturalHeight * Math.min(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight);
    const rotatedWidth = image.naturalHeight * Math.min(boxWidth / image.naturalHeight, boxHeight / image.naturalWidth);
    return quarterTurn.turn(image, direction, rotatedWidth / shownHeight);
  }
  async function rotate(entry: PendingPage, direction: number, trigger: HTMLElement) {
    setRotatingId(entry.id);
    try {
      const rotation = quarterTurns((entry.rotation || 0) + direction);
      const spin = spinThumbnail(trigger, direction);
      const url = makeUrl(await rotatedPreview(entry.file, rotation));
      await Promise.all([predecode(url), spin]);
      if (!mounted.current) { releaseUrl(url); return; }
      setPending((items) => items.map((item) => item.id === entry.id ? { ...item, id: crypto.randomUUID(), batchId: undefined, pageOrder: undefined, rotation, url, error: '' } : item));
      releaseUrl(entry.url);
    } catch (err) { quarterTurn.settle(); toast.error((err as Error).message); }
    finally { setRotatingId(''); }
  }
  async function upload() {
    if (uploadController.current || !pending.length) return;
    const controller = new AbortController();
    uploadController.current = controller;
    setUploading(true);
    const snapshot = assignPageUploadBatch(pending);
    setPending(snapshot);
    let selected = false;
    try {
      const uploaded = await uploadPageBatch(snapshot, {
        signal: controller.signal,
        prepare: preparePage,
        send: (body, signal) => api<PageImport>('/page-imports', { method: 'POST', body, signal }),
        onProgress: (index) => setUploadStage(`正在压缩并上传第 ${index + 1}/${snapshot.length} 页…`),
        onSuccess: (entry, page) => {
          mergePage(page);
          if (!selected) { setSelectedId(page.id); selected = true; }
          setPending((items) => items.filter((item) => item.id !== entry.id));
          releaseUrl(entry.url);
        },
        onError: (entry, err) => setPending((items) => items.map((item) => item.id === entry.id ? { ...item, error: err.message } : item)),
      });
      if (uploaded) toast.success(`${uploaded} 页已上传，后台正在分题。`);
    } catch (err) {
      if (!controller.signal.aborted && mounted.current) toast.error((err as Error).message);
    } finally {
      if (uploadController.current === controller) uploadController.current = null;
      if (mounted.current) { setUploading(false); setUploadStage(''); }
    }
  }
  async function pageAction(page: PageImport, action: 'retry' | 'cancel' | 'delete') {
    setBusyIds((ids) => new Set(ids).add(page.id));
    try {
      if (action === 'delete') {
        await api(`/page-imports/${page.id}`, { method: 'DELETE' });
        drafts.current.delete(page.id);
        revision.current += 1; setPages((items) => items.filter((item) => item.id !== page.id)); setDeleteId(null);
      } else mergePage(await api<PageImport>(`/page-imports/${page.id}/${action}`, json({})));
    } catch (err) { toast.error((err as Error).message); }
    finally { setBusyIds((ids) => { const next = new Set(ids); next.delete(page.id); return next; }); }
  }
  async function retryJob(id: number) {
    await api(`/ai/jobs/${id}/retry`, json({}));
    await Promise.all([refresh(), tasks.refresh()]);
  }
  async function retryItem(pageId: number, regionId: string) {
    await api(`/page-imports/${pageId}/items/${encodeURIComponent(regionId)}/retry`, json({}));
    await Promise.all([refresh(), tasks.refresh()]);
  }
  const disabled = uploading || Boolean(rotatingId);
  return <div className="page-imports">
    <header className="page-import-heading"><div><a className="page-import-back" href="#/new"><ArrowLeft size={15} />单题录入</a><h1>按页批量录入</h1><p>上传整页 → 选择题目 → 自动填入草稿。蓝笔答案会一起识别。</p></div><a className="button secondary" href="#/ai-tasks">查看 AI 任务</a></header>
    <section className="page-import-upload" aria-label="添加页面图片">
      <div><h2><ImagePlus size={20} />添加页面</h2><p>每次最多 12 页，支持 JPG、PNG、WebP。先调整顺序和方向，再上传分题。</p></div>
      <input ref={album} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden disabled={disabled} onChange={(event) => { add(Array.from(event.target.files || [])); event.target.value = ''; }} />
      <input ref={camera} type="file" capture="environment" accept="image/jpeg,image/png,image/webp" hidden disabled={disabled} onChange={(event) => { add(Array.from(event.target.files || [])); event.target.value = ''; }} />
      <div className="photo-actions"><button className="button secondary" disabled={disabled} onClick={() => album.current?.click()}><ImagePlus size={16} />选择页面</button><button className="button secondary" disabled={disabled} onClick={() => camera.current?.click()}>拍照</button><span className="page-import-help">保留整页和蓝色笔迹。按 1.、2. 这样的题号分题；同一题里的 1(1)、1(2) 仍算一道题。</span></div>
      {!configured && tasks.config && <p className="ai-notice">页面分题服务尚未启用，请由管理员在设置中配置专用 Gemini API。</p>}
      {pending.length > 0 && <><ol className="page-pending-grid">{pending.map((entry, index) => <li key={entry.id} className="page-pending-card"><div className="page-pending-preview"><img src={entry.url} alt={`待上传页面 ${index + 1}`} /></div><div className="page-pending-caption"><strong>{index + 1}. {entry.file.name}</strong><div><button type="button" className="icon-button" aria-label={`第 ${index + 1} 页向前移动`} disabled={disabled || index === 0} onClick={() => move(index, -1)}><ArrowUp size={16} /></button><button type="button" className="icon-button" aria-label={`第 ${index + 1} 页向后移动`} disabled={disabled || index === pending.length - 1} onClick={() => move(index, 1)}><ArrowDown size={16} /></button><button type="button" className="icon-button" aria-label={`第 ${index + 1} 页左转 90 度`} disabled={disabled} onClick={(event) => void rotate(entry, -1, event.currentTarget)}><RotateCcw size={16} /></button><button type="button" className="icon-button" aria-label={`第 ${index + 1} 页右转 90 度`} disabled={disabled} onClick={(event) => void rotate(entry, 1, event.currentTarget)}><RotateCw size={16} /></button><button type="button" className="icon-button" aria-label={`移除第 ${index + 1} 页`} disabled={disabled} onClick={() => remove(entry.id)}><Trash2 size={16} /></button></div>{entry.error && <p className="form-error" role="alert">{entry.error}</p>}</div></li>)}</ol><div className="photo-actions"><button type="button" className="button primary" disabled={disabled || !configured} onClick={() => void upload()}>{uploading ? <LoaderCircle size={17} className="spin" /> : <Upload size={17} />}{uploadStage || `上传 ${pending.length} 页并分题`}</button><span className="page-import-help">上传完成后，即可离开此页，分题和识别会在后台继续。</span></div></>}
    </section>
    {error && <p className="form-error" role="alert">{error} <button className="table-button" onClick={() => void refresh()}>重新加载</button></p>}
    {!loaded && <p className="page-import-loading"><LoaderCircle className="spin" size={18} />正在读取页面…</p>}
    {loaded && !pages.length && !error && <div className="page-import-empty"><CheckSquare size={34} /><h2>从一整页开始</h2><p>每道题会显示独立题框，点选需要整理的错题，即可批量建立草稿。</p></div>}
    {pages.length > 0 && <div className="page-import-workspace"><aside className="page-import-list" aria-label="已上传页面">{pages.map((page) => <button key={page.id} type="button" className={`page-import-tab${current?.id === page.id ? ' is-active' : ''}`} onClick={() => setSelectedId(page.id)} aria-pressed={current?.id === page.id}><img src={page.imageUrl} alt="" /><span><strong>{page.originalName}</strong><small>{statusLabel[page.status]} · {page.items?.length || 0} 道已录入</small><small>{formatDate(page.createdAt, true)}</small></span>{activeStatus(page.status) && <LoaderCircle size={16} className="spin" />}</button>)}</aside>
      {current && <section className="page-import-current"><header className="page-import-current-heading"><div><h2>{current.originalName}</h2><p role="status">{statusLabel[current.status]}</p></div><div className="photo-actions">{activeStatus(current.status) && <button className="table-button" disabled={busyIds.has(current.id)} onClick={() => void pageAction(current, 'cancel')}>取消分题</button>}{['failed', 'cancelled'].includes(current.status) && <button className="button secondary" disabled={busyIds.has(current.id) || !configured} onClick={() => void pageAction(current, 'retry')}><RefreshCw size={15} />重新分题</button>}<button type="button" className={`table-button${deleteId === current.id ? ' danger' : ''}`} disabled={busyIds.has(current.id)} onClick={() => deleteId === current.id ? void pageAction(current, 'delete') : setDeleteId(current.id)} onBlur={() => setDeleteId(null)}><Trash2 size={15} />{deleteId === current.id ? '确认删除页面' : '删除页面'}</button></div></header>
        {current.error && <p className="form-error" role="alert">{current.error}</p>}
        {current.status === 'succeeded' || current.regions.length ? <PageRegionEditor key={current.id} page={current} draft={drafts.current.get(current.id)} onDraft={(regions) => { if (regions) drafts.current.set(current.id, regions); else drafts.current.delete(current.id); }} canRecognize={Boolean(canRecognize)} onUpdate={mergePage} onRetryJob={retryJob} onRetryItem={retryItem} /> : <div className="page-import-waiting"><img src={current.imageUrl} alt={current.originalName} />{activeStatus(current.status) && <p><LoaderCircle className="spin" size={18} />正在按阿拉伯数字题号分题，完成后即可点选。</p>}</div>}
      </section>}
    </div>}
  </div>;
}

function PageRegionEditor({ page, draft, onDraft, canRecognize, onUpdate, onRetryJob, onRetryItem }: { page: PageImport; draft?: PageRegion[]; onDraft: (regions?: PageRegion[]) => void; canRecognize: boolean; onUpdate: (page: PageImport) => void; onRetryJob: (id: number) => Promise<void>; onRetryItem: (pageId: number, regionId: string) => Promise<void> }) {
  const [regions, setRegions] = useState(draft || page.regions);
  const [dirty, setDirty] = useState(Boolean(draft));
  const [busy, setBusy] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [mode, setMode] = useState<'select' | 'adjust' | 'draw'>('select');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  useEffect(() => { if (!dirty) setRegions(page.regions); }, [page.regions, dirty]);
  function update(next: PageRegion[] | ((regions: PageRegion[]) => PageRegion[])) { const value = typeof next === 'function' ? next(regions) : next; setRegions(value); setDirty(true); onDraft(value); }
  const linked = new Set([...(page.items || []).map((item) => item.regionId), ...page.regions.filter((region) => region.mistakeId).map((region) => region.id)]);
  const selected = regions.filter((region) => region.selected && !linked.has(region.id));
  const selectable = regions.filter((region) => !linked.has(region.id));
  function toggle(id: string) { if (!linked.has(id)) update((items) => items.map((item) => item.id === id ? { ...item, selected: !item.selected } : item)); setActiveId(id); }
  async function save(submit: boolean) {
    setBusy(true);
    try {
      const payload = regions.map(({ id, label, box, selected }) => ({ id, label, box, selected }));
      const result = await api<PageImport>(`/page-imports/${page.id}${submit ? '/import' : ''}`, json({ regions: payload }, submit ? 'POST' : 'PATCH'));
      setRegions(result.regions); setDirty(false); onDraft(); onUpdate(result);
      if (submit) toast.success('已建立草稿，题干与蓝笔答案正在后台识别。');
      else toast.success('题框已保存。');
    } catch (err) { toast.error((err as Error).message); }
    finally { setBusy(false); }
  }
  return <>
    <div className="page-region-tools"><div className="photo-actions"><button type="button" className={`button secondary${mode === 'select' ? ' is-active' : ''}`} aria-pressed={mode === 'select'} disabled={busy} onClick={() => setMode('select')}><MousePointer2 size={16} />点选题目</button><button type="button" className={`button secondary${mode === 'adjust' ? ' is-active' : ''}`} aria-pressed={mode === 'adjust'} disabled={busy} onClick={() => setMode('adjust')}><Move size={16} />调整题框</button><button type="button" className={`button secondary${mode === 'draw' ? ' is-active' : ''}`} aria-pressed={mode === 'draw'} disabled={busy} onClick={() => setMode('draw')}><Plus size={16} />补画题框</button><button type="button" className="table-button" onClick={() => setZoom(true)}><Maximize2 size={16} />放大</button></div><div className="photo-actions"><button type="button" className="table-button" disabled={busy || !selectable.length} onClick={() => update((items) => items.map((item) => linked.has(item.id) ? item : { ...item, selected: true }))}>全选</button><button type="button" className="table-button" disabled={busy || !selected.length} onClick={() => update((items) => items.map((item) => linked.has(item.id) ? item : { ...item, selected: false }))}>取消全选</button><span className="page-import-help">已选 {selected.length} 道{dirty ? ' · 题框待保存' : ''}</span></div></div>
    <p className="page-region-instruction">{mode === 'draw' ? '在页面上拖动画框，保留完整题干、小问和选项。' : mode === 'adjust' ? '拖动题框移动范围，拖动四角调整大小。已录入的题框保持锁定。' : '点击题框选择需要的错题；只有选中的题目会建立草稿。'}</p>
    <RegionCanvas url={page.imageUrl} regions={regions} mode={mode} activeId={activeId} linked={linked} disabled={busy} onActive={setActiveId} onToggle={toggle} onChange={(id, box) => update((items) => items.map((item) => item.id === id ? { ...item, box, mask: undefined } : item))} onAdd={(box) => { const id = crypto.randomUUID(); update((items) => [...items, { id, label: `题目 ${items.length + 1}`, box, selected: true }]); setActiveId(id); setMode('select'); }} />
    {!regions.length && <p className="ai-notice">没有找到题框。可以使用“补画题框”手动添加。</p>}
    <div className="page-region-list">{regions.map((region, index) => {
      const item = page.items?.find((item) => item.regionId === region.id);
      const mistakeId = item?.mistakeId || region.mistakeId;
      return <div key={region.id} className={`page-region-row${activeId === region.id ? ' is-active' : ''}`} onFocus={() => setActiveId(region.id)}>
        <label className="page-region-select"><input type="checkbox" checked={region.selected || Boolean(mistakeId)} disabled={busy || linked.has(region.id)} onChange={() => toggle(region.id)} /><span>{index + 1}</span></label>
        <div className="page-region-row-content"><input className="page-region-label" value={region.label} disabled={busy || linked.has(region.id)} aria-label={`第 ${index + 1} 题题号`} onChange={(event) => update((items) => items.map((entry) => entry.id === region.id ? { ...entry, label: event.target.value } : entry))} />
          {item && <small role="status">{item.status === 'succeeded' ? item.applyStatus === 'applied' ? '已填入草稿' : item.applyStatus === 'conflict' ? '内容已编辑，待确认' : '待配图校对' : item.status === 'preparing' ? '正在准备题目图片…' : item.status === 'failed' ? '处理失败' : item.status === 'cancelled' ? '处理已取消' : '题干与蓝笔答案识别中…'}</small>}
          {item?.error && <small className="form-error">{item.error}</small>}
        </div>
        <div className="page-region-row-actions">{mistakeId && <a className="button secondary" href={`#/mistakes/${mistakeId}/edit`}>打开草稿</a>}
          {item && ['failed', 'cancelled'].includes(item.status) && <button type="button" className="table-button" disabled={retrying === item.regionId} onClick={() => {
            setRetrying(item.regionId);
            void (item.jobId ? onRetryJob(item.jobId) : onRetryItem(page.id, item.regionId)).catch((err: Error) => toast.error(err.message)).finally(() => setRetrying(null));
          }}>{retrying === item.regionId ? '正在重试…' : item.jobId ? '重试识别' : '重试图片准备'}</button>}
          {!linked.has(region.id) && <button className="icon-button" aria-label={`删除第 ${index + 1} 题题框`} disabled={busy} onClick={() => update((items) => items.filter((entry) => entry.id !== region.id))}><Trash2 size={16} /></button>}
        </div>
      </div>;
    })}</div>
    {!canRecognize && <p className="ai-notice">通用识别服务尚未启用。可以先选择题目并保存题框，配置完成后再批量录入。</p>}
    <footer className="page-import-submit"><div><strong>{selected.length} 道待录入</strong><small>无图题直接填入草稿；有配图的题目需要校对。</small></div><div className="photo-actions"><button type="button" className="button secondary" disabled={busy || !dirty} onClick={() => void save(false)}>保存题框</button><button type="button" className="button primary" disabled={busy || !selected.length || !canRecognize} onClick={() => void save(true)}>{busy ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}批量录入所选题目</button></div></footer>
    <AiDialog open={zoom} onClose={() => setZoom(false)} title="来源整页" wide><img className="page-import-zoom" src={page.imageUrl} alt={page.originalName} /></AiDialog>
  </>;
}

type RegionDrag = { pointerId: number; id: string; mode: string; x: number; y: number; box: FigureBox };
function RegionCanvas({ url, regions, mode, activeId, linked, disabled, onActive, onToggle, onChange, onAdd }: {
  url: string; regions: PageRegion[]; mode: 'select' | 'adjust' | 'draw'; activeId: string | null; linked: Set<string>; disabled: boolean;
  onActive: (id: string) => void; onToggle: (id: string) => void; onChange: (id: string, box: FigureBox) => void; onAdd: (box: FigureBox) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<RegionDrag | null>(null);
  const [draft, setDraft] = useState<FigureBox | null>(null);
  const [imageError, setImageError] = useState(false);
  function point(event: PointerEvent) { const rect = stage.current!.getBoundingClientRect(); return [clamp((event.clientX - rect.left) / rect.width), clamp((event.clientY - rect.top) / rect.height)]; }
  function start(event: PointerEvent, id = '', dragMode = 'draw') {
    if (disabled || event.button !== 0 || (dragMode === 'draw' && mode !== 'draw') || (id && (mode !== 'adjust' || linked.has(id)))) return;
    event.preventDefault(); event.stopPropagation();
    stage.current?.setPointerCapture(event.pointerId);
    const [x, y] = point(event);
    const region = regions.find((entry) => entry.id === id);
    if (id) onActive(id);
    setDrag({ pointerId: event.pointerId, id, mode: dragMode, x, y, box: region && validBox(region.box) ? [...region.box] : [x, y, 0, 0] });
  }
  function nextBox(event: PointerEvent, value: RegionDrag): FigureBox {
    const [x, y] = point(event); const dx = x - value.x, dy = y - value.y;
    const [left, top, width, height] = value.box;
    if (value.mode === 'draw') return [Math.min(x, value.x), Math.min(y, value.y), Math.abs(dx), Math.abs(dy)];
    if (value.mode === 'move') return [clamp(left + dx, 0, 1 - width), clamp(top + dy, 0, 1 - height), width, height];
    const x1 = value.mode.includes('w') ? clamp(left + dx, 0, left + width - .01) : left;
    const y1 = value.mode.includes('n') ? clamp(top + dy, 0, top + height - .01) : top;
    const x2 = value.mode.includes('e') ? clamp(left + width + dx, left + .01, 1) : left + width;
    const y2 = value.mode.includes('s') ? clamp(top + height + dy, top + .01, 1) : top + height;
    return [x1, y1, x2 - x1, y2 - y1];
  }
  function move(event: PointerEvent) { if (!drag) return; const box = nextBox(event, drag); if (drag.mode === 'draw') setDraft(box); else onChange(drag.id, box); }
  function finish(event: PointerEvent) {
    if (!drag) return;
    const box = nextBox(event, drag);
    if (drag.mode === 'draw') { if (box[2] >= .015 && box[3] >= .015) onAdd(box); }
    else onChange(drag.id, box);
    if (stage.current?.hasPointerCapture(event.pointerId)) stage.current.releasePointerCapture(event.pointerId);
    setDrag(null); setDraft(null);
  }
  return <><div className="page-region-scroll"><div ref={stage} className={`page-region-stage mode-${mode}`} onPointerDown={(event) => start(event)} onPointerMove={move} onPointerUp={finish} onPointerCancel={() => { setDrag(null); setDraft(null); }}><img src={url} alt="页面题目选框，点击编号框选择题目" draggable={false} onError={() => setImageError(true)} onLoad={() => setImageError(false)} />
    {regions.map((region, index) => validBox(region.box) && <div key={region.id} role="button" tabIndex={disabled ? -1 : 0} aria-pressed={region.selected || linked.has(region.id)} aria-label={`第 ${index + 1} 题 ${region.label}${linked.has(region.id) ? '，已录入' : region.selected ? '，已选择' : '，未选择'}${mode === 'adjust' ? '，方向键移动，Shift 加方向键缩放' : ''}`} className={`page-region-box${region.selected ? ' is-selected' : ''}${activeId === region.id ? ' is-active' : ''}${linked.has(region.id) ? ' is-linked' : ''}`} style={{ left: `${region.box[0] * 100}%`, top: `${region.box[1] * 100}%`, width: `${region.box[2] * 100}%`, height: `${region.box[3] * 100}%`, pointerEvents: mode === 'draw' ? 'none' : undefined }} onPointerDown={(event) => start(event, region.id, 'move')} onClick={() => { if (!disabled && mode === 'select') onToggle(region.id); }} onFocus={() => onActive(region.id)} onKeyDown={(event) => {
      if (disabled || linked.has(region.id)) return;
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); onToggle(region.id); return; }
      if (mode !== 'adjust' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault(); const box: FigureBox = [...region.box]; const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -.005 : .005;
      if (event.shiftKey) { const axis = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 2 : 3; box[axis] = clamp(box[axis] + delta, .01, 1 - box[axis - 2]); }
      else { const axis = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 0 : 1; box[axis] = clamp(box[axis] + delta, 0, 1 - box[axis + 2]); }
      onChange(region.id, box);
    }}><span className="page-region-number">{region.selected || linked.has(region.id) ? <Check size={13} /> : null}{index + 1}</span>{mode === 'adjust' && !linked.has(region.id) && (['nw', 'ne', 'sw', 'se'] as const).map((corner) => <span key={corner} className={`page-region-handle corner-${corner}`} onPointerDown={(event) => start(event, region.id, corner)} />)}</div>)}
    {draft && <div className="page-region-box is-draft" style={{ left: `${draft[0] * 100}%`, top: `${draft[1] * 100}%`, width: `${draft[2] * 100}%`, height: `${draft[3] * 100}%` }} />}
  </div></div>{imageError && <p className="form-error" role="alert">页面图片无法读取，请重新加载。题框改动会保留在当前页面。</p>}</>;
}

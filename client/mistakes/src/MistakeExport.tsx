import { lazy, Suspense, useEffect, useId, useRef, useState, type ComponentProps } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, Download, Eye, FileDown, LoaderCircle, LockKeyhole, Printer, X } from 'lucide-react';
import { Checkbox } from './components';
import { ScrollArea } from './ScrollArea';
import { Select } from './Select';
import { PracticeSpacePicker } from './PracticeSpacePicker';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import { downloadExportFile, requestExportPdf } from './export-api';
import { defaultExportOptions, type ExportFile, type ExportOptions, type ExportRequest } from './export-types';
import type { Mistake } from './types';
import './mistake-export.css';

const PdfPreview = lazy(() => import('./PdfPreview'));

function ExportDialogRoot({ open, ...props }: ComponentProps<typeof Dialog.Root>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // A Root mounted already open skips Base UI's entering phase.
  return <Dialog.Root {...props} open={mounted && open} />;
}

interface MistakeExportProps {
  mistakes: Mistake[];
  totalCount?: number;
  filters?: Record<string, string>;
  selectedIds?: number[];
  single?: boolean;
  onClose: () => void;
}

export function MistakeExport({ mistakes, totalCount, filters, selectedIds = [], single = false, onClose }: MistakeExportProps) {
  const mobile = useMobileLayout();
  const [open, setOpen] = useState(true);
  const [scope, setScope] = useState<'all' | 'selected'>(selectedIds.length ? 'selected' : 'all');
  const [options, setOptions] = useState<ExportOptions>({ ...defaultExportOptions });
  const [file, setFile] = useState<ExportFile | null>(null);
  const [preview, setPreview] = useState(false);
  const [preparing, setPreparing] = useState<'preview' | 'download' | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const notesId = useId();
  const request = useRef<AbortController | null>(null);
  const cache = useRef<{ key: string; file: ExportFile } | null>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const busy = Boolean(preparing);
  const notesUnavailable = options.version === 'practice';
  const eligible = mistakes.filter((mistake) => !mistake.deletedAt);
  const selected = eligible.filter((mistake) => selectedIds.includes(mistake.id));
  const source = single || scope === 'selected' || !filters
    ? { ids: (single || scope === 'all' ? eligible : selected).map((mistake) => mistake.id) }
    : { filters };
  const chosenCount = single || scope === 'selected' ? (single ? eligible.length : selected.length) : totalCount ?? eligible.length;
  const payload: ExportRequest = { source, options: { ...options, title: options.title.trim() || defaultExportOptions.title } };
  const requestKey = JSON.stringify(payload);

  useEffect(() => {
    request.current?.abort();
    request.current = null;
    if (cache.current && cache.current.key !== requestKey) {
      URL.revokeObjectURL(cache.current.file.url);
      cache.current = null;
      setFile(null);
    }
    setPreparing(null);
    setPreview(false);
    setError('');
    setMessage('');
  }, [requestKey]);

  useEffect(() => () => {
    request.current?.abort();
    if (cache.current) URL.revokeObjectURL(cache.current.file.url);
  }, []);

  useEffect(() => {
    if (preview) backButton.current?.focus({ preventScroll: true });
  }, [preview]);

  function update<K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) {
    setOptions((previous) => ({
      ...previous,
      [key]: value,
      ...(key === 'version' && value === 'practice' ? { includeNotes: false } : {}),
    }));
  }

  async function prepare(action: 'preview' | 'download') {
    if (!chosenCount || request.current) return;
    setError(''); setMessage('');
    if (cache.current?.key === requestKey) {
      if (action === 'preview') setPreview(true);
      else { downloadExportFile(cache.current.file); setMessage('PDF 已生成，可再次下载或查看预览。'); }
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPreparing(action);
    try {
      const generated = await requestExportPdf(payload, controller.signal);
      if (controller.signal.aborted || request.current !== controller) { URL.revokeObjectURL(generated.url); return; }
      if (cache.current) URL.revokeObjectURL(cache.current.file.url);
      cache.current = { key: requestKey, file: generated };
      setFile(generated);
      if (action === 'preview') setPreview(true);
      else { downloadExportFile(generated); setMessage('PDF 已生成，可再次下载或查看预览。'); }
    } catch (err) {
      if (!controller.signal.aborted && request.current === controller) setError((err as Error).message || 'PDF 生成失败，请重试。');
    } finally {
      if (request.current === controller) { request.current = null; setPreparing(null); }
    }
  }

  function cancel() {
    request.current?.abort();
    request.current = null;
    setPreparing(null);
    setMessage('已取消生成，可重新选择并导出。');
  }

  function back() {
    setPreview(false);
    window.requestAnimationFrame(() => previewButton.current?.focus());
  }

  function settings(container: HTMLElement | null) {
    return <>
      <fieldset className="export-settings-fields" disabled={busy}>
        {!single && <fieldset className="export-options"><legend>导出范围</legend>
          <label><input type="radio" name="export-scope" checked={scope === 'all'} onChange={() => setScope('all')} /><span>当前筛选结果<small>{totalCount ?? eligible.length} 道题</small></span></label>
          <label className={!selected.length ? 'is-disabled' : ''}><input type="radio" name="export-scope" disabled={!selected.length} checked={scope === 'selected'} onChange={() => setScope('selected')} /><span>已选题目<small>{selected.length} 道题 · 按列表顺序</small></span></label>
        </fieldset>}
        <fieldset className="export-options"><legend>内容版本</legend>
          <label><input type="radio" name="export-version" checked={options.version === 'complete'} onChange={() => update('version', 'complete')} /><span>完整版<small>题干、答案与解析</small></span></label>
          <label><input type="radio" name="export-version" checked={options.version === 'practice'} onChange={() => update('version', 'practice')} /><span>练习版<small>只保留题干，供独立练习</small></span></label>
        </fieldset>
        <div className="export-field-grid">
          <label className="field export-field export-title-field"><span>文档标题</span><input value={options.title} maxLength={80} placeholder="错题" onChange={(event) => update('title', event.target.value)} /></label>
          <div className="field export-field"><span>正文字号</span><Select ariaLabel="正文字号" value={String(options.fontSize)} disabled={busy} portalContainer={container} onChange={(value) => update('fontSize', Number(value) as ExportOptions['fontSize'])} options={[{ value: '10.5', label: '紧凑 · 10.5 磅' }, { value: '12', label: '标准 · 12 磅' }, { value: '14', label: '大字 · 14 磅' }]} /></div>
          <div className="field export-field"><span>题目排版</span><Select ariaLabel="题目排版" value={options.layout} disabled={busy} portalContainer={container} onChange={(value) => update('layout', value as ExportOptions['layout'])} options={[{ value: 'continuous', label: '连续排题' }, { value: 'per-question', label: '每题另起一页' }]} /></div>
          {options.version === 'complete' ? <div className="field export-field export-title-field"><span>答案与解析位置</span><Select ariaLabel="答案与解析位置" value={options.answerPlacement} disabled={busy} portalContainer={container} onChange={(value) => update('answerPlacement', value as ExportOptions['answerPlacement'])} options={[{ value: 'inline', label: '每道题后' }, { value: 'appendix', label: '集中放在文末' }]} /></div> : options.layout === 'continuous' && <div className="field export-field export-title-field"><span>每题答题留白</span><PracticeSpacePicker value={options.practiceSpace} disabled={busy} mobile={mobile} onChange={(value) => update('practiceSpace', value)} /></div>}
        </div>
        <label className={`export-notes-option${notesUnavailable ? ' is-disabled' : ''}`} aria-disabled={notesUnavailable || busy}>
          <Checkbox checked={options.includeNotes} disabled={notesUnavailable || busy} aria-labelledby={`${notesId}-label`} aria-describedby={`${notesId}-hint`} onChange={(event) => update('includeNotes', event.target.checked)} />
          <span className="export-notes-copy"><span id={`${notesId}-label`}>包含我的笔记</span><small id={`${notesId}-hint`} aria-live="polite">{notesUnavailable ? '练习版不包含笔记，切换到完整版后可用。' : '将我的笔记随题目一起导出。'}</small></span>
          {notesUnavailable && <span className="export-notes-lock" aria-hidden="true"><LockKeyhole size={14} />不可用</span>}
        </label>
      </fieldset>
      <p className="export-paper-note">A4 纵向 · 思源宋体正文 · 15 毫米页边距</p>
      {error && <p className="form-error export-feedback" role="alert">{error} 可保留当前设置后重试。</p>}
      <div className="export-feedback" role="status">{preparing ? <><LoaderCircle className="spin" size={16} /><span>正在生成 PDF，题目较多时请稍候…</span><button type="button" className="text-link" onClick={cancel}>取消</button></> : message}</div>
    </>;
  }

  const actions = <><span>共 <strong>{chosenCount}</strong> 道题</span><div><button ref={previewButton} type="button" className="button secondary" disabled={!chosenCount || Boolean(preparing)} onClick={() => void prepare('preview')}>{preparing === 'preview' ? <LoaderCircle className="spin" size={17} /> : <Eye size={17} />}预览 PDF</button><button type="button" className="button primary" disabled={!chosenCount || Boolean(preparing)} onClick={() => void prepare('download')}>{preparing === 'download' ? <LoaderCircle className="spin" size={17} /> : <FileDown size={17} />}下载 PDF</button></div></>;

  function finishClose(value: boolean) {
    if (!value) onClose();
  }

  function changeOpen(value: boolean) {
    if (!value) {
      request.current?.abort();
      request.current = null;
    }
    setOpen(value);
  }

  if (mobile && !(preview && file)) return <MobileDrawer open={open} onOpenChange={changeOpen} onOpenChangeComplete={finishClose} title="导出错题" description="整理成册，用熟悉的试卷字体温习。" closeLabel="关闭导出设置" className="export-mobile-drawer" footer={<div className="export-settings-footer">{actions}</div>}>
    {(container) => <div className="export-mobile-settings">{settings(container)}</div>}
  </MobileDrawer>;

  return <ExportDialogRoot open={open} onOpenChange={changeOpen} onOpenChangeComplete={finishClose}>
    <Dialog.Portal id="mistake-export-root">
      <Dialog.Backdrop className="export-backdrop" />
      <Dialog.Popup ref={setPortalContainer} className={`export-dialog${preview && file ? ' is-preview' : ''}`}>
        {preview && file ? <>
          <header className="export-preview-toolbar">
            <div className="export-preview-heading"><button ref={backButton} type="button" className="button ghost" onClick={back}><ArrowLeft size={17} />设置</button><div><Dialog.Title>导出预览</Dialog.Title><Dialog.Description>{file.count || chosenCount} 道题 · {options.version === 'complete' ? '完整版' : '练习版'} · A4</Dialog.Description></div></div>
            <Dialog.Close className="icon-button export-preview-close" aria-label="关闭导出预览"><X size={21} /></Dialog.Close>
          </header>
          <Suspense fallback={<div className="export-preview-loading" role="status"><LoaderCircle className="spin" size={22} />正在打开 PDF…</div>}><PdfPreview file={file} /></Suspense>
          <footer className="export-preview-actions"><span>预览与下载使用同一份 PDF</span><a className="button secondary" href={file.url} target="_blank" rel="noopener noreferrer"><Printer size={17} />打开 / 打印</a><button type="button" className="button primary" onClick={() => downloadExportFile(file)}><Download size={17} />下载 PDF</button></footer>
        </> : <>
          <header className="export-settings-heading"><div><Dialog.Title>导出错题</Dialog.Title><Dialog.Description>整理成册，用熟悉的试卷字体温习。</Dialog.Description></div><Dialog.Close className="icon-button" aria-label="关闭导出设置"><X size={21} /></Dialog.Close></header>
          <ScrollArea className="export-settings-body">{settings(portalContainer)}</ScrollArea>
          <footer className="export-settings-footer">{actions}</footer>
        </>}
      </Dialog.Popup>
    </Dialog.Portal>
  </ExportDialogRoot>;
}

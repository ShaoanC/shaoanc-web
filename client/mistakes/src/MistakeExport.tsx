import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, Download, Eye, FileDown, LoaderCircle, Printer, X } from 'lucide-react';
import { Checkbox } from './components';
import { downloadExportFile, requestExportPdf } from './export-api';
import { defaultExportOptions, type ExportFile, type ExportOptions, type ExportRequest } from './export-types';
import type { Mistake } from './types';
import './mistake-export.css';

const PdfPreview = lazy(() => import('./PdfPreview'));

interface MistakeExportProps {
  mistakes: Mistake[];
  totalCount?: number;
  filters?: Record<string, string>;
  selectedIds?: number[];
  single?: boolean;
  onClose: () => void;
}

export function MistakeExport({ mistakes, totalCount, filters, selectedIds = [], single = false, onClose }: MistakeExportProps) {
  const [scope, setScope] = useState<'all' | 'selected'>(selectedIds.length ? 'selected' : 'all');
  const [options, setOptions] = useState<ExportOptions>({ ...defaultExportOptions });
  const [file, setFile] = useState<ExportFile | null>(null);
  const [preview, setPreview] = useState(false);
  const [preparing, setPreparing] = useState<'preview' | 'download' | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const request = useRef<AbortController | null>(null);
  const cache = useRef<{ key: string; file: ExportFile } | null>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
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
    setOptions((previous) => ({ ...previous, [key]: value }));
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

  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
    <Dialog.Portal id="mistake-export-root">
      <Dialog.Backdrop className="export-backdrop" />
      <Dialog.Popup className={`export-dialog${preview && file ? ' is-preview' : ''}`}>
        {preview && file ? <>
          <header className="export-preview-toolbar">
            <div className="export-preview-heading"><button ref={backButton} type="button" className="button ghost" onClick={back}><ArrowLeft size={17} />设置</button><div><Dialog.Title>导出预览</Dialog.Title><Dialog.Description>{file.count || chosenCount} 道题 · {options.version === 'complete' ? '完整版' : '练习版'} · A4</Dialog.Description></div></div>
            <Dialog.Close className="icon-button export-preview-close" aria-label="关闭导出预览"><X size={21} /></Dialog.Close>
          </header>
          <Suspense fallback={<div className="export-preview-loading" role="status"><LoaderCircle className="spin" size={22} />正在打开 PDF…</div>}><PdfPreview file={file} /></Suspense>
          <footer className="export-preview-actions"><span>预览与下载使用同一份 PDF</span><a className="button secondary" href={file.url} target="_blank" rel="noopener noreferrer"><Printer size={17} />打开 / 打印</a><button type="button" className="button primary" onClick={() => downloadExportFile(file)}><Download size={17} />下载 PDF</button></footer>
        </> : <>
          <header className="export-settings-heading"><div><Dialog.Title>导出错题</Dialog.Title><Dialog.Description>整理成册，用熟悉的试卷字体温习。</Dialog.Description></div><Dialog.Close className="icon-button" aria-label="关闭导出设置"><X size={21} /></Dialog.Close></header>
          <div className="export-settings-body">
            <fieldset className="export-settings-fields" disabled={Boolean(preparing)}>
              {!single && <fieldset className="export-options"><legend>导出范围</legend>
                <label><input type="radio" name="export-scope" checked={scope === 'all'} onChange={() => setScope('all')} /><span>当前筛选结果<small>{totalCount ?? eligible.length} 道题</small></span></label>
                <label className={!selected.length ? 'is-disabled' : ''}><input type="radio" name="export-scope" disabled={!selected.length} checked={scope === 'selected'} onChange={() => setScope('selected')} /><span>已选题目<small>{selected.length} 道题 · 按列表顺序</small></span></label>
              </fieldset>}
              <fieldset className="export-options"><legend>内容版本</legend>
                <label><input type="radio" name="export-version" checked={options.version === 'complete'} onChange={() => update('version', 'complete')} /><span>完整版<small>题干、答案与解析</small></span></label>
                <label><input type="radio" name="export-version" checked={options.version === 'practice'} onChange={() => update('version', 'practice')} /><span>练习版<small>只保留题干与答题空白</small></span></label>
              </fieldset>
              <div className="export-field-grid">
                <label className="export-field export-title-field"><span>文档标题</span><input value={options.title} maxLength={80} placeholder="拾题错题本" onChange={(event) => update('title', event.target.value)} /></label>
                <label className="export-field"><span>正文字号</span><select value={options.fontSize} onChange={(event) => update('fontSize', Number(event.target.value) as ExportOptions['fontSize'])}><option value="10.5">紧凑 · 10.5 磅</option><option value="12">标准 · 12 磅</option><option value="14">大字 · 14 磅</option></select></label>
                <label className="export-field"><span>题目排版</span><select value={options.layout} onChange={(event) => update('layout', event.target.value as ExportOptions['layout'])}><option value="continuous">连续排题</option><option value="per-question">每题另起一页</option></select></label>
                {options.version === 'complete' ? <label className="export-field export-title-field"><span>答案与解析位置</span><select value={options.answerPlacement} onChange={(event) => update('answerPlacement', event.target.value as ExportOptions['answerPlacement'])}><option value="inline">每道题后</option><option value="appendix">集中放在文末</option></select></label> : <label className="export-field export-title-field"><span>每题答题留白</span><select value={options.practiceSpace} onChange={(event) => update('practiceSpace', Number(event.target.value) as ExportOptions['practiceSpace'])}><option value="20">较少 · 20 毫米</option><option value="40">标准 · 40 毫米</option><option value="60">较多 · 60 毫米</option></select></label>}
              </div>
              <label className="export-notes-option"><Checkbox checked={options.includeNotes} disabled={options.version === 'practice'} onChange={(event) => update('includeNotes', event.target.checked)} />包含我的笔记{options.version === 'practice' && <small>仅完整版可用</small>}</label>
            </fieldset>
            <p className="export-paper-note">A4 纵向 · 思源宋体正文 · 15 毫米页边距</p>
            {error && <p className="form-error export-feedback" role="alert">{error} 可保留当前设置后重试。</p>}
            <div className="export-feedback" role="status">{preparing ? <><LoaderCircle className="spin" size={16} /><span>正在生成 PDF，题目较多时请稍候…</span><button type="button" className="text-link" onClick={cancel}>取消</button></> : message}</div>
          </div>
          <footer className="export-settings-footer"><span>共 <strong>{chosenCount}</strong> 道题</span><div><button ref={previewButton} type="button" className="button secondary" disabled={!chosenCount || Boolean(preparing)} onClick={() => void prepare('preview')}>{preparing === 'preview' ? <LoaderCircle className="spin" size={17} /> : <Eye size={17} />}预览 PDF</button><button type="button" className="button primary" disabled={!chosenCount || Boolean(preparing)} onClick={() => void prepare('download')}>{preparing === 'download' ? <LoaderCircle className="spin" size={17} /> : <FileDown size={17} />}下载 PDF</button></div></footer>
        </>}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}

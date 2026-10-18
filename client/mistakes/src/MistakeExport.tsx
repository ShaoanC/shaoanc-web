import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, FileDown, LoaderCircle, Printer, RotateCcw, X } from 'lucide-react';
import { Checkbox } from './components';
import { knowledgeLabel, useApp } from './context';
import { MarkdownContent } from './MarkdownContent';
import { ratingLabel } from './StarRating';
import type { KnowledgePoint, Mistake, Subject } from './types';
import './mistake-export.css';

interface ExportOptions {
  version: 'complete' | 'practice';
  includeNotes: boolean;
}

interface ExportSnapshot {
  mistakes: Mistake[];
  subjects: Subject[];
  knowledgePoints: KnowledgePoint[];
  options: ExportOptions;
  date: string;
}

interface MistakeExportProps {
  mistakes: Mistake[];
  selectedIds?: number[];
  single?: boolean;
  onClose: () => void;
}

function fitPrintContent(document: HTMLElement) {
  // Measure at the paper's fixed content width, including on narrow screens.
  document.querySelectorAll<HTMLElement>('.katex, table').forEach((element) => {
    element.style.zoom = '1';
    const available = element.closest('.markdown-content')?.clientWidth || document.clientWidth;
    const width = Math.max(element.scrollWidth, element.getBoundingClientRect().width);
    if (width > available) element.style.zoom = String(available / width);
  });
}

function ExportPreview({ snapshot, onBack }: { snapshot: ExportSnapshot; onBack: () => void }) {
  const paper = useRef<HTMLElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const { mistakes, subjects, knowledgePoints, options, date } = snapshot;
  const complete = options.version === 'complete';

  useEffect(() => {
    const title = document.title;
    document.title = `拾题错题本-${date}-${complete ? '完整版' : '练习版'}`;
    document.body.classList.add('export-preview-open');
    backButton.current?.focus({ preventScroll: true });
    return () => {
      document.title = title;
      document.body.classList.remove('export-preview-open');
    };
  }, [date, complete]);

  useEffect(() => {
    let active = true;
    let timeout: number;
    const page = paper.current!;
    setReady(false);
    setError('');
    const images = Array.from(page.querySelectorAll('img'));
    if (attempt) images.forEach((image) => {
      if (image.complete && image.naturalWidth) return;
      const url = new URL(image.src, window.location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        url.searchParams.set('_exportRetry', String(attempt));
        image.src = url.href;
      }
    });
    const resources = Promise.all([
      document.fonts.ready,
      ...images.map((image) => image.decode().catch(() => { throw new Error('有配图加载失败，请重试后打印。'); })),
    ]);
    const deadline = new Promise<never>((_, reject) => {
      timeout = window.setTimeout(() => reject(new Error('字体或配图加载超时，请检查网络后重试。')), 20000);
    });
    void Promise.race([resources, deadline]).then(() => {
      if (!active) return;
      fitPrintContent(page);
      setReady(true);
    }).catch((err: Error) => { if (active) setError(err.message); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); };
  }, [snapshot, attempt]);

  return <>
    <header className="export-preview-toolbar export-screen-only">
      <div className="export-preview-heading">
        <button ref={backButton} type="button" className="button ghost" onClick={onBack}><ArrowLeft size={17} />返回设置</button>
        <div><Dialog.Title>导出预览</Dialog.Title><Dialog.Description>{complete ? '完整版' : '练习版'} · {mistakes.length} 道题 · A4 纵向</Dialog.Description></div>
      </div>
      <div className="export-preview-actions">
        <button type="button" className="button primary" disabled={!ready} onClick={() => window.print()}>{!ready && !error ? <LoaderCircle className="spin" size={17} /> : <Printer size={17} />}打印 / 保存 PDF</button>
        <Dialog.Close className="icon-button" aria-label="关闭导出预览"><X size={21} /></Dialog.Close>
      </div>
    </header>
    <div className="export-preview-message export-screen-only" role={error ? 'alert' : 'status'}>
      {error ? <><span>{error}</span><button type="button" className="text-link" onClick={() => setAttempt((value) => value + 1)}><RotateCcw size={15} />重新加载</button></> : ready ? '在打印窗口选择“另存为 PDF”。建议关闭浏览器页眉和页脚；最终分页以打印窗口为准。' : '正在准备字体和配图…'}
    </div>
    <div className="export-paper-scroll">
      <article ref={paper} className="export-document" aria-label="待导出的错题内容" aria-busy={!ready}>
        <header className="export-document-heading"><p>拾题 · 把错题，学明白。</p><h1>拾题错题本</h1><div><span>{date}</span><span>{complete ? '完整版' : '练习版'}</span><span>共 {mistakes.length} 道</span></div></header>
        {mistakes.map((mistake, index) => <section className="export-question" key={mistake.id}>
          <header className="export-question-heading"><h2>第 {index + 1} 题</h2><span>记录 #{mistake.id}{mistake.lifecycle === 'draft' ? ' · 草稿' : ''}</span></header>
          <p className="export-question-meta">{subjects.find((subject) => subject.id === mistake.subjectId)?.name || '未选学科'} · {knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)} · {ratingLabel(mistake.rating)}</p>
          {mistake.auxiliaryKnowledgePointIds.length > 0 && <p className="export-question-meta">辅助知识点：{mistake.auxiliaryKnowledgePointIds.map((id) => knowledgeLabel(knowledgePoints, id)).join('；')}</p>}
          <MarkdownContent className="export-question-text" emptyText="题干暂未填写">{mistake.question}</MarkdownContent>
          {complete ? <>
            {mistake.answer.trim() && <section className="export-answer"><h3>正确答案</h3><MarkdownContent>{mistake.answer}</MarkdownContent></section>}
            {mistake.analysis.trim() && <section className="export-answer"><h3>解题分析</h3><MarkdownContent>{mistake.analysis}</MarkdownContent></section>}
            {options.includeNotes && mistake.note.trim() && <section className="export-answer export-note"><h3>我的笔记</h3><MarkdownContent>{mistake.note}</MarkdownContent></section>}
          </> : <div className="export-answer-space" aria-label="答题空白" />}
        </section>)}
      </article>
    </div>
  </>;
}

export function MistakeExport({ mistakes, selectedIds = [], single = false, onClose }: MistakeExportProps) {
  const { subjects, knowledgePoints } = useApp();
  const [scope, setScope] = useState<'all' | 'selected'>(selectedIds.length ? 'selected' : 'all');
  const [options, setOptions] = useState<ExportOptions>({ version: 'complete', includeNotes: true });
  const [snapshot, setSnapshot] = useState<ExportSnapshot | null>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const eligible = mistakes.filter((mistake) => !mistake.deletedAt);
  const selected = eligible.filter((mistake) => selectedIds.includes(mistake.id));
  const chosen = single || scope === 'all' ? eligible : selected;

  function preview() {
    if (!chosen.length) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setSnapshot(structuredClone({ mistakes: chosen, subjects, knowledgePoints, options, date }));
  }

  function back() {
    setSnapshot(null);
    window.requestAnimationFrame(() => previewButton.current?.focus());
  }

  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
    <Dialog.Portal id="mistake-export-root">
      <Dialog.Backdrop className="export-backdrop" />
      <Dialog.Popup className={`export-dialog${snapshot ? ' is-preview' : ''}`}>
        {snapshot ? <ExportPreview snapshot={snapshot} onBack={back} /> : <>
          <header className="export-settings-heading"><div><span className="eyebrow">整理成册，随时温习</span><Dialog.Title>导出错题</Dialog.Title></div><Dialog.Close className="icon-button" aria-label="关闭导出设置"><X size={21} /></Dialog.Close></header>
          <Dialog.Description className="export-settings-description">预览排版后，在浏览器打印窗口保存为 PDF。</Dialog.Description>
          {!single && <fieldset className="export-options"><legend>导出范围</legend>
            <label><input type="radio" name="export-scope" value="all" checked={scope === 'all'} onChange={() => setScope('all')} /><span>当前筛选结果<small>{eligible.length} 道题</small></span></label>
            <label className={!selected.length ? 'is-disabled' : ''}><input type="radio" name="export-scope" value="selected" disabled={!selected.length} checked={scope === 'selected'} onChange={() => setScope('selected')} /><span>已选题目<small>{selected.length} 道题</small></span></label>
          </fieldset>}
          <fieldset className="export-options export-version-options"><legend>内容版本</legend>
            <label><input type="radio" name="export-version" value="complete" checked={options.version === 'complete'} onChange={() => setOptions({ ...options, version: 'complete' })} /><span>完整版<small>每题附答案与解析，方便回顾</small></span></label>
            <label><input type="radio" name="export-version" value="practice" checked={options.version === 'practice'} onChange={() => setOptions({ ...options, version: 'practice' })} /><span>练习版<small>仅含题干，留出答题空白</small></span></label>
          </fieldset>
          <label className="export-notes-option"><Checkbox checked={options.includeNotes} disabled={options.version === 'practice'} onChange={(event) => setOptions({ ...options, includeNotes: event.target.checked })} />包含我的笔记{options.version === 'practice' && <small>仅完整版可用</small>}</label>
          <footer className="export-settings-footer"><span>将导出 <strong>{chosen.length}</strong> 道题</span><button ref={previewButton} type="button" className="button primary" disabled={!chosen.length} onClick={preview}><FileDown size={17} />预览排版</button></footer>
        </>}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}

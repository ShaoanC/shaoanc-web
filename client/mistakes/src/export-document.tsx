import { useEffect, useRef, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { MarkdownContent } from './MarkdownContent';
import { knowledgeLabel } from './context';
import { ratingLabel } from './StarRating';
import type { ExportDocumentData, ExportOptions } from './export-types';
import type { Mistake } from './types';
import '@fontsource/noto-serif-sc/400.css';
import '@fontsource/noto-serif-sc/700.css';
import '@fontsource/noto-sans-sc/600.css';
import './export-document.css';

declare global {
  interface Window {
    __MISTAKE_EXPORT_DATA__?: ExportDocumentData;
    __MISTAKE_EXPORT_READY__: boolean;
    __MISTAKE_EXPORT_ERROR__: string;
  }
}

window.__MISTAKE_EXPORT_READY__ = false;
window.__MISTAKE_EXPORT_ERROR__ = '';

function reportError(error: unknown) {
  window.__MISTAKE_EXPORT_ERROR__ = error instanceof Error ? error.message : '错题排版失败，请重试。';
}

window.addEventListener('error', (event) => reportError(event.error || new Error(event.message)));
window.addEventListener('unhandledrejection', (event) => reportError(event.reason));

function Answers({ mistake, options }: { mistake: Mistake; options: ExportOptions }) {
  return <>
    {mistake.answer.trim() && <section className="export-answer"><h3>正确答案</h3><MarkdownContent>{mistake.answer}</MarkdownContent></section>}
    {mistake.analysis.trim() && <section className="export-answer"><h3>解题分析</h3><MarkdownContent>{mistake.analysis}</MarkdownContent></section>}
    {options.includeNotes && mistake.note.trim() && <section className="export-answer export-note"><h3>我的笔记</h3><MarkdownContent>{mistake.note}</MarkdownContent></section>}
  </>;
}

function fitWideContent(document: HTMLElement) {
  // Fit each complete formula once. Markdown may parse a single-line $$...$$ as inline math.
  document.querySelectorAll<HTMLElement>('.markdown-content .katex, .markdown-content table').forEach((element) => {
    if (element.classList.contains('katex') && element.parentElement?.closest('.katex')) return;
    element.style.zoom = '1';
    const available = element.closest('.markdown-content')!.clientWidth;
    const width = Math.max(element.scrollWidth, element.getBoundingClientRect().width);
    if (width > available && available > 0) element.style.zoom = String(available / width);
  });
}

async function prepareDocument(document: HTMLElement) {
  // Force layout first so all font faces required by this document have begun loading.
  document.getBoundingClientRect();
  await document.ownerDocument.fonts.ready;
  if (Array.from(document.ownerDocument.fonts).some((font) => font.status === 'error')) {
    throw new Error('导出字体加载失败，请重试。');
  }
  await Promise.all(Array.from(document.querySelectorAll('img')).map(async (image) => {
    try {
      await image.decode();
      if (!image.naturalWidth) throw new Error('empty image');
    } catch {
      const number = image.closest<HTMLElement>('[data-export-number]')?.dataset.exportNumber;
      throw new Error(`第 ${number || '?'} 题的配图加载失败，请检查图片后重试。`);
    }
  }));
  fitWideContent(document);
  // A4 content is 297mm minus its two 15mm margins. Long questions may split naturally.
  const pageHeight = 267 * 96 / 25.4;
  document.querySelectorAll<HTMLElement>('.export-question, .export-appendix-entry').forEach((element) => {
    element.classList.toggle('export-long-question', element.getBoundingClientRect().height > pageHeight);
  });
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function ExportDocument({ data }: { data: ExportDocumentData }) {
  const paper = useRef<HTMLElement>(null);
  const { mistakes, subjects, knowledgePoints, options, date } = data;
  const complete = options.version === 'complete';
  const appendix = complete && options.answerPlacement === 'appendix';

  useEffect(() => {
    document.title = options.title;
    void prepareDocument(paper.current!).then(() => {
      if (!window.__MISTAKE_EXPORT_ERROR__) window.__MISTAKE_EXPORT_READY__ = true;
    }).catch(reportError);
  }, [options.title]);

  return <article ref={paper} className={`export-document${options.layout === 'per-question' ? ' export-per-question' : ''}`} style={{ fontSize: `${options.fontSize}pt`, '--practice-space': `${options.practiceSpace}mm` } as CSSProperties}>
    <header className="export-document-heading">
      <h1>{options.title}</h1>
      <div><span>{date}</span><span>{complete ? '完整版' : '练习版'}</span><span>共 {mistakes.length} 道题</span></div>
    </header>
    <div className="export-questions">
      {mistakes.map((mistake, index) => <section className="export-question" key={mistake.id} data-export-number={index + 1}>
        <header className="export-question-heading"><h2>第 {index + 1} 题</h2><span>记录 #{mistake.id}{mistake.lifecycle === 'draft' ? ' · 草稿' : ''}</span></header>
        <p className="export-question-meta">{subjects.find((subject) => subject.id === mistake.subjectId)?.name || '未选学科'} · {knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)} · {ratingLabel(mistake.rating)}</p>
        {mistake.auxiliaryKnowledgePointIds.length > 0 && <p className="export-question-meta">辅助知识点：{mistake.auxiliaryKnowledgePointIds.map((id) => knowledgeLabel(knowledgePoints, id)).join('；')}</p>}
        <MarkdownContent className="export-question-text" emptyText="题干暂未填写">{mistake.question}</MarkdownContent>
        {complete ? !appendix && <Answers mistake={mistake} options={options} /> : <div className="export-answer-space" aria-label="答题空白" />}
      </section>)}
    </div>
    {appendix && <section className="export-appendix">
      <header className="export-appendix-heading"><h2>参考答案与解析</h2><p>题号与前面的题目一一对应</p></header>
      {mistakes.map((mistake, index) => <section className="export-appendix-entry" key={mistake.id} data-export-number={index + 1}>
        <h2 className="export-appendix-number">第 {index + 1} 题</h2>
        {!mistake.answer.trim() && !mistake.analysis.trim() && !(options.includeNotes && mistake.note.trim()) ? <p className="export-empty-answer">答案和解析暂未填写</p> : <Answers mistake={mistake} options={options} />}
      </section>)}
    </section>}
  </article>;
}

const data = window.__MISTAKE_EXPORT_DATA__;
if (data) {
  createRoot(document.getElementById('root')!).render(<ExportDocument data={data} />);
} else {
  reportError(new Error('请从错题列表或详情页发起导出。'));
  document.getElementById('root')!.textContent = window.__MISTAKE_EXPORT_ERROR__;
}

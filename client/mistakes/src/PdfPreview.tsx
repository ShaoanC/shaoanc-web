import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, RotateCcw } from 'lucide-react';
import { getDocument, PDFWorker, TextLayer, type PDFDocumentLoadingTask, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs';
import PdfJsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker';
import './pdf-preview.css';
import type { ExportFile } from './export-types';

function PdfPage({ document, number, width, height, active }: { document: PDFDocumentProxy; number: number; width: number; height: number; active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active || !canvas.current || !text.current) return;
    const surface = canvas.current;
    const textContainer = text.current;
    let alive = true;
    let rendering: RenderTask | undefined;
    let textLayer: TextLayer | undefined;
    setReady(false); setError('');
    void document.getPage(number).then(async (page) => {
      if (!alive) return;
      const scale = width / page.getViewport({ scale: 1 }).width;
      const viewport = page.getViewport({ scale });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.ceil(viewport.width * pixelRatio);
      surface.height = Math.ceil(viewport.height * pixelRatio);
      textContainer.style.setProperty('--total-scale-factor', String(scale));
      textContainer.style.setProperty('--scale-factor', String(scale));
      rendering = page.render({ canvas: surface, viewport, transform: [pixelRatio, 0, 0, pixelRatio, 0, 0] });
      await rendering.promise;
      if (!alive) return;
      setReady(true);
      const content = await page.getTextContent();
      if (!alive) return;
      textContainer.replaceChildren();
      textLayer = new TextLayer({ textContentSource: content, container: textContainer, viewport });
      await textLayer.render();
    }).catch((err: Error) => {
      if (alive && err.name !== 'RenderingCancelledException') setError('这一页暂时无法显示。');
    });
    return () => {
      alive = false;
      rendering?.cancel();
      textLayer?.cancel();
      textContainer.replaceChildren();
      surface.width = 0;
      surface.height = 0;
    };
  }, [document, number, width, active, attempt]);

  return <section className="export-pdf-sheet" data-pdf-page={number} style={{ width, height }} aria-label={`第 ${number} 页`} aria-busy={active && !ready && !error}>
    {active && <><canvas ref={canvas} style={{ width, height }} aria-hidden="true" /><div ref={text} className="textLayer export-pdf-text-layer" style={{ width, height } as CSSProperties} /></>}
    {active && !ready && !error && <div className="export-page-placeholder"><LoaderCircle size={20} className="spin" /><span>第 {number} 页</span></div>}
    {error && active && <div className="export-page-placeholder" role="alert"><span>{error}</span><button type="button" className="text-link" onClick={() => setAttempt((value) => value + 1)}><RotateCcw size={15} />重试此页</button></div>}
    {!active && <span className="export-page-placeholder">第 {number} 页</span>}
  </section>;
}

export default function PdfPreview({ file }: { file: ExportFile }) {
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [size, setSize] = useState({ width: 595.28, height: 841.89 });
  const [available, setAvailable] = useState(320);
  const [zoom, setZoom] = useState('fit');
  const [current, setCurrent] = useState(1);
  const currentPage = useRef(1);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const pageWidth = zoom === 'fit' ? Math.min(available, 794) : 794 * Number(zoom);
  const pageHeight = pageWidth * size.height / size.width;

  useEffect(() => {
    let alive = true;
    let loading: PDFDocumentLoadingTask | undefined;
    let worker: Worker | undefined;
    let pdfWorker: PDFWorker | undefined;
    const dispose = () => {
      void loading?.destroy().catch(() => {});
      pdfWorker?.destroy();
      worker?.terminate();
    };
    const fail = () => {
      if (!alive) return;
      setDocument(null);
      setError('PDF 预览暂时无法打开。你仍可下载文件，或重试预览。');
      dispose();
    };
    setDocument(null); setError(''); setCurrent(1); currentPage.current = 1;
    void (async () => {
      // Give each load fresh bytes: PDF.js transfers the buffer to its worker.
      const data = new Uint8Array(await file.blob.arrayBuffer());
      if (!alive) return;
      // Vite emits a .js worker, including on servers without an .mjs MIME mapping.
      // Own each worker so a failed startup cannot poison PDF.js's cached fallback.
      worker = new PdfJsWorker();
      worker.addEventListener('error', (event) => {
        event.preventDefault();
        fail();
      });
      pdfWorker = PDFWorker.create({ port: worker });
      loading = getDocument({ data, worker: pdfWorker });
      const pdf = await loading.promise;
      const firstPage = await pdf.getPage(1);
      if (!alive) return;
      const viewport = firstPage.getViewport({ scale: 1 });
      setSize({ width: viewport.width, height: viewport.height });
      setDocument(pdf);
      if (scroller.current) scroller.current.scrollTop = 0;
    })().catch(fail);
    return () => { alive = false; dispose(); };
  }, [file.blob, attempt]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const observer = new ResizeObserver(() => {
      const style = window.getComputedStyle(root);
      setAvailable(Math.max(160, root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)));
    });
    observer.observe(root);
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame.current); };
  }, []);

  function goTo(number: number) {
    const root = scroller.current;
    const sheet = root?.querySelector<HTMLElement>(`[data-pdf-page="${number}"]`);
    if (!root || !sheet) return;
    root.scrollTo({ top: root.scrollTop + sheet.getBoundingClientRect().top - root.getBoundingClientRect().top - 16, behavior: 'instant' });
    setCurrent(number); currentPage.current = number;
  }

  useEffect(() => {
    if (!document) return;
    const animation = window.requestAnimationFrame(() => goTo(currentPage.current));
    return () => window.cancelAnimationFrame(animation);
  }, [pageWidth, document]);

  function trackPage() {
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      const root = scroller.current;
      if (!root) return;
      const top = root.getBoundingClientRect().top;
      const sheets = root.querySelectorAll<HTMLElement>('[data-pdf-page]');
      for (const sheet of sheets) {
        if (sheet.getBoundingClientRect().bottom > top + 32) {
          const number = Number(sheet.dataset.pdfPage);
          setCurrent(number); currentPage.current = number;
          break;
        }
      }
    });
  }

  return <>
    <nav className="export-pdf-controls" aria-label="PDF 预览控制">
      <div className="export-pdf-pager"><button type="button" className="icon-button" aria-label="上一页" disabled={!document || current <= 1} onClick={() => goTo(current - 1)}><ChevronLeft size={20} /></button><span role="status" aria-live="polite">{document ? `第 ${current} / ${document.numPages} 页` : '准备分页…'}</span><button type="button" className="icon-button" aria-label="下一页" disabled={!document || current >= document.numPages} onClick={() => goTo(current + 1)}><ChevronRight size={20} /></button></div>
      <label className="export-zoom"><span>缩放</span><select aria-label="预览缩放" value={zoom} onChange={(event) => setZoom(event.target.value)}><option value="fit">适应宽度</option><option value="0.75">75%</option><option value="1">原尺寸 · 100%</option><option value="1.25">125%</option><option value="1.5">150%</option></select></label>
    </nav>
    <div ref={scroller} className="export-paper-scroll" onScroll={trackPage} tabIndex={0} aria-label="PDF 分页预览">
      {error ? <div className="export-preview-loading" role="alert"><p>{error}</p><button type="button" className="button secondary" onClick={() => setAttempt((value) => value + 1)}><RotateCcw size={16} />重试预览</button></div> : !document ? <div className="export-preview-loading" role="status"><LoaderCircle size={22} className="spin" />正在读取 PDF 分页…</div> : <div className="export-pdf-pages" style={{ minWidth: pageWidth }}>{Array.from({ length: document.numPages }, (_, index) => <div className="export-pdf-page" key={index}><PdfPage document={document} number={index + 1} width={pageWidth} height={pageHeight} active={Math.abs(index + 1 - current) <= 1} /><p className="export-page-number" aria-hidden="true">{index + 1} / {document.numPages}</p></div>)}</div>}
    </div>
  </>;
}

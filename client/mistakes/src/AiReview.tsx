import { useEffect, useRef, useState } from 'react';
import { Check, ImagePlus, Trash2, ZoomIn } from 'lucide-react';
import { api } from './api';
import { knowledgeLabel, useApp } from './context';
import { AiDialog } from './AiDialog';
import { MarkdownContent } from './MarkdownContent';
import { cropFigure, figureMarker, ImageRegions, validBox, type EditableFigure } from './ImageRegions';
import type { AiApplyOptions, AiInput, AiJob, FigureBox, MistakeImage } from './ai-types';

interface ReviewDraft {
  text: string; figures: EditableFigure[]; subjectId: string | null; primaryKnowledgePointId: number | null; auxiliaryKnowledgePointIds: number[];
  primaryPath: string; auxiliaryPaths: string; expectedInput: AiInput;
}
const markersOf = (text: string) => [...text.matchAll(/\[\[figure:([^\]\r\n]+)\]\]/g)].map((match) => match[1]);
const escapeAlt = (value: string) => value.replace(/[\[\]\\\r\n]/g, ' ').trim();
const storeKey = (job: AiJob) => `mistakes-ai-review-${job.mistakeId}-${job.id}`;
function initialDraft(job: AiJob, input: AiInput): ReviewDraft {
  try { const saved = sessionStorage.getItem(storeKey(job)); if (saved) return JSON.parse(saved) as ReviewDraft; } catch { /* Continue with the retained model result. */ }
  const figures = (job.result?.figures || job.result?.diagramImageIds?.map((imageId, index) => ({ id: `legacy-${imageId}-${index}`, imageId, box: [0, 0, 1, 1] as FigureBox, description: '原题配图' })) || [])
    .map((figure) => ({ ...figure, selected: validBox(figure.box), clientId: crypto.randomUUID() }));
  let text = job.result?.[job.type] || '';
  if (!job.result?.figures?.length && job.result?.diagramImageIds?.length) {
    text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim();
    text += figures.map((figure) => `\n\n${figureMarker(figure.id)}`).join('');
  }
  return { text, figures, subjectId: job.result?.subjectId ?? input.subjectId, primaryKnowledgePointId: job.result?.primaryKnowledgePointId ?? null, auxiliaryKnowledgePointIds: job.result?.auxiliaryKnowledgePointIds || [], primaryPath: job.result?.primaryPath?.join(' / ') || '', auxiliaryPaths: job.result?.auxiliaryPaths?.map((path) => path.join(' / ')).join('\n') || '', expectedInput: structuredClone(input) };
}

export function AiReview({ job, input, busy, onApply, onDismiss }: { job: AiJob; input: AiInput; busy: boolean; onApply: (options: AiApplyOptions) => Promise<void>; onDismiss: () => void }) {
  const { subjects, knowledgePoints } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ReviewDraft>(() => initialDraft(job, input));
  const draftRef = useRef(draft);
  const [images, setImages] = useState<MistakeImage[]>([]);
  const [imageId, setImageId] = useState(job.imageIds[0]);
  const [activeId, setActiveId] = useState<string | null>(draft.figures[0]?.id || null);
  const [redrawId, setRedrawId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'image' | 'result'>('image');
  const [preview, setPreview] = useState(false);
  const [full, setFull] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState('');
  const textInput = useRef<HTMLTextAreaElement>(null);
  const cursor = useRef<{ start: number; end: number } | null>(null);
  const locked = busy || uploading;
  const source = images.find((image) => image.id === imageId);
  const referenced = markersOf(draft.text);
  const unmatched = [...new Set(referenced.filter((id) => !draft.figures.some((figure) => figure.id === id && figure.selected && validBox(figure.box) && images.some((image) => image.id === figure.imageId))))];
  const unplaced = draft.figures.filter((figure) => figure.selected && validBox(figure.box) && !referenced.includes(figure.id));
  const points = knowledgePoints.filter((point) => point.subjectId === draft.subjectId);
  const changedDuringReview = JSON.stringify(input) !== JSON.stringify(draft.expectedInput);
  function update(patch: Partial<ReviewDraft>) { draftRef.current = { ...draftRef.current, ...patch }; setDraft(draftRef.current); }
  useEffect(() => {
    try { sessionStorage.setItem(storeKey(job), JSON.stringify(draft)); } catch { /* The open review still retains its draft. */ }
  }, [draft, job.id, job.mistakeId]);
  useEffect(() => {
    if (!open) return;
    let active = true;
    api<MistakeImage[]>(`/mistakes/${job.mistakeId}/images`).then((items) => { if (active) { setImages(items.filter((image) => job.imageIds.includes(image.id))); setError(''); } }).catch((err: Error) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [open, job.id, job.mistakeId]);
  useEffect(() => {
    if (!open || !images.length) return;
    let active = true;
    const urls: string[] = [];
    const timer = window.setTimeout(() => { void Promise.all(draft.figures.filter((figure) => validBox(figure.box)).map(async (figure) => {
      const image = images.find((image) => image.id === figure.imageId);
      if (!image || !validBox(figure.box)) return null;
      try { const blob = await cropFigure(image.cropUrl, figure.box); const url = URL.createObjectURL(blob); urls.push(url); return [figure.id, url] as const; } catch { return null; }
    })).then((items) => { if (active) setPreviews(Object.fromEntries(items.filter((item) => item !== null))); else urls.forEach(URL.revokeObjectURL); }); }, 120);
    return () => { active = false; window.clearTimeout(timer); urls.forEach(URL.revokeObjectURL); };
  }, [draft.figures, images, open]);
  function show() {
    setOpen(true);
  }
  function changeBox(id: string, box: FigureBox) {
    update({ figures: draftRef.current.figures.map((figure) => figure.id === id ? { ...figure, box, selected: true, clientId: crypto.randomUUID(), uploadedId: undefined, uploadedUrl: undefined } : figure) });
  }
  function insert(id: string) {
    const marker = figureMarker(id);
    const original = draftRef.current.text;
    let text = original.split(marker).join('');
    const position = cursor.current ? original.slice(0, cursor.current.start).split(marker).join('').length : text.length;
    const addition = `\n\n${marker}\n\n`;
    text = text.slice(0, position) + addition + text.slice(position);
    update({ text, figures: draftRef.current.figures.map((figure) => figure.id === id ? { ...figure, selected: true } : figure) });
    const end = position + addition.length; cursor.current = { start: end, end };
    setPreview(false); setMobileView('result');
    requestAnimationFrame(() => { textInput.current?.focus(); textInput.current?.setSelectionRange(end, end); });
  }
  function remove(id: string) { update({ text: draftRef.current.text.split(figureMarker(id)).join(''), figures: draftRef.current.figures.filter((figure) => figure.id !== id) }); if (activeId === id) setActiveId(null); }
  function add(box: FigureBox) {
    const figure: EditableFigure = { id: `manual-${crypto.randomUUID()}`, imageId, box, description: '原题配图', selected: true, clientId: crypto.randomUUID() };
    update({ figures: [...draftRef.current.figures, figure] }); setActiveId(figure.id);
  }
  async function apply(force = false, mode: 'replace' | 'append' = 'replace') {
    setError('');
    const snapshot = draftRef.current;
    const markers = markersOf(snapshot.text);
    if (markers.some((id) => !snapshot.figures.some((figure) => figure.id === id && figure.selected && validBox(figure.box) && images.some((image) => image.id === figure.imageId)))) { setError('有配图标记没有有效选框，请补画对应区域或移除标记。'); return; }
    setUploading(true);
    try {
      const uploads = new Map<string, string>();
      const ordered = [...new Set(markers)].map((id) => snapshot.figures.find((figure) => figure.id === id)!);
      for (const [index, figure] of ordered.entries()) {
        if (figure.uploadedId && figure.uploadedUrl) { uploads.set(figure.id, figure.uploadedUrl); continue; }
        const image = images.find((item) => item.id === figure.imageId);
        if (!image || !validBox(figure.box)) throw new Error('来源图或选框已失效，请重新框选。');
        setStage(`正在上传配图 ${index + 1}/${ordered.length}…`);
        const blob = await cropFigure(image.cropUrl, figure.box);
        const form = new FormData();
        form.append('original', blob, `${figure.id}.jpg`); form.append('crop', blob, `${figure.id}.jpg`); form.append('purpose', 'question'); form.append('sourceImageId', String(figure.imageId)); form.append('clientId', figure.clientId);
        const uploaded = await api<MistakeImage>(`/mistakes/${job.mistakeId}/images`, { method: 'POST', body: form });
        uploads.set(figure.id, uploaded.cropUrl);
        update({ figures: draftRef.current.figures.map((item) => item.id === figure.id ? { ...item, uploadedId: uploaded.id, uploadedUrl: uploaded.cropUrl } : item) });
      }
      let text = snapshot.text;
      for (const figure of ordered) text = text.split(figureMarker(figure.id)).join(`![${escapeAlt(figure.description) || '原题配图'}](${uploads.get(figure.id)})`);
      const review = { [job.type]: text, ...(job.type === 'question' ? { subjectId: snapshot.subjectId, primaryKnowledgePointId: snapshot.primaryKnowledgePointId, auxiliaryKnowledgePointIds: snapshot.auxiliaryKnowledgePointIds, ...(!snapshot.primaryKnowledgePointId && snapshot.primaryPath.trim() ? { primaryPath: snapshot.primaryPath.split('/').map((part) => part.trim()).filter(Boolean) } : {}), ...(snapshot.auxiliaryPaths.trim() ? { auxiliaryPaths: snapshot.auxiliaryPaths.split('\n').filter((line) => line.trim()).map((line) => line.split('/').map((part) => part.trim()).filter(Boolean)) } : {}) } : {}) };
      setStage('正在填入校对结果…');
      await onApply({ review, force, mode, expectedInput: snapshot.expectedInput });
      sessionStorage.removeItem(storeKey(job)); setOpen(false); setConflict(false);
    } catch (err) {
      const message = (err as Error).message;
      setError(`${message} 校对文字和选框已保留，可继续修改或重试。`);
      if (/冲突|修改|变化|覆盖/.test(message)) setConflict(true);
    } finally { setUploading(false); setStage(''); }
  }
  const imageUrls: Record<string, string> = {};
  let previewText = draft.text;
  for (const figure of draft.figures) {
    if (!figure.selected || !previews[figure.id]) continue;
    const path = `/ai-figure-preview/${encodeURIComponent(figure.id)}`;
    imageUrls[path] = previews[figure.id];
    previewText = previewText.split(figureMarker(figure.id)).join(`![${escapeAlt(figure.description) || '原题配图'}](${path})`);
  }
  return <section className="ai-result">
    <h3>{job.type === 'question' ? '题干识别' : job.type === 'answer' ? '答案识别' : '生成解析'}结果</h3>
    <p className="ai-notice">{job.applyStatus === 'conflict' ? '内容已变化，识别结果已保留。校对后再选择是否替换。' : job.result?.needsReview ? '识别完成，待校对。请检查疑点、图形范围和插入位置。' : '结果已保留，校对后可填入。'}</p>
    <div className="ai-candidate-excerpt"><MarkdownContent>{(job.result?.[job.type] || '').slice(0, 500)}</MarkdownContent></div>
    <div className="photo-actions"><button type="button" className="button primary" disabled={busy} onClick={show}>校对并填入</button><button type="button" className="table-button" onClick={onDismiss}>暂不填入</button></div>
    <AiDialog open={open} onClose={() => { if (!locked) setOpen(false); }} title={job.type === 'question' ? '校对题干与配图' : job.type === 'answer' ? '校对答案' : '校对解析'} description="检查原题内容与图形。框选只改变截图范围，重叠笔迹可保留原样。" wide>
      <div className="ai-review-tabs" role="group" aria-label="校对视图"><button type="button" aria-pressed={mobileView === 'image'} onClick={() => setMobileView('image')}>图片</button><button type="button" aria-pressed={mobileView === 'result'} onClick={() => setMobileView('result')}>结果</button></div>
      <div className="ai-review-grid">
        <section className={`ai-review-source${mobileView === 'image' ? ' is-mobile-active' : ''}`}>
          <h3>来源图片</h3><div className="ai-source-tabs">{job.imageIds.map((id, index) => <button type="button" key={id} className={id === imageId ? 'is-active' : ''} onClick={() => { setImageId(id); setRedrawId(null); }}>图片 {index + 1}</button>)}</div>
          {source ? <ImageRegions url={source.cropUrl} figures={draft.figures.map((figure, index) => ({ ...figure, number: index + 1 })).filter((figure) => figure.imageId === imageId)} activeId={activeId} onActive={setActiveId} onChange={changeBox} onAdd={add} disabled={locked} onZoom={() => setFull(source.cropUrl)} redrawId={redrawId} onRedrawDone={() => setRedrawId(null)} /> : <p className="ai-empty">{job.imageIds.length ? '正在加载来源图片…' : '这项任务没有来源图片。'}</p>}
          <p className="ai-notice">配图与题干使用同一张裁剪图。图形与作答重叠时，请检查截图内容；不会自动擦除彩色笔迹。</p>
          <div className="ai-figure-list">{draft.figures.map((figure, index) => <article key={figure.id} className={`ai-figure-item${activeId === figure.id ? ' is-active' : ''}`}>
            <div className="ai-figure-heading"><label><input type="checkbox" disabled={locked || !validBox(figure.box)} checked={figure.selected} onChange={(event) => { const selected = event.target.checked; update({ text: selected ? draftRef.current.text : draftRef.current.text.split(figureMarker(figure.id)).join(''), figures: draftRef.current.figures.map((item) => item.id === figure.id ? { ...item, selected } : item) }); }} />配图 {index + 1} <small>来源图片 {job.imageIds.indexOf(figure.imageId) + 1}</small></label><button type="button" className="icon-button" disabled={locked} aria-label={`删除配图 ${index + 1}`} onClick={() => remove(figure.id)}><Trash2 size={15} /></button></div>
            {previews[figure.id] && <button type="button" className="ai-figure-preview" aria-label={`放大配图 ${index + 1}`} onClick={() => { setImageId(figure.imageId); setActiveId(figure.id); setFull(previews[figure.id]); }}><img src={previews[figure.id]} alt={figure.description || `配图 ${index + 1}`} /><ZoomIn size={15} /></button>}
            {!validBox(figure.box) && <p className="form-error">定位无效，不会自动裁图。请重新框选或删除配图和标记。</p>}
            <label className="field"><span>配图 {index + 1} 说明</span><input value={figure.description} disabled={locked} onFocus={() => { setActiveId(figure.id); setImageId(figure.imageId); }} onChange={(event) => update({ figures: draftRef.current.figures.map((item) => item.id === figure.id ? { ...item, description: event.target.value } : item) })} /></label>
            <div className="photo-actions"><button type="button" className="table-button" disabled={locked || !validBox(figure.box)} onMouseDown={(event) => event.preventDefault()} onClick={() => insert(figure.id)}><ImagePlus size={14} />{referenced.includes(figure.id) ? '移到文本光标处' : '插入配图'}</button><button type="button" className="table-button" disabled={locked} onClick={() => { setImageId(figure.imageId); setActiveId(figure.id); setRedrawId(figure.id); setMobileView('image'); }}>重新框选</button></div>
          </article>)}</div>
        </section>
        <section className={`ai-review-result${mobileView === 'result' ? ' is-mobile-active' : ''}`}>
          <div className="markdown-field-heading"><h3>可编辑结果</h3><div className="markdown-field-modes"><button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>编辑</button><button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>预览</button></div></div>
          {preview ? <div className="ai-reviewed-preview"><MarkdownContent imageUrls={imageUrls}>{previewText}</MarkdownContent></div> : <textarea ref={textInput} className="ai-review-text" aria-label="校对识别文字" maxLength={20000} value={draft.text} disabled={locked} onChange={(event) => update({ text: event.target.value })} onSelect={(event) => { cursor.current = { start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd }; }} />}
          <p className="ai-notice">配图标记决定填入位置。先在文字中放置光标，再点“插入配图”；没有光标时追加到末尾。预览支持公式与表格。</p>
          {job.result?.issues?.length ? <div className="ai-review-issues" role="note"><strong>需要检查</strong><ul>{job.result.issues.map((issue, index) => <li key={index}>{issue.imageId ? `图片 ${job.imageIds.indexOf(issue.imageId) + 1}：` : ''}{issue.description}</li>)}</ul></div> : null}
          {unmatched.length > 0 && <div className="ai-review-issues"><strong>以下标记没有有效选框</strong>{unmatched.map((id) => <p key={id}>{figureMarker(id)} <button type="button" className="table-button" disabled={locked} onClick={() => update({ text: draftRef.current.text.split(figureMarker(id)).join('') })}>移除标记</button></p>)}<p>请为对应配图重新框选；无对应配图时可补画后插入新标记。</p></div>}
          {unplaced.length > 0 && <p className="ai-notice">{unplaced.length} 张选中配图还没有插入文字，填入前请点“插入配图”或取消勾选。</p>}
          {job.type === 'question' && <div className="ai-review-classification"><h3>归类</h3><label className="field"><span>学科</span><select disabled={locked} value={draft.subjectId || ''} onChange={(event) => update({ subjectId: event.target.value || null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [], primaryPath: '', auxiliaryPaths: '' })}><option value="">暂不归类</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label><label className="field"><span>主知识点</span><select value={draft.primaryKnowledgePointId || ''} disabled={locked || !draft.subjectId} onChange={(event) => update({ primaryKnowledgePointId: event.target.value ? Number(event.target.value) : null, primaryPath: '' })}><option value="">暂不标注 / 使用下方建议</option>{points.map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select></label><div className="field"><span>辅助知识点</span><div className="ai-review-knowledge">{points.filter((point) => point.id !== draft.primaryKnowledgePointId).map((point) => <label key={point.id}><input type="checkbox" disabled={locked} checked={draft.auxiliaryKnowledgePointIds.includes(point.id)} onChange={(event) => update({ auxiliaryKnowledgePointIds: event.target.checked ? [...draft.auxiliaryKnowledgePointIds, point.id] : draft.auxiliaryKnowledgePointIds.filter((id) => id !== point.id) })} />{knowledgeLabel(knowledgePoints, point.id)}</label>)}</div></div>{!draft.primaryKnowledgePointId && <label className="field"><span>建议主知识点路径（可修改，填入时才创建）</span><input disabled={locked || !draft.subjectId} value={draft.primaryPath} onChange={(event) => update({ primaryPath: event.target.value })} placeholder="如：几何 / 三角形" /></label>}<label className="field"><span>建议辅助知识点路径（每行一个）</span><textarea rows={2} disabled={locked || !draft.subjectId} value={draft.auxiliaryPaths} onChange={(event) => update({ auxiliaryPaths: event.target.value })} /></label></div>}
          <details className="ai-original-result"><summary>查看原始识别结果</summary><MarkdownContent>{job.result?.[job.type] || ''}</MarkdownContent></details>
        </section>
      </div>
      {changedDuringReview && <p className="ai-review-issues">编辑器内容在校对期间发生了修改。校对稿仍保留，填入时会继续检查冲突。</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {stage && <p className="ai-notice" role="status">{stage}</p>}
      <div className="photo-actions ai-review-footer"><button type="button" className="button primary" disabled={locked || unmatched.length > 0 || unplaced.length > 0} onClick={() => void apply()}><Check size={16} />{locked ? '正在处理…' : '填入校对结果'}</button>{(conflict || job.applyStatus === 'conflict' || Boolean(input[job.type].trim())) && <button type="button" className="button secondary" disabled={locked || unmatched.length > 0 || unplaced.length > 0} onClick={() => void apply(true)}>确认替换当前内容</button>}{job.type === 'answer' && <button type="button" className="button secondary" disabled={locked || unmatched.length > 0 || unplaced.length > 0} onClick={() => void apply(true, 'append')}>追加到答案</button>}<button type="button" className="table-button" disabled={locked} onClick={() => setOpen(false)}>保留校对稿，稍后继续</button></div>
    </AiDialog>
    <AiDialog open={Boolean(full)} onClose={() => setFull(null)} title="查看配图" wide>{full && <div className="ai-zoom-image"><img src={full} alt="放大查看图片与标注" /></div>}</AiDialog>
  </section>;
}

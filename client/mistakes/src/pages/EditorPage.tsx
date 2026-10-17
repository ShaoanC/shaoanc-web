import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, FileText, Layers, Pencil, Sparkles, StickyNote } from 'lucide-react';
import { api, json, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { Checkbox, DataTypeBadge, ErrorState } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { MarkdownField, type MarkdownFieldHandle } from '../MarkdownField';
import { MarkdownContent } from '../MarkdownContent';
import { SaveDock } from '../SaveDock';
import { ScrollArea } from '../ScrollArea';
import { StarRatingPicker } from '../StarRating';
import { PhotoInput, type PhotoInputHandle } from '../PhotoInput';
import { ImageHistory } from '../ImageHistory';
import { AI_LABELS, isActiveJob, useAiTasks } from '../AiTasks';
import type { AiInput, AiJob, ImagePurpose } from '../ai-types';
import type { Lifecycle, Mistake } from '../types';

type EditorTab = 'question' | 'answers' | 'note' | 'classification';
type Form = AiInput & { note: string; rating: number; lifecycle: Lifecycle };
const formKeys: (keyof Form)[] = ['question', 'answer', 'analysis', 'note', 'rating', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds', 'lifecycle'];
const empty: Form = { question: '', answer: '', analysis: '', note: '', rating: 0, subjectId: null, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [], lifecycle: 'draft' };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const inputOf = (value: Form | Mistake): AiInput => ({ question: value.question, answer: value.answer, analysis: value.analysis, subjectId: value.subjectId, primaryKnowledgePointId: value.primaryKnowledgePointId, auxiliaryKnowledgePointIds: value.auxiliaryKnowledgePointIds });
const resultFields = (job: AiJob): (keyof Form)[] => job.type === 'question' ? ['question', 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds'] : [job.type];

export function EditorPage({ id }: { id?: number }) {
  const { subjects, knowledgePoints, refreshDirectory, notify, user } = useApp();
  const { jobs, config, createJob, applyJob, refresh, openTasks } = useAiTasks();
  const [recordId, setRecordId] = useState(id);
  const recordRef = useRef(id);
  const [data, setData] = useState<Form>({ ...empty });
  const dataRef = useRef(data);
  const baseline = useRef<Mistake | null>(null);
  const [isTest, setIsTest] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<Lifecycle | null>(null);
  const pendingSave = useRef<Promise<Mistake> | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [tab, setTab] = useState<EditorTab>('question');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [applying, setApplying] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const processed = useRef(new Set<number>());
  const openedAt = useRef(Date.now());
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [localConflicts, setLocalConflicts] = useState<number[]>([]);
  const panelPrefix = useId();
  const questionField = useRef<MarkdownFieldHandle>(null);
  const answerField = useRef<MarkdownFieldHandle>(null);
  const analysisField = useRef<MarkdownFieldHandle>(null);
  const subjectField = useRef<HTMLSelectElement>(null);
  const questionPhotos = useRef<PhotoInputHandle>(null);
  const answerPhotos = useRef<PhotoInputHandle>(null);
  const currentJobs = jobs.filter((job) => job.mistakeId === recordId);
  const aiAvailable = Boolean(config?.enabled && config.configured);

  function update(patch: Partial<Form>) { dataRef.current = { ...dataRef.current, ...patch }; setData(dataRef.current); }
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const change = () => setMobile(media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => { if (!recordRef.current && subjects.length && !dataRef.current.subjectId) update({ subjectId: subjects[0].id }); }, [subjects]);
  useEffect(() => {
    if (!id) return;
    let active = true;
    api<Mistake>(`/mistakes/${id}`).then((item) => {
      if (!active) return;
      if (item.deletedAt) { setLoadError('这道错题在回收站中，请先恢复后再编辑。'); return; }
      baseline.current = item; setIsTest(item.isTest);
      update({ ...inputOf(item), note: item.note, rating: item.rating, lifecycle: item.lifecycle });
    }).catch((err) => { if (active) setLoadError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function persist(lifecycle: Lifecycle, generateAnalysis = false): Promise<Mistake> {
    if (pendingSave.current) await pendingSave.current;
    const snapshot = { ...dataRef.current, lifecycle };
    if (lifecycle === 'archived' && (!snapshot.question.trim() || !snapshot.subjectId)) throw new Error('归档前请填写题干并选择学科。');
    const body = Object.fromEntries(formKeys.filter((key) => !baseline.current || !same(snapshot[key], baseline.current[key])).map((key) => [key, snapshot[key]]));
    const promise = api<Mistake>(recordRef.current ? `/mistakes/${recordRef.current}` : '/mistakes', json({ ...body, generateAnalysis }, recordRef.current ? 'PATCH' : 'POST'));
    pendingSave.current = promise;
    setSaving(lifecycle);
    try {
      const item = await promise;
      baseline.current = item;
      if (!recordRef.current) {
        recordRef.current = item.id; setRecordId(item.id);
        window.history.replaceState(null, '', `#/mistakes/${item.id}/edit`);
      }
      const patch: Partial<Form> = { lifecycle: item.lifecycle };
      for (const key of formKeys) {
        if (same(dataRef.current[key], snapshot[key])) Object.assign(patch, { [key]: item[key] });
      }
      update(patch);
      return item;
    } finally { pendingSave.current = null; setSaving(null); }
  }
  const ensureSaved = () => persist(dataRef.current.lifecycle);
  async function save(lifecycle: Lifecycle) {
    if (saving || applying) return;
    if (lifecycle === 'archived' && (!data.question.trim() || !data.subjectId)) {
      const target = !data.question.trim() ? 'question' : 'classification';
      setTab(target); setSaveOpen(false); setError('归档前请填写题干并选择学科。'); notify('归档前请填写题干并选择学科。', 'error');
      requestAnimationFrame(() => target === 'question' ? questionField.current?.focus() : subjectField.current?.focus()); return;
    }
    setError('');
    try { const item = await persist(lifecycle, true); notify(lifecycle === 'draft' ? '草稿已保存。' : '错题已保存。'); void refresh(); navigate(`/mistakes/${item.id}`); }
    catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); }
  }
  async function recognize(purpose: ImagePurpose, imageIds: number[]) {
    try { const item = await ensureSaved(); await createJob({ mistakeId: item.id, type: purpose, imageIds, input: inputOf(item) }); setTab(purpose === 'question' ? 'question' : 'answers'); }
    catch (err) { setError((err as Error).message); throw err; }
  }
  async function generate() {
    setStarting(true);
    try { const item = await ensureSaved(); await createJob({ mistakeId: item.id, type: 'analysis', input: inputOf(item) }); }
    catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); } finally { setStarting(false); }
  }
  async function fill(job: AiJob, force = false, mode: 'replace' | 'append' = 'replace') {
    setApplying(job.id);
    try {
      if (force) await ensureSaved();
      const before = { ...dataRef.current };
      const result = await applyJob(job.id, { force, mode });
      const patch: Partial<Form> = {};
      const contextMatches = job.type !== 'analysis' || (same(dataRef.current.question, before.question) && same(dataRef.current.answer, before.answer));
      const unchanged = contextMatches && resultFields(job).every((field) => same(dataRef.current[field], before[field]));
      for (const field of resultFields(job)) {
        if (contextMatches && same(dataRef.current[field], before[field])) Object.assign(patch, { [field]: result.mistake[field] });
        if (baseline.current) Object.assign(baseline.current, { [field]: result.mistake[field] });
      }
      update(patch); setError('');
      if (typeof patch[job.type] === 'string') {
        ({ question: questionField, answer: answerField, analysis: analysisField })[job.type].current?.showPreview();
      }
      setLocalConflicts((items) => unchanged ? items.filter((value) => value !== job.id) : [...new Set([...items, job.id])]);
      await refreshDirectory();
    } catch (err) { setError((err as Error).message); }
    finally { setApplying(null); }
  }

  useEffect(() => {
    if (loading || loadError || applying || saving) return;
    for (const job of currentJobs) {
      if (job.status !== 'succeeded' || !job.result || processed.current.has(job.id)) continue;
      processed.current.add(job.id);
      if (job.type === 'analysis' && job.applyStatus === 'applied') {
        if (!job.finishedAt || Date.parse(job.finishedAt) < openedAt.current) continue;
        const matches = ['question', 'answer', 'analysis'].every((field) => same(dataRef.current[field as keyof AiInput], job.input[field as keyof AiInput]));
        if (matches) { update({ analysis: job.result.analysis || '' }); analysisField.current?.showPreview(); if (baseline.current) baseline.current.analysis = job.result.analysis || ''; }
        else if (dataRef.current.analysis !== job.result.analysis) setLocalConflicts((items) => [...items, job.id]);
      } else if (job.applyStatus === 'pending') {
        const latest = currentJobs.find((item) => item.type === job.type)?.id === job.id;
        if (latest && !job.input[job.type].trim() && resultFields(job).every((field) => same(dataRef.current[field], job.input[field as keyof AiInput]))) {
          void fill(job); break;
        }
      }
    }
  }, [jobs, recordId, loading, loadError, applying, saving]);

  const points = knowledgePoints.filter((point) => point.subjectId === data.subjectId);
  const tabs = (['question', 'answers', 'note', 'classification'] as const).map((name, index) => ({ id: name, label: ['题干', '解答', '笔记', '归类'][index], panelId: `${panelPrefix}-${name}` }));
  const panelProps = (name: EditorTab) => ({ id: `${panelPrefix}-${name}`, hidden: mobile && tab !== name, role: mobile ? 'tabpanel' : undefined, 'aria-labelledby': mobile ? `${panelPrefix}-${name}-tab` : undefined });
  function candidates(type: AiJob['type']) {
    return currentJobs.filter((job) => job.type === type && job.status === 'succeeded' && job.result && (job.applyStatus !== 'applied' || localConflicts.includes(job.id)) && !dismissed.includes(job.id)).map((job) => <section className="ai-result" key={job.id}>
      <h3>{AI_LABELS[type]}结果</h3><p className="ai-notice">{job.applyStatus === 'conflict' || localConflicts.includes(job.id) ? '你已修改内容，结果已保留供对照。' : '可以预览后填入；当前内容会保留到你作出选择。'}</p>
      <MarkdownContent>{job.result?.[type] || ''}</MarkdownContent>{job.result?.primaryPath?.length ? <p className="ai-notice">知识点：{job.result.primaryPath.join(' / ')}</p> : null}
      <div className="photo-actions"><button type="button" className="button primary" disabled={Boolean(applying) || Boolean(saving)} onClick={() => void fill(job, true)}>替换{type === 'question' ? '题干与归类' : type === 'answer' ? '答案' : '解析'}</button>{type === 'answer' && <button type="button" className="button secondary" disabled={Boolean(applying) || Boolean(saving)} onClick={() => void fill(job, true, 'append')}>追加到答案</button>}<button type="button" className="table-button" onClick={() => setDismissed((items) => [...items, job.id])}>暂不填入</button></div>
    </section>);
  }

  return <div className="editor-workbench">
    <a className="back-link" href={recordId ? `#/mistakes/${recordId}` : '#/mistakes'}><ArrowLeft size={16} />{recordId ? '返回错题详情' : '返回我的错题'}</a>
    <header className="editor-workbench-header"><div><h1>{id ? '编辑错题' : '录入错题'}</h1>{recordId && <span className="editor-record-id">记录 #{recordId}</span>}</div><div className="editor-workbench-state"><DataTypeBadge isTest={isTest} /><span className="editor-mode"><Pencil size={14} />正在编辑</span></div></header>
    <LoadingContent loading={loading} kind="editor">{loadError ? <ErrorState message={loadError} /> : <form onSubmit={(event) => { event.preventDefault(); void save('archived'); }}>
      {error && <div className="form-error editor-validation" role="alert">{error}</div>}
      <div className="editor-uploaded"><ImageHistory mistakeId={recordId} onRecrop={(image) => { setTab(image.purpose === 'question' ? 'question' : 'answers'); void (image.purpose === 'question' ? questionPhotos : answerPhotos).current?.reuse(image); }} onRecognize={recognize} />{currentJobs.length > 0 && <button type="button" className="table-button" onClick={openTasks}><Sparkles size={16} />{currentJobs.filter(isActiveJob).length ? `${currentJobs.filter(isActiveJob).length} 项 AI 操作正在进行` : '查看 AI 任务'}</button>}</div>
      {config && !aiAvailable && <p className="ai-notice">{user.role === 'admin' ? <a href="#/settings">AI 尚未启用，前往设置配置。图片可以先保存。</a> : 'AI 尚未启用，可先保存图片或手动填写。'}</p>}
      <div className="editor-mobile-tabs"><SlidingTabs tabs={tabs} value={tab} onChange={(value) => setTab(value as EditorTab)} ariaLabel="编辑内容" /></div>
      <div className="editor-layout"><div className="editor-main">
        <section className="editor-block editor-question-block" {...panelProps('question')}><div className="editor-block-heading"><FileText size={18} /><h2>题目</h2><span>必填</span></div>
          <PhotoInput ref={questionPhotos} purpose="question" ensureSaved={ensureSaved} onRecognize={(ids) => recognize('question', ids)} aiAvailable={aiAvailable} />{candidates('question')}
          <MarkdownField ref={questionField} name="题干" label={<>题干 <em>*</em></>} textareaClassName="question-editor" value={data.question} onChange={(question) => update({ question })} placeholder="输入题目内容，包括题目条件、问题和选项…" />
        </section>
        <section className="editor-block editor-answers-block" {...panelProps('answers')}><div className="editor-block-heading"><FileText size={18} /><h2>答案与分析</h2></div>
          <PhotoInput ref={answerPhotos} purpose="answer" ensureSaved={ensureSaved} onRecognize={(ids) => recognize('answer', ids)} aiAvailable={aiAvailable} />{candidates('answer')}
          <MarkdownField ref={answerField} name="正确答案" label={<>正确答案 <span className="optional-label">选填</span></>} rows={3} value={data.answer} onChange={(answer) => update({ answer })} placeholder="直接输入答案，或拍照识别后修改…" />
          <p className="ai-notice">手动输入的短答案会在保存时自动生成解析；图片识别的短答案会在填入后生成。</p>
          <div className="photo-actions"><button type="button" className="button secondary" disabled={!aiAvailable || !data.question.trim() || starting || currentJobs.some((job) => job.type === 'analysis' && isActiveJob(job))} onClick={() => void generate()}><Sparkles size={16} />{starting ? '正在提交…' : '生成解析'}</button></div>
          {candidates('analysis')}<MarkdownField ref={analysisField} name="解题分析" label={<>解题分析 <span className="optional-label">选填</span></>} rows={5} value={data.analysis} onChange={(analysis) => update({ analysis })} placeholder="记录关键步骤、解题思路和需要注意的地方…" />
        </section>
        <section className="editor-block editor-note-block" {...panelProps('note')}><div className="editor-block-heading"><StickyNote size={18} /><h2>我的笔记</h2></div><MarkdownField name="我的笔记" label={<>我的笔记 <span className="optional-label">选填</span></>} rows={5} value={data.note} onChange={(note) => update({ note })} placeholder="为什么会做错？下次遇到类似题目，要提醒自己什么？" /></section>
      </div><aside className="editor-aside editor-classification editor-block" {...panelProps('classification')}>
        <div className="editor-block-heading"><Layers size={18} /><h2>学科与知识点</h2></div>
        <label className="field"><span>学科 <em>*</em></span><select ref={subjectField} value={data.subjectId || ''} onChange={(event) => update({ subjectId: event.target.value, primaryKnowledgePointId: null, auxiliaryKnowledgePointIds: [] })}><option value="" disabled>选择学科</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
        <label className="field"><span>主知识点 <span className="optional-label">选填</span></span><select value={data.primaryKnowledgePointId || ''} onChange={(event) => { const primaryKnowledgePointId = event.target.value ? Number(event.target.value) : null; update({ primaryKnowledgePointId, auxiliaryKnowledgePointIds: data.auxiliaryKnowledgePointIds.filter((pointId) => pointId !== primaryKnowledgePointId) }); }}><option value="">暂不标注</option>{points.map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}{point.ownerUserId ? '（个人）' : ''}</option>)}</select></label>
        <div className="field"><span>辅助知识点 <span className="optional-label">可多选</span></span><ScrollArea className="knowledge-options" tabIndex={0} role="region" aria-label="辅助知识点">{points.filter((point) => point.id !== data.primaryKnowledgePointId).map((point) => <label className={`knowledge-option ${data.auxiliaryKnowledgePointIds.includes(point.id) ? 'selected' : ''}`} key={point.id}><Checkbox checked={data.auxiliaryKnowledgePointIds.includes(point.id)} onChange={(event) => update({ auxiliaryKnowledgePointIds: event.target.checked ? [...data.auxiliaryKnowledgePointIds, point.id] : data.auxiliaryKnowledgePointIds.filter((value) => value !== point.id) })} />{knowledgeLabel(knowledgePoints, point.id)}</label>)}{!points.length && <p className="muted text-muted">该学科暂未配置知识点，可先录入题目。</p>}</ScrollArea></div>
        <div className="field"><span>星级标记 <span className="optional-label">选填</span></span><StarRatingPicker value={data.rating} onChange={(rating) => update({ rating })} disabled={Boolean(saving)} /></div>
      </aside></div>
      <SaveDock open={saveOpen} onOpenChange={setSaveOpen} saving={saving} archived={data.lifecycle === 'archived'} onSave={(lifecycle) => void save(lifecycle)} />
    </form>}</LoadingContent>
  </div>;
}

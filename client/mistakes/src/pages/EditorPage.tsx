import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, Copy, FileText, Layers, Pencil, Sparkles, StickyNote } from 'lucide-react';
import { api, ApiError, json, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { Checkbox, DataTypeBadge, ErrorState } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { MarkdownField, type MarkdownFieldHandle } from '../MarkdownField';
import { SaveDock } from '../SaveDock';
import { ScrollArea } from '../ScrollArea';
import { StarRatingPicker } from '../StarRating';
import { PhotoInput } from '../PhotoInput';
import { ImageHistory } from '../ImageHistory';
import { usePhotoUploads } from '../PhotoUploads';
import { AiReview } from '../AiReview';
import { isActiveJob, useAiTasks } from '../AiTasks';
import { clearEditorDraft, editorChanges, editorForm, editorSavePayload, emptyEditorForm as empty, hasEditorChanges, readEditorDraft, reconcileEditorSave, restoreEditorDraft, sameEditorValue as same, writeEditorDraft, type EditorForm as Form } from '../editor-draft';
import type { AiApplyOptions, AiInput, AiJob, ImagePurpose } from '../ai-types';
import type { Lifecycle, Mistake } from '../types';

type EditorTab = 'question' | 'answers' | 'note' | 'classification';
const inputOf = (value: Form | Mistake): AiInput => ({ question: value.question, answer: value.answer, analysis: value.analysis, subjectId: value.subjectId, primaryKnowledgePointId: value.primaryKnowledgePointId, auxiliaryKnowledgePointIds: value.auxiliaryKnowledgePointIds });
const resultFields = (job: AiJob): (keyof Form)[] => job.type === 'question' ? ['question', ...(job.mode === 'page-entry' ? ['answer' as const] : []), 'subjectId', 'primaryKnowledgePointId', 'auxiliaryKnowledgePointIds'] : [job.type];

export function EditorPage({ id, onCreated }: { id?: number; onCreated?: (id: number) => void }) {
  const { subjects, knowledgePoints, refreshDirectory, notify, user } = useApp();
  const { jobs, config, createJob, applyJob, refresh, openTasks } = useAiTasks();
  const { queue: photoQueue, batches: photoBatches } = usePhotoUploads();
  const [restored] = useState(() => { try { return readEditorDraft(window.localStorage, user.id, id); } catch { return null; } });
  const restoredNotice = restored ? `已恢复本机草稿（${new Date(restored.updatedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}，仅此账号）。` : '';
  const clientId = useRef(restored?.clientId || crypto.randomUUID());
  const creationInput = useRef(restored?.creationInput);
  const draftReady = useRef(!id);
  const draftStored = useRef(true);
  const mounted = useRef(true);
  const leaving = useRef(false);
  const [recordId, setRecordId] = useState(id);
  const recordRef = useRef(id);
  const [data, setData] = useState<Form>(() => !id && restored ? editorForm(restored.data) : { ...empty });
  const dataRef = useRef(data);
  const baseline = useRef<Mistake | null>(null);
  const [isTest, setIsTest] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [draftNotice, setDraftNotice] = useState(!id ? restoredNotice : '');
  const [draftError, setDraftError] = useState('');
  const [saveConflict, setSaveConflict] = useState(false);
  const [resolvingConflict, setResolvingConflict] = useState(false);
  const pendingPhotos = useRef({ question: false, answer: false });
  const [analysisNotice, setAnalysisNotice] = useState('');
  const [saving, setSaving] = useState<Lifecycle | null>(null);
  const pendingSave = useRef<Promise<Mistake> | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [tab, setTab] = useState<EditorTab>('question');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [applying, setApplying] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const [reusingQuestionPhotos, setReusingQuestionPhotos] = useState(false);
  const [recognitionPrompts, setRecognitionPrompts] = useState({ question: '', answer: '' });
  const processed = useRef(new Set<number>());
  const openedAt = useRef(Date.now());
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [localConflicts, setLocalConflicts] = useState<number[]>([]);
  const [actionQuery, setActionQuery] = useState(window.location.hash.split('?')[1] || '');
  const panelPrefix = useId();
  const questionField = useRef<MarkdownFieldHandle>(null);
  const answerField = useRef<MarkdownFieldHandle>(null);
  const analysisField = useRef<MarkdownFieldHandle>(null);
  const subjectField = useRef<HTMLSelectElement>(null);
  const currentJobs = jobs.filter((job) => job.mistakeId === recordId);
  const actionParams = new URLSearchParams(actionQuery);
  const requestedJob = currentJobs.find((job) => job.id === Number(actionParams.get('aiJob')));
  const requestedPhoto = actionParams.get('photo');
  const questionBatch = photoBatches.find((batch) => batch.mistakeId === recordId && batch.purpose === 'question');
  const questionImageIds = questionBatch?.imageIds ?? currentJobs.find((job) => job.type === 'question')?.imageIds ?? [];
  const questionPhotoCount = questionBatch?.total ?? questionImageIds.length;
  const reuseQueued = questionBatch?.reuseStatus === 'waiting' || questionBatch?.reuseStatus === 'submitting';
  const aiAvailable = Boolean(config?.enabled && config.configured);
  const analysisAvailable = Boolean(config?.analysis?.enabled && config.analysis.configured);

  function syncDraft() {
    if (!draftReady.current) return;
    try {
      writeEditorDraft(window.localStorage, user.id, recordRef.current, { version: 1, clientId: clientId.current, data: editorForm(dataRef.current), baseline: baseline.current ? editorForm(baseline.current) : null, creationInput: creationInput.current, updatedAt: Date.now() });
      draftStored.current = true;
      setDraftError('');
    } catch { draftStored.current = false; setDraftError('浏览器未能保存本机草稿，请先保存到错题本再离开。'); }
  }
  function update(patch: Partial<Form>) { dataRef.current = { ...dataRef.current, ...patch }; setData(dataRef.current); syncDraft(); }
  useEffect(() => { syncDraft(); }, [data, recordId]);
  useEffect(() => {
    mounted.current = true;
    function confirmLeave() {
      const photos = pendingPhotos.current.question || pendingPhotos.current.answer;
      if (photos && !window.confirm('还有未上传或正在准备的图片，离开后需要重新选择。确定离开？')) return false;
      if (!draftStored.current && hasEditorChanges(dataRef.current, baseline.current) && !window.confirm('本机草稿保存失败，离开会丢失未提交的文字。确定离开？')) return false;
      return true;
    }
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (pendingPhotos.current.question || pendingPhotos.current.answer || hasEditorChanges(dataRef.current, baseline.current)) {
        event.preventDefault(); event.returnValue = '';
      }
    };
    const beforeNavigate = (event: Event) => {
      const target = (event as CustomEvent<{ path: string }>).detail.path.split('?')[0];
      const ownRoute = recordRef.current ? `/mistakes/${recordRef.current}/edit` : '/new';
      if (target !== ownRoute && !confirmLeave()) event.preventDefault();
    };
    const beforeLogout = (event: Event) => { if (!confirmLeave()) event.preventDefault(); };
    const sessionEnding = () => { leaving.current = true; };
    const sessionResumed = () => { leaving.current = false; };
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('mistakes:before-navigate', beforeNavigate);
    window.addEventListener('mistakes:before-logout', beforeLogout);
    window.addEventListener('mistakes:session-ending', sessionEnding);
    window.addEventListener('mistakes:session-resumed', sessionResumed);
    return () => {
      mounted.current = false;
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('mistakes:before-navigate', beforeNavigate);
      window.removeEventListener('mistakes:before-logout', beforeLogout);
      window.removeEventListener('mistakes:session-ending', sessionEnding);
      window.removeEventListener('mistakes:session-resumed', sessionResumed);
    };
  }, []);
  useEffect(() => {
    const route = () => {
      const query = window.location.hash.split('?')[1] || '';
      const params = new URLSearchParams(query);
      const jobId = Number(params.get('aiJob'));
      setActionQuery(query);
      setDismissed((items) => items.includes(jobId) ? items.filter((id) => id !== jobId) : items);
      const job = currentJobs.find((item) => item.id === jobId);
      if (job) setTab(job.type === 'question' ? 'question' : 'answers');
      else if (params.get('photo')) setTab(params.get('photo') === 'answer' ? 'answers' : 'question');
    };
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, [jobs, recordId]);
  useEffect(() => {
    if (loading) return;
    if (requestedJob) {
      setTab(requestedJob.type === 'question' ? 'question' : 'answers');
      setDismissed((items) => items.includes(requestedJob.id) ? items.filter((id) => id !== requestedJob.id) : items);
    } else if (requestedPhoto === 'question' || requestedPhoto === 'answer') setTab(requestedPhoto === 'question' ? 'question' : 'answers');
  }, [loading, requestedJob?.id, requestedPhoto]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const change = () => setMobile(media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => { if (!recordRef.current && subjects.length && !dataRef.current.subjectId) update({ subjectId: subjects[0].id }); }, [subjects]);
  useEffect(() => {
    if (!id || baseline.current?.id === id) return;
    let active = true;
    api<Mistake>(`/mistakes/${id}`).then((item) => {
      if (!active) return;
      if (item.deletedAt) { setLoadError('这道错题在回收站中，请先恢复后再编辑。'); return; }
      const recovered = restored ? restoreEditorDraft(restored, item) : { data: editorForm(item), baseline: editorForm(item) };
      baseline.current = { ...item, ...recovered.baseline }; draftReady.current = true;
      setIsTest(item.isTest); setAnalysisNotice(item.analysisNotice || '');
      if (restored) setDraftNotice(`${restoredNotice}保存时会检查其他页面的修改。`);
      update(recovered.data);
    }).catch((err) => { if (active) setLoadError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function persist(lifecycle: Lifecycle, generateAnalysis = false): Promise<Mistake> {
    if (pendingSave.current) await pendingSave.current;
    if (!mounted.current || leaving.current) throw new Error('编辑已结束，当前操作已取消。');
    const snapshot = { ...dataRef.current, lifecycle };
    if (lifecycle === 'archived' && (!snapshot.question.trim() || !snapshot.subjectId)) throw new Error('归档前请填写题干并选择学科。');
    update({ lifecycle });
    const body = editorSavePayload(snapshot, baseline.current, clientId.current);
    const submitted = recordRef.current ? snapshot : (creationInput.current ||= editorForm(snapshot));
    syncDraft();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const promise = api<Mistake>(recordRef.current ? `/mistakes/${recordRef.current}` : '/mistakes', {
      ...json({ ...body, generateAnalysis }, recordRef.current ? 'PATCH' : 'POST'), signal: controller.signal,
    }).catch((err) => {
      if (controller.signal.aborted) throw new Error('保存超时，请检查网络后重试，当前内容和已选图片会保留。');
      if (err instanceof ApiError && err.status === 409) setSaveConflict(true);
      throw err;
    });
    pendingSave.current = promise;
    setSaving(lifecycle);
    try {
      const item = await promise;
      setSaveConflict(false);
      baseline.current = item;
      setAnalysisNotice(item.analysisNotice || '');
      if (!recordRef.current) {
        recordRef.current = item.id; setRecordId(item.id);
        try { clearEditorDraft(window.localStorage, user.id, undefined, clientId.current); } catch { /* The record draft is written below even if local storage is unavailable. */ }
        if (mounted.current && !leaving.current) {
          window.history.replaceState(null, '', `#/mistakes/${item.id}/edit`);
          onCreated?.(item.id);
        }
      }
      update(reconcileEditorSave(dataRef.current, submitted, item));
      return item;
    } finally { clearTimeout(timeout); pendingSave.current = null; setSaving(null); }
  }
  const ensureSaved = () => persist(dataRef.current.lifecycle);
  async function resolveSaveConflict(keepLocal: boolean) {
    if (!recordRef.current || resolvingConflict || saving) return;
    setResolvingConflict(true);
    const before = editorForm(dataRef.current);
    try {
      const item = await api<Mistake>(`/mistakes/${recordRef.current}`);
      if (!mounted.current || leaving.current) return;
      if (item.deletedAt) throw new Error('这道错题已移入回收站，请先恢复。当前未提交内容仍保留在本机。');
      const next = keepLocal ? editorForm(item) : reconcileEditorSave(dataRef.current, before, item);
      if (keepLocal) {
        for (const key of editorChanges(dataRef.current, baseline.current)) Object.assign(next, { [key]: dataRef.current[key] });
      }
      baseline.current = item;
      update(next); setSaveConflict(false); setError(''); setAnalysisNotice(item.analysisNotice || '');
      setDraftNotice(hasEditorChanges(next, item) ? '已载入最新版本并保留你的修改，请再次保存；这会更新相应字段。' : '已载入服务器最新内容。');
    } catch (err) { setError((err as Error).message); }
    finally { setResolvingConflict(false); }
  }
  async function save(lifecycle: Lifecycle) {
    if (saving || applying || resolvingConflict) return;
    if (lifecycle === 'archived' && (!data.question.trim() || !data.subjectId)) {
      const target = !data.question.trim() ? 'question' : 'classification';
      setTab(target); setSaveOpen(false); setError('归档前请填写题干并选择学科。'); notify('归档前请填写题干并选择学科。', 'error');
      requestAnimationFrame(() => target === 'question' ? questionField.current?.focus() : subjectField.current?.focus()); return;
    }
    setError('');
    try {
      const item = await persist(lifecycle, true);
      if (!mounted.current || leaving.current) return;
      void refresh();
      if (hasEditorChanges(dataRef.current, baseline.current) || pendingPhotos.current.question || pendingPhotos.current.answer) {
        const message = hasEditorChanges(dataRef.current, baseline.current) ? '已保存本次提交的内容，仍有较新的修改未提交，请再次保存。' : '文字已保存，还有图片未上传，请处理后再离开。';
        setDraftNotice(message); notify(message); return;
      }
      setDraftNotice(''); notify(lifecycle === 'draft' ? '草稿已保存。' : '错题已保存。'); navigate(`/mistakes/${item.id}`);
    }
    catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); }
  }
  async function recognize(purpose: ImagePurpose, imageIds: number[], recognitionPrompt = recognitionPrompts[purpose]) {
    try { const item = await ensureSaved(); await createJob({ mistakeId: item.id, type: purpose, imageIds, input: inputOf(item), recognitionPrompt: recognitionPrompt.trim() }); setTab(purpose === 'question' ? 'question' : 'answers'); }
    catch (err) { setError((err as Error).message); throw err; }
  }
  async function reuseQuestionPhotos() {
    if (questionBatch) {
      if (photoQueue.reuse(questionBatch.id, inputOf(dataRef.current), recognitionPrompts.answer)) notify('已记录复用请求，图片上传完成后会自动识别答案。');
      return;
    }
    setReusingQuestionPhotos(true);
    try { await recognize('answer', questionImageIds); }
    catch (err) { notify((err as Error).message, 'error'); }
    finally { setReusingQuestionPhotos(false); }
  }
  async function generate() {
    setStarting(true);
    try { const item = await ensureSaved(); await createJob({ mistakeId: item.id, type: 'analysis', input: inputOf(item) }); }
    catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); } finally { setStarting(false); }
  }
  async function fill(job: AiJob, force = false, mode: 'replace' | 'append' = 'replace', reviewed?: AiApplyOptions) {
    setApplying(job.id);
    try {
      if (force || reviewed) await ensureSaved();
      const before = { ...dataRef.current };
      const result = await applyJob(job.id, reviewed || { force, mode });
      setAnalysisNotice(result.mistake.analysisNotice || '');
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
      if (job.mode === 'page-entry' && typeof patch.answer === 'string') answerField.current?.showPreview();
      setLocalConflicts((items) => unchanged ? items.filter((value) => value !== job.id) : [...new Set([...items, job.id])]);
      await refreshDirectory();
    } catch (err) { setError((err as Error).message); if (reviewed) throw err; }
    finally { setApplying(null); }
  }

  useEffect(() => {
    if (loading || loadError || applying || saving) return;
    for (const job of currentJobs) {
      if (job.status !== 'succeeded' || !job.result || processed.current.has(job.id)) continue;
      processed.current.add(job.id);
      if (job.applyStatus === 'applied') {
        if (!job.finishedAt || Date.parse(job.finishedAt) < openedAt.current) continue;
        const fields = resultFields(job);
        const matches = (job.type === 'analysis' ? ['question', 'answer', 'analysis'] : fields).every((field) => same(dataRef.current[field as keyof AiInput], job.input[field as keyof AiInput]));
        if (matches) {
          if (job.type === 'question') {
            void api<Mistake>(`/mistakes/${job.mistakeId}`).then((item) => {
              if (!fields.every((field) => same(dataRef.current[field], job.input[field as keyof AiInput]))) { setLocalConflicts((items) => [...items, job.id]); return; }
              const patch = Object.fromEntries(fields.map((field) => [field, item[field]])); update(patch); if (baseline.current) Object.assign(baseline.current, patch); questionField.current?.showPreview(); if (job.mode === 'page-entry') answerField.current?.showPreview(); setAnalysisNotice(item.analysisNotice || ''); void refreshDirectory();
            });
          } else { update({ [job.type]: job.result[job.type] || '' }); ({ answer: answerField, analysis: analysisField })[job.type].current?.showPreview(); if (baseline.current) baseline.current[job.type] = job.result[job.type] || ''; }
        }
        else if ([job.type, ...(job.mode === 'page-entry' ? ['answer' as const] : [])].some((field) => !same(dataRef.current[field], job.result?.[field]))) setLocalConflicts((items) => [...items, job.id]);
      } else if (job.applyStatus === 'pending' && !job.result.needsReview && !job.result.figures?.length && !job.result.diagramImageIds?.length && !job.result.issues?.length && !/待确认|待补充|\[\[figure:/.test(job.result[job.type] || '')) {
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
    if (loading || loadError) return null;
    return currentJobs.filter((job) => job.type === type && job.status === 'succeeded' && job.result && (job.applyStatus !== 'applied' || localConflicts.includes(job.id)) && !dismissed.includes(job.id)).map((job) => <AiReview key={job.id} job={job} input={inputOf(data)} busy={Boolean(applying) || Boolean(saving)} onApply={(options) => fill(job, Boolean(options.force), options.mode || 'replace', options)} onDismiss={() => setDismissed((items) => [...items, job.id])} />);
  }

  return <div className="editor-workbench">
    <nav className="editor-navigation" aria-label="录题导航"><a className="back-link" href={recordId ? `#/mistakes/${recordId}` : '#/mistakes'}><ArrowLeft size={16} />{recordId ? '返回错题详情' : '返回我的错题'}</a>{!recordId && <a className="table-button editor-batch-entry" href="#/page-imports"><Layers size={15} />按页批量录入</a>}</nav>
    <header className="editor-workbench-header"><div><h1>{id ? '编辑错题' : '录入错题'}</h1>{recordId && <span className="editor-record-id">记录 #{recordId}</span>}</div><div className="editor-workbench-state"><DataTypeBadge isTest={isTest} /><span className="editor-mode"><Pencil size={14} />正在编辑</span></div></header>
    <LoadingContent loading={loading} kind="editor">{loadError ? <ErrorState message={loadError} /> : <form onSubmit={(event) => { event.preventDefault(); void save('archived'); }}>
      {error && <div className="form-error editor-validation" role="alert">{error}</div>}
      {saveConflict && <div className="ai-review-issues" role="alert"><p>其他页面已修改这道题。你的未提交内容仍保留在本机，请选择后再保存。</p><div className="photo-actions"><button type="button" className="button secondary" disabled={resolvingConflict || Boolean(saving)} onClick={() => void resolveSaveConflict(true)}>保留我的修改，准备重新保存</button><button type="button" className="button ghost" disabled={resolvingConflict || Boolean(saving)} onClick={() => void resolveSaveConflict(false)}>放弃本机修改，载入服务器内容</button></div></div>}
      {draftNotice && <p className="ai-notice" role="status">{draftNotice}</p>}
      {draftError && <p className="form-error" role="alert">{draftError}</p>}
      {(recordId || currentJobs.length > 0) && <div className="editor-uploaded">{recordId && <ImageHistory mistakeId={recordId} onRecognize={aiAvailable ? recognize : undefined} />}{currentJobs.length > 0 && <button type="button" className="table-button" onClick={openTasks}><Sparkles size={16} />{currentJobs.filter(isActiveJob).length ? `${currentJobs.filter(isActiveJob).length} 项 AI 操作正在进行` : '查看 AI 任务'}</button>}</div>}
      {config && !aiAvailable && <p className="ai-notice">{user.role === 'admin' ? <a href="#/settings">AI 尚未启用，前往设置配置。图片可以先保存。</a> : 'AI 尚未启用，可先保存图片或手动填写。'}</p>}
      <div className="editor-mobile-tabs"><SlidingTabs tabs={tabs} value={tab} onChange={(value) => setTab(value as EditorTab)} ariaLabel="编辑内容" /></div>
      <div className="editor-layout"><div className="editor-main">
        <section className="editor-block editor-question-block" {...panelProps('question')}><div className="editor-block-heading"><FileText size={18} /><h2>题目</h2><span>必填</span></div>
          <PhotoInput purpose="question" recordId={recordId} ensureSaved={ensureSaved} aiAvailable={aiAvailable} onPendingChange={(value) => { pendingPhotos.current.question = value; }} recognitionPrompt={recognitionPrompts.question} onRecognitionPromptChange={(question) => setRecognitionPrompts((current) => ({ ...current, question }))} />{candidates('question')}
          <MarkdownField ref={questionField} name="题干" label={<>题干 <em>*</em></>} textareaClassName="question-editor" value={data.question} onChange={(question) => update({ question })} placeholder="输入题目内容，包括题目条件、问题和选项…" />
        </section>
        <section className="editor-block editor-answers-block" {...panelProps('answers')}><div className="editor-block-heading"><FileText size={18} /><h2>答案与分析</h2></div>
          <PhotoInput purpose="answer" recordId={recordId} ensureSaved={ensureSaved} aiAvailable={aiAvailable} onPendingChange={(value) => { pendingPhotos.current.answer = value; }} recognitionPrompt={recognitionPrompts.answer} onRecognitionPromptChange={(answer) => setRecognitionPrompts((current) => ({ ...current, answer }))} actions={<button type="button" className="button secondary" disabled={!questionPhotoCount || !aiAvailable || reusingQuestionPhotos || Boolean(questionBatch?.reuseRequested) || (!questionBatch && (Boolean(saving) || Boolean(applying) || currentJobs.some((job) => job.type === 'answer' && isActiveJob(job))))} title={questionPhotoCount ? '按原顺序复用题干图片；上传中会先记录请求，完成后自动识别答案' : '先在题干中添加并提交图片'} onClick={() => void reuseQuestionPhotos()}><Copy size={16} />{reuseQueued ? '已记录，后台处理中…' : questionBatch?.reuseStatus === 'failed' ? '复用待重试' : questionBatch?.reuseRequested ? '已提交答案识别' : reusingQuestionPhotos ? '正在提交…' : `复用题干图片${questionPhotoCount ? `（${questionPhotoCount} 张）` : ''}`}</button>} />{candidates('answer')}
          {reuseQueued && <p className="ai-notice" role="status">复用请求已记录，将在题干图片全部上传后自动识别答案。</p>}
          <MarkdownField ref={answerField} name="正确答案" label={<>正确答案 <span className="optional-label">选填</span></>} rows={3} value={data.answer} onChange={(answer) => update({ answer })} placeholder="直接输入答案，或拍照识别后修改…" />
          <p className="ai-notice">{analysisAvailable ? '手动输入的短答案会在保存时自动生成解析；图片识别的短答案会在填入后生成。' : user.role === 'admin' ? <a href="#/settings">生成解析服务尚未启用，前往设置独立配置。</a> : '生成解析服务尚未启用，题干和答案可以正常保存。'}</p>
          {analysisNotice && <p className="ai-review-issues" role="status">{analysisNotice}</p>}
          <div className="photo-actions"><button type="button" className="button secondary" disabled={!analysisAvailable || !data.question.trim() || starting || currentJobs.some((job) => job.type === 'analysis' && isActiveJob(job))} onClick={() => void generate()}><Sparkles size={16} />{starting ? '正在提交…' : '生成解析'}</button></div>
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

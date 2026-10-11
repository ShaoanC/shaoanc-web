import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, FileText, Layers, Pencil, StickyNote } from 'lucide-react';
import { api, json, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { Checkbox, DataTypeBadge, ErrorState } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { MarkdownField, type MarkdownFieldHandle } from '../MarkdownField';
import { SaveDock } from '../SaveDock';
import { ScrollArea } from '../ScrollArea';
import { StarRatingPicker } from '../StarRating';
import type { Lifecycle, Mistake } from '../types';

type EditorTab = 'question' | 'answers' | 'note' | 'classification';

export function EditorPage({ id }: { id?: number }) {
  const { subjects, knowledgePoints, notify } = useApp();
  const [isTest, setIsTest] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [primaryId, setPrimaryId] = useState('');
  const [auxiliaryIds, setAuxiliaryIds] = useState<number[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [originalLifecycle, setOriginalLifecycle] = useState<Lifecycle>('draft');
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<Lifecycle | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [tab, setTab] = useState<EditorTab>('question');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const panelPrefix = useId();
  const questionGroup = useRef<HTMLElement>(null);
  const classificationGroup = useRef<HTMLElement>(null);
  const questionField = useRef<MarkdownFieldHandle>(null);
  const subjectField = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!id && subjects.length && !subjectId) setSubjectId(subjects[0].id);
  }, [id, subjects, subjectId]);

  useEffect(() => {
    if (!id) return;
    api<Mistake>(`/mistakes/${id}`).then((item) => {
      if (item.deletedAt) {
        setLoadError('这道错题在回收站中，请先恢复后再编辑。');
        return;
      }
      setIsTest(item.isTest);
      setSubjectId(item.subjectId || '');
      setPrimaryId(item.primaryKnowledgePointId ? String(item.primaryKnowledgePointId) : '');
      setAuxiliaryIds(item.auxiliaryKnowledgePointIds);
      setQuestion(item.question);
      setAnswer(item.answer);
      setAnalysis(item.analysis);
      setNote(item.note);
      setRating(item.rating);
      setOriginalLifecycle(item.lifecycle);
    }).catch((err) => setLoadError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const points = knowledgePoints.filter((point) => point.subjectId === subjectId);
  const tabs = [
    { id: 'question', label: '题干', panelId: `${panelPrefix}-question` },
    { id: 'answers', label: '解答', panelId: `${panelPrefix}-answers` },
    { id: 'note', label: '笔记', panelId: `${panelPrefix}-note` },
    { id: 'classification', label: '归类', panelId: `${panelPrefix}-classification` },
  ];

  function panelProps(name: EditorTab) {
    return {
      id: `${panelPrefix}-${name}`,
      hidden: mobile && tab !== name,
      role: mobile ? 'tabpanel' : undefined,
      'aria-labelledby': mobile ? `${panelPrefix}-${name}-tab` : undefined,
    };
  }

  function showValidation(message: string, target: 'question' | 'classification') {
    setError(message);
    setTab(target);
    setSaveOpen(false);
    requestAnimationFrame(() => {
      const group = target === 'question' ? questionGroup.current : classificationGroup.current;
      group?.scrollIntoView({ block: 'center' });
      if (target === 'question') questionField.current?.focus();
      else subjectField.current?.focus({ preventScroll: true });
    });
  }

  async function save(lifecycle: Lifecycle) {
    if (saving) return;
    if (lifecycle === 'archived' && !subjectId) { showValidation('归档前，请先选择学科。', 'classification'); return; }
    if (lifecycle === 'archived' && !question.trim()) { showValidation('填写题干后，就可以归档了。', 'question'); return; }
    setError('');
    setSaveOpen(true);
    setSaving(lifecycle);
    try {
      const item = await api<Mistake>(id ? `/mistakes/${id}` : '/mistakes', json({ subjectId: subjectId || null, primaryKnowledgePointId: primaryId ? Number(primaryId) : null, auxiliaryKnowledgePointIds: auxiliaryIds.filter((pointId) => pointId !== Number(primaryId)), question: question.trim(), answer: answer.trim(), analysis: analysis.trim(), note: note.trim(), rating, lifecycle }, id ? 'PATCH' : 'POST'));
      notify(lifecycle === 'draft' ? '草稿已保存，可以稍后继续完善。' : id ? '错题已更新。' : '错题已归档，可以开始复习。');
      navigate(`/mistakes/${item.id}`);
    } catch (err) {
      setError((err as Error).message);
      notify((err as Error).message, 'error');
    } finally { setSaving(null); }
  }

  return <div className="editor-workbench">
    <a className="back-link" href={id ? `#/mistakes/${id}` : '#/mistakes'}><ArrowLeft size={16} /> {id ? '返回错题详情' : '返回我的错题'}</a>
    <header className="editor-workbench-header">
      <div><h1>{id ? '编辑错题' : '录入错题'}</h1>{id && <span className="editor-record-id">记录 #{id}</span>}</div>
      <div className="editor-workbench-state"><DataTypeBadge isTest={isTest} /><span className="editor-mode"><Pencil size={14} /> 正在编辑</span></div>
    </header>
    <LoadingContent loading={loading} kind="editor">
      {loadError ? <ErrorState message={loadError} /> : <form onSubmit={(event) => { event.preventDefault(); void save('archived'); }}>
        {error && <div className="form-error editor-validation" role="alert">{error}</div>}
        <div className="editor-mobile-tabs"><SlidingTabs tabs={tabs} value={tab} onChange={(value) => setTab(value as EditorTab)} ariaLabel="编辑内容" /></div>
        <div className="editor-layout">
          <div className="editor-main">
            <section ref={questionGroup} className="editor-block editor-question-block" {...panelProps('question')}>
              <div className="editor-block-heading"><FileText size={18} /><h2>题目</h2><span>必填</span></div>
              <MarkdownField ref={questionField} name="题干" label={<>题干 <em>*</em></>} textareaClassName="question-editor" value={question} onChange={setQuestion} placeholder="输入题目内容，包括题目条件、问题和选项…" />
            </section>
            <section className="editor-block editor-answers-block" {...panelProps('answers')}>
              <div className="editor-block-heading"><FileText size={18} /><h2>答案与分析</h2></div>
              <MarkdownField name="正确答案" label={<>正确答案 <span className="optional-label">选填</span></>} rows={3} value={answer} onChange={setAnswer} placeholder="写下正确答案或最终结果…" />
              <MarkdownField name="解题分析" label={<>解题分析 <span className="optional-label">选填</span></>} rows={5} value={analysis} onChange={setAnalysis} placeholder="记录关键步骤、解题思路和需要注意的地方…" />
            </section>
            <section className="editor-block editor-note-block" {...panelProps('note')}>
              <div className="editor-block-heading"><StickyNote size={18} /><h2>我的笔记</h2></div>
              <MarkdownField name="我的笔记" label={<>我的笔记 <span className="optional-label">选填</span></>} rows={5} value={note} onChange={setNote} placeholder="为什么会做错？下次遇到类似题目，要提醒自己什么？" />
            </section>
          </div>
          <aside ref={classificationGroup} className="editor-aside editor-classification editor-block" {...panelProps('classification')}>
            <div className="editor-block-heading"><Layers size={18} /><h2>学科与知识点</h2></div>
            <label className="field"><span>学科 <em>*</em></span><select ref={subjectField} value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setPrimaryId(''); setAuxiliaryIds([]); }}><option value="" disabled>选择学科</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
            <label className="field"><span>主知识点 <span className="optional-label">选填</span></span><select value={primaryId} onChange={(event) => { setPrimaryId(event.target.value); setAuxiliaryIds((current) => current.filter((pointId) => pointId !== Number(primaryId))); }}><option value="">暂不标注</option>{points.map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select></label>
            <div className="field"><span>辅助知识点 <span className="optional-label">可多选</span></span><ScrollArea className="knowledge-options" tabIndex={0} role="region" aria-label="辅助知识点">{points.filter((point) => point.id !== Number(primaryId)).map((point) => <label className={`knowledge-option ${auxiliaryIds.includes(point.id) ? 'selected' : ''}`} key={point.id}><Checkbox checked={auxiliaryIds.includes(point.id)} onChange={(event) => setAuxiliaryIds((current) => event.target.checked ? [...current, point.id] : current.filter((pointId) => pointId !== point.id))} />{knowledgeLabel(knowledgePoints, point.id)}</label>)}{!points.length && <p className="muted text-muted">该学科暂未配置知识点，可先录入题目。</p>}</ScrollArea></div>
            <div className="field"><span>星级标记 <span className="optional-label">选填</span></span><StarRatingPicker value={rating} onChange={setRating} disabled={Boolean(saving)} /></div>
          </aside>
        </div>
        <SaveDock open={saveOpen} onOpenChange={setSaveOpen} saving={saving} archived={originalLifecycle === 'archived'} onSave={(lifecycle) => void save(lifecycle)} />
      </form>}
    </LoadingContent>
  </div>;
}


import { useEffect, useState } from 'react';
import { ArrowLeft, Check, FileText, Layers, LoaderCircle, Save, StickyNote } from 'lucide-react';
import { api, json, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { Checkbox, DataTypeBadge, ErrorState, PageHeader } from '../components';
import { LoadingContent } from '../motion';
import { MarkdownField } from '../MarkdownField';
import { ScrollArea } from '../ScrollArea';
import type { Lifecycle, Mistake } from '../types';

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
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<Lifecycle | null>(null);

  useEffect(() => {
    if (!id && subjects.length && !subjectId) setSubjectId(subjects[0].id);
  }, [id, subjects, subjectId]);

  useEffect(() => {
    if (!id) return;
    api<Mistake>(`/mistakes/${id}`).then((item) => {
      setIsTest(item.isTest);
      setSubjectId(item.subjectId || '');
      setPrimaryId(item.primaryKnowledgePointId ? String(item.primaryKnowledgePointId) : '');
      setAuxiliaryIds(item.auxiliaryKnowledgePointIds);
      setQuestion(item.question);
      setAnswer(item.answer);
      setAnalysis(item.analysis);
      setNote(item.note);
    }).catch((err) => setLoadError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const points = knowledgePoints.filter((point) => point.subjectId === subjectId);
  async function save(lifecycle: Lifecycle) {
    if (lifecycle === 'archived' && !subjectId) { setError('归档前，请先选择学科。'); return; }
    if (lifecycle === 'archived' && !question.trim()) { setError('填写题干后，就可以归档了。'); return; }
    setError('');
    setSaving(lifecycle);
    try {
      const item = await api<Mistake>(id ? `/mistakes/${id}` : '/mistakes', json({ subjectId: subjectId || null, primaryKnowledgePointId: primaryId ? Number(primaryId) : null, auxiliaryKnowledgePointIds: auxiliaryIds.filter((pointId) => pointId !== Number(primaryId)), question: question.trim(), answer: answer.trim(), analysis: analysis.trim(), note: note.trim(), lifecycle }, id ? 'PATCH' : 'POST'));
      notify(lifecycle === 'draft' ? '草稿已保存，可以稍后继续完善。' : id ? '错题已更新。' : '错题已归档，可以开始复习。');
      navigate(`/mistakes/${item.id}`);
    } catch (err) {
      setError((err as Error).message);
      notify((err as Error).message, 'error');
    } finally { setSaving(null); }
  }

  return <>
    <a className="back-link" href={id ? `#/mistakes/${id}` : '#/mistakes'}><ArrowLeft size={16} /> {id ? '返回错题详情' : '返回我的错题'}</a>
    <PageHeader eyebrow="留下题目，也留下思路" title={id ? '编辑错题' : '录入错题'} description="记录完整题干，补充答案和错因，再标注对应的知识点。" action={<DataTypeBadge isTest={isTest} />} />
    <LoadingContent loading={loading} kind="editor">
    {loadError ? <ErrorState message={loadError} /> :
    <form onSubmit={(event) => { event.preventDefault(); void save('archived'); }}>
      <div className="editor-layout"><div className="editor-main"><section className="panel"><div className="panel-title"><span className="panel-title-icon violet"><FileText size={18} /></span><div><h2>题目与解答</h2><p>保留完整题干，方便下次独立思考。</p></div></div>
        <MarkdownField name="题干" label={<>题干 <em>*</em></>} textareaClassName="question-editor" value={question} onChange={setQuestion} placeholder="输入题目内容，包括题目条件、问题和选项…" hint="归档前需要填写题干；内容还未整理好，可以先保存草稿。" />
        <MarkdownField name="正确答案" label={<>正确答案 <span className="optional-label">选填</span></>} rows={3} value={answer} onChange={setAnswer} placeholder="写下正确答案或最终结果…" />
        <MarkdownField name="解题分析" label={<>解题分析 <span className="optional-label">选填</span></>} rows={5} value={analysis} onChange={setAnalysis} placeholder="记录关键步骤、解题思路和需要注意的地方…" />
      </section></div>
        <aside className="editor-aside"><section className="panel"><div className="panel-title"><span className="panel-title-icon blue"><Layers size={18} /></span><div><h2>学科与知识点</h2><p>给这道题找到合适的位置。</p></div></div><label className="field"><span>学科 <em>*</em></span><select value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setPrimaryId(''); setAuxiliaryIds([]); }}><option value="" disabled>选择学科</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label><label className="field"><span>主知识点 <span className="optional-label">选填</span></span><select value={primaryId} onChange={(event) => { setPrimaryId(event.target.value); setAuxiliaryIds((current) => current.filter((pointId) => pointId !== Number(event.target.value))); }}><option value="">暂不标注</option>{points.map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select></label><div className="field"><span>辅助知识点 <span className="optional-label">可多选</span></span><ScrollArea className="knowledge-options" tabIndex={0} role="region" aria-label="辅助知识点">{points.filter((point) => point.id !== Number(primaryId)).map((point) => <label className={`knowledge-option ${auxiliaryIds.includes(point.id) ? 'selected' : ''}`} key={point.id}><Checkbox checked={auxiliaryIds.includes(point.id)} onChange={(event) => setAuxiliaryIds((current) => event.target.checked ? [...current, point.id] : current.filter((pointId) => pointId !== point.id))} />{knowledgeLabel(knowledgePoints, point.id)}</label>)}{!points.length && <p className="muted text-muted">该学科暂未配置知识点，可先录入题目。</p>}</ScrollArea></div></section>
          <section className="panel note-panel"><div className="panel-title"><span className="panel-title-icon amber"><StickyNote size={18} /></span><div><h2>我的笔记</h2><p>记下原因，也记下收获。</p></div></div><MarkdownField name="我的笔记" label="我的笔记" rows={4} value={note} onChange={setNote} placeholder="为什么会做错？下次遇到类似题目，要提醒自己什么？" /></section>
          <div className="editor-tip"><strong>先留住题目</strong><p>先记下问题，答案和分析可以以后再补充。</p></div></aside></div>
      <div className="editor-actions">{error ? <div className="form-error" role="alert">{error}</div> : <span className="muted">保存草稿可继续完善，归档后即可加入复习。</span>}<div><a className="button ghost" href={id ? `#/mistakes/${id}` : '#/mistakes'}>取消</a><button className="button secondary" type="button" disabled={Boolean(saving)} onClick={() => void save('draft')}>{saving === 'draft' ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />} 保存草稿</button><button className="button primary" type="submit" disabled={Boolean(saving)}>{saving === 'archived' ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />} 保存并归档</button></div></div>
    </form>}
    </LoadingContent>
  </>;
}

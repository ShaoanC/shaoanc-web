import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, CircleHelp, Eye, Lightbulb, LoaderCircle, Play, RotateCcw, SkipForward, Target, Trophy } from 'lucide-react';
import { api, json } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { MarkdownContent } from '../MarkdownContent';
import { EmptyState, ErrorState, PageHeader, StatusBadge } from '../components';
import { LoadingContent } from '../motion';
import { STATUS_LABELS, type Mistake, type ReviewResult } from '../types';

export function ReviewPage() {
  const { subjects, knowledgePoints, notify } = useApp();
  const requestedId = Number(new URLSearchParams(window.location.hash.split('?')[1] || '').get('mistakeId'));
  const [candidates, setCandidates] = useState<Mistake[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [knowledgePointId, setKnowledgePointId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queue, setQueue] = useState<Mistake[]>([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'select' | 'review' | 'complete'>('select');
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [skipped, setSkipped] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ lifecycle: 'archived' });
      if (subjectId) query.set('subjectId', subjectId);
      if (knowledgePointId) query.set('knowledgePointId', knowledgePointId);
      if (status) query.set('status', status);
      const items = await api<Mistake[]>(`/mistakes?${query}`);
      setCandidates(items);
      setSelected((current) => requestedId && items.some((item) => item.id === requestedId) ? [requestedId] : current.filter((id) => items.some((item) => item.id === id)));
    } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }, [subjectId, knowledgePointId, status, requestedId]);

  useEffect(() => { void load(); }, [load]);

  function start() {
    const items = candidates.filter((item) => selected.includes(item.id));
    if (!items.length) return;
    setQueue(items);
    setStep(0);
    setResults([]);
    setSkipped(0);
    setRevealed(false);
    setMode('review');
    window.scrollTo(0, 0);
  }

  function next() {
    if (step + 1 === queue.length) setMode('complete');
    else setStep((current) => current + 1);
    setRevealed(false);
    window.scrollTo(0, 0);
  }

  async function record(result: ReviewResult) {
    setSaving(true);
    try {
      await api(`/mistakes/${queue[step].id}/reviews`, json({ result }));
      setResults((current) => [...current, result]);
      notify(`已记录为「${STATUS_LABELS[result]}」${step + 1 === queue.length ? '，本次复习已完成。' : '，继续下一题。'}`);
      next();
    } catch (err) { notify((err as Error).message, 'error'); } finally { setSaving(false); }
  }

  if (mode === 'complete') {
    return <><PageHeader eyebrow="每次回顾，都算数" title="本次复习已结束" description="查看本次作答结果，继续复习还不熟悉的题目。" /><div className="review-complete panel"><div className="complete-illustration"><Trophy size={45} strokeWidth={1.6} /><span><Check size={16} /></span></div><h2>本次复习记录</h2><p>本次已记录 <strong>{results.length}</strong> 道错题的掌握程度{skipped ? `，跳过 ${skipped} 道` : ''}。</p><div className="complete-stats">{([{ result: 'unknown', label: '不会' }, { result: 'familiar', label: '不熟' }, { result: 'mastered', label: '掌握' }] as const).map(({ result, label }) => <div key={result}><span className={`complete-count ${result}`}>{results.filter((item) => item === result).length}</span><span>{label}</span></div>)}</div><div className="complete-actions"><a className="button secondary" href="#/mistakes"><BookOpen size={17} /> 返回错题本</a><button className="button primary" onClick={() => { setMode('select'); void load(); }}><RotateCcw size={17} /> 再来一次</button></div><small>掌握程度已经同步到错题本和学习统计。</small></div></>;
  }

  if (mode === 'review') {
    const item = queue[step];
    return <><div className="review-session-header"><button className="back-link" disabled={saving} onClick={() => setMode('complete')}><ArrowLeft size={16} /> 结束本次</button><span>专注思考 · 慢慢掌握</span></div><div className="review-progress"><div><strong>正在复习</strong><span>第 <b>{step + 1}</b> / {queue.length} 题</span></div><div className="progress-track"><span style={{ width: '100%', transform: 'scaleX(' + step / queue.length + ')', transformOrigin: 'left' }} /></div></div><section className="panel review-question"><div className="review-question-label"><span className={`subject-tag subject-${item.subjectId}`}>{subjects.find((subject) => subject.id === item.subjectId)?.name || item.subjectId}</span><span>{knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span><span className="review-question-number">第 {step + 1} 题</span></div><h1>先试着独立完成这道题</h1><MarkdownContent className="prose review-question-content">{item.question}</MarkdownContent><div className="review-answer"><button className={`answer-toggle ${revealed ? 'open' : ''}`} onClick={() => setRevealed(!revealed)} aria-expanded={revealed} aria-controls="review-answer-content"><span><Eye size={18} />{revealed ? '答案、分析与笔记' : '思考完成，查看答案与分析'}</span><ChevronDown size={18} /></button><div className={`answer-reveal ${revealed ? 'open' : ''}`} key={item.id} id="review-answer-content" aria-hidden={!revealed} inert={!revealed}><div className="revealed-content"><div><h3>正确答案</h3><MarkdownContent className={`prose ${!item.answer ? 'muted' : ''}`}>{item.answer || '这道题还未填写答案，可稍后到详情页补充。'}</MarkdownContent></div><div><h3>解题分析</h3><MarkdownContent className={`prose ${!item.analysis ? 'muted' : ''}`}>{item.analysis || '暂未填写解题分析。'}</MarkdownContent></div>{item.note && <div className="revealed-note"><h3>我的笔记</h3><MarkdownContent className="prose">{item.note}</MarkdownContent></div>}</div></div></div></section><section className="review-rating"><div><h2>这一次，你掌握得怎么样？</h2><p>根据这次独立作答的情况，记录真实感受。</p></div><div className="rating-options"><button className="rating-button rating-unknown" disabled={saving} onClick={() => void record('unknown')}><CircleHelp size={23} /><strong>不会</strong><span>还需要重新理解</span></button><button className="rating-button rating-familiar" disabled={saving} onClick={() => void record('familiar')}><Lightbulb size={23} /><strong>不熟</strong><span>思路还不够清晰</span></button><button className="rating-button rating-mastered" disabled={saving} onClick={() => void record('mastered')}><CheckCircle2 size={23} /><strong>掌握</strong><span>已经能独立完成</span></button></div><div className="rating-footer"><span>{saving ? <><LoaderCircle className="spin" size={14} /> 正在记录…</> : '选择后会记录本次结果，并进入下一道题。'}</span><button disabled={saving} onClick={() => { setSkipped((current) => current + 1); next(); }}>暂时跳过<SkipForward size={15} /></button></div></section></>;
  }

  return <>
    <PageHeader eyebrow="先作答，再看解答" title="开始复习" description="选一组已归档的错题，独立思考，并记录本次掌握程度。" />
    <div className="review-selection-layout"><section className="library-panel"><div className="panel-title selection-heading"><span className="panel-title-icon violet"><BookOpen size={18} /></span><div><h2>选择今天的练习</h2><p>仅已归档的错题可以参与复习。</p></div></div><div className="filter-bar review-filters"><select aria-label="复习学科" value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setKnowledgePointId(''); }}><option value="">全部学科</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select><select aria-label="复习知识点" value={knowledgePointId} onChange={(event) => setKnowledgePointId(event.target.value)}><option value="">全部知识点</option>{knowledgePoints.filter((point) => !subjectId || point.subjectId === subjectId).map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select><select aria-label="复习掌握程度" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">全部掌握程度</option><option value="unreviewed">未复习</option><option value="unknown">不会</option><option value="familiar">不熟</option><option value="mastered">掌握</option></select></div><div className="selection-toolbar"><label><input type="checkbox" checked={Boolean(candidates.length) && selected.length === candidates.length} disabled={!candidates.length} onChange={(event) => setSelected(event.target.checked ? candidates.map((item) => item.id) : [])} /> 全选当前结果</label><span>共 {candidates.length} 道 · 已选 <strong>{selected.length}</strong> 道</span></div><LoadingContent loading={loading} kind="review">{error ? <ErrorState message={error} retry={load} /> : candidates.length === 0 ? <EmptyState title="还没有可复习的错题" description={subjectId || knowledgePointId || status ? '调整筛选条件，看看其他错题。' : '录入并归档第一道错题，就能从这里开始复习。'} action={<a className="button primary" href="#/new">录入错题<ArrowRight size={16} /></a>} /> : <div className="review-candidates">{candidates.map((item) => <label className={`review-candidate ${selected.includes(item.id) ? 'selected' : ''}`} key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /><div><h3><MarkdownContent variant="compact">{item.question}</MarkdownContent></h3><span>{subjects.find((subject) => subject.id === item.subjectId)?.name} · {knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span></div><StatusBadge status={item.latestReviewResult || 'unreviewed'} /></label>)}</div>}</LoadingContent></section><aside className="review-preparation panel"><span className="prep-icon"><Target size={29} /></span><h2>今天的复习计划</h2><p>先独立作答，再核对答案。<br />按照实际情况记录掌握程度。</p><div className="prep-selected"><span>本次已选择</span><strong>{selected.length}<small>道错题</small></strong></div><div className="prep-steps"><span><i>1</i> 独立完成题目</span><span><i>2</i> 查看答案与分析</span><span><i>3</i> 记录本次掌握程度</span></div><button className="button primary full-width" disabled={!selected.length || loading} onClick={start}><Play size={16} /> 开始复习</button><small className="prep-hint">复习记录会同步更新掌握程度。</small></aside></div>
  </>;
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, CircleHelp, Eye, Lightbulb, LoaderCircle, Play, RotateCcw, SkipForward, Target, Trophy } from 'lucide-react';
import { api, json } from '../api';
import { LatestRequest } from '../latest-request';
import { knowledgeLabel, useApp } from '../context';
import { MarkdownContent } from '../MarkdownContent';
import { Checkbox, DataTypeBadge, EmptyState, ErrorState, PageHeader, StatusBadge } from '../components';
import { LoadingContent } from '../motion';
import { MistakeFilterFields } from '../MistakeFilterFields';
import { EMPTY_FILTERS, mistakeFilterQuery, type MistakeFilters } from '../mistake-filters';
import { StarRatingDisplay } from '../StarRating';
import { STATUS_LABELS, type Mistake, type ReviewResult } from '../types';

const REVIEW_OPTIONS = [
  { result: 'unknown', icon: CircleHelp },
  { result: 'familiar', icon: Lightbulb },
  { result: 'mastered', icon: CheckCircle2 },
] as const;
const RATING_FEEDBACK_DELAY = 300;

export function ReviewPage() {
  const { subjects, knowledgePoints } = useApp();
  const requestedId = Number(new URLSearchParams(window.location.hash.split('?')[1] || '').get('mistakeId'));
  const [candidates, setCandidates] = useState<Mistake[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<MistakeFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queue, setQueue] = useState<Mistake[]>([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'select' | 'review' | 'complete'>('select');
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState<{ result: ReviewResult; phase: 'pending' | 'saving' | 'saved' } | null>(null);
  const [recordError, setRecordError] = useState('');
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [skipped, setSkipped] = useState(0);
  const candidateRequest = useRef(new LatestRequest());
  const recordTimer = useRef<number | null>(null);
  const questionPanel = useRef<HTMLElement>(null);
  const saving = rating !== null;
  const ratingFeedback = rating?.phase === 'pending' ? null : rating;

  const load = useCallback(async () => {
    const query = mistakeFilterQuery(filters, { lifecycle: 'archived' });
    await candidateRequest.current.run((signal) => api<Mistake[]>(`/mistakes?${query}`, { signal }), {
      start() { setLoading(true); setError(''); },
      success(items) {
        setCandidates(items);
        setSelected((current) => requestedId && items.some((item) => item.id === requestedId) ? [requestedId] : current.filter((id) => items.some((item) => item.id === id)));
      },
      error(err) { setError(err.message); },
      finish() { setLoading(false); },
    });
  }, [filters, requestedId]);

  useEffect(() => { void load(); return () => candidateRequest.current.cancel(); }, [load]);

  function start() {
    const items = candidates.filter((item) => selected.includes(item.id));
    if (!items.length) return;
    setQueue(items);
    setStep(0);
    setResults([]);
    setSkipped(0);
    setRevealed(false);
    setRecordError('');
    setMode('review');
    window.scrollTo(0, 0);
  }

  const next = useCallback(() => {
    if (step + 1 === queue.length) setMode('complete');
    else setStep((current) => current + 1);
    setRevealed(false);
    setRating(null);
    setRecordError('');
    recordTimer.current = null;
    window.scrollTo(0, 0);
  }, [step, queue.length]);

  useEffect(() => {
    if (ratingFeedback?.phase !== 'saved') return;
    const timer = window.setTimeout(next, 600);
    return () => window.clearTimeout(timer);
  }, [ratingFeedback, next]);

  useEffect(() => () => {
    if (recordTimer.current !== null) window.clearTimeout(recordTimer.current);
    recordTimer.current = null;
  }, []);

  useEffect(() => {
    if (mode === 'review' && step > 0) questionPanel.current?.focus({ preventScroll: true });
  }, [mode, step]);

  async function record(result: ReviewResult) {
    if (recordTimer.current !== null) return;
    setRecordError('');
    setRating({ result, phase: 'pending' });
    let showedLoading = false;
    const timer = window.setTimeout(() => {
      showedLoading = true;
      setRating({ result, phase: 'saving' });
    }, RATING_FEEDBACK_DELAY);
    recordTimer.current = timer;
    try {
      await api(`/mistakes/${queue[step].id}/reviews`, json({ result }));
      if (recordTimer.current !== timer) return;
      setResults((current) => [...current, result]);
      if (showedLoading) setRating({ result, phase: 'saved' });
      else next();
    } catch (err) {
      if (recordTimer.current !== timer) return;
      setRecordError((err as Error).message);
      setRating(null);
      recordTimer.current = null;
    } finally {
      window.clearTimeout(timer);
    }
  }

  if (mode === 'complete') {
    return <><PageHeader eyebrow="每次回顾，都算数" title="本次复习已结束" description="查看本次作答结果，继续复习还不熟悉的题目。" /><div className="review-complete panel"><div className="complete-illustration"><Trophy size={45} strokeWidth={1.6} /><span><Check size={16} /></span></div><h2>本次复习记录</h2><p>本次已记录 <strong>{results.length}</strong> 道错题的掌握程度{skipped ? `，跳过 ${skipped} 道` : ''}。</p><div className="complete-stats">{([{ result: 'unknown', label: '不会' }, { result: 'familiar', label: '不熟' }, { result: 'mastered', label: '掌握' }] as const).map(({ result, label }) => <div key={result}><span className={`complete-count ${result}`}>{results.filter((item) => item === result).length}</span><span>{label}</span></div>)}</div><div className="complete-actions"><a className="button secondary" href="#/mistakes"><BookOpen size={17} /> 返回错题本</a><button className="button primary" onClick={() => { setMode('select'); void load(); }}><RotateCcw size={17} /> 再来一次</button></div><small>掌握程度已经同步到错题本和学习统计。</small></div></>;
  }

  if (mode === 'review') {
    const item = queue[step];
    return <>
      <div className="review-session-header"><button className="back-link" disabled={saving} onClick={() => setMode('complete')}><ArrowLeft size={16} /> 结束本次</button><span>专注思考 · 慢慢掌握</span></div>
      <div className="review-progress"><div><strong>正在复习</strong><span>第 <b>{step + 1}</b> / {queue.length} 题</span></div><div className="progress-track"><span style={{ width: '100%', transform: 'scaleX(' + step / queue.length + ')', transformOrigin: 'left' }} /></div></div>
      <div className="review-session-content">
        <div className={`review-step${step > 0 ? ' is-entering' : ''}`} key={item.id}>
          <section className="panel review-question" ref={questionPanel} tabIndex={-1} aria-label={`第 ${step + 1} 题`}>
            <div className="review-question-label"><DataTypeBadge isTest={item.isTest} /><span className={`subject-tag subject-${item.subjectId}`}>{subjects.find((subject) => subject.id === item.subjectId)?.name || item.subjectId}</span><span className={knowledgePoints.some((point) => point.id === item.primaryKnowledgePointId) ? undefined : 'text-muted'}>{knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span><StarRatingDisplay value={item.rating} /><span className="review-question-number">第 {step + 1} 题</span></div>
            <MarkdownContent className="prose review-question-content">{item.question}</MarkdownContent>
            <div className="review-answer">
              <button className={`answer-toggle ${revealed ? 'open' : ''}`} onClick={() => setRevealed(!revealed)} aria-expanded={revealed} aria-controls="review-answer-content"><span><Eye size={18} />{revealed ? '答案、分析与笔记' : '思考完成，查看答案与分析'}</span><ChevronDown size={18} /></button>
              <div className={`answer-reveal ${revealed ? 'open' : ''}`} id="review-answer-content" aria-hidden={!revealed} inert={!revealed}>
                <div className="revealed-content">
                  <div><h3>正确答案</h3><MarkdownContent className="prose" emptyText="这道题还未填写答案，可稍后到详情页补充。">{item.answer}</MarkdownContent></div>
                  <div><h3>解题分析</h3><MarkdownContent className="prose" emptyText="暂未填写解题分析。">{item.analysis}</MarkdownContent></div>
                  {item.note && <div className="revealed-note"><h3>我的笔记</h3><MarkdownContent className="prose">{item.note}</MarkdownContent></div>}
                </div>
              </div>
            </div>
          </section>
          <section className="review-rating">
            <div><h2>记录掌握情况</h2></div>
            <div className={`rating-options${rating?.phase === 'pending' ? ' is-pending' : ''}`}>
              {REVIEW_OPTIONS.map(({ result, icon: Icon }) => {
                const chosen = ratingFeedback?.result === result;
                return <button className={`rating-button rating-${result}${chosen ? ' is-selected' : ''}`} key={result} disabled={saving} aria-label={STATUS_LABELS[result]} aria-pressed={chosen} aria-busy={chosen && ratingFeedback.phase === 'saving'} onClick={() => void record(result)}>
                  {chosen ? ratingFeedback.phase === 'saving' ? <LoaderCircle className="spin" size={23} /> : <Check size={23} /> : <Icon size={23} />}
                  <strong>{chosen ? ratingFeedback.phase === 'saving' ? '记录中…' : '已记录' : STATUS_LABELS[result]}</strong>
                </button>;
              })}
            </div>
            <div className="rating-footer">
              <div className="rating-feedback">
                <span role="status" aria-atomic="true">{recordError ? '' : ratingFeedback ? ratingFeedback.phase === 'saving' ? `正在记录「${STATUS_LABELS[ratingFeedback.result]}」…` : `已记录为「${STATUS_LABELS[ratingFeedback.result]}」${step + 1 === queue.length ? '，本次复习已完成。' : '，继续下一题。'}` : ''}</span>
                {recordError && <span className="rating-error" role="alert"><AlertCircle size={16} /><span>未能记录：{recordError} 请重新选择。</span></span>}
              </div>
              <button disabled={saving} onClick={() => { setSkipped((current) => current + 1); next(); }}>暂时跳过<SkipForward size={15} /></button>
            </div>
          </section>
        </div>
      </div>
    </>;
  }

  return <>
    <PageHeader eyebrow="先作答，再看解答" title="开始复习" />
    <div className="review-selection-layout"><section className="library-panel"><div className="panel-title selection-heading"><span className="panel-title-icon violet"><BookOpen size={18} /></span><div><h2>选择今天的练习</h2><p>仅已归档的错题可以参与复习。</p></div></div><div className="filter-bar review-filters has-rating-filter"><MistakeFilterFields review filters={filters} onChange={setFilters} /></div><div className="selection-toolbar"><label><Checkbox checked={Boolean(candidates.length) && selected.length === candidates.length} indeterminate={selected.length > 0 && selected.length < candidates.length} disabled={loading || Boolean(error) || !candidates.length} onChange={(event) => setSelected(event.target.checked ? candidates.map((item) => item.id) : [])} /> 全选当前结果</label><span>共 {candidates.length} 道 · 已选 <strong>{selected.length}</strong> 道</span></div><LoadingContent loading={loading} kind="review">{error ? <ErrorState message={error} retry={load} /> : candidates.length === 0 ? <EmptyState title="还没有可复习的错题" description={Object.values(filters).some((values) => values.length > 0) ? '调整筛选条件，看看其他错题。' : '录入并归档第一道错题，就能从这里开始复习。'} action={<a className="button primary" href="#/new">录入错题<ArrowRight size={16} /></a>} /> : <div className="review-candidates">{candidates.map((item) => <label className={`review-candidate ${selected.includes(item.id) ? 'selected' : ''}`} key={item.id}><Checkbox aria-labelledby={`review-question-${item.id}`} checked={selected.includes(item.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /><div><h3 id={`review-question-${item.id}`}><MarkdownContent variant="compact">{item.question}</MarkdownContent></h3><span>{subjects.find((subject) => subject.id === item.subjectId)?.name} · <span className={knowledgePoints.some((point) => point.id === item.primaryKnowledgePointId) ? undefined : 'text-muted'}>{knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span></span><div className="review-candidate-rating"><StarRatingDisplay value={item.rating} /></div></div><DataTypeBadge isTest={item.isTest} /><StatusBadge status={item.latestReviewResult || 'unreviewed'} /></label>)}</div>}</LoadingContent></section><aside className="review-preparation panel"><span className="prep-icon"><Target size={29} /></span><h2>今天的复习计划</h2><div className="prep-selected"><span>本次已选择</span><strong>{selected.length}<small>道错题</small></strong></div><div className="prep-steps"><span><i>1</i> 独立完成题目</span><span><i>2</i> 查看答案与分析</span><span><i>3</i> 记录本次掌握程度</span></div><button className="button primary full-width" disabled={!selected.length || loading} onClick={start}><Play size={16} /> 开始复习</button><small className="prep-hint">复习记录会同步更新掌握程度。</small></aside></div>
  </>;
}

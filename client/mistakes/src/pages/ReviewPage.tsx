import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, CircleHelp, Eye, Lightbulb, LoaderCircle, Play, RotateCcw, SkipForward, Target, Trophy } from 'lucide-react';
import { api, json, navigate } from '../api';
import { LatestRequest } from '../latest-request';
import { knowledgeLabel, useApp } from '../context';
import { MarkdownContent } from '../MarkdownContent';
import { MistakeFollowups } from '../MistakeFollowups';
import { Checkbox, DataTypeBadge, EmptyState, ErrorState, PageHeader, StatusBadge } from '../components';
import { LoadingContent, Skeleton } from '../motion';
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

interface ReviewSession {
  id: string;
  revision: number;
  step: number;
  total: number;
  results: ReviewResult[];
  revealed: boolean;
  question: Mistake | null;
}

type ReviewAction = 'reveal' | 'hide' | 'rate' | 'skip' | 'finish';
type RatingFeedback = { result: ReviewResult } & (
  { phase: 'pending' } | { phase: 'saving' } | { phase: 'saved'; session: ReviewSession | null }
);
const reviewSessionPath = '/review-session';
const silent = { background: true, notifyUpdate: false };

export function ReviewPage() {
  const { subjects, knowledgePoints } = useApp();
  const requestedId = Number(new URLSearchParams(window.location.hash.split('?')[1] || '').get('mistakeId'));
  const [candidates, setCandidates] = useState<Mistake[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters] = useState<MistakeFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [pendingAction, setPendingAction] = useState<ReviewAction | 'start' | null>(null);
  const [rating, setRating] = useState<RatingFeedback | null>(null);
  const [recordError, setRecordError] = useState('');
  const candidateRequest = useRef(new LatestRequest());
  const sessionRequest = useRef(new LatestRequest());
  const pending = useRef(false);
  const mounted = useRef(false);
  const questionPanel = useRef<HTMLElement>(null);
  const saving = pendingAction !== null || rating !== null;
  const ratingFeedback = rating?.phase === 'pending' ? null : rating;
  const item = session?.question;
  const step = session?.step ?? 0;
  const complete = Boolean(session && !item);

  const loadSession = useCallback((initial = true, id?: string) => {
    if (pending.current) return;
    const path = id ? `${reviewSessionPath}?id=${id}` : reviewSessionPath;
    void sessionRequest.current.run((signal) => api<ReviewSession | null>(path, { signal }, silent), {
      start() { if (initial) { setSessionLoading(true); setSessionError(''); } },
      success(value) { setSession(value); setRecordError(''); },
      error(err) { if (initial) setSessionError(err.message); },
      finish() { if (initial) setSessionLoading(false); },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadSession();
    return () => {
      mounted.current = false;
      sessionRequest.current.cancel();
    };
  }, [loadSession]);

  useEffect(() => {
    if (sessionLoading || sessionError || complete || saving) return;
    const sync = () => loadSession(false, session?.id);
    const syncVisible = () => { if (document.visibilityState === 'visible') sync(); };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', syncVisible);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', syncVisible);
    };
  }, [sessionLoading, sessionError, complete, saving, session?.id, loadSession]);

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

  useEffect(() => {
    if (sessionLoading || sessionError || session) return;
    void load();
    return () => candidateRequest.current.cancel();
  }, [load, sessionLoading, sessionError, session]);

  useEffect(() => {
    if (item && step > 0) questionPanel.current?.focus({ preventScroll: true });
  }, [item?.id, step]);

  useEffect(() => {
    if (ratingFeedback?.phase !== 'saved') return;
    const timer = window.setTimeout(() => {
      setSession(ratingFeedback.session);
      setRating(null);
      window.scrollTo(0, 0);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [ratingFeedback]);

  async function save(action: ReviewAction | 'start', result?: ReviewResult) {
    if (pending.current || rating || (action !== 'start' && (!session || !item))) return;
    pending.current = true;
    sessionRequest.current.cancel();
    setPendingAction(action);
    setRecordError('');
    let showedLoading = false;
    if (result) setRating({ result, phase: 'pending' });
    const timer = result && window.setTimeout(() => {
      showedLoading = true;
      if (mounted.current) setRating({ result, phase: 'saving' });
    }, RATING_FEEDBACK_DELAY);
    try {
      if (action === 'start') {
        const mistakeIds = candidates.filter(({ id }) => selected.includes(id)).map(({ id }) => id);
        const started = await api<ReviewSession>(reviewSessionPath, json({ mistakeIds }), silent);
        if (!mounted.current) return;
        setSession(started);
        window.scrollTo(0, 0);
      } else {
        const updated = await api<{ session: ReviewSession | null; applied: boolean }>(reviewSessionPath, json({
          action, result, id: session!.id, revision: session!.revision, mistakeId: item!.id,
        }, 'PATCH'), result ? { background: true } : silent);
        if (!mounted.current) return;
        if (result && showedLoading && updated.applied) {
          setRating({ result, phase: 'saved', session: updated.session });
        } else {
          setRating(null);
          setSession(updated.session);
          if (!updated.session?.question || updated.session.question.id !== item?.id) window.scrollTo(0, 0);
        }
      }
    } catch (err) {
      if (!mounted.current) return;
      setRecordError((err as Error).message);
      setRating(null);
    } finally {
      window.clearTimeout(timer);
      pending.current = false;
      if (mounted.current) setPendingAction(null);
    }
  }

  if (sessionLoading) return <Skeleton kind="review-page" />;
  if (sessionError) return <><PageHeader eyebrow="先作答，再看解答" title="开始复习" /><ErrorState message={sessionError} retry={() => loadSession()} /></>;

  if (session && !item) {
    const { results } = session;
    const skipped = step - results.length;
    return <><PageHeader eyebrow="每次回顾，都算数" title="本次复习已结束" description="查看本次作答结果，继续复习还不熟悉的题目。" /><div className="review-complete panel"><div className="complete-illustration"><Trophy size={45} strokeWidth={1.6} /><span><Check size={16} /></span></div><h2>本次复习记录</h2><p>本次已记录 <strong>{results.length}</strong> 道错题的掌握程度{skipped ? `，跳过 ${skipped} 道` : ''}。</p><div className="complete-stats">{([{ result: 'unknown', label: '不会' }, { result: 'familiar', label: '不熟' }, { result: 'mastered', label: '掌握' }] as const).map(({ result, label }) => <div key={result}><span className={`complete-count ${result}`}>{results.filter((item) => item === result).length}</span><span>{label}</span></div>)}</div><div className="complete-actions"><a className="button secondary" href="#/mistakes"><BookOpen size={17} /> 返回错题本</a><button className="button primary" onClick={() => { setSession(null); setLoading(true); }}><RotateCcw size={17} /> 再来一次</button></div><small>掌握程度已经同步到错题本和学习统计。</small></div></>;
  }

  if (session && item) {
    const { total } = session;
    const revealed = pendingAction === 'reveal' || (pendingAction !== 'hide' && session.revealed);
    return <>
      <div className="review-session-header"><button className="back-link" disabled={saving} onClick={() => navigate('/mistakes')}><ArrowLeft size={16} /> 稍后继续</button><button className="button ghost" disabled={saving} onClick={() => void save('finish')}>结束本次</button></div>
      <div className="review-progress"><div><strong>正在复习</strong><span>第 <b>{step + 1}</b> / {total} 题</span></div><div className="progress-track"><span style={{ width: '100%', transform: 'scaleX(' + step / total + ')', transformOrigin: 'left' }} /></div></div>
      <div className="review-session-content">
        <div className={`review-step${step > 0 ? ' is-entering' : ''}`} key={item.id}>
          <section className="panel review-question" ref={questionPanel} tabIndex={-1} aria-label={`第 ${step + 1} 题`}>
            <div className="review-question-label"><DataTypeBadge isTest={item.isTest} /><span className={`subject-tag subject-${item.subjectId}`}>{subjects.find((subject) => subject.id === item.subjectId)?.name || item.subjectId}</span><span className={knowledgePoints.some((point) => point.id === item.primaryKnowledgePointId) ? undefined : 'text-muted'}>{knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span><StarRatingDisplay value={item.rating} /><span className="review-question-number">第 {step + 1} 题</span></div>
            <MarkdownContent className="prose review-question-content">{item.question}</MarkdownContent>
            <div className="review-answer">
              <button className={`answer-toggle ${revealed ? 'open' : ''}`} disabled={saving} onClick={() => void save(revealed ? 'hide' : 'reveal')} aria-expanded={revealed} aria-controls="review-answer-content"><span><Eye size={18} />{revealed ? '答案、分析与笔记' : '思考完成，查看答案与分析'}</span><ChevronDown size={18} /></button>
              <div className={`answer-reveal ${revealed ? 'open' : ''}`} id="review-answer-content" aria-hidden={!revealed} inert={!revealed}>
                <div className="revealed-content">
                  <div><h3>正确答案</h3><MarkdownContent className="prose" emptyText="这道题还未填写答案，可稍后到详情页补充。">{item.answer}</MarkdownContent></div>
                  <div><h3>解题分析</h3><MarkdownContent className="prose" emptyText="暂未填写解题分析。">{item.analysis}</MarkdownContent></div>
                  {item.note && <div className="revealed-note"><h3>我的笔记</h3><MarkdownContent className="prose">{item.note}</MarkdownContent></div>}
                  {revealed && <MistakeFollowups key={item.id} mistake={item} />}
                </div>
              </div>
            </div>
          </section>
          <section className="review-rating">
            <div><h2>记录掌握情况</h2></div>
            <div className={`rating-options${rating?.phase === 'pending' ? ' is-pending' : ''}`}>
              {REVIEW_OPTIONS.map(({ result, icon: Icon }) => {
                const chosen = ratingFeedback?.result === result;
                return <button className={`rating-button rating-${result}${chosen ? ' is-selected' : ''}`} key={result} disabled={saving} aria-label={STATUS_LABELS[result]} aria-pressed={chosen} aria-busy={chosen && ratingFeedback.phase === 'saving'} onClick={() => void save('rate', result)}>
                  {chosen ? ratingFeedback.phase === 'saving' ? <LoaderCircle className="spin" size={23} /> : <Check size={23} /> : <Icon size={23} />}
                  <strong>{chosen ? ratingFeedback.phase === 'saving' ? '记录中…' : '已记录' : STATUS_LABELS[result]}</strong>
                </button>;
              })}
            </div>
            <div className="rating-footer">
              <div className="rating-feedback">
                <span role="status" aria-atomic="true">{recordError ? '' : ratingFeedback ? ratingFeedback.phase === 'saving' ? `正在记录「${STATUS_LABELS[ratingFeedback.result]}」…` : `已记录为「${STATUS_LABELS[ratingFeedback.result]}」${ratingFeedback.session?.question ? '，继续下一题。' : '，本次复习已完成。'}` : ''}</span>
                {recordError && <span className="rating-error" role="alert"><AlertCircle size={16} /><span>复习进度保存失败，请重试。{recordError}</span></span>}
              </div>
              <button disabled={saving} onClick={() => void save('skip')}>暂时跳过<SkipForward size={15} /></button>
            </div>
          </section>
        </div>
      </div>
    </>;
  }

  return <>
    <PageHeader eyebrow="先作答，再看解答" title="开始复习" />
    <div className="review-selection-layout"><section className="library-panel"><div className="panel-title selection-heading"><span className="panel-title-icon violet"><BookOpen size={18} /></span><div><h2>选择今天的练习</h2><p>仅已归档的错题可以参与复习。</p></div></div><div className="filter-bar review-filters has-rating-filter"><MistakeFilterFields review filters={filters} onChange={setFilters} /></div><div className="selection-toolbar"><label><Checkbox checked={Boolean(candidates.length) && selected.length === candidates.length} indeterminate={selected.length > 0 && selected.length < candidates.length} disabled={loading || Boolean(error) || !candidates.length} onChange={(event) => setSelected(event.target.checked ? candidates.map((item) => item.id) : [])} /> 全选当前结果</label><span>共 {candidates.length} 道 · 已选 <strong>{selected.length}</strong> 道</span></div><LoadingContent loading={loading} kind="review">{error ? <ErrorState message={error} retry={load} /> : candidates.length === 0 ? <EmptyState title="还没有可复习的错题" description={Object.values(filters).some((values) => values.length > 0) ? '调整筛选条件，看看其他错题。' : '录入并归档第一道错题，就能从这里开始复习。'} action={<a className="button primary" href="#/new">录入错题<ArrowRight size={16} /></a>} /> : <div className="review-candidates">{candidates.map((item) => <label className={`review-candidate ${selected.includes(item.id) ? 'selected' : ''}`} key={item.id}><Checkbox aria-labelledby={`review-question-${item.id}`} checked={selected.includes(item.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /><div><h3 id={`review-question-${item.id}`}><MarkdownContent variant="compact">{item.question}</MarkdownContent></h3><span>{subjects.find((subject) => subject.id === item.subjectId)?.name} · <span className={knowledgePoints.some((point) => point.id === item.primaryKnowledgePointId) ? undefined : 'text-muted'}>{knowledgeLabel(knowledgePoints, item.primaryKnowledgePointId)}</span></span><div className="review-candidate-rating"><StarRatingDisplay value={item.rating} /></div></div><DataTypeBadge isTest={item.isTest} /><StatusBadge status={item.latestReviewResult || 'unreviewed'} /></label>)}</div>}</LoadingContent></section><aside className="review-preparation panel"><span className="prep-icon"><Target size={29} /></span><h2>今天的复习计划</h2><div className="prep-selected"><span>本次已选择</span><strong>{selected.length}<small>道错题</small></strong></div><div className="prep-steps"><span><i>1</i> 独立完成题目</span><span><i>2</i> 查看答案与分析</span><span><i>3</i> 记录本次掌握程度</span></div><button className="button primary full-width" disabled={!selected.length || loading || saving} onClick={() => void save('start')}><Play size={16} /> {pendingAction === 'start' ? '正在开始…' : '开始复习'}</button>{recordError && <span className="rating-error" role="alert">{recordError}</span>}<small className="prep-hint">复习进度会同步到同账号的设备。</small></aside></div>
  </>;
}

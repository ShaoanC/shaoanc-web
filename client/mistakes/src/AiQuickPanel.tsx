import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, ArrowRight, CircleCheck, RefreshCw, X } from 'lucide-react';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import { AiReview } from './AiReview';
import { api } from './api';
import { useApp } from './context';
import { readEditorDraft, hasEditorChanges } from './editor-draft';
import { SlidingTabs } from './motion';
import { aiJobLabel, isActiveJob, needsReview, useAiTasks, type OpenTasksOptions } from './AiTasks';
import { TaskActions, TaskCard, taskStatusLabel, useTaskClock } from './AiTaskCard';
import { dismissSoftKeyboard, useSoftKeyboard } from './useSoftKeyboard';
import type { AiJob, AiInput, AiApplyOptions } from './ai-types';
import type { Mistake } from './types';
import './ai-quick-panel.css';

type QuickFilter = 'all' | 'review' | 'failed' | 'active';
const FILTERS: { id: QuickFilter; label: string; empty: string }[] = [
  { id: 'all', label: '全部', empty: '暂时没有需要处理的任务' }, { id: 'review', label: '待校对', empty: '没有待校对的结果' },
  { id: 'failed', label: '失败', empty: '没有失败的任务' }, { id: 'active', label: '处理中', empty: '没有正在处理的任务' },
];
const PAGE_SIZE = 6;
const actionable = (job: AiJob) => !job.mistakeDeleted && (needsReview(job) || job.status === 'failed' || isActiveJob(job));
const inFilter = (job: AiJob, filter: QuickFilter) => filter === 'all' ? actionable(job)
  : filter === 'review' ? needsReview(job) : filter === 'failed' ? !job.mistakeDeleted && job.status === 'failed' : isActiveJob(job);
const priority = (job: AiJob) => needsReview(job) ? 0 : job.status === 'failed' ? 1 : 2;
const REVIEW_TITLES = { question: '校对题干与配图', answer: '校对答案', analysis: '校对解析' };
const reviewTitle = (job?: AiJob) => !job ? '校对结果' : job.mode === 'page-entry' ? '校对题干、答案与配图' : REVIEW_TITLES[job.type];
const SCROLLER = '.mobile-filters-content, .quick-panel-body';
// A row that was just acted on stays where it was until the panel closes, so feedback never jumps away.
interface RowMessage { text: string; error: boolean; filter: QuickFilter }

export function AiQuickPanel({ open, onOpenChange, request, triggerRef }: {
  open: boolean; onOpenChange: (open: boolean) => void; request: OpenTasksOptions & { revision: number }; triggerRef: RefObject<HTMLElement | null>;
}) {
  const mobile = useMobileLayout();
  const tasks = useAiTasks();
  const [scope, setScope] = useState<number | undefined>(request.mistakeId);
  const [filter, setFilter] = useState<QuickFilter>('all');
  const [reviewId, setReviewId] = useState<number | null>(request.view === 'review' ? request.jobId || null : null);
  const [direction, setDirection] = useState<'forward' | 'back' | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [extra, setExtra] = useState<AiJob | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, RowMessage>>({});
  const [targetError, setTargetError] = useState('');
  const [footerSlot, setFooterSlot] = useState<HTMLDivElement | null>(null);
  const view = useRef<HTMLDivElement>(null);
  const listScroll = useRef(0);
  const typing = useSoftKeyboard(open, '.ai-quick-panel');
  const jobs = extra && !tasks.jobs.some((job) => job.id === extra.id) ? [...tasks.jobs, extra] : tasks.jobs;
  const scoped = jobs.filter((job) => !scope || job.mistakeId === scope);
  const candidates = scoped.filter((job) => actionable(job) || job.id === request.jobId || Boolean(messages[job.id]));
  const signature = candidates.map((job) => job.id).join(',');
  const rows = order.map((id) => scoped.find((job) => job.id === id)).filter((job): job is AiJob => Boolean(job));
  const visible = rows.filter((job) => filter === 'all' || inFilter(job, filter) || messages[job.id]?.filter === filter);
  const review = jobs.find((job) => job.id === reviewId);
  const activeCount = scoped.filter(isActiveJob).length;
  const clock = useTaskClock(open && rows.some(isActiveJob));
  const generalAvailable = Boolean(tasks.config?.enabled && tasks.config.configured);
  const analysisAvailable = Boolean(tasks.config?.analysis?.enabled && tasks.config.analysis.configured);

  useEffect(() => {
    if (!request.jobId) return;
    let active = true;
    void api<AiJob>(`/ai/jobs/${request.jobId}`, {}, { background: true }).then((job) => { if (active) setExtra(job); }).catch((err) => { if (active) setTargetError(err.message); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!open) return;
    setOrder((previous) => [...previous, ...candidates.filter((job) => !previous.includes(job.id)).sort((a, b) => Number(b.id === request.jobId) - Number(a.id === request.jobId) || priority(a) - priority(b) || b.id - a.id).map((job) => job.id)]);
  }, [signature, open, scope]);
  // The list keeps its place across a review; the review always starts at its top.
  useLayoutEffect(() => {
    const scroller = view.current?.closest(SCROLLER);
    if (scroller) scroller.scrollTop = reviewId ? 0 : listScroll.current;
  }, [reviewId]);

  async function act(job: AiJob, action: 'retry' | 'cancel') {
    const pin = (text: string, error: boolean) => setMessages((previous) => ({ ...previous, [job.id]: { text, error, filter } }));
    try {
      const result = await tasks.actJobs([job.id], action);
      if (result.errors[0]) pin(result.errors[0].message, true);
      else pin(action === 'retry' ? '已重新加入队列' : '已取消任务', false);
    } catch (err) { pin((err as Error).message, true); }
  }
  function showReview(id: number) {
    listScroll.current = view.current?.closest(SCROLLER)?.scrollTop || 0;
    setDirection('forward'); setReviewId(id);
  }
  function showList() { setDirection('back'); setReviewId(null); }
  function changeScope(next: number | undefined) { setScope(next); setOrder([]); setLimit(PAGE_SIZE); }

  const status = tasks.error ? tasks.updatedAt ? '连接异常，已保留上次结果' : '暂时无法连接'
    : !tasks.loaded ? '正在同步…' : activeCount ? `${activeCount} 项处理中 · 自动更新` : tasks.updatedAt ? `已同步 ${new Date(tasks.updatedAt).toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}` : '自动更新';
  const heading = reviewId
    ? <div className="quick-heading"><button type="button" className="icon-button quick-back" aria-label="返回任务" data-base-ui-swipe-ignore onClick={showList}><ArrowLeft size={20} /></button><div className="quick-heading-copy"><Dialog.Title className="quick-eyebrow">AI 任务</Dialog.Title><p className="quick-title">{reviewTitle(review)}</p></div></div>
    : <div className="quick-heading"><div className="quick-heading-copy"><Dialog.Title className="quick-title">AI 任务</Dialog.Title><p className={`quick-sync${tasks.error ? ' is-error' : activeCount ? ' is-live' : ''}`}><span className="quick-live-dot" aria-hidden="true" />{status}</p></div></div>;
  const headerActions = typing
    ? <button type="button" className="button secondary quick-done" onClick={dismissSoftKeyboard}>完成</button>
    : reviewId ? <a className="text-link quick-detail-link" href={`#/ai-tasks?job=${reviewId}`}>任务详情</a>
    : <button type="button" className="icon-button quick-refresh" aria-label="刷新任务" disabled={tasks.refreshing} onClick={() => void tasks.refresh()}><RefreshCw size={18} className={tasks.refreshing ? 'spin' : ''} /></button>;
  const footer = reviewId ? <div ref={setFooterSlot} className="quick-review-footer" />
    : <a className="text-link quick-all-link" href="#/ai-tasks" onClick={() => onOpenChange(false)}>全部任务<ArrowRight size={16} /></a>;

  const list = <>
    {request.mistakeId && <div className="quick-scope" role="group" aria-label="任务范围"><button type="button" aria-pressed={Boolean(scope)} onClick={() => changeScope(request.mistakeId)}>本题 #{request.mistakeId}</button><button type="button" aria-pressed={!scope} onClick={() => changeScope(undefined)}>全部题目</button></div>}
    <SlidingTabs className="quick-filters" ariaLabel="按任务状态筛选" value={filter} onChange={(value) => { setFilter(value as QuickFilter); setLimit(PAGE_SIZE); }} tabs={FILTERS.map((item) => ({ id: item.id, label: <>{item.label}<span>{tasks.loaded ? scoped.filter((job) => inFilter(job, item.id)).length : '—'}</span></> }))} />
    {(tasks.error || targetError) && <div className="inline-alert quick-alert" role="alert">{tasks.error || targetError}{tasks.error && <button type="button" disabled={tasks.refreshing} onClick={() => void tasks.refresh()}>重新连接</button>}</div>}
    {tasks.config && !generalAvailable && !analysisAvailable && <p className="task-service-notice quick-service-notice">AI 服务暂不可用，已有结果仍可校对。</p>}
    {!tasks.loaded ? <div className="quick-placeholder" role="status" aria-label="正在加载任务">{[0, 1].map((index) => <span key={index} className="skeleton-shimmer" />)}</div>
      : !visible.length ? <div className="quick-empty"><CircleCheck size={28} strokeWidth={1.6} /><p>{FILTERS.find((item) => item.id === filter)!.empty}</p></div>
      : <div className="quick-task-list">{visible.slice(0, limit).map((job) => {
        const busy = tasks.busyIds.has(job.id);
        const message = messages[job.id];
        return <TaskCard key={job.id} compact className="quick-task-row" job={job} clock={clock}
          actions={<TaskActions job={job} busy={busy} serviceAvailable={job.type === 'analysis' ? analysisAvailable : generalAvailable} onCancel={() => void act(job, 'cancel')} onRetry={() => void act(job, 'retry')} onReview={() => showReview(job.id)} />}
          feedback={message && <p key={message.text} className={`quick-feedback${message.error ? ' is-error' : ''}`} role="status">{message.text}</p>} />;
      })}</div>}
    {visible.length > limit && <button type="button" className="button ghost quick-load-more" onClick={() => setLimit((value) => value + PAGE_SIZE)}>显示更多 · 还有 {visible.length - limit} 项</button>}
  </>;
  const content = <div ref={view} key={reviewId ? `review-${reviewId}` : 'list'} className="quick-view" data-direction={direction ?? undefined}>
    {reviewId ? review ? <QuickReview key={review.id} job={review} footerContainer={footerSlot} onBack={showList} onApplied={() => { setMessages((previous) => ({ ...previous, [review.id]: { text: '校对结果已填入', error: false, filter } })); showList(); }} />
      : <p className="quick-loading" role="status">{targetError || '正在加载任务…'}</p>
      : list}
  </div>;
  const className = `ai-quick-panel${reviewId ? ' is-review' : ''}${typing ? ' is-typing' : ''}`;

  return mobile
    ? <MobileDrawer open={open} onOpenChange={onOpenChange} title="AI 任务" triggerRef={triggerRef} closeLabel="关闭 AI 任务" className={`ai-quick-drawer ${className}`} heading={heading} headerActions={headerActions} footer={footer}>{() => content}</MobileDrawer>
    : <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Backdrop className="quick-task-backdrop" /><Dialog.Popup className={`ai-quick-dialog ${className}`} finalFocus={triggerRef}>
      <header className="quick-panel-header">{heading}{headerActions}<Dialog.Close className="icon-button quick-close" aria-label="关闭 AI 任务"><X size={20} /></Dialog.Close></header>
      <div className="quick-panel-body">{content}</div>
      <footer className="quick-panel-footer">{footer}</footer>
    </Dialog.Popup></Dialog.Portal></Dialog.Root>;
}

function QuickReview({ job, footerContainer, onBack, onApplied }: { job: AiJob; footerContainer: HTMLElement | null; onBack: () => void; onApplied: () => void }) {
  const { user, refreshDirectory } = useApp();
  const tasks = useAiTasks();
  const [input, setInput] = useState<AiInput | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const session = tasks.editorSession(job.mistakeId);
    if (session) { setInput(session.input()); return; }
    const draft = readEditorDraft(localStorage, user.id, job.mistakeId);
    if (draft && hasEditorChanges(draft.data, draft.baseline)) { setError('这道题有尚未提交的本机修改，请进入完整编辑后校对。'); return; }
    let active = true;
    void api<Mistake>(`/mistakes/${job.mistakeId}`).then((record) => { if (active) setInput(record); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [job.id]);
  async function apply(options: AiApplyOptions) {
    setBusy(true);
    try {
      const session = tasks.editorSession(job.mistakeId);
      if (session) await session.apply(job, options);
      else await tasks.applyJob(job.id, options);
      window.dispatchEvent(new CustomEvent('mistakes:record-view-updated', { detail: { id: job.mistakeId } }));
      await refreshDirectory();
    } finally { setBusy(false); }
  }
  const editLink = <a className="button secondary" href={`#/mistakes/${job.mistakeId}/edit`}>进入完整编辑</a>;
  let notice: ReactNode = null;
  if (error || job.mistakeDeleted) notice = <><p className="form-error" role="alert">{error || '错题已删除，请恢复后再校对。'}</p>{editLink}</>;
  else if (!input) notice = <p className="quick-loading" role="status">正在加载题目…</p>;
  else if (!needsReview(job)) notice = <><p>{aiJobLabel(job)}{taskStatusLabel(job)}，无需再校对。</p><a className="button secondary" href={`#/mistakes/${job.mistakeId}`}>查看错题</a></>;
  if (notice) return <div className="quick-review-notice">{notice}</div>;
  return <AiReview embedded job={job} input={input!} busy={busy} footerContainer={footerContainer} onApply={apply} onDismiss={onBack} onApplied={onApplied} />;
}

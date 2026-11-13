import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, RefreshCw, X } from 'lucide-react';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import { AiReview } from './AiReview';
import { api } from './api';
import { useApp } from './context';
import { readEditorDraft, hasEditorChanges } from './editor-draft';
import { aiJobLabel, isActiveJob, needsReview, canCancelJob, useAiTasks, type OpenTasksOptions } from './AiTasks';
import type { AiJob, AiInput, AiApplyOptions } from './ai-types';
import type { Mistake } from './types';
import './ai-quick-panel.css';

const actionable = (job: AiJob) => !job.mistakeDeleted && (needsReview(job) || job.status === 'failed' || isActiveJob(job));
const priority = (job: AiJob) => needsReview(job) ? 0 : job.status === 'failed' ? 1 : 2;
const label = (job: AiJob) => job.mistakeDeleted ? '错题已删除' : job.applyStatus === 'applied' ? '已填入' : needsReview(job) ? '待校对' : ({ queued: '排队中', running: '处理中', retrying: '等待重试', failed: '失败', cancelled: '已取消', succeeded: '已完成' })[job.status];

export function AiQuickPanel({ open, onOpenChange, request, triggerRef }: {
  open: boolean; onOpenChange: (open: boolean) => void; request: OpenTasksOptions & { revision: number }; triggerRef: RefObject<HTMLElement | null>;
}) {
  const mobile = useMobileLayout();
  const tasks = useAiTasks();
  const [scope, setScope] = useState<number | undefined>();
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [limit, setLimit] = useState(6);
  const [extra, setExtra] = useState<AiJob | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, string>>({});
  const [targetError, setTargetError] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const listScroll = useRef(0);
  const jobs = extra && !tasks.jobs.some((job) => job.id === extra.id) ? [...tasks.jobs, extra] : tasks.jobs;
  useEffect(() => {
    setScope(request.mistakeId); setReviewId(request.view === 'review' ? request.jobId || null : null);
    setLimit(6); setOrder([]); setMessages({}); setExtra(null); setTargetError(''); listScroll.current = 0;
    if (!request.jobId) return;
    let active = true;
    void api<AiJob>(`/ai/jobs/${request.jobId}`, {}, { background: true }).then((job) => { if (active) setExtra(job); }).catch((err) => { if (active) setTargetError(err.message); });
    return () => { active = false; };
  }, [request.revision]);
  const candidates = jobs.filter((job) => (!scope || job.mistakeId === scope) && (actionable(job) || job.id === request.jobId || Boolean(messages[job.id])));
  const signature = candidates.map((job) => job.id).join(',');
  useEffect(() => {
    if (!open) return;
    setOrder((previous) => [...previous, ...candidates.filter((job) => !previous.includes(job.id)).sort((a, b) => Number(b.id === request.jobId) - Number(a.id === request.jobId) || priority(a) - priority(b) || b.id - a.id).map((job) => job.id)]);
  }, [signature, open, request.revision, scope]);
  const rows = order.map((id) => jobs.find((job) => job.id === id)).filter((job): job is AiJob => Boolean(job) && (!scope || job!.mistakeId === scope));
  const review = jobs.find((job) => job.id === reviewId);
  useLayoutEffect(() => { if (!reviewId && list.current) list.current.scrollTop = listScroll.current; }, [reviewId]);
  async function act(job: AiJob, action: 'retry' | 'cancel') {
    try {
      const result = await tasks.actJobs([job.id], action);
      setMessages((previous) => ({ ...previous, [job.id]: result.errors[0]?.message || (action === 'retry' ? '已重新加入队列' : '已取消任务') }));
    } catch (err) { setMessages((previous) => ({ ...previous, [job.id]: (err as Error).message })); }
  }
  function showReview(id: number) { listScroll.current = list.current?.scrollTop || 0; setReviewId(id); }
  const footer = <a className="text-link" href="#/ai-tasks" onClick={() => onOpenChange(false)}>全部任务</a>;
  const content = <>
    {reviewId ? <><div className="quick-review-heading"><button className="table-button" onClick={() => setReviewId(null)}><ArrowLeft size={16} />返回任务</button><a className="text-link" href={`#/ai-tasks?job=${reviewId}`}>任务详情</a></div>
      {review ? <QuickReview key={`${request.revision}-${review.id}`} job={review} onBack={() => setReviewId(null)} onApplied={() => { setMessages((previous) => ({ ...previous, [review.id]: '校对结果已填入' })); setReviewId(null); }} /> : <p role="status">{targetError || '正在加载任务…'}</p>}
    </> : <div ref={list} className="quick-task-list">
      {request.mistakeId && <div className="quick-scope" role="group" aria-label="任务范围"><button aria-pressed={Boolean(scope)} onClick={() => { setScope(request.mistakeId); setOrder([]); setLimit(6); }}>本题 #{request.mistakeId}</button><button aria-pressed={!scope} onClick={() => { setScope(undefined); setOrder([]); setLimit(6); }}>所有待处理</button></div>}
      <div className="quick-summary"><span>{candidates.filter(needsReview).length} 待校对 · {candidates.filter((job) => job.status === 'failed').length} 失败 · {candidates.filter(isActiveJob).length} 处理中</span><button className="icon-button" aria-label="刷新任务" disabled={tasks.refreshing} onClick={() => void tasks.refresh()}><RefreshCw size={16} /></button></div>
      {(tasks.error || targetError) && <p className="form-error" role="alert">{tasks.error || targetError}</p>}
      {!tasks.loaded ? <p role="status">正在加载任务…</p> : !rows.length ? <p className="quick-empty">暂时没有需要处理的任务</p> : rows.slice(0, limit).map((job) => {
        const service = job.type === 'analysis' ? tasks.config?.analysis : tasks.config;
        return <article className="quick-task-row" data-job-id={job.id} key={job.id}>
          <div className="quick-row-heading"><strong>{aiJobLabel(job)}</strong><span>{label(job)}</span></div>
          <p className="quick-excerpt">{(job.input.question || job.result?.question || `记录 #${job.mistakeId}`).replace(/!\[[^\]]*\]\([^)]*\)/g, '[配图]')}</p>
          {job.error && <details className="quick-error"><summary>{job.error}</summary><p>{job.error}</p></details>}
          {job.mistakeDeleted && <p>错题已移入回收站，恢复后可继续操作。</p>}
          <div className="quick-row-actions">
            {needsReview(job) && <button className="button primary" onClick={() => showReview(job.id)}>校对并填入</button>}
            {job.status === 'failed' && !job.mistakeDeleted && <button className="button secondary" disabled={tasks.busyIds.has(job.id) || !service?.enabled || !service.configured} onClick={() => void act(job, 'retry')}>重试</button>}
            <details className="quick-more"><summary>更多</summary><div><a href={`#/mistakes/${job.mistakeId}/edit`}>进入完整编辑</a><a href={`#/ai-tasks?job=${job.id}`}>任务详情</a>{canCancelJob(job) && !job.mistakeDeleted && <button className="table-button" disabled={tasks.busyIds.has(job.id)} onClick={() => void act(job, 'cancel')}>取消任务</button>}</div></details>
          </div>
          {messages[job.id] && <p className="quick-feedback" role="status">{messages[job.id]}</p>}
        </article>;
      })}
      {rows.length > limit && <button className="button ghost quick-load-more" onClick={() => setLimit((value) => value + 6)}>显示更多</button>}
    </div>}
  </>;
  return mobile ? <MobileDrawer open={open} onOpenChange={onOpenChange} title="AI 任务" triggerRef={triggerRef} closeLabel="关闭 AI 任务" className={`ai-quick-drawer${reviewId ? ' is-review' : ''}`} footer={footer}>{() => content}</MobileDrawer> :
    <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Backdrop className="quick-task-backdrop" /><Dialog.Popup className={`ai-quick-dialog${reviewId ? ' is-review' : ''}`} finalFocus={triggerRef}>
      <header><Dialog.Title>AI 任务</Dialog.Title><Dialog.Close className="icon-button" aria-label="关闭 AI 任务"><X size={20} /></Dialog.Close></header><div className="quick-panel-body">{content}</div><footer>{footer}</footer>
    </Dialog.Popup></Dialog.Portal></Dialog.Root>;
}

function QuickReview({ job, onBack, onApplied }: { job: AiJob; onBack: () => void; onApplied: () => void }) {
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
  if (error || job.mistakeDeleted) return <div><p className="form-error" role="alert">{error || '错题已删除，请恢复后再校对。'}</p><a href={`#/mistakes/${job.mistakeId}/edit`}>进入完整编辑</a></div>;
  if (!input) return <p role="status">正在加载题目…</p>;
  if (!needsReview(job)) return <p>此任务{label(job)}。<a href={`#/mistakes/${job.mistakeId}`}>查看错题</a></p>;
  return <AiReview embedded job={job} input={input} busy={busy} onApply={apply} onDismiss={onBack} onApplied={onApplied} />;
}

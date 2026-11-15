import { useEffect, useState, type ReactNode } from 'react';
import { Ban, CheckCircle2, CircleAlert, Clock3, LoaderCircle, PencilLine, RotateCcw, TimerReset, X } from 'lucide-react';
import { formatDate } from './api';
import { useApp } from './context';
import { MarkdownContent } from './MarkdownContent';
import { aiJobLabel, canCancelJob, canRetryJob, needsReview, taskTone } from './AiTasks';
import type { AiJob } from './ai-types';
import './ai-tasks.css';

const STATUS_LABELS = { queued: '排队中', running: '处理中', retrying: '等待重试', succeeded: '待校对', failed: '失败', cancelled: '已取消' } as const;

export function taskStatusLabel(job: AiJob) {
  if (job.status === 'succeeded') return job.applyStatus === 'applied' ? '已填入' : job.applyStatus === 'conflict' ? '内容有更新，待校对' : '待校对';
  return STATUS_LABELS[job.status];
}

export function taskLink(job: AiJob) {
  return job.mistakeDeleted ? '#/mistakes?trash=1' : `#/mistakes/${job.mistakeId}/edit${needsReview(job) ? `?aiJob=${job.id}` : ''}`;
}

export function taskExcerpt(job: AiJob) {
  const source = job.input.question || job.result?.question || '';
  return source.replace(/!\[[^\]]*\]\([^)]*\)/g, '[配图]').trim()
    || (job.imageIds.length ? `已上传 ${job.imageIds.length} 张图片，等待识别题目内容` : '等待补充题目内容');
}

function elapsed(job: AiJob, clock: number, short: boolean) {
  if (!job.startedAt) return job.status === 'queued' ? '等待执行' : '尚未执行';
  const seconds = Math.max(0, Math.floor(((job.finishedAt ? Date.parse(job.finishedAt) : clock) - Date.parse(job.startedAt)) / 1000));
  const text = seconds < 60 ? `${seconds} 秒` : seconds < 3600 ? `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒` : `${Math.floor(seconds / 3600)} 小时 ${Math.floor(seconds % 3600 / 60)} 分`;
  return short ? text : `本轮耗时 ${text}`;
}

/** Ticks once a second while any visible job is still running, so durations and countdowns stay live. */
export function useTaskClock(running: boolean) {
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    setClock(Date.now());
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  return clock;
}

function StatusIcon({ job }: { job: AiJob }) {
  if (job.status === 'running') return <LoaderCircle size={14} className="spin" />;
  if (job.status === 'queued') return <Clock3 size={14} />;
  if (job.status === 'retrying') return <TimerReset size={14} />;
  if (job.status === 'failed') return <CircleAlert size={14} />;
  if (job.status === 'cancelled') return <Ban size={14} />;
  return job.applyStatus === 'applied' ? <CheckCircle2 size={14} /> : <PencilLine size={14} />;
}

/** Keyed by state so a change replays the pill's entrance instead of swapping text in place. */
export function TaskStatus({ job }: { job: AiJob }) {
  return <span key={`${job.status}-${job.applyStatus}`} className={`task-status task-status-${taskTone(job)}`}><StatusIcon job={job} />{taskStatusLabel(job)}</span>;
}

function TaskError({ message, compact }: { message: string; compact: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const long = compact && message.length > 46;
  return <div className={`task-row-error${long && !expanded ? ' is-clamped' : ''}`}>
    <p>{message}</p>
    {long && <button type="button" className="task-error-toggle" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '收起' : '展开原因'}</button>}
  </div>;
}

export function TaskCard({ job, clock, compact = false, className = '', selection, actions, children, feedback }: {
  job: AiJob; clock: number; compact?: boolean; className?: string;
  selection?: ReactNode; actions?: ReactNode; children?: ReactNode; feedback?: ReactNode;
}) {
  const { subjects } = useApp();
  const link = taskLink(job);
  const subject = job.input.subjectId ? subjects.find((item) => item.id === job.input.subjectId)?.name || job.input.subjectId : '';
  return <article className={`task-row task-row-${taskTone(job)}${compact ? ' task-row-compact' : ''}${className ? ` ${className}` : ''}`} data-job-id={job.id}>
    <div className="task-row-heading"><div className="task-row-title">{selection}<h3>{aiJobLabel(job)}</h3><span className="task-id">#{job.id}</span></div><TaskStatus job={job} /></div>
    <a className="task-excerpt" href={link}><MarkdownContent variant="compact">{taskExcerpt(job)}</MarkdownContent></a>
    {!compact && job.recognitionPrompt && <p className="task-row-notice">二级提示词：<span className="user-content">{job.recognitionPrompt}</span></p>}
    <div className="task-meta">
      <a href={link}>记录 #{job.mistakeId}</a>
      {!compact && job.model && <span className="task-model">{job.model}</span>}
      {!compact && subject && <span>{subject}</span>}
      {!compact && <span>{formatDate(job.createdAt, true)}</span>}
      <span><Clock3 size={13} />{elapsed(job, clock, compact)}</span>
      {(!compact || job.attempts > 1) && <span>尝试 {job.attempts}/{job.maxAttempts}</span>}
      {!compact && job.imageIds.length > 0 && <span>{job.imageIds.length} 张图片</span>}
    </div>
    {job.mistakeDeleted ? <p className="task-row-notice">错题已移入回收站，恢复后可继续操作。</p>
      : needsReview(job) && job.applyStatus === 'conflict' && <p className="task-row-notice">题目内容已修改，AI 结果尚未覆盖现有内容，校对时可选择是否替换。</p>}
    {job.status === 'retrying' && <p className="task-row-notice">{job.nextAttemptAt && Date.parse(job.nextAttemptAt) > clock ? `将在 ${Math.ceil((Date.parse(job.nextAttemptAt) - clock) / 1000)} 秒后自动重试，无需重复提交。` : '等待队列继续执行，无需重复提交。'}</p>}
    {job.error && <TaskError message={job.error} compact={compact} />}
    {children}
    {actions && <div className="task-row-actions">{actions}</div>}
    {feedback}
  </article>;
}

/** The same actions, in the same order, wherever a task is listed. */
export function TaskActions({ job, busy, serviceAvailable, onCancel, onRetry, onReview }: {
  job: AiJob; busy: boolean; serviceAvailable: boolean; onCancel: () => void; onRetry: () => void; onReview?: () => void;
}) {
  const review = needsReview(job);
  const label = job.mistakeDeleted ? '前往回收站' : review ? '校对并填入' : job.status === 'failed' ? '修改题目' : '打开错题';
  return <>
    {busy && <span className="task-row-busy" role="status"><LoaderCircle size={14} className="spin" />正在提交…</span>}
    {canCancelJob(job) && !job.mistakeDeleted && <button type="button" className="table-button" disabled={busy} onClick={onCancel}><X size={14} />取消任务</button>}
    {canRetryJob(job) && <button type="button" className="button secondary" disabled={busy || !serviceAvailable} onClick={onRetry}><RotateCcw size={14} />重试</button>}
    {review && onReview
      ? <button type="button" className="button primary" disabled={busy} onClick={onReview}>{label}</button>
      : <a className={review ? 'button primary' : 'text-link'} href={taskLink(job)}>{label}</a>}
  </>;
}

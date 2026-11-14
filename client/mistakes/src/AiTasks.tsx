import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, json } from './api';
import { useApp } from './context';
import type { AiInput } from './ai-types';
import { PageLoadBoundary } from './PageLoadBoundary';
import { LoadingContent } from './motion';
import { toastDestination } from './toast-navigation';
import { useActivityToast, type ActivityNotice } from './useActivityToast';
import type { AiApplyOptions, AiApplyResult, AiConfig, AiJob, AiJobRequest } from './ai-types';

const AiQuickPanel = lazy(() => import('./AiQuickPanel').then((module) => ({ default: module.AiQuickPanel })));
export interface OpenTasksOptions { mistakeId?: number; jobId?: number; view?: 'list' | 'review' }
export interface TaskEditorSession { input: () => AiInput; apply: (job: AiJob, options: AiApplyOptions) => Promise<void> }

export const AI_LABELS = { question: '题干识别', answer: '答案识别', analysis: '生成解析' };
export const aiJobLabel = (job: AiJob) => job.mode === 'page-entry' ? '按页录题' : AI_LABELS[job.type];
export const isActiveJob = (job: AiJob) => ['queued', 'running', 'retrying'].includes(job.status);
export const needsReview = (job: AiJob) => !job.mistakeDeleted && job.status === 'succeeded' && job.applyStatus !== 'applied';
export const canCancelJob = (job: AiJob) => isActiveJob(job) || job.status === 'failed' || (job.status === 'succeeded' && job.applyStatus !== 'applied');
export type JobAction = 'retry' | 'cancel';
export interface BatchResult { jobs: AiJob[]; errors: { id: number; message: string }[] }
const FEEDBACK_PRIORITY = { cancelled: 0, active: 1, review: 2, failed: 3 } as const;
type FeedbackTone = keyof typeof FEEDBACK_PRIORITY;
interface TaskFeedback { revision: number; tone: FeedbackTone }
interface TasksState {
  jobs: AiJob[]; config: AiConfig | null; error: string; loaded: boolean; refreshing: boolean; updatedAt: number | null;
  feedback: TaskFeedback | null;
  busyIds: Set<number>;
  refresh: () => Promise<void>;
  createJob: (request: AiJobRequest) => Promise<AiJob>;
  applyJob: (id: number, options?: AiApplyOptions) => Promise<AiApplyResult>;
  actJobs: (ids: number[], action: JobAction) => Promise<BatchResult>;
  openTasks: (options?: OpenTasksOptions) => void;
  open: boolean;
  registerEditor: (id: number, session: TaskEditorSession) => () => void;
  editorSession: (id: number) => TaskEditorSession | undefined;
  closeTasks: () => void;
}
const Context = createContext<TasksState | null>(null);
export function useAiTasks() { const value = useContext(Context); if (!value) throw new Error('AI tasks context missing'); return value; }

export function AiTasksButton({ className = '' }: { className?: string }) {
  const { jobs, feedback, openTasks, open } = useAiTasks();
  const active = jobs.filter(isActiveJob);
  const attention = jobs.some((job) => needsReview(job) || (!job.mistakeDeleted && job.status === 'failed'));
  const count = active.length;
  const signature = active.map((job) => job.id).sort((a, b) => a - b).join(',');
  const status = `${count ? `，${count} 项处理中` : ''}${attention ? '，有待校对或失败任务' : ''}`;
  return <button type="button" className={`button ghost ai-tasks-trigger ${className}${count ? ' has-active-tasks' : ''}`} aria-expanded={open} onClick={() => openTasks()} aria-haspopup="dialog" aria-label={`AI 任务${status}`} title="AI 任务">
    <span className="ai-task-icon" aria-hidden="true">
      {count > 0 && <span className="ai-task-orbit" />}
      <span key={feedback?.revision} className="ai-task-sparkles" data-feedback={feedback?.tone}>
        <Sparkles size={19} strokeWidth={1.8} />
      </span>
    </span>
    <span className="ai-task-label">AI 任务</span>
    <span className="ai-task-indicators"><AiTaskCount count={count} signature={signature} />{attention && <span className="ai-task-attention" aria-hidden="true" />}</span>
  </button>;
}

function AiTaskCount({ count, signature }: { count: number; signature: string }) {
  const [change, setChange] = useState({ signature, count, revision: 0, motion: '', visible: count > 0 });
  if (change.signature !== signature) {
    setChange({ signature, count, revision: change.revision + 1,
      motion: count === 0 ? 'exit' : count > change.count ? 'increase' : count < change.count ? 'decrease' : 'replace',
      visible: count > 0 || change.count > 0 });
  }
  useEffect(() => {
    if (change.count || !change.visible) return;
    const timer = window.setTimeout(() => setChange((current) => ({ ...current, visible: false })), 360);
    return () => window.clearTimeout(timer);
  }, [change.count, change.visible, change.revision]);
  if (!change.visible) return null;
  return <span key={change.revision} aria-hidden="true" className={`count-pill ai-task-count${change.motion ? ` ai-task-count-${change.motion}` : ''}`}>{count}</span>;
}

export function AiTasksProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [jobs, setJobs] = useState<AiJob[]>([]);
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [open, setOpen] = useState(false);
  const tasksTrigger = useRef<HTMLElement | null>(null);
  const [request, setRequest] = useState<OpenTasksOptions & { revision: number }>({ revision: 0 });
  const editors = useRef(new Map<number, TaskEditorSession>());
  const registerEditor = useCallback((id: number, session: TaskEditorSession) => {
    editors.current.set(id, session);
    return () => { if (editors.current.get(id) === session) editors.current.delete(id); };
  }, []);
  const editorSession = useCallback((id: number) => editors.current.get(id), []);
  const openTasks = useCallback((options: OpenTasksOptions = {}) => {
    tasksTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setRequest((previous) => ({ ...options, revision: previous.revision + 1 }));
    setOpen(true);
  }, []);
  const [onTasksPage, setOnTasksPage] = useState(window.location.hash.split('?')[0] === '#/ai-tasks');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<TaskFeedback | null>(null);
  const feedbackSnapshot = useRef<Map<number, Pick<AiJob, 'status' | 'applyStatus'>> | null>(null);
  const [busyIds, setBusyIds] = useState(new Set<number>());
  const busy = useRef(new Set<number>());
  const [visible, setVisible] = useState(!document.hidden);
  const routesLoaded = useRef(false);
  const routeNotices = useRef(new Set<string>());
  const previous = useRef<Map<number, string> | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const requested = useRef(false);
  const configRequested = useRef(false);
  const revision = useRef(0);
  const mounted = useRef(true);
  const report = useActivityToast(`ai-results-${user.id}`);

  // A mutation during polling must trigger another read, never restore an older snapshot.
  const mergeJobs = useCallback((next: AiJob[]) => {
    revision.current += 1;
    if (mounted.current) setJobs((current) => [...next, ...current.filter((job) => !next.some((item) => item.id === job.id))].sort((a, b) => b.id - a.id));
  }, []);
  const load = useCallback((includeConfig = false): Promise<void> => {
    requested.current = true;
    configRequested.current ||= includeConfig;
    if (inFlight.current) return inFlight.current;
    setRefreshing(true);
    const promise = (async () => {
      do {
        requested.current = false;
        const version = revision.current;
        const readConfig = configRequested.current;
        configRequested.current = false;
        const [jobResult, configResult] = await Promise.allSettled([
          api<AiJob[]>('/ai/jobs', {}, { background: true }),
          readConfig ? api<AiConfig>('/ai/config', {}, { background: true }) : Promise.resolve(null),
        ]);
        if (!mounted.current) break;
        if (jobResult.status === 'fulfilled') {
          if (version === revision.current) { setJobs(jobResult.value); setUpdatedAt(Date.now()); }
          else requested.current = true;
        }
        if (configResult.status === 'fulfilled' && configResult.value) setConfig(configResult.value);
        setError(jobResult.status === 'rejected' ? jobResult.reason.message : configResult.status === 'rejected' ? configResult.reason.message : '');
        setLoaded(true);
      } while (mounted.current && requested.current);
    })().finally(() => { inFlight.current = null; if (mounted.current) setRefreshing(false); });
    inFlight.current = promise;
    return promise;
  }, []);
  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const update = () => { void load(); };
    const focus = () => { void refresh(); };
    const visibility = () => { setVisible(!document.hidden); if (!document.hidden) void refresh(); };
    const route = () => { setOpen(false); setOnTasksPage(window.location.hash.split('?')[0] === '#/ai-tasks'); };
    const openFromToast = (event: Event) => {
      const path = (event as CustomEvent<{ path: string }>).detail.path;
      const query = path.split('?')[1] || '';
      const jobId = Number(new URLSearchParams(query).get('job')) || null;
      openTasks({ jobId: jobId || undefined, view: new URLSearchParams(query).get('view') === 'review' ? 'review' : 'list' });
    };
    window.addEventListener('mistakes:updated', update);
    window.addEventListener('focus', focus);
    window.addEventListener('hashchange', route);
    window.addEventListener('mistakes:open-ai-tasks', openFromToast);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted.current = false;
      window.removeEventListener('mistakes:updated', update);
      window.removeEventListener('focus', focus);
      window.removeEventListener('hashchange', route);
      window.removeEventListener('mistakes:open-ai-tasks', openFromToast);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [load, refresh, openTasks]);
  const active = jobs.filter(isActiveJob).length;
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => void load(), active ? 2000 : 15000);
    return () => clearInterval(timer);
  }, [active, visible, load]);
  useEffect(() => { if (open) void refresh(); }, [open, refresh]);

  useEffect(() => {
    if (updatedAt === null) return;
    const previous = feedbackSnapshot.current;
    feedbackSnapshot.current = new Map(jobs.map(({ id, status, applyStatus }) => [id, { status, applyStatus }]));
    if (!previous) return;

    let tone: FeedbackTone | null = null;
    for (const job of jobs) {
      const before = previous.get(job.id);
      if (job.mistakeDeleted || (before?.status === job.status && before.applyStatus === job.applyStatus)) continue;
      const next = job.status === 'failed' ? 'failed'
        : needsReview(job) ? 'review'
        : job.status === 'cancelled' ? 'cancelled' : 'active';
      if (tone === null || FEEDBACK_PRIORITY[next] > FEEDBACK_PRIORITY[tone]) tone = next;
    }
    if (tone !== null) {
      const nextTone = tone;
      setFeedback((current) => ({ revision: (current?.revision ?? 0) + 1, tone: nextTone }));
    }
  }, [jobs, updatedAt]);

  useEffect(() => {
    const updates: ActivityNotice[] = [];
    if (previous.current) {
      for (const job of jobs) {
        const before = previous.current.get(job.id);
        if (!before || before === job.status || job.mistakeDeleted) continue;
        if (job.status === 'succeeded') {
          const review = job.applyStatus !== 'applied';
          const path = `/ai-tasks?job=${job.id}${review ? '&view=review' : ''}`;
          updates.push({ id: String(job.id), path, status: 'completed', message: `记录 #${job.mistakeId} ${aiJobLabel(job)}完成${review ? '，待校对。' : '，已填入。'}` });
        }
        if (job.status === 'failed') {
          const path = `/ai-tasks?job=${job.id}`;
          updates.push({ id: String(job.id), path, status: 'failed', message: `记录 #${job.mistakeId} ${aiJobLabel(job)}失败，点击查看原因并重试。` });
        }
      }
    }
    previous.current = new Map(jobs.map((job) => [job.id, job.status]));
    if (!open && !onTasksPage) report(updates);
  }, [jobs, report, open, onTasksPage]);

  useEffect(() => {
    if (!loaded) return;
    for (const job of jobs) {
      if (!job.analysisRoute || job.mistakeDeleted) continue;
      const key = `${job.id}:${job.analysisRoute.at}`;
      if (routeNotices.current.has(key)) continue;
      routeNotices.current.add(key);
      if (!routesLoaded.current && !isActiveJob(job)) continue;
      const path = `/ai-tasks?job=${job.id}`;
      if (!open) toast.info(<a className="ai-toast-link" href={`#${path}`}><span>记录 #{job.mistakeId} 解析响应超时，已自动切换至升级模型 {job.analysisRoute.model}。</span><small>查看任务进度</small></a>, { ...toastDestination(path), toastId: `analysis-route-${key}` });
    }
    routesLoaded.current = true;
  }, [jobs, loaded, open]);

  const createJob = useCallback(async (request: AiJobRequest) => {
    try { const job = await api<AiJob>('/ai/jobs', json(request)); mergeJobs([job]); return job; }
    catch (err) { toast.error((err as Error).message); throw err; }
  }, [mergeJobs]);
  const applyJob = useCallback(async (id: number, options: AiApplyOptions = {}) => {
    try {
      const result = await api<AiApplyResult>(`/ai/jobs/${id}/apply`, json(options));
      mergeJobs([result.job]);
      if (!open) toast.success('AI 结果已填入。');
      return result;
    } catch (err) {
      const job = jobs.find((item) => item.id === id);
      const path = job ? `/mistakes/${job.mistakeId}/edit?aiJob=${id}` : '/ai-tasks';
      if (!open) toast.error(<a className="ai-toast-link" href={`#${path}`}><span>{(err as Error).message}</span><small>点击继续校对</small></a>, toastDestination(path));
      void refresh(); throw err;
    }
  }, [refresh, mergeJobs, jobs, open]);
  const actJobs = useCallback(async (ids: number[], action: JobAction) => {
    const targets = [...new Set(ids)].filter((id) => !busy.current.has(id));
    if (!targets.length) return { jobs: [], errors: [] };
    targets.forEach((id) => busy.current.add(id));
    setBusyIds(new Set(busy.current));
    try {
      const result = await api<BatchResult>('/ai/jobs/batch', json({ ids: targets, action }));
      mergeJobs(result.jobs);
      if (result.jobs.length && !open) toast.success(action === 'retry' ? `已将 ${result.jobs.length} 项任务重新加入队列。` : `已取消 ${result.jobs.length} 项任务。`);
      return result;
    } finally {
      targets.forEach((id) => busy.current.delete(id));
      if (mounted.current) { setBusyIds(new Set(busy.current)); void load(); }
    }
  }, [load, mergeJobs, open]);

  return <Context.Provider value={{ jobs, config, error, loaded, refreshing, updatedAt, feedback, busyIds, refresh, createJob, applyJob, actJobs, open, openTasks, registerEditor, editorSession, closeTasks: () => setOpen(false) }}>
    {children}
    <PageLoadBoundary><Suspense fallback={null}><AiQuickPanel key={request.revision} open={open} onOpenChange={setOpen} request={request} triggerRef={tasksTrigger} /></Suspense></PageLoadBoundary>
  </Context.Provider>;
}

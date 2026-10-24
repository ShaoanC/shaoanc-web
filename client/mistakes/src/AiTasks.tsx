import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, json } from './api';
import { useApp } from './context';
import { AiDialog } from './AiDialog';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import { PageLoadBoundary } from './PageLoadBoundary';
import { LoadingContent } from './motion';
import { toastDestination } from './toast-navigation';
import type { AiApplyOptions, AiApplyResult, AiConfig, AiJob, AiJobRequest } from './ai-types';
import './ai-tasks-dialog.css';

const AiTaskManager = lazy(() => import('./AiTaskManager').then((module) => ({ default: module.AiTaskManager })));

export const AI_LABELS = { question: '题干识别', answer: '答案识别', analysis: '生成解析' };
export const aiJobLabel = (job: AiJob) => job.mode === 'page-entry' ? '按页录题' : AI_LABELS[job.type];
export const isActiveJob = (job: AiJob) => ['queued', 'running', 'retrying'].includes(job.status);
export const needsReview = (job: AiJob) => !job.mistakeDeleted && job.status === 'succeeded' && job.applyStatus !== 'applied';
export const canCancelJob = (job: AiJob) => isActiveJob(job) || job.status === 'failed' || (job.status === 'succeeded' && job.applyStatus !== 'applied');
export type JobAction = 'retry' | 'cancel';
export interface BatchResult { jobs: AiJob[]; errors: { id: number; message: string }[] }
interface TasksState {
  jobs: AiJob[]; config: AiConfig | null; error: string; loaded: boolean; refreshing: boolean; updatedAt: number | null;
  busyIds: Set<number>;
  refresh: () => Promise<void>;
  createJob: (request: AiJobRequest) => Promise<AiJob>;
  applyJob: (id: number, options?: AiApplyOptions) => Promise<AiApplyResult>;
  actJobs: (ids: number[], action: JobAction) => Promise<BatchResult>;
  openTasks: () => void;
  closeTasks: () => void;
}
const Context = createContext<TasksState | null>(null);
export function useAiTasks() { const value = useContext(Context); if (!value) throw new Error('AI tasks context missing'); return value; }

export function AiTasksButton() {
  const { jobs, openTasks } = useAiTasks();
  const active = jobs.filter(isActiveJob).length;
  const attention = jobs.filter((job) => needsReview(job) || (!job.mistakeDeleted && job.status === 'failed')).length;
  const count = active || attention;
  return <button type="button" className="button ghost ai-tasks-trigger" onClick={openTasks} aria-label={`AI 任务${count ? `，${count} 项${active ? '处理中' : '待处理'}` : ''}`}><Sparkles size={17} /> AI 任务{count > 0 && <span className="count-pill">{count}</span>}</button>;
}

export function AiTasksProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [jobs, setJobs] = useState<AiJob[]>([]);
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [open, setOpen] = useState(false);
  const mobile = useMobileLayout();
  const tasksTrigger = useRef<HTMLElement | null>(null);
  const [onTasksPage, setOnTasksPage] = useState(window.location.hash.split('?')[0] === '#/ai-tasks');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [busyIds, setBusyIds] = useState(new Set<number>());
  const busy = useRef(new Set<number>());
  const [visible, setVisible] = useState(!document.hidden);
  const previous = useRef<Map<number, string> | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const requested = useRef(false);
  const configRequested = useRef(false);
  const revision = useRef(0);
  const mounted = useRef(true);
  const toastId = `ai-activity-${user.id}`;

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
    window.addEventListener('mistakes:updated', update);
    window.addEventListener('focus', focus);
    window.addEventListener('hashchange', route);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted.current = false;
      window.removeEventListener('mistakes:updated', update);
      window.removeEventListener('focus', focus);
      window.removeEventListener('hashchange', route);
      document.removeEventListener('visibilitychange', visibility);
      toast.dismiss(toastId);
    };
  }, [load, refresh, toastId]);
  const active = jobs.filter(isActiveJob).length;
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => void load(), active ? 2000 : 15000);
    return () => clearInterval(timer);
  }, [active, visible, load]);
  useEffect(() => { if (open) void refresh(); }, [open, refresh]);

  useEffect(() => {
    if (previous.current) {
      for (const job of jobs) {
        const before = previous.current.get(job.id);
        if (!before || before === job.status || job.mistakeDeleted) continue;
        if (job.status === 'succeeded') {
          const review = job.applyStatus !== 'applied';
          const path = review ? `/mistakes/${job.mistakeId}/edit?aiJob=${job.id}` : `/mistakes/${job.mistakeId}`;
          toast.success(<a className="ai-toast-link" href={`#${path}`}><span>记录 #{job.mistakeId} {aiJobLabel(job)}完成{review ? '，待校对。' : '，已填入。'}</span><small>{review ? '点击校对并填入' : '点击查看错题'}</small></a>, { autoClose: 8000, ...toastDestination(path) });
        }
        if (job.status === 'failed') {
          const path = `/ai-tasks?job=${job.id}`;
          toast.error(<a className="ai-toast-link" href={`#${path}`}><span>记录 #{job.mistakeId} {aiJobLabel(job)}失败。</span><small>点击查看原因并重试</small></a>, toastDestination(path));
        }
      }
    }
    previous.current = new Map(jobs.map((job) => [job.id, job.status]));
  }, [jobs]);
  useEffect(() => {
    if (!active || open || onTasksPage) { toast.dismiss(toastId); return; }
    const content = <a className="ai-toast-link" href="#/ai-tasks"><span>{active} 项 AI 操作正在处理</span><small>点击查看任务</small></a>;
    const options = { type: 'info' as const, autoClose: false as const, ...toastDestination('/ai-tasks') };
    if (toast.isActive(toastId)) toast.update(toastId, { render: content, ...options });
    else toast(content, { toastId, ...options });
  }, [active, open, onTasksPage, toastId]);

  const createJob = useCallback(async (request: AiJobRequest) => {
    try { const job = await api<AiJob>('/ai/jobs', json(request)); mergeJobs([job]); return job; }
    catch (err) { toast.error((err as Error).message); throw err; }
  }, [mergeJobs]);
  const applyJob = useCallback(async (id: number, options: AiApplyOptions = {}) => {
    try {
      const result = await api<AiApplyResult>(`/ai/jobs/${id}/apply`, json(options));
      mergeJobs([result.job]);
      toast.success('AI 结果已填入。');
      return result;
    } catch (err) {
      const job = jobs.find((item) => item.id === id);
      const path = job ? `/mistakes/${job.mistakeId}/edit?aiJob=${id}` : '/ai-tasks';
      toast.error(<a className="ai-toast-link" href={`#${path}`}><span>{(err as Error).message}</span><small>点击继续校对</small></a>, toastDestination(path));
      void refresh(); throw err;
    }
  }, [refresh, mergeJobs, jobs]);
  const actJobs = useCallback(async (ids: number[], action: JobAction) => {
    const targets = [...new Set(ids)].filter((id) => !busy.current.has(id));
    if (!targets.length) return { jobs: [], errors: [] };
    targets.forEach((id) => busy.current.add(id));
    setBusyIds(new Set(busy.current));
    try {
      const result = await api<BatchResult>('/ai/jobs/batch', json({ ids: targets, action }));
      mergeJobs(result.jobs);
      if (result.jobs.length) toast.success(action === 'retry' ? `已将 ${result.jobs.length} 项任务重新加入队列。` : `已取消 ${result.jobs.length} 项任务。`);
      return result;
    } finally {
      targets.forEach((id) => busy.current.delete(id));
      if (mounted.current) { setBusyIds(new Set(busy.current)); void load(); }
    }
  }, [load, mergeJobs]);

  return <Context.Provider value={{ jobs, config, error, loaded, refreshing, updatedAt, busyIds, refresh, createJob, applyJob, actJobs, openTasks: () => { tasksTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setOpen(true); }, closeTasks: () => setOpen(false) }}>
    {children}
    {mobile ? <MobileDrawer open={open} onOpenChange={setOpen} title="AI 任务" description="离开页面后任务会继续处理，结果保留在这里。" closeLabel="关闭 AI 任务" triggerRef={tasksTrigger} className="ai-tasks-mobile-drawer">
      {(portalContainer) => <PageLoadBoundary><Suspense fallback={<LoadingContent loading kind="rows">{null}</LoadingContent>}><AiTaskManager compact portalContainer={portalContainer} /></Suspense></PageLoadBoundary>}
    </MobileDrawer> : <AiDialog open={open} onClose={() => setOpen(false)} title="AI 任务" description="离开页面后任务会继续处理，结果保留在这里。" wide scrollBody className="ai-tasks-dialog" backdropClassName="ai-tasks-dialog-backdrop">
      <PageLoadBoundary><Suspense fallback={<LoadingContent loading kind="rows">{null}</LoadingContent>}><AiTaskManager compact /></Suspense></PageLoadBoundary>
    </AiDialog>}
  </Context.Provider>;
}

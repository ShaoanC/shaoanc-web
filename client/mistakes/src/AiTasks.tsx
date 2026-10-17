import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { api, json, formatDate } from './api';
import { useApp } from './context';
import { AiDialog } from './AiDialog';
import { MarkdownContent } from './MarkdownContent';
import type { AiApplyResult, AiConfig, AiJob, AiJobRequest } from './ai-types';

export const AI_LABELS = { question: '题干识别', answer: '答案识别', analysis: '生成解析' };
export const isActiveJob = (job: AiJob) => ['queued', 'running', 'retrying'].includes(job.status);
const STATUS = { queued: '排队中', running: '处理中', retrying: '等待重试', succeeded: '已完成', failed: '失败', cancelled: '已取消' };
interface TasksState {
  jobs: AiJob[]; config: AiConfig | null;
  refresh: () => Promise<void>;
  createJob: (request: AiJobRequest) => Promise<AiJob>;
  applyJob: (id: number, options?: { force?: boolean; mode?: 'replace' | 'append' }) => Promise<AiApplyResult>;
  openTasks: () => void;
}
const Context = createContext<TasksState | null>(null);
export function useAiTasks() { const value = useContext(Context); if (!value) throw new Error('AI tasks context missing'); return value; }

export function AiTasksButton() {
  const { jobs, openTasks } = useAiTasks();
  const count = jobs.filter(isActiveJob).length;
  return <button type="button" className="button ghost ai-tasks-trigger" onClick={openTasks}><Sparkles size={17} /> AI 任务{count > 0 && <span className="count-pill">{count}</span>}</button>;
}

export function AiTasksProvider({ children }: { children: ReactNode }) {
  const { user, notify } = useApp();
  const [jobs, setJobs] = useState<AiJob[]>([]);
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());
  const previous = useRef<Map<number, string> | null>(null);
  const signature = useRef('');
  const inFlight = useRef<Promise<void> | null>(null);
  const mounted = useRef(true);
  const toastId = `ai-activity-${user.id}`;

  const refresh = useCallback((): Promise<void> => {
    if (inFlight.current) return inFlight.current;
    const promise = Promise.all([api<AiJob[]>('/ai/jobs', {}, { background: true }), api<AiConfig>('/ai/config', {}, { background: true })])
      .then(([next, nextConfig]) => { if (mounted.current) { setJobs(next); setConfig(nextConfig); setError(''); } })
      .catch((err: Error) => { if (mounted.current) setError(err.message); })
      .finally(() => { inFlight.current = null; });
    inFlight.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const update = () => { void refresh(); };
    window.addEventListener('mistakes:updated', update);
    window.addEventListener('focus', update);
    return () => { mounted.current = false; window.removeEventListener('mistakes:updated', update); window.removeEventListener('focus', update); toast.dismiss(toastId); };
  }, [refresh, toastId]);
  const active = jobs.filter(isActiveJob).length;
  useEffect(() => { const timer = setInterval(() => void refresh(), active || open ? 2000 : 15000); return () => clearInterval(timer); }, [active, open, refresh]);
  useEffect(() => { if (!open) return; const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer); }, [open]);

  useEffect(() => {
    if (previous.current) {
      jobs.filter((job) => job.status === 'succeeded' && previous.current!.has(job.id) && previous.current!.get(job.id) !== 'succeeded')
        .forEach((job) => toast.success(`记录 #${job.mistakeId} ${AI_LABELS[job.type]}完成${job.applyStatus === 'applied' ? '，已填入。' : '，可打开编辑页查看。'}`, { autoClose: 8000 }));
    }
    previous.current = new Map(jobs.map((job) => [job.id, job.status]));
    const failed = jobs.filter((job) => job.status === 'failed');
    const nextSignature = jobs.filter((job) => isActiveJob(job) || job.status === 'failed').map((job) => `${job.id}:${job.status}:${job.attempts}`).join('|');
    if (nextSignature === signature.current) return;
    signature.current = nextSignature;
    if (!active && !failed.length) { toast.dismiss(toastId); return; }
    const content = <div className="ai-toast-copy"><span>{active ? `${active} 项 AI 操作正在处理` : `${failed.length} 项 AI 操作未完成`}{active && failed.length ? `，${failed.length} 项失败` : ''}</span><button type="button" onClick={() => setOpen(true)}>查看任务{failed.length ? ' / 重试' : ''}</button></div>;
    if (toast.isActive(toastId)) toast.update(toastId, { render: content, type: active ? 'info' : 'error', autoClose: false, isLoading: false });
    else toast(content, { toastId, type: active ? 'info' : 'error', autoClose: false });
  }, [jobs, active, toastId]);

  const createJob = useCallback(async (request: AiJobRequest) => {
    try { const job = await api<AiJob>('/ai/jobs', json(request)); setJobs((current) => [job, ...current.filter((item) => item.id !== job.id)]); return job; }
    catch (err) { toast.error((err as Error).message); throw err; }
  }, []);
  const applyJob = useCallback(async (id: number, options: { force?: boolean; mode?: 'replace' | 'append' } = {}) => {
    try {
      const result = await api<AiApplyResult>(`/ai/jobs/${id}/apply`, json(options));
      setJobs((current) => current.map((job) => job.id === id ? result.job : job));
      toast.success('AI 结果已填入。');
      return result;
    } catch (err) { toast.error((err as Error).message); void refresh(); throw err; }
  }, [refresh]);
  async function act(job: AiJob, action: 'retry' | 'cancel') {
    setBusy(job.id);
    try { await api(`/ai/jobs/${job.id}/${action}`, json({})); notify(action === 'retry' ? '已重新加入 AI 队列。' : '任务已取消。'); await refresh(); }
    catch (err) { notify((err as Error).message, 'error'); } finally { setBusy(null); }
  }
  const ordered = [...jobs].sort((a, b) => Number(isActiveJob(b)) - Number(isActiveJob(a)) || b.id - a.id);
  return <Context.Provider value={{ jobs, config, refresh, createJob, applyJob, openTasks: () => setOpen(true) }}>
    {children}
    <AiDialog open={open} onClose={() => setOpen(false)} title="AI 任务" description="上传完成后，离开页面也会继续处理。识别结果会保留在这里。">
      {error && <div className="inline-alert" role="alert">{error}<button onClick={() => void refresh()}>重新连接</button></div>}
      {!config?.configured && <p className="ai-notice">{user.role === 'admin' ? <a href="#/settings" onClick={() => setOpen(false)}>前往设置配置 AI 接口、密钥和多模态模型。</a> : '管理员尚未配置 AI，仍可手动录题和保存图片。'}</p>}
      {!ordered.length && <p className="ai-empty">还没有 AI 任务。在录入错题中上传图片，即可开始。</p>}
      <div className="ai-job-list">{ordered.map((job) => <article className={`ai-job ai-job-${job.status}`} key={job.id}>
        <div className="ai-job-heading"><strong>{AI_LABELS[job.type]}</strong><span>{isActiveJob(job) && <LoaderCircle size={14} className="spin" />}{STATUS[job.status]}</span></div>
        <div className="ai-job-meta"><a href={`#/mistakes/${job.mistakeId}/edit`} onClick={() => setOpen(false)}>记录 #{job.mistakeId}</a><span>{Math.max(0, Math.floor(((job.finishedAt ? Date.parse(job.finishedAt) : clock) - Date.parse(job.createdAt)) / 1000))} 秒</span><span>尝试 {job.attempts}/{job.maxAttempts}</span><span>{formatDate(job.createdAt, true)}</span></div>
        {job.status === 'retrying' && <p className="ai-notice">正在等待重试{job.nextAttemptAt ? `，预计 ${Math.max(0, Math.ceil((Date.parse(job.nextAttemptAt) - clock) / 1000))} 秒后继续` : ''}。</p>}
        {job.error && <p className="ai-job-error">{job.error}</p>}
        {job.result && <details><summary>{job.applyStatus === 'applied' ? '查看已填入的结果' : '预览待填入结果'}</summary><MarkdownContent>{job.result.question || job.result.answer || job.result.analysis || ''}</MarkdownContent>{job.result.primaryPath?.length ? <p className="ai-notice">知识点：{job.result.primaryPath.join(' / ')}</p> : null}</details>}
        <div className="ai-job-actions">{isActiveJob(job) ? <button className="table-button" disabled={busy === job.id} onClick={() => void act(job, 'cancel')}><X size={14} />取消</button> : ['failed', 'cancelled'].includes(job.status) && <button className="button secondary" disabled={busy === job.id} onClick={() => void act(job, 'retry')}><RotateCcw size={14} />重试</button>}<a className="text-link" href={`#/mistakes/${job.mistakeId}/edit`} onClick={() => setOpen(false)}>{job.status === 'failed' ? '补充后重新识别' : '打开编辑页'}</a></div>
      </article>)}</div>
    </AiDialog>
  </Context.Provider>;
}

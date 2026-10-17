import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileSearch, LoaderCircle, RefreshCw, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { formatDate } from './api';
import { useApp } from './context';
import { Checkbox, PageHeader } from './components';
import { MarkdownContent } from './MarkdownContent';
import { AI_LABELS, isActiveJob, needsReview, useAiTasks, type JobAction } from './AiTasks';
import type { AiJob, AiJobType } from './ai-types';

type Filter = 'all' | 'active' | 'review' | 'failed' | 'done' | 'cancelled';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' }, { id: 'active', label: '处理中' }, { id: 'review', label: '待校对' },
  { id: 'failed', label: '失败' }, { id: 'done', label: '已填入' }, { id: 'cancelled', label: '已取消' },
];
const STATUS = { queued: '排队中', running: '处理中', retrying: '等待重试', succeeded: '待校对', failed: '失败', cancelled: '已取消' };
const retryable = (job: AiJob) => !job.mistakeDeleted && ['failed', 'cancelled'].includes(job.status);
function matches(job: AiJob, filter: Filter) {
  if (filter === 'active') return isActiveJob(job);
  if (filter === 'review') return needsReview(job);
  if (filter === 'done') return job.status === 'succeeded' && job.applyStatus === 'applied';
  return filter === 'all' || job.status === filter;
}
function priority(job: AiJob) { return isActiveJob(job) ? 0 : needsReview(job) ? 1 : job.status === 'failed' ? 2 : 3; }
function duration(job: AiJob, clock: number) {
  if (!job.startedAt) return job.status === 'queued' ? '等待执行' : '尚未执行';
  const seconds = Math.max(0, Math.floor(((job.finishedAt ? Date.parse(job.finishedAt) : clock) - Date.parse(job.startedAt)) / 1000));
  return `本轮耗时 ${seconds < 60 ? `${seconds} 秒` : seconds < 3600 ? `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒` : `${Math.floor(seconds / 3600)} 小时 ${Math.floor(seconds % 3600 / 60)} 分`}`;
}
function excerpt(job: AiJob) {
  const source = job.input.question || job.result?.question || '';
  return source.replace(/!\[[^\]]*\]\([^)]*\)/g, '[配图]').replace(/[#*$`>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    || (job.imageIds.length ? `已上传 ${job.imageIds.length} 张图片，等待识别题目内容` : '等待补充题目内容');
}

export function AiTasksPage() {
  return <>
    <PageHeader eyebrow="识别、解析与校对" title="AI 任务管理" action={<a className="button primary" href="#/new"><Sparkles size={17} /> 录入错题</a>} />
    <p className="task-page-description">上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试。</p>
    <AiTaskManager />
  </>;
}

export function AiTaskManager({ compact = false }: { compact?: boolean }) {
  const { jobs, config, error, loaded, refreshing, updatedAt, busyIds, refresh, actJobs, closeTasks } = useAiTasks();
  const { user, subjects } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [type, setType] = useState<AiJobType | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [actionErrors, setActionErrors] = useState<{ id?: number; message: string }[]>([]);
  const [clock, setClock] = useState(Date.now());
  const activeCount = jobs.filter(isActiveJob).length;
  const available = Boolean(config?.enabled && config.configured);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    if (!activeCount) return;
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [activeCount]);

  const term = search.trim().toLocaleLowerCase();
  const matching = jobs.filter((job) => (!type || job.type === type) && (!term ||
    `${job.id} ${job.mistakeId} ${AI_LABELS[job.type]} ${job.input.question} ${job.error || ''}`.toLocaleLowerCase().includes(term.replace(/^#/, ''))));
  const filtered = matching.filter((job) => matches(job, filter)).sort((a, b) => priority(a) - priority(b) || b.id - a.id);
  const pageSize = compact ? 8 : 20;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const shown = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectable = shown.filter((job) => !busyIds.has(job.id) && (isActiveJob(job) || retryable(job)));
  const chosen = selectable.filter((job) => selected.includes(job.id));
  const retryIds = chosen.filter(retryable).map((job) => job.id);
  const cancelIds = chosen.filter(isActiveJob).map((job) => job.id);
  function resetSelection() { setPage(1); setSelected([]); }
  function clearFilters() { setFilter('all'); setType(''); setSearch(''); resetSelection(); }
  async function act(ids: number[], action: JobAction) {
    setActionErrors([]);
    try {
      const result = await actJobs(ids, action);
      setActionErrors(result.errors);
      setSelected((current) => current.filter((id) => !result.jobs.some((job) => job.id === id)));
    } catch (err) { setActionErrors([{ message: (err as Error).message }]); }
  }

  return <section className={`task-manager${compact ? ' task-manager-compact' : ''}`} aria-label="AI 任务列表">
    <div className="task-sync-bar"><span className={error ? 'task-sync-error' : ''}>{error ? updatedAt ? '连接异常，已保留上次结果' : '暂时无法连接' : !loaded ? '正在加载任务…' : activeCount ? `${activeCount} 项正在处理，自动更新中` : '任务状态自动更新'}{updatedAt && <small>更新于 {new Date(updatedAt).toLocaleTimeString('zh-CN', { hour12: false })}</small>}</span><div>{compact && <a className="text-link" href="#/ai-tasks" onClick={closeTasks}>打开管理页面</a>}<button type="button" className="button ghost" disabled={refreshing} onClick={() => void refresh()}><RefreshCw size={15} className={refreshing ? 'spin' : ''} />刷新</button></div></div>
    {error && <div className="inline-alert" role="alert">{error}<button type="button" disabled={refreshing} onClick={() => void refresh()}>重新连接</button></div>}
    {config && !available && <p className="task-service-notice">{user.role === 'admin' ? <a href="#/settings">AI 服务尚未启用或配置完整，前往设置。</a> : 'AI 服务暂不可用，请联系管理员。已有结果仍可查看和校对。'}</p>}
    <div className="task-filters" aria-label="按任务状态筛选">{FILTERS.map((item) => <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); resetSelection(); }}><span>{item.label}</span><strong>{loaded ? matching.filter((job) => matches(job, item.id)).length : '—'}</strong></button>)}</div>
    <div className="task-search-bar">
      <label className="task-search"><Search size={18} /><input type="search" aria-label="搜索 AI 任务" placeholder="搜索题目、任务编号、记录编号或失败原因" value={search} onChange={(event) => { setSearch(event.target.value); resetSelection(); }} /></label>
      <select aria-label="任务类型" value={type} onChange={(event) => { setType(event.target.value as AiJobType | ''); resetSelection(); }}><option value="">全部类型</option>{Object.entries(AI_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </div>
    {actionErrors.length > 0 && <div className="task-action-errors" role="alert"><div><strong>部分操作未完成</strong><button type="button" className="icon-button" aria-label="关闭操作提示" onClick={() => setActionErrors([])}><X size={16} /></button></div><ul>{actionErrors.map((item, index) => <li key={item.id ?? index}>{item.id ? `任务 #${item.id}：` : ''}{item.message}</li>)}</ul></div>}
    {loaded && shown.length > 0 && <div className="task-selection-bar"><label><Checkbox aria-label="选择本页可操作任务" checked={selectable.length > 0 && chosen.length === selectable.length} indeterminate={chosen.length > 0 && chosen.length < selectable.length} disabled={!selectable.length} onChange={(event) => setSelected(event.target.checked ? selectable.map((job) => job.id) : [])} />{chosen.length ? `已选 ${chosen.length} 项` : '选择本页可操作任务'}</label><div><button type="button" className="table-button" disabled={!retryIds.length || !available} onClick={() => void act(retryIds, 'retry')}><RotateCcw size={14} />重试{retryIds.length ? ` (${retryIds.length})` : ''}</button><button type="button" className="table-button" disabled={!cancelIds.length} onClick={() => void act(cancelIds, 'cancel')}><X size={14} />取消{cancelIds.length ? ` (${cancelIds.length})` : ''}</button></div></div>}
    {!loaded ? <div className="task-empty" role="status"><LoaderCircle size={26} className="spin" /><p>正在获取 AI 任务…</p></div> : !shown.length ? <div className="task-empty"><FileSearch size={32} /><h3>{error && !jobs.length ? '暂时无法加载任务' : jobs.length ? '没有符合条件的任务' : '从一张错题照片开始'}</h3><p>{error && !jobs.length ? '请重新连接后再试。' : jobs.length ? '换个关键词或筛选条件，继续查找。' : '上传题干或答案图片后，可以在这里跟进识别和解析。'}</p>{jobs.length ? <button type="button" className="button secondary" onClick={clearFilters}>清除筛选</button> : !error && <a className="button primary" href="#/new">录入错题</a>}</div> : <div className="task-rows">{shown.map((job) => {
      const busy = busyIds.has(job.id);
      const review = needsReview(job);
      const status = job.status === 'succeeded' ? job.applyStatus === 'applied' ? '已填入' : job.applyStatus === 'conflict' ? '内容有更新，待校对' : '待校对' : STATUS[job.status];
      const tone = job.status === 'failed' ? 'failed' : review ? 'review' : isActiveJob(job) ? 'active' : 'done';
      const link = job.mistakeDeleted ? '#/mistakes?trash=1' : `#/mistakes/${job.mistakeId}/edit`;
      return <article key={job.id} className={`task-row task-row-${tone}`}>
        <div className="task-row-heading"><div className="task-row-title"><Checkbox aria-label={`选择任务 #${job.id}`} checked={chosen.some((item) => item.id === job.id)} disabled={busy || !(isActiveJob(job) || retryable(job))} onChange={(event) => setSelected((current) => event.target.checked ? [...current, job.id] : current.filter((id) => id !== job.id))} /><h3>{AI_LABELS[job.type]}</h3><span className="task-id">#{job.id}</span></div><span className={`task-status task-status-${tone}`}>{isActiveJob(job) ? <LoaderCircle size={14} className={job.status === 'running' ? 'spin' : ''} /> : job.applyStatus === 'applied' ? <CheckCircle2 size={14} /> : null}{status}</span></div>
        <a className="task-excerpt" href={link}>{excerpt(job)}</a>
        <div className="task-meta"><a href={link}>记录 #{job.mistakeId}</a>{job.input.subjectId && <span>{subjects.find((subject) => subject.id === job.input.subjectId)?.name || job.input.subjectId}</span>}<span>{formatDate(job.createdAt, true)}</span><span><Clock3 size={13} />{duration(job, clock)}</span><span>尝试 {job.attempts}/{job.maxAttempts}</span>{job.imageIds.length > 0 && <span>{job.imageIds.length} 张图片</span>}</div>
        {job.mistakeDeleted ? <p className="task-row-notice">错题已移入回收站，恢复后可继续操作。</p> : job.applyStatus === 'conflict' && <p className="task-row-notice">题目内容已修改，AI 结果尚未覆盖现有内容。请打开编辑页核对。</p>}
        {job.status === 'retrying' && <p className="task-row-notice">{job.nextAttemptAt && Date.parse(job.nextAttemptAt) > clock ? `将在 ${Math.ceil((Date.parse(job.nextAttemptAt) - clock) / 1000)} 秒后自动重试，无需重复提交。` : '等待队列继续执行，无需重复提交。'}</p>}
        {job.error && <p className="task-row-error">{job.error}</p>}
        {job.result && <details className="task-result" open={expanded.includes(job.id)} onToggle={(event) => { const open = event.currentTarget.open; setExpanded((current) => open ? current.includes(job.id) ? current : [...current, job.id] : current.filter((id) => id !== job.id)); }}><summary>查看 AI 结果{job.result.issues?.length ? ` · ${job.result.issues.length} 项待确认` : ''}</summary>{expanded.includes(job.id) && <div><MarkdownContent>{job.result[job.type] || ''}</MarkdownContent>{job.result.primaryPath?.length ? <p>知识点：{job.result.primaryPath.join(' / ')}</p> : null}{job.result.issues?.map((issue, index) => <p className="task-row-notice" key={index}>{issue.description}</p>)}{job.result.figures?.length ? <p className="task-row-notice">包含 {job.result.figures.length} 个配图区域，请在编辑页校对。</p> : null}</div>}</details>}
        <div className="task-row-actions">{busy && <span role="status"><LoaderCircle size={14} className="spin" />正在提交…</span>}{isActiveJob(job) && <button type="button" className="table-button" disabled={busy} onClick={() => void act([job.id], 'cancel')}><X size={14} />取消任务</button>}{retryable(job) && <button type="button" className="button secondary" disabled={busy || !available} onClick={() => void act([job.id], 'retry')}><RotateCcw size={14} />重试</button>}<a className={review ? 'button primary' : 'text-link'} href={link}>{job.mistakeDeleted ? '前往回收站' : review ? '校对并填入' : job.status === 'failed' ? '修改题目' : '打开错题'}</a></div>
      </article>;
    })}</div>}
    <div className="task-pagination"><span>共 {filtered.length} 项{filter !== 'all' || type || search ? <button type="button" onClick={clearFilters}>清除筛选</button> : null}</span><div><button type="button" className="icon-button" aria-label="上一页" disabled={currentPage <= 1} onClick={() => { setPage(currentPage - 1); setSelected([]); }}><ChevronLeft size={18} /></button><span>{currentPage} / {pages}</span><button type="button" className="icon-button" aria-label="下一页" disabled={currentPage >= pages} onClick={() => { setPage(currentPage + 1); setSelected([]); }}><ChevronRight size={18} /></button></div></div>
    <p className="task-history-note">显示最近 200 项记录，以及更早仍在处理、失败或待校对的任务（不含回收站）。重试沿用提交时的内容；修改题目后请在编辑页重新发起。</p>
  </section>;
}

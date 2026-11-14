import { useEffect, useState } from 'react';
import { RefreshCw, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { useApp } from './context';
import { Checkbox, EmptyState, PageHeader } from './components';
import { useAiDialogContainer } from './AiDialog';
import { MarkdownContent } from './MarkdownContent';
import { LoadingContent, SlidingTabs } from './motion';
import { ScrollArea } from './ScrollArea';
import { Select } from './Select';
import { AI_LABELS, aiJobLabel, canCancelJob, canRetryJob, isActiveJob, needsReview, useAiTasks, type JobAction } from './AiTasks';
import { TaskActions, TaskCard, useTaskClock } from './AiTaskCard';
import type { AiJob, AiJobType } from './ai-types';
import './library-pagination.css';

type Filter = 'all' | 'active' | 'review' | 'failed' | 'done' | 'cancelled';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' }, { id: 'active', label: '处理中' }, { id: 'review', label: '待校对' },
  { id: 'failed', label: '失败' }, { id: 'done', label: '已填入' }, { id: 'cancelled', label: '已取消' },
];
function matches(job: AiJob, filter: Filter) {
  if (filter === 'active') return isActiveJob(job);
  if (filter === 'review') return needsReview(job);
  if (filter === 'done') return job.status === 'succeeded' && job.applyStatus === 'applied';
  return filter === 'all' || job.status === filter;
}
function priority(job: AiJob) { return isActiveJob(job) ? 0 : needsReview(job) ? 1 : job.status === 'failed' ? 2 : 3; }
const requestedJobId = () => Number(new URLSearchParams(window.location.hash.split('?')[1] || '').get('job')) || null;

export function AiTasksPage() {
  return <>
    <PageHeader eyebrow="识别、解析与校对" title="AI 任务管理" action={<a className="button primary" href="#/new"><Sparkles size={17} /> 录入错题</a>} />
    <p className="task-page-description">上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。</p>
    <AiTaskManager />
  </>;
}

export function AiTaskManager() {
  const portalContainer = useAiDialogContainer();
  const { jobs, config, error, loaded, refreshing, updatedAt, busyIds, refresh, actJobs } = useAiTasks();
  const { user } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [type, setType] = useState<AiJobType | 'page-entry' | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [actionErrors, setActionErrors] = useState<{ id?: number; message: string }[]>([]);
  const [targetJobId, setTargetJobId] = useState<number | null>(requestedJobId);
  const activeCount = jobs.filter(isActiveJob).length;
  const clock = useTaskClock(activeCount > 0);
  const generalAvailable = Boolean(config?.enabled && config.configured);
  const analysisAvailable = Boolean(config?.analysis?.enabled && config.analysis.configured);
  const available = generalAvailable || analysisAvailable;
  const serviceAvailable = (job: AiJob) => job.type === 'analysis' ? analysisAvailable : generalAvailable;
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const route = () => {
      setTargetJobId(requestedJobId()); setFilter('all'); setType(''); setSearch(''); setPage(1); setSelected([]);
    };
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, []);

  const term = search.trim().toLocaleLowerCase();
  const matching = jobs.filter((job) => (!targetJobId || job.id === targetJobId) && (!type || (type === 'page-entry' ? job.mode === 'page-entry' : job.type === type)) && (!term ||
    `${job.id} ${job.mistakeId} ${aiJobLabel(job)} ${job.input.question} ${job.result?.question || ''} ${job.result?.answer || ''} ${job.error || ''}`.toLocaleLowerCase().includes(term.replace(/^#/, ''))));
  const filtered = matching.filter((job) => matches(job, filter)).sort((a, b) => priority(a) - priority(b) || b.id - a.id);
  const pageSize = 20;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const shown = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectable = shown.filter((job) => !busyIds.has(job.id) && ((canCancelJob(job) && !job.mistakeDeleted) || canRetryJob(job)));
  const chosen = selectable.filter((job) => selected.includes(job.id));
  const retryIds = chosen.filter((job) => canRetryJob(job) && serviceAvailable(job)).map((job) => job.id);
  const cancelIds = chosen.filter((job) => canCancelJob(job) && !job.mistakeDeleted).map((job) => job.id);
  function resetSelection() { setPage(1); setSelected([]); }
  function clearFilters() { setTargetJobId(null); setFilter('all'); setType(''); setSearch(''); resetSelection(); }
  async function act(ids: number[], action: JobAction) {
    setActionErrors([]);
    try {
      const result = await actJobs(ids, action);
      setActionErrors(result.errors);
      setSelected((current) => current.filter((id) => !result.jobs.some((job) => job.id === id)));
    } catch (err) { setActionErrors([{ message: (err as Error).message }]); }
  }

  return <section className="task-manager" aria-label="AI 任务列表">
    <div className="task-sync-bar"><span className={error ? 'task-sync-error' : activeCount ? 'task-sync-live' : ''}>{error ? updatedAt ? '连接异常，已保留上次结果' : '暂时无法连接' : !loaded ? '正在加载任务…' : activeCount ? `${activeCount} 项正在处理，自动更新中` : '任务状态自动更新'}<small>{updatedAt ? `更新于 ${new Date(updatedAt).toLocaleTimeString('zh-CN', { hour12: false })}` : '正在同步任务状态'}</small></span><div><button type="button" className="button ghost" disabled={refreshing} onClick={() => void refresh()}><RefreshCw size={15} className={refreshing ? 'spin' : ''} />刷新</button></div></div>
    {error && <div className="inline-alert" role="alert">{error}<button type="button" disabled={refreshing} onClick={() => void refresh()}>重新连接</button></div>}
    {config && !available && <p className="task-service-notice">{user.role === 'admin' ? <a href="#/settings">AI 服务尚未启用或配置完整，前往设置。</a> : 'AI 服务暂不可用，请联系管理员。已有结果仍可查看和校对。'}</p>}
    {targetJobId && <p className="task-row-notice task-target-notice">已定位任务 #{targetJobId} <button type="button" className="table-button" onClick={clearFilters}>查看全部任务</button></p>}
    <SlidingTabs className="task-filters" ariaLabel="按任务状态筛选" value={filter} onChange={(value) => { setFilter(value as Filter); resetSelection(); }} tabs={FILTERS.map((item) => ({ id: item.id, label: <>{item.label}<span>{loaded ? matching.filter((job) => matches(job, item.id)).length : '—'}</span></> }))} />
    <div className="task-search-bar">
      <label className="search-input task-search"><Search size={18} /><input type="search" aria-label="搜索 AI 任务" placeholder="搜索题目、任务编号或失败原因" value={search} onChange={(event) => { setSearch(event.target.value); resetSelection(); }} /></label>
      <Select ariaLabel="任务类型" value={type} portalContainer={portalContainer} onChange={(value) => { setType(value as AiJobType | 'page-entry' | ''); resetSelection(); }} options={[{ value: '', label: '全部类型' }, { value: 'page-entry', label: '按页录题' }, ...Object.entries(AI_LABELS).map(([value, label]) => ({ value, label }))]} />
    </div>
    {actionErrors.length > 0 && <div className="task-action-errors" role="alert"><div><strong>部分操作未完成</strong><button type="button" className="icon-button" aria-label="关闭操作提示" onClick={() => setActionErrors([])}><X size={16} /></button></div><ul>{actionErrors.map((item, index) => <li key={item.id ?? index}>{item.id ? `任务 #${item.id}：` : ''}{item.message}</li>)}</ul></div>}

    <LoadingContent loading={!loaded} kind="tasks">
    {loaded && shown.length > 0 && <div className="task-selection-bar"><label><Checkbox aria-label="选择本页可操作任务" checked={selectable.length > 0 && chosen.length === selectable.length} indeterminate={chosen.length > 0 && chosen.length < selectable.length} disabled={!selectable.length} onChange={(event) => setSelected(event.target.checked ? selectable.map((job) => job.id) : [])} />{chosen.length ? `已选 ${chosen.length} 项` : '选择本页可操作任务'}</label><div><button type="button" className="table-button" disabled={!retryIds.length || !available} onClick={() => void act(retryIds, 'retry')}><RotateCcw size={14} />重试{retryIds.length ? ` (${retryIds.length})` : ''}</button><button type="button" className="table-button" disabled={!cancelIds.length} onClick={() => void act(cancelIds, 'cancel')}><X size={14} />取消{cancelIds.length ? ` (${cancelIds.length})` : ''}</button></div></div>}
    {!shown.length ? <EmptyState filtered={Boolean(jobs.length)} title={error && !jobs.length ? '暂时无法加载任务' : jobs.length ? '没有符合条件的任务' : '从一张错题照片开始'} description={error && !jobs.length ? '请重新连接后再试。' : jobs.length ? '换个关键词或筛选条件，继续查找。' : '上传题干或答案图片后，可以在这里跟进识别和解析。'} action={jobs.length ? <button type="button" className="button secondary" onClick={clearFilters}>清除筛选</button> : !error && <a className="button primary" href="#/new">录入错题</a>} /> : <div className="task-rows">{shown.map((job) => {
      const busy = busyIds.has(job.id);
      const selectableJob = selectable.some((item) => item.id === job.id);
      return <TaskCard key={job.id} job={job} clock={clock}
        selection={<Checkbox aria-label={`选择任务 #${job.id}`} checked={chosen.some((item) => item.id === job.id)} disabled={busy || !selectableJob} onChange={(event) => setSelected((current) => event.target.checked ? [...current, job.id] : current.filter((id) => id !== job.id))} />}
        actions={<TaskActions job={job} busy={busy} serviceAvailable={serviceAvailable(job)} onCancel={() => void act([job.id], 'cancel')} onRetry={() => void act([job.id], 'retry')} />}>
        {job.result && <details className="task-result" open={expanded.includes(job.id)} onToggle={(event) => { const open = event.currentTarget.open; setExpanded((current) => open ? current.includes(job.id) ? current : [...current, job.id] : current.filter((id) => id !== job.id)); }}><summary>查看 AI 结果{job.result.issues?.length ? ` · ${job.result.issues.length} 项待确认` : ''}</summary>{expanded.includes(job.id) && <ScrollArea className="task-result-content"><MarkdownContent>{job.result[job.type] || ''}</MarkdownContent>{job.mode === 'page-entry' && <><h4>正确答案</h4><MarkdownContent>{job.result.answer || '未识别到可用答案，请补充。'}</MarkdownContent></>}{job.result.primaryPath?.length ? <p>知识点：{job.result.primaryPath.join(' / ')}</p> : null}{job.result.issues?.map((issue, index) => <p className="task-row-notice" key={index}>{issue.description}</p>)}{job.result.figures?.length ? <p className="task-row-notice">包含 {job.result.figures.length} 个配图区域，请在编辑页校对。</p> : null}</ScrollArea>}</details>}
      </TaskCard>;
    })}</div>}</LoadingContent>
    <nav className="task-pagination" aria-label="AI 任务分页"><span>共 {filtered.length} 项{filter !== 'all' || type || search ? <button type="button" onClick={clearFilters}>清除筛选</button> : null}</span><div className="library-pagination"><button type="button" className="button secondary" disabled={currentPage <= 1} onClick={() => { setPage(currentPage - 1); setSelected([]); }}>上一页</button><span aria-live="polite">第 {currentPage} / {pages} 页</span><button type="button" className="button secondary" disabled={currentPage >= pages} onClick={() => { setPage(currentPage + 1); setSelected([]); }}>下一页</button></div></nav>
    <p className="task-history-note">显示最近 200 项记录，以及更早仍在处理、失败或待校对的任务（不含回收站）。重试沿用提交时的内容；修改题目后请在编辑页重新发起。</p>
  </section>;
}

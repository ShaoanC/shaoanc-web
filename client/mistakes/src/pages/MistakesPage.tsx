import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, LayoutGrid, List, Plus, Search, SlidersHorizontal, Target, Trash2, X } from 'lucide-react';
import { api } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { EmptyState, ErrorState, Modal, PageHeader } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { Select } from '../Select';
import { MistakeRow } from '../MistakeRow';
import type { Mistake, Stats } from '../types';

type LibraryTab = 'archived' | 'draft' | 'trash';
type ActionState = { id: number; mode: 'confirm' | 'swipe' } | null;
type BusyState = { id?: number; kind: 'delete' | 'restore' | 'permanent' | 'clear' } | null;

function currentTab(): LibraryTab {
  const query = new URLSearchParams(window.location.hash.split('?')[1]);
  return query.get('trash') === '1' ? 'trash' : query.get('lifecycle') === 'draft' ? 'draft' : 'archived';
}

export function MistakesPage() {
  const { subjects, knowledgePoints, notify } = useApp();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lifecycle, setLifecycle] = useState<LibraryTab>(currentTab);
  const [subjectId, setSubjectId] = useState('');
  const [knowledgePointId, setKnowledgePointId] = useState('');
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [action, setAction] = useState<ActionState>(null);
  const [busy, setBusy] = useState<BusyState>(null);
  const [permanentTarget, setPermanentTarget] = useState<Mistake | 'all' | null>(null);
  const requestVersion = useRef(0);
  const trashed = lifecycle === 'trash';

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(keyword), 250);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    const update = () => setLifecycle(currentTab());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const load = useCallback(async (showLoading = true) => {
    const version = ++requestVersion.current;
    if (showLoading) setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ lifecycle: lifecycle === 'trash' ? 'all' : lifecycle });
      if (lifecycle === 'trash') query.set('deleted', 'true');
      if (subjectId) query.set('subjectId', subjectId);
      if (knowledgePointId) query.set('knowledgePointId', knowledgePointId);
      if (status) query.set('status', status);
      if (search.trim()) query.set('keyword', search.trim());
      const [items, summary] = await Promise.all([api<Mistake[]>(`/mistakes?${query}`), api<Stats>('/stats')]);
      if (version !== requestVersion.current) return;
      setMistakes(items);
      setStats(summary);
    } catch (err) {
      if (version === requestVersion.current) setError((err as Error).message);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [lifecycle, subjectId, knowledgePointId, status, search]);
  const reload = useRef(load);
  useEffect(() => { reload.current = load; void load(); }, [load]);
  useEffect(() => { setAction(null); }, [lifecycle, subjectId, knowledgePointId, status, keyword, view]);

  useEffect(() => {
    if (!action) return;
    const outside = (event: PointerEvent) => {
      const row = (event.target as Element).closest('.mistake-row');
      if (row?.getAttribute('data-mistake-id') !== String(action.id)) setAction(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setAction(null); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [action]);

  function selectTab(value: string) {
    const tab = value as LibraryTab;
    setLifecycle(tab);
    window.history.replaceState(null, '', tab === 'trash' ? '#/mistakes?trash=1' : tab === 'draft' ? '#/mistakes?lifecycle=draft' : '#/mistakes');
  }

  async function moveOrRestore(mistake: Mistake, kind: 'delete' | 'restore') {
    if (busy) return;
    setBusy({ id: mistake.id, kind });
    try {
      await api(`/mistakes/${mistake.id}${kind === 'restore' ? '/restore' : ''}`, { method: kind === 'restore' ? 'POST' : 'DELETE' });
      setMistakes((items) => items.filter((item) => item.id !== mistake.id));
      setAction(null);
      notify(kind === 'restore' ? '错题及复习记录已恢复。' : '错题已移入回收站，30 天内可恢复。');
      await reload.current(false);
    } catch (err) { notify((err as Error).message, 'error'); }
    finally { setBusy(null); }
  }

  async function permanentlyDelete() {
    if (!permanentTarget || busy) return;
    const target = permanentTarget;
    setBusy(target === 'all' ? { kind: 'clear' } : { id: target.id, kind: 'permanent' });
    try {
      await api(target === 'all' ? '/mistakes/trash' : `/mistakes/${target.id}/permanent`, { method: 'DELETE' });
      setMistakes((items) => target === 'all' ? [] : items.filter((item) => item.id !== target.id));
      setPermanentTarget(null);
      notify(target === 'all' ? '回收站已清空。' : '错题及复习记录已彻底删除。');
      await reload.current(false);
    } catch (err) { notify((err as Error).message, 'error'); }
    finally { setBusy(null); }
  }

  const hasFilters = Boolean(subjectId || knowledgePointId || status || keyword.trim());
  const searching = Boolean(search.trim());
  const clearFilters = () => { setSubjectId(''); setKnowledgePointId(''); setStatus(''); setKeyword(''); setSearch(''); };
  const subjectKnowledge = knowledgePoints.filter((point) => !subjectId || point.subjectId === subjectId);
  const metrics = [
    { label: '已归档错题', value: stats?.archived, icon: BookOpen, tone: 'green' },
    { label: '待巩固', value: stats ? stats.byStatus.filter((item) => ['unknown', 'familiar'].includes(item.id)).reduce((sum, item) => sum + item.count, 0) : undefined, icon: Target, tone: 'amber' },
    { label: '已掌握', value: stats?.byStatus.find((item) => item.id === 'mastered')?.count ?? (stats ? 0 : undefined), icon: CheckCircle2, tone: 'green' },
  ];

  return <>
    <PageHeader eyebrow="收集问题，积累答案" title="我的错题" action={<a className="button primary" href="#/new"><Plus size={18} /> 录入错题</a>} />
    <LoadingContent loading={!stats && loading} kind="summary"><div className="metrics-grid library-metrics">{metrics.map(({ label, value, icon: Icon, tone }) => <div className="metric-card" key={label}><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={19} /></span></div><div className="metric-value">{value ?? <span className="text-muted">—</span>}<span>道</span></div></div>)}</div></LoadingContent>
    <div className="library-panel">
      <div className="library-heading"><SlidingTabs value={lifecycle} onChange={selectTab} ariaLabel="错题状态" tabs={[
        { id: 'archived', label: <>已归档<span>{stats?.archived ?? '—'}</span></> },
        { id: 'draft', label: <>草稿箱<span>{stats?.drafts ?? '—'}</span></> },
        { id: 'trash', label: <>回收站<span>{stats?.trashCount ?? '—'}</span></> },
      ]} /></div>
      {trashed && <div className="trash-notice"><p>删除的错题保留 30 天，恢复时会保留原内容和复习记录。</p><button className="button ghost danger-text" disabled={Boolean(busy) || !stats?.trashCount} onClick={() => setPermanentTarget('all')}><Trash2 size={16} />清空回收站</button></div>}
      <div className="filter-bar">
        <label className="search-input"><Search size={18} /><input aria-label="搜索错题" placeholder="搜索错题内容、学科或知识点" value={keyword} onChange={(event) => setKeyword(event.target.value)} />{keyword && <button className="icon-button" aria-label="清除搜索" onClick={() => setKeyword('')}><X size={15} /></button>}</label>
        <Select ariaLabel="按学科筛选" value={subjectId} onChange={(value) => { setSubjectId(value); setKnowledgePointId(''); }} options={[{ value: '', label: '全部学科' }, ...subjects.map((subject) => ({ value: subject.id, label: subject.name }))]} />
        <Select ariaLabel="按知识点筛选" value={knowledgePointId} onChange={setKnowledgePointId} searchable options={[{ value: '', label: '全部知识点' }, ...subjectKnowledge.map((point) => ({ value: String(point.id), label: knowledgeLabel(knowledgePoints, point.id) }))]} />
        <Select ariaLabel="按掌握程度筛选" value={status} onChange={setStatus} options={[{ value: '', label: '全部掌握程度' }, { value: 'unreviewed', label: '未复习' }, { value: 'unknown', label: '不会' }, { value: 'familiar', label: '不熟' }, { value: 'mastered', label: '掌握' }]} />
      </div>
      <div className="results-toolbar"><span><SlidersHorizontal size={14} /> {searching ? '搜索结果' : hasFilters ? '筛选结果' : trashed ? '暂存的错题' : lifecycle === 'draft' ? '继续完善你的草稿' : '你的学习积累'}<strong>{loading ? '…' : mistakes.length}</strong> 道{hasFilters && <button className="reset-filter" onClick={clearFilters}>清除筛选</button>}</span><div className="view-switch" aria-label="展示方式"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="列表视图" aria-pressed={view === 'list'}><List size={17} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="卡片视图" aria-pressed={view === 'grid'}><LayoutGrid size={16} /></button></div></div>
      <LoadingContent loading={loading} kind="rows">{error ? <ErrorState message={error} retry={() => void load()} /> : mistakes.length === 0 ? <EmptyState filtered={hasFilters}
        title={searching ? '没有找到相关错题' : hasFilters ? '没有找到符合条件的错题' : trashed ? '回收站是空的' : lifecycle === 'draft' ? '草稿箱还是空的' : '你的第一道错题，从这里开始'}
        description={hasFilters ? '试试其他关键词，或调整筛选条件。' : trashed ? '删除的错题会在这里保留 30 天。' : lifecycle === 'draft' ? '录入时可以先存为草稿，之后再慢慢完善。' : undefined}
        action={hasFilters ? <button className="button secondary" onClick={clearFilters}>清除筛选</button> : trashed ? undefined : <a className="button primary" href="#/new"><Plus size={17} /> 录入第一道错题</a>} /> : <div className={`mistakes-collection ${view === 'grid' ? 'card-grid' : ''} ${trashed ? 'trash-collection' : ''}`}>
          {view === 'list' && <div className="list-column-head"><span>题目与知识点</span><span>掌握程度</span><span>{trashed ? '删除时间' : '最近整理'}</span><span>操作</span></div>}
          {mistakes.map((mistake) => <MistakeRow key={mistake.id} mistake={mistake} grid={view === 'grid'}
            opened={action?.id === mistake.id && action.mode === 'swipe'} armed={action?.id === mistake.id && action.mode === 'confirm'}
            disabled={Boolean(busy)} deleting={busy?.id === mistake.id && busy.kind === 'delete'} restoring={busy?.id === mistake.id && busy.kind === 'restore'}
            onOpenChange={(open) => setAction(open ? { id: mistake.id, mode: 'swipe' } : null)} onArmedChange={(armed) => setAction(armed ? { id: mistake.id, mode: 'confirm' } : null)}
            onDelete={() => void moveOrRestore(mistake, 'delete')} onRestore={() => void moveOrRestore(mistake, 'restore')} onPermanentDelete={() => setPermanentTarget(mistake)} />)}
        </div>}</LoadingContent>
    </div>
    {!trashed && <div className="study-tip"><span><Target size={19} /></span><p><strong>温故而知新，可以为师矣</strong></p><a href="#/review">开始一次复习<ArrowRight size={15} /></a></div>}
    {permanentTarget && <Modal title={permanentTarget === 'all' ? '清空回收站？' : '彻底删除这道错题？'} onClose={() => { if (!busy) setPermanentTarget(null); }}>
      <p className="modal-description">{permanentTarget === 'all' ? `将彻底删除回收站中的全部 ${stats?.trashCount ?? 0} 道错题及复习记录，包括当前筛选未显示的题目。` : '这道错题及对应的复习记录将被彻底删除。'}此操作无法恢复。</p>
      <div className="modal-actions"><button className="button secondary" disabled={Boolean(busy)} onClick={() => setPermanentTarget(null)}>取消</button><button className="button danger" disabled={Boolean(busy)} onClick={() => void permanentlyDelete()}>{busy ? '正在删除…' : permanentTarget === 'all' ? '清空回收站' : '彻底删除'}</button></div>
    </Modal>}
  </>;
}

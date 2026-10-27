import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, ArrowRight, BookOpen, CheckCircle2, Download, LayoutGrid, List, ListChecks, LoaderCircle, Plus, Search, SlidersHorizontal, Target, Trash2, X } from 'lucide-react';
import { api, json } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { Checkbox, EmptyState, ErrorState, Modal, PageHeader } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { Select } from '../Select';
import { MobileFiltersDrawer } from '../MobileFiltersDrawer';
import { MistakeRow } from '../MistakeRow';
import { MistakeExport } from '../MistakeExport';
import { RATING_OPTIONS, StarRatingPicker } from '../StarRating';
import { isLibraryPath } from '../LibraryLocation';
import type { Mistake, MistakePage, Stats } from '../types';
import '../export-selection.css';
import '../library-pagination.css';

type LibraryTab = 'archived' | 'draft' | 'trash';
type ActionState = { id: number; mode: 'confirm' | 'swipe' | 'rating' } | null;
type BusyState = { id?: number; kind: 'delete' | 'restore' | 'permanent' | 'clear' | 'rating' | 'archive' } | null;
type LibraryFilters = { subjectId: string; knowledgePointId: string; status: string; rating: string };
const EMPTY_FILTERS: LibraryFilters = { subjectId: '', knowledgePointId: '', status: '', rating: '' };

function LibraryFilterFields({ filters, onChange, portalContainer, withLabels = false }: {
  filters: LibraryFilters;
  onChange: (filters: LibraryFilters) => void;
  portalContainer?: HTMLElement | null;
  withLabels?: boolean;
}) {
  const { subjects, knowledgePoints } = useApp();
  const subjectKnowledge = knowledgePoints.filter((point) => !filters.subjectId || point.subjectId === filters.subjectId);
  const fields = [
    { key: 'subjectId' as const, label: '学科', options: [{ value: '', label: '全部学科' }, ...subjects.map((subject) => ({ value: subject.id, label: subject.name }))] },
    { key: 'knowledgePointId' as const, label: '知识点', searchable: true, options: [{ value: '', label: '全部知识点' }, ...subjectKnowledge.map((point) => ({ value: String(point.id), label: knowledgeLabel(knowledgePoints, point.id) }))] },
    { key: 'status' as const, label: '掌握程度', options: [{ value: '', label: '全部掌握程度' }, { value: 'unreviewed', label: '未复习' }, { value: 'unknown', label: '不会' }, { value: 'familiar', label: '不熟' }, { value: 'mastered', label: '掌握' }] },
    { key: 'rating' as const, label: '星级', options: RATING_OPTIONS },
  ];
  return <>{fields.map((field) => {
    const control = <Select key={field.key} ariaLabel={`按${field.label}筛选`} value={filters[field.key]} searchable={field.searchable} options={field.options} portalContainer={portalContainer}
      onChange={(value) => onChange({ ...filters, [field.key]: value, ...(field.key === 'subjectId' ? { knowledgePointId: '' } : {}) })} />;
    return withLabels ? <div key={field.key} className="field library-filter-field" data-base-ui-swipe-ignore=""><span>{field.label}</span>{control}</div> : control;
  })}</>;
}

function currentTab(): LibraryTab {
  const query = new URLSearchParams(window.location.hash.split('?')[1]);
  return query.get('trash') === '1' ? 'trash' : query.get('lifecycle') === 'draft' ? 'draft' : 'archived';
}

export function MistakesPage({ active = true }: { active?: boolean }) {
  const { notify } = useApp();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lifecycle, setLifecycle] = useState<LibraryTab>(currentTab);
  const [subjectId, setSubjectId] = useState('');
  const [knowledgePointId, setKnowledgePointId] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [ratingPreview, setRatingPreview] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<LibraryFilters>(EMPTY_FILTERS);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [pageState, setPageState] = useState({ filters: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const [action, setAction] = useState<ActionState>(null);
  const [busy, setBusy] = useState<BusyState>(null);
  const [permanentTarget, setPermanentTarget] = useState<Mistake | 'all' | null>(null);
  const requestVersion = useRef(0);
  const ratingFilter = useRef(rating);
  const ratingRemovalTimers = useRef(new Set<number>());
  ratingFilter.current = rating;
  const trashed = lifecycle === 'trash';
  const filtersQuery = useMemo(() => {
    const query = new URLSearchParams({ lifecycle: lifecycle === 'trash' ? 'all' : lifecycle });
    if (lifecycle === 'trash') query.set('deleted', 'true');
    if (subjectId) query.set('subjectId', subjectId);
    if (knowledgePointId) query.set('knowledgePointId', knowledgePointId);
    if (status) query.set('status', status);
    if (rating !== '') query.set('rating', rating);
    if (search.trim()) query.set('keyword', search.trim());
    return query.toString();
  }, [lifecycle, subjectId, knowledgePointId, status, rating, search]);
  const page = pageState.filters === filtersQuery ? pageState.page : 1;
  const pageCount = Math.max(1, Math.ceil(total / 24));
  const changePage = (next: number) => { setPageState({ filters: filtersQuery, page: next }); window.scrollTo(0, 0); };

  const clearRatingRemovalTimers = useCallback(() => {
    ratingRemovalTimers.current.forEach((timer) => window.clearTimeout(timer));
    ratingRemovalTimers.current.clear();
  }, []);
  useEffect(() => clearRatingRemovalTimers, [clearRatingRemovalTimers]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => { setFilterOpen(false); }, [mobile, lifecycle]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(keyword), 250);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    const update = () => { if (isLibraryPath(window.location.hash.slice(1))) setLifecycle(currentTab()); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const load = useCallback(async (showLoading = true) => {
    clearRatingRemovalTimers();
    const version = ++requestVersion.current;
    if (showLoading) setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(filtersQuery);
      query.set('page', String(page)); query.set('pageSize', '24'); query.set('summary', 'true');
      const [result, summary] = await Promise.all([api<MistakePage>(`/mistakes?${query}`), api<Stats>('/stats')]);
      if (version !== requestVersion.current) return;
      setMistakes(result.items);
      setTotal(result.total);
      if (result.page !== page) setPageState({ filters: filtersQuery, page: result.page });
      setStats(summary);
    } catch (err) {
      if (version === requestVersion.current) setError((err as Error).message);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [filtersQuery, page, clearRatingRemovalTimers]);
  const reload = useRef(load);
  useEffect(() => { reload.current = load; void load(); }, [load]);
  const wasActive = useRef(active);
  useEffect(() => {
    if (active && !wasActive.current) void reload.current(false);
    wasActive.current = active;
    if (!active) { setFilterOpen(false); setExportOpen(false); setAction(null); }
  }, [active]);
  useEffect(() => {
    const updated = () => { void reload.current(false); };
    window.addEventListener('mistakes:record-view-updated', updated);
    return () => window.removeEventListener('mistakes:record-view-updated', updated);
  }, []);
  useEffect(() => { setAction(null); }, [lifecycle, subjectId, knowledgePointId, status, rating, keyword, view]);
  useEffect(() => {
    setSelectedIds([]);
    setArchiveError('');
    setExportOpen(false);
    if (lifecycle === 'trash') setSelectionMode(false);
  }, [lifecycle, subjectId, knowledgePointId, status, rating, keyword, page]);

  useEffect(() => {
    if (!action) return;
    const outside = (event: PointerEvent) => {
      if (action.mode === 'rating' && (!mobile || busy?.kind === 'rating')) return;
      const row = (event.target as Element).closest('.mistake-row');
      if (row?.getAttribute('data-mistake-id') !== String(action.id)) setAction(null);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) setAction(null); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [action, mobile, busy]);

  function restoreRatingFocus(id: number) {
    if (!mobile) window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`.mistake-row[data-mistake-id="${id}"] .mistake-rating-trigger`)?.focus({ preventScroll: true });
    });
  }

  function openRating(mistake: Mistake, open: boolean) {
    if (busy) return;
    if (open) {
      setRatingPreview(mistake.rating);
      setRatingError('');
      setAction({ id: mistake.id, mode: 'rating' });
    } else {
      setAction(null);
      restoreRatingFocus(mistake.id);
    }
  }

  async function saveRating(mistake: Mistake, value: number) {
    if (busy) return;
    if (value === mistake.rating && !ratingError) { setAction(null); restoreRatingFocus(mistake.id); return; }
    setBusy({ id: mistake.id, kind: 'rating' });
    setRatingError('');
    try {
      const saved = await api<Mistake>(`/mistakes/${mistake.id}`, json({ rating: value }, 'PATCH'));
      const shouldRemove = ratingFilter.current !== '' && saved.rating !== Number(ratingFilter.current);
      setMistakes((items) => items.map((item) => item.id === saved.id ? { ...item, ...saved } : item)
        .filter((item) => item.id !== saved.id || !shouldRemove || mobile));
      setAction(null);
      if (mobile && shouldRemove) {
        const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 220;
        const timer = window.setTimeout(() => {
          ratingRemovalTimers.current.delete(timer);
          if (ratingFilter.current !== '' && saved.rating !== Number(ratingFilter.current)) {
            setMistakes((items) => items.filter((item) => item.id !== saved.id || item.rating !== saved.rating));
            void reload.current(false);
          }
        }, duration);
        ratingRemovalTimers.current.add(timer);
      }
      restoreRatingFocus(mistake.id);
      if (shouldRemove && !mobile) void reload.current(false);
      notify(value ? `已标记为 ${value} 星。` : '星级标记已清除。');
    } catch (err) { setRatingError((err as Error).message); }
    finally { setBusy(null); }
  }

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

  async function archiveSelected() {
    if (busy || exportDisabled || lifecycle !== 'draft' || !selectedIds.length) return;
    const ids = selectedIds.filter((id) => mistakes.some((item) => item.id === id));
    setBusy({ kind: 'archive' });
    setArchiveError('');
    const archivedIds = new Set<number>();
    let failure = '';
    try {
      for (const id of ids) {
        try {
          await api(`/mistakes/${id}`, json({ lifecycle: 'archived' }, 'PATCH'));
          archivedIds.add(id);
        } catch (err) { failure = (err as Error).message; }
      }
      setSelectedIds((current) => current.filter((id) => !archivedIds.has(id)));
      if (archivedIds.size) notify(`已归档 ${archivedIds.size} 道错题。`);
      if (failure) {
        const message = `${ids.length - archivedIds.size} 道未归档：${failure}。未成功的题目已保留选择，可完善后重试。`;
        setArchiveError(message);
        notify(message, 'error');
      }
      await reload.current(false);
    } finally { setBusy(null); }
  }

  const hasFilters = Boolean(subjectId || knowledgePointId || status || rating !== '' || keyword.trim());
  const searching = Boolean(search.trim());
  const exportDisabled = trashed || loading || Boolean(error) || Boolean(busy) || keyword !== search || mistakes.length === 0;
  const allSelected = mistakes.length > 0 && selectedIds.length === mistakes.length;
  const startSelection = () => { setAction(null); setSelectionMode(true); };
  const exitSelection = () => { setSelectionMode(false); setSelectedIds([]); };
  const toggleSelection = (id: number) => setSelectedIds((selected) => selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  const appliedFilters = { subjectId, knowledgePointId, status, rating };
  const filterCount = Object.values(appliedFilters).filter((value) => value !== '').length;
  const updateFilters = (filters: LibraryFilters) => { setSubjectId(filters.subjectId); setKnowledgePointId(filters.knowledgePointId); setStatus(filters.status); setRating(filters.rating); };
  const clearFilters = () => { updateFilters(EMPTY_FILTERS); setKeyword(''); setSearch(''); };
  const openFilters = () => { setDraftFilters(appliedFilters); setAction(null); setFilterOpen(true); };
  const applyFilters = () => { updateFilters(draftFilters); setFilterOpen(false); };
  const ratingTarget = action?.mode === 'rating' ? mistakes.find((item) => item.id === action.id) : undefined;
  const metrics = [
    { label: '已归档错题', value: stats?.archived, icon: BookOpen, tone: 'green' },
    { label: '待巩固', value: stats ? stats.byStatus.filter((item) => ['unknown', 'familiar'].includes(item.id)).reduce((sum, item) => sum + item.count, 0) : undefined, icon: Target, tone: 'amber' },
    { label: '已掌握', value: stats?.byStatus.find((item) => item.id === 'mastered')?.count ?? (stats ? 0 : undefined), icon: CheckCircle2, tone: 'green' },
  ];

  return <>
    <PageHeader eyebrow="收集问题，积累答案" title="我的错题" action={<div className="library-header-actions">{!trashed && <button className="button secondary" disabled={exportDisabled} onClick={() => { setAction(null); setExportOpen(true); }}><Download size={17} />导出</button>}<a className="button primary" href="#/new"><Plus size={18} /> 录入错题</a></div>} />
    <LoadingContent loading={!stats && loading} kind="summary"><div className="metrics-grid library-metrics">{metrics.map(({ label, value, icon: Icon, tone }) => <div className="metric-card" key={label}><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={19} /></span></div><div className="metric-value">{value ?? <span className="text-muted">—</span>}<span>道</span></div></div>)}</div></LoadingContent>
    <div className="library-panel">
      <div className="library-heading"><SlidingTabs value={lifecycle} onChange={selectTab} ariaLabel="错题状态" tabs={[
        { id: 'archived', label: <>已归档<span>{stats?.archived ?? '—'}</span></> },
        { id: 'draft', label: <>草稿箱<span>{stats?.drafts ?? '—'}</span></> },
        { id: 'trash', label: <>回收站<span>{stats?.trashCount ?? '—'}</span></> },
      ]} /></div>
      {trashed && <div className="trash-notice"><p>删除的错题保留 30 天，恢复时会保留原内容和复习记录。</p><button className="button ghost danger-text" disabled={Boolean(busy) || !stats?.trashCount} onClick={() => setPermanentTarget('all')}><Trash2 size={16} />清空回收站</button></div>}
      <div className={`filter-bar ${mobile ? 'library-mobile-filters' : 'has-rating-filter'}`}>
        <label className="search-input"><Search size={18} /><input aria-label="搜索错题" placeholder={mobile ? '搜索错题' : '搜索错题内容、学科或知识点'} value={keyword} onChange={(event) => setKeyword(event.target.value)} />{keyword && <button className="icon-button" aria-label="清除搜索" onClick={() => setKeyword('')}><X size={15} /></button>}</label>
        {mobile ? <button ref={filterTrigger} type="button" className="library-filter-trigger" data-active={filterCount > 0} aria-haspopup="dialog" aria-expanded={filterOpen} aria-label={`筛选错题${filterCount ? `，已选 ${filterCount} 项条件` : ''}`} onClick={openFilters}><SlidersHorizontal size={17} /><span>筛选</span>{filterCount > 0 && <span className="library-filter-count">{filterCount}</span>}</button> : <LibraryFilterFields filters={appliedFilters} onChange={updateFilters} />}
      </div>
      <div className="results-toolbar"><span><SlidersHorizontal size={14} /> {searching ? '搜索结果' : hasFilters ? '筛选结果' : trashed ? '暂存的错题' : lifecycle === 'draft' ? '继续完善你的草稿' : '你的学习积累'}<strong>{loading ? '…' : total}</strong> 道{hasFilters && <button className="reset-filter" onClick={clearFilters}>清除筛选</button>}</span><div className="library-toolbar-actions">{!trashed && !selectionMode && <button className="library-select-trigger" disabled={exportDisabled} onClick={startSelection}><ListChecks size={16} />选择题目</button>}<div className="view-switch" aria-label="展示方式"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="列表视图" aria-pressed={view === 'list'}><List size={17} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="卡片视图" aria-pressed={view === 'grid'}><LayoutGrid size={16} /></button></div></div></div>
      {!trashed && selectionMode && <div className="library-selection-toolbar" aria-label="批量选择题目">
        <label className="library-select-all"><Checkbox checked={allSelected} indeterminate={selectedIds.length > 0 && !allSelected} disabled={exportDisabled} onChange={() => setSelectedIds(allSelected ? [] : mistakes.map((mistake) => mistake.id))} /><span>全选本页</span></label>
        <span className="library-selection-count" role="status">已选 <strong>{selectedIds.length}</strong> 道</span>
        <div className="library-selection-actions"><button disabled={!selectedIds.length || Boolean(busy)} onClick={() => setSelectedIds([])}>清空</button><button disabled={Boolean(busy)} onClick={exitSelection}>退出选择</button></div>
        {lifecycle === 'draft' && <div className="library-archive-dock">
          {mobile && <span>已选 <strong>{selectedIds.length}</strong> 道</span>}
          <button className="button primary" disabled={exportDisabled || !selectedIds.length} onClick={() => void archiveSelected()}>
            {busy?.kind === 'archive' ? <LoaderCircle size={17} className="spin" /> : <Archive size={17} />}
            {busy?.kind === 'archive' ? '正在归档…' : `归档所选${selectedIds.length ? `（${selectedIds.length}）` : ''}`}
          </button>
        </div>}
      </div>}
      {lifecycle === 'draft' && archiveError && <p className="library-archive-error" role="alert">{archiveError}</p>}
      <LoadingContent loading={loading} kind="rows">{error ? <ErrorState message={error} retry={() => void load()} /> : mistakes.length === 0 ? <EmptyState filtered={hasFilters}
        title={searching ? '没有找到相关错题' : hasFilters ? '没有找到符合条件的错题' : trashed ? '回收站是空的' : lifecycle === 'draft' ? '草稿箱还是空的' : '你的第一道错题，从这里开始'}
        description={hasFilters ? '试试其他关键词，或调整筛选条件。' : trashed ? '删除的错题会在这里保留 30 天。' : lifecycle === 'draft' ? '录入时可以先存为草稿，之后再慢慢完善。' : undefined}
        action={hasFilters ? <button className="button secondary" onClick={clearFilters}>清除筛选</button> : trashed ? undefined : <a className="button primary" href="#/new"><Plus size={17} /> 录入第一道错题</a>} /> : <div className={`mistakes-collection ${view === 'grid' ? 'card-grid' : ''} ${trashed ? 'trash-collection' : ''}`}>
          {view === 'list' && <div className="list-column-head"><span>题目与知识点</span><span>掌握程度</span><span>{trashed ? '删除时间' : '最近整理'}</span><span>{selectionMode && !trashed ? '选择状态' : '操作'}</span></div>}
          {mistakes.map((mistake) => <MistakeRow key={mistake.id} mistake={mistake} grid={view === 'grid'}
            opened={action?.id === mistake.id && action.mode === 'swipe'} armed={action?.id === mistake.id && action.mode === 'confirm'}
            disabled={Boolean(busy) || (selectionMode && exportDisabled)} deleting={busy?.id === mistake.id && busy.kind === 'delete'} restoring={busy?.id === mistake.id && busy.kind === 'restore'}
            selectionMode={selectionMode && !trashed} selected={selectedIds.includes(mistake.id)} onSelectedChange={() => toggleSelection(mistake.id)}
            ratingOpen={mobile && action?.id === mistake.id && action.mode === 'rating'} ratingSaving={busy?.id === mistake.id && busy.kind === 'rating'} ratingError={action?.id === mistake.id ? ratingError : ''}
            onRatingOpenChange={(open) => openRating(mistake, open)} onRatingChange={(value) => void saveRating(mistake, value)}
            onOpenChange={(open) => setAction(open ? { id: mistake.id, mode: 'swipe' } : null)} onArmedChange={(armed) => setAction(armed ? { id: mistake.id, mode: 'confirm' } : null)}
            onDelete={() => void moveOrRestore(mistake, 'delete')} onRestore={() => void moveOrRestore(mistake, 'restore')} onPermanentDelete={() => setPermanentTarget(mistake)} />)}
        </div>}</LoadingContent>
      {total > 24 && !error && <nav className="library-pagination" aria-label="错题分页"><button className="button secondary" disabled={loading || page <= 1} onClick={() => changePage(page - 1)}>上一页</button><span aria-live="polite">第 {page} / {pageCount} 页</span><button className="button secondary" disabled={loading || page >= pageCount} onClick={() => changePage(page + 1)}>下一页</button></nav>}
    </div>
    {mobile && lifecycle === 'draft' && selectionMode && <div className="library-archive-spacer" aria-hidden="true" />}
    {mobile && <MobileFiltersDrawer open={filterOpen} onOpenChange={(open) => open ? openFilters() : setFilterOpen(false)} onApply={applyFilters} onReset={() => setDraftFilters(EMPTY_FILTERS)} triggerRef={filterTrigger}>
      {(portalContainer) => <LibraryFilterFields filters={draftFilters} onChange={setDraftFilters} portalContainer={portalContainer} withLabels />}
    </MobileFiltersDrawer>}
    {!trashed && <div className="study-tip"><span><Target size={19} /></span><p><strong>温故而知新，可以为师矣</strong></p><a href="#/review">开始一次复习<ArrowRight size={15} /></a></div>}
    {exportOpen && !trashed && <MistakeExport mistakes={mistakes} selectedIds={selectedIds} totalCount={total} filters={Object.fromEntries(new URLSearchParams(filtersQuery))} onClose={() => setExportOpen(false)} />}
    {!mobile && ratingTarget && <Modal title="设置星级" onClose={() => openRating(ratingTarget, false)}><StarRatingPicker value={ratingPreview} onChange={setRatingPreview} onCommit={(value) => void saveRating(ratingTarget, value)} disabled={busy?.kind === 'rating'} error={ratingError} onClose={() => openRating(ratingTarget, false)} autoFocus /></Modal>}
    {permanentTarget && <Modal title={permanentTarget === 'all' ? '清空回收站？' : '彻底删除这道错题？'} onClose={() => { if (!busy) setPermanentTarget(null); }}>
      <p className="modal-description">{permanentTarget === 'all' ? `将彻底删除回收站中的全部 ${stats?.trashCount ?? 0} 道错题及复习记录，包括当前筛选未显示的题目。` : '这道错题及对应的复习记录将被彻底删除。'}此操作无法恢复。</p>
      <div className="modal-actions"><button className="button secondary" disabled={Boolean(busy)} onClick={() => setPermanentTarget(null)}>取消</button><button className="button danger" disabled={Boolean(busy)} onClick={() => void permanentlyDelete()}>{busy ? '正在删除…' : permanentTarget === 'all' ? '清空回收站' : '彻底删除'}</button></div>
    </Modal>}
  </>;
}

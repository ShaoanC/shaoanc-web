import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, ArrowRight, BookOpen, CheckCircle2, Download, LayoutGrid, List, ListChecks, LoaderCircle, Plus, Search, SlidersHorizontal, Target, Trash2, X } from 'lucide-react';
import { api, json } from '../api';
import { useApp } from '../context';
import { Checkbox, EmptyState, ErrorState, Modal, PageHeader } from '../components';
import { LoadingContent, SlidingTabs } from '../motion';
import { MistakeFilterFields } from '../MistakeFilterFields';
import { EMPTY_FILTERS, mistakeFilterQuery, type MistakeFilters } from '../mistake-filters';
import { MobileFiltersDrawer } from '../MobileFiltersDrawer';
import { MistakeRow } from '../MistakeRow';
import { MistakeExport } from '../MistakeExport';
import { StarRatingPicker } from '../StarRating';
import { isLibraryPath } from '../LibraryLocation';
import type { Mistake, MistakePage, Stats } from '../types';
import '../export-selection.css';
import '../library-pagination.css';

type LibraryTab = 'archived' | 'draft' | 'trash';
type ActionState = { id: number; mode: 'confirm' | 'swipe' | 'rating' } | null;
type BusyState = { id?: number; kind: 'delete' | 'restore' | 'permanent' | 'clear' | 'rating' | 'archive' | 'select' } | null;
const LOAD_BATCH_SIZE = 32;
const LIBRARY_PAGE_SIZE = 128;
const BATCHES_PER_PAGE = LIBRARY_PAGE_SIZE / LOAD_BATCH_SIZE;

function batchQuery(filters: string, batch: number) {
  const query = new URLSearchParams(filters);
  query.set('page', String(batch));
  query.set('pageSize', String(LOAD_BATCH_SIZE));
  query.set('summary', 'true');
  return query;
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
  const [appliedFilters, updateFilters] = useState<MistakeFilters>(EMPTY_FILTERS);
  const { subjectId, knowledgePointId, status, rating } = appliedFilters;
  const [ratingPreview, setRatingPreview] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<MistakeFilters>(EMPTY_FILTERS);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [pageState, setPageState] = useState({ filters: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');
  const loadMoreTrigger = useRef<HTMLDivElement>(null);
  const loadedBatches = useRef({ scope: '', count: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const moreInFlight = useRef(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const selectionRequest = useRef<AbortController | null>(null);
  const [action, setAction] = useState<ActionState>(null);
  const [busy, setBusy] = useState<BusyState>(null);
  const [permanentTarget, setPermanentTarget] = useState<Mistake | 'all' | null>(null);
  const requestVersion = useRef(0);
  const ratingFilter = useRef(rating);
  const ratingRemovalTimers = useRef(new Set<number>());
  ratingFilter.current = rating;
  const trashed = lifecycle === 'trash';
  const filtersQuery = useMemo(() => {
    const query = mistakeFilterQuery(appliedFilters, { lifecycle: lifecycle === 'trash' ? 'all' : lifecycle });
    if (lifecycle === 'trash') query.set('deleted', 'true');
    if (search.trim()) query.set('keyword', search.trim());
    return query.toString();
  }, [lifecycle, appliedFilters, search]);
  const page = pageState.filters === filtersQuery ? pageState.page : 1;
  const scope = `${filtersQuery}&libraryPage=${page}`;
  const pageCount = Math.max(1, Math.ceil(total / LIBRARY_PAGE_SIZE));
  const hasMore = loadedBatches.current.scope === scope && loadedBatches.current.count < BATCHES_PER_PAGE
    && (page - 1) * LIBRARY_PAGE_SIZE + loadedBatches.current.count * LOAD_BATCH_SIZE < total;
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
    const retainedBatches = loadedBatches.current.scope === scope ? Math.max(1, loadedBatches.current.count) : 1;
    setRefreshing(true);
    moreInFlight.current = true;
    setLoadingMore(false);
    setMoreError('');
    if (showLoading) setLoading(true);
    setError('');
    try {
      const firstBatch = (page - 1) * BATCHES_PER_PAGE + 1;
      const query = batchQuery(filtersQuery, firstBatch);
      const [result, summary] = await Promise.all([api<MistakePage>(`/mistakes?${query}`), api<Stats>('/stats')]);
      if (version !== requestVersion.current) return;
      setTotal(result.total);
      setStats(summary);
      const actualPage = Math.ceil(result.page / BATCHES_PER_PAGE);
      if (actualPage !== page) {
        setPageState({ filters: filtersQuery, page: actualPage });
        return;
      }
      const batchCount = Math.min(retainedBatches, Math.max(1, Math.ceil(result.total / LOAD_BATCH_SIZE) - firstBatch + 1));
      const remaining = await Promise.all(Array.from({ length: batchCount - 1 }, (_, index) =>
        api<MistakePage>(`/mistakes?${batchQuery(filtersQuery, firstBatch + index + 1)}`)));
      if (version !== requestVersion.current) return;
      loadedBatches.current = { scope, count: batchCount };
      setMistakes([result, ...remaining].flatMap((batch) => batch.items));
    } catch (err) {
      if (version === requestVersion.current) setError((err as Error).message);
    } finally {
      if (version === requestVersion.current) { moreInFlight.current = false; setRefreshing(false); setLoading(false); }
    }
  }, [filtersQuery, page, scope, clearRatingRemovalTimers]);
  const reload = useRef(load);
  useEffect(() => {
    reload.current = load;
    void load();
    return () => { requestVersion.current += 1; };
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!active || loading || error || busy || !hasMore || refreshing || moreInFlight.current || keyword !== search) return;
    const version = requestVersion.current;
    const nextBatch = (page - 1) * BATCHES_PER_PAGE + loadedBatches.current.count + 1;
    moreInFlight.current = true;
    setLoadingMore(true);
    setMoreError('');
    try {
      const result = await api<MistakePage>(`/mistakes?${batchQuery(filtersQuery, nextBatch)}`);
      if (version !== requestVersion.current) return;
      if (result.page !== nextBatch) { void reload.current(false); return; }
      loadedBatches.current = { scope, count: loadedBatches.current.count + 1 };
      setMistakes((items) => {
        const existingIds = new Set(items.map((item) => item.id));
        return [...items, ...result.items.filter((item) => !existingIds.has(item.id))].slice(0, LIBRARY_PAGE_SIZE);
      });
      setTotal(result.total);
    } catch (err) {
      if (version === requestVersion.current) setMoreError((err as Error).message);
    } finally {
      if (version === requestVersion.current) { moreInFlight.current = false; setLoadingMore(false); }
    }
  }, [active, loading, refreshing, error, busy, hasMore, keyword, search, page, scope, filtersQuery]);

  useEffect(() => {
    const target = loadMoreTrigger.current;
    if (!target || !active || loading || refreshing || loadingMore || moreError || !hasMore || busy || filterOpen || exportOpen) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { rootMargin: '0px 0px 120px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [active, loading, refreshing, loadingMore, moreError, hasMore, busy, filterOpen, exportOpen, loadMore]);
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
  useEffect(() => { setSelectionMode(false); }, [lifecycle]);
  useEffect(() => { setAction(null); }, [lifecycle, subjectId, knowledgePointId, status, rating, keyword, view]);
  useEffect(() => {
    selectionRequest.current?.abort();
    setSelectedIds([]);
    setArchiveError('');
    setExportOpen(false);
    return () => { selectionRequest.current?.abort(); };
  }, [lifecycle, subjectId, knowledgePointId, status, rating, keyword]);
  useEffect(() => {
    if (lifecycle !== 'draft') setSelectedIds([]);
    setExportOpen(false);
  }, [lifecycle, page]);

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
      const shouldRemove = ratingFilter.current.length > 0 && !ratingFilter.current.includes(String(saved.rating));
      setMistakes((items) => items.map((item) => item.id === saved.id ? { ...item, ...saved } : item)
        .filter((item) => item.id !== saved.id || !shouldRemove || mobile));
      setAction(null);
      if (mobile && shouldRemove) {
        const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 220;
        const timer = window.setTimeout(() => {
          ratingRemovalTimers.current.delete(timer);
          if (ratingFilter.current.length > 0 && !ratingFilter.current.includes(String(saved.rating))) {
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
    const ids = [...selectedIds];
    setBusy({ kind: 'archive' });
    setArchiveError('');
    const archivedIds = new Set<number>();
    let failure = '';
    try {
      try {
        const failures = new Set<string>();
        for (let offset = 0; offset < ids.length; offset += 100) {
          const result = await api<{ archivedIds: number[]; failures: { id: number; message: string }[] }>('/mistakes/archive', json({ ids: ids.slice(offset, offset + 100) }));
          result.archivedIds.forEach((id) => archivedIds.add(id));
          result.failures.forEach((item) => failures.add(item.message));
        }
        failure = [...failures].join('；');
        setMistakes((items) => items.filter((item) => !archivedIds.has(item.id)));
      } catch (err) { failure = (err as Error).message; }
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

  async function selectAllDrafts() {
    if (exportDisabled || lifecycle !== 'draft') return;
    const controller = new AbortController();
    selectionRequest.current = controller;
    setBusy({ kind: 'select' });
    setArchiveError('');
    try {
      const result = await api<{ ids: number[] }>(`/mistakes/selection?${filtersQuery}`, { signal: controller.signal });
      if (!controller.signal.aborted) setSelectedIds(result.ids);
    } catch (err) {
      if (!controller.signal.aborted) notify((err as Error).message, 'error');
    } finally {
      if (selectionRequest.current === controller) {
        selectionRequest.current = null;
        setBusy(null);
      }
    }
  }

  const hasFilters = Boolean(subjectId.length || knowledgePointId.length || status.length || rating.length || keyword.trim());
  const searching = Boolean(search.trim());
  const exportDisabled = trashed || loading || Boolean(error) || Boolean(busy) || keyword !== search || mistakes.length === 0;
  const selectedIdSet = new Set(selectedIds);
  const allSelected = mistakes.length > 0 && mistakes.every((mistake) => selectedIdSet.has(mistake.id));
  const someSelected = mistakes.some((mistake) => selectedIdSet.has(mistake.id));
  const togglePageSelection = () => setSelectedIds((current) => allSelected
    ? current.filter((id) => !mistakes.some((mistake) => mistake.id === id))
    : [...new Set([...current, ...mistakes.map((mistake) => mistake.id)])]);
  const startSelection = () => { setAction(null); setSelectionMode(true); };
  const exitSelection = () => { setSelectionMode(false); setSelectedIds([]); };
  const toggleSelection = (id: number) => setSelectedIds((selected) => selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  const filterCount = Object.values(appliedFilters).filter((values) => values.length > 0).length;
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
        {mobile ? <button ref={filterTrigger} type="button" className="library-filter-trigger" data-active={filterCount > 0} aria-haspopup="dialog" aria-expanded={filterOpen} aria-label={`筛选错题${filterCount ? `，已选 ${filterCount} 项条件` : ''}`} onClick={openFilters}><SlidersHorizontal size={17} /><span>筛选</span>{filterCount > 0 && <span className="library-filter-count">{filterCount}</span>}</button> : <MistakeFilterFields filters={appliedFilters} onChange={updateFilters} />}
      </div>
      <div className="results-toolbar"><span><SlidersHorizontal size={14} /> {searching ? '搜索结果' : hasFilters ? '筛选结果' : trashed ? '暂存的错题' : lifecycle === 'draft' ? '继续完善你的草稿' : '你的学习积累'}<strong>{loading ? '…' : total}</strong> 道{hasFilters && <button className="reset-filter" onClick={clearFilters}>清除筛选</button>}</span><div className="library-toolbar-actions">{!trashed && <button className="library-select-trigger" disabled={selectionMode ? Boolean(busy) : exportDisabled} onClick={selectionMode ? exitSelection : startSelection}><ListChecks size={16} />{selectionMode ? '退出选择' : '选择题目'}</button>}<div className="view-switch" aria-label="展示方式"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="列表视图" aria-pressed={view === 'list'}><List size={17} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="卡片视图" aria-pressed={view === 'grid'}><LayoutGrid size={16} /></button></div></div></div>
      {!trashed && selectionMode && <div className="library-selection-toolbar" aria-label="批量选择题目">
        <label className="library-select-all"><Checkbox checked={allSelected} indeterminate={someSelected && !allSelected} disabled={exportDisabled} onChange={togglePageSelection} /><span>全选已加载</span></label>
        <span className="library-selection-count" role="status">已选 <strong>{selectedIds.length}</strong> 道</span>
        <div className="library-selection-actions">{lifecycle === 'draft' && <button disabled={exportDisabled} onClick={() => void selectAllDrafts()}>{busy?.kind === 'select' ? '正在全选…' : hasFilters ? `全选筛选结果（${total}）` : `全选全部草稿（${total}）`}</button>}<button disabled={!selectedIds.length || Boolean(busy)} onClick={() => setSelectedIds([])}>清空</button></div>
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
            selectionMode={selectionMode && !trashed} selected={selectedIdSet.has(mistake.id)} onSelectedChange={() => toggleSelection(mistake.id)}
            ratingOpen={mobile && action?.id === mistake.id && action.mode === 'rating'} ratingSaving={busy?.id === mistake.id && busy.kind === 'rating'} ratingError={action?.id === mistake.id ? ratingError : ''}
            onRatingOpenChange={(open) => openRating(mistake, open)} onRatingChange={(value) => void saveRating(mistake, value)}
            onOpenChange={(open) => setAction(open ? { id: mistake.id, mode: 'swipe' } : null)} onArmedChange={(armed) => setAction(armed ? { id: mistake.id, mode: 'confirm' } : null)}
            onDelete={() => void moveOrRestore(mistake, 'delete')} onRestore={() => void moveOrRestore(mistake, 'restore')} onPermanentDelete={() => setPermanentTarget(mistake)} />)}
        </div>}</LoadingContent>
      {!loading && !error && mistakes.length > 0 && <div ref={loadMoreTrigger} className="library-load-more" aria-live="polite" aria-busy={loadingMore}>
        {moreError ? <><span>加载更多失败：{moreError}</span><button type="button" className="button secondary" disabled={Boolean(busy)} onClick={() => void loadMore()}>重试加载</button></>
          : loadingMore ? <><LoaderCircle size={17} className="spin" /><span>正在加载更多…</span></>
          : <span>{hasMore ? '下滑加载更多' : page < pageCount ? `本页已加载 ${mistakes.length} 道` : '已加载全部'}</span>}
      </div>}
      {total > LIBRARY_PAGE_SIZE && !loading && !error && !hasMore && <nav className="library-pagination" aria-label="错题分页"><button className="button secondary" disabled={Boolean(busy) || page <= 1} onClick={() => changePage(page - 1)}>上一页</button><span aria-live="polite">第 {page} / {pageCount} 页</span><button className="button secondary" disabled={Boolean(busy) || page >= pageCount} onClick={() => changePage(page + 1)}>下一页</button></nav>}
    </div>
    {mobile && lifecycle === 'draft' && selectionMode && <div className="library-archive-spacer" aria-hidden="true" />}
    {mobile && <MobileFiltersDrawer open={filterOpen} onOpenChange={(open) => open ? openFilters() : setFilterOpen(false)} onApply={applyFilters} onReset={() => setDraftFilters(EMPTY_FILTERS)} triggerRef={filterTrigger}>
      {(portalContainer) => <MistakeFilterFields filters={draftFilters} onChange={setDraftFilters} portalContainer={portalContainer} withLabels />}
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

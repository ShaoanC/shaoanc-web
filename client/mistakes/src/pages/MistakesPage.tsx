import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, FileText, LayoutGrid, List, Plus, RotateCcw, Search, SlidersHorizontal, Target, X } from 'lucide-react';
import { api, formatDate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { EmptyState, ErrorState, PageHeader, Spinner, StatusBadge } from '../components';
import type { Mistake, Stats } from '../types';

export function MistakesPage() {
  const { subjects, knowledgePoints } = useApp();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lifecycle, setLifecycle] = useState('archived');
  const [subjectId, setSubjectId] = useState('');
  const [knowledgePointId, setKnowledgePointId] = useState('');
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(keyword), 250);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ lifecycle });
      if (subjectId) query.set('subjectId', subjectId);
      if (knowledgePointId) query.set('knowledgePointId', knowledgePointId);
      if (status) query.set('status', status);
      if (search.trim()) query.set('keyword', search.trim());
      const [items, summary] = await Promise.all([api<Mistake[]>(`/mistakes?${query}`), api<Stats>('/stats')]);
      setMistakes(items);
      setStats(summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [lifecycle, subjectId, knowledgePointId, status, search]);

  useEffect(() => { void load(); }, [load]);
  const hasFilters = Boolean(subjectId || knowledgePointId || status || keyword);
  const clearFilters = () => { setSubjectId(''); setKnowledgePointId(''); setStatus(''); setKeyword(''); setSearch(''); };
  const subjectKnowledge = knowledgePoints.filter((point) => !subjectId || point.subjectId === subjectId);
  const metrics = [
    { label: '已归档错题', value: stats?.archived, icon: BookOpen, tone: 'violet', hint: '把学习收获留在这里' },
    { label: '待巩固', value: stats ? stats.byStatus.filter((item) => ['unknown', 'familiar'].includes(item.id)).reduce((sum, item) => sum + item.count, 0) : undefined, icon: Target, tone: 'amber', hint: '回顾一次，更熟悉一点' },
    { label: '已掌握', value: stats?.byStatus.find((item) => item.id === 'mastered')?.count ?? (stats ? 0 : undefined), icon: CheckCircle2, tone: 'green', hint: '努力正在变成进步' },
    { label: '累计复习', value: stats?.reviewCount, icon: RotateCcw, tone: 'blue', hint: '每次回顾都算数' },
  ];

  return <>
    <PageHeader eyebrow="收集问题，积累答案" title="我的错题" description="把每道错题整理好，让下一次学习更有方向。" action={<a className="button primary" href="#/new"><Plus size={18} /> 录入错题</a>} />
    <div className="metrics-grid">{metrics.map(({ label, value, icon: Icon, tone, hint }) => <div className="metric-card" key={label}><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={19} /></span></div><div className="metric-value">{value ?? '—'}<span>{label === '累计复习' ? '次' : '道'}</span></div><div className="metric-hint">{hint}</div></div>)}</div>
    <div className="library-panel"><div className="library-heading"><div className="tabs" role="tablist" aria-label="错题状态"><button className={lifecycle === 'archived' ? 'active' : ''} role="tab" aria-selected={lifecycle === 'archived'} onClick={() => setLifecycle('archived')}>已归档<span>{stats?.archived ?? 0}</span></button><button className={lifecycle === 'draft' ? 'active' : ''} role="tab" aria-selected={lifecycle === 'draft'} onClick={() => setLifecycle('draft')}>草稿箱<span>{stats?.drafts ?? 0}</span></button></div><a className="text-link" href="#/review"><RotateCcw size={15} /> 去复习<ArrowRight size={15} /></a></div>
      <div className="filter-bar"><label className="search-input"><Search size={18} /><input aria-label="搜索错题" placeholder="搜索题干、答案或笔记…" value={keyword} onChange={(event) => setKeyword(event.target.value)} />{keyword && <button className="icon-button" aria-label="清除搜索" onClick={() => setKeyword('')}><X size={15} /></button>}</label><select aria-label="按学科筛选" value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setKnowledgePointId(''); }}><option value="">全部学科</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select><select aria-label="按知识点筛选" value={knowledgePointId} onChange={(event) => setKnowledgePointId(event.target.value)}><option value="">全部知识点</option>{subjectKnowledge.map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select><select aria-label="按掌握程度筛选" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">全部掌握程度</option><option value="unreviewed">未复习</option><option value="unknown">不会</option><option value="familiar">不熟</option><option value="mastered">掌握</option></select></div>
      <div className="results-toolbar"><span><SlidersHorizontal size={14} /> {hasFilters ? '筛选结果' : lifecycle === 'draft' ? '继续完善你的草稿' : '你的学习积累'}<strong>{mistakes.length}</strong> 道{hasFilters && <button className="reset-filter" onClick={clearFilters}>清除筛选</button>}</span><div className="view-switch" aria-label="展示方式"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="列表视图" aria-pressed={view === 'list'}><List size={17} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="卡片视图" aria-pressed={view === 'grid'}><LayoutGrid size={16} /></button></div></div>
      {loading ? <Spinner /> : error ? <ErrorState message={error} retry={load} /> : mistakes.length === 0 ? <EmptyState filtered={hasFilters} title={hasFilters ? '没有找到符合条件的错题' : lifecycle === 'draft' ? '草稿箱还是空的' : '你的第一道错题，从这里开始'} description={hasFilters ? '试试其他关键词，或调整筛选条件。' : lifecycle === 'draft' ? '录入时可以先存为草稿，之后再慢慢完善。' : '记下题目、梳理答案，再通过复习一点点掌握。'} action={hasFilters ? <button className="button secondary" onClick={clearFilters}>清除筛选</button> : <a className="button primary" href="#/new"><Plus size={17} /> 录入第一道错题</a>} /> : <div className={`mistakes-collection ${view === 'grid' ? 'card-grid' : ''}`}>{view === 'list' && <div className="list-column-head"><span>题目与知识点</span><span>掌握程度</span><span>最近整理</span><span /></div>}{mistakes.map((mistake) => <a className={`mistake-item ${view === 'grid' ? 'mistake-card' : ''}`} key={mistake.id} href={`#/mistakes/${mistake.id}`}><div className="mistake-main"><span className={`subject-icon subject-${mistake.subjectId}`}>{subjects.find((subject) => subject.id === mistake.subjectId)?.name.slice(0, 1) || <FileText size={20} />}</span><div className="mistake-copy"><h3>{mistake.question || '尚未填写题干'}</h3><div className="mistake-meta"><span className={`subject-tag subject-${mistake.subjectId}`}>{subjects.find((subject) => subject.id === mistake.subjectId)?.name || mistake.subjectId}</span><span className="knowledge-tag">{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</span>{mistake.lifecycle === 'draft' && <span className="draft-tag">草稿</span>}</div></div></div><StatusBadge status={mistake.latestReviewResult || 'unreviewed'} /><span className="mistake-date">{formatDate(mistake.updatedAt)}</span><ChevronRight size={17} className="mistake-chevron" /></a>)}</div>}
    </div>
    <div className="study-tip"><span><SparkleMark /></span><p><strong>整理只是开始，回顾才会巩固。</strong> 可以在复习页按学科或知识点，选择今天想练习的题目。</p><a href="#/review">开始一次复习<ArrowRight size={15} /></a></div>
  </>;
}

function SparkleMark() { return <Target size={19} />; }

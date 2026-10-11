import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, FileText, Layers, RotateCcw, TrendingUp } from 'lucide-react';
import { api } from '../api';
import { ErrorState, PageHeader } from '../components';
import { LoadingContent } from '../motion';
import { STATUS_LABELS, type KnowledgeStatus, type Stats } from '../types';

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api<Stats>('/stats').then(setStats).catch((err) => setError(err.message)); }, []);
  const subjectMax = Math.max(1, ...(stats?.bySubject || []).map((item) => item.count));
  const knowledgeRows = [...(stats?.byKnowledgePoint || [])].sort((a, b) => b.count - a.count).slice(0, 8);
  const knowledgeMax = Math.max(1, ...knowledgeRows.map((item) => item.count));
  const mastered = stats?.byStatus.find((item) => item.id === 'mastered')?.count || 0;
  const masteryPercent = stats?.archived ? Math.round(mastered / stats.archived * 100) : 0;
  return <>
    <PageHeader eyebrow="从记录找到复习重点" title="学习统计" action={<a className="button secondary" href="#/review"><RotateCcw size={17} /> 去复习</a>} />
    <LoadingContent loading={!stats && !error} kind="stats">
    {error ? <ErrorState message={error} /> : stats && <>
    <div className="metrics-grid">{[{ title: '已归档错题', value: stats.archived, unit: '道', icon: BookOpen, tone: 'violet' }, { title: '待完善草稿', value: stats.drafts, unit: '道', icon: FileText, tone: 'amber' }, { title: '累计复习', value: stats.reviewCount, unit: '次', icon: RotateCcw, tone: 'blue' }, { title: '当前掌握率', value: masteryPercent, unit: '%', icon: CheckCircle2, tone: 'green' }].map(({ title, value, unit, icon: Icon, tone }) => <div className="metric-card" key={title}><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}><Icon size={19} /></span></div><div className="metric-value">{value}<span>{unit}</span></div></div>)}</div>
    <div className="stats-grid"><section className="panel"><div className="panel-title"><span className="panel-title-icon violet"><BookOpen size={18} /></span><div><h2>学科分布</h2></div></div><div className="horizontal-chart">{stats.bySubject.map((item) => <div className="chart-row" key={item.id}><span>{item.name}</span><div className="chart-track"><div className={`chart-fill chart-subject-${item.id}`} style={{ width: `${item.count / subjectMax * 100}%` }} /></div><strong>{item.count}<small>道</small></strong></div>)}</div></section><section className="panel"><div className="panel-title"><span className="panel-title-icon green"><TrendingUp size={18} /></span><div><h2>掌握程度</h2></div></div><div className="status-distribution">{(['unreviewed', 'unknown', 'familiar', 'mastered'] as KnowledgeStatus[]).map((id) => { const count = stats.byStatus.find((item) => item.id === id)?.count || 0; return <div className="distribution-item" key={id}><span className={`distribution-dot status-${id}`} /><span>{STATUS_LABELS[id]}</span><div className="chart-track"><div className={`chart-fill chart-status-${id}`} style={{ width: `${stats.archived ? count / stats.archived * 100 : 0}%` }} /></div><strong>{count}</strong><small>{stats.archived ? Math.round(count / stats.archived * 100) : 0}%</small></div>; })}</div></section></div>
    <section className="panel knowledge-chart-panel"><div className="panel-title"><span className="panel-title-icon blue"><Layers size={18} /></span><div><h2>知识点分布</h2><p>按主知识点查看已归档错题，最多展示数量最多的 8 项。</p></div></div>{knowledgeRows.length ? <div className="knowledge-chart">{knowledgeRows.map((item) => <div className="chart-row" key={item.id ?? 'unassigned'}><span className={item.id === null ? 'text-muted' : undefined}>{item.name}</span><div className="chart-track"><div className="chart-fill chart-knowledge" style={{ width: `${item.count / knowledgeMax * 100}%` }} /></div><strong>{item.count}<small>道</small></strong></div>)}</div> : <div className="small-empty"><Layers size={30} strokeWidth={1.5} /><p>还没有已归档的知识点记录</p><span>录入错题时标注主知识点，学习重点会更清楚。</span></div>}</section>
    </>}
    </LoadingContent>
  </>;
}

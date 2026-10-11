import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, FileText, Layers, RotateCcw, TrendingUp } from 'lucide-react';
import { api } from '../api';
import { ErrorState, PageHeader } from '../components';
import { LoadingContent } from '../motion';
import { KnowledgeChart, MasteryChart, SubjectChart } from '../StatsCharts';
import type { Stats } from '../types';

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api<Stats>('/stats').then(setStats).catch((err) => setError(err.message)); }, []);
  const mastered = stats?.byStatus.find((item) => item.id === 'mastered')?.count || 0;
  const masteryPercent = stats?.archived ? Math.round(mastered / stats.archived * 100) : 0;
  return <>
    <PageHeader eyebrow="从记录找到复习重点" title="学习统计" action={<a className="button secondary" href="#/review"><RotateCcw size={17} /> 去复习</a>} />
    <LoadingContent loading={!stats && !error} kind="stats">
    {error ? <ErrorState message={error} /> : stats && <>
    <div className="metrics-grid">{[{ title: '已归档错题', value: stats.archived, unit: '道', icon: BookOpen, tone: 'violet' }, { title: '待完善草稿', value: stats.drafts, unit: '道', icon: FileText, tone: 'amber' }, { title: '累计复习', value: stats.reviewCount, unit: '次', icon: RotateCcw, tone: 'blue' }, { title: '当前掌握率', value: masteryPercent, unit: '%', icon: CheckCircle2, tone: 'green' }].map(({ title, value, unit, icon: Icon, tone }) => <div className="metric-card" key={title}><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}><Icon size={19} /></span></div><div className="metric-value">{value}<span>{unit}</span></div></div>)}</div>
    <div className="stats-grid stats-chart-grid">
      <section className="panel stats-chart-panel">
        <div className="panel-title"><span className="panel-title-icon violet"><BookOpen size={18} /></span><div><h2>学科分布</h2><p>各学科已归档错题的数量。</p></div></div>
        <SubjectChart data={stats.bySubject} />
      </section>
      <section className="panel stats-chart-panel stats-mastery-panel">
        <div className="panel-title"><span className="panel-title-icon green"><TrendingUp size={18} /></span><div><h2>掌握程度</h2><p>按每道错题最近一次复习结果统计。</p></div></div>
        <MasteryChart data={stats.byStatus} total={stats.archived} />
      </section>
    </div>
    <section className="panel knowledge-chart-panel stats-chart-panel">
      <div className="panel-title"><span className="panel-title-icon blue"><Layers size={18} /></span><div><h2>知识点分布</h2><p>按主知识点查看已归档错题，最多展示数量最多的 8 项。</p></div></div>
      <KnowledgeChart data={stats.byKnowledgePoint} />
    </section>
    </>}
    </LoadingContent>
  </>;
}

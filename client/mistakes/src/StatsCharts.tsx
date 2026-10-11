import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, ResponsiveContainer, Text, Tooltip, XAxis, YAxis } from 'recharts';
import { STATUS_LABELS, type KnowledgeStatus, type Stats } from './types';

const subjectColors: Record<string, string> = {
  math: 'var(--subject-math)',
  physics: 'var(--subject-physics)',
  english: 'var(--subject-english)',
};

const statusColors: Record<KnowledgeStatus, string> = {
  unreviewed: 'var(--text-muted)',
  unknown: 'var(--error)',
  familiar: 'var(--warning)',
  mastered: 'var(--success)',
};

const statusOrder: KnowledgeStatus[] = ['unreviewed', 'unknown', 'familiar', 'mastered'];

function CountTooltip({ active, payload, total, maxWidth }: {
  active?: boolean;
  payload?: readonly { payload?: { name: string; count: number } }[];
  total?: number;
  maxWidth?: number;
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  return <div className="stats-chart-tooltip" style={{ maxWidth }}><strong>{item.name}</strong><span>{item.count} 道{total !== undefined && total > 0 ? ` · ${Math.round(item.count / total * 100)}%` : ''}</span></div>;
}

export function SubjectChart({ data }: { data: Stats['bySubject'] }) {
  if (!data.some((item) => item.count > 0)) return <div className="stats-chart-frame stats-subject-chart stats-chart-empty"><p>还没有已归档的错题</p><span>归档错题后，在这里查看各学科的分布。</span></div>;
  const rows = data.map((item) => ({ ...item, fill: subjectColors[item.id] || 'var(--primary)' }));
  return <div className="stats-chart-frame stats-subject-chart">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 28, right: 12, bottom: 4, left: 0 }} barCategoryGap="28%" aria-label="学科错题数量">
        <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
        <XAxis dataKey="name" axisLine={{ stroke: 'var(--border-medium)' }} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} interval={0} tickMargin={12} height={36} />
        <YAxis domain={[0, 'auto']} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} width={32} />
        <Tooltip content={(props) => <CountTooltip active={props.active} payload={props.payload} />} cursor={{ fill: 'var(--primary-soft)' }} />
        <Bar dataKey="count" name="错题数量" maxBarSize={54} radius={[3, 3, 0, 0]} isAnimationActive={false}>
          <LabelList dataKey="count" position="top" offset={10} className="stats-chart-value" fill="var(--text-primary)" fontSize={13} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>;
}

export function MasteryChart({ data, total }: { data: Stats['byStatus']; total: number }) {
  const rows = statusOrder.map((id) => ({
    id,
    name: STATUS_LABELS[id],
    count: data.find((item) => item.id === id)?.count || 0,
    fill: statusColors[id],
  }));
  const mastered = rows.find((item) => item.id === 'mastered')!.count;
  const percentage = total ? Math.round(mastered / total * 100) : 0;
  const ringData = total ? rows : [{ name: '暂无已归档错题', count: 1, fill: 'var(--border-medium)' }];
  return <div className="stats-mastery-layout">
    <div className="stats-mastery-ring">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart aria-label={total ? '已归档错题的掌握程度分布' : '暂无已归档错题'}>
          <Pie data={ringData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius="68%" outerRadius="90%" paddingAngle={rows.filter((item) => item.count > 0).length > 1 ? 3 : 0} stroke="var(--surface-2)" strokeWidth={2} isAnimationActive={false} />
          {total > 0 && <Tooltip content={(props) => <CountTooltip active={props.active} payload={props.payload} total={total} />} />}
        </PieChart>
      </ResponsiveContainer>
      <div className="stats-mastery-center"><strong>{percentage}%</strong><span>当前掌握率</span></div>
    </div>
    <ul className="stats-mastery-legend">
      {rows.map((item) => <li className="stats-mastery-item" key={item.id}><span className="stats-legend-dot" style={{ backgroundColor: item.fill }} /><span className="stats-legend-label">{item.name}</span><strong className="stats-legend-count">{item.count}<small> 道</small></strong><span className="stats-legend-percent">{total ? Math.round(item.count / total * 100) : 0}%</span></li>)}
    </ul>
    {total === 0 && <div className="stats-chart-empty"><p>还没有已归档的错题</p><span>归档并复习后，可以查看掌握程度。</span></div>}
  </div>;
}

export function KnowledgeChart({ data }: { data: Stats['byKnowledgePoint'] }) {
  const [chartWidth, setChartWidth] = useState(360);
  const rows = [...data].sort((a, b) => b.count - a.count).slice(0, 8).map((item) => ({ ...item, key: String(item.id ?? 'unassigned'), fill: 'var(--accent)' }));
  const axisWidth = Math.min(220, Math.max(100, Math.round(chartWidth * 0.38)));
  const labelWidth = axisWidth - 16;
  const height = rows.length * 44 + 42;
  if (!rows.length) return <div className="stats-chart-empty"><p>还没有已归档的知识点记录</p><span>录入错题时标注主知识点，学习重点会更清楚。</span></div>;
  return <div className="stats-chart-frame stats-knowledge-chart" style={{ height }}>
    <ResponsiveContainer width="100%" height="100%" onResize={(width) => setChartWidth(Math.round(width))}>
      <BarChart data={rows} layout="vertical" margin={{ top: 2, right: 52, bottom: 4, left: 0 }} aria-label="主知识点错题数量">
        <CartesianGrid horizontal={false} stroke="var(--border-subtle)" />
        <XAxis type="number" domain={[0, 'auto']} allowDecimals={false} axisLine={{ stroke: 'var(--border-medium)' }} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickMargin={10} height={30} />
        <YAxis type="category" dataKey="key" width={axisWidth} axisLine={false} tickLine={false} interval={0} tick={({ x, y, payload }) => {
          const name = rows.find((item) => item.key === payload.value)?.name;
          return <g><title>{name}</title><Text x={Number(x) - 8} y={Number(y)} width={labelWidth} breakAll maxLines={1} verticalAnchor="middle" textAnchor="end" fontSize={14} style={{ fontSize: '14px', fontFamily: 'inherit' }} fill="var(--text-secondary)" className="stats-chart-axis-label">{name}</Text></g>;
        }} />
        <Tooltip position={chartWidth < 480 ? { x: 0 } : undefined} content={(props) => <CountTooltip active={props.active} payload={props.payload} maxWidth={Math.min(260, chartWidth)} />} cursor={{ fill: 'var(--accent-soft)' }} />
        <Bar dataKey="count" name="错题数量" barSize={16} radius={[0, 3, 3, 0]} isAnimationActive={false}>
          <LabelList dataKey="count" position="right" offset={9} className="stats-chart-value" fill="var(--text-primary)" fontSize={13} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>;
}

import type { ReactNode } from 'react';
import { useApp } from './context';
import './pages/SettingsPage.css';
import './backup-settings.css';
import './page-skeletons.css';

function Text({ children }: { children: ReactNode }) {
  return <span className="skeleton-text skeleton-shimmer">{children}</span>;
}

function Button({ children = '保存设置' }: { children?: ReactNode }) {
  return <span className="button skeleton-button"><Text>{children}</Text></span>;
}

function Field({ label }: { label: string }) {
  return <div className="field"><span><Text>{label}</Text></span><div className="skeleton-form-control skeleton-shimmer"><input disabled tabIndex={-1} /></div></div>;
}

function PanelTitle({ title, description }: { title: string; description?: string }) {
  return <div className="panel-title"><span className="panel-title-icon"><span className="skeleton-symbol skeleton-shimmer" /></span><div><h2><Text>{title}</Text></h2>{description && <p><Text>{description}</Text></p>}</div></div>;
}

export function SkeletonPageHeader({ title, action, description }: { title: string; action?: string; description?: string }) {
  return <div className="page-header"><div><h1><Text>{title}</Text></h1>{description && <p><Text>{description}</Text></p>}</div>{action && <div className="page-header-action"><Button>{action}</Button></div>}</div>;
}

export function StatsPanelsSkeleton() {
  return <>
    <div className="stats-grid stats-chart-grid">
      <section className="panel stats-chart-panel"><PanelTitle title="学科分布" description="各学科已归档错题的数量。" /><div className="stats-chart-frame stats-subject-chart skeleton-subject-bars">{[48, 78, 35].map((height) => <span className="skeleton-shimmer" style={{ height: `${height}%` }} key={height} />)}</div></section>
      <section className="panel stats-chart-panel stats-mastery-panel"><PanelTitle title="掌握程度" description="按每道错题最近一次复习结果统计。" /><div className="stats-mastery-layout"><div className="stats-mastery-ring skeleton-mastery-ring" /><ul className="stats-mastery-legend">{['未复习', '未掌握', '待巩固', '已掌握'].map((label) => <li className="stats-mastery-item" key={label}><span className="stats-legend-dot skeleton-shimmer" /><span><Text>{label}</Text></span><strong><Text>0 道</Text></strong><span><Text>0%</Text></span></li>)}</ul></div></section>
    </div>
    <section className="panel knowledge-chart-panel stats-chart-panel"><PanelTitle title="知识点分布" description="按主知识点查看已归档错题，最多展示数量最多的 8 项。" /><div className="stats-chart-frame stats-knowledge-chart skeleton-knowledge-bars">{[74, 92, 55, 38].map((width) => <div key={width}><Text>知识点名称</Text><span className="skeleton-shimmer" style={{ width: `${width}%` }} /></div>)}</div></section>
  </>;
}

export function TaskRowsSkeleton() {
  return <><div className="task-selection-bar"><label><span className="skeleton-symbol skeleton-shimmer" /><Text>选择本页可操作任务</Text></label><div><span className="table-button"><span className="skeleton-symbol skeleton-shimmer" /><Text>重试</Text></span><span className="table-button"><span className="skeleton-symbol skeleton-shimmer" /><Text>取消</Text></span></div></div><div className="task-rows">{[0, 1, 2].map((index) => <article className="task-row" key={index}>
    <div className="task-row-heading"><div className="task-row-title"><span className="skeleton-symbol skeleton-shimmer" /><h3><Text>识别题目</Text></h3><span className="task-id"><Text>#000</Text></span></div><span className="task-status"><Text>处理中</Text></span></div>
    <div className="task-excerpt"><Text>正在读取错题内容，整理识别与解析结果。</Text></div>
    <div className="task-meta"><Text>记录 #000</Text><Text>10月24日 12:00</Text><Text>本轮耗时 10 秒</Text><Text>尝试 1/3</Text></div>
    <div className="task-row-actions"><Button>打开错题</Button></div>
  </article>)}</div></>;
}

export function TasksPageSkeleton() {
  return <><SkeletonPageHeader title="AI 任务管理" action="录入错题" /><p className="task-page-description"><Text>上传后可以继续学习，AI 会在后台处理。完成后，在这里查看结果、校对或重试；不再需要的处理中、失败或待校对任务可直接取消。</Text></p>
    <section className="task-manager"><div className="task-sync-bar"><span><Text>正在加载任务…</Text><small><Text>正在同步任务状态</Text></small></span><Button>刷新</Button></div><div className="task-filters skeleton-tabs">{['全部', '处理中', '待校对', '失败', '已填入', '已取消'].map((label) => <span key={label}><Text>{label} —</Text></span>)}</div><div className="task-search-bar"><div className="task-search skeleton-input skeleton-shimmer" /><div className="custom-select skeleton-input skeleton-shimmer" /></div><TaskRowsSkeleton /><div className="task-pagination"><Text>共 — 项</Text><Button>上一页　下一页</Button></div></section>
  </>;
}

export function SettingsPageSkeleton() {
  const { user } = useApp();
  const admin = user.role === 'admin';
  return <><SkeletonPageHeader title="设置" description={admin ? '管理账号安全、学习目录、AI 服务与全站数据备份。' : '修改用户名、头像与登录密码。'} /><div className="settings-tabs skeleton-tabs">{['账号安全', '知识点目录', ...(admin ? ['AI 设置', '数据备份', '邀请码', '用户账号', '测试错题'] : [])].map((label) => <span key={label}><span className="skeleton-symbol skeleton-shimmer" /><Text>{label}</Text></span>)}</div>
    <div className="settings-account-layout"><div className="settings-account-forms">
      <section className="panel username-panel"><PanelTitle title="修改用户名" description="修改后请使用新用户名登录。" /><div className="skeleton-settings-form"><Field label="用户名" /><Button>保存用户名</Button></div></section>
      <section className="panel password-panel"><PanelTitle title="修改密码" description="设置一个只有你知道的密码。" /><div className="skeleton-settings-form"><Field label="当前密码" /><Field label="新密码" /><Field label="确认新密码" /><Button>保存新密码</Button></div></section>
    </div><aside className="panel account-summary"><span className="large-avatar skeleton-shimmer" /><Button>上传头像</Button><p className="avatar-hint"><Text>JPG、PNG、WebP，最大 5 MB</Text><br /><Text>自动居中裁剪为方形</Text></p><h2><Text>用户名</Text></h2><span className="small-pill"><Text>学习账号</Text></span><div className="account-summary-note"><span className="skeleton-symbol skeleton-shimmer" /><strong><Text>专属于你的错题本</Text></strong><p><Text>整理的题目、笔记与复习记录</Text><br /><Text>会保存在你的账号下。</Text></p></div></aside></div>
  </>;
}

export function SettingsTableSkeleton() {
  return <section className="panel admin-panel"><div className="admin-panel-heading"><div><h2><Text>账号与邀请管理</Text></h2><p><Text>管理账号状态与使用情况。</Text></p></div><Button>管理操作</Button></div><div className="skeleton-admin-table"><div className="skeleton-admin-table-heading">{[0, 1, 2, 3].map((i) => <Text key={i}>栏目名称</Text>)}</div>{[0, 1, 2].map((i) => <div key={i}>{[0, 1, 2, 3].map((j) => <Text key={j}>正在加载</Text>)}</div>)}</div></section>;
}

export function AiProfileSkeleton() {
  return <div className="ai-profile-form"><div className="ai-profile-enable"><span className="skeleton-symbol skeleton-shimmer" /><Text>启用服务</Text></div><Field label="API 基础地址" /><Field label="模型名称" /><Field label="API 密钥" /><div className="ai-profile-actions"><Button>保存服务配置</Button><Button>测试服务</Button></div></div>;
}

export function BackupSettingsSkeleton() {
  return <div className="backup-settings"><section className="panel backup-create-panel"><div className="backup-heading"><PanelTitle title="全站数据备份" description="保留一份完整记录，为恢复与迁移做好准备。" /><Button>立即备份</Button></div><div className="skeleton-copy-lines"><Text>账号、错题、知识点、复习记录与图片</Text><Text>完整保存服务器配置与学习记录</Text></div><div className="backup-sensitive"><Text>备份含账号数据及服务密钥，请妥善保管。</Text></div></section><section className="panel backup-schedule-panel"><PanelTitle title="自动备份" description="每天按北京时间执行；停服期间错过的备份不会补跑。" /><div className="backup-enable"><span className="skeleton-symbol skeleton-shimmer" /><Text>启用每日自动备份</Text></div><div className="backup-schedule-fields"><Field label="每天执行时间" /><Field label="自动备份保留份数" /></div><div className="backup-schedule-footer"><Button>保存自动备份设置</Button><Text>下次执行时间与最近结果</Text></div></section><section className="panel backup-history-panel"><div className="backup-heading"><h2><Text>备份记录</Text></h2></div>{[0, 1].map((i) => <div className="backup-record" key={i}><Text>备份时间与文件大小</Text><Text>备份状态</Text><Button>下载</Button></div>)}</section></div>;
}

export function TestDataSkeleton() {
  return <section className="test-data-tools"><div><strong><Text>体验错题本</Text></strong><p><Text>每次为当前管理员账号生成 6 道示例，带有“测试错题”标签，可用于编辑和复习。当前账号共 — 道测试错题。</Text></p><small><Text>移入回收站覆盖所有筛选条件、归档和草稿，仅处理当前账号的测试错题，30 天内可恢复题目及复习记录。测试数据会计入学习统计。</Text></small></div><div className="test-data-actions"><Button>一键生成测试错题</Button><Button>测试错题移入回收站</Button></div></section>;
}

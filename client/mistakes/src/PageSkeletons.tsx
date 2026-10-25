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

function EditorPhotoSkeleton({ answer = false }: { answer?: boolean }) {
  return <div className="photo-entry">
    <div className="photo-entry-title"><span className="skeleton-symbol skeleton-shimmer" /><Text>{answer ? '也可以拍下答案' : '从图片录入题目'}</Text></div>
    <p><Text>{answer ? '题目和答案在同一张图里时，可直接复用题干图片识别答案。' : '选中错题部分，多张图片按顺序一起识别。'}</Text></p>
    <div className="photo-actions">{[answer ? '拍照识别答案' : '拍照', '选择图片', '选择已上传的照片', ...(answer ? ['复用题干图片'] : [])].map((label) => <span className="button secondary skeleton-button" key={label}><span className="skeleton-symbol skeleton-shimmer" style={{ width: 16, height: 16 }} /><Text>{label}</Text></span>)}</div>
  </div>;
}

function EditorFieldSkeleton({ label, rows = 5, question = false }: { label: string; rows?: number; question?: boolean }) {
  return <div className="field markdown-field"><div className="markdown-field-heading"><label><Text>{label}</Text></label><div className="markdown-field-modes">{['编辑', '预览'].map((mode) => <button type="button" disabled tabIndex={-1} key={mode}><Text>{mode}</Text></button>)}</div></div><div className="skeleton-form-control skeleton-shimmer"><textarea disabled tabIndex={-1} rows={rows} className={question ? 'question-editor' : undefined} /></div></div>;
}

function EditorBlockHeading({ title, required = false }: { title: string; required?: boolean }) {
  return <div className="editor-block-heading"><span className="skeleton-symbol skeleton-shimmer" /><h2><Text>{title}</Text></h2>{required && <span><Text>必填</Text></span>}</div>;
}

export function EditorContentSkeleton() {
  const existing = /^#\/mistakes\/\d+\/edit/.test(window.location.hash);
  return <>
    {existing && <div className="editor-uploaded"><span className="table-button"><Text>查看上传图片</Text></span></div>}
    <div className="editor-mobile-tabs"><div className="sliding-tabs">{['题干', '解答', '笔记', '归类'].map((tab) => <span className="sliding-tab" key={tab}><i className="skeleton-text skeleton-shimmer">{tab}</i></span>)}</div></div>
    <div className="editor-layout"><div className="editor-main">
      <section className="editor-block editor-question-block"><EditorBlockHeading title="题目" required /><EditorPhotoSkeleton /><EditorFieldSkeleton label="题干 *" question /></section>
      <section className="editor-block editor-answers-block skeleton-editor-secondary"><EditorBlockHeading title="答案与分析" /><EditorFieldSkeleton label="正确答案　选填" rows={3} /><EditorPhotoSkeleton answer /><p className="ai-notice"><Text>手动输入的短答案会在保存时自动生成解析；图片识别的短答案会在填入后生成。</Text></p><div className="photo-actions"><Button>生成解析</Button></div><EditorFieldSkeleton label="解题分析　选填" /></section>
      <section className="editor-block editor-note-block skeleton-editor-secondary"><EditorBlockHeading title="我的笔记" /><EditorFieldSkeleton label="我的笔记　选填" /></section>
    </div><aside className="editor-aside editor-classification editor-block skeleton-editor-secondary"><EditorBlockHeading title="学科与知识点" /><Field label="学科 *" /><Field label="主知识点　选填" /><div className="field"><span><Text>辅助知识点　可多选</Text></span><div className="knowledge-options skeleton-copy-lines"><Text>知识点名称</Text><Text>知识点名称</Text></div></div><div className="field"><span><Text>星级标记　选填</Text></span><Text>☆　☆　☆　☆　☆</Text></div></aside></div>
  </>;
}

export function EditorPageSkeleton() {
  const existing = /^#\/mistakes\/\d+\/edit/.test(window.location.hash);
  return <div className="editor-workbench"><nav className="editor-navigation"><span className="back-link"><span className="skeleton-symbol skeleton-shimmer" /><Text>{existing ? '返回错题详情' : '返回我的错题'}</Text></span>{!existing && <span className="table-button editor-batch-entry"><span className="skeleton-symbol skeleton-shimmer" /><Text>按页批量录入</Text></span>}</nav><header className="editor-workbench-header"><div><h1><Text>{existing ? '编辑错题' : '录入错题'}</Text></h1></div><div className="editor-workbench-state"><span className="editor-mode"><Text>正在编辑</Text></span></div></header><EditorContentSkeleton /></div>;
}

export function ReviewCandidatesSkeleton() {
  return <div className="review-candidates">{[0, 1, 2].map((index) => <div className="review-candidate" key={index}><span className="skeleton-symbol skeleton-shimmer" /><div><h3><Text>题目条件、问题和需要复习的内容</Text></h3><span><Text>学科 · 知识点</Text></span><div className="review-candidate-rating"><Text>☆☆☆☆☆</Text></div></div><span className="status-badge"><i className="skeleton-text skeleton-shimmer">未复习</i></span></div>)}</div>;
}

export function ReviewPageSkeleton() {
  return <><SkeletonPageHeader title="开始复习" /><div className="review-selection-layout"><section className="library-panel"><div className="panel-title selection-heading"><span className="panel-title-icon"><span className="skeleton-symbol skeleton-shimmer" /></span><div><h2><Text>选择今天的练习</Text></h2><p><Text>仅已归档的错题可以参与复习。</Text></p></div></div><div className="filter-bar review-filters has-rating-filter">{['全部学科', '全部知识点', '全部掌握程度', '全部星级'].map((label) => <div className="custom-select" key={label}><div className="custom-select-trigger"><Text>{label}</Text><span className="skeleton-symbol skeleton-shimmer" /></div></div>)}</div><div className="selection-toolbar"><label><span className="skeleton-symbol skeleton-shimmer" /><Text>全选当前结果</Text></label><span><Text>共 0 道 · 已选 0 道</Text></span></div><ReviewCandidatesSkeleton /></section><aside className="review-preparation panel"><span className="prep-icon"><span className="skeleton-symbol skeleton-shimmer" style={{ width: 29, height: 29 }} /></span><h2><Text>今天的复习计划</Text></h2><div className="prep-selected"><span><Text>本次已选择</Text></span><strong><Text>0</Text><small><Text>道错题</Text></small></strong></div><div className="prep-steps">{['独立完成题目', '查看答案与分析', '记录本次掌握程度'].map((label, index) => <span key={label}><i>{index + 1}</i><Text>{label}</Text></span>)}</div><Button>开始复习</Button><small className="prep-hint"><Text>复习记录会同步更新掌握程度。</Text></small></aside></div></>;
}

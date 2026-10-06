import { useCallback, useEffect, useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardList, GraduationCap, LayoutGrid, LoaderCircle, LogOut, Plus, RotateCcw, Settings, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { api, json } from './api';
import { AppContext, sortDirectory } from './context';
import { Spinner } from './components';
import type { KnowledgePoint, Subject, User } from './types';
import { MistakesPage } from './pages/MistakesPage';
import { EditorPage } from './pages/EditorPage';
import { DetailPage } from './pages/DetailPage';
import { ReviewPage } from './pages/ReviewPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';

const navItems = [
  { path: '/mistakes', label: '我的错题', icon: LayoutGrid },
  { path: '/new', label: '录入错题', icon: Plus },
  { path: '/review', label: '复习', icon: RotateCcw },
  { path: '/stats', label: '学习统计', icon: TrendingUp },
  { path: '/settings', label: '设置', icon: Settings },
];

function AuthPage({ onLogin, onNotify }: { onLogin: (user: User) => void; onNotify: (msg: string) => void }) {
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api<{ user: User }>(registering ? '/auth/register' : '/auth/login', json({ username: username.trim(), password, ...(registering ? { inviteCode: inviteCode.trim() } : {}) }));
      onNotify(registering ? `欢迎，${result.user.username}！账号已创建。` : `欢迎回来，${result.user.username}！`);
      onLogin(result.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page">
    <aside className="auth-story">
      <a className="brand" href="/" aria-label="返回首页"><span className="brand-mark"><BookOpen size={24} /></span><span className="brand-text">拾题<span>智能错题整理系统</span></span></a>
      <div className="auth-story-body"><span className="small-pill"><Sparkles size={14} /> 给学习一点秩序</span><h1>每一次错题，<br />都是进步的起点<span>。</span></h1><p>把问题记下来，把知识串起来。<br />从整理到复习，让每一份努力都有回应。</p><div className="auth-note"><div className="auth-note-top"><span><ClipboardList size={18} /> 我的学习笔记</span><span className="note-dots">•••</span></div><div className="note-rule long" /><div className="note-rule" /><div className="auth-note-bottom"><span><CheckCircle2 size={17} /> 记录 · 整理 · 复习</span><span className="note-check"><CheckCircle2 size={25} /></span></div></div></div>
      <div className="auth-story-footer">小步积累，也能走很远。</div>
    </aside>
    <main className="auth-form-area"><div className="auth-form-wrap"><div className="auth-icon"><GraduationCap size={30} /></div><div className="eyebrow">欢迎来到你的学习空间</div><h2>{registering ? '开始积累，遇见进步' : '欢迎回来'}</h2><p className="auth-subtitle">{registering ? '使用邀请码创建账号，开启你的错题本。' : '登录后，继续整理你的学习收获。'}</p><form onSubmit={submit}><label className="field"><span>用户名</span><input required autoComplete="username" minLength={3} maxLength={32} placeholder="输入用户名" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label className="field"><span>密码</span><input required type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 8 : undefined} maxLength={128} placeholder={registering ? '至少 8 位密码' : '输入密码'} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{registering && <label className="field"><span>邀请码</span><input required placeholder="输入管理员提供的邀请码" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} /><small>邀请码由管理员生成。</small></label>}{error && <div className="form-error" role="alert">{error}</div>}<button className="button primary auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18} /> : <>{registering ? '创建账号' : '登录'}<ArrowRight size={18} /></>}</button></form><div className="auth-switch">{registering ? '已有账号？' : '还没有账号？'}<button onClick={() => { setRegistering(!registering); setError(''); }}>{registering ? '立即登录' : '使用邀请码注册'}</button></div><div className="auth-secure"><ShieldCheck size={15} /> 你的错题与笔记，仅对你可见</div></div></main>
  </div>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [directoryError, setDirectoryError] = useState('');
  const [path, setPath] = useState(window.location.hash.slice(1) || '/mistakes');

  useEffect(() => {
    api<{ user: User | null }>('/auth/me').then((result) => setUser(result.user)).catch(() => setUser(null)).finally(() => setInitializing(false));
    const onHash = () => { setPath(window.location.hash.slice(1) || '/mistakes'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => { toast[kind](message); }, []);

  const refreshDirectory = useCallback(async () => {
    try {
      const [nextSubjects, nextKnowledge] = await Promise.all([api<Subject[]>('/subjects'), api<KnowledgePoint[]>('/knowledge-points')]);
      setSubjects(nextSubjects);
      setKnowledgePoints(sortDirectory(nextKnowledge, nextSubjects));
      setDirectoryError('');
    } catch (err) {
      setDirectoryError((err as Error).message);
    }
  }, []);

  useEffect(() => { if (user) void refreshDirectory(); }, [user, refreshDirectory]);

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', json({}));
      setUser(null);
      setSubjects([]);
      setKnowledgePoints([]);
      window.location.hash = '/mistakes';
    } catch (err) { notify((err as Error).message, 'error'); }
  }, [notify]);

  const toaster = <ToastContainer position="top-right" autoClose={4500} transition={Slide} theme="dark" newestOnTop closeOnClick={false} />;

  if (initializing) return <div className="initial-loading"><span className="brand-mark"><BookOpen size={28} /></span><Spinner text="正在打开学习空间…" /></div>;
  if (!user) return <><AuthPage onLogin={(nextUser) => { setUser(nextUser); window.location.hash = '/mistakes'; }} onNotify={(msg) => toast.success(msg)} />{toaster}</>;

  const routePath = path.split('?')[0];
  const detailMatch = routePath.match(/^\/mistakes\/(\d+)(\/edit)?$/);
  const activePath = detailMatch ? '/mistakes' : routePath;
  let page;
  if (routePath === '/new') page = <EditorPage key="new" />;
  else if (detailMatch?.[2]) page = <EditorPage key={path} id={Number(detailMatch[1])} />;
  else if (detailMatch) page = <DetailPage key={path} id={Number(detailMatch[1])} />;
  else if (routePath === '/review') page = <ReviewPage key={path} />;
  else if (routePath === '/stats') page = <StatsPage />;
  else if (routePath === '/settings') page = <SettingsPage />;
  else page = <MistakesPage />;

  return <AppContext.Provider value={{ user, subjects, knowledgePoints, refreshDirectory, notify, logout }}><div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#/mistakes"><span className="brand-mark"><BookOpen size={23} /></span><span className="brand-text">拾题<span>智能错题整理系统</span></span></a><div className="sidebar-label">学习空间</div><nav className="navigation" aria-label="主导航">{navItems.map(({ path: itemPath, label, icon: Icon }) => <a key={itemPath} href={`#${itemPath}`} className={`nav-item ${activePath === itemPath ? 'active' : ''}`} aria-current={activePath === itemPath ? 'page' : undefined}><Icon size={19} strokeWidth={1.8} /><span>{label}</span>{activePath === itemPath && <span className="nav-active-dot" />}</a>)}</nav><div className="sidebar-bottom"><div className="sidebar-reminder"><span className="reminder-icon"><Sparkles size={19} /></span><strong>积累，是进步的开始</strong><p>把每道错题变成<br />下一次的正确答案。</p></div><div className="account"><a className="account-profile" href="#/settings"><span className="avatar">{user.username.slice(0, 1).toUpperCase()}</span><span className="account-name"><strong>{user.username}</strong><small>{user.role === 'admin' ? '管理员' : '我的账号'}</small></span><ChevronDown size={15} /></a><button className="icon-button" title="退出登录" aria-label="退出登录" onClick={logout}><LogOut size={17} /></button></div></div></aside>
    <div className="main-shell"><header className="topbar"><span className="topbar-label"><BookOpen size={15} /> 个人学习空间</span><div className="topbar-right"><span className="workspace-state"><span /> 手动整理，持续积累</span><span className="topbar-avatar">{user.username.slice(0, 1).toUpperCase()}</span></div></header><main className="main-content">{directoryError && <div className="inline-alert" role="alert">基础目录加载失败：{directoryError}<button onClick={refreshDirectory}>重试</button></div>}{page}<footer className="page-footer">每一次回顾，都离掌握更近一步。<span>拾题 · 让学习有迹可循</span></footer></main></div>
    {toaster}
  </div></AppContext.Provider>;
}

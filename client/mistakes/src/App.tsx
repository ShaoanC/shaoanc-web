import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, GraduationCap, LayoutGrid, LoaderCircle, LogOut, Plus, RotateCcw, Settings, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { api, json } from './api';
import { AppContext, sortDirectory } from './context';
import { GlobalLoadingProgress, LoadingContent, SlidingNavigation } from './motion';
import { LogoMark } from './Logo';
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
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page">
    <aside className="auth-story">
      <a className="brand" href="/" aria-label="返回首页"><LogoMark /><span className="brand-text">拾题<span>把错题，学明白。</span></span></a>
      <div className="auth-story-body"><span className="small-pill"><ClipboardList size={16} /> 你的个人错题本</span><h1>做错的题，<br />值得再想一遍。</h1><p>记录卡住你的那一步，梳理知识点。<br />再练一次，让「不熟」慢慢变成「掌握」。</p><div className="auth-note"><div className="auth-note-top"><span><ClipboardList size={18} /> 我的学习笔记</span><span className="note-dots">•••</span></div><div className="note-rule long" /><div className="note-rule" /><div className="auth-note-bottom"><span><CheckCircle2 size={17} /> 记录 · 整理 · 复习</span><span className="note-check"><CheckCircle2 size={25} /></span></div></div></div>
      <div className="auth-story-footer">记录问题 · 理清思路 · 回顾练习</div>
    </aside>
    <main className="auth-form-area"><div className="auth-form-wrap"><div className="auth-icon"><GraduationCap size={30} /></div><h2>{registering ? '开始积累，遇见进步' : '欢迎回来'}</h2><p className="auth-subtitle">{registering ? '使用邀请码创建账号，开启你的错题本。' : '登录后，继续整理你的学习收获。'}</p><form onSubmit={submit}><label className="field"><span>用户名</span><input required autoComplete="username" minLength={3} maxLength={32} placeholder="输入用户名" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label className="field"><span>密码</span><input required type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 8 : undefined} maxLength={128} placeholder={registering ? '至少 8 位密码' : '输入密码'} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{registering && <label className="field"><span>邀请码</span><input required placeholder="输入管理员提供的邀请码" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} /><small>邀请码由管理员生成。</small></label>}{error && <div className="form-error" role="alert">{error}</div>}<button className="button primary auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18} /> : <>{registering ? '创建账号' : '登录'}<ArrowRight size={18} /></>}</button></form><div className="auth-switch">{registering ? '已有账号？' : '还没有账号？'}<button onClick={() => { setRegistering(!registering); setError(''); }}>{registering ? '立即登录' : '使用邀请码注册'}</button></div><div className="auth-secure"><ShieldCheck size={15} /> 你的错题与笔记，仅对你可见</div></div></main>
  </div>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [directoryError, setDirectoryError] = useState('');
  const [path, setPath] = useState(window.location.hash.slice(1) || '/mistakes');
  const pendingWelcome = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const openingRoute = (window.location.hash.slice(1) || '/mistakes').split('?')[0];
    api<{ user: User | null }>('/auth/me').then((result) => {
      if (!active) return;
      if (result.user && ['/mistakes', '/'].includes(openingRoute)) {
        pendingWelcome.current = `欢迎回来，${result.user.username}！`;
      }
      setUser(result.user);
    }).catch(() => { if (active) setUser(null); }).finally(() => { if (active) setInitializing(false); });
    const onHash = () => { setPath(window.location.hash.slice(1) || '/mistakes'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => { active = false; window.removeEventListener('hashchange', onHash); };
  }, []);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => { toast[kind](message); }, []);

  useEffect(() => {
    if (user && pendingWelcome.current) {
      const message = pendingWelcome.current;
      pendingWelcome.current = null;
      notify(message);
    }
  }, [user, notify]);

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
      notify('已退出登录。');
      setUser(null);
      setSubjects([]);
      setKnowledgePoints([]);
      window.location.hash = '/mistakes';
    } catch (err) { notify((err as Error).message, 'error'); }
  }, [notify]);

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

  const workspace = user ? <AppContext.Provider value={{ user, updateUser: setUser, subjects, knowledgePoints, refreshDirectory, notify, logout }}><div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#/mistakes"><LogoMark /><span className="brand-text">拾题<span>把错题，学明白。</span></span></a><div className="sidebar-label">学习空间</div><SlidingNavigation value={activePath} ariaLabel="主导航" items={navItems.map(({ path: itemPath, label, icon: Icon }) => ({ id: itemPath, href: `#${itemPath}`, label: <><Icon size={19} strokeWidth={1.8} /><span>{label}</span></> }))} /><div className="sidebar-bottom"><div className="sidebar-reminder"><span className="reminder-icon"><RotateCcw size={22} /></span><strong>记下来，再想一遍。</strong><p>记录思路，也记录进步。<br />学习从每一次回顾开始。</p><a href="#/review">打开复习页</a></div><div className="account"><a className="account-profile" href="#/settings"><span className="avatar">{user.avatar ? <img src={user.avatar} alt="" /> : user.username.slice(0, 1).toUpperCase()}</span><span className="account-name"><strong title={user.username}>{user.username}</strong><small>{user.role === 'admin' ? '管理员' : '我的账号'}</small></span></a><button className="icon-button" title="退出登录" aria-label="退出登录" onClick={logout}><LogOut size={17} /></button></div></div></aside>
    <div className="main-shell"><header className="topbar"><span className="topbar-label"><BookOpen size={15} /> 个人学习空间</span><div className="topbar-right"><a className="workspace-state" href="/"><ArrowRight size={16} /> 返回个人主页</a><a className="topbar-avatar" href="#/settings" aria-label="账号设置">{user.avatar ? <img src={user.avatar} alt="" /> : user.username.slice(0, 1).toUpperCase()}</a></div></header><main className="main-content">{directoryError && <div className="inline-alert" role="alert">基础目录加载失败：{directoryError}<button onClick={refreshDirectory}>重试</button></div>}{page}<footer className="page-footer">每一次回顾，都离掌握更近一步。<span>拾题 · 让学习有迹可循</span></footer></main></div>
  </div></AppContext.Provider> : <AuthPage onLogin={(nextUser) => { setUser(nextUser); setPath('/mistakes'); window.location.hash = '/mistakes'; }} onNotify={(msg) => { pendingWelcome.current = msg; }} />;

  return <><GlobalLoadingProgress /><LoadingContent loading={initializing} kind="shell" className="app-entrance">{!initializing && workspace}</LoadingContent></>;
}

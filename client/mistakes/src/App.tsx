import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, GraduationCap, LayoutGrid, LoaderCircle, LogOut, Plus, RotateCcw, Settings, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { api, json } from './api';
import { AppContext, sortDirectory } from './context';
import { GlobalLoadingProgress, LoadingContent, SlidingNavigation } from './motion';
import { LogoMark } from './Logo';
import { FriendlyCaptcha, type CaptchaState } from './FriendlyCaptcha';
import { AiTasksProvider, AiTasksButton } from './AiTasks';
import { PhotoUploadsProvider } from './PhotoUploads';
import { PageLoadBoundary } from './PageLoadBoundary';
import type { KnowledgePoint, Subject, User } from './types';

const MistakesPage = lazy(() => import('./pages/MistakesPage').then((module) => ({ default: module.MistakesPage })));
const EditorPage = lazy(() => import('./pages/EditorPage').then((module) => ({ default: module.EditorPage })));
const DetailPage = lazy(() => import('./pages/DetailPage').then((module) => ({ default: module.DetailPage })));
const ReviewPage = lazy(() => import('./pages/ReviewPage').then((module) => ({ default: module.ReviewPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then((module) => ({ default: module.StatsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const PageImportsPage = lazy(() => import('./PageImports').then((module) => ({ default: module.PageImportsPage })));
const AiTasksPage = lazy(() => import('./AiTaskManager').then((module) => ({ default: module.AiTasksPage })));

const navItems = [
  { path: '/mistakes', label: '我的错题', icon: LayoutGrid },
  { path: '/new', label: '录入错题', icon: Plus },
  { path: '/review', label: '复习', icon: RotateCcw },
  { path: '/stats', label: '学习统计', icon: TrendingUp },
  { path: '/ai-tasks', label: 'AI 任务', icon: Sparkles },
  { path: '/settings', label: '设置', icon: Settings },
];

function AuthPage({ onLogin, onNotify }: { onLogin: (user: User) => void; onNotify: (msg: string) => void }) {
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [captchaConfig, setCaptchaConfig] = useState<{ enabled: boolean; sitekey: string } | null>(null);
  const [configError, setConfigError] = useState('');
  const [configAttempt, setConfigAttempt] = useState(0);
  const [captchaState, setCaptchaState] = useState<CaptchaState>({ status: 'pending', response: '' });
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    setCaptchaConfig(null);
    setConfigError('');
    api<{ enabled: boolean; sitekey: string }>('/auth/config').then((config) => {
      if (active) setCaptchaConfig(config);
    }).catch((err: Error) => {
      if (active) setConfigError(err.message);
    });
    return () => { active = false; };
  }, [configAttempt]);

  const canSubmit = captchaConfig !== null && (!captchaConfig.enabled
    || captchaState.status === 'complete'
    || (!registering && captchaState.status === 'error'));

  function resetCaptcha() {
    setCaptchaState({ status: 'pending', response: '' });
    setCaptchaAttempt((attempt) => attempt + 1);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current || !canSubmit) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await api<{ user: User }>(registering ? '/auth/register' : '/auth/login', json({ username: username.trim(), password, captchaResponse: captchaConfig?.enabled ? captchaState.response : '', ...(registering ? { inviteCode: inviteCode.trim() } : {}) }));
      onNotify(registering ? `欢迎，${result.user.username}！账号已创建。` : `欢迎回来，${result.user.username}！`);
      onLogin(result.user);
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
      resetCaptcha();
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return <div className="auth-page">
    <aside className="auth-story">
      <a className="brand" href="/" aria-label="返回首页"><LogoMark /><span className="brand-text">拾题<span>把错题，学明白。</span></span></a>
      <div className="auth-story-body"><span className="small-pill"><ClipboardList size={16} /> 你的个人错题本</span><h1>做错的题，<br />值得再想一遍。</h1><p>记录卡住你的那一步，梳理知识点。<br />再练一次，让「不熟」慢慢变成「掌握」。</p><div className="auth-note"><div className="auth-note-top"><span><ClipboardList size={18} /> 我的学习笔记</span><span className="note-dots">•••</span></div><div className="note-rule long" /><div className="note-rule" /><div className="auth-note-bottom"><span><CheckCircle2 size={17} /> 记录 · 整理 · 复习</span><span className="note-check"><CheckCircle2 size={25} /></span></div></div></div>
      <div className="auth-story-footer">记录问题 · 理清思路 · 回顾练习</div>
    </aside>
    <main className="auth-form-area"><div className="auth-form-wrap"><div className="auth-icon"><GraduationCap size={30} /></div><h2>{registering ? '开始积累，遇见进步' : '欢迎回来'}</h2><p className="auth-subtitle">{registering ? '使用邀请码创建账号，开启你的错题本。' : '登录后，继续整理你的学习收获。'}</p><form onSubmit={submit}>
      <label className="field"><span>用户名</span><input required autoComplete="username" minLength={3} maxLength={32} placeholder="输入用户名" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
      <label className="field"><span>密码</span><input required type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 8 : undefined} maxLength={128} placeholder={registering ? '至少 8 位密码' : '输入密码'} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {registering && <label className="field"><span>邀请码</span><input required placeholder="输入管理员提供的邀请码" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} /><small>邀请码由管理员生成。</small></label>}
      {!captchaConfig && (configError
        ? <div className="auth-captcha-notice is-error" role="alert"><span>安全配置加载失败：{configError}</span><button type="button" onClick={() => setConfigAttempt((attempt) => attempt + 1)}>重新加载</button></div>
        : <div className="auth-captcha-loading" role="status"><LoaderCircle className="spin" size={16} /> 正在加载安全验证…</div>)}
      {captchaConfig?.enabled && <div className="auth-captcha">
        <FriendlyCaptcha key={`${registering}-${captchaAttempt}`} sitekey={captchaConfig.sitekey} resetKey={captchaAttempt} onChange={setCaptchaState} />
        {(captchaState.status === 'error' || captchaState.status === 'expired') && <div className="auth-captcha-notice" role="status"><span>{captchaState.status === 'expired' ? '验证已过期，请重新验证。' : registering ? '人机验证暂不可用，请重试后再注册。' : '人机验证暂不可用，你可以重试或尝试登录。'}</span><button type="button" disabled={busy} onClick={resetCaptcha}>重新验证</button></div>}
      </div>}
      {error && <div className="form-error" role="alert">{error}</div>}
      <button className="button primary auth-submit" disabled={busy || !canSubmit}>{busy ? <LoaderCircle className="spin" size={18} /> : <>{registering ? '创建账号' : '登录'}<ArrowRight size={18} /></>}</button>
    </form><div className="auth-switch">{registering ? '已有账号？' : '还没有账号？'}<button disabled={busy} onClick={() => { if (submitting.current) return; setRegistering(!registering); setError(''); resetCaptcha(); }}>{registering ? '立即登录' : '使用邀请码注册'}</button></div><div className="auth-secure"><ShieldCheck size={15} /> 你的错题与笔记，仅对你可见</div></div></main>
  </div>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [directoryError, setDirectoryError] = useState('');
  const [path, setPath] = useState(window.location.hash.slice(1) || '/mistakes');
  // A new draft keeps its editor instance when a task link adopts the saved record URL.
  const [newEditor, setNewEditor] = useState<{ session: number; recordId: number | null }>({ session: 0, recordId: null });
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
    const onHash = (event: HashChangeEvent) => {
      const nextPath = window.location.hash.slice(1) || '/mistakes';
      if (!window.dispatchEvent(new CustomEvent('mistakes:before-navigate', { cancelable: true, detail: { path: nextPath } }))) {
        window.history.replaceState(null, '', new URL(event.oldURL).hash || '#/mistakes');
        return;
      }
      const nextRoute = nextPath.split('?')[0];
      setNewEditor((current) => {
        if (nextRoute === '/new') return { session: current.session + 1, recordId: null };
        if (current.recordId && nextRoute !== `/mistakes/${current.recordId}/edit`) return { ...current, recordId: null };
        return current;
      });
      setPath(nextPath); window.scrollTo(0, 0);
    };
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
    if (!window.dispatchEvent(new Event('mistakes:before-logout', { cancelable: true }))) return;
    window.dispatchEvent(new Event('mistakes:session-ending'));
    try {
      await api('/auth/logout', json({}));
      notify('已退出登录。');
      setUser(null);
      setSubjects([]);
      setKnowledgePoints([]);
      window.location.hash = '/mistakes';
    } catch (err) { window.dispatchEvent(new Event('mistakes:session-resumed')); notify((err as Error).message, 'error'); }
  }, [notify]);

  const routePath = path.split('?')[0];
  const detailMatch = routePath.match(/^\/mistakes\/(\d+)(\/edit)?$/);
  const activePath = detailMatch ? '/mistakes' : routePath === '/page-imports' ? '/new' : routePath;
  let page;
  if (routePath === '/new') page = <EditorPage key={`new-${newEditor.session}`} onCreated={(recordId) => setNewEditor((current) => ({ ...current, recordId }))} />;
  else if (routePath === '/page-imports') page = <PageImportsPage />;
  else if (detailMatch?.[2]) page = <EditorPage key={newEditor.recordId === Number(detailMatch[1]) ? `new-${newEditor.session}` : routePath} id={Number(detailMatch[1])} />;
  else if (detailMatch) page = <DetailPage key={path} id={Number(detailMatch[1])} />;
  else if (routePath === '/review') page = <ReviewPage key={path} />;
  else if (routePath === '/stats') page = <StatsPage />;
  else if (routePath === '/ai-tasks') page = <AiTasksPage />;
  else if (routePath === '/settings') page = <SettingsPage />;
  else page = <MistakesPage />;

  const workspace = user ? <AppContext.Provider value={{ user, updateUser: setUser, subjects, knowledgePoints, refreshDirectory, notify, logout }}><AiTasksProvider key={user.id}><PhotoUploadsProvider><div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#/mistakes"><LogoMark /><span className="brand-text">拾题<span>把错题，学明白。</span></span></a><div className="sidebar-label">学习空间</div><SlidingNavigation value={activePath} ariaLabel="主导航" items={navItems.map(({ path: itemPath, label, icon: Icon }) => ({ id: itemPath, href: `#${itemPath}`, label: <><Icon size={19} strokeWidth={1.8} /><span>{label}</span></> }))} /><div className="sidebar-bottom"><div className="sidebar-reminder"><span className="reminder-icon"><RotateCcw size={22} /></span><strong>温故而知新，可以为师矣</strong><a href="#/review">打开复习页</a></div><div className="account"><a className="account-profile" href="#/settings"><span className="avatar">{user.avatar ? <img src={user.avatar} alt="" /> : user.username.slice(0, 1).toUpperCase()}</span><span className="account-name"><strong title={user.username}>{user.username}</strong><small>{user.role === 'admin' ? '管理员' : '我的账号'}</small></span></a><button className="icon-button" title="退出登录" aria-label="退出登录" onClick={logout}><LogOut size={17} /></button></div></div></aside>
    <div className="main-shell"><header className="topbar"><span className="topbar-label"><BookOpen size={15} /> 个人学习空间</span><div className="topbar-right"><AiTasksButton /><a className="workspace-state" href="/"><ArrowRight size={16} /> 返回个人主页</a><a className="topbar-avatar" href="#/settings" aria-label="账号设置">{user.avatar ? <img src={user.avatar} alt="" /> : user.username.slice(0, 1).toUpperCase()}</a></div></header><main className="main-content">{directoryError && <div className="inline-alert" role="alert">基础目录加载失败：{directoryError}<button onClick={refreshDirectory}>重试</button></div>}<PageLoadBoundary resetKey={routePath}><Suspense fallback={<p role="status">正在加载页面…</p>}>{page}</Suspense></PageLoadBoundary><footer className="page-footer"><span>拾题 · © {new Date().getFullYear()} ShaoanC</span></footer></main></div>
  </div></PhotoUploadsProvider></AiTasksProvider></AppContext.Provider> : <AuthPage onLogin={(nextUser) => { setUser(nextUser); setPath('/mistakes'); window.location.hash = '/mistakes'; }} onNotify={(msg) => { pendingWelcome.current = msg; }} />;

  return <><GlobalLoadingProgress /><LoadingContent loading={initializing} kind="shell" className="app-entrance">{!initializing && workspace}</LoadingContent></>;
}

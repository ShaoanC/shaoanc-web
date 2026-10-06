import { useEffect, useState } from 'react';
import { Check, ChevronRight, Copy, KeyRound, Layers, LoaderCircle, LockKeyhole, Pencil, Plus, ShieldCheck, Trash2, Users } from 'lucide-react';
import { api, formatDate, json } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { EmptyState, ErrorState, Modal, PageHeader, Spinner } from '../components';
import type { Invite, KnowledgePoint, User } from '../types';

export function SettingsPage() {
  const { user, subjects, knowledgePoints, refreshDirectory, notify } = useApp();
  const [tab, setTab] = useState('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [changingUser, setChangingUser] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [pointModal, setPointModal] = useState<{ point?: KnowledgePoint } | null>(null);
  const [pointName, setPointName] = useState('');
  const [parentId, setParentId] = useState('');
  const [pointError, setPointError] = useState('');
  const [pointBusy, setPointBusy] = useState(false);
  const [deletePoint, setDeletePoint] = useState<KnowledgePoint | null>(null);

  useEffect(() => { if (!subjectId && subjects.length) setSubjectId(subjects[0].id); }, [subjects, subjectId]);
  useEffect(() => {
    if (user.role !== 'admin') return;
    setAdminLoading(true);
    Promise.all([api<Invite[]>('/admin/invites'), api<User[]>('/admin/users')]).then(([codes, accounts]) => { setInvites(codes); setUsers(accounts); }).catch((err) => setAdminError(err.message)).finally(() => setAdminLoading(false));
  }, [user.role]);

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError('');
    if (newPassword !== repeatPassword) { setPasswordError('两次输入的新密码不一致。'); return; }
    setPasswordBusy(true);
    try {
      await api('/auth/password', json({ currentPassword, newPassword }, 'PATCH'));
      setCurrentPassword(''); setNewPassword(''); setRepeatPassword('');
      notify('密码已修改。');
    } catch (err) { setPasswordError((err as Error).message); } finally { setPasswordBusy(false); }
  }

  async function generateInvite() {
    setGenerating(true);
    try { const invite = await api<Invite>('/admin/invites', json({})); setInvites((current) => [invite, ...current]); notify('邀请码已生成。'); }
    catch (err) { notify((err as Error).message, 'error'); } finally { setGenerating(false); }
  }

  async function copyInvite(code: string) {
    try { await navigator.clipboard.writeText(code); notify('邀请码已复制。'); } catch { notify('复制未成功，请选择邀请码文本后手动复制。', 'error'); }
  }

  async function toggleUser(account: User) {
    setChangingUser(account.id);
    try {
      const changed = await api<User>(`/admin/users/${account.id}`, json({ active: !account.active }, 'PATCH'));
      setUsers((current) => current.map((item) => item.id === account.id ? changed : item));
      notify(account.active ? '账号已停用。' : '账号已启用。');
    } catch (err) { notify((err as Error).message, 'error'); } finally { setChangingUser(null); }
  }

  async function resetAccountPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!resetUser) return;
    setResetBusy(true); setResetError('');
    try {
      await api(`/admin/users/${resetUser.id}`, json({ password: resetPassword }, 'PATCH'));
      setResetUser(null); setResetPassword(''); notify('账号密码已重置。');
    } catch (err) { setResetError((err as Error).message); } finally { setResetBusy(false); }
  }

  const points = knowledgePoints.filter((point) => point.subjectId === subjectId);
  function openPoint(point?: KnowledgePoint) {
    setPointName(point?.name || ''); setParentId(point?.parentId ? String(point.parentId) : ''); setPointError(''); setPointModal({ point });
  }
  async function savePoint(event: React.FormEvent) {
    event.preventDefault();
    setPointBusy(true); setPointError('');
    try {
      await api(pointModal?.point ? `/knowledge-points/${pointModal.point.id}` : '/knowledge-points', json({ subjectId, name: pointName.trim(), parentId: parentId ? Number(parentId) : null }, pointModal?.point ? 'PATCH' : 'POST'));
      await refreshDirectory(); setPointModal(null); notify('知识点已保存。');
    } catch (err) { setPointError((err as Error).message); } finally { setPointBusy(false); }
  }
  async function removePoint() {
    if (!deletePoint) return;
    setPointBusy(true);
    try { await api(`/knowledge-points/${deletePoint.id}`, { method: 'DELETE' }); await refreshDirectory(); setDeletePoint(null); notify('知识点已删除，题目和复习记录已保留。'); }
    catch (err) { notify((err as Error).message, 'error'); } finally { setPointBusy(false); }
  }

  return <>
    <PageHeader eyebrow="为学习空间做一点整理" title="设置" description={user.role === 'admin' ? '管理账号安全、邀请码与学习目录。' : '管理你的账号，安心积累每一份学习收获。'} />
    {user.role === 'admin' && <div className="settings-tabs" role="tablist" aria-label="设置分类">{[{ id: 'account', label: '账号安全', icon: ShieldCheck }, { id: 'invites', label: '邀请码', icon: KeyRound }, { id: 'users', label: '用户账号', icon: Users }, { id: 'knowledge', label: '知识点目录', icon: Layers }].map(({ id, label, icon: Icon }) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}><Icon size={17} />{label}</button>)}</div>}
    {tab === 'account' && <div className="settings-account-layout"><section className="panel password-panel"><div className="panel-title"><span className="panel-title-icon violet"><LockKeyhole size={18} /></span><div><h2>修改密码</h2><p>设置一个只有你知道的密码。</p></div></div><form onSubmit={changePassword}><label className="field"><span>当前密码</span><input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="输入当前密码" /></label><label className="field"><span>新密码</span><input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="至少 8 位密码" /></label><label className="field"><span>确认新密码</span><input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} placeholder="再次输入新密码" /></label>{passwordError && <div className="form-error" role="alert">{passwordError}</div>}<button className="button primary" disabled={passwordBusy}>{passwordBusy ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />} 保存新密码</button></form></section><aside className="panel account-summary"><span className="large-avatar">{user.username.slice(0, 1).toUpperCase()}</span><h2>{user.username}</h2><span className="small-pill">{user.role === 'admin' ? '管理员账号' : '学习账号'}</span><div className="account-summary-note"><ShieldCheck size={20} /><strong>专属于你的错题本</strong><p>整理的题目、笔记与复习记录<br />会保存在你的账号下。</p></div></aside></div>}
    {['invites', 'users'].includes(tab) && (adminLoading ? <Spinner /> : adminError ? <ErrorState message={adminError} /> : tab === 'invites' ? <section className="panel admin-panel"><div className="admin-panel-heading"><div><h2>邀请新同学</h2><p>每个邀请码可创建一个账号，使用后失效。</p></div><button className="button primary" disabled={generating} onClick={generateInvite}>{generating ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />} 生成邀请码</button></div>{invites.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>邀请码</th><th>状态</th><th>生成时间</th><th>操作</th></tr></thead><tbody>{invites.map((invite) => <tr key={invite.id}><td><code className="invite-code">{invite.code}</code></td><td><span className={`simple-badge ${invite.usedCount >= invite.maxUses ? 'neutral' : invite.active && (!invite.expiresAt || new Date(invite.expiresAt) > new Date()) ? 'green' : 'neutral'}`}>{invite.usedCount >= invite.maxUses ? '已使用' : !invite.active ? '已停用' : invite.expiresAt && new Date(invite.expiresAt) <= new Date() ? '已过期' : '可使用'}</span></td><td>{formatDate(invite.createdAt, true)}</td><td><button className="table-button" onClick={() => void copyInvite(invite.code)}><Copy size={14} /> 复制</button></td></tr>)}</tbody></table></div> : <EmptyState title="还没有邀请码" description="生成一个邀请码，邀请同学开始积累自己的错题。" />}</section> : <section className="panel admin-panel"><div className="admin-panel-heading"><div><h2>用户账号</h2><p>管理账号使用状态，或为用户重置密码。</p></div><span className="count-pill">{users.length} 个账号</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>用户</th><th>角色</th><th>状态</th><th>操作</th></tr></thead><tbody>{users.map((account) => <tr key={account.id}><td><div className="table-user"><span className="avatar">{account.username.slice(0, 1).toUpperCase()}</span><strong>{account.username}</strong>{account.id === user.id && <span className="current-user">当前账号</span>}</div></td><td>{account.role === 'admin' ? '管理员' : '用户'}</td><td><span className={`simple-badge ${account.active ? 'green' : 'neutral'}`}>{account.active ? '正常' : '已停用'}</span></td><td><div className="table-actions"><button className="table-button" onClick={() => { setResetUser(account); setResetPassword(''); setResetError(''); }}><KeyRound size={14} /> 重置密码</button>{account.id !== user.id && <button className={`table-button ${account.active ? 'danger-text' : ''}`} disabled={changingUser === account.id} onClick={() => void toggleUser(account)}>{changingUser === account.id ? '处理中…' : account.active ? '停用' : '启用'}</button>}</div></td></tr>)}</tbody></table></div></section>)}
    {tab === 'knowledge' && <section className="panel admin-panel"><div className="admin-panel-heading"><div><h2>知识点目录</h2><p>维护共享的知识点，可设置父级来整理知识层次。</p></div><button className="button primary" disabled={!subjectId} onClick={() => openPoint()}><Plus size={17} /> 新建知识点</button></div><div className="subject-tabs">{subjects.map((subject) => <button key={subject.id} className={subjectId === subject.id ? 'active' : ''} onClick={() => setSubjectId(subject.id)}>{subject.name}<span>{knowledgePoints.filter((point) => point.subjectId === subject.id).length}</span></button>)}</div>{points.length ? <div className="directory-list">{points.map((point) => <div className={`directory-row ${point.parentId ? 'child' : ''}`} key={point.id}><span className="directory-icon">{point.parentId ? <ChevronRight size={15} /> : <Layers size={16} />}</span><div className="directory-copy"><strong>{point.name}</strong>{point.parentId && <small>父级：{knowledgePoints.find((item) => item.id === point.parentId)?.name}</small>}</div><div className="directory-actions"><button className="icon-button" aria-label={`编辑${point.name}`} onClick={() => openPoint(point)}><Pencil size={16} /></button><button className="icon-button danger-text" aria-label={`删除${point.name}`} onClick={() => setDeletePoint(point)}><Trash2 size={16} /></button></div></div>)}</div> : <EmptyState title="这个学科还没有知识点" description="建立知识点目录，让错题归类更清晰。" />}</section>}
    {resetUser && <Modal title={`重置 ${resetUser.username} 的密码`} onClose={() => setResetUser(null)}><form onSubmit={resetAccountPassword}><p className="modal-description">保存后，用户需要使用新密码登录。</p><label className="field"><span>新密码</span><input type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="至少 8 位密码" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} /></label>{resetError && <div className="form-error" role="alert">{resetError}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={() => setResetUser(null)}>取消</button><button className="button primary" disabled={resetBusy}>{resetBusy ? '正在保存…' : '重置密码'}</button></div></form></Modal>}
    {pointModal && <Modal title={pointModal.point ? '编辑知识点' : '新建知识点'} onClose={() => setPointModal(null)}><form onSubmit={savePoint}><p className="modal-description">学科：{subjects.find((subject) => subject.id === subjectId)?.name}</p><label className="field"><span>知识点名称</span><input required maxLength={100} value={pointName} onChange={(event) => setPointName(event.target.value)} placeholder="例如：一元二次方程" /></label><label className="field"><span>父级知识点</span><select value={parentId} onChange={(event) => setParentId(event.target.value)}><option value="">无父级（一级知识点）</option>{points.filter((point) => point.id !== pointModal.point?.id).map((point) => <option key={point.id} value={point.id}>{knowledgeLabel(knowledgePoints, point.id)}</option>)}</select></label>{pointError && <div className="form-error" role="alert">{pointError}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={() => setPointModal(null)}>取消</button><button className="button primary" disabled={pointBusy}>{pointBusy ? '正在保存…' : '保存知识点'}</button></div></form></Modal>}
    {deletePoint && <Modal title={`删除「${deletePoint.name}」？`} onClose={() => setDeletePoint(null)}><p className="modal-description">题目与复习记录会保留，关联到此知识点的标注将被清除。如有下级知识点，请先移动或删除下级。</p><div className="modal-actions"><button className="button secondary" onClick={() => setDeletePoint(null)}>取消</button><button className="button danger" disabled={pointBusy} onClick={removePoint}>{pointBusy ? '正在删除…' : '删除知识点'}</button></div></Modal>}
  </>;
}

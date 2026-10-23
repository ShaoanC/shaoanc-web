import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Clock3, DatabaseBackup, Download, LoaderCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { api, json } from './api';
import { useApp } from './context';
import { EmptyState, ErrorState, Modal } from './components';
import { LoadingContent } from './motion';
import type { Backup, BackupSettings as BackupConfiguration } from './types';
import './backup-settings.css';

type BackupList = { backups: Backup[]; current: Backup | null; readOnly: boolean };
type ScheduleDraft = Pick<BackupConfiguration, 'enabled' | 'time' | 'retention'>;

const sourceLabels: Record<Backup['source'], string> = { manual: '手动备份', automatic: '自动备份', 'pre-restore': '恢复前回退包' };
const stageLabels: Record<Backup['stage'], string> = { waiting: '等待正在执行的任务完成', snapshot: '正在快照数据库', copying: '正在复制图片与配置', compressing: '正在压缩归档', completed: '已完成', failed: '备份失败', interrupted: '已中断' };
const runLabels: Record<string, string> = { completed: '成功', failed: '失败', interrupted: '已中断', skipped: '已跳过', running: '正在执行' };

function backupTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
}

function backupSize(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BackupSettings() {
  const { notify } = useApp();
  const [list, setList] = useState<BackupList | null>(null);
  const [settings, setSettings] = useState<BackupConfiguration | null>(null);
  const [draft, setDraft] = useState<ScheduleDraft>({ enabled: false, time: '03:00', retention: 7 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Backup | null>(null);
  const [deleting, setDeleting] = useState(false);
  const alive = useRef(true);
  const refreshing = useRef(false);
  const scheduleInitialized = useRef(false);

  const refresh = useCallback(async (initial = false) => {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      const [nextList, nextSettings] = await Promise.all([
        api<BackupList>('/admin/backups', {}, { background: !initial }),
        api<BackupConfiguration>('/admin/backups/settings', {}, { background: !initial }),
      ]);
      if (!alive.current) return;
      setList(nextList);
      setSettings(nextSettings);
      if (initial || !scheduleInitialized.current) {
        setDraft({ enabled: nextSettings.enabled, time: nextSettings.time, retention: nextSettings.retention });
        scheduleInitialized.current = true;
      }
      setLoadError('');
      window.dispatchEvent(new CustomEvent('mistakes:backup-status', { detail: { readOnly: nextList.readOnly } }));
    } catch (err) {
      if (alive.current) setLoadError((err as Error).message);
    } finally {
      refreshing.current = false;
      if (alive.current && initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void refresh(true);
    const interval = window.setInterval(() => { if (!document.hidden) void refresh(); }, 3000);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => { alive.current = false; window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [refresh]);

  async function createBackup() {
    setCreating(true);
    setActionError('');
    try {
      const backup = await api<Backup>('/admin/backups', json({}));
      setList((current) => ({ backups: [backup, ...(current?.backups || []).filter((item) => item.id !== backup.id)], current: backup, readOnly: true }));
      window.dispatchEvent(new CustomEvent('mistakes:backup-status', { detail: { readOnly: true } }));
      notify('备份已开始，可以留在页面查看进度。');
      await refresh();
    } catch (err) { setActionError((err as Error).message); notify((err as Error).message, 'error'); }
    finally { setCreating(false); }
  }

  async function saveSchedule(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setActionError('');
    try {
      const next = await api<BackupConfiguration>('/admin/backups/settings', json(draft, 'PATCH'));
      setSettings(next);
      setDraft({ enabled: next.enabled, time: next.time, retention: next.retention });
      notify('自动备份设置已保存。');
    } catch (err) { setActionError((err as Error).message); notify((err as Error).message, 'error'); }
    finally { setSaving(false); }
  }

  async function deleteBackup() {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError('');
    try {
      await api(`/admin/backups/${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' });
      setList((current) => current && { ...current, backups: current.backups.filter((item) => item.id !== deleteTarget.id) });
      setDeleteTarget(null);
      notify('备份已删除。');
    } catch (err) { setActionError((err as Error).message); notify((err as Error).message, 'error'); }
    finally { setDeleting(false); }
  }

  const changed = settings && (settings.enabled !== draft.enabled || settings.time !== draft.time || settings.retention !== draft.retention);
  const current = list?.current;
  const backups = list?.backups || [];

  return <LoadingContent loading={loading} kind="settings">
    {!list || !settings ? <ErrorState message={loadError || '备份信息暂时无法加载。'} retry={() => { setLoading(true); void refresh(true); }} /> : <div className="backup-settings">
      {loadError && <div className="inline-alert" role="alert">备份状态更新失败：{loadError}<button onClick={() => void refresh()}>重试</button></div>}
      {actionError && <div className="form-error" role="alert">{actionError}</div>}
      <section className="panel backup-create-panel">
        <div className="backup-heading"><div className="panel-title"><span className="panel-title-icon"><DatabaseBackup size={22} /></span><div><h2>全站数据备份</h2><p>保留一份完整记录，为恢复与迁移做好准备。</p></div></div><button className="button primary" disabled={creating || Boolean(current)} onClick={() => void createBackup()}>{creating || current ? <LoaderCircle className="spin" size={17} /> : <DatabaseBackup size={17} />}{creating ? '正在启动…' : current ? '备份进行中' : '立即备份'}</button></div>
        <p className="backup-contents">包含所有账号、错题、知识点、复习记录、回收站、图片和服务器配置；浏览器中的未保存草稿不包含在内。</p>
        <div className="backup-sensitive"><ShieldCheck size={19} /><p>备份含所有账号数据，以及 <code>.env</code>、<code>.env.ai</code> 中的密钥。请妥善保管下载文件。</p></div>
        {current && <div className="backup-progress" role="status"><LoaderCircle className="spin" size={18} /><div><strong>{stageLabels[current.stage]}</strong><p>{list.readOnly ? '当前暂时只读，已输入的内容会保留，请稍后重试保存。' : '快照已完成，可继续保存和录题，归档仍在后台进行。'}</p></div></div>}
      </section>

      <section className="panel backup-schedule-panel">
        <div className="panel-title"><span className="panel-title-icon"><Clock3 size={22} /></span><div><h2>自动备份</h2><p>每天按北京时间执行；停服期间错过的备份不会补跑。</p></div></div>
        <form onSubmit={saveSchedule}>
          <label className="backup-enable"><input type="checkbox" checked={draft.enabled} disabled={saving} onChange={(event) => setDraft({ ...draft, enabled: event.target.checked })} /><span>启用每日自动备份</span></label>
          <div className="backup-schedule-fields"><label className="field"><span>每天执行时间</span><input type="time" required value={draft.time} disabled={saving} onChange={(event) => setDraft({ ...draft, time: event.target.value })} /><small>北京时间（UTC+8）</small></label><label className="field"><span>自动备份保留份数</span><input type="number" required min={1} max={365} step={1} value={draft.retention} disabled={saving} onChange={(event) => setDraft({ ...draft, retention: Number(event.target.value) })} /><small>新备份成功后清理旧份，手动备份不自动删除。</small></label></div>
          <div className="backup-schedule-footer"><button className="button primary" disabled={saving || !changed}>{saving ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{saving ? '正在保存…' : '保存自动备份设置'}</button><div className="backup-schedule-status"><p>下次执行：<strong>{settings.enabled ? backupTime(settings.nextRunAt) : '未开启'}</strong></p><p>最近结果：{settings.lastRun ? <><strong>{runLabels[settings.lastRun.status] || settings.lastRun.status}</strong> · {backupTime(settings.lastRun.at)}{settings.lastRun.message && <span className="backup-last-message">{settings.lastRun.message}</span>}</> : '还没有自动备份记录'}</p></div></div>
        </form>
      </section>

      <section className="panel backup-history-panel">
        <div className="backup-heading"><div><h2>备份记录</h2><p>时间均为北京时间。下载后可用于停服恢复。</p></div><span className="count-pill">{backups.length} 份</span></div>
        {backups.length ? <ul className="backup-list">{backups.map((backup) => <li className="backup-record" key={backup.id}>
          <div className="backup-record-info"><time dateTime={backup.createdAt}>{backupTime(backup.createdAt)}</time><span>{sourceLabels[backup.source]}<span className="backup-size">{backupSize(backup.size)}</span></span>{backup.error && <p className="backup-record-error">{backup.error}</p>}</div>
          <span className={`backup-record-state is-${backup.status}`}>{backup.status === 'running' && <LoaderCircle className="spin" size={15} />}{stageLabels[backup.stage]}</span>
          <div className="backup-record-actions">{backup.status === 'completed' && <a className="button secondary" href={`/api/mistakes/admin/backups/${encodeURIComponent(backup.id)}/download`} download><Download size={16} />下载</a>}<button className="button ghost danger-text" disabled={backup.status === 'running'} onClick={() => { setActionError(''); setDeleteTarget(backup); }} aria-label={`删除 ${backupTime(backup.createdAt)} 的备份`}><Trash2 size={16} />删除</button></div>
        </li>)}</ul> : <EmptyState title="还没有备份" description="点击“立即备份”，保存第一份全站数据。" />}
      </section>
      <p className="backup-restore-note">恢复需要先停止服务，在服务器执行 <code>npm run backup:restore -- &lt;备份包&gt; --confirm</code>，完成后重新启动。恢复前会自动保存一份当前数据回退包。</p>
    </div>}
    {deleteTarget && <Modal title="删除这份备份？" onClose={() => { if (!deleting) setDeleteTarget(null); }}><p className="modal-description">将删除 {backupTime(deleteTarget.createdAt)} 的{sourceLabels[deleteTarget.source]}，此操作无法撤销。</p>{actionError && <div className="form-error" role="alert">{actionError}</div>}<div className="modal-actions"><button className="button secondary" disabled={deleting} onClick={() => setDeleteTarget(null)}>取消</button><button className="button danger" disabled={deleting} onClick={() => void deleteBackup()}>{deleting ? '正在删除…' : '删除备份'}</button></div></Modal>}
  </LoadingContent>;
}

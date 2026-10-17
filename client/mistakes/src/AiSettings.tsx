import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, json } from './api';
import { useApp } from './context';
import { useAiTasks } from './AiTasks';
import type { AiConfig } from './ai-types';

export function AiSettings() {
  const { notify } = useApp();
  const { refresh } = useAiTasks();
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { api<AiConfig>('/admin/ai/config').then(setConfig).catch((err) => { setError(err.message); toast.error(err.message); }); }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!config) return;
    setBusy('save'); setError('');
    try { const next = await api<AiConfig>('/admin/ai/config', json({ enabled: config.enabled, baseUrl: config.baseUrl, model: config.model, ...(key ? { apiKey: key } : {}) }, 'PATCH')); setConfig(next); setKey(''); await refresh(); notify('AI 配置已保存。'); }
    catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); } finally { setBusy(''); }
  }
  async function test() {
    setBusy('test');
    const toastId = toast.loading('正在测试 AI 连接，请稍候…');
    try { const result = await api<{ message: string }>('/admin/ai/test', json({})); toast.update(toastId, { render: result.message, type: 'success', isLoading: false, autoClose: 8000 }); }
    catch (err) { toast.update(toastId, { render: (err as Error).message, type: 'error', isLoading: false, autoClose: false, closeButton: true }); } finally { setBusy(''); }
  }
  return <section className="panel admin-panel ai-settings"><h2>AI 识别与解析</h2><p className="ai-notice">全站共用一组兼容接口。请选择支持图片输入的模型，密钥只保存在服务器。</p>
    {error && <div className="form-error" role="alert">{error}</div>}
    {config && <form onSubmit={save}>
      <label className="knowledge-option"><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} />启用 AI 服务</label>
      <label className="field"><span>API 基础地址</span><input type="url" value={config.baseUrl || ''} placeholder="https://api.example.com/v1" onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} required={config.enabled} /></label>
      <label className="field"><span>多模态模型名称</span><input value={config.model || ''} placeholder="填写服务商提供的模型 ID" onChange={(event) => setConfig({ ...config, model: event.target.value })} required={config.enabled} /></label>
      <label className="field"><span>API 密钥</span><input type="password" autoComplete="new-password" value={key} onChange={(event) => setKey(event.target.value)} placeholder={config.hasApiKey ? '已保存，留空保持原密钥' : '输入 API 密钥'} required={config.enabled && !config.hasApiKey} /></label>
      <div className="photo-actions"><button className="button primary" disabled={Boolean(busy)}>{busy === 'save' ? '保存中…' : '保存配置'}</button><button type="button" className="button secondary" disabled={Boolean(busy) || !config.configured} onClick={() => void test()}>{busy === 'test' ? '正在连接…' : '测试已保存的配置'}</button></div>
    </form>}
  </section>;
}

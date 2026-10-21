import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, json } from './api';
import { useApp } from './context';
import { useAiTasks } from './AiTasks';
import type { AiConfig } from './ai-types';

type Profile = 'general' | 'segmentation' | 'analysis';
const profiles: { id: Profile; title: string; description: string; testLabel: string }[] = [
  { id: 'general', title: '通用识别', description: 'Gemini 原生接口，用于单题识别，以及按页录题中的题干、蓝笔答案和知识点识别。', testLabel: '测试图片识别' },
  { id: 'segmentation', title: '页面分题', description: '独立 Gemini 原生接口。请选择支持 Segmentation 的模型，用于按页框出每道题。', testLabel: '测试页面分题' },
  { id: 'analysis', title: '生成解析', description: 'OpenAI Chat Completions 接口，用于自动解析和手动生成解析；题目含图时，模型须支持图片输入。', testLabel: '测试生成解析' }
];

function ProfileSettings({ profile }: { profile: typeof profiles[number] }) {
  const { notify } = useApp();
  const { refresh } = useAiTasks();
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const query = `?profile=${profile.id}`;
  useEffect(() => {
    api<AiConfig>(`/admin/ai/config${query}`).then(setConfig).catch((err) => { setError(err.message); toast.error(err.message); });
  }, [query]);
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!config) return;
    setBusy('save'); setError('');
    try {
      const next = await api<AiConfig>(`/admin/ai/config${query}`, json({ enabled: config.enabled, baseUrl: config.baseUrl, model: config.model, ...(key ? { apiKey: key } : {}) }, 'PATCH'));
      setConfig(next); setKey(''); await refresh(); notify(`${profile.title}配置已保存。`);
    } catch (err) { setError((err as Error).message); notify((err as Error).message, 'error'); } finally { setBusy(''); }
  }
  async function test() {
    setBusy('test');
    const toastId = toast.loading(`正在${profile.testLabel}，请稍候…`);
    try {
      const result = await api<{ message: string }>(`/admin/ai/test${query}`, json({}));
      toast.update(toastId, { render: result.message, type: 'success', isLoading: false, autoClose: 8000 });
    } catch (err) { toast.update(toastId, { render: (err as Error).message, type: 'error', isLoading: false, autoClose: false, closeButton: true }); } finally { setBusy(''); }
  }
  const analysis = profile.id === 'analysis';
  return <section className="ai-profile-settings">
    <h3>{profile.title}</h3><p className="ai-notice">{profile.description}</p>
    {error && <div className="form-error" role="alert">{error}</div>}
    {config && <form onSubmit={save}>
      <label className="knowledge-option"><input type="checkbox" checked={config.enabled} onChange={(event) => setConfig({ ...config, enabled: event.target.checked })} />启用{profile.title}</label>
      <label className="field"><span>{analysis ? 'OpenAI API 基础地址' : 'Gemini API 基础地址'}</span><input type="url" value={config.baseUrl || ''} placeholder={analysis ? 'https://api.openai.com/v1' : 'https://generativelanguage.googleapis.com/v1beta'} onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} required={config.enabled} /></label>
      <label className="field"><span>模型名称</span><input value={config.model || ''} placeholder={analysis ? '填写支持 Chat Completions 的模型 ID' : '填写 Gemini 模型 ID'} onChange={(event) => setConfig({ ...config, model: event.target.value })} required={config.enabled} /></label>
      <label className="field"><span>API 密钥</span><input type="password" autoComplete="new-password" value={key} onChange={(event) => setKey(event.target.value)} placeholder={config.hasApiKey ? '已保存，留空保持原密钥' : '输入 API 密钥'} required={config.enabled && !config.hasApiKey} /></label>
      <div className="photo-actions"><button className="button primary" disabled={Boolean(busy)}>{busy === 'save' ? '保存中…' : `保存${profile.title}配置`}</button><button type="button" className="button secondary" disabled={Boolean(busy) || !config.enabled || !config.configured} onClick={() => void test()}>{busy === 'test' ? '测试中…' : profile.testLabel}</button></div>
    </form>}
  </section>;
}

export function AiSettings() {
  return <section className="panel admin-panel ai-settings"><h2>AI 识别与解析</h2><p className="ai-notice">三套服务独立配置、独立启用，密钥只保存在服务器。留空保留已有密钥，测试使用已保存的配置。</p>
    {profiles.map((profile) => <ProfileSettings key={profile.id} profile={profile} />)}
  </section>;
}

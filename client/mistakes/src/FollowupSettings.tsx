import { ChevronDown, MessageCircle, Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { resolveVendorIcon, vendorNames, type VendorIconId } from '../../../shared/vendor-icon.mjs';
import { api, json } from './api';
import { Checkbox } from './components';
import { useApp } from './context';
import { LoadingContent } from './motion';
import { Select } from './Select';
import { VendorLogo } from './VendorLogo';
import './followup-settings.css';

type Profile = {
  id: string;
  name: string;
  tierLabel: string;
  model: string;
  baseUrl: string;
  protocol: 'openai' | 'responses' | 'gemini';
  enabledForFollowup: boolean;
  vision: boolean;
  creditCost: number;
  sortOrder: number | null;
  thinkingEffort: string;
  vendorIcon: VendorIconId | '';
  apiKey?: string;
  hasApiKey: boolean;
  endpointSourceId?: string | null;
};

type Settings = {
  dailyCreditLimit: number;
  defaultProfileId: string | null;
  profiles: Profile[];
};

const endpoint = '/admin/ai/config?profile=followup';
const protocols = [{ value: 'openai', label: 'OpenAI 兼容' }, { value: 'responses', label: 'OpenAI Responses' }, { value: 'gemini', label: 'Gemini 原生' }];
const vendors = [{ value: '', label: '自动识别' }, ...Object.entries(vendorNames).map(([value, label]) => ({ value, label }))];
const efforts = [
  { value: '', label: '模型默认' },
  { value: 'none', label: '关闭 (none)' },
  { value: 'minimal', label: '最低 (minimal)' },
  { value: 'low', label: '低 (low)' },
  { value: 'medium', label: '中 (medium)' },
  { value: 'high', label: '高 (high)' },
  { value: 'xhigh', label: '超高 (xhigh)' },
  { value: 'max', label: '最高 (max)' },
];

function newProfile(sourceId: string | null): Profile {
  return {
    id: crypto.randomUUID(), name: '', tierLabel: '', model: '', baseUrl: '', protocol: 'openai', enabledForFollowup: false,
    vision: true, creditCost: 1, sortOrder: null, thinkingEffort: '', vendorIcon: '', hasApiKey: false, endpointSourceId: sourceId,
  };
}

function ProfileEditor({ profile, sources, update, remove }: {
  profile: Profile; sources: Profile[]; update: (change: Partial<Profile>) => void; remove: () => void;
}) {
  const source = sources.find(({ id }) => id === profile.endpointSourceId);
  const baseUrl = source?.baseUrl ?? profile.baseUrl;
  const required = profile.enabledForFollowup;
  const automaticIcon = resolveVendorIcon('', profile.model, baseUrl);
  const effortOptions = efforts.some(({ value }) => value === profile.thinkingEffort)
    ? efforts : [...efforts, { value: profile.thinkingEffort, label: profile.thinkingEffort }];
  const logoOption = ({ value, label }: { value: string; label: string }) => <span className="followup-settings-logo-option">
    <VendorLogo vendorIcon={value ? resolveVendorIcon(value) : automaticIcon} />{label}
  </span>;

  return <div className="followup-settings-editor">
    {profile.endpointSourceId !== undefined && sources.length > 0 && <div className="field followup-settings-source">
      <span>沿用已有接口</span>
      <Select ariaLabel="沿用已有接口" value={profile.endpointSourceId ?? ''} onChange={(value) => update({ endpointSourceId: value || null })}
        options={[{ value: '', label: '独立填写' }, ...sources.map(({ id, name, model }) => ({
          value: id, label: model && model !== name ? `${name} · ${model}` : name,
        }))]} />
    </div>}
    <label className="field"><span>配置名称</span><input value={profile.name} required onChange={(event) => update({ name: event.target.value })} /></label>
    <label className="field"><span>档位名</span><input value={profile.tierLabel} placeholder="默认使用配置名称" onChange={(event) => update({ tierLabel: event.target.value })} /></label>
    <div className="field"><span>接口协议</span><Select ariaLabel="接口协议" value={source?.protocol ?? profile.protocol} options={protocols} disabled={Boolean(source)}
      onChange={(protocol) => update({ protocol: protocol as Profile['protocol'] })} /></div>
    <label className="field"><span>模型名称</span><input value={profile.model} required={required} onChange={(event) => update({ model: event.target.value })} /></label>
    <label className="field"><span>API 基础地址</span><input type="url" value={baseUrl} required={required && !source} readOnly={Boolean(source)}
      onChange={(event) => update({ baseUrl: event.target.value })} /></label>
    <label className="field"><span>API 密钥</span><input type="password" autoComplete="new-password" value={source ? '' : profile.apiKey ?? ''}
      readOnly={Boolean(source)} required={required && !source && !profile.hasApiKey}
      placeholder={source ? '沿用已有密钥' : profile.hasApiKey ? '已保存，留空保持原密钥' : ''}
      onChange={(event) => update({ apiKey: event.target.value })} /></label>
    <label className="field"><span>积分倍率（每 2000 token）</span><input type="number" min={0} step="any" required
      value={Number.isNaN(profile.creditCost) ? '' : profile.creditCost} onChange={(event) => update({ creditCost: event.target.valueAsNumber })} /></label>
    <label className="field"><span>排序权重</span><input type="number" step="any" placeholder="默认按积分倍率" value={profile.sortOrder ?? ''}
      onChange={(event) => update({ sortOrder: event.target.value ? event.target.valueAsNumber : null })} /></label>
    <div className="field"><span>思考强度</span><Select ariaLabel="思考强度" value={profile.thinkingEffort} options={effortOptions}
      onChange={(thinkingEffort) => update({ thinkingEffort })} /></div>
    <div className="field"><span>厂商 Logo</span><Select ariaLabel="厂商 Logo" options={vendors} value={profile.vendorIcon}
      renderValue={logoOption} renderOption={logoOption} onChange={(value) => update({ vendorIcon: value as Profile['vendorIcon'] })} /></div>
    <div className="followup-settings-editor-actions">
      <label className="ai-profile-enable"><Checkbox checked={profile.vision} onChange={(event) => update({ vision: event.target.checked })} />支持图片输入</label>
      <button className="button ghost" type="button" onClick={remove}>移除模型</button>
    </div>
  </div>;
}

export function FollowupSettings() {
  const { notify } = useApp();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  function acceptSettings(next: Settings) {
    setSettings(next);
    setSavedProfiles(next.profiles);
  }
  useEffect(() => {
    api<Settings>(endpoint).then(acceptSettings).catch((err) => setError(err.message));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    try {
      acceptSettings(await api<Settings>(endpoint, json(settings, 'PATCH')));
      notify('错题追问配置已保存。');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const enabled = settings?.profiles.filter((profile) => profile.enabledForFollowup) ?? [];
  const defaultProfile = enabled.find(({ id }) => id === settings?.defaultProfileId) ??
    [...enabled].sort((a, b) => (a.sortOrder ?? a.creditCost) - (b.sortOrder ?? b.creditCost) || a.creditCost - b.creditCost)[0];
  const sources = savedProfiles.filter(({ baseUrl, hasApiKey }) => baseUrl && hasApiKey);

  return <section className="ai-profile-settings followup-settings">
    <div className="panel-title"><span className="panel-title-icon green"><MessageCircle size={18} /></span><h2>错题追问</h2></div>
    <LoadingContent loading={!settings && !error} kind="ai-profile">
      {error && <div className="form-error" role="alert">{error}</div>}
      {settings && <form className="ai-profile-form" onSubmit={save}>
        <fieldset disabled={saving} className="followup-settings-fields">
          <div className="followup-settings-general">
            <label className="field"><span>单账号每日追问积分上限</span><input type="number" min={1} step={1} required
              value={Number.isNaN(settings.dailyCreditLimit) ? '' : settings.dailyCreditLimit}
              onChange={(event) => setSettings({ ...settings, dailyCreditLimit: event.target.valueAsNumber })} /></label>
            <div className="field"><span>默认选中模型</span><Select ariaLabel="默认选中模型" disabled={!enabled.length || saving}
              value={defaultProfile?.id ?? ''} onChange={(defaultProfileId) => setSettings({ ...settings, defaultProfileId })}
              options={enabled.map((profile) => ({ value: profile.id, label: profile.tierLabel || profile.name || '新模型' }))} /></div>
          </div>
          <div className="followup-settings-profiles">
            {settings.profiles.map((profile) => {
              const open = editing === profile.id;
              const name = profile.tierLabel || profile.name || '新模型';
              return <div className="followup-settings-profile" key={profile.id}>
                <div className="followup-settings-row">
                  <button type="button" className="followup-settings-edit" aria-expanded={open}
                    aria-label={`编辑 ${name}`} onClick={() => setEditing(open ? null : profile.id)}>
                    <VendorLogo vendorIcon={resolveVendorIcon(profile.vendorIcon, profile.model,
                      sources.find(({ id }) => id === profile.endpointSourceId)?.baseUrl ?? profile.baseUrl)} size={20} />
                    <span className="followup-settings-profile-name"><strong>{name}</strong>{profile.model && <small>{profile.model}</small>}</span>
                    <span className="model-multiplier">{Number.isNaN(profile.creditCost) ? '—' : `${profile.creditCost}×`}</span><ChevronDown size={15} aria-hidden="true" />
                  </button>
                  <label className="followup-settings-toggle"><Checkbox aria-label={`开放 ${name}`} checked={profile.enabledForFollowup}
                    onChange={(event) => setSettings({ ...settings, profiles: settings.profiles.map((item) => item.id === profile.id
                      ? { ...item, enabledForFollowup: event.target.checked } : item) })} />启用</label>
                </div>
                {open && <ProfileEditor profile={profile} sources={sources} update={(change) => setSettings({ ...settings, profiles: settings.profiles.map((item) => item.id === profile.id
                  ? { ...item, ...change } : item) })} remove={() => {
                    setEditing(null);
                    setSettings({ ...settings, profiles: settings.profiles.filter(({ id }) => id !== profile.id) });
                  }} />}
              </div>;
            })}
          </div>
          <button type="button" className="button secondary followup-settings-add" onClick={() => {
            const source = sources.find(({ id }) => id === editing) ?? sources.find(({ id }) => id === defaultProfile?.id) ?? sources[0];
            const profile = newProfile(source?.id ?? null);
            setSettings({ ...settings, profiles: [...settings.profiles, profile] });
            setEditing(profile.id);
          }}><Plus size={16} />添加追问模型</button>
        </fieldset>
        <div className="ai-profile-actions"><button className="button primary" disabled={saving}>{saving ? '保存中…' : '保存错题追问配置'}</button></div>
      </form>}
    </LoadingContent>
  </section>;
}

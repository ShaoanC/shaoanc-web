import { useState } from 'react';
import { Download, LoaderCircle, LockKeyhole, LogOut } from 'lucide-react';
import { BrandWordmark } from './Logo';
import type { User } from './types';
import './frozen-account.css';

export function FrozenAccountPage({ user, logout }: { user: User; logout: () => Promise<void> }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  async function download() {
    setDownloading(true);
    setError('');
    try {
      const response = await fetch('/api/mistakes/auth/data-export', { credentials: 'same-origin' });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || '下载失败，请稍后重试。');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `errata-my-data-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) { setError((err as Error).message); }
    finally { setDownloading(false); }
  }

  return <main className="frozen-page">
    <header className="frozen-header"><span className="brand" role="img" aria-label="Errata"><BrandWordmark /></span><span className="frozen-username">{user.username}</span></header>
    <section className="frozen-content" aria-labelledby="frozen-title">
      <LockKeyhole size={32} strokeWidth={1.5} className="frozen-icon" />
      <h1 id="frozen-title">您的账号已被冻结</h1>
      <p className="frozen-reassurance">请放心，您的学习数据仍被妥善保管，不会因账号冻结而删除。</p>
      <div className="frozen-download">
        <button className="button primary" disabled={downloading} onClick={() => void download()}>{downloading ? <LoaderCircle size={18} className="spin" /> : <Download size={18} />}{downloading ? '正在打包并下载…' : '下载我的数据'}</button>
        <p>下载包含错题、答案、解析、笔记、知识点、复习记录和现存图片，也包括草稿与回收站内容。</p>
        {error && <p className="inline-alert" role="alert">{error} 请重试；若登录已过期，请退出后重新登录。</p>}
      </div>
      <button className="button ghost" onClick={() => void logout()}><LogOut size={17} />退出登录</button>
    </section>
    <footer className="frozen-footer">
      <p>冻结期间暂时无法使用学习功能，您仍可下载自己的数据。如需恢复使用，请联系管理员。</p>
    </footer>
  </main>;
}

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { toastDestination } from './toast-navigation';

export interface ActivityNotice {
  id: string;
  message: string;
  path: string;
  status: 'active' | 'completed' | 'failed';
  retry?: () => void;
}

// Coalesce rapid progress changes and completions into one notification per source.
export function useActivityToast(toastId: string) {
  const notices = useRef(new Map<string, ActivityNotice>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastReport = useRef(0);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    toast.dismiss(toastId);
  }, [toastId]);

  return useCallback((updates: ActivityNotice[]) => {
    if (!updates.length) return;
    if (Date.now() - lastReport.current > 8000) {
      for (const [id, notice] of notices.current) {
        if (notice.status === 'completed') notices.current.delete(id);
      }
    }
    lastReport.current = Date.now();
    updates.forEach((notice) => notices.current.set(notice.id, notice));
    if (timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      const items = [...notices.current.values()];
      const failed = items.filter((item) => item.status === 'failed').length;
      const active = items.filter((item) => item.status === 'active').length;
      const completed = items.length - failed - active;
      const link = (item: ActivityNotice) => <div key={item.id} className="ai-toast-copy">
        <a className="ai-toast-link" href={`#${item.path}`} onClick={(event) => {
          toastDestination(item.path).onClick?.(event);
          toast.dismiss(toastId);
        }}><span>{item.message}</span><small>点击查看处理</small></a>
        {item.retry && <button type="button" onClick={item.retry}>重试</button>}
      </div>;
      const content = items.length === 1 ? link(items[0]) : <div className="ai-toast-copy">
        <span>{[active && `${active} 项处理中`, completed && `${completed} 项完成`, failed && `${failed} 项失败`].filter(Boolean).join(' · ')}</span>
        <details className="activity-toast-details"><summary>查看 {items.length} 项记录{failed ? '并重试' : ''}</summary>
          <div>{[...items].sort((a, b) => Number(b.status === 'failed') - Number(a.status === 'failed')).map(link)}</div>
        </details>
      </div>;
      const options = {
        type: failed ? 'error' as const : active ? 'info' as const : 'success' as const,
        isLoading: Boolean(active && !failed), autoClose: active || failed ? false as const : 4500,
        closeButton: true, closeOnClick: false,
        onClose: () => { notices.current.clear(); },
      };
      if (toast.isActive(toastId)) toast.update(toastId, { render: content, ...options });
      else toast(content, { toastId, ...options });
    }, 400);
  }, [toastId]);
}

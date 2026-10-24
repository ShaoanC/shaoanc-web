import type { ToastOptions } from 'react-toastify';
import { navigate } from './api';
import { RECORD_TOAST_EVENT, recordTarget } from './RecordView';

export function toastDestination(path: string): Pick<ToastOptions, 'className' | 'closeOnClick' | 'onClick'> {
  return {
    className: 'ai-toast-actionable',
    closeOnClick: true,
    onClick: (event) => {
      if (window.matchMedia('(max-width: 640px)').matches && recordTarget(path)) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent(RECORD_TOAST_EVENT, { cancelable: true, detail: { path } }));
        return;
      }
      if (window.matchMedia('(max-width: 640px)').matches && path.startsWith('/ai-tasks')) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('mistakes:open-ai-tasks', { detail: { path } }));
        return;
      }
      if (window.location.hash === `#${path}`) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else navigate(path);
    },
  };
}

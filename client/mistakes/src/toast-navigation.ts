import type { ToastOptions } from 'react-toastify';
import { navigate } from './api';

export function toastDestination(path: string): Pick<ToastOptions, 'className' | 'closeOnClick' | 'onClick'> {
  return {
    className: 'ai-toast-actionable',
    closeOnClick: true,
    onClick: () => {
      if (window.location.hash === `#${path}`) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else navigate(path);
    },
  };
}

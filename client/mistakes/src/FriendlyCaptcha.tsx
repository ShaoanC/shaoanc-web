import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type CaptchaSdk = import('@friendlycaptcha/sdk').FriendlyCaptchaSDK;

export interface CaptchaState {
  status: 'pending' | 'complete' | 'expired' | 'error';
  response: string;
}

let sdkPromise: Promise<CaptchaSdk> | null = null;

function loadSdk(): Promise<CaptchaSdk> {
  if (!sdkPromise) {
    sdkPromise = import('@friendlycaptcha/sdk').then(({ FriendlyCaptchaSDK }) => new FriendlyCaptchaSDK()).catch((error) => {
      sdkPromise = null;
      throw error;
    });
  }
  return sdkPromise;
}

export function FriendlyCaptcha({ sitekey, resetKey, onChange }: { sitekey: string; resetKey: number; onChange: (state: CaptchaState) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    // The SDK manages its mount subtree, so React owns a separate wrapper.
    const mount = document.createElement('div');
    container.append(mount);
    let active = true;
    let widget: ReturnType<CaptchaSdk['createWidget']> | undefined;
    setInitializing(true);
    onChange({ status: 'pending', response: '' });

    const onStateChange = (event: Event) => {
      if (!active) return;
      const { state, response } = (event as CustomEvent<{ state: string; response: string }>).detail;
      if (state === 'completed') onChange({ status: 'complete', response });
      else if (state === 'error') onChange({ status: 'error', response: response || '.ERROR' });
      else if (state === 'expired') onChange({ status: 'expired', response: '' });
      else onChange({ status: 'pending', response: '' });
    };
    mount.addEventListener('frc:widget.statechange', onStateChange);

    void loadSdk().then((sdk) => {
      if (!active) return;
      widget = sdk.createWidget({ element: mount, sitekey, apiEndpoint: 'global', startMode: 'focus', theme: 'light' });
      setInitializing(false);
      // The user may have focused a field while the SDK was still loading.
      if (mount.closest('form')?.contains(document.activeElement)) widget.start();
    }).catch(() => {
      if (!active) return;
      setInitializing(false);
      onChange({ status: 'error', response: '.ERROR' });
    });

    return () => {
      active = false;
      mount.removeEventListener('frc:widget.statechange', onStateChange);
      widget?.destroy();
      mount.remove();
    };
  }, [sitekey, resetKey, onChange]);

  return <div className="auth-captcha-control">
    {initializing && <div className="auth-captcha-loading" role="status"><LoaderCircle className="spin" size={16} /> 正在加载人机验证…</div>}
    <div className="auth-captcha-widget" ref={mountRef} />
  </div>;
}

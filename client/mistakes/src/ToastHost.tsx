import { useEffect } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import { useMobileLayout } from './MobileDrawer';
export function ToastHost() {
  const mobile = useMobileLayout();
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector(window.matchMedia('(max-width: 960px)').matches ? '.sidebar' : '.topbar');
      const bottom = header?.getBoundingClientRect().bottom || 0;
      document.documentElement.style.setProperty('--workspace-header-bottom', `${Math.max(0, bottom)}px`);
    };
    const resize = new ResizeObserver(measure);
    let headers: Element[] = [];
    const observe = () => {
      const next = [...document.querySelectorAll('.sidebar, .topbar')];
      if (next.length !== headers.length || next.some((node, index) => node !== headers[index])) {
        resize.disconnect(); next.forEach((node) => resize.observe(node)); headers = next;
      }
      measure();
    };
    const mutation = new MutationObserver(observe);
    mutation.observe(document.getElementById('root')!, { childList: true, subtree: true });
    window.addEventListener('resize', measure); observe();
    return () => { resize.disconnect(); mutation.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return <ToastContainer className="mistakes-toast-container" position="top-right" autoClose={4500} transition={Slide} theme="light" limit={mobile ? 1 : 3} newestOnTop closeOnClick={false} draggablePercent={15} />;
}

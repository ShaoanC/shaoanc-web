import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import { X } from 'lucide-react';
import './mobile-filters.css';

export function useMobileLayout() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return mobile;
}

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  className?: string;
  footer?: ReactNode;
  children: (portalContainer: HTMLElement | null) => ReactNode;
}

export function MobileDrawer({ open, onOpenChange, onOpenChangeComplete, title, description, closeLabel = '关闭', triggerRef, className = '', footer, children }: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Conditional callers must also enter through the closed state to animate.
  useEffect(() => setMounted(true), []);

  return <Drawer.Root open={mounted && open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete} modal swipeDirection="down">
    <Drawer.VirtualKeyboardProvider>
      <Drawer.Portal>
        <Drawer.Backdrop className="mobile-filters-backdrop" />
        <Drawer.Viewport className="mobile-filters-viewport">
          <Drawer.Popup ref={setPortalContainer} className={`mobile-filters-popup mobile-drawer-popup ${className}`.trim()} initialFocus={closeButton} finalFocus={triggerRef}>
            <div className="mobile-filters-drag-area" aria-hidden="true"><span className="mobile-filters-handle" /></div>
            <header className="mobile-filters-heading" data-base-ui-swipe-ignore>
              <div>
                <Drawer.Title className="mobile-filters-title">{title}</Drawer.Title>
                {description && <Drawer.Description className="mobile-filters-description">{description}</Drawer.Description>}
              </div>
              <Drawer.Close ref={closeButton} className="icon-button mobile-filters-close" aria-label={closeLabel}><X size={20} /></Drawer.Close>
            </header>
            <Drawer.Content className="mobile-filters-content scroll-area scroll-area--vertical" data-base-ui-swipe-ignore>{children(portalContainer)}</Drawer.Content>
            {footer && <footer className="mobile-filters-footer" data-base-ui-swipe-ignore>{footer}</footer>}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.VirtualKeyboardProvider>
  </Drawer.Root>;
}

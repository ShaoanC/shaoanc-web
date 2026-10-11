import { useRef, useState, type ReactNode, type RefObject } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import { X } from 'lucide-react';
import './mobile-filters.css';

export interface MobileFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  children: (portalContainer: HTMLElement | null) => ReactNode;
}

export function MobileFiltersDrawer({ open, onOpenChange, onApply, onReset, triggerRef, children }: MobileFiltersDrawerProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  return <Drawer.Root open={open} onOpenChange={onOpenChange} modal swipeDirection="down">
    <Drawer.VirtualKeyboardProvider>
      <Drawer.Portal>
        <Drawer.Backdrop className="mobile-filters-backdrop" />
        <Drawer.Viewport className="mobile-filters-viewport">
          <Drawer.Popup ref={setPortalContainer} className="mobile-filters-popup" initialFocus={closeButton} finalFocus={triggerRef}>
            <div className="mobile-filters-drag-area" aria-hidden="true"><span className="mobile-filters-handle" /></div>
            <header className="mobile-filters-heading" data-base-ui-swipe-ignore>
              <div>
                <Drawer.Title className="mobile-filters-title">筛选错题</Drawer.Title>
                <Drawer.Description className="mobile-filters-description">选好条件后，应用到错题列表。</Drawer.Description>
              </div>
              <Drawer.Close ref={closeButton} className="icon-button mobile-filters-close" aria-label="关闭筛选"><X size={20} /></Drawer.Close>
            </header>
            <Drawer.Content className="mobile-filters-content" data-base-ui-swipe-ignore>
              <div className="mobile-filters-fields">{children(portalContainer)}</div>
            </Drawer.Content>
            <footer className="mobile-filters-footer" data-base-ui-swipe-ignore>
              <button type="button" className="button secondary" onClick={onReset}>重置</button>
              <button type="button" className="button primary" onClick={onApply}>应用筛选</button>
            </footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.VirtualKeyboardProvider>
  </Drawer.Root>;
}

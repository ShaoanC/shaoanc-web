import type { ReactNode, RefObject } from 'react';
import { MobileDrawer } from './MobileDrawer';

export interface MobileFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  children: (portalContainer: HTMLElement | null) => ReactNode;
}

export function MobileFiltersDrawer({ open, onOpenChange, onApply, onReset, triggerRef, children }: MobileFiltersDrawerProps) {
  return <MobileDrawer open={open} onOpenChange={onOpenChange} title="筛选错题" description="选好条件后，应用到错题列表。" closeLabel="关闭筛选" triggerRef={triggerRef} footer={<>
    <button type="button" className="button secondary" onClick={onReset}>重置</button>
    <button type="button" className="button primary" onClick={onApply}>应用筛选</button>
  </>}>
    {(portalContainer) => <div className="mobile-filters-fields">{children(portalContainer)}</div>}
  </MobileDrawer>;
}

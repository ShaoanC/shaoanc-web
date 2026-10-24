import type { ReactNode, RefObject } from 'react';
import { AiDialog } from './AiDialog';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import './ai-tasks-dialog.css';

export function ResponsiveAiDialog({ open, onOpenChange, title, description, closeLabel = '关闭', triggerRef, className = '', children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel?: string;
  triggerRef?: RefObject<HTMLElement | null>;
  className?: string;
  children: (portalContainer: HTMLElement | null) => ReactNode;
}) {
  const mobile = useMobileLayout();

  return mobile ? <MobileDrawer open={open} onOpenChange={onOpenChange} title={title} description={description} closeLabel={closeLabel} triggerRef={triggerRef} className={`ai-tasks-mobile-drawer ${className}`.trim()}>
    {children}
  </MobileDrawer> : <AiDialog open={open} onClose={() => onOpenChange(false)} title={title} description={description} wide scrollBody className={`ai-tasks-dialog ${className}`.trim()} backdropClassName="ai-tasks-dialog-backdrop">
    {children(null)}
  </AiDialog>;
}

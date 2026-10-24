import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ScrollArea } from './ScrollArea';
import './photo-ai.css';

const AiDialogContainer = createContext<HTMLElement | null>(null);
export const useAiDialogContainer = () => useContext(AiDialogContainer);

export function AiDialog({ open, onClose, title, description, children, wide = false, suspended = false, className = '', backdropClassName = '', scrollBody = false }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; wide?: boolean; suspended?: boolean; className?: string; backdropClassName?: string; scrollBody?: boolean }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return <Dialog.Root open={open} modal={!suspended} disablePointerDismissal={suspended} onOpenChange={(value, event) => { if (suspended) event.cancel(); else if (!value) onClose(); }}>
    <Dialog.Portal><Dialog.Backdrop className={`photo-dialog-backdrop ${backdropClassName}`.trim()} /><Dialog.Popup ref={setContainer} className={`photo-dialog${wide ? ' photo-dialog-wide' : ''} ${className}`.trim()}>
      <div className="photo-dialog-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="icon-button" aria-label="关闭"><X size={20} /></Dialog.Close></div>
      {description && <Dialog.Description className="photo-dialog-description">{description}</Dialog.Description>}
      <AiDialogContainer.Provider value={container}>{scrollBody ? <ScrollArea className="photo-dialog-body">{children}</ScrollArea> : children}</AiDialogContainer.Provider>
    </Dialog.Popup></Dialog.Portal>
  </Dialog.Root>;
}

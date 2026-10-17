import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import './photo-ai.css';

export function AiDialog({ open, onClose, title, description, children, wide = false }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; wide?: boolean }) {
  return <Dialog.Root open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
    <Dialog.Portal><Dialog.Backdrop className="photo-dialog-backdrop" /><Dialog.Popup className={`photo-dialog${wide ? ' photo-dialog-wide' : ''}`}>
      <div className="photo-dialog-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="icon-button" aria-label="关闭"><X size={20} /></Dialog.Close></div>
      {description && <Dialog.Description className="photo-dialog-description">{description}</Dialog.Description>}
      {children}
    </Dialog.Popup></Dialog.Portal>
  </Dialog.Root>;
}

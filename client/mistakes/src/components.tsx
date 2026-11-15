import { Dialog } from '@base-ui/react/dialog';
import { ArrowRight, BookOpen, Check, LoaderCircle, Minus, SearchX, X } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import type { KnowledgeStatus } from './types';
import { STATUS_LABELS } from './types';

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  indeterminate?: boolean;
};

export function Checkbox({ indeterminate = false, className = '', ...props }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate, props.checked]);

  return <span className="checkbox-control">
    <input {...props} ref={inputRef} type="checkbox" className={`checkbox-input ${className}`.trim()} />
    <span className="checkbox-mark" aria-hidden="true">
      <Check className="checkbox-tick" size={14} strokeWidth={3} />
      <Minus className="checkbox-mixed" size={14} strokeWidth={3} />
    </span>
  </span>;
}

export function Spinner({ text = '正在加载…' }: { text?: string }) {
  return <div className="loading-state"><LoaderCircle className="spin" size={22} /><span>{text}</span></div>;
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <div className="error-state"><p>{message}</p>{retry && <button className="button secondary" onClick={retry}>重新加载</button>}</div>;
}

export function DataTypeBadge({ isTest }: { isTest: boolean }) {
  return isTest ? <span className="data-type-badge test">测试错题</span> : null;
}

export function StatusBadge({ status }: { status: KnowledgeStatus }) {
  return <span className={`status-badge status-${status}`}><span />{STATUS_LABELS[status]}</span>;
}

export function EmptyState({ title, description, action, filtered = false }: { title: string; description?: string; action?: ReactNode; filtered?: boolean }) {
  const Icon = filtered ? SearchX : BookOpen;
  return <div className="empty-state"><div className="empty-illustration"><span className="empty-orbit" /><Icon size={40} strokeWidth={1.4} /><span className="empty-spark"><Check size={13} /></span></div><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>;
}

export function PageHeader({ title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

const MODAL_FIELDS = 'input:not([type="hidden"]), select, textarea, [role="slider"]';

/**
 * Keep it mounted and toggle `open`: the last title and content stay on screen while the dialog animates out.
 * Escape, outside presses, focus containment and scroll locking come from the Base UI dialog.
 */
export function Modal({ open = true, title, children, onClose, initialFocus }: { open?: boolean; title: string; children: ReactNode; onClose: () => void; initialFocus?: ComponentProps<typeof Dialog.Popup>['initialFocus'] }) {
  const [mounted, setMounted] = useState(false);
  const popup = useRef<HTMLDivElement>(null);
  const retained = useRef({ title, children });
  if (open) retained.current = { title, children };
  const content = retained.current;

  // Opening from the closed state lets conditionally rendered callers animate in as well.
  useEffect(() => setMounted(true), []);

  // Forms start at their first field; touch keeps focus on the dialog so the keyboard stays closed.
  const focusFirstField = (type: string) => type === 'touch' ? true
    : Array.from(popup.current?.querySelectorAll<HTMLElement>(MODAL_FIELDS) || []).find((element) => !element.matches(':disabled')) ?? true;

  return <Dialog.Root open={mounted && open} onOpenChange={(next) => { if (!next) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Backdrop className="modal-backdrop" />
      <Dialog.Viewport className="modal-viewport">
        <Dialog.Popup ref={popup} className="modal" initialFocus={initialFocus ?? focusFirstField}>
          <div className="modal-heading"><Dialog.Title>{content.title}</Dialog.Title><Dialog.Close className="icon-button" aria-label="关闭"><X size={20} /></Dialog.Close></div>
          {content.children}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function ArrowLink({ children, href }: { children: ReactNode; href: string }) {
  return <a className="text-link" href={href}>{children}<ArrowRight size={15} /></a>;
}

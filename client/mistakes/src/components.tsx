import { ArrowRight, BookOpen, Check, LoaderCircle, Minus, SearchX, X } from 'lucide-react';
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
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
  return <span className={isTest ? 'data-type-badge test' : 'data-type-badge'}>{isTest ? '测试错题' : '正式错题'}</span>;
}

export function StatusBadge({ status }: { status: KnowledgeStatus }) {
  return <span className={`status-badge status-${status}`}><span />{STATUS_LABELS[status]}</span>;
}

export function EmptyState({ title, description, action, filtered = false }: { title: string; description: string; action?: ReactNode; filtered?: boolean }) {
  const Icon = filtered ? SearchX : BookOpen;
  return <div className="empty-state"><div className="empty-illustration"><span className="empty-orbit" /><Icon size={40} strokeWidth={1.4} /><span className="empty-spark"><Check size={13} /></span></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function PageHeader({ title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="关闭" onClick={onClose}><X size={20} /></button></div>{children}</section></div>;
}

export function ArrowLink({ children, href }: { children: ReactNode; href: string }) {
  return <a className="text-link" href={href}>{children}<ArrowRight size={15} /></a>;
}

import { useEffect, useId, useRef } from 'react';
import { Check, FileText, LoaderCircle, Save, X } from 'lucide-react';
import type { Lifecycle } from './types';

interface SaveDockProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: Lifecycle | null;
  archived: boolean;
  onSave: (lifecycle: Lifecycle) => void;
}

export function SaveDock({ open, onOpenChange, saving, archived, onSave }: SaveDockProps) {
  const id = useId();
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || saving) return;
    const outside = (event: PointerEvent) => {
      if (!dock.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onOpenChange(false);
      trigger.current?.focus({ preventScroll: true });
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open, saving, onOpenChange]);

  return <div ref={dock} className={`save-dock${open ? ' is-open' : ''}`}>
    <div id={id} className="save-dock-options" role="group" aria-label="选择保存方式" aria-hidden={!open} inert={!open}>
      <button className="button secondary save-dock-option" type="button" disabled={Boolean(saving)} onClick={() => onSave('draft')}>
        {saving === 'draft' ? <LoaderCircle size={17} className="spin" /> : <FileText size={17} />}
        {saving === 'draft' ? '正在保存草稿…' : '保存草稿'}
      </button>
      <button className="button primary save-dock-option" type="button" disabled={Boolean(saving)} onClick={() => onSave('archived')}>
        {saving === 'archived' ? <LoaderCircle size={17} className="spin" /> : <Check size={17} />}
        {saving === 'archived' ? '正在保存…' : archived ? '保存修改' : '保存并归档'}
      </button>
    </div>
    <button ref={trigger} className="save-dock-trigger" type="button" aria-label={saving ? '正在保存' : '保存操作'} aria-expanded={open} aria-controls={id} title={open ? '收起保存操作' : '保存操作'} disabled={Boolean(saving)} onClick={() => onOpenChange(!open)}>
      {saving ? <LoaderCircle size={21} className="spin" /> : <><Save className="save-dock-save-icon" size={21} /><X className="save-dock-close-icon" size={21} /></>}
    </button>
  </div>;
}

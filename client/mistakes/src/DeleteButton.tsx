import { useEffect, useRef } from 'react';
import { Check, LoaderCircle, Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onDelete: () => void;
  busy?: boolean;
  disabled?: boolean;
  armed: boolean;
  onArmedChange: (armed: boolean) => void;
  className?: string;
}

export function DeleteButton({ onDelete, busy = false, disabled = false, armed, onArmedChange, className = '' }: DeleteButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!armed || busy) return;
    const outside = (event: PointerEvent) => {
      if (!buttonRef.current?.contains(event.target as Node)) onArmedChange(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onArmedChange(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [armed, busy, onArmedChange]);

  return <button
    ref={buttonRef}
    type="button"
    className={`quick-delete-button ${armed ? 'is-armed' : ''} ${className}`.trim()}
    disabled={busy || disabled}
    aria-label={busy ? '正在删除' : armed ? '确认删除' : '删除错题'}
    aria-pressed={armed}
    onClick={() => { if (armed) onDelete(); else onArmedChange(true); }}
  >
    {busy ? <LoaderCircle className="spin" size={16} /> : armed ? <Check size={16} /> : <Trash2 size={16} />}
    <span key={busy ? 'busy' : armed ? 'armed' : 'idle'}>{busy ? '删除中…' : armed ? '确认删除' : '删除'}</span>
  </button>;
}

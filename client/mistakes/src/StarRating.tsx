import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { Star, X } from 'lucide-react';

export function ratingLabel(value: number) {
  return value ? `${value} 星` : '未标记';
}

export const RATING_OPTIONS = [
  { value: '', label: '全部星级' },
  { value: '0', label: '未标记' },
  ...Array.from({ length: 10 }, (_, index) => {
    const value = (index + 1) / 2;
    return { value: String(value), label: ratingLabel(value) };
  }),
];

function RatingStars({ value }: { value: number }) {
  return <>{Array.from({ length: 5 }, (_, index) => {
    const fill = Math.max(0, Math.min(1, value - index));
    return <span className="star-rating-slot" key={index} aria-hidden="true">
      <Star size={24} strokeWidth={1.6} />
      <span className="star-rating-fill" style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}><Star size={24} strokeWidth={1.6} /></span>
    </span>;
  })}</>;
}

export function StarRatingDisplay({ value, showLabel = true, compact = false }: { value: number; showLabel?: boolean; compact?: boolean }) {
  return <span className={`star-rating-display ${compact ? 'is-compact' : ''} ${value === 0 ? 'is-unmarked' : ''}`} role="img" aria-label={ratingLabel(value)}>
    {compact ? <Star size={15} strokeWidth={1.6} aria-hidden="true" /> : <span className="star-rating-stars"><RatingStars value={value} /></span>}
    {showLabel && <span className="star-rating-label" aria-hidden="true">{compact && value ? value : ratingLabel(value)}</span>}
  </span>;
}

interface StarRatingPickerProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  disabled?: boolean;
  error?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

export function StarRatingPicker({ value, onChange, onCommit, disabled = false, error, onClose, autoFocus = false }: StarRatingPickerProps) {
  const hintId = useId();
  const [preview, setPreview] = useState(value);
  const pointer = useRef<number | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoFocus) track.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    if (pointer.current === null) setPreview(value);
  }, [value]);

  function positionValue(event: PointerEvent<HTMLDivElement>) {
    const first = event.currentTarget.firstElementChild!.getBoundingClientRect();
    const last = event.currentTarget.lastElementChild!.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - first.left) / (last.right - first.left)));
    return Math.max(0.5, Math.min(5, Math.ceil(position * 10) / 2));
  }

  function commit(next: number) {
    if (disabled) return;
    setPreview(next);
    onChange(next);
    onCommit?.(next);
  }

  function cancelPointer() {
    pointer.current = null;
    setPreview(value);
  }

  return <div className="star-rating-picker">
    <div className="star-rating-value" aria-live="polite">{disabled ? '保存中…' : ratingLabel(preview)}</div>
    <div ref={track} className="star-rating-track" role="slider" tabIndex={disabled ? -1 : 0} aria-label="星级标记" aria-valuemin={0} aria-valuemax={5} aria-valuenow={preview} aria-valuetext={ratingLabel(preview)} aria-disabled={disabled} aria-describedby={hintId}
      onPointerDown={(event) => {
        if (disabled || !event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        pointer.current = event.pointerId;
        setPreview(positionValue(event));
      }}
      onPointerMove={(event) => {
        if (!disabled && pointer.current === event.pointerId) setPreview(positionValue(event));
      }}
      onPointerUp={(event) => {
        if (pointer.current !== event.pointerId) return;
        const next = positionValue(event);
        pointer.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        commit(next);
      }}
      onPointerCancel={cancelPointer}
      onLostPointerCapture={() => { if (pointer.current !== null) cancelPointer(); }}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setPreview(value);
          onClose?.();
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          commit(preview);
        } else if (['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 5 : preview + (event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -0.5 : 0.5);
          setPreview(Math.max(0, Math.min(5, next)));
        }
      }}>
      <RatingStars value={preview} />
    </div>
    <div className="star-rating-controls">
      <button type="button" className="button ghost" disabled={disabled} onClick={() => commit(0)}>清除标记</button>
      {onClose && <button type="button" className="button ghost" disabled={disabled} onClick={() => { setPreview(value); onClose(); }}><X size={16} />取消</button>}
    </div>
    {error && <p className="star-rating-error" role="alert">{error}</p>}
    <p className="star-rating-hint" id={hintId}>点击或滑动选星 · 每半星一档<span className="sr-only">。方向键调整，回车保存，Escape 取消。</span></p>
  </div>;
}

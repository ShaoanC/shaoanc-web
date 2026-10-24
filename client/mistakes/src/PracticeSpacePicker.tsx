import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import { NumberField } from '@base-ui/react/number-field';
import { WheelPicker, type WheelPickerOption } from '@ncdai/react-wheel-picker';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '@ncdai/react-wheel-picker/style.css';
import './practice-space-picker.css';

interface PracticeSpacePickerProps {
  value: number;
  onChange: (value: number) => void;
  mobile: boolean;
  disabled?: boolean;
}

const minimum = 10;
const maximum = 70;
const step = 5;
const options: WheelPickerOption<number>[] = Array.from({ length: (maximum - minimum) / step + 1 }, (_, index) => {
  const value = minimum + index * step;
  return { value, label: String(value) };
});

function snapSpace(value: number) {
  return Math.max(minimum, Math.min(maximum, Math.round(value / step) * step));
}

export function PracticeSpacePicker({ value, onChange, mobile, disabled = false }: PracticeSpacePickerProps) {
  const wheel = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // The primitive has no DOM-prop API; the surrounding spinbutton owns focus.
    const control = wheel.current?.querySelector<HTMLElement>('[data-rwp]');
    if (control) control.tabIndex = -1;
  }, [mobile]);

  useEffect(() => {
    const boundary = wheel.current?.querySelector<HTMLElement>('.practice-space-wheel-viewport');
    if (!boundary) return;
    function containGesture(event: Event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    }
    // Keep scrolling contained even when the wheel reaches either end.
    boundary.addEventListener('touchmove', containGesture, { passive: false });
    boundary.addEventListener('wheel', containGesture, { passive: false });
    return () => {
      boundary.removeEventListener('touchmove', containGesture);
      boundary.removeEventListener('wheel', containGesture);
    };
  }, [mobile]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || event.target !== event.currentTarget || event.nativeEvent.isComposing) return;
    const next = event.key === 'ArrowUp' ? value + step : event.key === 'ArrowDown' ? value - step : event.key === 'Home' ? minimum : event.key === 'End' ? maximum : null;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    onChange(snapSpace(next));
  }

  if (mobile) return <div ref={wheel} className="practice-space-picker practice-space-wheel" role="spinbutton" tabIndex={disabled ? -1 : 0} aria-label="每题答题留白" aria-valuemin={minimum} aria-valuemax={maximum} aria-valuenow={value} aria-valuetext={`${value} 毫米`} aria-disabled={disabled} data-disabled={disabled || undefined} data-base-ui-swipe-ignore="" onKeyDown={navigate} onPointerDown={(event) => { if (!disabled) event.currentTarget.focus({ preventScroll: true }); }}>
    <div className="practice-space-wheel-viewport" data-rwp-wrapper="" aria-hidden="true" inert={disabled}>
      <WheelPicker options={options} value={value} onValueChange={(next) => { if (!disabled) onChange(snapSpace(next)); }} visibleCount={16} optionItemHeight={30} classNames={{ optionItem: 'practice-space-wheel-option', highlightWrapper: 'practice-space-wheel-highlight', highlightItem: 'practice-space-wheel-selected' }} />
    </div>
    <div className="practice-space-wheel-caption" aria-hidden="true"><span>毫米</span><small>10–70</small></div>
  </div>;

  return <NumberField.Root className="practice-space-picker practice-space-number" value={value} min={minimum} max={maximum} step={step} smallStep={step} largeStep={step} snapOnStep disabled={disabled} format={{ useGrouping: false, maximumFractionDigits: 0 }} onValueChange={(next, details) => {
    if (next === null) { details.cancel(); return; }
    onChange(snapSpace(next));
  }}>
    <NumberField.Group className="practice-space-number-group">
      <NumberField.Input className="practice-space-number-input" role="spinbutton" aria-label="每题答题留白" aria-valuemin={minimum} aria-valuemax={maximum} aria-valuenow={value} aria-valuetext={`${value} 毫米`} />
      <span className="practice-space-number-unit" aria-hidden="true">毫米</span>
      <div className="practice-space-number-steppers">
        <NumberField.Increment className="practice-space-number-step" aria-label="增加答题留白"><ChevronUp size={14} aria-hidden="true" /></NumberField.Increment>
        <NumberField.Decrement className="practice-space-number-step" aria-label="减少答题留白"><ChevronDown size={14} aria-hidden="true" /></NumberField.Decrement>
      </div>
    </NumberField.Group>
  </NumberField.Root>;
}

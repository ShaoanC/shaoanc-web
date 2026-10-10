import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { ScrollArea } from './ScrollArea';

type SelectOption = { value: string; label: string; disabled?: boolean };
type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  searchable?: boolean;
  disabled?: boolean;
};

export function Select({ value, onChange, options, ariaLabel, searchable = false, disabled = false }: SelectProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 320, above: false });
  const filtered = useMemo(() => options.filter((option) => option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [options, query]);
  const selected = options.find((option) => option.value === value);
  const activeId = active >= 0 && filtered[active] ? `${id}-option-${active}` : undefined;

  function close(returnFocus = false) {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }

  function show(edge?: 'first' | 'last') {
    if (disabled) return;
    setQuery('');
    const indices = options.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0);
    const current = options.findIndex((option) => option.value === value && !option.disabled);
    setActive(edge === 'last' ? indices.at(-1) ?? -1 : edge === 'first' ? indices[0] ?? -1 : current >= 0 ? current : indices[0] ?? -1);
    setOpen(true);
  }

  function choose(option: SelectOption) {
    if (option.disabled) return;
    onChange(option.value);
    close(true);
  }

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const desired = Math.min(320, filtered.length * 42 + (searchable ? 54 : 0) + 12);
      const upwards = below < Math.min(desired, 180) && above > below;
      const width = Math.min(rect.width, window.innerWidth - 16);
      setPosition({
        top: upwards ? rect.top - 6 : rect.bottom + 6,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
        width,
        maxHeight: Math.min(320, Math.max(0, upwards ? above : below)),
        above: upwards,
      });
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, filtered.length, searchable]);

  useLayoutEffect(() => {
    if (open) (searchable ? search.current : list.current)?.focus();
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    if (!filtered[active] || filtered[active].disabled) setActive(filtered.findIndex((option) => !option.disabled));
    else document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, filtered, active, id]);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!popup.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === 'Tab') {
      // Restore the trigger's position in the document's normal tab order.
      close(true);
      return;
    }
    const typing = event.target === search.current;
    if (event.key === 'Enter' || (event.key === ' ' && !typing)) {
      event.preventDefault();
      if (filtered[active]) choose(filtered[active]);
      return;
    }
    const keys = typing ? ['ArrowDown', 'ArrowUp'] : ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const indices = filtered.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0);
    if (!indices.length) return;
    const current = indices.indexOf(active);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? indices.length - 1 : event.key === 'ArrowDown' ? (current + 1) % indices.length : current < 0 ? indices.length - 1 : (current - 1 + indices.length) % indices.length;
    setActive(indices[next]);
  }

  return <div className="custom-select">
    <button ref={trigger} type="button" className="custom-select-trigger" disabled={disabled} aria-label={`${ariaLabel}：${selected?.label || '请选择'}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-listbox` : undefined}
      onClick={() => open ? close() : show()}
      onKeyDown={(event) => {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          show(event.key === 'Home' ? 'first' : event.key === 'End' || event.key === 'ArrowUp' ? 'last' : undefined);
        }
      }}>
      <span className="custom-select-value">{selected?.label || '请选择'}</span><ChevronDown className="custom-select-chevron" size={16} aria-hidden="true" />
    </button>
    {open && createPortal(<div ref={popup} className="custom-select-popup" style={{ position: 'fixed', top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight, transform: position.above ? 'translateY(-100%)' : undefined }} onKeyDown={navigate}
      onBlur={(event) => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) close(); }}>
      {searchable && <div className="custom-select-search"><Search size={15} aria-hidden="true" /><input ref={search} className="custom-select-search-input" type="search" role="combobox" aria-label={`搜索${ariaLabel}`} aria-expanded="true" aria-autocomplete="list" aria-controls={`${id}-listbox`} aria-activedescendant={activeId} placeholder="搜索知识点…" value={query}
        onChange={(event) => { setQuery(event.target.value); setActive(-1); }} /></div>}
      <ScrollArea ref={list} id={`${id}-listbox`} className="custom-select-options" role="listbox" aria-label={ariaLabel} aria-activedescendant={activeId} tabIndex={-1} style={{ maxHeight: Math.max(0, position.maxHeight - (searchable ? 54 : 12)), overflowY: 'auto' }}>
        {filtered.map((option, index) => <button key={option.value} id={`${id}-option-${index}`} type="button" role="option" tabIndex={-1} disabled={option.disabled} aria-selected={option.value === value}
          className={`custom-select-option${index === active ? ' is-active' : ''}${option.value === value ? ' is-selected' : ''}`}
          onMouseDown={(event) => event.preventDefault()} onMouseMove={() => { if (!option.disabled) setActive(index); }} onClick={() => choose(option)}>
          <span className="custom-select-option-label">{option.label}</span>{option.value === value && <Check size={16} aria-hidden="true" />}
        </button>)}
        {!filtered.length && <p className="custom-select-empty" role="status">{query.trim() ? '没有找到匹配的知识点' : '暂无可选项'}</p>}
      </ScrollArea>
    </div>, document.body)}
  </div>;
}

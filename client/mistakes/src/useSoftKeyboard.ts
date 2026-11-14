import { useEffect, useState } from 'react';

const TEXT_INPUTS = new Set(['', 'text', 'search', 'email', 'url', 'tel', 'number', 'password']);
// Below this the change is browser chrome (address bar), not a keyboard.
const KEYBOARD_THRESHOLD = 120;

function isTextEntry(element: Element | null): element is HTMLElement {
  if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled;
  if (element instanceof HTMLInputElement) return TEXT_INPUTS.has(element.type) && !element.readOnly && !element.disabled;
  return element instanceof HTMLElement && element.isContentEditable;
}

/**
 * True while a text field inside `scope` is focused and a software keyboard is most likely covering the
 * screen: on touch-first devices, or wherever the visible viewport shrank noticeably once editing began.
 * Covers browsers that overlay the keyboard (visual viewport shrinks) and webviews that resize the page.
 */
export function useSoftKeyboard(enabled: boolean, scope: string) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!enabled) { setOpen(false); return; }
    const coarse = window.matchMedia('(pointer: coarse)');
    const viewport = window.visualViewport;
    const height = () => viewport?.height ?? window.innerHeight;
    let resting = height();
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const focused = document.activeElement;
        const editing = isTextEntry(focused) && Boolean(focused.closest(scope));
        if (!editing) resting = height();
        setOpen(editing && (coarse.matches || resting - height() > KEYBOARD_THRESHOLD));
      });
    };
    update();
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    viewport?.addEventListener('resize', update);
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
      viewport?.removeEventListener('resize', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled, scope]);
  return open;
}

/** Closes the keyboard without moving focus to another control. */
export function dismissSoftKeyboard() {
  const focused = document.activeElement;
  if (isTextEntry(focused)) focused.blur();
}

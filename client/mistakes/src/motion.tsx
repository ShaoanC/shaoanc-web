import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';
import { getActiveApiRequestCount, getApiActivitySnapshot, subscribeToApiActivity } from './api';

const MOTION_EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
const CROSSFADE_DURATION = 260;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

type ProgressPhase = 'idle' | 'loading' | 'completing' | 'fading';
type ProgressView = { visible: boolean; progress: number; completing: boolean };

/** Activity feedback is intentionally indeterminate; it completes only when every request settles. */
export function GlobalLoadingProgress() {
  const activity = useSyncExternalStore(subscribeToApiActivity, getApiActivitySnapshot);
  const active = activity.pending > 0;
  const reduced = useReducedMotion();
  const fill = useRef<HTMLSpanElement>(null);
  const phase = useRef<ProgressPhase>('idle');
  const startedAt = useRef(0);
  const currentProgress = useRef(0);
  const observedCycle = useRef(0);
  const timers = useRef(new Set<number>());
  const frames = useRef(new Set<number>());
  const [view, setView] = useState<ProgressView>({ visible: false, progress: 0, completing: false });

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    frames.current.forEach((frame) => window.cancelAnimationFrame(frame));
    timers.current.clear();
    frames.current.clear();
  }, []);

  useEffect(() => {
    function clearScheduled() {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      frames.current.forEach((frame) => window.cancelAnimationFrame(frame));
      timers.current.clear();
      frames.current.clear();
    }

    function later(callback: () => void, delay: number) {
      const timer = window.setTimeout(() => { timers.current.delete(timer); callback(); }, delay);
      timers.current.add(timer);
    }

    function nextFrame(callback: () => void) {
      const frame = window.requestAnimationFrame(() => { frames.current.delete(frame); callback(); });
      frames.current.add(frame);
    }

    function advance() {
      if (phase.current !== 'loading' || !getActiveApiRequestCount()) return;
      const remaining = 0.92 - currentProgress.current;
      if (remaining > 0.003) {
        currentProgress.current += remaining * 0.18;
        setView({ visible: true, progress: currentProgress.current, completing: false });
        later(advance, 450 + currentProgress.current * 750);
      }
    }

    function complete() {
      if (getActiveApiRequestCount()) return;
      phase.current = 'completing';
      currentProgress.current = 1;
      setView({ visible: true, progress: 1, completing: true });
      later(() => {
        phase.current = 'fading';
        setView((previous) => ({ ...previous, visible: false }));
        later(() => {
          phase.current = 'idle';
          currentProgress.current = 0;
          setView({ visible: false, progress: 0, completing: false });
        }, reduced ? 40 : 180);
      }, reduced ? 100 : 440);
    }

    const newCycle = activity.cycle !== observedCycle.current;
    observedCycle.current = activity.cycle;
    if (active || newCycle) {
      clearScheduled();
      startedAt.current = performance.now();
      const previousPhase = phase.current;
      phase.current = 'loading';
      if (previousPhase === 'idle') {
        currentProgress.current = 0;
        setView({ visible: true, progress: 0, completing: false });
        // Two frames ensure the browser paints 0% before the first smooth increase.
        nextFrame(() => nextFrame(() => {
          currentProgress.current = 0.3;
          setView({ visible: true, progress: 0.3, completing: false });
          later(advance, reduced ? 100 : 360);
        }));
      } else {
        // Continue from the visible, interpolated position if a new request arrives mid-completion.
        const transform = fill.current ? getComputedStyle(fill.current).transform : 'none';
        const paintedProgress = transform === 'none' ? currentProgress.current : new DOMMatrixReadOnly(transform).a;
        currentProgress.current = Math.min(0.99, Math.max(0.3, paintedProgress));
        setView({ visible: true, progress: currentProgress.current, completing: false });
        later(advance, 450);
      }
    }
    if (!active && phase.current === 'loading') {
      // Leave the first growth visible even if the response is served immediately.
      later(() => {
        clearScheduled();
        complete();
      }, Math.max(0, (reduced ? 60 : 260) - (performance.now() - startedAt.current)));
    }
  }, [active, activity.cycle, reduced]);

  return <div className={`loading-progress${view.visible ? ' is-visible' : ''}${view.completing ? ' is-completing' : ''}`} aria-hidden="true" style={{ opacity: view.visible ? 1 : 0, transition: `opacity ${reduced ? 40 : 180}ms ${MOTION_EASING}` }}>
    <span ref={fill} className="loading-progress-fill" style={{ transform: `scaleX(${view.progress})`, transition: `transform ${reduced ? 60 : view.completing ? 320 : view.progress <= 0.3 ? 200 : 700}ms ${MOTION_EASING}` }} />
  </div>;
}

export type SlidingTab = { id: string; label: ReactNode };

export function SlidingTabs({ tabs, value, onChange, ariaLabel, className = '' }: {
  tabs: readonly SlidingTab[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const tabIds = tabs.map((tab) => tab.id).join('\u0000');

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    let disposed = false;
    let frame = 0;
    function measure() {
      if (disposed || !root) return;
      const selected = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find((tab) => tab.dataset.tabId === value);
      if (!selected) return;
      const rect = selected.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const next = { x: rect.left - rootRect.left + root.scrollLeft - root.clientLeft, width: rect.width };
      setIndicator((previous) => Math.abs(previous.x - next.x) < 0.1 && Math.abs(previous.width - next.width) < 0.1 ? previous : next);
      if (!initialized.current && !frame) {
        frame = window.requestAnimationFrame(() => {
          initialized.current = true;
          setReady(true);
        });
      }
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((tab) => observer.observe(tab));
    window.addEventListener('resize', measure);
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.cancelAnimationFrame(frame);
    };
  }, [value, tabIds]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    onChange(tabs[next].id);
    container.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <div ref={container} className={`sliding-tabs ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
    {tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" data-tab-id={tab.id} aria-selected={value === tab.id} tabIndex={value === tab.id ? 0 : -1} className={`sliding-tab${value === tab.id ? ' is-active' : ''}`} onClick={() => onChange(tab.id)} onKeyDown={(event) => handleKeyDown(event, index)}>{tab.label}</button>)}
    <span className="tab-indicator" aria-hidden="true" style={{ width: indicator.width, transform: `translateX(${indicator.x}px)`, opacity: ready ? 1 : 0, ...(ready ? {} : { transition: 'none' }) }} />
  </div>;
}

export type NavigationItem = { id: string; href: string; label: ReactNode };

export function SlidingNavigation({ items, value, ariaLabel = '主导航' }: {
  items: readonly NavigationItem[];
  value: string;
  ariaLabel?: string;
}) {
  const container = useRef<HTMLElement>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);
  const [indicator, setIndicator] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });
  const itemIds = items.map((item) => item.id).join('\u0000');

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    let disposed = false;
    let frame = 0;
    function measure() {
      if (disposed || !root) return;
      const selected = Array.from(root.querySelectorAll<HTMLAnchorElement>('.nav-item')).find((item) => item.dataset.navId === value);
      if (!selected) {
        setIndicator((previous) => previous.visible ? { ...previous, visible: false } : previous);
        return;
      }
      const styles = getComputedStyle(root);
      const axis = styles.getPropertyValue('--nav-indicator-axis').trim();
      const horizontal = axis ? axis === 'horizontal' : styles.display === 'grid' || styles.flexDirection === 'row';
      const inset = parseFloat(styles.getPropertyValue('--nav-indicator-inset')) || (horizontal ? 10 : 12);
      const thickness = parseFloat(styles.getPropertyValue('--nav-indicator-thickness')) || 3;
      const rect = selected.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const left = rect.left - rootRect.left + root.scrollLeft - root.clientLeft;
      const top = rect.top - rootRect.top + root.scrollTop - root.clientTop;
      const next = horizontal
        ? { x: left + inset, y: top + rect.height - thickness, width: Math.max(0, rect.width - inset * 2), height: thickness, visible: true }
        : { x: left, y: top + inset, width: thickness, height: Math.max(0, rect.height - inset * 2), visible: true };
      setIndicator((previous) => previous.visible === next.visible && Math.abs(previous.x - next.x) < 0.1 && Math.abs(previous.y - next.y) < 0.1 && Math.abs(previous.width - next.width) < 0.1 && Math.abs(previous.height - next.height) < 0.1 ? previous : next);
      if (!initialized.current && !frame) {
        frame = window.requestAnimationFrame(() => {
          initialized.current = true;
          setReady(true);
        });
      }
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll<HTMLAnchorElement>('.nav-item').forEach((item) => observer.observe(item));
    window.addEventListener('resize', measure);
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.cancelAnimationFrame(frame);
    };
  }, [value, itemIds]);

  return <nav ref={container} className="navigation" aria-label={ariaLabel}>
    {items.map((item) => <a key={item.id} href={item.href} data-nav-id={item.id} className={`nav-item${value === item.id ? ' active' : ''}`} aria-current={value === item.id ? 'page' : undefined}>{item.label}</a>)}
    <span className="nav-indicator" aria-hidden="true" style={{ transform: `translate(${indicator.x}px, ${indicator.y}px)`, width: indicator.width, height: indicator.height, opacity: ready && indicator.visible ? 1 : 0, ...(ready ? {} : { transition: 'none' }) }} />
  </nav>;
}

export type SkeletonKind = 'library' | 'summary' | 'rows' | 'stats' | 'detail' | 'editor' | 'settings' | 'review' | 'shell';

function SkeletonLine({ size = 'long' }: { size?: 'short' | 'medium' | 'long' | 'title' }) {
  return <span className={`skeleton-line skeleton-shimmer ${size}`} />;
}

function SkeletonHeading() {
  return <div className="skeleton-heading"><div className="skeleton-heading-copy"><SkeletonLine size="title" /><SkeletonLine size="medium" /></div><span className="skeleton-block skeleton-shimmer" /></div>;
}

function SkeletonSummary() {
  return <div className="skeleton-summary-grid">{Array.from({ length: 4 }, (_, index) => <div className="skeleton-summary" key={index}><SkeletonLine size="medium" /><SkeletonLine size="title" /><SkeletonLine size="long" /></div>)}</div>;
}

function SkeletonRows({ review = false }: { review?: boolean }) {
  return <div className="skeleton-list">{!review && <div className="skeleton-toolbar"><SkeletonLine size="medium" /><SkeletonLine size="short" /></div>}{Array.from({ length: 3 }, (_, index) => <div className="skeleton-row" key={index}><span className="skeleton-row-index skeleton-shimmer" /><div className="skeleton-row-copy"><SkeletonLine /><SkeletonLine size="medium" /></div><SkeletonLine size="short" /><SkeletonLine size="short" /></div>)}</div>;
}

function SkeletonPanel({ chart = false, editor = false }: { chart?: boolean; editor?: boolean }) {
  return <div className={`skeleton-panel${chart ? ' skeleton-chart' : ''}`}><SkeletonLine size="medium" /><SkeletonLine size="short" />{chart ? <div className="skeleton-bars">{[74, 92, 55, 38].map((width, index) => <span className="skeleton-line skeleton-shimmer" style={{ width: `${width}%` }} key={index} />)}</div> : editor ? <>{[0, 1, 2].map((index) => <div className="skeleton-field" key={index}><SkeletonLine size="short" /><span className="skeleton-block skeleton-shimmer" /></div>)}</> : <><SkeletonLine /><SkeletonLine /><SkeletonLine size="medium" /></>}</div>;
}

export function Skeleton({ kind = 'library' }: { kind?: SkeletonKind }) {
  let content: ReactNode;
  switch (kind) {
    case 'summary': content = <SkeletonSummary />; break;
    case 'rows': content = <SkeletonRows />; break;
    case 'review': content = <SkeletonRows review />; break;
    case 'settings': content = <><div className="skeleton-toolbar"><SkeletonLine size="medium" /><SkeletonLine size="short" /></div><SkeletonRows /></>; break;
    case 'stats': content = <><SkeletonSummary /><div className="skeleton-columns"><SkeletonPanel chart /><SkeletonPanel chart /></div><SkeletonPanel chart /></>; break;
    case 'editor': content = <div className="skeleton-columns skeleton-detail"><SkeletonPanel editor /><div><SkeletonPanel /><SkeletonPanel editor /></div></div>; break;
    case 'detail': content = <><SkeletonHeading /><div className="skeleton-columns skeleton-detail"><div><SkeletonPanel /><SkeletonPanel /><SkeletonPanel /></div><div><SkeletonPanel /><SkeletonPanel /></div></div></>; break;
    case 'shell': content = <><SkeletonHeading /><SkeletonSummary /><SkeletonRows /></>; break;
    default: content = <><SkeletonHeading /><SkeletonSummary /><div className="skeleton-toolbar"><SkeletonLine size="medium" /><SkeletonLine size="short" /></div><SkeletonRows /></>;
  }
  return <div className={`skeleton-screen skeleton-${kind}`} aria-hidden="true">{content}</div>;
}

export function LoadingContent({ loading, kind = 'library', className = '', children }: {
  loading: boolean;
  kind?: SkeletonKind;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const [showPlaceholder, setShowPlaceholder] = useState(loading);
  useEffect(() => {
    if (loading) { setShowPlaceholder(true); return; }
    const timer = window.setTimeout(() => setShowPlaceholder(false), reduced ? 40 : CROSSFADE_DURATION);
    return () => window.clearTimeout(timer);
  }, [loading, reduced]);

  return <div className={`loading-content loading-kind-${kind} ${loading ? 'is-loading' : 'is-ready'} ${className}`.trim()} aria-busy={loading}>
    <div className="loading-content-body" inert={loading} aria-hidden={loading || undefined}>{children}</div>
    {(showPlaceholder || loading) && <div className="loading-content-placeholder" aria-hidden={!loading || undefined}><span className="visually-hidden" role="status">正在加载…</span><Skeleton kind={kind} /></div>}
  </div>;
}

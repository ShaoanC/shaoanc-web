import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { EditorContentSkeleton, EditorPageSkeleton, ReviewCandidatesSkeleton, ReviewPageSkeleton, SettingsPageSkeleton, SettingsTableSkeleton, StatsPanelsSkeleton, TaskRowsSkeleton, TasksPageSkeleton, SkeletonPageHeader, AiProfileSkeleton, BackupSettingsSkeleton, TestDataSkeleton } from './PageSkeletons';
import { getActiveApiRequestCount, getApiActivitySnapshot, subscribeToApiActivity } from './api';
import { isLibraryPath } from './LibraryLocation';

// Web Animations requires a resolved easing, matching --motion-ease-enter in styles.css.
const ENTER_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const CROSSFADE_DURATION = 220;
const REDUCED_FADE_DURATION = 40;
const ROUTE_ENTER_DURATION = 280;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const QUARTER_TURN_DURATION = 280;
type QuarterTurnResize = { element: HTMLElement; from: number; to: number };

/**
 * Spins an element a quarter turn (scaled so the result fits) while its rotated replacement is prepared.
 * The final frame is held until settle(), which callers run in a layout effect once the new image is in place.
 */
export function useQuarterTurn() {
  const reduced = useReducedMotion();
  const animations = useRef<Animation[]>([]);
  const settle = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);
  const turn = useCallback((element: HTMLElement | null | undefined, direction: number, scale: number, resize?: QuarterTurnResize) => {
    settle();
    if (reduced || !element || typeof element.animate !== 'function') return Promise.resolve();
    const timing: KeyframeAnimationOptions = { duration: QUARTER_TURN_DURATION, easing: getComputedStyle(element).getPropertyValue('--motion-ease-standard').trim() || ENTER_EASING, fill: 'forwards' };
    animations.current = [element.animate([{ transform: 'none' }, { transform: `rotate(${direction * 90}deg) scale(${scale})` }], timing)];
    // Resizing the container alongside the spin avoids a height jump when the rotated image replaces it;
    // clipping it also keeps the diagonal mid-spin corners from flashing scrollbars.
    if (resize) animations.current.push(resize.element.animate([{ height: `${resize.from}px`, overflow: 'hidden' }, { height: `${resize.to}px`, overflow: 'hidden' }], timing));
    return Promise.all(animations.current.map((animation) => animation.finished)).then(() => undefined, () => undefined);
  }, [reduced, settle]);
  useEffect(() => settle, [settle]);
  return { turn, settle };
}

export type RouteDirection = 'forward' | 'back' | 'swap';

function routeStack(route: string): [stack: string, depth: number] | null {
  if (isLibraryPath(route)) return ['mistakes', 0];
  const record = route.match(/^\/mistakes\/\d+(\/edit)?$/);
  if (record) return ['mistakes', record[1] ? 2 : 1];
  if (route === '/new') return ['new', 0];
  if (route === '/page-imports') return ['new', 1];
  return null;
}

/** Moving deeper within a stack (library → question → editor) slides sideways; unrelated pages cross-fade. */
export function routeDirection(fromPath: string, toPath: string): RouteDirection | null {
  const from = fromPath.split('?')[0];
  const to = toPath.split('?')[0];
  if (from === to || (isLibraryPath(from) && isLibraryPath(to))) return null;
  const previous = routeStack(from);
  const next = routeStack(to);
  if (previous && next && previous[0] === next[0] && previous[1] !== next[1]) return next[1] > previous[1] ? 'forward' : 'back';
  return 'swap';
}

let routeTransitionId = 0;
let routeEnterTimer = 0;
let activeRouteTransition: ViewTransition | undefined;

/**
 * Swaps the visible `.route-view` with a view transition: the old page leaves as a snapshot while the new one enters live.
 * Its own name per phase keeps the two pages in separate groups, so neither morphs from the other's scroll position.
 */
export function runRouteTransition(direction: RouteDirection | null, update: () => void) {
  const root = document.documentElement;
  const id = ++routeTransitionId;
  const restartEntrance = root.hasAttribute('data-route-enter');
  window.clearTimeout(routeEnterTimer);
  activeRouteTransition?.skipTransition();
  activeRouteTransition = undefined;
  delete root.dataset.routePhase;
  delete root.dataset.routeDirection;
  delete root.dataset.routeEnter;
  // Dialogs stay above pages; a page snapshot would otherwise cover one that is closing.
  if (!direction || prefersReducedMotion() || document.visibilityState !== 'visible' || document.querySelector('[role="dialog"], [role="alertdialog"]')) {
    update();
    return;
  }
  if (typeof document.startViewTransition !== 'function') {
    flushSync(update);
    // Commit the cleared style if two navigations reuse the visible route in quick succession.
    if (restartEntrance) {
      const view = document.querySelector('.route-view:not([hidden])');
      if (view) getComputedStyle(view).getPropertyValue('animation-name');
    }
    root.dataset.routeEnter = direction;
    routeEnterTimer = window.setTimeout(() => { delete root.dataset.routeEnter; }, ROUTE_ENTER_DURATION + 40);
    return;
  }
  root.dataset.routeDirection = direction;
  root.dataset.routePhase = 'old';
  const transition = document.startViewTransition(() => {
    if (id !== routeTransitionId) return;
    root.dataset.routePhase = 'new';
    flushSync(update);
  });
  activeRouteTransition = transition;
  const cleanup = () => {
    if (id !== routeTransitionId) return;
    activeRouteTransition = undefined;
    delete root.dataset.routePhase;
    delete root.dataset.routeDirection;
  };
  transition.ready.catch(() => undefined);
  transition.finished.then(cleanup, cleanup);
}

/** Briefly marks the row of the question that was just closed, so the reader finds their place again. */
export function markReturnedRecord(id: number) {
  if (prefersReducedMotion()) return;
  const row = document.querySelector<HTMLElement>(`.route-view:not([hidden]) .mistake-row[data-mistake-id="${id}"]`);
  if (!row) return;
  row.classList.add('is-returned');
  window.setTimeout(() => row.classList.remove('is-returned'), 1600);
}

let enterStamp = 0;
let enterIndex = 0;

/** Newly mounted items rise in, staggered within one commit; items React keeps stay still. */
export function useEnterAnimation(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof element.animate !== 'function' || prefersReducedMotion()) return;
    const now = performance.now();
    enterIndex = now - enterStamp < 50 ? enterIndex + 1 : 0;
    enterStamp = now;
    const animation = element.animate([{ opacity: .65, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: Math.min(enterIndex, 3) * 18, easing: ENTER_EASING, fill: 'backwards' });
    return () => animation.cancel();
  }, [ref]);
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

  return <div className={`loading-progress${view.visible ? ' is-visible' : ''}${view.completing ? ' is-completing' : ''}`} aria-hidden="true">
    <span ref={fill} className="loading-progress-fill" style={{ transform: `scaleX(${view.progress})`, transitionDuration: view.completing ? 'var(--motion-slow)' : view.progress <= 0.3 ? 'var(--motion-base)' : '700ms' }} />
  </div>;
}

export type SlidingTab = { id: string; label: ReactNode; panelId?: string };

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
      // Measure layout so the pressed tab's scale cannot shift the underline.
      const next = { x: selected.offsetLeft, width: selected.offsetWidth };
      setIndicator((previous) => previous.x === next.x && previous.width === next.width ? previous : next);
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
    {tabs.map((tab, index) => <button key={tab.id} id={tab.panelId ? `${tab.panelId}-tab` : undefined} type="button" role="tab" data-tab-id={tab.id} aria-controls={tab.panelId} aria-selected={value === tab.id} tabIndex={value === tab.id ? 0 : -1} className={`sliding-tab${value === tab.id ? ' is-active' : ''}`} onClick={() => onChange(tab.id)} onKeyDown={(event) => handleKeyDown(event, index)}>{tab.label}</button>)}
    <span className="tab-indicator" aria-hidden="true" style={{ width: indicator.width, transform: `translateX(${indicator.x}px)`, opacity: ready ? 1 : 0, ...(ready ? {} : { transition: 'none' }) }} />
  </div>;
}

export type NavigationItem = { id: string; href: string; label: ReactNode; element?: ReactNode };

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
      const selected = Array.from(root.querySelectorAll<HTMLElement>('.nav-item')).find((item) => item.dataset.navId === value);
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
    root.querySelectorAll<HTMLElement>('.nav-item').forEach((item) => observer.observe(item));
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
    {items.map((item) => item.element ? <span className="nav-custom-item" key={item.id}>{item.element}</span> : <a key={item.id} href={item.href} data-nav-id={item.id} className={`nav-item${value === item.id ? ' active' : ''}`} aria-current={value === item.id ? 'page' : undefined}>{item.label}</a>)}
    <span className="nav-indicator" aria-hidden="true" style={{ transform: `translate(${indicator.x}px, ${indicator.y}px)`, width: indicator.width, height: indicator.height, opacity: ready && indicator.visible ? 1 : 0, ...(ready ? {} : { transition: 'none' }) }} />
  </nav>;
}

export type SkeletonKind = 'library' | 'summary' | 'rows' | 'stats' | 'detail' | 'editor' | 'editor-page' | 'review-page' | 'settings' | 'settings-page' | 'stats-page' | 'tasks-page' | 'tasks' | 'ai-profile' | 'backups' | 'test-data' | 'review' | 'shell';

function SkeletonLine({ size = 'long' }: { size?: 'short' | 'medium' | 'long' | 'title' }) {
  return <span className={`skeleton-line skeleton-shimmer ${size}`} />;
}

function SkeletonHeading() {
  return <div className="skeleton-heading"><div className="skeleton-heading-copy"><SkeletonLine size="title" /><SkeletonLine size="medium" /></div><span className="skeleton-block skeleton-shimmer" /></div>;
}

function SkeletonSummary({ library = false }: { library?: boolean }) {
  const metrics = library
    ? [{ label: '已归档错题', tone: 'green' }, { label: '待巩固', tone: 'amber' }, { label: '已掌握', tone: 'green' }]
    : [{ label: '已归档错题', tone: 'violet' }, { label: '待完善草稿', tone: 'amber' }, { label: '累计复习', tone: 'blue' }, { label: '当前掌握率', tone: 'green' }];
  return <div className={`metrics-grid${library ? ' library-metrics' : ''}`}>{metrics.map(({ label, tone }) => <div className="metric-card skeleton-metric-card" key={label}>
    <div className="metric-top"><span className="skeleton-metric-label skeleton-shimmer">{label}</span><span className={`metric-icon ${tone}`}><span className="skeleton-metric-icon skeleton-shimmer" /></span></div>
    <div className="metric-value"><span className="skeleton-metric-count skeleton-shimmer" /><span className="skeleton-metric-unit skeleton-shimmer" /></div>
  </div>)}</div>;
}

function SkeletonRows({ review = false }: { review?: boolean }) {
  return <div className="skeleton-list">{!review && <div className="skeleton-toolbar"><SkeletonLine size="medium" /><SkeletonLine size="short" /></div>}{Array.from({ length: 3 }, (_, index) => <div className="skeleton-row" key={index}><span className="skeleton-row-index skeleton-shimmer" /><div className="skeleton-row-copy"><SkeletonLine /><SkeletonLine size="medium" /></div><SkeletonLine size="short" /><SkeletonLine size="short" /></div>)}</div>;
}

function SkeletonReading() {
  return <>
    <div className="skeleton-reading-header"><SkeletonHeading /></div>
    <div className="skeleton-reading-meta"><SkeletonLine size="short" /><SkeletonLine size="short" /><SkeletonLine size="short" /></div>
    <div className="skeleton-panel skeleton-reading-document">
      {[0, 1, 2].map((index) => <section key={index}><SkeletonLine size="short" /><SkeletonLine /><SkeletonLine /><SkeletonLine size="medium" /></section>)}
    </div>
    <div className="skeleton-panel skeleton-reading-history"><SkeletonLine size="medium" /><SkeletonLine /><SkeletonLine size="short" /></div>
  </>;
}

export function Skeleton({ kind = 'library' }: { kind?: SkeletonKind }) {
  let content: ReactNode;
  switch (kind) {
    case 'summary': content = <SkeletonSummary library />; break;
    case 'rows': content = <SkeletonRows />; break;
    case 'review': content = <ReviewCandidatesSkeleton />; break;
    case 'review-page': content = <ReviewPageSkeleton />; break;
    case 'settings': content = <SettingsTableSkeleton />; break;
    case 'settings-page': content = <SettingsPageSkeleton />; break;
    case 'ai-profile': content = <AiProfileSkeleton />; break;
    case 'backups': content = <BackupSettingsSkeleton />; break;
    case 'test-data': content = <TestDataSkeleton />; break;
    case 'tasks': content = <TaskRowsSkeleton />; break;
    case 'tasks-page': content = <TasksPageSkeleton />; break;
    case 'stats-page': content = <><SkeletonPageHeader title="学习统计" action="去复习" /><SkeletonSummary /><StatsPanelsSkeleton /></>; break;
    case 'stats': content = <><SkeletonSummary /><StatsPanelsSkeleton /></>; break;
    case 'editor': content = <EditorContentSkeleton />; break;
    case 'editor-page': content = <EditorPageSkeleton />; break;
    case 'detail': content = <SkeletonReading />; break;
    case 'shell': content = <><SkeletonHeading /><SkeletonSummary library /><SkeletonRows /></>; break;
    default: content = <><SkeletonHeading /><SkeletonSummary library /><div className="skeleton-toolbar"><SkeletonLine size="medium" /><SkeletonLine size="short" /></div><SkeletonRows /></>;
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
  const container = useRef<HTMLDivElement>(null);
  const placeholder = useRef<HTMLDivElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(loading);

  useLayoutEffect(() => {
    if (loading || reduced || !showPlaceholder) return;
    const element = container.current;
    const skeleton = placeholder.current;
    if (!element || typeof element.animate !== 'function' || !skeleton) return;
    // Real content takes up its own space right away. Only release extra skeleton height,
    // without clipping the content or pinning a height after the transition.
    const extraHeight = skeleton.scrollHeight - skeleton.clientHeight;
    if (extraHeight <= 0) return;
    const height = element.offsetHeight;
    const animation = element.animate(
      [{ minHeight: `${height + extraHeight}px` }, { minHeight: `${height}px` }],
      { duration: CROSSFADE_DURATION, easing: ENTER_EASING },
    );
    return () => animation.cancel();
  }, [loading, reduced, showPlaceholder]);

  useEffect(() => {
    if (loading) { setShowPlaceholder(true); return; }
    if (!showPlaceholder) return;
    const timer = window.setTimeout(() => setShowPlaceholder(false), reduced ? REDUCED_FADE_DURATION : CROSSFADE_DURATION + 40);
    return () => window.clearTimeout(timer);
  }, [loading, reduced, showPlaceholder]);

  return <div ref={container} className={`loading-content loading-kind-${kind} ${loading ? 'is-loading' : 'is-ready'} ${className}`.trim()} aria-busy={loading}>
    <div className="loading-content-body" inert={loading} aria-hidden={loading || undefined}>{children}</div>
    {(showPlaceholder || loading) && <div ref={placeholder} className="loading-content-placeholder" aria-hidden={!loading || undefined}><span className="visually-hidden" role="status">正在加载…</span><Skeleton kind={kind} /></div>}
  </div>;
}

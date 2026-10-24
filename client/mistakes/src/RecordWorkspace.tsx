import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { navigate } from './api';
import { MobileDrawer } from './MobileDrawer';
import { LoadingContent, type SkeletonKind } from './motion';
import { PageLoadBoundary } from './PageLoadBoundary';
import { RECORD_TOAST_EVENT, RecordViewContext, recordTarget, type RecordView } from './RecordView';
import './record-view.css';

const DetailPage = lazy(() => import('./pages/DetailPage').then((module) => ({ default: module.DetailPage })));
const EditorPage = lazy(() => import('./pages/EditorPage').then((module) => ({ default: module.EditorPage })));
type Target = { path: string; requestId: number; id: number; editing: boolean };

export function RecordWorkspace({ path, editorId, skeletonKind, children }: { path: string; editorId: number | null; skeletonKind: SkeletonKind; children: ReactNode }) {
  // The portal target never changes, even when the current editor moves into the drawer.
  const [pageHost] = useState(() => document.createElement('div'));
  const home = useRef<HTMLDivElement>(null);
  const [drawerSlot, setDrawerSlot] = useState<HTMLDivElement | null>(null);
  const [actionsContainer, setActionsContainer] = useState<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [open, setOpen] = useState(false);
  const leaveCheck = useRef<(() => boolean) | null>(null);
  const requestId = useRef(0);
  const origin = useRef({ hash: '', x: 0, y: 0 });
  const changed = useRef(new Set<number>());
  const current = useRef({ target, editorId, open });
  current.current = { target, editorId, open };
  const promoted = Boolean(target?.editing && editorId === target.id);

  const canReplace = useCallback((next: ReturnType<typeof recordTarget>) => {
    const { target: previous, editorId: backgroundEditor } = current.current;
    const unmountingEditor = previous?.editing && previous.id !== backgroundEditor && (!next?.editing || next.id !== previous.id);
    return !unmountingEditor || !leaveCheck.current || leaveCheck.current();
  }, []);

  const close = useCallback(() => {
    if (canReplace(null)) setOpen(false);
  }, [canReplace]);

  const openRecord = useCallback((nextPath: string) => {
    const next = recordTarget(nextPath);
    if (!next) { navigate(nextPath); return; }
    if (!canReplace(next)) return;
    if (!current.current.target) origin.current = { hash: window.location.hash, x: window.scrollX, y: window.scrollY };
    setTarget({ ...next, path: nextPath, requestId: ++requestId.current });
    setOpen(true);
  }, [canReplace]);

  const registerLeaveCheck = useCallback((check: () => boolean) => {
    leaveCheck.current = check;
    return () => { if (leaveCheck.current === check) leaveCheck.current = null; };
  }, []);

  const finishClose = useCallback((isOpen: boolean) => {
    if (isOpen || current.current.open) return;
    setTarget(null);
    for (const id of changed.current) window.dispatchEvent(new CustomEvent('mistakes:record-view-updated', { detail: { id } }));
    changed.current.clear();
    if (window.location.hash === origin.current.hash) requestAnimationFrame(() => window.scrollTo(origin.current.x, origin.current.y));
  }, []);

  useEffect(() => {
    const show = (event: Event) => {
      const nextPath = (event as CustomEvent<{ path: string }>).detail.path;
      event.preventDefault();
      openRecord(nextPath);
    };
    const route = () => {
      // App's navigation guard runs first and restores the old hash when leaving is cancelled.
      if (current.current.target && window.location.hash !== origin.current.hash) setOpen(false);
    };
    const updated = () => { if (current.current.target) changed.current.add(current.current.target.id); };
    window.addEventListener(RECORD_TOAST_EVENT, show);
    window.addEventListener('hashchange', route);
    window.addEventListener('mistakes:updated', updated);
    return () => {
      window.removeEventListener(RECORD_TOAST_EVENT, show);
      window.removeEventListener('hashchange', route);
      window.removeEventListener('mistakes:updated', updated);
    };
  }, [openRecord]);

  useLayoutEffect(() => {
    const destination = promoted ? drawerSlot : home.current;
    if (!destination || pageHost.parentElement === destination) return;
    if (promoted && home.current) home.current.style.minHeight = `${home.current.getBoundingClientRect().height}px`;
    destination.appendChild(pageHost);
    if (!promoted && home.current) home.current.style.minHeight = '';
  }, [pageHost, promoted, drawerSlot]);

  const recordLink = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#/"]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    const nextPath = anchor.getAttribute('href')!.slice(1);
    if (recordTarget(nextPath)) { event.preventDefault(); openRecord(nextPath); }
  };

  const view: RecordView | null = target ? {
    path: target.path, requestId: target.requestId, navigate: openRecord, registerLeaveCheck, actionsContainer, retainsEditor: promoted,
    saved: () => { if (current.current.target?.id === target.id) close(); },
    updated: (id) => {
      changed.current.delete(id);
      window.dispatchEvent(new CustomEvent('mistakes:record-view-updated', { detail: { id } }));
    },
  } : null;
  const kind = target?.editing ? 'editor' : 'detail';
  return <>
    <div ref={home} className="record-page-slot" />
    {createPortal(<RecordViewContext.Provider value={promoted ? view : null}>
      <PageLoadBoundary resetKey={path.split('?')[0]}><Suspense fallback={<LoadingContent loading kind={skeletonKind}>{null}</LoadingContent>}>{children}</Suspense></PageLoadBoundary>
    </RecordViewContext.Provider>, pageHost)}
    {target && <MobileDrawer open={open} onOpenChange={(next) => next ? setOpen(true) : close()} onOpenChangeComplete={finishClose} title={target.editing ? '编辑错题' : '错题详情'} closeLabel="关闭题目" className="record-view-drawer" footer={<div ref={setActionsContainer} className="record-view-actions" onClickCapture={recordLink} />}>
      {() => <div ref={setDrawerSlot} className="record-view-slot" onClickCapture={recordLink}>
        {!promoted && <RecordViewContext.Provider value={view}><PageLoadBoundary resetKey={target.path}><Suspense fallback={<LoadingContent loading kind={kind}>{null}</LoadingContent>}>
          {target.editing ? <EditorPage key={`editor-${target.id}`} id={target.id} /> : <DetailPage key={`detail-${target.id}`} id={target.id} />}
        </Suspense></PageLoadBoundary></RecordViewContext.Provider>}
      </div>}
    </MobileDrawer>}
  </>;
}

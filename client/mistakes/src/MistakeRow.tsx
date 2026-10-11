import { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, RotateCcw, Star, Trash2 } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { formatDate } from './api';
import { knowledgeLabel, useApp } from './context';
import { DataTypeBadge, StatusBadge } from './components';
import { DeleteButton } from './DeleteButton';
import { MarkdownContent } from './MarkdownContent';
import { SearchSummary } from './SearchSummary';
import { StarRatingDisplay, StarRatingPicker } from './StarRating';
import type { Mistake } from './types';

interface MistakeRowProps {
  mistake: Mistake;
  grid: boolean;
  opened: boolean;
  armed: boolean;
  disabled: boolean;
  deleting: boolean;
  restoring: boolean;
  ratingOpen: boolean;
  ratingSaving: boolean;
  ratingError: string;
  onOpenChange: (open: boolean) => void;
  onArmedChange: (armed: boolean) => void;
  onDelete: () => void;
  onRestore: () => void;
  onPermanentDelete: () => void;
  onRatingOpenChange: (open: boolean) => void;
  onRatingChange: (value: number) => void;
}

const DELETE_WIDTH = 88;
const SWIPE_THRESHOLD = 48;
const RATING_CIRCLE_WIDTH = 64;
const RATING_SWIPE_THRESHOLD = 96;
const RATING_STRETCH_WIDTH = 32;
type RatingPhase = 'idle' | 'dragging' | 'opening' | 'open' | 'closing' | 'retracting';

function rubberBand(distance: number, width = DELETE_WIDTH) {
  return width * (1 - 1 / (distance * 0.55 / width + 1));
}

export function MistakeRow({ mistake, grid, opened, armed, disabled, deleting, restoring, ratingOpen, ratingSaving, ratingError, onOpenChange, onArmedChange, onDelete, onRestore, onPermanentDelete, onRatingOpenChange, onRatingChange }: MistakeRowProps) {
  const { subjects, knowledgePoints } = useApp();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [ratingPhase, setRatingPhase] = useState<RatingPhase>('idle');
  const [ratingSize, setRatingSize] = useState({ width: 0, height: 156 });
  const [draftRating, setDraftRating] = useState(mistake.rating);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const ratingContent = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<RatingPhase>('idle');
  const motionTimer = useRef<number | undefined>(undefined);
  const motionFrame = useRef<number | undefined>(undefined);
  const awaitingRatingOpen = useRef(false);
  const startedOpen = useRef(false);
  const direction = useRef<'Left' | 'Right' | null>(null);
  const ignoreSwipe = useRef(false);
  const suppressClickUntil = useRef(0);
  const trashed = Boolean(mistake.deletedAt);
  const subjectName = subjects.find((subject) => subject.id === mistake.subjectId)?.name;

  function changeRatingPhase(phase: RatingPhase) {
    phaseRef.current = phase;
    setRatingPhase(phase);
  }

  function clearRatingMotion() {
    window.clearTimeout(motionTimer.current);
    if (motionFrame.current !== undefined) window.cancelAnimationFrame(motionFrame.current);
  }

  function motionDuration(duration = 220) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : duration;
  }

  function retractRating() {
    clearRatingMotion();
    awaitingRatingOpen.current = false;
    changeRatingPhase('retracting');
    setDragOffset(null);
    motionTimer.current = window.setTimeout(() => changeRatingPhase('idle'), motionDuration(360));
  }

  useEffect(() => () => clearRatingMotion(), []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => {
      setMobile(media.matches);
      if (!media.matches) {
        clearRatingMotion();
        awaitingRatingOpen.current = false;
        changeRatingPhase('idle');
        setDragOffset(null);
      }
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (ratingOpen) {
      clearRatingMotion();
      awaitingRatingOpen.current = false;
      setDraftRating(mistake.rating);
      // Keep the dragged rectangle mounted and expand it from its current width.
      changeRatingPhase('opening');
      motionTimer.current = window.setTimeout(() => {
        changeRatingPhase('open');
        motionFrame.current = window.requestAnimationFrame(() => ratingContent.current?.querySelector<HTMLElement>('.star-rating-track')?.focus({ preventScroll: true }));
      }, motionDuration());
      return clearRatingMotion;
    }
    if (phaseRef.current !== 'opening' && phaseRef.current !== 'open' && phaseRef.current !== 'closing') return;
    clearRatingMotion();
    const restoreFocus = Boolean(ratingContent.current?.contains(document.activeElement));
    changeRatingPhase('closing');
    setDragOffset(null);
    motionTimer.current = window.setTimeout(() => {
      changeRatingPhase('idle');
      if (restoreFocus) motionFrame.current = window.requestAnimationFrame(() => {
        if (document.activeElement === document.body || ratingContent.current?.contains(document.activeElement)) {
          rowRef.current?.querySelector<HTMLElement>('.mistake-detail-link')?.focus({ preventScroll: true });
        }
      });
    }, motionDuration());
    return clearRatingMotion;
  }, [ratingOpen]);

  const handlers = useSwipeable({
    trackTouch: mobile && !trashed && !disabled && (ratingPhase === 'idle' || ratingPhase === 'dragging'),
    trackMouse: mobile && !trashed && !disabled && (ratingPhase === 'idle' || ratingPhase === 'dragging'),
    preventScrollOnSwipe: false,
    delta: 10,
    onTouchStartOrOnMouseDown: ({ event }) => {
      const target = event.target as Element | null;
      ignoreSwipe.current = disabled || phaseRef.current !== 'idle' || Boolean(target?.closest('.mistake-rating-layer, .mistake-actions, .swipe-delete-action'));
      startedOpen.current = opened;
      direction.current = null;
      awaitingRatingOpen.current = false;
      if (!ignoreSwipe.current && rowRef.current) setRatingSize({ width: rowRef.current.clientWidth, height: rowRef.current.clientHeight });
    },
    onSwipeStart: ({ dir }) => {
      if (!ignoreSwipe.current) direction.current = dir === 'Left' || dir === 'Right' ? dir : null;
    },
    onSwiping: ({ deltaX, absX, absY }) => {
      if (ignoreSwipe.current || !direction.current || absX <= absY) return;
      suppressClickUntil.current = Date.now() + 400;
      if (!startedOpen.current && direction.current === 'Right') {
        changeRatingPhase('dragging');
        const distance = Math.max(0, deltaX);
        const reveal = Math.min(distance, RATING_SWIPE_THRESHOLD) + rubberBand(Math.max(0, distance - RATING_SWIPE_THRESHOLD), RATING_STRETCH_WIDTH);
        setDragOffset(reveal);
        return;
      }
      const origin = startedOpen.current ? -DELETE_WIDTH : 0;
      const distance = Math.max(0, -(origin + deltaX));
      // The first pull stretches past the action with resistance; a second pull follows the finger.
      const reveal = startedOpen.current ? distance : Math.min(distance, DELETE_WIDTH) + rubberBand(Math.max(0, distance - DELETE_WIDTH));
      setDragOffset(-Math.min(rowRef.current?.clientWidth || DELETE_WIDTH, reveal));
    },
    onSwiped: ({ dir, absX, deltaX }) => {
      if (ignoreSwipe.current || !direction.current) return;
      suppressClickUntil.current = Date.now() + 400;
      if (!startedOpen.current && direction.current === 'Right') {
        if (dir === 'Right' && deltaX >= RATING_SWIPE_THRESHOLD) {
          awaitingRatingOpen.current = true;
          onRatingOpenChange(true);
        } else retractRating();
        return;
      }
      setDragOffset(null);
      if (absX < SWIPE_THRESHOLD) return;
      if (dir === 'Left') {
        if (startedOpen.current) onDelete();
        else onOpenChange(true);
      } else if (dir === 'Right') onOpenChange(false);
    },
    onTouchEndOrOnMouseUp: () => {
      if (awaitingRatingOpen.current || phaseRef.current === 'opening' || phaseRef.current === 'open') return;
      if (phaseRef.current === 'dragging') retractRating();
      else setDragOffset(null);
    },
  });

  const attachRow = useCallback((element: HTMLDivElement | null) => {
    rowRef.current = element;
    handlers.ref(element);
  }, [handlers.ref]);
  const ratingActive = mobile && !trashed && ratingPhase !== 'idle';
  const expanded = ratingPhase === 'opening' || ratingPhase === 'open';
  const offset = mobile && !trashed ? expanded ? ratingSize.width : ratingPhase === 'closing' || ratingPhase === 'retracting' ? 0 : dragOffset ?? (opened ? -DELETE_WIDTH : 0) : 0;
  const actionWidth = Math.max(DELETE_WIDTH, -offset);
  const ratingDistance = ratingPhase === 'dragging' ? Math.max(0, dragOffset || 0) : 0;
  const ratingMorph = Math.max(0, Math.min(1, (ratingDistance - RATING_CIRCLE_WIDTH) / (RATING_SWIPE_THRESHOLD - RATING_CIRCLE_WIDTH)));
  const rowHeight = Math.max(ratingSize.height, ratingError ? 190 : 156);
  const layerHeight = expanded ? rowHeight : ratingPhase === 'dragging' ? ratingDistance <= RATING_CIRCLE_WIDTH ? ratingDistance : RATING_CIRCLE_WIDTH + (rowHeight - RATING_CIRCLE_WIDTH) * ratingMorph : 0;
  const remainingDays = mistake.deletedAt ? Math.max(0, Math.ceil((Date.parse(mistake.deletedAt) + 30 * 86400000 - Date.now()) / 86400000)) : 0;

  return <div {...handlers} ref={attachRow} className={`mistake-row ${grid ? 'is-grid' : ''} ${trashed ? 'is-trash' : ''} ${opened ? 'is-open' : ''} ${dragOffset !== null && ratingPhase === 'idle' ? 'is-dragging' : ''} ${ratingActive ? 'is-rating-active' : ''}`} data-mistake-id={mistake.id} data-rating-phase={ratingPhase} style={{ minHeight: ratingActive ? rowHeight : undefined }} onTouchCancel={() => {
    ignoreSwipe.current = true;
    if (phaseRef.current === 'dragging') retractRating();
    else setDragOffset(null);
  }}
    onClickCapture={(event) => {
      if (Date.now() < suppressClickUntil.current && (event.target as Element).closest('.mistake-detail-link')) { event.preventDefault(); event.stopPropagation(); }
    }}>
    {!trashed && mobile && <div className="mistake-rating-layer" style={{ width: expanded ? ratingSize.width : ratingDistance, height: layerHeight, borderRadius: expanded ? 0 : ratingPhase === 'dragging' ? ratingDistance <= RATING_CIRCLE_WIDTH ? ratingDistance / 2 : 32 * (1 - ratingMorph) : 32 }}>
      <div className="mistake-rating-peek" aria-hidden="true"><Star size={24} style={{ transform: `scale(${Math.min(1, ratingDistance / 44)})` }} />{ratingDistance >= RATING_CIRCLE_WIDTH && <span>{ratingDistance >= RATING_SWIPE_THRESHOLD ? '松手选星' : '右滑选星'}</span>}</div>
      <div ref={ratingContent} className="mistake-rating-content" style={{ width: ratingSize.width, height: rowHeight }} role="region" aria-label="修改错题星级" aria-hidden={ratingPhase !== 'open'} inert={ratingPhase !== 'open'} aria-busy={ratingSaving} onKeyDown={(event) => {
        if (event.key === 'Escape' && !ratingSaving) { event.preventDefault(); event.stopPropagation(); onRatingOpenChange(false); }
      }}><StarRatingPicker value={draftRating} onChange={setDraftRating} onCommit={onRatingChange} disabled={ratingSaving} error={ratingError} onClose={() => onRatingOpenChange(false)} /></div>
    </div>}
    {!trashed && <button type="button" className="swipe-delete-action" style={{ width: actionWidth }} hidden={ratingActive} disabled={!opened || disabled} tabIndex={opened ? 0 : -1} aria-hidden={!opened || ratingActive} onClick={onDelete}><Trash2 size={20} /><span>{deleting ? '删除中…' : '删除'}</span></button>}
    <div className={`mistake-item mistake-row-surface ${grid ? 'mistake-card' : ''} ${dragOffset !== null && ratingPhase === 'idle' ? 'is-dragging' : ''}`} inert={ratingPhase === 'opening' || ratingPhase === 'open' || ratingPhase === 'closing'} style={{ transform: offset ? `translateX(${offset}px)` : undefined }}
      onKeyDown={(event) => {
        if (mobile && !trashed && !disabled && event.key === 'Delete') { event.preventDefault(); onOpenChange(true); }
      }}>
      <a className="mistake-detail-link" href={`#/mistakes/${mistake.id}`} onDragStart={(event) => { if (mobile) event.preventDefault(); }}>
        <div className="mistake-main"><span className={`subject-icon subject-${mistake.subjectId}`}>{subjectName?.slice(0, 1) || <FileText size={20} />}</span><div className="mistake-copy">
          <h3><MarkdownContent variant="compact" emptyText="尚未填写题干">{mistake.question}</MarkdownContent></h3>
          <div className="mistake-meta"><DataTypeBadge isTest={mistake.isTest} /><span className={`subject-tag subject-${mistake.subjectId}`}>{subjectName || mistake.subjectId || <span className="text-muted">未选学科</span>}</span><span className={`knowledge-tag ${knowledgePoints.some((point) => point.id === mistake.primaryKnowledgePointId) ? '' : 'text-muted'}`}>{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</span>{mistake.lifecycle === 'draft' && <span className="draft-tag">草稿</span>}</div>
          <SearchSummary search={mistake.search} />
        </div></div>
      </a>
      <div className="mistake-footer"><StatusBadge status={mistake.latestReviewResult || 'unreviewed'} /><span className="mistake-date"><span className="mistake-date-line"><StarRatingDisplay value={mistake.rating} compact /><time dateTime={mistake.deletedAt || mistake.updatedAt}>{formatDate(mistake.deletedAt || mistake.updatedAt)}</time></span>{trashed && <small>还剩 {remainingDays} 天</small>}</span></div>
      <div className="mistake-actions">{trashed ? <><button type="button" className="button ghost restore-mistake-button" disabled={disabled} onClick={onRestore}><RotateCcw size={15} />{restoring ? '恢复中…' : '恢复'}</button><button type="button" className="button ghost danger-text permanent-delete-button" disabled={disabled} onClick={onPermanentDelete}><Trash2 size={15} />彻底删除</button></> : <><button type="button" className="mistake-rating-trigger" aria-haspopup="dialog" disabled={disabled || ratingSaving} onClick={() => onRatingOpenChange(true)}><Star size={17} /><span>调整星级</span></button><DeleteButton armed={armed} busy={deleting} disabled={disabled} onArmedChange={onArmedChange} onDelete={onDelete} /></>}</div>
    </div>
  </div>;
}

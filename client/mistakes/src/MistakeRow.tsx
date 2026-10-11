import { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, RotateCcw, Star, Trash2 } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { formatDate } from './api';
import { knowledgeLabel, useApp } from './context';
import { DataTypeBadge, StatusBadge } from './components';
import { DeleteButton } from './DeleteButton';
import { MarkdownContent } from './MarkdownContent';
import { SearchSummary } from './SearchSummary';
import { StarRatingDisplay, StarRatingPicker, ratingLabel } from './StarRating';
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

function rubberBand(distance: number) {
  return DELETE_WIDTH * (1 - 1 / (distance * 0.55 / DELETE_WIDTH + 1));
}

export function MistakeRow({ mistake, grid, opened, armed, disabled, deleting, restoring, ratingOpen, ratingSaving, ratingError, onOpenChange, onArmedChange, onDelete, onRestore, onPermanentDelete, onRatingOpenChange, onRatingChange }: MistakeRowProps) {
  const { subjects, knowledgePoints } = useApp();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [ratingPresent, setRatingPresent] = useState(ratingOpen);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [draftRating, setDraftRating] = useState(mistake.rating);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const ratingOverlay = useRef<HTMLDivElement | null>(null);
  const ratingTrigger = useRef<HTMLButtonElement | null>(null);
  const startedOpen = useRef(false);
  const direction = useRef<'Left' | 'Right' | null>(null);
  const ignoreSwipe = useRef(false);
  const suppressClickUntil = useRef(0);
  const trashed = Boolean(mistake.deletedAt);
  const subjectName = subjects.find((subject) => subject.id === mistake.subjectId)?.name;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (ratingOpen) {
      setDraftRating(mistake.rating);
      setRatingPresent(true);
      let frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => setRatingVisible(true));
      });
      return () => window.cancelAnimationFrame(frame);
    }
    setRatingVisible(false);
    if (!ratingPresent) return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 220;
    const timer = window.setTimeout(() => {
      setRatingPresent(false);
      ratingTrigger.current?.focus({ preventScroll: true });
    }, duration);
    return () => window.clearTimeout(timer);
  }, [ratingOpen]);

  useEffect(() => {
    if (ratingPresent && ratingOpen) ratingOverlay.current?.querySelector<HTMLElement>('.star-rating-track')?.focus({ preventScroll: true });
  }, [ratingPresent, ratingOpen]);

  const handlers = useSwipeable({
    trackTouch: mobile && !trashed && !disabled && !ratingPresent,
    trackMouse: mobile && !trashed && !disabled && !ratingPresent,
    preventScrollOnSwipe: false,
    delta: 10,
    onTouchStartOrOnMouseDown: ({ event }) => {
      const target = event.target as Element | null;
      ignoreSwipe.current = disabled || ratingPresent || Boolean(target?.closest('.mistake-rating-overlay, .mistake-rating-trigger, .mistake-actions, .swipe-delete-action'));
      startedOpen.current = opened;
      direction.current = null;
    },
    onSwipeStart: ({ dir }) => {
      if (!ignoreSwipe.current) direction.current = dir === 'Left' || dir === 'Right' ? dir : null;
    },
    onSwiping: ({ deltaX, absX, absY }) => {
      if (ignoreSwipe.current || !direction.current || absX <= absY) return;
      suppressClickUntil.current = Date.now() + 400;
      if (!startedOpen.current && direction.current === 'Right') {
        setDragOffset(Math.min(rowRef.current?.clientWidth || RATING_SWIPE_THRESHOLD, Math.max(0, deltaX)));
        return;
      }
      const origin = startedOpen.current ? -DELETE_WIDTH : 0;
      const distance = Math.max(0, -(origin + deltaX));
      // The first pull stretches past the action with resistance; a second pull follows the finger.
      const reveal = startedOpen.current ? distance : Math.min(distance, DELETE_WIDTH) + rubberBand(Math.max(0, distance - DELETE_WIDTH));
      setDragOffset(-Math.min(rowRef.current?.clientWidth || DELETE_WIDTH, reveal));
    },
    onSwiped: ({ dir, absX, deltaX }) => {
      setDragOffset(null);
      if (ignoreSwipe.current || !direction.current) return;
      suppressClickUntil.current = Date.now() + 400;
      if (!startedOpen.current && direction.current === 'Right') {
        if (dir === 'Right' && deltaX >= RATING_SWIPE_THRESHOLD) onRatingOpenChange(true);
        return;
      }
      if (absX < SWIPE_THRESHOLD) return;
      if (dir === 'Left') {
        if (startedOpen.current) onDelete();
        else onOpenChange(true);
      } else if (dir === 'Right') onOpenChange(false);
    },
    onTouchEndOrOnMouseUp: () => setDragOffset(null),
  });

  const attachRow = useCallback((element: HTMLDivElement | null) => {
    rowRef.current = element;
    handlers.ref(element);
  }, [handlers.ref]);
  const offset = mobile && !trashed ? dragOffset ?? (opened ? -DELETE_WIDTH : 0) : 0;
  const actionWidth = Math.max(DELETE_WIDTH, -offset);
  const ratingDistance = Math.max(0, offset);
  const ratingMorph = Math.max(0, Math.min(1, (ratingDistance - RATING_CIRCLE_WIDTH) / (RATING_SWIPE_THRESHOLD - RATING_CIRCLE_WIDTH)));
  const rowHeight = rowRef.current?.clientHeight || 156;
  const remainingDays = mistake.deletedAt ? Math.max(0, Math.ceil((Date.parse(mistake.deletedAt) + 30 * 86400000 - Date.now()) / 86400000)) : 0;

  return <div {...handlers} ref={attachRow} className={`mistake-row ${grid ? 'is-grid' : ''} ${trashed ? 'is-trash' : ''} ${opened ? 'is-open' : ''} ${dragOffset !== null ? 'is-dragging' : ''} ${ratingDistance ? 'is-rating-preview' : ''} ${ratingPresent ? 'is-rating-covered' : ''}`} data-mistake-id={mistake.id} onTouchCancel={() => setDragOffset(null)}
    onClickCapture={(event) => {
      if (Date.now() < suppressClickUntil.current && (event.target as Element).closest('.mistake-detail-link')) { event.preventDefault(); event.stopPropagation(); }
    }}>
    {ratingDistance > 0 && <div className={`swipe-rating-preview ${ratingDistance >= RATING_SWIPE_THRESHOLD ? 'is-ready' : ''}`} aria-hidden="true" style={{ width: ratingDistance, height: ratingDistance <= RATING_CIRCLE_WIDTH ? ratingDistance : RATING_CIRCLE_WIDTH + (rowHeight - RATING_CIRCLE_WIDTH) * ratingMorph, borderRadius: ratingDistance <= RATING_CIRCLE_WIDTH ? ratingDistance / 2 : 32 * (1 - ratingMorph) }}><Star size={24} style={{ transform: `scale(${Math.min(1, ratingDistance / 44)})` }} />{ratingDistance >= RATING_CIRCLE_WIDTH && <span>{ratingDistance >= RATING_SWIPE_THRESHOLD ? '松手选星' : '右滑选星'}</span>}</div>}
    {!trashed && <button type="button" className="swipe-delete-action" style={{ width: actionWidth }} disabled={!opened || disabled} tabIndex={opened ? 0 : -1} aria-hidden={!opened} onClick={onDelete}><Trash2 size={20} /><span>{deleting ? '删除中…' : '删除'}</span></button>}
    <div className={`mistake-item mistake-row-surface ${grid ? 'mistake-card' : ''} ${dragOffset !== null ? 'is-dragging' : ''}`} inert={ratingPresent} style={{ transform: offset ? `translateX(${offset}px)` : undefined }}
      onKeyDown={(event) => {
        if (mobile && !trashed && !disabled && event.key === 'Delete') { event.preventDefault(); onOpenChange(true); }
      }}>
      <a className="mistake-detail-link" href={`#/mistakes/${mistake.id}`} onDragStart={(event) => { if (mobile) event.preventDefault(); }}>
        <div className="mistake-main"><span className={`subject-icon subject-${mistake.subjectId}`}>{subjectName?.slice(0, 1) || <FileText size={20} />}</span><div className="mistake-copy">
          <h3><MarkdownContent variant="compact" emptyText="尚未填写题干">{mistake.question}</MarkdownContent></h3>
          <div className="mistake-meta"><DataTypeBadge isTest={mistake.isTest} /><span className={`subject-tag subject-${mistake.subjectId}`}>{subjectName || mistake.subjectId || <span className="text-muted">未选学科</span>}</span><span className={`knowledge-tag ${knowledgePoints.some((point) => point.id === mistake.primaryKnowledgePointId) ? '' : 'text-muted'}`}>{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</span>{mistake.lifecycle === 'draft' && <span className="draft-tag">草稿</span>}{trashed && <StarRatingDisplay value={mistake.rating} />}</div>
          <SearchSummary search={mistake.search} />
        </div></div>
        <StatusBadge status={mistake.latestReviewResult || 'unreviewed'} />
        <span className="mistake-date"><time dateTime={mistake.deletedAt || mistake.updatedAt}>{formatDate(mistake.deletedAt || mistake.updatedAt)}</time>{trashed && <small>还剩 {remainingDays} 天</small>}</span>
      </a>
      {!trashed && <button ref={ratingTrigger} type="button" className="mistake-rating-trigger" aria-label={`修改星级：${ratingLabel(mistake.rating)}`} aria-expanded={ratingOpen} disabled={disabled || ratingSaving} onClick={() => onRatingOpenChange(true)}><Star size={17} /><span>{ratingLabel(mistake.rating)}</span></button>}
      <div className="mistake-actions">{trashed ? <><button type="button" className="button ghost restore-mistake-button" disabled={disabled} onClick={onRestore}><RotateCcw size={15} />{restoring ? '恢复中…' : '恢复'}</button><button type="button" className="button ghost danger-text permanent-delete-button" disabled={disabled} onClick={onPermanentDelete}><Trash2 size={15} />彻底删除</button></> : <DeleteButton armed={armed} busy={deleting} disabled={disabled} onArmedChange={onArmedChange} onDelete={onDelete} />}</div>
    </div>
    {ratingPresent && <div ref={ratingOverlay} className={`mistake-rating-overlay ${ratingVisible ? 'is-open' : ''}`} role="region" aria-label="修改错题星级" aria-hidden={!ratingOpen} inert={!ratingOpen} aria-busy={ratingSaving} onKeyDown={(event) => {
      if (event.key === 'Escape' && !ratingSaving) { event.preventDefault(); event.stopPropagation(); onRatingOpenChange(false); }
    }}><StarRatingPicker value={draftRating} onChange={setDraftRating} onCommit={onRatingChange} disabled={ratingSaving} error={ratingError} onClose={() => onRatingOpenChange(false)} /></div>}
  </div>;
}

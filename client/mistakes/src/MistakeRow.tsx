import { useEffect, useRef, useState } from 'react';
import { FileText, RotateCcw, Trash2 } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { formatDate } from './api';
import { knowledgeLabel, useApp } from './context';
import { DataTypeBadge, StatusBadge } from './components';
import { DeleteButton } from './DeleteButton';
import { MarkdownContent } from './MarkdownContent';
import { SearchSummary } from './SearchSummary';
import type { Mistake } from './types';

interface MistakeRowProps {
  mistake: Mistake;
  grid: boolean;
  opened: boolean;
  armed: boolean;
  disabled: boolean;
  deleting: boolean;
  restoring: boolean;
  onOpenChange: (open: boolean) => void;
  onArmedChange: (armed: boolean) => void;
  onDelete: () => void;
  onRestore: () => void;
  onPermanentDelete: () => void;
}

const DELETE_WIDTH = 88;
const SWIPE_THRESHOLD = 48;

export function MistakeRow({ mistake, grid, opened, armed, disabled, deleting, restoring, onOpenChange, onArmedChange, onDelete, onRestore, onPermanentDelete }: MistakeRowProps) {
  const { subjects, knowledgePoints } = useApp();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const startedOpen = useRef(false);
  const horizontal = useRef(false);
  const suppressClickUntil = useRef(0);
  const trashed = Boolean(mistake.deletedAt);
  const subjectName = subjects.find((subject) => subject.id === mistake.subjectId)?.name;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const handlers = useSwipeable({
    trackTouch: mobile && !trashed && !disabled,
    trackMouse: false,
    preventScrollOnSwipe: false,
    delta: 10,
    onSwipeStart: ({ dir }) => {
      startedOpen.current = opened;
      horizontal.current = dir === 'Left' || dir === 'Right';
    },
    onSwiping: ({ deltaX, absX, absY }) => {
      if (!horizontal.current || absX <= absY) return;
      suppressClickUntil.current = Date.now() + 400;
      const origin = startedOpen.current ? -DELETE_WIDTH : 0;
      setDragOffset(Math.max(startedOpen.current ? -DELETE_WIDTH * 2 : -DELETE_WIDTH, Math.min(0, origin + deltaX)));
    },
    onSwiped: ({ dir, absX }) => {
      setDragOffset(null);
      if (!horizontal.current) return;
      suppressClickUntil.current = Date.now() + 400;
      if (absX < SWIPE_THRESHOLD) return;
      if (dir === 'Left') {
        if (startedOpen.current) onDelete();
        else onOpenChange(true);
      } else if (dir === 'Right') onOpenChange(false);
    },
    onTouchEndOrOnMouseUp: () => setDragOffset(null),
  });

  const offset = mobile && !trashed ? dragOffset ?? (opened ? -DELETE_WIDTH : 0) : 0;
  const remainingDays = mistake.deletedAt ? Math.max(0, Math.ceil((Date.parse(mistake.deletedAt) + 30 * 86400000 - Date.now()) / 86400000)) : 0;

  return <div className={`mistake-row ${grid ? 'is-grid' : ''} ${trashed ? 'is-trash' : ''} ${opened ? 'is-open' : ''}`} data-mistake-id={mistake.id}>
    {!trashed && <button type="button" className="swipe-delete-action" disabled={!opened || disabled} tabIndex={opened ? 0 : -1} aria-hidden={!opened} onClick={onDelete}><Trash2 size={20} /><span>{deleting ? '删除中…' : '删除'}</span></button>}
    <div {...handlers} className={`mistake-item mistake-row-surface ${grid ? 'mistake-card' : ''} ${dragOffset !== null ? 'is-dragging' : ''}`} style={{ transform: offset ? `translateX(${offset}px)` : undefined }}
      onClickCapture={(event) => {
        if (Date.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
      }}
      onKeyDown={(event) => {
        if (mobile && !trashed && !disabled && event.key === 'Delete') { event.preventDefault(); onOpenChange(true); }
      }}>
      <a className="mistake-detail-link" href={`#/mistakes/${mistake.id}`}>
        <div className="mistake-main"><span className={`subject-icon subject-${mistake.subjectId}`}>{subjectName?.slice(0, 1) || <FileText size={20} />}</span><div className="mistake-copy">
          <h3><MarkdownContent variant="compact" emptyText="尚未填写题干">{mistake.question}</MarkdownContent></h3>
          <div className="mistake-meta"><DataTypeBadge isTest={mistake.isTest} /><span className={`subject-tag subject-${mistake.subjectId}`}>{subjectName || mistake.subjectId || <span className="text-muted">未选学科</span>}</span><span className={`knowledge-tag ${knowledgePoints.some((point) => point.id === mistake.primaryKnowledgePointId) ? '' : 'text-muted'}`}>{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</span>{mistake.lifecycle === 'draft' && <span className="draft-tag">草稿</span>}</div>
          <SearchSummary search={mistake.search} />
        </div></div>
        <StatusBadge status={mistake.latestReviewResult || 'unreviewed'} />
        <span className="mistake-date"><time dateTime={mistake.deletedAt || mistake.updatedAt}>{formatDate(mistake.deletedAt || mistake.updatedAt)}</time>{trashed && <small>还剩 {remainingDays} 天</small>}</span>
      </a>
      <div className="mistake-actions">{trashed ? <><button type="button" className="button ghost restore-mistake-button" disabled={disabled} onClick={onRestore}><RotateCcw size={15} />{restoring ? '恢复中…' : '恢复'}</button><button type="button" className="button ghost danger-text permanent-delete-button" disabled={disabled} onClick={onPermanentDelete}><Trash2 size={15} />彻底删除</button></> : <DeleteButton armed={armed} busy={deleting} onArmedChange={onArmedChange} onDelete={onDelete} className={disabled ? 'is-disabled' : ''} />}</div>
    </div>
  </div>;
}

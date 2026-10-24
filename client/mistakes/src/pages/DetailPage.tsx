import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, BookOpen, CalendarDays, Clock3, Download, FileText, Pencil, RotateCcw, StickyNote } from 'lucide-react';
import { api, formatDate, json, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { MarkdownContent } from '../MarkdownContent';
import { ImageHistory } from '../ImageHistory';
import { useAiTasks } from '../AiTasks';
import { DataTypeBadge, ErrorState, StatusBadge } from '../components';
import { DeleteButton } from '../DeleteButton';
import { LoadingContent } from '../motion';
import { StarRatingPicker, StarRatingDisplay } from '../StarRating';
import { MistakeExport } from '../MistakeExport';
import { useRecordView } from '../RecordView';
import type { Mistake, Review } from '../types';
import '../export-selection.css';

export function DetailPage({ id }: { id: number }) {
  const view = useRecordView();
  const { subjects, knowledgePoints, notify } = useApp();
  const { jobs } = useAiTasks();
  const appliedJobs = jobs.filter((job) => job.mistakeId === id && job.applyStatus === 'applied').map((job) => job.id).join(',');
  const [mistake, setMistake] = useState<Mistake | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [ratingPreview, setRatingPreview] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [ratingSaving, setRatingSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const loadDetails = useCallback(async (background = false) => {
    const [item, history] = await Promise.all([api<Mistake>(`/mistakes/${id}`, {}, { background }), api<Review[]>(`/mistakes/${id}/reviews`, {}, { background })]);
    setMistake(item); setReviews(history); setRatingPreview(item.rating); setRatingError(''); setError('');
  }, [id]);

  useEffect(() => {
    setExportOpen(false);
    void loadDetails().catch((err) => setError(err.message));
  }, [loadDetails]);

  useEffect(() => {
    const updated = (event: Event) => {
      if ((event as CustomEvent<{ id: number }>).detail.id === id) void loadDetails(true).catch(() => { /* Keep the current detail until a later refresh succeeds. */ });
    };
    window.addEventListener('mistakes:record-view-updated', updated);
    return () => window.removeEventListener('mistakes:record-view-updated', updated);
  }, [id, loadDetails]);

  useEffect(() => {
    if (!appliedJobs) return;
    api<Mistake>(`/mistakes/${id}`, {}, { background: true }).then(setMistake).catch((err) => setError(err.message));
  }, [id, appliedJobs]);

  async function remove() {
    setDeleting(true);
    try {
      await api(`/mistakes/${id}`, { method: 'DELETE' });
      notify('错题已移入回收站，30 天内可恢复。');
      if (view) view.saved();
      else navigate('/mistakes');
    } catch (err) { notify((err as Error).message, 'error'); setDeleting(false); }
  }

  async function restore() {
    setRestoring(true);
    try {
      await api<Mistake>(`/mistakes/${id}/restore`, { method: 'POST' });
      notify('错题及复习记录已恢复。');
      if (view) view.saved();
      else navigate('/mistakes?trash=1');
    } catch (err) { notify((err as Error).message, 'error'); setRestoring(false); }
  }

  async function saveRating(rating: number) {
    setRatingSaving(true);
    setRatingError('');
    try {
      const item = await api<Mistake>(`/mistakes/${id}`, json({ rating }, 'PATCH'));
      setMistake(item);
      setRatingPreview(item.rating);
    } catch (err) {
      setRatingError((err as Error).message);
    } finally { setRatingSaving(false); }
  }

  const subjectName = subjects.find((subject) => subject.id === mistake?.subjectId)?.name || mistake?.subjectId;
  return <LoadingContent loading={!mistake && !error} kind="detail" className="detail-page detail-reading">
    {error ? <ErrorState message={error} /> : mistake && <>
      {!view && <a className="back-link" href={mistake.deletedAt ? '#/mistakes?trash=1' : '#/mistakes'}><ArrowLeft size={16} /> {mistake.deletedAt ? '返回回收站' : '返回我的错题'}</a>}
      <header className="detail-header detail-reading-header">
        <div>
          {!view && <><div className="eyebrow">浏览详情</div><h1>错题详情</h1></>}
          <div className="detail-subtitle">
            <DataTypeBadge isTest={mistake.isTest} />
            <span className={`subject-tag subject-${mistake.subjectId}`}>{subjectName || <span className="text-muted">未选学科</span>}</span>
            {mistake.lifecycle === 'draft' ? <span className="draft-tag">草稿</span> : <StatusBadge status={mistake.latestReviewResult || 'unreviewed'} />}
            <span>记录 #{mistake.id}</span>
          </div>
        </div>
        <div className="detail-actions">
          <ImageHistory mistakeId={id} />
          {mistake.deletedAt ? <button className="button primary" disabled={restoring} onClick={() => void restore()}><RotateCcw size={16} /> {restoring ? '正在恢复…' : '恢复错题'}</button> : <>
            <button className="button secondary detail-export-button" disabled={deleting || ratingSaving} onClick={() => { setConfirmDelete(false); setExportOpen(true); }}><Download size={16} />导出这道题</button>
            {mistake.lifecycle === 'archived' && <a className="button primary" href={`#/review?mistakeId=${id}`}><RotateCcw size={16} /> 复习这道题</a>}
            <DeleteButton armed={confirmDelete} onArmedChange={setConfirmDelete} busy={deleting} onDelete={() => void remove()} className="detail-delete-button" />
          </>}
        </div>
      </header>
      <dl className="detail-facts detail-reading-meta">
        <div><dt>主知识点</dt><dd><span className={knowledgePoints.some((point) => point.id === mistake.primaryKnowledgePointId) ? undefined : 'text-muted'}>{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</span></dd></div>
        <div><dt>辅助知识点</dt><dd>{mistake.auxiliaryKnowledgePointIds.length ? mistake.auxiliaryKnowledgePointIds.map((pointId) => <span className={`knowledge-pill${knowledgePoints.some((point) => point.id === pointId) ? '' : ' text-muted'}`} key={pointId}>{knowledgeLabel(knowledgePoints, pointId)}</span>) : <span className="text-muted">暂未标注</span>}</dd></div>
      </dl>
      <div className="field detail-rating-field detail-reading-rating">
        <span>星级标记</span>
        {mistake.deletedAt ? <StarRatingDisplay value={mistake.rating} /> : <StarRatingPicker value={ratingPreview} onChange={setRatingPreview} onCommit={saveRating} disabled={ratingSaving} error={ratingError} onClose={() => { setRatingPreview(mistake.rating); setRatingError(''); }} />}
      </div>
      {mistake.deletedAt ? <div className="draft-notice"><Clock3 size={18} /><div><strong>这道错题在回收站中</strong><span>题目及复习记录会保留至 {formatDate(new Date(Date.parse(mistake.deletedAt) + 30 * 86400000).toISOString())}，恢复后可继续编辑和复习。</span></div></div> : mistake.lifecycle === 'draft' && <div className="draft-notice"><FileText size={18} /><div><strong>这是一份待完善的草稿</strong><span>编辑并归档后，就可以在复习中练习这道题。</span></div><a className="text-link" href={`#/mistakes/${id}/edit`}>继续编辑<Pencil size={14} /></a></div>}
      <article className="detail-document" aria-label="错题内容">
        <section className="detail-document-section question-panel">
          <div className="section-heading"><BookOpen size={18} /><h2>题目</h2></div>
          <MarkdownContent className="prose question-text" emptyText="题干暂未填写">{mistake.question}</MarkdownContent>
        </section>
        <section className="detail-document-section">
          <div className="section-heading"><h2>正确答案</h2></div>
          <MarkdownContent className="prose" emptyText="还没有填写答案，可以通过编辑补充。">{mistake.answer}</MarkdownContent>
        </section>
        <section className="detail-document-section">
          <div className="section-heading"><h2>解题分析</h2></div>
          <MarkdownContent className="prose" emptyText="还没有填写分析。记下解题思路，方便下次回顾。">{mistake.analysis}</MarkdownContent>
        </section>
        <section className="detail-reading-note">
          <div className="section-heading"><StickyNote size={18} /><h2>我的笔记</h2></div>
          <MarkdownContent className="prose" emptyText="留一句给下次的自己：这道题需要注意什么？">{mistake.note}</MarkdownContent>
        </section>
      </article>
      <section className="detail-reading-history">
        <div className="section-heading"><RotateCcw size={18} /><h2>复习记录</h2><span className="count-pill">{reviews.length}</span></div>
        {reviews.length ? <div className="review-history">{reviews.map((review) => <div className="history-item" key={review.id}><span className={`history-dot status-${review.result}`} /><StatusBadge status={review.result} /><time>{formatDate(review.createdAt, true)}</time></div>)}</div> : <div className="history-empty"><span className="history-empty-icon"><RotateCcw size={24} /></span><p>还没有复习记录</p><small>完成一次复习，就会记录在这里。</small></div>}
      </section>
      <footer className="detail-dates detail-reading-footer">
        <span><CalendarDays size={14} /> 录入于 {formatDate(mistake.createdAt)}</span>
        <span><Clock3 size={14} /> 更新于 {formatDate(mistake.updatedAt)}</span>
      </footer>
      {!mistake.deletedAt && (view
        ? view.actionsContainer && createPortal(<a className="button primary" href={`#/mistakes/${id}/edit`}><Pencil size={16} /> 编辑错题</a>, view.actionsContainer)
        : <a className="button primary detail-edit-button" href={`#/mistakes/${id}/edit`}><Pencil size={16} /> 编辑错题</a>)}
      {exportOpen && !mistake.deletedAt && <MistakeExport mistakes={[mistake]} single onClose={() => setExportOpen(false)} />}
    </>}
  </LoadingContent>;
}

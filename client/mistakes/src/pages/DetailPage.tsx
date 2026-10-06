import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CalendarDays, Clock3, FileText, Layers, Pencil, RotateCcw, StickyNote, Trash2 } from 'lucide-react';
import { api, formatDate, navigate } from '../api';
import { knowledgeLabel, useApp } from '../context';
import { MarkdownContent } from '../MarkdownContent';
import { ErrorState, Modal, StatusBadge } from '../components';
import { LoadingContent } from '../motion';
import type { Mistake, Review } from '../types';

export function DetailPage({ id }: { id: number }) {
  const { subjects, knowledgePoints, notify } = useApp();
  const [mistake, setMistake] = useState<Mistake | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([api<Mistake>(`/mistakes/${id}`), api<Review[]>(`/mistakes/${id}/reviews`)]).then(([item, history]) => { setMistake(item); setReviews(history); }).catch((err) => setError(err.message));
  }, [id]);

  async function remove() {
    setDeleting(true);
    try {
      await api(`/mistakes/${id}`, { method: 'DELETE' });
      notify('错题已删除。');
      navigate('/mistakes');
    } catch (err) { notify((err as Error).message, 'error'); setDeleting(false); }
  }

  const subjectName = subjects.find((subject) => subject.id === mistake?.subjectId)?.name || mistake?.subjectId;
  return <LoadingContent loading={!mistake && !error} kind="detail">
    {error ? <ErrorState message={error} /> : mistake && <>
    <a className="back-link" href="#/mistakes"><ArrowLeft size={16} /> 返回我的错题</a>
    <div className="detail-header"><div><div className="eyebrow">题目、解答与复习记录</div><h1>错题详情</h1><div className="detail-subtitle"><span className={`subject-tag subject-${mistake.subjectId}`}>{subjectName || '未选学科'}</span>{mistake.lifecycle === 'draft' ? <span className="draft-tag">草稿</span> : <StatusBadge status={mistake.latestReviewResult || 'unreviewed'} />}<span>记录 #{mistake.id}</span></div></div><div className="detail-actions"><button className="button ghost danger-text" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> 删除</button><a className="button secondary" href={`#/mistakes/${id}/edit`}><Pencil size={16} /> 编辑错题</a></div></div>
    {mistake.lifecycle === 'draft' && <div className="draft-notice"><FileText size={18} /><div><strong>这是一份待完善的草稿</strong><span>编辑并归档后，就可以在复习中练习这道题。</span></div><a className="text-link" href={`#/mistakes/${id}/edit`}>继续编辑<Pencil size={14} /></a></div>}
    <div className="detail-layout"><div className="detail-main"><section className="panel question-panel"><div className="section-heading"><span className="panel-title-icon violet"><BookOpen size={18} /></span><h2>题目</h2></div><MarkdownContent className={`prose question-text ${!mistake.question ? 'muted' : ''}`}>{mistake.question || '题干暂未填写'}</MarkdownContent></section><section className="panel"><div className="section-heading"><span className="panel-title-icon green"><FileText size={18} /></span><h2>答案与分析</h2></div><div className="answer-section"><h3>正确答案</h3><MarkdownContent className={`prose ${!mistake.answer ? 'muted' : ''}`}>{mistake.answer || '还没有填写答案，可以通过编辑补充。'}</MarkdownContent></div><div className="answer-section"><h3>解题分析</h3><MarkdownContent className={`prose ${!mistake.analysis ? 'muted' : ''}`}>{mistake.analysis || '还没有填写分析。记下解题思路，方便下次回顾。'}</MarkdownContent></div></section><section className="panel note-panel"><div className="section-heading"><span className="panel-title-icon amber"><StickyNote size={18} /></span><h2>我的笔记</h2></div><MarkdownContent className={`prose ${!mistake.note ? 'muted' : ''}`}>{mistake.note || '留一句给下次的自己：这道题需要注意什么？'}</MarkdownContent></section></div>
      <aside className="detail-aside"><section className="panel"><div className="section-heading"><Layers size={18} /><h2>整理信息</h2></div><dl className="detail-facts"><div><dt>学科</dt><dd>{subjectName}</dd></div><div><dt>主知识点</dt><dd>{knowledgeLabel(knowledgePoints, mistake.primaryKnowledgePointId)}</dd></div><div><dt>辅助知识点</dt><dd>{mistake.auxiliaryKnowledgePointIds.length ? mistake.auxiliaryKnowledgePointIds.map((pointId) => <span className="knowledge-pill" key={pointId}>{knowledgeLabel(knowledgePoints, pointId)}</span>) : '暂未标注'}</dd></div></dl><div className="detail-dates"><span><CalendarDays size={14} /> 录入于 {formatDate(mistake.createdAt)}</span><span><Clock3 size={14} /> 更新于 {formatDate(mistake.updatedAt)}</span></div>{mistake.lifecycle === 'archived' && <a className="button primary full-width" href={`#/review?mistakeId=${id}`}><RotateCcw size={16} /> 复习这道题</a>}</section><section className="panel"><div className="section-heading"><RotateCcw size={18} /><h2>复习记录</h2><span className="count-pill">{reviews.length}</span></div>{reviews.length ? <div className="review-history">{reviews.map((review) => <div className="history-item" key={review.id}><span className={`history-dot status-${review.result}`} /><StatusBadge status={review.result} /><time>{formatDate(review.createdAt, true)}</time></div>)}</div> : <div className="history-empty"><span className="history-empty-icon"><RotateCcw size={24} /></span><p>还没有复习记录</p><small>完成一次复习，就会记录在这里。</small></div>}</section></aside></div>
    {confirmDelete && <Modal title="删除这道错题？" onClose={() => setConfirmDelete(false)}><p className="modal-description">这道错题和对应的复习记录将一并删除。</p><div className="modal-actions"><button className="button secondary" disabled={deleting} onClick={() => setConfirmDelete(false)}>取消</button><button className="button danger" disabled={deleting} onClick={remove}>{deleting ? '正在删除…' : '删除错题'}</button></div></Modal>}
    </>}
  </LoadingContent>;
}

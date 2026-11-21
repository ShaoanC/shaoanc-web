import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowUp, Clock3, Coins, Image, MessageCircle, Square, SquarePen, X } from 'lucide-react';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { toast } from 'react-toastify';
import { api } from './api';
import { MarkdownContent } from './MarkdownContent';
import { MobileDrawer, useMobileLayout } from './MobileDrawer';
import { streamFollowup, type FollowupHistory, type FollowupMessage, type FollowupProfile } from './followup-api';
import { pickFollowupPrompts } from './followup-prompts';
import { useApp } from './context';
import { Select } from './Select';
import { VendorLogo } from './VendorLogo';
import type { Mistake } from './types';
import './mistake-followups.css';

const peekHeight = 0.54;
const expandedHeight = 1;
const mobileSnapPoints = [peekHeight, expandedHeight];
const background = { background: true, notifyUpdate: false };
const FollowupMarkdown = memo(MarkdownContent);
function notifyFollowup(mistakeId: number, message: string, kind: 'info' | 'success' | 'error' = 'info') {
  toast[kind](message, {
    toastId: `followup-${mistakeId}-${message}`,
    className: 'followup-toast',
    role: kind === 'error' ? 'alert' : 'status',
  });
}

function putMessage(history: FollowupHistory, message: FollowupMessage): FollowupHistory {
  const exists = history.messages.some(({ id }) => id === message.id);
  return {
    ...history,
    count: history.count + Number(!exists),
    messages: exists ? history.messages.map((item) => item.id === message.id ? message : item) : [...history.messages, message],
  };
}

function FollowupModelOption({ profile, unavailable, compact = false }: {
  profile: FollowupProfile; unavailable?: boolean; compact?: boolean;
}) {
  return <span className={compact ? 'followup-model-value' : 'followup-model-option'}>
    <span className="followup-model-mark"><VendorLogo vendorIcon={profile.vendorIcon} /></span>
    <span className="followup-model-label">
      <strong>{profile.tierLabel}</strong>
      {!compact && <span className="followup-model-name">{profile.model}</span>}
    </span>
    {!compact && profile.supportsVision && <span className="followup-model-vision" title="支持图片输入" aria-label="支持图片输入"><Image size={16} /></span>}
    <span className="followup-model-cost">
      <span className="model-multiplier">{profile.creditCost}×</span>
      {!compact && unavailable && <span className="followup-model-unavailable">积分不足</span>}
    </span>
  </span>;
}

function FollowupReplies({ messages, enteringId, readOnly, maySend, onRetry }: {
  messages: FollowupMessage[];
  enteringId: number | null;
  readOnly?: boolean;
  maySend: boolean;
  onRetry: (id: number) => void;
}) {
  const turns = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const reply = useRef<HTMLDivElement>(null);
  const latestReply = messages.filter((message) => message.content || message.status === 'streaming').at(-1);
  const latestId = latestReply?.id;

  useLayoutEffect(() => {
    const list = turns.current;
    const line = marker.current;
    const target = reply.current;
    if (!list || !line || !target) return;
    const placeMarker = () => {
      line.style.transform = `translateY(${target.offsetTop}px)`;
      line.style.height = `${target.offsetHeight}px`;
    };
    placeMarker();
    const observer = new ResizeObserver(placeMarker);
    observer.observe(list);
    observer.observe(target);
    return () => observer.disconnect();
  }, [latestId]);

  return <div className="followup-turns" ref={turns}>
    {latestReply && <span ref={marker} className="followup-reply-marker" aria-hidden="true"
      data-streaming={latestReply.status === 'streaming' || undefined} />}
    {messages.map((message) => <article className="followup-turn" key={message.id} data-entering={message.id === enteringId || undefined}>
      <p className="followup-question">{message.question}</p>
      <div className="followup-answer" ref={message.id === latestId ? reply : undefined}
        data-streaming={message.status === 'streaming' || undefined}>
        {message.content && <FollowupMarkdown className="prose followup-answer-text" skipImages>{message.content}</FollowupMarkdown>}
        {message.status === 'streaming' && <p className="followup-state followup-generating" role="status">
          <span className="followup-dots" aria-hidden="true"><i /><i /><i /></span>正在生成…
        </p>}
        {message.status === 'cancelled' && <p className="followup-state">已停止生成</p>}
        {message.status === 'failed' && <div className="followup-state"><span>{message.error}</span>
          {!readOnly && <button className="button ghost" disabled={!maySend} onClick={() => onRetry(message.id)}>重试</button>}
        </div>}
        {(message.profileName || message.profileId || message.model) && <div className="followup-reply-meta">
          <VendorLogo vendorIcon={message.vendorIcon} size={16} />
          <span className="followup-reply-profile" title={message.profileName ?? undefined}>{message.profileName ?? '未知配置'}</span>
          {message.durationMs != null && <time className="followup-reply-duration" dateTime={`PT${message.durationMs / 1000}S`}>
            <Clock3 size={13} aria-hidden="true" /><span className="visually-hidden">用时 </span>{(message.durationMs / 1000).toFixed(1)} s
          </time>}
          {message.creditsCharged > 0 && <span className="followup-reply-charge" title={`扣除 ${message.creditsCharged} 积分`}>
            <Coins size={13} aria-hidden="true" /><span>-{message.creditsCharged}</span><span className="visually-hidden"> 积分</span>
          </span>}
        </div>}
      </div>
    </article>)}
  </div>;
}

export function MistakeFollowups({ mistake }: { mistake: Mistake }) {
  const path = '/' + mistake.id + '/followups';
  const { user } = useApp();
  const preferenceKey = `mistakes:followup-profile:${user.id}`;
  const mobile = useMobileLayout();
  const trigger = useRef<HTMLButtonElement>(null);
  const cancelNewChat = useRef<HTMLButtonElement>(null);
  const firstPrompt = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<FollowupHistory | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loadError, setLoadError] = useState('');
  const [confirmNewChat, setConfirmNewChat] = useState(false);
  const [enteringId, setEnteringId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [composerElement, setComposerElement] = useState<HTMLFormElement | null>(null);
  const [preferredProfile, setPreferredProfile] = useState(() => {
    try { return localStorage.getItem(preferenceKey); } catch { return null; }
  });
  const lifetime = useRef<AbortController | null>(null);
  const requestNo = useRef(0);
  const currentStream = useRef(false);
  const scrollAnchor = useRef<HTMLDivElement>(null);
  const followTail = useRef(true);
  const shownRevision = useRef('');
  const available = history?.availableProfiles ?? [];
  const selected = available.find(({ id }) => id === preferredProfile) ?? available.find(({ isDefault }) => isDefault);
  const remaining = history?.dailyCreditsRemaining ?? 0;

  function chooseProfile(id: string | null) {
    setPreferredProfile(id);
    try {
      if (id) localStorage.setItem(preferenceKey, id);
      else localStorage.removeItem(preferenceKey);
    } catch { /* The selected model still applies in this drawer. */ }
  }

  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    return () => {
      controller.abort();
      requestNo.current += 1;
    };
  }, [path]);

  const refresh = useCallback(async (before?: number) => {
    const signal = lifetime.current!.signal;
    const request = ++requestNo.current;
    try {
      const latest = await api<FollowupHistory>(path + (before ? '?before=' + before : ''), { signal }, background);
      if (signal.aborted || request !== requestNo.current) return;
      setHistory((previous) => {
        if (!previous || !latest.messages.length) return latest;
        if (before) return { ...latest, messages: [...latest.messages, ...previous.messages] };
        if (!latest.nextBefore) return latest;
        const first = latest.messages[0].id;
        const older = previous.messages.filter(({ id }) => id < first);
        return older.length ? { ...latest, messages: [...older, ...latest.messages], nextBefore: previous.nextBefore } : latest;
      });
      setLoadError('');
    } catch (err) {
      if (!signal.aborted && request === requestNo.current) setLoadError((err as Error).message);
    }
  }, [path]);

  useEffect(() => { if (!open && !currentStream.current) void refresh(); }, [refresh, open, mistake.updatedAt]);
  useEffect(() => {
    if (!open || sending || busy) return;
    const sync = () => void refresh();
    sync();
    window.addEventListener('focus', sync);
    const timer = history?.activeMessageId ? window.setInterval(sync, 1500) : null;
    return () => {
      window.removeEventListener('focus', sync);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [open, sending, busy, history?.activeMessageId, mistake.updatedAt, refresh]);

  const revision = history?.contextRevision;
  const previousRevision = history?.messages.at(-1)?.contextRevision;
  useEffect(() => {
    if (!open || !revision || !previousRevision || revision === previousRevision || shownRevision.current === revision) return;
    shownRevision.current = revision;
    notifyFollowup(mistake.id, '题面已更新，后续追问将使用最新内容。');
  }, [open, revision, previousRevision, mistake.id]);

  useEffect(() => {
    if (open && loadError) notifyFollowup(mistake.id, loadError, 'error');
  }, [loadError, open, mistake.id]);

  useEffect(() => {
    if (!history || !preferredProfile || history.availableProfiles.some(({ id }) => id === preferredProfile)) return;
    setPreferredProfile(null);
    try { localStorage.removeItem(preferenceKey); } catch { /* Storage can be blocked. */ }
  }, [history, preferenceKey, preferredProfile]);

  useLayoutEffect(() => {
    const scroll = scrollAnchor.current?.closest<HTMLElement>('.followup-scroll, .mobile-filters-content');
    if (!scroll || !open) return;
    if (followTail.current) scroll.scrollTop = scroll.scrollHeight;
    const track = () => { followTail.current = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 72; };
    scroll.addEventListener('scroll', track, { passive: true });
    return () => scroll.removeEventListener('scroll', track);
  });

  function show(value: boolean) {
    if (value) {
      followTail.current = true;
      setExpanded(currentStream.current || Boolean(history?.activeMessageId));
      setEnteringId(null);
      setPrompts(pickFollowupPrompts(mistake.subjectId));
    } else {
      setConfirmNewChat(false);
    }
    setOpen(value);
  }

  function expandDrawer() {
    if (mobile) setExpanded(true);
  }

  async function send(question: string, retryMessageId?: number) {
    if (currentStream.current || !maySend || !selected) return;
    if (!retryMessageId && !question.trim()) return;
    const signal = lifetime.current!.signal;
    requestNo.current += 1;
    currentStream.current = true;
    followTail.current = !retryMessageId;
    expandDrawer();
    setSending(true);
    let imagesNotified = false;
    try {
      const message = retryMessageId ? { retryMessageId } : { question: question.trim() };
      await streamFollowup(path, { ...message, profileId: selected.id }, signal, (event) => {
        if (signal.aborted) return;
        if (event.type === 'meta') {
          if (!retryMessageId) {
            setInput('');
            setEnteringId(event.message.id);
          }
          if (event.message.imagesSkipped && !imagesNotified) {
            imagesNotified = true;
            notifyFollowup(mistake.id, '当前模型仅参考文字。');
          }
        }
        if (event.type === 'error' && event.message.error) notifyFollowup(mistake.id, event.message.error, 'error');
        setHistory((previous) => {
          if (!previous) return previous;
          if (event.type === 'delta') return {
            ...previous, messages: previous.messages.map((item) => item.id === event.id ? { ...item, content: item.content + event.text } : item),
          };
          return {
            ...putMessage(previous, event.message),
            activeMessageId: event.type === 'meta' ? event.message.id : null,
            contextRevision: event.message.contextRevision,
            dailyCreditLimit: event.dailyCreditLimit,
            dailyCreditsUsed: event.dailyCreditsUsed,
            dailyCreditsRemaining: event.dailyCreditsRemaining,
          };
        });
      });
    } catch (err) {
      if (!signal.aborted) notifyFollowup(mistake.id, (err as Error).message, 'error');
    } finally {
      if (!signal.aborted) {
        currentStream.current = false;
        setSending(false);
        void refresh();
      }
    }
  }

  async function act(action: 'cancel' | 'clear', id?: number) {
    const signal = lifetime.current!.signal;
    requestNo.current += 1;
    setBusy(true);
    try {
      if (action === 'clear') {
        await api(path, { method: 'DELETE', signal }, background);
        if (signal.aborted) return;
        setInput('');
        setPrompts(pickFollowupPrompts(mistake.subjectId));
        setHistory((current) => current && { ...current, count: 0, messages: [], nextBefore: null });
        notifyFollowup(mistake.id, '已开始新对话。', 'success');
      } else {
        const message = await api<FollowupMessage>(path + '/' + id + '/cancel', { method: 'POST', signal }, background);
        if (!signal.aborted) setHistory((current) => current && { ...putMessage(current, message), activeMessageId: null });
      }
      setConfirmNewChat(false);
    } catch (err) {
      if (signal.aborted) return;
      notifyFollowup(mistake.id, (err as Error).message, 'error');
    } finally {
      if (!signal.aborted) setBusy(false);
    }
  }

  const activeId = history?.activeMessageId;
  const generating = sending || Boolean(activeId);
  const composeAction = generating ? '停止生成' : '发送';
  const maySend = Boolean(selected && selected.creditCost <= remaining && !history?.readOnly) && !generating && !busy;
  const messages = history?.messages ?? [];
  function submit(event: FormEvent) { event.preventDefault(); void send(input); }

  function handleComposeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (mobile || event.key !== 'Enter' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey
      || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    event.preventDefault();
    if (maySend && input.trim()) event.currentTarget.form?.requestSubmit();
  }

  const controls = <AlertDialog.Root open={confirmNewChat} onOpenChange={(value, event) => {
    if (busy) event.cancel();
    else setConfirmNewChat(value);
  }}>
    {Boolean(history?.count) && !history?.readOnly && <AlertDialog.Trigger className="followup-new" disabled={generating || busy}>
      <SquarePen size={15} aria-hidden="true" />新对话
    </AlertDialog.Trigger>}
    <AlertDialog.Portal container={document.body}>
      <AlertDialog.Backdrop forceRender className="followup-confirm-backdrop" />
      <AlertDialog.Popup className="followup-confirm" initialFocus={cancelNewChat}
        finalFocus={() => firstPrompt.current && !firstPrompt.current.disabled ? firstPrompt.current : true}>
        <AlertDialog.Title>新对话</AlertDialog.Title>
        <AlertDialog.Description>这道题的追问记录将被清空。</AlertDialog.Description>
        <div className="followup-confirm-actions">
          <AlertDialog.Close ref={cancelNewChat} className="button secondary" disabled={busy}>取消</AlertDialog.Close>
          <button type="button" className="button primary" disabled={busy || generating} onClick={() => void act('clear')}>
            {busy ? '正在开始…' : '开始新对话'}
          </button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>;
  const headerActions = <>
    {history && <span className="followup-quota" title="今日剩余积分">
      <span className="visually-hidden">今日剩余积分 </span>
      <span className="followup-quota-value"><strong>{remaining}</strong>/{history.dailyCreditLimit}</span>
      <Coins size={14} aria-hidden="true" />
    </span>}
    {controls}
  </>;
  const log = <>
    {!history && (loadError
      ? <button type="button" className="button secondary" onClick={() => { setLoadError(''); void refresh(); }}>重新加载</button>
      : <p className="followup-state" role="status">正在加载追问…</p>)}
    {history?.nextBefore && <button className="button ghost followup-earlier" onClick={() => {
      followTail.current = false;
      expandDrawer();
      void refresh(history.nextBefore!);
    }}>加载更早的追问</button>}
    <FollowupReplies messages={messages} enteringId={enteringId} readOnly={history?.readOnly} maySend={maySend}
      onRetry={(id) => void send('', id)} />
    {history && selected && messages.length === 0 && !history.readOnly && <div className="followup-prompts" role="group" aria-label="快捷提问">
      {prompts.map((prompt, index) =>
        <button type="button" key={prompt} className="followup-prompt" ref={index === 0 ? firstPrompt : undefined}
          disabled={!maySend} onClick={() => void send(prompt)}>
          {prompt}<span aria-hidden="true"><ArrowUp size={13} /></span>
        </button>)}
    </div>}
    <div ref={scrollAnchor} />
  </>;
  const composer = history && !history.readOnly && <form className="followup-compose" ref={setComposerElement} onSubmit={submit}>
    <div className="followup-compose-field">
      <textarea id={'followup-question-' + mistake.id} aria-label="输入追问" rows={2} maxLength={1000} value={input}
        placeholder={selected ? '输入你的追问' : '暂无可用模型'} disabled={!selected} onFocus={expandDrawer} onKeyDown={handleComposeKeyDown}
        onChange={(event) => setInput(event.target.value)} />
      {selected && <div className="followup-model-picker">
        <Select ariaLabel="追问模型" value={selected.id} onChange={chooseProfile} disabled={generating || busy}
          options={available.map((profile) => ({ value: profile.id, label: profile.tierLabel, disabled: profile.creditCost > remaining }))}
          portalContainer={composerElement} popupMinWidth={296}
          renderValue={() => <FollowupModelOption profile={selected} compact />}
          renderOption={(option) => <FollowupModelOption profile={available.find(({ id }) => id === option.value)!} unavailable={option.disabled} />} />
      </div>}
      <button className="followup-compose-action" type={generating ? 'button' : 'submit'} aria-label={composeAction} title={composeAction}
        disabled={generating ? busy || !activeId : !maySend || !input.trim()}
        onClick={generating && activeId ? () => void act('cancel', activeId) : undefined}>
        {generating ? <Square size={11} fill="currentColor" aria-hidden="true" /> : <ArrowUp size={18} aria-hidden="true" />}
      </button>
    </div>
  </form>;

  return <>
    <button className="followup-trigger" ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open}
      onClick={() => show(!open)}><MessageCircle size={16} aria-hidden="true" />追问 AI
      {Boolean(history?.count) && <span className="followup-count"><span className="visually-hidden">已有追问 </span>{history?.count}</span>}
    </button>
    {mobile ? <MobileDrawer open={open} onOpenChange={show} title="追问 AI" closeLabel="关闭追问"
      className={expanded ? 'followup-mobile followup-expanded' : 'followup-mobile'}
      triggerRef={trigger} snapPoints={mobileSnapPoints} snapPoint={expanded ? expandedHeight : peekHeight}
      onSnapPointChange={(point, event) => {
        if (event.reason !== 'swipe') return;
        if (point === expandedHeight) setExpanded(true);
        else if (point === peekHeight && expanded) show(false);
      }}
      nonModal={!expanded} headerActions={headerActions} footer={composer}>
      {() => log}
    </MobileDrawer> : <Dialog.Root open={open} onOpenChange={show} modal={false} disablePointerDismissal>
      <Dialog.Portal><Dialog.Popup className="followup-side" finalFocus={trigger}>
        <header className="followup-heading"><Dialog.Title>追问 AI</Dialog.Title>{headerActions}
          <Dialog.Close className="icon-button" aria-label="关闭追问"><X size={20} /></Dialog.Close>
        </header>
        <div className="followup-scroll scroll-area scroll-area--vertical">{log}</div>
        {composer && <footer className="followup-footer">{composer}</footer>}
      </Dialog.Popup></Dialog.Portal>
    </Dialog.Root>}
  </>;
}

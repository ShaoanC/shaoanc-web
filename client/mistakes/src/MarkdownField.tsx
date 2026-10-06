import { useId, useState, type ReactNode } from 'react';
import { MarkdownContent } from './MarkdownContent';

interface MarkdownFieldProps {
  name: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  textareaClassName?: string;
  hint?: ReactNode;
}

export function MarkdownField({ name, label, value, onChange, rows, placeholder, textareaClassName, hint }: MarkdownFieldProps) {
  const id = useId();
  const [preview, setPreview] = useState(false);

  return <div className="field markdown-field">
    <div className="markdown-field-heading">
      <label htmlFor={id}>{label}</label>
      <div className="markdown-field-modes" role="group" aria-label={`${name}显示模式`}>
        <button type="button" aria-label={`${name}：编辑`} aria-pressed={!preview} onClick={() => setPreview(false)}>编辑</button>
        <button type="button" aria-label={`${name}：预览`} aria-pressed={preview} onClick={() => setPreview(true)}>预览</button>
      </div>
    </div>
    {preview ? <div className={`markdown-field-preview${textareaClassName ? ` ${textareaClassName}` : ''}`} role="region" aria-label={`${name}预览`}>
      {value.trim() ? <MarkdownContent>{value}</MarkdownContent> : <p className="muted">暂无内容可预览。</p>}
    </div> : <textarea id={id} className={textareaClassName} aria-describedby={`${id}-hint`} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={20000} />}
    <small id={`${id}-hint`} className="markdown-field-hint">
      {hint && <>{hint}<br /></>}
      支持 Markdown；行内公式用 $...$，块公式用独立行的 $$...$$。
    </small>
  </div>;
}

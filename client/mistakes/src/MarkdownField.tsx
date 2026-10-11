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
}

export function MarkdownField({ name, label, value, onChange, rows, placeholder, textareaClassName }: MarkdownFieldProps) {
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
      <MarkdownContent emptyText="暂无内容可预览。">{value}</MarkdownContent>
    </div> : <textarea id={id} className={textareaClassName} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={20000} />}
  </div>;
}

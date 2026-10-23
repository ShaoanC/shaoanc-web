import { useId } from 'react';
import type { ImagePurpose } from './ai-types';

export function RecognitionPrompt({ purpose, value, onChange, disabled }: { purpose: ImagePurpose; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const id = useId();
  const label = purpose === 'question' ? '题干' : '答案';
  return <div className="field recognition-prompt">
    <label htmlFor={id}>二级提示词 <span className="optional-label">选填</span></label>
    <textarea id={id} aria-label={`${label}二级提示词`} aria-describedby={`${id}-help`} rows={2} maxLength={2000} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} placeholder={purpose === 'question' ? '例如：只包含第 2 问，保留必要的共用材料和配图。' : '例如：只提取第 2 问的答案。'} />
    <small id={`${id}-help`}>补充本次{label}图片的识别要求，最多 2000 字；留空按默认规则识别。</small>
  </div>;
}

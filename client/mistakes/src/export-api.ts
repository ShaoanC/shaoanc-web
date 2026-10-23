import { ApiError } from './api';
import type { ExportFile, ExportRequest } from './export-types';

// PDF generation does not modify records and must not emit mistakes:updated.
export async function requestExportPdf(request: ExportRequest, signal: AbortSignal): Promise<ExportFile> {
  const response = await fetch('/api/mistakes/exports/pdf', {
    method: 'POST', credentials: 'same-origin', signal,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new ApiError(error?.message || 'PDF 生成失败，请重试。', response.status);
  }
  const blob = await response.blob();
  signal.throwIfAborted();
  if (!blob.size || !response.headers.get('Content-Type')?.includes('application/pdf')) {
    throw new Error('未收到有效的 PDF 文件，请重试。');
  }
  const disposition = response.headers.get('Content-Disposition') || '';
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  let filename = disposition.match(/filename="([^"]+)"/i)?.[1] || '错题.pdf';
  if (encoded) {
    try { filename = decodeURIComponent(encoded); } catch { /* Keep the readable fallback. */ }
  }
  return { blob, filename, count: Number(response.headers.get('X-Export-Question-Count')) || 0, url: URL.createObjectURL(blob) };
}

export function downloadExportFile(file: ExportFile): void {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.filename;
  document.body.append(link);
  link.click();
  link.remove();
}

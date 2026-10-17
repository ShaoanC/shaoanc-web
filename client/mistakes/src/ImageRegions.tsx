import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Maximize2, Plus, MousePointer2 } from 'lucide-react';
import type { AiFigure, FigureBox } from './ai-types';

export interface EditableFigure extends AiFigure { selected: boolean; clientId: string; uploadedId?: number; uploadedUrl?: string; number?: number }
export const figureMarker = (id: string) => `[[figure:${id}]]`;
export function validBox(box: unknown): box is FigureBox {
  return Array.isArray(box) && box.length === 4 && box.every((n) => typeof n === 'number' && Number.isFinite(n)) && box[0] >= 0 && box[1] >= 0 && box[2] > 0 && box[3] > 0 && box[0] + box[2] <= 1.000001 && box[1] + box[3] <= 1.000001;
}
export async function cropFigure(url: string, box: FigureBox): Promise<Blob> {
  if (!validBox(box)) throw new Error('配图范围无效，请重新框选。');
  const image = new Image();
  image.src = url;
  await image.decode();
  const [x, y, width, height] = box;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * width));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * height));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('浏览器无法生成配图。');
  context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x * image.naturalWidth, y * image.naturalHeight, width * image.naturalWidth, height * image.naturalHeight, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('无法生成配图，请重试。')), 'image/jpeg', .94));
}
type Drag = { pointerId: number; id: string; mode: string; startX: number; startY: number; box: FigureBox };
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export function ImageRegions({ url, figures, activeId, onActive, onChange, onAdd, onZoom, disabled, redrawId, onRedrawDone }: {
  url: string; figures: EditableFigure[]; activeId: string | null; onActive: (id: string) => void; onChange: (id: string, box: FigureBox) => void; onAdd: (box: FigureBox) => void; onZoom: () => void; disabled?: boolean; redrawId?: string | null; onRedrawDone: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [draft, setDraft] = useState<FigureBox | null>(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => { setImageError(false); }, [url]);
  function point(event: PointerEvent) {
    const rect = stage.current!.getBoundingClientRect();
    return [clamp((event.clientX - rect.left) / rect.width), clamp((event.clientY - rect.top) / rect.height)];
  }
  function start(event: PointerEvent<HTMLElement>, id = '', mode = 'draw') {
    if (disabled || event.button !== 0) return;
    if (mode === 'draw' && !drawing && !redrawId) return;
    event.preventDefault(); event.stopPropagation();
    stage.current?.setPointerCapture(event.pointerId);
    const [x, y] = point(event);
    const figure = figures.find((f) => f.id === id);
    if (id) onActive(id);
    setDrag({ pointerId: event.pointerId, id, mode, startX: x, startY: y, box: figure?.box && validBox(figure.box) ? [...figure.box] : [x, y, 0, 0] });
  }
  function update(event: PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    const [x, y] = point(event);
    const dx = x - drag.startX, dy = y - drag.startY;
    const [bx, by, width, height] = drag.box;
    let box: FigureBox;
    if (drag.mode === 'draw') box = [Math.min(x, drag.startX), Math.min(y, drag.startY), Math.abs(dx), Math.abs(dy)];
    else if (drag.mode === 'move') box = [clamp(bx + dx, 0, 1 - width), clamp(by + dy, 0, 1 - height), width, height];
    else {
      const left = drag.mode.includes('w') ? clamp(bx + dx, 0, bx + width - .01) : bx;
      const top = drag.mode.includes('n') ? clamp(by + dy, 0, by + height - .01) : by;
      const right = drag.mode.includes('e') ? clamp(bx + width + dx, bx + .01, 1) : bx + width;
      const bottom = drag.mode.includes('s') ? clamp(by + height + dy, by + .01, 1) : by + height;
      box = [left, top, right - left, bottom - top];
    }
    if (drag.mode === 'draw') setDraft(box); else onChange(drag.id, box);
  }
  function finish(event: PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    if (drag.mode === 'draw') {
      const [x, y] = point(event);
      const finalBox: FigureBox = [Math.min(x, drag.startX), Math.min(y, drag.startY), Math.abs(x - drag.startX), Math.abs(y - drag.startY)];
      if (finalBox[2] >= .01 && finalBox[3] >= .01) {
        if (redrawId) { onChange(redrawId, finalBox); onRedrawDone(); } else onAdd(finalBox);
        setDrawing(false);
      }
    } else update(event);
    if (stage.current?.hasPointerCapture(event.pointerId)) stage.current.releasePointerCapture(event.pointerId);
    setDrag(null); setDraft(null);
  }
  return <div className="ai-regions">
    <div className="photo-actions ai-image-toolbar"><button type="button" className={`button secondary${drawing || redrawId ? ' is-active' : ''}`} aria-pressed={drawing || Boolean(redrawId)} disabled={disabled} onClick={() => { setDrawing(!drawing); onRedrawDone(); }}><Plus size={16} />补画配图</button><button type="button" className="table-button" onClick={onZoom}><Maximize2 size={16} />放大来源图</button></div>
    <p className="ai-notice">{drawing || redrawId ? '在图片上拖动，框住完整图形与必要标注。' : <><MousePointer2 size={13} /> 拖动编号框移动范围，拖动四角缩放。</>}</p>
    <div className="ai-region-scroll"><div ref={stage} className={`ai-region-stage${drawing || redrawId ? ' is-drawing' : ''}`} onPointerDown={(event) => start(event)} onPointerMove={update} onPointerUp={finish} onPointerCancel={() => { setDrag(null); setDraft(null); }}>
      <img src={url} alt="实际发送给 AI 的裁剪图片" draggable={false} onLoad={() => setImageError(false)} onError={() => setImageError(true)} />
      {figures.map((figure, index) => validBox(figure.box) && <div key={figure.id} className={`ai-region-box${activeId === figure.id ? ' is-active' : ''}${figure.selected ? ' is-selected' : ''}`} role="button" tabIndex={disabled ? -1 : 0} aria-label={`配图 ${figure.number || index + 1}，方向键移动，Shift 加方向键缩放`} style={{ left: `${figure.box[0] * 100}%`, top: `${figure.box[1] * 100}%`, width: `${figure.box[2] * 100}%`, height: `${figure.box[3] * 100}%`, pointerEvents: drawing || redrawId ? 'none' : undefined }} onFocus={() => onActive(figure.id)} onPointerDown={(event) => start(event, figure.id, 'move')} onKeyDown={(event) => {
        if (disabled || !validBox(figure.box) || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault(); const box: FigureBox = [...figure.box]; const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -.005 : .005;
        if (event.shiftKey) { const axis = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 2 : 3; box[axis] = clamp(box[axis] + delta, .01, 1 - box[axis - 2]); }
        else { const axis = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 0 : 1; box[axis] = clamp(box[axis] + delta, 0, 1 - box[axis + 2]); }
        onChange(figure.id, box);
      }}><span className="ai-region-number">{figure.number || index + 1}</span>{(['nw', 'ne', 'sw', 'se'] as const).map((corner) => <span key={corner} className={`ai-region-handle ai-region-${corner}`} onPointerDown={(event) => start(event, figure.id, corner)} />)}</div>)}
      {draft && <div className="ai-region-box is-draft" style={{ left: `${draft[0] * 100}%`, top: `${draft[1] * 100}%`, width: `${draft[2] * 100}%`, height: `${draft[3] * 100}%` }} />}
    </div></div>
    {imageError && <p className="form-error" role="alert">来源图片无法读取。请稍后重开校对重试，校对文字和选框会保留。</p>}
  </div>;
}

// Rotation is stored as quarter turns and applied to the original file only once, at upload.
// Each click only redraws a small preview, so phone photos are never re-encoded at full size.
export type Drawable = HTMLImageElement | HTMLCanvasElement;

const PREVIEW_MAX_SIDE = 2048;

export const quarterTurns = (turns: number) => ((turns % 4) + 4) % 4;
export const drawableSize = (source: Drawable) => source instanceof HTMLImageElement
  ? { width: source.naturalWidth, height: source.naturalHeight }
  : { width: source.width, height: source.height };

export async function withImage<T>(file: Blob, use: (image: HTMLImageElement) => T | Promise<T>): Promise<T> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    // decode() runs off the main thread, unlike the synchronous decode inside drawImage.
    try { await image.decode(); } catch { throw new Error('图片无法读取，请移除后重新选择。'); }
    return await use(image);
  } finally { URL.revokeObjectURL(url); }
}

export function rotateOnto(source: Drawable, turns: number, maxSide = Infinity): HTMLCanvasElement {
  const { width, height } = drawableSize(source);
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const drawWidth = Math.max(1, Math.round(width * scale));
  const drawHeight = Math.max(1, Math.round(height * scale));
  const turn = quarterTurns(turns);
  const canvas = document.createElement('canvas');
  canvas.width = turn % 2 ? drawHeight : drawWidth;
  canvas.height = turn % 2 ? drawWidth : drawHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('浏览器无法旋转图片，请重试。');
  context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2, canvas.height / 2); context.rotate(turn * Math.PI / 2);
  context.drawImage(source, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  return canvas;
}

export const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) => new Promise<Blob>((resolve, reject) => {
  canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('浏览器无法处理图片，请重试。')), type, quality);
});

// Decoding ahead lets the swapped-in preview paint in the same frame the rotation animation is cleared.
export async function predecode(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode().catch(() => undefined);
}

// The preview only guides cropping; crop percentages are applied to the full-size rotated original.
export function rotatedPreview(file: Blob, turns: number): Promise<Blob> {
  if (!quarterTurns(turns)) return Promise.resolve(file);
  return withImage(file, (image) => canvasBlob(rotateOnto(image, turns, PREVIEW_MAX_SIDE), 'image/jpeg', .92));
}

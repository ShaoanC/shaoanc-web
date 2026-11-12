import { useEffect, useRef, useState } from 'react';
import { cropFigure, validBox, type EditableFigure } from './ImageRegions';
import type { MistakeImage } from './ai-types';

export function useFigurePreviews(figures: EditableFigure[], images: MistakeImage[], open: boolean) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const latest = useRef(figures);
  const schedule = useRef<(() => void) | null>(null);
  const urls = useRef(new Set<string>());
  const displayed = useRef<Record<string, string>>({});
  useEffect(() => { latest.current = figures; schedule.current?.(); }, [figures]);
  useEffect(() => {
    const retained = new Set(Object.values(previews));
    for (const url of Object.values(displayed.current)) if (!retained.has(url)) {
      URL.revokeObjectURL(url); urls.current.delete(url);
    }
    displayed.current = previews;
  }, [previews]);
  useEffect(() => {
    setPreviews({});
    if (!open || !images.length) return;
    let active = true, frame = 0, rendering = false;
    const sources = new Map<string, Promise<HTMLImageElement>>();
    const cached = new Map<string, { key: string; url: string }>();
    function request() {
      if (active && !frame && !rendering) frame = requestAnimationFrame(() => { frame = 0; void render(); });
    }
    async function render() {
      rendering = true;
      const snapshot = latest.current;
      const next: Record<string, string> = {};
      await Promise.all(snapshot.map(async (figure) => {
        const source = images.find((image) => image.id === figure.imageId)?.cropUrl;
        if (!source || !validBox(figure.box)) return;
        const key = JSON.stringify([source, figure.box]);
        const previous = cached.get(figure.id);
        if (previous?.key === key) { next[figure.id] = previous.url; return; }
        try {
          let decoded = sources.get(source);
          if (!decoded) {
            const image = new Image(); image.src = source;
            decoded = image.decode().then(() => image); sources.set(source, decoded);
          }
          const image = await decoded;
          if (!active) return;
          const blob = await cropFigure(image, figure.box);
          if (!active) return;
          const url = URL.createObjectURL(blob); urls.current.add(url);
          cached.set(figure.id, { key, url }); next[figure.id] = url;
        } catch { /* Keep other figures usable if a source cannot be read. */ }
      }));
      if (!active) return;
      // Publish completed frames during continuous dragging, then catch up.
      for (const id of cached.keys()) if (!Object.hasOwn(next, id)) cached.delete(id);
      setPreviews(next); rendering = false;
      if (latest.current !== snapshot) request();
    }
    schedule.current = request; request();
    return () => {
      active = false; cancelAnimationFrame(frame); schedule.current = null;
      for (const url of urls.current) URL.revokeObjectURL(url);
      urls.current.clear();
    };
  }, [images, open]);
  return previews;
}

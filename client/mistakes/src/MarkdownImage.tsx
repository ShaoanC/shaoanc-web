import { createContext, useCallback, useContext, useEffect, useState, type ComponentProps, type CSSProperties, type SyntheticEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import PhotoSwipe from 'photoswipe';
import { X } from 'lucide-react';
import { BlurImage } from './BlurImage';
import { FIGURE_HEIGHT_SCALE, figureLineCount } from './figure-layout';
import 'photoswipe/dist/photoswipe.css';

export const MarkdownImageLink = createContext(false);

function FigureLightbox({ image, onClose }: { image: HTMLImageElement; onClose: () => void }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!host) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gallery = new PhotoSwipe({
      dataSource: [{ src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight, alt: image.alt }],
      appendToEl: host,
      mainClass: 'markdown-figure-lightbox',
      trapFocus: false,
      returnFocus: false,
      escKey: false,
      close: false,
      wheelToZoom: true,
      ...(reducedMotion ? { showAnimationDuration: 0, hideAnimationDuration: 0 } : {}),
      zoomTitle: '放大或缩小',
      errorMsg: '图片加载失败，请关闭后重试。',
      padding: { top: 60, bottom: 40, left: 16, right: 16 },
    });
    gallery.on('close', onClose);
    gallery.init();
    return () => { gallery.off('close', onClose); gallery.destroy(); };
  }, [host, image, onClose]);

  return <Dialog.Portal><Dialog.Popup ref={setHost} className="markdown-image-lightbox">
    <Dialog.Title className="sr-only">{image.alt || '题目配图'}</Dialog.Title>
    <Dialog.Close className="markdown-image-close" aria-label="关闭图片预览"><X size={24} /></Dialog.Close>
  </Dialog.Popup></Dialog.Portal>;
}

export function MarkdownImage(props: ComponentProps<'img'>) {
  return <MarkdownFigure key={JSON.stringify([props.src, props.srcSet, props.sizes])} {...props} />;
}

function MarkdownFigure({ src, alt, style, onLoad, onError, ...props }: ComponentProps<'img'>) {
  const linked = useContext(MarkdownImageLink);
  const [lines, setLines] = useState<3 | 4 | 5 | null>(4);
  const [preview, setPreview] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const closePreview = useCallback(() => setPreview(null), []);
  const imageProps = {
    ...props, src, alt, className: 'markdown-figure-image', 'data-figure-lines': lines ?? 'long',
    style: { ...style, '--figure-lines': lines ?? 4, '--figure-height-scale': FIGURE_HEIGHT_SCALE } as CSSProperties,
    onLoad: (event: SyntheticEvent<HTMLImageElement>) => {
      setLines(figureLineCount(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight));
      onLoad?.(event);
    },
  };
  // Export shares the Markdown renderer and measures native images before paginating.
  if (typeof window !== 'undefined' && typeof window.__MISTAKE_EXPORT_READY__ === 'boolean') {
    return <img {...imageProps} loading="eager" onError={onError} />;
  }

  function open(image: HTMLImageElement) {
    if (image.naturalWidth) setPreview(image);
  }

  return <Dialog.Root open={Boolean(preview)} onOpenChange={(value) => { if (!value) setPreview(null); }}>
    {failed || (!src && !props.srcSet) ? <span className="blur-image-inline-error">
      {alt ? `${alt} · 图片加载失败` : '图片加载失败'}
    </span> : <BlurImage {...imageProps} bare loading="lazy" decoding="async"
      onError={(event) => { setFailed(true); onError?.(event); }}
      role={linked ? undefined : 'button'} tabIndex={linked ? undefined : 0}
      aria-label={linked ? undefined : `放大查看：${alt || '题目配图'}`}
      title={linked ? props.title : props.title || '点击放大查看'}
      onClick={linked ? undefined : (event) => open(event.currentTarget)}
      onKeyDown={linked ? undefined : (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(event.currentTarget); }
      }} />}
    {preview && <FigureLightbox image={preview} onClose={closePreview} />}
  </Dialog.Root>;
}

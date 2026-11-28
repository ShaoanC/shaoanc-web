import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type SyntheticEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import type PhotoSwipe from 'photoswipe';
import { X } from 'lucide-react';
import { BlurImage } from './BlurImage';
import { FIGURE_HEIGHT_SCALE, figureLineCount } from './figure-layout';
import 'photoswipe/dist/photoswipe.css';

export const MarkdownImageLink = createContext(false);

interface FigurePreview {
  element: HTMLImageElement;
  src: string;
  msrc: string;
  w: number;
  h: number;
  alt: string;
}

function thumbnailSelector(image: HTMLImageElement) {
  if (!image.isConnected) return false;
  const { width, height } = image.getBoundingClientRect();
  return width > 0 && height > 0 ? 'img' : false;
}

function FigureLightbox({ preview, onClose }: { preview: FigurePreview; onClose: () => void }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const galleryRef = useRef<PhotoSwipe | null>(null);
  const closingRef = useRef(false);

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    const gallery = galleryRef.current;
    if (!gallery) onClose();
    else if (gallery.opener.isOpen) gallery.close();
  }

  useLayoutEffect(() => {
    if (!host) return;
    let cancelled = false;
    void import('photoswipe').then(({ default: PhotoSwipe }) => {
      if (cancelled || closingRef.current) return;
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const gallery = new PhotoSwipe({
        dataSource: [preview],
        appendToEl: host,
        mainClass: 'markdown-figure-lightbox',
        trapFocus: false,
        returnFocus: false,
        escKey: false,
        close: false,
        wheelToZoom: true,
        thumbSelector: thumbnailSelector(preview.element),
        showHideAnimationType: reducedMotion ? 'none' : 'zoom',
        showAnimationDuration: reducedMotion ? 0 : 340,
        hideAnimationDuration: reducedMotion ? 0 : 280,
        bgOpacity: 0.88,
        zoomTitle: '放大或缩小',
        errorMsg: '图片加载失败，请关闭后重试。',
        padding: { top: 60, bottom: 40, left: 16, right: 16 },
      });
      galleryRef.current = gallery;
      gallery.on('tapAction', (event) => {
        const target = event.originalEvent.target;
        if (target instanceof Element && target.matches('.pswp__item, .pswp__zoom-wrap')) {
          event.preventDefault();
          gallery.close();
        }
      });
      gallery.on('close', () => {
        if (cancelled) return;
        closingRef.current = true;
        host.classList.add('is-closing');
        gallery.options.thumbSelector = thumbnailSelector(preview.element);
      });
      gallery.on('destroy', () => {
        if (cancelled) return;
        galleryRef.current = null;
        onClose();
      });
      gallery.init();
      // PhotoSwipe ignores close/destroy while opening. Wait until it binds its own events.
      gallery.on('openingAnimationEnd', () => {
        if (cancelled) gallery.destroy();
        else if (closingRef.current) gallery.close();
      });
    }, () => {
      if (!cancelled && !closingRef.current) onClose();
    });
    return () => {
      cancelled = true;
      const gallery = galleryRef.current;
      galleryRef.current = null;
      if (gallery?.opener.isOpen && !gallery.isDestroying) gallery.destroy();
    };
  }, [host, preview, onClose]);

  return <Dialog.Root open onOpenChange={(open, details) => {
    if (!open) { details.cancel(); requestClose(); }
  }}>
    <Dialog.Portal><Dialog.Popup ref={setHost} className="markdown-image-lightbox" finalFocus={() => preview.element.isConnected ? preview.element : null}>
      <Dialog.Title className="sr-only">{preview.alt || '题目配图'}</Dialog.Title>
      <Dialog.Close className="markdown-image-close" aria-label="关闭大图"><X size={24} /></Dialog.Close>
    </Dialog.Popup></Dialog.Portal>
  </Dialog.Root>;
}

export function MarkdownImage(props: ComponentProps<'img'>) {
  return <MarkdownFigure key={JSON.stringify([props.src, props.srcSet, props.sizes])} {...props} />;
}

function MarkdownFigure({ src, alt, style, onLoad, onError, ...props }: ComponentProps<'img'>) {
  const linked = useContext(MarkdownImageLink);
  const [lines, setLines] = useState<3 | 4 | 5 | null>(4);
  const [preview, setPreview] = useState<FigurePreview | null>(null);
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
    if (!image.naturalWidth || !image.naturalHeight || preview) return;
    const source = image.currentSrc || image.src;
    setPreview({ element: image, src: source, msrc: source, w: image.naturalWidth, h: image.naturalHeight, alt: image.alt });
  }

  return <>
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
    {preview && <FigureLightbox preview={preview} onClose={closePreview} />}
  </>;
}

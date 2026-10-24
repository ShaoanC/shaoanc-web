import { createContext, useCallback, useContext, useEffect, useState, type ComponentProps, type CSSProperties } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import PhotoSwipe from 'photoswipe';
import { X } from 'lucide-react';
import { figureLineCount } from './figure-layout';
import 'photoswipe/dist/photoswipe.css';

export const MarkdownImageLink = createContext(false);

function FigureLightbox({ image, onClose }: { image: HTMLImageElement; onClose: () => void }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!host) return;
    const gallery = new PhotoSwipe({
      dataSource: [{ src: image.currentSrc || image.src, width: image.naturalWidth, height: image.naturalHeight, alt: image.alt }],
      appendToEl: host,
      mainClass: 'markdown-figure-lightbox',
      trapFocus: false,
      returnFocus: false,
      escKey: false,
      close: false,
      wheelToZoom: true,
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

export function MarkdownImage({ src, alt, style, ...props }: ComponentProps<'img'>) {
  const linked = useContext(MarkdownImageLink);
  const [lines, setLines] = useState<3 | 4 | 5 | null>(4);
  const [preview, setPreview] = useState<HTMLImageElement | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);
  function open(image: HTMLImageElement) {
    if (image.naturalWidth) setPreview(image);
  }

  return <Dialog.Root open={Boolean(preview)} onOpenChange={(value) => { if (!value) setPreview(null); }}>
    <img {...props} src={src} alt={alt} className="markdown-figure-image" data-figure-lines={lines ?? 'long'}
      style={{ ...style, '--figure-lines': lines ?? 4 } as CSSProperties}
      onLoad={(event) => setLines(figureLineCount(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight))}
      role={linked ? undefined : 'button'} tabIndex={linked ? undefined : 0}
      aria-label={linked ? undefined : `放大查看：${alt || '题目配图'}`}
      title={linked ? props.title : props.title || '点击放大查看'}
      onClick={linked ? undefined : (event) => open(event.currentTarget)}
      onKeyDown={linked ? undefined : (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(event.currentTarget); }
      }} />
    {preview && <FigureLightbox image={preview} onClose={closePreview} />}
  </Dialog.Root>;
}

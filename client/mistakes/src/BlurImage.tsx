import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type Ref } from 'react';
import './blur-image.css';

export interface BlurImageProps extends ComponentPropsWithoutRef<'img'> {
  allowScale?: boolean;
  bare?: boolean;
  errorLabel?: string;
}

type ImagePhase = 'loading' | 'revealing' | 'settled' | 'error';
const loadedUrls = new Set<string>();
const cacheLimit = 500;

function rememberImage(url: string) {
  if (!url || loadedUrls.has(url)) return;
  loadedUrls.add(url);
  if (loadedUrls.size > cacheLimit) {
    const oldest = loadedUrls.values().next();
    if (!oldest.done) loadedUrls.delete(oldest.value);
  }
}

function ImageSource({ imageRef, bare, allowScale = true, errorLabel = '图片加载失败', src, srcSet, sizes, className, onLoad, onError, onAnimationEnd, ...props }: BlurImageProps & { imageRef: Ref<HTMLImageElement> }) {
  const image = useRef<HTMLImageElement | null>(null);
  const [phase, setPhase] = useState<ImagePhase>(src || srcSet ? 'loading' : 'error');
  const setImageRef = useCallback((node: HTMLImageElement | null) => {
    image.current = node;
    if (typeof imageRef === 'function') {
      const cleanup = imageRef(node);
      if (typeof cleanup === 'function') return () => { image.current = null; cleanup(); };
    } else if (imageRef) imageRef.current = node;
  }, [imageRef]);

  useLayoutEffect(() => {
    const node = image.current;
    if (!node) return;
    // A responsive image may not have a selected candidate yet; don't cache its fallback src.
    const url = node.currentSrc || (src && !srcSet ? node.src : '');
    if (node.complete && node.naturalWidth > 0) {
      rememberImage(url);
      setPhase('settled');
    } else if (loadedUrls.has(url)) setPhase('settled');
  }, [src, srcSet]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    // Hidden images may never dispatch animationend.
    const timer = window.setTimeout(() => setPhase((previous) => previous === 'revealing' ? 'settled' : previous), 460);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const element = <img {...props} ref={setImageRef} sizes={sizes} srcSet={srcSet} src={src}
    className={['blur-image', `is-${phase}`, allowScale && 'blur-image-scale', className].filter(Boolean).join(' ')}
    onLoad={(event) => {
      const url = event.currentTarget.currentSrc || event.currentTarget.src;
      const cached = loadedUrls.has(url);
      rememberImage(url);
      setPhase((previous) => cached || previous === 'settled' ? 'settled' : 'revealing');
      onLoad?.(event);
    }}
    onError={(event) => { setPhase('error'); onError?.(event); }}
    onAnimationEnd={(event) => {
      if (event.animationName === 'blur-image-reveal' || event.animationName === 'blur-image-fade') {
        setPhase((previous) => previous === 'revealing' ? 'settled' : previous);
      }
      onAnimationEnd?.(event);
    }} />;

  if (bare) return element;
  return <span className={`blur-image-frame is-${phase}`}>
    {element}
    {phase === 'error' && <span className="blur-image-error">{errorLabel}</span>}
  </span>;
}

export const BlurImage = forwardRef<HTMLImageElement, BlurImageProps>(function BlurImage(props, ref) {
  // A new source gets its own element and phase, so the browser cannot keep painting the previous image.
  return <ImageSource key={JSON.stringify([props.src, props.srcSet, props.sizes])} {...props} imageRef={ref} />;
});

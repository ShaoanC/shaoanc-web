import type { ComponentProps } from 'react';

type ScrollAreaProps = ComponentProps<'div'> & {
  axis?: 'vertical' | 'horizontal' | 'both';
};

// Use native scrolling so wheel, touch, keyboard and ref behavior stay intact.
export function ScrollArea({ axis = 'vertical', className = '', ...props }: ScrollAreaProps) {
  return <div {...props} className={`scroll-area scroll-area--${axis} ${className}`.trim()} />;
}

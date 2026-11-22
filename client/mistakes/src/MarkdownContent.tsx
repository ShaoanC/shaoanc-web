import { createContext, useContext, type ComponentProps } from 'react';
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import { remarkListNumbers } from './remark-list-numbers';
import { rehypeKeepPunctuation } from './text-layout';
import { ScrollArea } from './ScrollArea';
import { Checkbox } from './components';
import { MarkdownImage, MarkdownImageLink } from './MarkdownImage';
import { rehypeStreamChunks } from './stream-text';
import type { Nodes, PhrasingContent, Root } from 'mdast';
import 'katex/dist/katex.min.css';
import './text-layout.css';

type MarkdownContentProps = {
  children: string;
  variant?: 'full' | 'compact';
  className?: string;
  emptyText?: string;
  imageUrls?: Record<string, string>;
  skipImages?: boolean;
  streamChunks?: number[];
};

// Flatten parsed blocks, keeping formula nodes intact rather than slicing source text.
function compactContent(node: Nodes): PhrasingContent[] {
  switch (node.type) {
    case 'text':
      return [{ type: 'text', value: node.value.replace(/\s+/g, ' ') }];
    case 'inlineMath':
      return [node];
    case 'math':
      return [{
        type: 'inlineMath',
        value: node.value,
        data: {
          hName: 'code',
          hProperties: { className: ['language-math', 'math-inline'] },
          hChildren: [{ type: 'text', value: node.value }],
        },
      }];
    case 'inlineCode':
      return [node];
    case 'code':
      return [{ type: 'inlineCode', value: node.value.replace(/\s+/g, ' ') }];
    case 'image':
    case 'imageReference':
      return [{ type: 'text', value: node.alt || '' }];
    case 'break':
    case 'thematicBreak':
      return [{ type: 'text', value: ' ' }];
    case 'definition':
    case 'footnoteDefinition':
    case 'footnoteReference':
      return [];
    case 'html':
      return [{ type: 'text', value: node.value.replace(/\s+/g, ' ') }];
    case 'strong':
    case 'emphasis':
    case 'delete':
      return [{ ...node, children: node.children.flatMap(compactContent) }];
    case 'link':
    case 'linkReference':
    case 'paragraph':
    case 'heading':
    case 'tableCell':
      return node.children.flatMap(compactContent);
    default:
      if ('children' in node) {
        return node.children.flatMap((child, index) => [
          ...(index ? [{ type: 'text' as const, value: ' ' }] : []),
          ...compactContent(child),
        ]);
      }
      return [];
  }
}

function remarkCompact() {
  return (tree: Root) => {
    tree.children = [{ type: 'paragraph', children: compactContent(tree) }];
  };
}

// Pass preview URLs without recreating the renderer and resetting loaded images.
const MarkdownImageUrls = createContext<MarkdownContentProps['imageUrls']>(undefined);

function ResolvedMarkdownImage({ node: _node, src, ...props }: ComponentProps<'img'> & ExtraProps) {
  const imageUrls = useContext(MarkdownImageUrls);
  const resolved = (src && imageUrls?.[src]) || src;
  return <MarkdownImage key={resolved} {...props} src={resolved} />;
}

const fullComponents: Components = {
  a: ({ node: _node, children, ...props }) => <a {...props}><MarkdownImageLink.Provider value>{children}</MarkdownImageLink.Provider></a>,
  img: ResolvedMarkdownImage,
  table: ({ node: _node, ...props }) => <ScrollArea axis="horizontal" className="markdown-table-scroll" tabIndex={0} role="region" aria-label="表格，可横向滚动"><table {...props} /></ScrollArea>,
  input: ({ node: _node, type, ...props }) => type === 'checkbox' ? <Checkbox {...props} disabled aria-label={props.checked ? '已完成' : '未完成'} /> : <input {...props} type={type} />,
};

const compactComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
};

export function MarkdownContent({ children, variant = 'full', className = '', emptyText, imageUrls, skipImages, streamChunks }: MarkdownContentProps) {
  const compact = variant === 'compact';
  const Tag = compact ? 'span' : 'div';
  const showEmptyText = !children.trim() && Boolean(emptyText);

  return <Tag className={`markdown-content markdown-content--${variant} ${className}${showEmptyText ? ' text-muted' : ''}`.trim()}>
    <MarkdownImageUrls.Provider value={imageUrls}>
      <ReactMarkdown
        remarkPlugins={compact ? [remarkGfm, remarkMath, remarkCompact] : [remarkGfm, remarkMath, remarkBreaks, remarkListNumbers]}
        rehypePlugins={streamChunks ? [rehypeKatex, rehypeKeepPunctuation, [rehypeStreamChunks, { starts: streamChunks, source: children }]] : [rehypeKatex, rehypeKeepPunctuation]}
        disallowedElements={skipImages ? ['img'] : undefined}
        components={compact ? compactComponents : fullComponents}
      >{showEmptyText ? emptyText : children}</ReactMarkdown>
    </MarkdownImageUrls.Provider>
  </Tag>;
}

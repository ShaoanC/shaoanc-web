import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import type { Nodes, PhrasingContent, Root } from 'mdast';
import 'katex/dist/katex.min.css';

type MarkdownContentProps = {
  children: string;
  variant?: 'full' | 'compact';
  className?: string;
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

const fullComponents: Components = {
  table: ({ node: _node, ...props }) => <div className="markdown-table-scroll"><table {...props} /></div>,
};

const compactComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
};

export function MarkdownContent({ children, variant = 'full', className = '' }: MarkdownContentProps) {
  const compact = variant === 'compact';
  const Tag = compact ? 'span' : 'div';

  return <Tag className={`markdown-content markdown-content--${variant} ${className}`.trim()}>
    <ReactMarkdown
      remarkPlugins={compact ? [remarkGfm, remarkMath, remarkCompact] : [remarkGfm, remarkMath, remarkBreaks]}
      rehypePlugins={[rehypeKatex]}
      components={compact ? compactComponents : fullComponents}
    >{children}</ReactMarkdown>
  </Tag>;
}

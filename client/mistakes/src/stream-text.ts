import { useState } from 'react';
import type { Element, Root, Text } from 'hast';

export function useStreamChunks(text: string, streaming: boolean) {
  const [previous, setPrevious] = useState(() => ({ text, streaming, starts: streaming && text ? [0] : [] }));
  if (text === previous.text && streaming === previous.streaming) return previous.starts;

  const appending = text.startsWith(previous.text);
  const start = appending ? previous.text.length : 0;
  const starts = appending ? previous.starts : [];
  const next = (streaming || (appending && previous.streaming)) && start < text.length ? [...starts, start] : starts;
  setPrevious({ text, streaming, starts: next });
  return next;
}

export function streamTextPieces(text: string, starts: number[], offset = 0) {
  if (!text) return [];
  const end = offset + text.length;
  const boundaries = [offset, ...starts.filter((start) => offset < start && start < end), end];
  return boundaries.slice(0, -1).map((start, index) => ({
    start,
    animated: start >= starts[0],
    text: text.slice(start - offset, boundaries[index + 1] - offset),
  }));
}

// Work on rendered text so a chunk boundary cannot interrupt Markdown syntax or formulas.
export function rehypeStreamChunks({ starts, source }: { starts: number[]; source: string }) {
  return (tree: Root) => {
    function visit(parent: Root | Element, codeStart?: number) {
      let cursor = codeStart ?? parent.position?.start.offset;
      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (child.type === 'element') {
          cursor = child.position?.end.offset ?? cursor;
          const classes = child.properties.className;
          if (Array.isArray(classes) && (classes.includes('katex') || classes.includes('katex-display'))) continue;
          const offset = child.tagName === 'code' ? child.position?.start.offset : undefined;
          const raw = offset === undefined ? '' : source.slice(offset, child.position?.end.offset);
          const block = parent.type === 'element' && parent.tagName === 'pre';
          const prefix = raw.match(block ? /^(?:[`~]{3,}[^\n]*\n|[\t ]+)/ : /^`+/)?.[0] ?? '';
          const textStart = offset === undefined ? undefined : offset + prefix.length;
          visit(child, textStart);
          continue;
        }
        if (child.type !== 'text' || !child.value.trim()) continue;
        const end = child.position?.end.offset;
        let offset = codeStart ?? (end === undefined ? undefined : end - child.value.length);
        // remark-breaks creates text fragments without positions on either side of a hard break.
        if (offset === undefined && cursor !== undefined) {
          const match = source.indexOf(child.value, cursor);
          if (match >= 0 && match + child.value.length <= (parent.position?.end.offset ?? source.length)) offset = match;
        }
        if (offset === undefined) continue;
        cursor = end ?? offset + child.value.length;
        const pieces = streamTextPieces(child.value, starts, offset);
        if (!pieces.some(({ animated }) => animated)) continue;
        const nodes = pieces.map(({ animated, text }): Text | Element => {
          const node: Text = { type: 'text', value: text };
          return animated ? { type: 'element', tagName: 'span', properties: { className: ['followup-stream-chunk'] }, children: [node] } : node;
        });
        parent.children.splice(index, 1, ...nodes);
        index += nodes.length - 1;
      }
    }
    visit(tree);
  };
}

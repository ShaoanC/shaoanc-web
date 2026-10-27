import type { Element, Root } from 'hast';

export const leadingPunctuation = /^[\t ]*[，。、；：！？,.!?;:）】》〉」』〕］｝”’…％%)\]}]+/u;

// Inline formulas are atomic boxes; attach their closing punctuation before layout.
export function rehypeKeepPunctuation() {
  return (tree: Root) => {
    function visit(parent: Root | Element) {
      const children = parent.children;
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        if (child.type !== 'element') continue;
        const classes = child.properties.className;
        const formula = Array.isArray(classes) && classes.includes('katex');
        if (formula) {
          const next = children[index + 1];
          const punctuation = next?.type === 'text' ? next.value.match(leadingPunctuation)?.[0] : null;
          if (punctuation && next.type === 'text') {
            const group: Element = { type: 'element', tagName: 'span', properties: { className: ['math-punctuation'] }, children: [child,
              { type: 'element', tagName: 'span', properties: { className: ['math-punctuation-tail'] }, children: [{ type: 'text', value: punctuation }] },
            ] };
            children[index] = group;
            next.value = next.value.slice(punctuation.length);
          }
        } else if (!['pre', 'code'].includes(child.tagName) && !(Array.isArray(classes) && classes.includes('katex-display'))) {
          visit(child);
        }
      }
    }
    visit(tree);
  };
}

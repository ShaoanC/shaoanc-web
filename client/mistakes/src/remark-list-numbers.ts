import type { Nodes, Root } from 'mdast';
import type { VFile } from 'vfile';

// Preserve each source marker instead of letting HTML renumber question lists.
export function remarkListNumbers() {
  return (tree: Root, file: VFile) => {
    const source = String(file);
    function visit(node: Nodes) {
      if (node.type === 'list' && node.ordered) {
        for (const item of node.children) {
          const offset = item.position?.start.offset;
          if (offset === undefined) continue;
          const marker = /^(\d{1,9})[.)](?=\s|$)/.exec(source.slice(offset));
          if (!marker) continue;
          item.data = { ...item.data, hProperties: { ...item.data?.hProperties, value: marker[1] } };
        }
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(tree);
  };
}

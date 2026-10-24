// Lets project write-ups mix text, images and video:
//   ![Caption](02.jpg)          → image from the project folder (no "./" needed), with a srcset
//   https://vimeo.com/123/abc   → on its own line, becomes a 16:9 player
import { embedHtml, isVideoUrl } from './embed.mjs';

function walk(node, fn) {
  fn(node);
  node.children?.forEach((c) => walk(c, fn));
}

export default function remarkMedia() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type === 'image' && !/^([a-z]+:|\/|\.)/i.test(node.url)) node.url = `./${node.url}`;
      // Write-up images sit in a column of at most 1100px, so size the srcset for that
      if (node.type === 'image') node.data = { ...node.data, hProperties: { sizes: '(max-width: 1100px) 100vw, 1100px', widths: [640, 1100, 1600, 2200] } };
      if (node.type !== 'paragraph' || node.children.length !== 1) return;
      const only = node.children[0];
      const url = only.type === 'link' ? only.url : only.type === 'text' ? only.value.trim() : '';
      if (/^https?:\/\/\S+$/.test(url) && isVideoUrl(url)) {
        node.type = 'html';
        node.value = embedHtml(url);
        delete node.children;
      }
    });
  };
}

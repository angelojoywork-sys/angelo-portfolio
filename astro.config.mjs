import { defineConfig } from 'astro/config';
import remarkMedia from './src/lib/remark-media.mjs';

export default defineConfig({
  // Change this to your real domain once you have one (used for share links / SEO).
  site: 'https://example.com',
  markdown: { remarkPlugins: [remarkMedia] },
  // Fetch a page's HTML on hover so clicking a card swaps straight away
  prefetch: { defaultStrategy: 'hover' },
  // Inline write-up images get a srcset instead of shipping the full-size original
  image: { layout: 'constrained' },
});

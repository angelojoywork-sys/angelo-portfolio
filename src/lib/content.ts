import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// Every image and video inside /content is picked up automatically.
const images = import.meta.glob<ImageMetadata>('/content/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
});
const videos = import.meta.glob<string>('/content/**/*.{mp4,webm,MP4}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export type Media =
  | { kind: 'image'; file: string; image: ImageMetadata; caption?: string }
  | { kind: 'video'; file: string; src: string; caption?: string };

export type Kind = 'work' | 'experiments';

export interface Item {
  kind: Kind;
  slug: string;
  url: string;
  number: string;
  data: CollectionEntry<'work'>['data'];
  body: CollectionEntry<'work'>;
  cover?: Media;
  gallery: Media[];
}

function folderOf(filePath: string) {
  // "content/work/my-project/index.md" → "/content/work/my-project/"
  return '/' + filePath.replace(/\\/g, '/').replace(/index\.md$/, '');
}

function mediaIn(folder: string, captions: Record<string, string>): Media[] {
  const out: Media[] = [];
  for (const [path, image] of Object.entries(images)) {
    if (path.startsWith(folder) && !path.slice(folder.length).includes('/')) {
      const file = path.slice(folder.length);
      out.push({ kind: 'image', file, image, caption: captions[file] });
    }
  }
  for (const [path, src] of Object.entries(videos)) {
    if (path.startsWith(folder) && !path.slice(folder.length).includes('/')) {
      const file = path.slice(folder.length);
      out.push({ kind: 'video', file, src, caption: captions[file] });
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
}

export async function getItems(kind: Kind): Promise<Item[]> {
  const entries = (await getCollection(kind)).filter((e) => !e.data.draft);
  const items = entries.map((entry) => {
    const folder = folderOf(entry.filePath!);
    const slug = folder.split('/').filter(Boolean).pop()!.replace(/^\d+[-_]/, '');
    const all = mediaIn(folder, entry.data.captions);
    const coverName = entry.data.cover?.replace(/^\.\//, '');
    const cover =
      all.find((m) => m.file === coverName) ??
      all.find((m) => /^cover\./i.test(m.file)) ??
      all.find((m) => m.kind === 'image');
    // Images the write-up already places inline shouldn't repeat in the gallery.
    const body = entry.body ?? '';
    const gallery = all.filter((m) => m !== cover && !body.includes(m.file));
    return {
      kind,
      slug,
      url: `/${kind}/${slug}/`,
      number: '',
      data: entry.data,
      body: entry,
      cover,
      gallery,
    } as Item;
  });
  items.sort((a, b) => a.data.order - b.data.order || String(b.data.year).localeCompare(String(a.data.year)));
  items.forEach((it, i) => (it.number = String(i + 1).padStart(2, '0')));
  return items;
}

export async function getSite() {
  const [site] = await getCollection('site');
  return site;
}

// A project's background colour becomes the page's palette: white or black ink, whichever reads better (WCAG contrast).
export function themeVars(bg?: string | null): string | undefined {
  const m = bg?.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return undefined;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(m[1].slice(i, i + 2), 16) / 255));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // white whenever it passes AA (4.5:1), so mid-tone brand colours keep a light, airy ink
  const ink = 1.05 / (L + 0.05) >= 4.5 ? '#ffffff' : '#000000';
  const mix = (p: number) => `color-mix(in srgb, ${ink} ${p}%, #${m[1]})`;
  return [
    `--bg:#${m[1]}`, `--fg:${ink}`, `--muted:${mix(78)}`, `--faint:${mix(50)}`, `--line:${mix(22)}`,
    `--surface:${mix(10)}`, `--raised:${mix(14)}`, `--accent:${ink}`, `--hover:${ink}`, `--electric:${ink}`,
    `--accent-ink:#${m[1]}`, `--accent-glow:transparent`, `color-scheme:${ink === '#ffffff' ? 'dark' : 'light'}`,
  ].join(';');
}

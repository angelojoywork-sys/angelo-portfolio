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

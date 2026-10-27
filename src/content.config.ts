import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Everything you edit lives in /content at the root of the project.
// - content/site.md               → your name, hero sentences, links, about text
// - content/work/<project>/       → one folder per project (index.md + images/videos)
// - content/experiments/<exp>/    → one folder per experiment (same format)

const site = defineCollection({
  loader: glob({ pattern: 'site.md', base: './content' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string().optional(),
    timezone: z.string().default('Europe/Dublin'),
    available: z.string().optional(),
    email: z.string(),
    photo: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    disciplines: z.record(z.string()),
    intro: z.array(
      z.object({
        text: z.string(),
        highlight: z.union([z.string(), z.array(z.string())]).optional(),
        key: z.boolean().default(false),
      })
    ),
    spatialTitle: z.string(),
    clients: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
  }),
});

// Case-study cards: Product, Details, Problem / Solution / Result, Impact.
// Add a `study:` block to a project's index.md to show them; projects without one render as before.
const chapter = z.object({ subtitle: z.string(), body: z.string() });
const study = z.object({
  product: z.object({ name: z.string(), description: z.string() }),
  details: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  problem: chapter,
  solution: chapter,
  result: chapter,
  impact: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
});

const entry = z.object({
  title: z.string(),
  summary: z.string(),
  year: z.union([z.number(), z.string()]),
  client: z.string().nullish(),
  type: z.string().nullish(),
  role: z.string().nullish(),
  credits: z.string().nullish(),
  tools: z.array(z.string()).default([]),
  disciplines: z.array(z.string()).default([]),
  cover: z.string().nullish(),
  hideCover: z.boolean().default(false),
  gap: z.enum(['default', 'tight', 'none']).default('default'),
  captions: z.record(z.string()).default({}),
  link: z.object({ label: z.string(), url: z.string() }).nullish(),
  embed: z.union([z.string(), z.array(z.string())]).nullish(),
  note: z.string().nullish(),
  study: study.nullish(),
  // background colour for the case study page, e.g. "#008765"
  bg: z.string().nullish(),
  order: z.number().default(100),
  draft: z.boolean().default(false),
});

const work = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './content/work' }),
  schema: entry,
});

const experiments = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './content/experiments' }),
  schema: entry,
});

export const collections = { site, work, experiments };

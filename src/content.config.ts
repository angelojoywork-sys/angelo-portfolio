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
    timezone: z.string().default('Asia/Kolkata'),
    available: z.string().optional(),
    email: z.string(),
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
    notes: z
      .array(z.object({ on: z.string(), text: z.string() }))
      .default([]),
    clients: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
  }),
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
  captions: z.record(z.string()).default({}),
  link: z.object({ label: z.string(), url: z.string() }).nullish(),
  embed: z.string().nullish(),
  note: z.string().nullish(),
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

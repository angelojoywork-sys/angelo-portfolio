// Creates a new project or experiment folder with a ready-to-fill index.md.
// Usage:  npm run new            (asks a few questions)
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const lines = rl[Symbol.asyncIterator]();
async function ask(q, d = '') {
  process.stdout.write(d ? `${q} (${d}): ` : `${q}: `);
  const { value } = await lines.next();
  return (value ?? '').trim() || d;
}

const kindAns = (await ask('Is this a [w]ork project or an [e]xperiment?', 'w')).toLowerCase();
const kind = kindAns.startsWith('e') ? 'experiments' : 'work';
const title = await ask('Title');
if (!title) { console.log('A title is needed.'); process.exit(1); }
const summary = await ask('One-line summary (shown on the card)');
const year = await ask('Year', String(new Date().getFullYear()));
const type = await ask('Project type, e.g. Brand identity, UI, Motion');
const disciplines = await ask('Disciplines, comma separated (graphic, digital, motion, video, ai)', kind === 'experiments' ? 'ai' : 'graphic');
rl.close();

const base = path.join('content', kind);
const existing = fs.existsSync(base) ? fs.readdirSync(base).filter((f) => /^\d+/.test(f)) : [];
const next = String(existing.length + 1).padStart(2, '0');
const slug = title.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-');
const dir = path.join(base, `${next}-${slug}`);
fs.mkdirSync(dir, { recursive: true });

const q = (s) => (/[:#\[\]{}]/.test(s) ? JSON.stringify(s) : s);
fs.writeFileSync(
  path.join(dir, 'index.md'),
  `---
title: ${q(title)}
summary: ${q(summary || 'One line about the project.')}
year: ${year}
client:
type: ${q(type)}
role:
tools: []
disciplines: [${disciplines.split(',').map((s) => s.trim()).filter(Boolean).join(', ')}]
cover: cover.jpg
# note: A behind-the-scenes thought, shown in "Show the thinking" mode.
# embed: [https://vimeo.com/123456789]   # optional, extra videos shown above the gallery
# link: { label: "Visit the site", url: "https://..." }
order: ${Number(next) * 10}
draft: false
---

Write about the project here. Text, images and videos can be mixed in any order.

![Caption for the image](01.jpg)

More text goes here, between the images.

Paste a Vimeo or YouTube link on its own line to get a player (unlisted links work too):

https://vimeo.com/123456789

Any image not placed like this still appears after the story, in filename order.
`
);

console.log(`\nCreated ${dir}/index.md`);
console.log('Next: drop your images/videos into that folder (cover.jpg + 01.jpg, 02.jpg …), then edit index.md.');

# Portfolio

A fast, static portfolio site. Everything you'll ever edit lives in the **`content/`** folder:
plain text files and images, no code.

```
content/
├── site.md                  ← your name, hero sentences, links, about text
├── work/
│   ├── 01-northfield-coffee/
│   │   ├── index.md         ← title, year, client, description…
│   │   ├── cover.jpg        ← thumbnail on the home page
│   │   ├── 01.jpg           ← project images, shown in filename order
│   │   ├── 02.jpg
│   │   └── 03.mp4           ← videos work too (mp4 / webm)
│   └── 02-tidal-banking/
│       └── …
└── experiments/
    └── 01-synthetic-botanicals/
        └── … (same format as work)
```

The six projects and three experiments in there now are **samples with placeholder art**.
Delete their folders once you've added your own.

---

## Adding a project (about 5 minutes)

**Option A: the helper**

```bash
npm run new
```

It asks for a title, summary, year and so on, then creates the folder and `index.md` for you.
Drop your images into the folder it prints.

**Option B: by hand**

1. Duplicate any folder in `content/work/` and rename it, e.g. `07-my-new-project`.
   The number at the front just keeps your folders tidy. It isn't shown on the site.
2. Replace the images:
   - `cover.jpg` is the thumbnail (cropped to 4:3 on the home page)
   - `01.jpg`, `02.jpg`, `03.mp4`… show up on the project page in that order
3. Open `index.md` and edit the text at the top:

```yaml
---
title: Northfield Coffee
summary: Identity, packaging and signage for a neighbourhood roastery.   # one line, shown on the card
year: 2026
client: Northfield Coffee Co.
type: Brand identity
role: Lead designer
tools: [Illustrator, InDesign]
disciplines: [graphic]          # graphic | digital | motion | video | ai  (see site.md)
cover: cover.jpg
note: Started from the bean bag stencil.   # optional, appears in "Show the thinking" mode
embed: https://vimeo.com/123456789          # optional, YouTube or Vimeo, shown at the top
link: { label: "Visit the site", url: "https://example.com" }   # optional
captions:                                   # optional, per image
  01.jpg: Packaging range, 2026
order: 10                                   # lower numbers show first
draft: false                                # true = hidden from the site
---

The story of the project goes here. Plain paragraphs are fine.

## Headings work too

So do **bold**, *italics* and [links](https://example.com).
```

Leave any optional line blank or delete it and the site just skips it.

### Image tips
- Export JPGs at **2000–2400px wide**. The site makes smaller, faster versions automatically.
- Keep filenames simple: `cover.jpg`, `01.jpg`, `02.jpg`… (no spaces).
- GIFs work, but an MP4 of the same animation is ~10× smaller. Use MP4 for motion work.
- For long videos (reels, films), upload to Vimeo/YouTube and use `embed:` instead of an mp4 file.

---

## Editing the home page text (`content/site.md`)

Every sentence of the hero is its own line. `highlight:` says which discipline lights up when
someone hovers it:

```yaml
intro:
  - text: I'm Angelo, a digital & graphic designer.
    key: true                      # key = shown in full colour
  - text: I build brand identities, posters and printed matter,
    highlight: graphic             # hover → projects with "graphic" light up
  - text: and make things move through motion and video.
    highlight: [motion, video]
```

If a sentence highlights something that has no work projects (like `ai`), it automatically
becomes a link to the Experiments page.

The `notes:` list is what shows up as comment pins in **Show the thinking** mode (press `T`).

---

## See it on your computer

You need [Node.js](https://nodejs.org) (LTS version) installed once. Then, in this folder:

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321. The page updates as you save files.

---

## Putting it online

### Today, fastest (no accounts to connect)
1. `npm run build` creates a `dist/` folder.
2. Go to **https://app.netlify.com/drop** and drag the `dist` folder onto the page.
3. You get a live link in about 10 seconds. Sign up (free) to keep it and pick a name.

### For easy updates later (recommended)
1. Put this folder on GitHub (GitHub Desktop is the easiest way).
2. On **Netlify** or **Vercel**, choose "Import from GitHub" and pick the repository.
   It detects Astro automatically. Build command: `npm run build`, output folder: `dist`.
3. From then on, every time you add a project and push to GitHub, the site rebuilds itself.

### Custom domain
Buy one (Namecheap, Cloudflare, Google Domains…) and add it under *Domain settings* in Netlify/Vercel.
Then change `site:` in `astro.config.mjs` to your domain so share previews use the right URL.

---

## Other bits
- **Résumé link:** put your PDF at `public/resume.pdf`.
- **Footer clock:** set `timezone:` in `site.md`.
- **Colours & fonts:** `src/styles/global.css`, top of the file.
- Light/dark mode follows the visitor's system setting.

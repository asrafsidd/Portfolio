# Asraf Siddiquee - Portfolio

A modern, single-page portfolio website built with **plain HTML, CSS, and JavaScript** - no
frameworks, no build step, no dependencies. Designed to be deployed directly on **GitHub Pages**.

## Folder Structure

```
Portfolio_EMON_VAI/
├── index.html              # Main page (all sections)
├── css/
│   └── style.css           # Design tokens, layout, components, responsive rules
├── js/
│   └── main.js              # Theme toggle, nav, scroll-spy, tabs, form validation, etc.
├── assets/
│   ├── img/
│   │   └── favicon.svg      # Browser tab icon
│   ├── cv/
│   │   └── Siddiquee_Asraf_CV.pdf   # Downloadable resume
│   └── videos/
│       ├── sea-star/                # Sea Star-inspired robot demo/sim clips
│       └── soft-legged-robot/       # Soft, multi-legged robot demo clips
├── .nojekyll                # Prevents GitHub Pages from running Jekyll on the site
└── README.md
```

## Features

- Dark / light theme toggle (persisted in `localStorage`, respects OS preference on first visit)
- Sticky, blurred navigation bar with active-section scrollspy
- Animated hero section with gradient glow background
- Scroll-reveal animations and animated stat counters
- Tabbed experience section (Research / Teaching / Industry)
- Hero video mosaic and a dedicated Projects section with real robot demo footage
  (autoplaying muted preview tiles in the hero, hover-to-play clips in Projects)
- Expandable publications & presentations list
- "Write an Email" contact CTA (opens the visitor's email client via `mailto:` — no backend)
- Fully responsive: desktop, tablet, and mobile navigation
- Zero external JS dependencies - only Google Fonts is loaded from a CDN

## Running Locally

Because the site uses no build tools, you can simply open `index.html` in a browser, or serve it
with any static server, e.g.:

```bash
npx serve .
# or
python -m http.server 8080
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `username/username.github.io` for a user site,
   or any repo name for a project site).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Select the branch (usually `main`) and the root folder (`/`), then save.
5. Your site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

The included `.nojekyll` file ensures GitHub Pages serves the site as-is without running it
through Jekyll processing.

> **Note on video assets**: `assets/videos/` currently totals roughly 400 MB (individual clips
> up to ~67 MB, under GitHub's 100 MB per-file hard limit but well above its 50 MB soft warning).
> This will make the repository slow to clone and push. If that becomes a problem, compress the
> clips (e.g. `ffmpeg -i in.mp4 -vcodec libx264 -crf 28 -preset veryslow -an out.mp4`) or host
> them externally (e.g. Git LFS, a CDN, or YouTube embeds) and point the `<video src>` /
> `<source>` attributes at the new URLs.

## Customization

- **Colors / theme**: edit the CSS custom properties at the top of `css/style.css`
  (`:root` for dark theme, `[data-theme="light"]` for light theme).
- **Content**: all text lives directly in `index.html`, organized by section
  (`#home`, `#about`, `#education`, `#experience`, `#projects`, `#research`, `#skills`, `#awards`,
  `#contact`).
- **Resume**: replace `assets/cv/Siddiquee_Asraf_CV.pdf` with an updated file of the same name,
  or update the `href`/`download` link in `index.html`.
- **Videos**: drop new `.mp4` clips into `assets/videos/<project>/` and reference them from the
  hero showreel (`.showreel__tile`) or the Projects section (`.video-card`) in `index.html`.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repo is the source for `assets.wearequarry.com` (see [CNAME](CNAME)) — a GitHub Pages-hosted asset/CDN site for Quarry Architects, plus the small toolchains that produce some of those assets. There is no app server; the root is served as static files.

The repo contains four distinct, independent sub-projects. Each has its own toolchain — do not assume changes in one affect another.

## Sub-projects

### [email-signatures/](email-signatures/) — staff HTML email signature generator

Plain Node script (no deps). [generate.js](email-signatures/generate.js) reads [staff.csv](email-signatures/staff.csv) and [signature_template.html](email-signatures/signature_template.html), writes one `signature_<slug>.html` per row into [staff/](email-signatures/staff/). Image URLs in the template point at `assets.wearequarry.com` (i.e. this repo, deployed) — signatures do not embed images locally.

```bash
node email-signatures/generate.js   # regenerate all signatures from CSV
```

Per-client install instructions for end users live in [email-signatures/INSTALL.md](email-signatures/INSTALL.md).

### [animation/](animation/) — Puppeteer + ffmpeg renderer (legacy reveal pipeline)

Browser-based 9:16 brand reveal. [index.html](animation/index.html) + [timeline.js](animation/timeline.js) drive a deterministic frame timeline; [render.js](animation/render.js) drives Puppeteer at 1080×1920, screenshots every frame, and pipes them to `ffmpeg-static` for MP4 encode. [serve.js](animation/serve.js) is a tiny static server at `:8765` so fonts/CORS work in preview.

```bash
cd animation
npm run preview                     # http://localhost:8765
npm run render                      # default 30fps, CRF 20, 8s → quarry-9x16.mp4
npm run render:hq                   # CRF 18
node render.js --duration 10 --out custom.mp4 --keep-frames
```

### [quarry-reveal/](quarry-reveal/) — Remotion (React) reveal (current pipeline)

Same concept as `animation/` but rebuilt in [Remotion](https://www.remotion.dev/) with React 19. The composition is `QuarryReveal`. Iterations live in `src/v2/`, `src/v3/`, `src/v4/`, `src/v4l/` — keep older versions intact when adding a new one rather than mutating in place (the existing structure preserves history).

```bash
cd quarry-reveal
npm run dev                         # remotion studio (interactive)
npm run build                       # render to out/quarry-reveal.mp4
npm run build:hq                    # CRF 18, yuv420p
npm run lint                        # eslint src && tsc
```

Render config (image format, concurrency, overwrite) is in [remotion.config.ts](quarry-reveal/remotion.config.ts).

### [lytle-images/](lytle-images/) and [Brand/](Brand/) — static asset archives

`lytle-images/` is a mirrored archive of project imagery from a previous site, fetched by [lytle-images/download.sh](lytle-images/download.sh) (curl from a Webflow CDN). One folder per project. `Brand/` holds logo, fonts, colour references. Both are deployed as-is via GitHub Pages.

## Cross-cutting notes

- **Deploy is GitHub Pages**: pushing to the default branch publishes to `assets.wearequarry.com`. There is no build step at the repo root — `email-signatures/staff/*.html` and the `lytle-images/` / `Brand/` folders are served directly. Regenerate signatures and commit the output before pushing.
- **Image URLs are absolute**: signature templates and other published HTML reference `https://assets.wearequarry.com/...`. When adding new assets, place them at the path the consuming HTML expects, not just anywhere convenient.
- **No shared package.json at the root** — each sub-project's deps are local. Run `npm install` inside `animation/` or `quarry-reveal/` as needed.

# Biz Flow — website

Single-page website for **Biz Flow**, business development & marketing for educational institutes (Karachi, Pakistan).

Plain HTML, CSS and JavaScript — no build step, no dependencies. Pages use hash routes (`#/services`, `#/contact` …), so it runs on GitHub Pages as-is.

## Run locally

```bash
python -m http.server 5500
```

Then open <http://localhost:5500>.

## Edit content

All text, numbers, packages and contact details live in [`assets/js/data.js`](assets/js/data.js).

| What | Where |
| --- | --- |
| Content & contact details | `assets/js/data.js` |
| Page templates & routing | `assets/js/app.js` |
| Styles & brand colours | `assets/css/style.css` |
| Images & icons | `assets/img/` |
| App name, icons, shortcuts (PWA) | `site.webmanifest` |
| Offline cache (PWA) | `sw.js` |

## Installable app (PWA)

The site installs as an app on Android, Chrome and Edge (an **Install app** button appears in the header when the browser allows it) and on iPhone via **Share → Add to Home Screen**. Once opened, it works offline.

- Long-press the app icon for shortcuts: **Request a quote**, **Services**, **Packages**, **About**.
- **When you change any file, bump `VERSION` in `sw.js`** (e.g. `v1` → `v2`). Pages, scripts and styles are fetched network-first, but images are served from the cache, so a new image only reaches returning visitors after a version bump.
- If you add a file the site needs offline, add it to `APP_SHELL` in `sw.js`.

## Pages

- `#/` — Home
- `#/services` — the four divisions
- `#/services/cost-controls`, `#/services/marketing`, `#/services/it-support`, `#/services/events`
- `#/packages` — Starter, Growth, Enterprise + comparison
- `#/about` — who we are, mission, values
- `#/contact` — enquiry form (opens email or WhatsApp with the message pre-filled; nothing is stored)

## Deploy to GitHub Pages

1. Push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. The site will be live at `https://techpeer-pk.github.io/bizflow/`.

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

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
| Firebase keys (not in git) | `assets/js/firebase-config.js` — copy from `firebase-config.example.js` |
| Saving enquiries | `assets/js/firebase.js` |
| Who can write enquiries | `firestore.rules` |
| Admin page (enquiries) | `admino/index.html`, `assets/js/admin.js` |
| Admin profile (change password) | `admino/profile/index.html`, `assets/js/profile.js` |
| Admin styles | `assets/css/admin.css` |

## Installable app (PWA)

The site installs as an app on Android, Chrome and Edge, and on iPhone via **Share → Add to Home Screen**. Once opened, it works offline.

- **Install pop-up:** on the visitor's first tap, an `alert()` appears and then the browser's install pop-up opens (at most once a week). Browsers block the install pop-up on page load — it must follow a tap. On iPhone, which has no install pop-up, the `alert()` shows the Share → Add to Home Screen steps after the page loads.

- Long-press the app icon for shortcuts: **Request a quote**, **Services**, **Packages**, **About**.
- **When you change any file, bump `VERSION` in `sw.js`** (e.g. `v1` → `v2`). Pages, scripts and styles are fetched network-first, but images are served from the cache, so a new image only reaches returning visitors after a version bump.
- If you add a file the site needs offline, add it to `APP_SHELL` in `sw.js`.

## Pages

- `#/` — Home
- `#/services` — the four divisions
- `#/services/cost-controls`, `#/services/marketing`, `#/services/it-support`, `#/services/events`
- `#/packages` — Starter, Growth, Enterprise + comparison
- `#/about` — who we are, mission, values
- `#/contact` — enquiry form, saved to Firestore. Name, institute and email are required. The phone number is optional and must be a Pakistani mobile (+92 3XX XXXXXXX). The form and `firestore.rules` run the same checks. The "Send via WhatsApp" button is commented out in `assets/js/app.js`.

## Deploy to GitHub Pages

1. Push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. The site will be live at `https://techpeer-pk.github.io/bizflow/`.

## Keys and secrets (keep them out of git)

- The Firebase keys are in `assets/js/firebase-config.js`. This file is in `.gitignore`, so it's never committed. After a fresh clone, copy `assets/js/firebase-config.example.js` to `firebase-config.js` and fill in the values.
- `.gitignore` also covers `.env` files, private keys (`*.pem`, `*.key` …), service-account and credentials JSON, and logs.
- `.githooks/pre-commit` blocks any commit that contains an API key, private key or token, or one of those files. Turn it on once per clone:

  ```bash
  git config core.hooksPath .githooks
  ```

- Firebase web keys still reach every visitor's browser, because the site needs them to run. What protects the data is `firestore.rules`. For extra safety, restrict the API key to the site's domains in Google Cloud console → **APIs & Services → Credentials**.

## Deploy to Firebase Hosting

Project: `bizflow-pk` (set in `.firebaserc`). Hosting config is in `firebase.json`.

```bash
firebase login        # with a Google account that is a member of bizflow-pk
firebase deploy --only hosting,firestore:rules
```

The site will be live at `https://bizflow-pk.web.app/`. Bump `VERSION` in `sw.js` before each deploy, as above.

## Contact form enquiries (Firestore)

Each enquiry is saved to the `enquiries` collection in Firestore. To read them, open the Firebase console → **Firestore Database → Data → enquiries**.

The rules in `firestore.rules` let the public website add an enquiry and nothing else. Only admins can read enquiries, change their status or delete them. If you add a field to the form, add it to `enquiry` in `assets/js/app.js` and to `isEnquiry()` in `firestore.rules`, then deploy both.

## Admin page (`/admino`)

Admins sign in at `/admino` with Email/Password. Enquiries are shown in a table (Name, Email, Phone) that you can search, sort and page through. **View** opens a dialog with every detail, where you can set the status (New, Contacted or Closed) or delete the enquiry.

To add an admin:

1. Firebase console → **Authentication → Users → Add user**. Enter their email and a password.
2. Copy the new user's **User UID**.
3. **Firestore Database → Data → Start collection** (or open it) `admins` → **Document ID** = that UID → add any field, for example `email` → **Save**.

Admins can change their own password at `/admino/profile/` (the **Profile** tab). They confirm their current password first.

Forgot a password? Use **Forgot password?** on the sign-in page. Firebase emails a reset link from `noreply@bizflow-pk.firebaseapp.com`, so ask them to check their spam folder. You can change the email's wording in Firebase console → **Authentication → Templates**.

To remove an admin, delete their document from `admins`. Anyone who signs in without an `admins` document sees "No admin access", along with their UID.

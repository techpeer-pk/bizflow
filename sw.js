/*
 * Biz Flow service worker — makes the site installable and usable offline.
 * Bump VERSION whenever you change or add files, so visitors get a fresh cache.
 */
const VERSION = "v1";
const CACHE = `bizflow-${VERSION}`;
const FONT_CACHE = "bizflow-fonts";

// The app shell: everything needed to render every page offline.
const APP_SHELL = [
  "./",
  "index.html",
  "site.webmanifest",
  "assets/css/style.css",
  "assets/js/data.js",
  "assets/js/app.js",
  "assets/img/mark.png",
  "assets/img/team.jpg",
  "assets/img/favicon.png",
  "assets/img/icon-192.png",
  "assets/img/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("bizflow-") && k !== CACHE && k !== FONT_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: serve from cache, refresh in the background.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Pages: network first so updates show straight away; offline falls back to the cached app.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) put(CACHE, "index.html", res.clone());
          return res;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // Code, styles and the manifest change between releases: network first.
  if (/\.(?:js|css|webmanifest)$/.test(url.pathname)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Images and other static files rarely change: cache first.
  event.respondWith(cacheFirst(req));
});

function put(cacheName, key, res) {
  return caches.open(cacheName).then((cache) => cache.put(key, res));
}

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res.ok) put(CACHE, req, res.clone());
      return res;
    })
    .catch(() => caches.match(req, { ignoreSearch: true }));
}

function cacheFirst(req) {
  return caches.match(req).then(
    (hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok) put(CACHE, req, res.clone());
        return res;
      })
  );
}

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok || res.type === "opaque") cache.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
}

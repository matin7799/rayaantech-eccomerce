// Minimal service worker: exists only to satisfy PWA installability criteria
// (a controlling service worker with a fetch handler triggers `beforeinstallprompt`).
// Deliberately does NO caching — build assets are content-hashed per deploy, and a
// caching SW would risk serving stale JS/CSS after a redeploy (the "MIME type text/html"
// error you get when the browser holds an old page that points at asset hashes that no
// longer exist on the server).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Purge every CacheStorage bucket. This neutralises any *previous* service-worker
      // version that may have pre-cached HTML/CSS/JS and would otherwise keep serving a
      // stale index document that references a deleted asset hash.
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

// Network-only pass-through. Never read from cache, so a redeploy is picked up instantly.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

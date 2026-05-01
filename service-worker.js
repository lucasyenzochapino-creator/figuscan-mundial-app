const CACHE = 'figuscan-v11-cache';
const ASSETS = ['/', '/index.html', '/styles.css?v=11', '/app.js?v=11', '/config.js?v=11', '/manifest.webmanifest'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => undefined)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(resp => {
    const clone = resp.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, clone)).catch(() => undefined);
    return resp;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html'))));
});

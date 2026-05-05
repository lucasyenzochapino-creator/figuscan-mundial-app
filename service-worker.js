const CACHE_NAME = 'figuscan-v56-icono-figurita-pwa';
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css?v=55',
  '/app.js?v=55',
  '/manifest.webmanifest',
  '/assets/icon-192.png?v=55',
  '/assets/icon-512.png?v=55',
  '/assets/icon-512-maskable.png?v=55',
  '/assets/apple-touch-icon.png?v=55',
  '/assets/favicon-32.png?v=55'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        PRECACHE.map(url => cache.add(url).catch(() => null))
      )
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

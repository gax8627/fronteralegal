const CACHE_NAME = 'nexborder-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/config.js',
  '/translations.js',
  '/manifest.json',
  '/fsa-guide.html',
  '/rdap-guide.html',
  '/facilities.html',
  '/facilities/ca/victorville-usp.html',
  '/facilities/ca/terminal-island-fci.html',
  '/facilities/tx/seagoville-fci.html',
  '/facilities/fl/coleman-usp.html',
  '/facilities/nj/fort-dix-fci.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

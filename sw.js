const CACHE_NAME = 'guia-federal-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/config.js',
  '/manifest.json',
  '/arrestado-federal.html',
  '/audiencia-detencion.html',
  '/encuentra-familiar.html',
  '/segunda-opinion.html',
  '/fsa-guide.html',
  '/rdap-guide.html',
  '/facilities.html',
  '/kit-supervivencia.html',
  '/blog/index.html',
  '/blog/entrevista-pso.html',
  '/blog/rdap-explicado.html',
  '/assets/hero-home.png',
  '/assets/hero-arrestado.png',
  '/assets/hero-audiencia.png',
  '/assets/hero-facilities.png',
  '/assets/hero-blog.png',
  '/assets/bg-scales.png',
  '/assets/bg-books.png',
  '/assets/bg-court.png',
  '/assets/brand-og.png'
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

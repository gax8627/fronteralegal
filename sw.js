const CACHE_NAME = 'guia-federal-v1';
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
  '/facilities/ny/mdc-brooklyn.html',
  '/facilities/ca/mdc-los-angeles.html',
  '/facilities/fl/fdc-miami.html',
  '/facilities/tx/fdc-houston.html',
  '/facilities/pa/fdc-philadelphia.html',
  '/facilities/ca/lompoc-fci.html',
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

const CACHE_NAME = 'guia-federal-v5';
const ASSETS = [
  '/',
  '/index.css',
  '/config.js',
  '/manifest.json',
  '/arrestado-federal',
  '/audiencia-detencion',
  '/encuentra-familiar',
  '/segunda-opinion',
  '/facilities',
  '/facilities/ca/mcc-san-diego',
  '/kit-supervivencia',
  '/blog/',
  '/blog/plea-bargaining-federal',
  '/blog/entrevista-pso',
  '/blog/estrategia-extradicion-san-diego-2026',
  '/blog/auditoria-pattern-bop-2026',
  '/blog/arresto-federal-san-diego-72-horas',
  '/blog/first-step-act-creditos-etc',
  '/blog/investigacion-federal-que-hacer',
  '/blog/derecho-a-guardar-silencio',
  '/blog/vencer-al-fiscal-federal',
  '/blog/informantes-y-brady-evidencia',
  '/blog/camino-al-juicio-federal',
  '/blog/presuncion-de-inocencia-explicada',
  '/blog/reducir-sentencia-federal-2026',
  '/blog/abogado-no-responde-federal',
  '/blog/saltar-halfway-house-2026',
  '/blog/mula-ciega-federal',
  '/blog/extradicion-narcopolitica-2026',
  '/blog/rdap-explicado',
  '/blog/ser-jefe-de-tu-libertad',
  '/fsa-guide',
  '/rdap-guide',
  '/reporte-keywords-pdf',
  '/assets/hero-home.png',
  '/assets/hero-arrestado.png',
  '/assets/hero-audiencia.png',
  '/assets/hero-facilities.png',
  '/assets/hero-blog.png',
  '/assets/hero-fsa.png',
  '/assets/hero-rdap.png',
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

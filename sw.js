const CACHE_NAME = 'guia-federal-v9';
const ASSETS = [
  '/',
  '/index.css',
  '/config.js',
  '/manifest.json',
  '/arrestado-federal',
  '/audiencia-detencion',
  '/encuentra-familiar',
  '/segunda-opinion',
  '/servicio-integral',
  '/federal-pretrial-guide',
  '/abogados-defensores',
  '/facilities',
  '/facilities/ca/lompoc-fci',
  '/facilities/ca/mcc-san-diego',
  '/facilities/ca/mdc-los-angeles',
  '/facilities/ca/terminal-island-fci',
  '/facilities/ca/victorville-usp',
  '/facilities/fl/coleman-usp',
  '/facilities/fl/fdc-miami',
  '/facilities/tx/fdc-houston',
  '/facilities/tx/seagoville-fci',
  '/facilities/pa/fdc-philadelphia',
  '/facilities/nj/fort-dix-fci',
  '/facilities/ny/mdc-brooklyn',
  '/kit-supervivencia',
  '/guia-72-horas-pdf',
  '/reporte-keywords-pdf',
  '/casos-mula-ciega-ejemplos-pdf',
  '/disclaimer',
  '/blog/',
  '/blog/abogado-no-responde-federal',
  '/blog/arrestado-garita-otay-san-ysidro',
  '/blog/arresto-federal-san-diego-72-horas',
  '/blog/auditoria-pattern-bop-2026',
  '/blog/camino-al-juicio-federal',
  '/blog/casos-mula-ciega-ejemplos',
  '/blog/coordinar-defensor-publico-federal-san-diego',
  '/blog/defensa-mula-ciega-corte-federal',
  '/blog/derecho-a-guardar-silencio',
  '/blog/entrevista-pso',
  '/blog/estrategia-extradicion-san-diego-2026',
  '/blog/extradicion-narcopolitica-2026',
  '/blog/fianza-corte-federal-san-diego',
  '/blog/first-step-act-creditos-etc',
  '/blog/informantes-y-brady-evidencia',
  '/blog/investigacion-federal-que-hacer',
  '/blog/localizar-detenido-frontera-cbp',
  '/blog/mcc-san-diego-visitas-fondos',
  '/blog/mula-ciega-federal',
  '/blog/plea-bargaining-federal',
  '/blog/presuncion-de-inocencia-explicada',
  '/blog/prevencion-mula-ciega-tijuana',
  '/blog/programa-deteccion-mula-ciega-tijuana',
  '/blog/rdap-explicado',
  '/blog/reducir-sentencia-federal-2026',
  '/blog/saltar-halfway-house-2026',
  '/blog/ser-jefe-de-tu-libertad',
  '/blog/vencer-al-fiscal-federal',
  '/blog/visitas-otay-mesa-detention-center',
  '/fsa-guide',
  '/rdap-guide',
  '/assets/bg-books.png',
  '/assets/bg-court.png',
  '/assets/bg-scales.png',
  '/assets/brand-og.png',
  '/assets/hero-arrest.png',
  '/assets/hero-arrestado.png',
  '/assets/hero-audiencia.png',
  '/assets/hero-blind-mule.png',
  '/assets/hero-blog.png',
  '/assets/hero-border.png',
  '/assets/hero-clock.png',
  '/assets/hero-community.png',
  '/assets/hero-court.png',
  '/assets/hero-defensor-publico.png',
  '/assets/hero-extradition.png',
  '/assets/hero-facilities.png',
  '/assets/hero-fianza-corte.png',
  '/assets/hero-freedom.png',
  '/assets/hero-fsa.png',
  '/assets/hero-garita-otay.png',
  '/assets/hero-home.png',
  '/assets/hero-informant.png',
  '/assets/hero-interview.png',
  '/assets/hero-lawyer.png',
  '/assets/hero-leadership.png',
  '/assets/hero-localizar-detenido.png',
  '/assets/hero-mcc-san-diego.png',
  '/assets/hero-mula-ciega-defensa.png',
  '/assets/hero-mula-ciega-ejemplos.png',
  '/assets/hero-mula-ciega-ejemplos.mp4',
  '/assets/hero-prevencion-mula.png',
  '/assets/hero-prosecutor.png',
  '/assets/hero-rdap.png',
  '/assets/hero-scales.png',
  '/assets/hero-silence.png',
  '/assets/hero-target-letter.png',
  '/assets/hero-visitas-otay.png',
  '/assets/master-hero.png',
  '/assets/pdf-cover.png'
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

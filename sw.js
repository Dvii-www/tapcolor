// ✏️ EDITABLE: cambia este número cada vez que subas una actualización
// Esto fuerza a que todos los usuarios reciban la versión nueva
const VERSION = 'tapcolor-v5';

const ASSETS = [
  './',
  './index.html',
];

// Instalar: cachear el juego
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ASSETS))
  );
});

// Activar: eliminar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
});

// Fetch: servir desde caché, con fallback a red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

// Recibir señal para activarse inmediatamente (para el banner de actualización)
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

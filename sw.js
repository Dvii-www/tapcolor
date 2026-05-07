// ✏️ EDITABLE: cambia este número cada vez que subas una actualización
// Esto le avisa a todos los usuarios que hay versión nueva
const VERSION = 'tapcolor-v7';

const ASSETS = ['./', './index.html'];

// Instalar: cachea la nueva versión pero NO toma control todavía
// Espera a que el usuario toque "Actualizar" en el banner
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ASSETS))
    // ⚠️ NO llamamos self.skipWaiting() aquí — eso causaba la actualización automática
  );
});

// Activar: elimina cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
});

// Fetch: sirve desde caché, con fallback a red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request)
        .catch(() => caches.match('./index.html'))
      )
  );
});

// El index.html llama postMessage({type:'SKIP_WAITING'}) cuando el usuario toca "Actualizar"
// Solo entonces el nuevo SW toma control y el index.html recarga
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

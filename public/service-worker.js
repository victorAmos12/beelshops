const CACHE_NAME = 'beel-shops-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo_beel.jpg',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Ouverture du cache');
      return cache.addAll(urlsToCache).catch((error) => {
        console.warn('Erreur lors du cachage des fichiers:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first pour l'API, Cache-first pour les autres
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Network-first pour l'API
    event.respondWith(
      fetch(event.request.clone())
        .then((response) => {
          if (!response || !response.ok) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || new Response('Service offline'));
        })
    );
  } else {
    // Cache-first pour les ressources statiques
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request.clone()).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(() => {
          return new Response('Service offline');
        });
      })
    );
  }
});

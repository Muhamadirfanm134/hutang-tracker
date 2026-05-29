const CACHE_NAME = 'hutang-tracker-v2';

self.addEventListener('install', (event) => {
  // Don't precache '/' because it server-redirects to '/home'. Caching a
  // redirected response and replaying it for a navigation request is rejected
  // by the browser ("redirected response not allowed for navigation").
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/icon.png',
        '/icon-512x512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-first for navigation requests so server redirects (e.g. / -> /home)
  // always work. Fall back to cache only when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/home'))
      )
    );
    return;
  }

  // Stale-while-revalidate strategy for other assets/requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Only cache valid, non-redirected GET requests to the origin
        if (
          request.method === 'GET' &&
          request.url.startsWith(self.location.origin) &&
          networkResponse.status === 200 &&
          !networkResponse.redirected
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });

      // Return cached response immediately if available, while fetching in background
      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

const CACHE_NAME = 'geek-portal-v2.6.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/airdrop.html',
  '/webhook.html',
  '/toolbox.html',
  '/clipboard.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/contact.html',
  '/style.css?v=2.6.2',
  '/js/storage.js?v=2.6.2',
  '/js/i18n.js?v=2.6.2',
  '/js/toolbox.js?v=2.6.2',
  '/js/clipboard.js?v=2.6.2',
  '/js/ai-chat.js?v=2.6.2',
  '/js/airdrop.js?v=2.6.2',
  '/js/webhook.js?v=2.6.2',
  '/js/main.js?v=2.6.2',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW: pre-caching partial failure', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip Google Analytics, AdSense and PeerJS signal requests from service worker cache
  if (
    url.hostname.includes('google') ||
    url.hostname.includes('googlesyndication') ||
    url.hostname.includes('peerjs') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/');
        }
      });
    })
  );
});

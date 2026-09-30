const CACHE_NAME = 'geek-portal-v2.8.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/sitemap.html',
  '/airdrop.html',
  '/webhook.html',
  '/toolbox.html',
  '/clipboard.html',
  '/tools/screen-test.html',
  '/tools/mouse-test.html',
  '/tools/password-generator.html',
  '/tools/json-formatter.html',
  '/tools/jwt-debugger.html',
  '/tools/hash-calculator.html',
  '/tools/timestamp-converter.html',
  '/tools/text-tools.html',
  '/tools/media-compress.html',
  '/tools/wifi-qr.html',
  '/articles/webrtc-p2p-architecture-guide.html',
  '/articles/webhook-security-and-idempotency.html',
  '/articles/modern-password-entropy-and-nist-standard.html',
  '/articles/why-you-should-stop-storing-jwt-in-localstorage.html',
  '/articles/cryptographic-hash-functions-and-slow-hashing.html',
  '/articles/pure-frontend-image-processing-and-exif-privacy.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/contact.html',
  '/style.css?v=2.8.0',
  '/js/storage.js?v=2.7.0',
  '/js/i18n.js?v=2.7.0',
  '/js/toolbox.js?v=2.7.0',
  '/js/clipboard.js?v=2.7.0',
  '/js/ai-chat.js?v=2.7.0',
  '/js/airdrop.js?v=2.7.0',
  '/js/webhook.js?v=2.7.0',
  '/js/main.js?v=2.7.0',
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

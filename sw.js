const CACHE_NAME = 'geek-portal-v2.9.0';
const CORE_SHELL = [
  '/',
  '/style.css?v=2.8.0',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_SHELL).catch((err) => {
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

  // 1. 跳过外部统计、广告、WebRTC信令、Cloudflare指标与动态API请求
  if (
    url.hostname.includes('google') ||
    url.hostname.includes('googlesyndication') ||
    url.hostname.includes('doubleclick') ||
    url.hostname.includes('peerjs') ||
    url.hostname.includes('cloudflareinsights') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/cdn-cgi/')
  ) {
    return;
  }

  // 2. 静态资源与页面采用 Stale-While-Revalidate（缓存优先秒开 + 后台异步刷新缓存）
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/');
        }
      });

      // 如果本地缓存命中，瞬间返回（0ms秒开），同时后台异步更新
      // 如果未命中，等待网络请求并自动写入缓存供下次秒开
      return cachedResponse || fetchPromise;
    })
  );
});

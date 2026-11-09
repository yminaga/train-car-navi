const CACHE_NAME = 'smooth-navi-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://unpkg.com/lucide@latest'
];

// インストール時に主要アセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning (some CDN assets might be opaque):', err);
      });
    })
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを整理
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ処理（Stale-While-Revalidate または キャッシュファースト）
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // PNGアイコンへのリクエストでキャッシュにない場合は icon.svg をフォールバック返却
  if (url.pathname.endsWith('icon-192.png') || url.pathname.endsWith('icon-512.png')) {
    event.respondWith(
      caches.match(event.request).then((res) => {
        return res || fetch('./icon.svg');
      })
    );
    return;
  }

  // 通常の静的リソースフェッチ
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // バックグラウンドで更新を取得（Stale-While-Revalidate）
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* オフライン時は無視 */});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // オフライン時のフォールバック
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

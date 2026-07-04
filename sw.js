const CACHE_NAME = 'akm-v9-20260704-font-gpu-timing';
const ASSETS = [
  './',
  'home.html',
  'aikickmaster.html',
  'admin.html',
  'index.html',
  'logo.svg',
  'logo-icon.svg',
  'logo-white.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isPageOrCoreAsset =
    request.mode === 'navigate' ||
    /\.(html|js|css|svg|json)$/i.test(url.pathname) ||
    url.pathname.endsWith('/');

  if (isPageOrCoreAsset) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});

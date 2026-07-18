const AKM_CACHE = 'akm-shell-v1';
const AKM_SHELL = ['./', './aikickmaster.html', './manifest.json', './kick1.svg'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(AKM_CACHE).then(cache => cache.addAll(AKM_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== AKM_CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  if(event.request.mode === 'navigate'){
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(AKM_CACHE).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./aikickmaster.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(AKM_CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});

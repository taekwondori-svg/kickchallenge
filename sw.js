const CACHE_NAME = 'akm-v2';
const ASSETS = [
  './',
  'home.html',
  'aikickmaster.html',
  'records.html',
  'admin.html',
  'index.html',
  'manifest.json',
  'logo.svg',
  'logo-icon.svg',
  'logo-white.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});

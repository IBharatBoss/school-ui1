const CACHE_NAME = 'school-ai-v3'; // Version updated
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.js',
  './core.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force update new service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
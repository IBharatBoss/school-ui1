// sw.js - Basic Service Worker for PWA
const CACHE_NAME = 'school-ai-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.js',
  '/core.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
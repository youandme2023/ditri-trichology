const CACHE_NAME = 'ditri-tricho-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-1024.png',
  './icons/apple-touch-icon.png',
  './icons/ditri-trichology-logo.png'
,
  './splash/splash-1170x2532.png'
,
  './splash/splash-1284x2778.png'
,
  './splash/splash-1125x2436.png'
,
  './splash/splash-750x1334.png'
,
  './splash/splash-640x1136.png'
,
  './splash/splash-2048x2732.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      const net = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, net.clone());
      return net;
    } catch (e) {
      const cached = await caches.match(event.request);
      return cached || caches.match('./index.html');
    }
  })());
});

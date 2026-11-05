const CACHE_NAME = 'synapz-hockey-v9.8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/synapz-logo.png',
  './assets/synapz-splash-bg.png',
  './assets/tactix-logo.png',
  './assets/coach-bob.png',
  './assets/rooms/room-rink-lobby.png',
  './assets/rooms/room-locker-room.png',
  './assets/rooms/room-coaches-office.png',
  './assets/rooms/room-pro-shop.png',
  './assets/rooms/room-clubhouse.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

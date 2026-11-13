const CACHE_NAME = 'synapz-hockey-v13.0-global-foundation';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/synapz-logo.png',
  './assets/synapz-logo.webp',
  './assets/synapz-splash-bg.png',
  './assets/tactix-logo.png',
  './assets/coach-bob.png',
  './assets/cutouts/agent-leo.png',
  './assets/cutouts/agent-maya.png',
  './assets/cutouts/agent-jalen.png',
  './assets/cutouts/agent-chloe.png',
  './assets/cutouts/agent-sofia.png',
  './assets/cutouts/agent-marcus.png',
  './assets/cutouts/agent-priya.png',
  './assets/cutouts/agent-ryan.png',
  './assets/cutouts/agent-claire.png',
  './assets/cutouts/coach-bob.png',
  './assets/cutouts/coach-al.png',
  './assets/avatars/avatar-male-1.png',
  './assets/avatars/avatar-male-2.png',
  './assets/avatars/avatar-male-3.png',
  './assets/avatars/avatar-male-4.png',
  './assets/avatars/avatar-female-1.png',
  './assets/avatars/avatar-female-2.png',
  './assets/avatars/avatar-female-3.png',
  './assets/avatars/avatar-female-4.png',
  './assets/rooms/room-rink-lobby.jpg',
  './assets/rooms/room-locker-room.jpg',
  './assets/rooms/room-coaches-office.jpg',
  './assets/rooms/room-pro-shop.jpg',
  './assets/rooms/room-clubhouse.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
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
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then((res) => {
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

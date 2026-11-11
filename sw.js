const CACHE_NAME = 'synapz-hockey-v11.2-173-verified-6pos-pilot';
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

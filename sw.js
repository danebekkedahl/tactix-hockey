const CACHE_NAME = 'synapz-hockey-v15.1-pass2-visual-overhaul';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './engine/rink_1000x500.js',
  './engine/validate_drills.js',
  './engine/chalk_reel.js',
  './engine/modes_9pack.js',
  './engine/blooket_payoff.js',
  './engine/team_showdown.js',
  './engine/skater_renderer_360.js',
  './engine/gear_art_75_25.js',
  './engine/nhl_atlas_map.js',
  './engine/trophy_case_3shelf.js',
  './engine/v14_bootstrap.js',
  './drills/catalog_45.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './synapz-logo.webp',
  './assets/synapz-logo.png',
  './assets/synapz-logo.webp',
  './assets/synapz-splash-bg.png',
  './assets/tactix-logo.png',
  './assets/coach-bob.png',
  './assets/agents/agent-leo.png',
  './assets/agents/agent-maya.png',
  './assets/agents/agent-jalen.png',
  './assets/agents/agent-chloe.png',
  './assets/agents/agent-sofia.png',
  './assets/agents/agent-marcus.png',
  './assets/agents/agent-priya.png',
  './assets/agents/agent-ryan.png',
  './assets/agents/agent-claire.png',
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map((assetUrl) =>
          fetch(assetUrl, { cache: 'reload' })
            .then((res) => (res && res.ok ? cache.put(assetUrl, res) : null))
            .catch(() => cache.add(assetUrl).catch(() => null))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!req || req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never intercept cross-origin API calls (Supabase / Stripe / Google Apps Script) — let app handle offline queueing cleanly
  if (url.origin !== self.location.origin) return;

  const isNavigation = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const direct = await caches.match(req, { ignoreSearch: true });
        if (direct) return direct;
        if (isNavigation) {
          const shell = (await caches.match('./index.html', { ignoreSearch: true })) || (await caches.match('./', { ignoreSearch: true }));
          if (shell) return shell;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline Steel-Roof Arena Fallback' });
      })
  );
});

// Kill switch for the service worker registered by the old Create React App build.
// Browsers that still have it installed fetch this file on their next visit, which
// replaces the old worker, clears its caches, unregisters it and reloads open tabs
// so they get the new server-rendered site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});

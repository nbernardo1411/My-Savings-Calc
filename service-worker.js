const CACHE_NAME = "savings-app-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn-icons-png.flaticon.com/512/2822/2822684.png"
];

// Install service worker
self.addEventListener("install", event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener("activate", event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch from cache if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request).catch(() => {
        // Return offline page or default response if both cache and network fail
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Handle background sync for saving data when back online
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(syncSavingsData());
  }
});

async function syncSavingsData() {
  // This would sync any pending savings data when back online
  console.log('Syncing savings data...');
}

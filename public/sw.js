const CACHE_NAME = "quittracker-v1.0.1"
const STATIC_CACHE = "quittracker-static-v1.0.1"
const DYNAMIC_CACHE = "quittracker-dynamic-v1.0.1"

// Files to cache immediately
const STATIC_FILES = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"]

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files")
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log("Service Worker: Skip waiting")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Install failed", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Claiming clients")
        return self.clients.claim()
      })
      .catch((error) => {
        console.error("Service Worker: Activate failed", error)
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle same-origin requests
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("Service Worker: Serving from cache:", request.url)
          return cachedResponse
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
              return networkResponse
            }

            // Clone the response
            const responseToCache = networkResponse.clone()

            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE).then((cache) => {
              console.log("Service Worker: Caching new resource:", request.url)
              cache.put(request, responseToCache)
            })

            return networkResponse
          })
          .catch((error) => {
            console.error("Service Worker: Fetch failed", error)
            // Network failed, try to serve from cache
            return caches.match("/")
          })
      }),
    )
  }
})

// Handle background sync (optional)
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered")
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve(),
    )
  }
})

// Handle push notifications (optional)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received")
  const options = {
    body: event.data ? event.data.text() : "New notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }

  event.waitUntil(self.registration.showNotification("QuitTracker", options))
})

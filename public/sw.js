const CACHE_NAME = "quittracker-v1.0.2"
const STATIC_CACHE = "quittracker-static-v1.0.2"
const DYNAMIC_CACHE = "quittracker-dynamic-v1.0.2"

// Files to cache immediately - pastikan semua file penting ada
const STATIC_FILES = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/favicon.ico",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main-app.js",
  "/_next/static/chunks/app/layout.js",
  "/_next/static/chunks/app/page.js",
]

// Offline fallback HTML
const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuitTracker - Offline</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            text-align: center; 
            max-width: 400px;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #111827; 
            margin-bottom: 16px; 
        }
        .message { 
            color: #6b7280; 
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .button {
            background: #16a34a;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background: #15803d;
        }
        .offline-indicator {
            background: #fbbf24;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="offline-indicator">📱 Offline Mode</div>
        <div class="title">QuitTracker</div>
        <div class="message">
            You're currently offline, but your data is safely stored locally. 
            The app will work normally once you're back online.
        </div>
        <button class="button" onclick="window.location.reload()">
            Try Again
        </button>
    </div>
    <script>
        // Check if online and reload
        window.addEventListener('online', () => {
            window.location.reload();
        });
        
        // Load cached data if available
        if (localStorage.getItem('quitTrackerItems')) {
            document.querySelector('.message').innerHTML = 
                'Your quit tracking data is available offline. The app will sync when you reconnect.';
        }
    </script>
</body>
</html>
`

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing v1.0.2...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files")
        // Cache offline fallback first
        cache.put(
          "/offline.html",
          new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html" },
          }),
        )

        // Try to cache static files, but don't fail if some are missing
        return Promise.allSettled(
          STATIC_FILES.map((url) =>
            fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response)
                }
                console.warn(`Failed to cache: ${url}`)
              })
              .catch((err) => {
                console.warn(`Failed to fetch for cache: ${url}`, err)
              }),
          ),
        )
      })
      .then(() => {
        console.log("Service Worker: Installation complete, skipping waiting")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Install failed", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating v1.0.2...")
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

// Fetch event - improved offline handling
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle same-origin requests
  if (url.origin === location.origin) {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log("Service Worker: Serving from cache:", request.url)
            return cachedResponse
          }

          // Not in cache, try to fetch from network
          return fetch(request)
            .then((networkResponse) => {
              // Check if response is valid
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
                // If it's the main page and network failed, serve offline page
                if (url.pathname === "/" || url.pathname === "/index.html") {
                  return caches.match("/offline.html")
                }
                return networkResponse
              }

              // Clone the response for caching
              const responseToCache = networkResponse.clone()

              // Add to dynamic cache
              caches
                .open(DYNAMIC_CACHE)
                .then((cache) => {
                  console.log("Service Worker: Caching new resource:", request.url)
                  cache.put(request, responseToCache)
                })
                .catch((err) => console.warn("Failed to cache:", err))

              return networkResponse
            })
            .catch((error) => {
              console.error("Service Worker: Fetch failed for", request.url, error)

              // Network failed - provide offline fallbacks
              if (url.pathname === "/" || url.pathname === "/index.html") {
                // Serve offline page for main routes
                return caches.match("/offline.html").then((offlineResponse) => {
                  if (offlineResponse) {
                    return offlineResponse
                  }
                  // Last resort: create a basic offline response
                  return new Response(OFFLINE_HTML, {
                    headers: { "Content-Type": "text/html" },
                  })
                })
              }

              // For other resources, try to find any cached version
              return caches.match("/").then((fallback) => {
                if (fallback) {
                  return fallback
                }
                // Return a basic error response instead of null
                return new Response("Offline - Resource not available", {
                  status: 503,
                  statusText: "Service Unavailable",
                  headers: { "Content-Type": "text/plain" },
                })
              })
            })
        })
        .catch((error) => {
          console.error("Service Worker: Cache match failed", error)
          // Return a basic response instead of letting it fail
          return new Response("Cache Error", {
            status: 500,
            statusText: "Internal Server Error",
            headers: { "Content-Type": "text/plain" },
          })
        }),
    )
  }
})

// Background sync
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered")
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve(),
    )
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received")
  const options = {
    body: event.data ? event.data.text() : "QuitTracker notification",
    icon: "/logo.png",
    badge: "/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }

  event.waitUntil(self.registration.showNotification("QuitTracker", options))
})

// Handle service worker errors
self.addEventListener("error", (event) => {
  console.error("Service Worker error:", event.error)
})

self.addEventListener("unhandledrejection", (event) => {
  console.error("Service Worker unhandled rejection:", event.reason)
})

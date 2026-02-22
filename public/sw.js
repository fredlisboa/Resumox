// Service Worker para PWA with Session Management
const CACHE_NAME = 'neuroreset-v2'
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json'
]

// Track when app goes to background/foreground
let lastActiveTime = Date.now()
const SESSION_REVALIDATION_THRESHOLD = 60 * 1000 // 1 minute

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
  // Take control immediately
  self.skipWaiting()
})

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache)
          })

        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim()
    })
  )
})

// Message handler for app visibility changes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'APP_VISIBLE') {
    const now = Date.now()
    const timeSinceLastActive = now - lastActiveTime

    // If more than threshold time has passed, notify clients to revalidate session
    if (timeSinceLastActive > SESSION_REVALIDATION_THRESHOLD) {
      event.ports[0].postMessage({
        type: 'REVALIDATE_SESSION',
        timeSinceLastActive
      })
    }

    lastActiveTime = now
  } else if (event.data && event.data.type === 'APP_HIDDEN') {
    lastActiveTime = Date.now()
  }
})

const CACHE_NAME = '8d-reports-cache-v1';
// Add all files that are part of the app shell
const urlsToCache = [
  './',
  './index.html',
  './vite.svg',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './hooks/useLocalStorage.ts',
  './components/icons.tsx',
  './components/FileUpload.tsx',
  './components/DisciplineCard.tsx',
  './components/MainMenu.tsx',
  './components/ReportView.tsx',
  './components/AIAssistButton.tsx',
  // External assets
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://aistudiocdn.com/react@^19.1.1/',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://esm.sh/@google/genai'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
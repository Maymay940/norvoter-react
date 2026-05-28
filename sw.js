const CACHE_NAME = 'norvoter-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', () => {});
const CACHE_NAME = 'jogo-joca-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './css/tv-focus.css',
  './js/main.js',
  './js/game.js',
  './js/speech.js',
  './js/focus-navigation.js',
  './js/utils.js',
  './data/words.json',
  './assets/sounds/correct.wav',
  './assets/sounds/wrong.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
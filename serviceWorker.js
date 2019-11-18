const CACHE_NAME = 'mapgt-editor';
const FILES_TO_CACHE = [
    './index.html',
    'dist/bundle.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Cache opened");
                return cache.addAll(FILES_TO_CACHE);
            })
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((res) => {
                if (res) {
                    return res;
                }
                return fetch(e.request);
            })
    )
});

self.addEventListener('activate', function (e) {

    var cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
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
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('freshmood-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                '/blender-sound.mp3'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
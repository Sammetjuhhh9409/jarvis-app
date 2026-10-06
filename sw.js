// Jarvis-app offline: de app zelf en je kaartplaatjes blijven op je telefoon bewaard.
const SHELL = "jv-shell-v1"
self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(["./", "index.html", "icon.png", "manifest.json"])).then(() => self.skipWaiting()))
})
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()))
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url)
  if (url.origin === location.origin) {
    // de app: eerst internet (nieuwste versie), anders de bewaarde versie
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(SHELL).then(c => c.put(e.request, copy)); return r
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))))
  }
})
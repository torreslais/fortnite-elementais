// Service worker do Painel de Elementais.
// - App shell: cache-first com atualização em segundo plano
//   (stale-while-revalidate), então o app abre offline e ainda
//   recebe novas versões quando há internet.
// - Imagens da wiki: cache-first, guardadas na primeira visualização.
//
// Aumente VERSION ao mudar a lista de arquivos do shell.
const VERSION = "v1";
const SHELL_CACHE = `elementais-shell-${VERSION}`;
const IMAGE_CACHE = "elementais-images-v1";

const SHELL_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./icons.js",
  "./data/elementals.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== IMAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function staleWhileRevalidate(request) {
  return caches.open(SHELL_CACHE).then((cache) =>
    cache.match(request, { ignoreSearch: request.mode === "navigate" }).then((cached) => {
      const refresh = fetch(request)
        .then((response) => {
          if (response && response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
}

function cacheFirstImage(request) {
  return caches.open(IMAGE_CACHE).then((cache) =>
    cache.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          // Respostas cross-origin sem CORS chegam como "opaque";
          // ainda assim podem ser cacheadas e reutilizadas em <img>.
          if (response && (response.ok || response.type === "opaque")) {
            cache.put(request, response.clone());
          }
          return response;
        })
    )
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin || request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (
    url.hostname.endsWith("fandom.com") ||
    url.hostname.endsWith("wikia.nocookie.net")
  ) {
    event.respondWith(cacheFirstImage(request));
  }
});

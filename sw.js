// Service worker do Controle LM: deixa o app instalável e abrir sem internet (só a tela; os dados vêm do Firebase).
// Estratégia: a página e os arquivos próprios usam "rede primeiro" (sempre pegam a versão nova quando há internet)
// e caem no cache quando está offline. Bibliotecas de CDN e o Firebase passam direto, sem cache aqui.
const CACHE = "controle-lm-v2";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "logo-lm.png", "logo-pdca.png", "icon-192.png", "icon-512.png",
  "logo-anim/logo-anim.js", "logo-anim/lm.webp", "logo-anim/p.webp", "logo-anim/pblue.webp", "logo-anim/c.webp", "logo-anim/d.webp", "logo-anim/a.webp", "logo-anim/ring.webp"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
  );
});

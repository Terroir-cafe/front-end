import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), {
  denylist: [/^\/api\/|^\/media\//],
  allowlist: import.meta.env.DEV ? [/^\/$/] : undefined,
}))
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'terroir-imagens',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
)

function mostrarPush(event) {
  let dados
  try {
    dados = event.data?.json()
  } catch {
    dados = null
  }
  return Promise.all([
    self.registration.showNotification('Terroir Café', {
      body: dados?.body || 'Você tem uma nova notificação.',
      tag: dados?.tag,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    }),
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
      for (const janela of janelas) {
        janela.postMessage({ type: 'notificacao-recebida', tipo: dados?.tipo })
      }
    }),
  ])
}

self.addEventListener('push', (event) => event.waitUntil(mostrarPush(event)))

async function abrirNotificacoes() {
  const destino = new URL('notificacoes', self.registration.scope)
  const janelas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const aberta = janelas.find((janela) => janela.url === destino.href)
  if (aberta) return aberta.focus()
  const app = janelas.find((janela) => janela.url.startsWith(self.registration.scope))
  const navegada = await app?.navigate(destino.href).catch(() => null)
  return navegada ? navegada.focus() : self.clients.openWindow(destino.href)
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(abrirNotificacoes())
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  const { body, tag } = event.data.json()
  event.waitUntil(self.registration.showNotification('Terroir Café', {
    body,
    tag,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const destino = new URL('notificacoes', self.registration.scope)
  event.waitUntil((async () => {
    const janelas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const janela = janelas.find((cliente) => cliente.url === destino.href)
    if (janela) return janela.focus()
    return self.clients.openWindow(destino.href)
  })())
})

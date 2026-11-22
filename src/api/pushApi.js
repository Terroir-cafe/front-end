import apiClient from './config'
import { aplicarLista, enfileirar, sincronizar } from '@/offline/sincronizacao'

export const suportaPush = window.isSecureContext
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'Notification' in window

async function identificador(assinatura) {
  const dados = new TextEncoder().encode(assinatura.endpoint)
  const hash = await crypto.subtle.digest('SHA-256', dados)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function obterAssinatura() {
  const registro = await navigator.serviceWorker.getRegistration()
  return registro?.pushManager.getSubscription()
}

export async function consultarPush(assinatura) {
  const dispositivo = assinatura ? await identificador(assinatura) : undefined
  const { data } = await apiClient.get('/usuarios/push/', { params: { dispositivo }, timeout: 8000 })
  return aplicarLista(`/usuarios/push/?dispositivo=${dispositivo ?? ''}`, data)
}

export async function ativarPush(chave) {
  await sincronizar()
  const registro = await navigator.serviceWorker.getRegistration()
  if (!registro?.active) throw new Error('Service worker indisponível')

  const applicationServerKey = Uint8Array.from(
    atob(chave.replace(/-/g, '+').replace(/_/g, '/')),
    (caractere) => caractere.charCodeAt(0),
  )
  const assinar = () => registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
  let assinatura = await registro.pushManager.getSubscription() ?? await assinar()
  try {
    await apiClient.put('/usuarios/push/', assinatura.toJSON(), { timeout: 8000 })
  } catch (erro) {
    if (erro.response?.status !== 409) throw erro
    await assinatura.unsubscribe()
    assinatura = await assinar()
    await apiClient.put('/usuarios/push/', assinatura.toJSON(), { timeout: 8000 })
  }
}

export async function desativarPush({ salvarDepois = false } = {}) {
  if (!suportaPush) return
  const assinatura = await obterAssinatura()
  if (!assinatura) return

  const dispositivo = await identificador(assinatura)
  if (salvarDepois) {
    await enfileirar('desativar_push', { dispositivo })
    return
  }

  try {
    await apiClient.delete('/usuarios/push/', {
      data: { dispositivo },
      timeout: 3500,
    })
  } finally {
    await assinatura.unsubscribe()
  }
}

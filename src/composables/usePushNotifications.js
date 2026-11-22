import { ref } from 'vue'
import { consultarPush, identificador, registrarPush, removerPush } from '@/api/pushApi'
import { contaAtual } from '@/offline/banco'
import { enfileirar } from '@/offline/sincronizacao'

export const suportaPush = window.isSecureContext
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'Notification' in window

const revisaoPush = ref(0)
let ultimaOperacao = Promise.resolve()

function executar(operacao) {
  const atual = ultimaOperacao.then(() => navigator.locks
    ? navigator.locks.request('terroir-assinatura-push', operacao)
    : operacao())
  ultimaOperacao = atual.catch(() => {})
  return atual
}

function chavePreferencia(conta) {
  return `terroir-push-${conta}`
}

async function consultar(conta) {
  const podeConvidar = localStorage.getItem(chavePreferencia(conta)) !== 'desativado'
  const registro = await navigator.serviceWorker.getRegistration()
  const estado = await consultarPush(await registro?.pushManager.getSubscription(), conta)
  return { ...estado, podeConvidar }
}

async function assinar(registro, chave, conta) {
  const base64 = chave.replace(/-/g, '+').replace(/_/g, '/')
  const applicationServerKey = Uint8Array.from(
    atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')),
    (caractere) => caractere.charCodeAt(0),
  )
  let assinatura = await registro.pushManager.getSubscription()
  const chaveAtual = assinatura?.options.applicationServerKey
  if (chaveAtual && (chaveAtual.byteLength !== applicationServerKey.length
    || new Uint8Array(chaveAtual).some((byte, indice) => byte !== applicationServerKey[indice]))) {
    await cancelar(assinatura, conta)
    assinatura = null
  }
  const criar = () => registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
  assinatura ??= await criar()
  try {
    await registrarPush(assinatura, conta)
  } catch (erro) {
    if (erro.response?.status !== 409 || conta !== contaAtual()) throw erro
    await assinatura.unsubscribe()
    assinatura = await criar()
    await registrarPush(assinatura, conta)
  }
}

async function cancelar(assinatura, conta) {
  const dispositivo = await identificador(assinatura.endpoint)
  try {
    await assinatura.unsubscribe()
  } finally {
    try {
      await removerPush(dispositivo, conta)
    } catch {
      if (conta === contaAtual()) await enfileirar('desativar_push', { dispositivo })
    }
  }
}

function restaurar(conta) {
  if (!suportaPush || Notification.permission !== 'granted' || !navigator.onLine) return
  void navigator.serviceWorker.ready.then((registro) => executar(async () => {
    if (conta !== contaAtual() || !navigator.onLine) return
    const preferencia = localStorage.getItem(chavePreferencia(conta))
    if (preferencia === 'desativado') return
    const assinatura = await registro.pushManager.getSubscription()
    if (!assinatura && preferencia !== 'ativado') return

    const estado = await consultarPush(assinatura, conta)
    if (estado.ativo) {
      localStorage.setItem(chavePreferencia(conta), 'ativado')
    } else if (estado.chave_publica && preferencia === 'ativado') {
      await assinar(registro, estado.chave_publica, conta)
      revisaoPush.value++
    }
  })).catch(() => {})
}

async function ativar(chave, conta) {
  if (await Notification.requestPermission() !== 'granted') return false
  return executar(async () => {
    if (conta !== contaAtual()) return false
    const registro = await navigator.serviceWorker.getRegistration()
    if (!registro?.active) throw new Error('Service worker indisponível')
    await assinar(registro, chave, conta)
    localStorage.setItem(chavePreferencia(conta), 'ativado')
    revisaoPush.value++
    return true
  })
}

async function desativar(conta, { sair = false } = {}) {
  if (!suportaPush || !conta) return
  return executar(async () => {
    if (conta !== contaAtual()) return
    const registro = await navigator.serviceWorker.getRegistration()
    const assinatura = await registro?.pushManager.getSubscription()
    try {
      if (!sair) localStorage.setItem(chavePreferencia(conta), 'desativado')
      if (assinatura) await cancelar(assinatura, conta)
    } finally {
      revisaoPush.value++
    }
  })
}

export function usePushNotifications() {
  return { ativar, consultar, desativar, restaurar, revisaoPush, suportaPush }
}

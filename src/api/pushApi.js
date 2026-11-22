import apiClient from './config'
import { aplicarLista } from '@/offline/sincronizacao'

export async function identificador(endpoint) {
  const dados = new TextEncoder().encode(endpoint)
  const hash = await crypto.subtle.digest('SHA-256', dados)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function consultarPush(assinatura, contaEsperada) {
  const dispositivo = assinatura ? await identificador(assinatura.endpoint) : undefined
  const { data } = await apiClient.get('/usuarios/push/', { params: { dispositivo }, contaEsperada, timeout: 8000 })
  return aplicarLista(`/usuarios/push/?dispositivo=${dispositivo ?? ''}`, data)
}

export function registrarPush(assinatura, contaEsperada) {
  return apiClient.put('/usuarios/push/', assinatura.toJSON(), { contaEsperada, timeout: 8000 })
}

export function removerPush(dispositivo, contaEsperada) {
  return apiClient.delete('/usuarios/push/', {
    data: { dispositivo },
    contaEsperada,
    timeout: 3500,
  })
}

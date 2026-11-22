import axios from 'axios'
import apiClient from './config'
import { chaveConsulta, contaAtual, lerConsulta } from '@/offline/banco'
import { aplicarLista, enfileirar } from '@/offline/sincronizacao'

async function listar(recurso, page) {
  const caminho = `/usuarios/${recurso}/`
  try {
    const { data } = await apiClient.get(caminho, { params: { page } })
    return aplicarLista(caminho, data)
  } catch (erro) {
    if (axios.isCancel(erro) || (erro.response && erro.response.status < 500) || recurso !== 'favoritos' || (page ?? 1) !== 1 || !contaAtual()) throw erro
    const perfil = await lerConsulta(chaveConsulta(contaAtual(), '/usuarios/me/')).catch(() => null)
    return aplicarLista(caminho, { results: perfil?.favoritos ?? [], page: 1, total_pages: 1 })
  }
}

export const listarFavoritos = (pagina) => listar('favoritos', pagina)
export const listarNotificacoes = (pagina) => listar('notificacoes', pagina)
export const listarCompras = (pagina) => listar('historico_compras', pagina)

export async function contarNaoLidas() {
  const caminho = '/usuarios/notificacoes/nao-lidas/'
  const { data } = await apiClient.get(caminho)
  return aplicarLista(caminho, data).total
}

export async function lerNotificacao(id) {
  const operacao = await enfileirar('ler', { notificacao: id })
  return { lida_em: operacao.data }
}

export function salvarFavorito(id, favorito, produto) {
  return enfileirar('favorito', { produto: id, favorito }, produto)
}

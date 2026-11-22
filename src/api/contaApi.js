import apiClient from './config'

async function listar(recurso, page) {
  const { data } = await apiClient.get(`/usuarios/${recurso}/`, { params: { page } })
  return data
}

export const listarFavoritos = (pagina) => listar('favoritos', pagina)
export const listarNotificacoes = (pagina) => listar('notificacoes', pagina)
export const listarCompras = (pagina) => listar('historico_compras', pagina)

export async function contarNaoLidas() {
  const { data } = await apiClient.get('/usuarios/notificacoes/nao-lidas/')
  return data.total
}

export async function lerNotificacao(id) {
  const { data } = await apiClient.post(`/usuarios/notificacoes/${id}/ler/`)
  return data
}

export function salvarFavorito(id, favoritar) {
  const acao = favoritar ? 'favoritar' : 'desfavoritar'
  return apiClient.post(`/produtos/${id}/${acao}/`)
}

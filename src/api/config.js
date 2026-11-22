import axios from 'axios'
import { chaveConsulta, contaAtual, lerConsulta, salvarConsulta } from '@/offline/banco'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/'
const apiClient = axios.create({ baseURL, timeout: 12000 })
const publico = /^\/(produtos|categorias|marcas)\//
const privado = /^\/(compras\/carrinho\/|usuarios\/(me\/|favoritos\/|historico_compras\/|notificacoes\/|push\/))/
let renovacao

function escopoConsulta(config) {
  if (config.method !== 'get' || config.semCache) return undefined
  const caminho = config.url.split('?')[0]
  const escopo = publico.test(caminho) ? null : privado.test(caminho) ? config.contaOrigem : undefined
  if (escopo === undefined || (privado.test(caminho) && !escopo)) return undefined
  const uri = apiClient.getUri(config)
  return chaveConsulta(escopo, '/' + uri.slice(apiClient.getUri({ url: '/' }).length))
}

apiClient.interceptors.request.use((config) => {
  const conta = contaAtual()
  if (config.contaEsperada && config.contaEsperada !== conta) {
    throw new axios.CanceledError('A conta mudou.')
  }
  config.contaOrigem = conta
  config.cacheLocal = escopoConsulta(config)
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (!navigator.onLine) throw new axios.AxiosError('Sem conexão.', 'ERR_OFFLINE', config)
  return config
})

apiClient.interceptors.response.use(
  async (response) => {
    const { config, data } = response
    if (config.contaOrigem !== contaAtual() && !publico.test(config.url)) {
      throw new axios.CanceledError('A conta mudou.')
    }
    if (config.cacheLocal) await salvarConsulta(config.cacheLocal, data).catch(() => {})
    if (config.contaOrigem !== contaAtual() && !publico.test(config.url)) {
      throw new axios.CanceledError('A conta mudou.')
    }
    return response
  },
  async (erro) => {
    const config = erro.config
    if (!config || axios.isCancel(erro)) throw erro
    if (config.contaOrigem !== contaAtual() && !publico.test(config.url)) {
      throw new axios.CanceledError('A conta mudou.')
    }

    if ((!erro.response || erro.response.status >= 500) && config.cacheLocal) {
      const data = await lerConsulta(config.cacheLocal).catch(() => undefined)
      if (config.contaOrigem !== contaAtual() && !publico.test(config.url)) {
        throw new axios.CanceledError('A conta mudou.')
      }
      if (data !== undefined) return { data, status: 200, config, offline: true }
    }

    if (erro.response?.status !== 401 || config._retry || !config.contaOrigem || config.url.includes('token/')) throw erro
    config._retry = true
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      try {
        if (renovacao?.token !== refresh) {
          const pedido = axios.post('token/refresh/', { refresh }, { baseURL, timeout: 12000 })
          renovacao = { token: refresh, pedido }
          const limpar = () => { if (renovacao?.pedido === pedido) renovacao = null }
          pedido.then(limpar, limpar)
        }
        const { data } = await renovacao.pedido
        const atual = localStorage.getItem('refresh_token')
        if (atual !== refresh && (config.contaOrigem !== contaAtual() || atual !== data.refresh)) {
          throw new axios.CanceledError('A sessão mudou.')
        }
        localStorage.setItem('access_token', data.access)
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
        return apiClient(config)
      } catch (falha) {
        if (!falha.response || ![400, 401, 403].includes(falha.response.status)) throw falha
        if (localStorage.getItem('refresh_token') !== refresh) throw falha
      }
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
    throw erro
  },
)

export default apiClient

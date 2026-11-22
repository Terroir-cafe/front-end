import { computed, ref, shallowRef } from 'vue'
import apiClient from '@/api/config'
import { concluirOperacao, contaAtual, guardarOperacao, lerFila } from './banco'

const fila = shallowRef([])
export const conectado = ref(navigator.onLine)
export const sincronizando = ref(false)
export const erroSincronizacao = ref('')
export const versao = ref(0)
export const pendencias = computed(() => fila.value.filter((op) => op.conta === contaAtual()))
let processo
let canal
let leituraFila = 0

const tiposCarrinho = new Set(['adicionar', 'quantidade'])
const descricao = {
  adicionar: 'adicionar ao carrinho',
  quantidade: 'alterar o carrinho',
  favorito: 'alterar os favoritos',
  ler: 'marcar a notificação como lida',
  avatar: 'atualizar a foto de perfil',
  desativar_push: 'desativar os alertas do dispositivo',
}

export function aplicarCarrinho(compra) {
  return pendencias.value.filter((op) => tiposCarrinho.has(op.tipo)).reduce((carrinho, op) => {
    const anterior = carrinho.itens.find((item) => item.produto.id === op.produto)
    const quantidade = op.tipo === 'adicionar' ? (anterior?.quantidade ?? 0) + op.quantidade : op.quantidade
    const item = quantidade > 0 ? { produto: op.detalhe, preco: op.detalhe.preco, quantidade } : null
    const itens = anterior
      ? carrinho.itens.flatMap((atual) => atual === anterior ? (item ? [item] : []) : [atual])
      : [...carrinho.itens, ...(item ? [item] : [])]
    return { ...carrinho, itens }
  }, compra)
}

function aplicarFavorito(lista, operacao, incluir = true) {
  if (!operacao.favorito) return lista.filter((p) => p.id !== operacao.produto)
  if (!incluir || lista.some((p) => p.id === operacao.produto)) return lista
  return [operacao.detalhe, ...lista]
}

export function aplicarConta(conta) {
  if (!conta) return conta
  return pendencias.value.filter((op) => op.tipo === 'favorito')
    .reduce((dados, op) => ({ ...dados, favoritos: aplicarFavorito(dados.favoritos, op) }), conta)
}

export function aplicarLista(caminho, dados, operacoes = pendencias.value) {
  if (caminho.startsWith('/usuarios/push/')) {
    const dispositivo = new URLSearchParams(caminho.split('?')[1]).get('dispositivo')
    return operacoes.some((op) => op.tipo === 'desativar_push' && op.dispositivo === dispositivo)
      ? { ...dados, ativo: false } : dados
  }
  if (caminho.startsWith('/usuarios/favoritos/')) {
    return operacoes.filter((op) => op.tipo === 'favorito').reduce((pagina, op) => ({
      ...pagina,
      results: aplicarFavorito(pagina.results, op, Number(pagina.page) === 1),
    }), dados)
  }
  if (!caminho.startsWith('/usuarios/notificacoes/') || !operacoes.some((op) => op.tipo === 'ler')) return dados
  if (caminho.startsWith('/usuarios/notificacoes/nao-lidas/')) {
    const lidas = new Set(operacoes.filter((op) => op.tipo === 'ler').map((op) => op.notificacao))
    return { total: Math.max(0, dados.total - lidas.size) }
  }
  if (caminho.startsWith('/usuarios/notificacoes/')) {
    const lidas = new Map(operacoes.filter((op) => op.tipo === 'ler').map((op) => [op.notificacao, op.data]))
    return { ...dados, results: dados.results.map((item) => ({
      ...item, lida_em: item.lida_em ?? lidas.get(item.id) ?? null,
    })) }
  }
  return dados
}

async function atualizarFila() {
  const leitura = ++leituraFila
  const conta = contaAtual()
  const operacoes = conta ? await lerFila(conta) : []
  if (leitura === leituraFila && conta === contaAtual()) fila.value = operacoes
}

export async function enfileirar(tipo, campos, detalhe) {
  const conta = contaAtual()
  if (!conta) throw new Error('Entre na sua conta para salvar alterações.')
  const op = {
    chave: crypto.randomUUID(),
    conta,
    tipo,
    data: new Date().toISOString(),
    ...campos,
    ...(detalhe ? { detalhe: JSON.parse(JSON.stringify(detalhe)) } : {}),
  }
  await guardarOperacao(op)
  await atualizarFila()
  canal?.postMessage('fila')
  void sincronizar()
  return op
}

function sincronizarOperacao({ ordem, detalhe, data, ...op }) {
  let payload = op
  if (op.arquivo) {
    payload = new FormData()
    for (const [chave, valor] of Object.entries(op)) payload.append(chave, valor)
  }
  return apiClient.post('/usuarios/sincronizar/', payload, { contaEsperada: op.conta })
}

function atualizarCache(caminho, dados, op) {
  return aplicarLista(caminho, dados, [op])
}

function mensagemErro(erro, op) {
  const dados = erro.response?.data
  const detalhe = dados?.detail ?? Object.values(dados ?? {}).flat(Infinity).find((v) => typeof v === 'string')
  return `Não foi possível ${descricao[op.tipo]}.${detalhe ? ' ' + detalhe : ''}`
}

async function enviarFila(conta) {
  let mudou = false
  try {
    while (conta === contaAtual() && navigator.onLine) {
      const [op] = await lerFila(conta)
      if (!op) break
      let resposta
      try {
        resposta = await sincronizarOperacao(op)
      } catch (erro) {
        const status = erro.response?.status
        if (![400, 404, 409, 413, 415, 422].includes(status)) break
        erroSincronizacao.value = mensagemErro(erro, op)
      }
      const essenciais = {}
      if (resposta && tiposCarrinho.has(op.tipo)) essenciais['/compras/carrinho/'] = resposta.data
      if (resposta && ['favorito', 'avatar'].includes(op.tipo)) essenciais['/usuarios/me/'] = resposta.data
      await concluirOperacao(op, resposta ? (caminho, dados) => atualizarCache(caminho, dados, op) : null, essenciais)
      mudou = true
    }
  } finally {
    await atualizarFila()
    if (mudou) {
      versao.value++
      canal?.postMessage('atualizado')
    }
  }
}

export function sincronizar() {
  if (processo) return processo
  const conta = contaAtual()
  if (!conta || !navigator.onLine) return Promise.resolve()
  sincronizando.value = true
  processo = (async () => {
    try {
      if (navigator.locks) await navigator.locks.request(`terroir-fila-${conta}`, () => enviarFila(conta))
      else await enviarFila(conta)
    } catch {
      erroSincronizacao.value = 'Não foi possível acessar as alterações salvas neste dispositivo.'
    } finally {
      sincronizando.value = false
      processo = null
    }
  })()
  return processo
}

export function observarConexao() {
  if ('BroadcastChannel' in globalThis) {
    canal = new BroadcastChannel('terroir-offline')
    canal.onmessage = ({ data }) => {
      void atualizarFila().then(() => {
        if (data === 'atualizado') versao.value++
        else return sincronizar()
      }).catch(() => {})
    }
  }
  const reconectar = () => {
    conectado.value = navigator.onLine
    void sincronizar()
  }
  const visivel = () => { if (!document.hidden) reconectar() }
  window.addEventListener('online', reconectar)
  window.addEventListener('offline', reconectar)
  document.addEventListener('visibilitychange', visivel)
  const intervalo = setInterval(() => { if (pendencias.value.length) reconectar() }, 15000)
  return () => {
    window.removeEventListener('online', reconectar)
    window.removeEventListener('offline', reconectar)
    document.removeEventListener('visibilitychange', visivel)
    clearInterval(intervalo)
    canal?.close()
    canal = undefined
  }
}

export async function trocarConta() {
  erroSincronizacao.value = ''
  fila.value = []
  await atualizarFila().catch(() => {})
  const anterior = processo
  if (anterior) void anterior.then(() => sincronizar())
  else void sincronizar()
}

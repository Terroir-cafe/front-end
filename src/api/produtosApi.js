import apiClient from './config'
import { chaveConsulta, guardarProdutosLocais, lerConsulta, produtosLocais } from '@/offline/banco'

const normalizar = (valor) => String(valor ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

async function pesquisarLocal(page, search, ordering, marca, categoria) {
  const produtos = await produtosLocais()
  if (!produtos.length) return null

  const carregarNomes = async (recurso) => {
    const pagina = await lerConsulta(chaveConsulta(null, `/${recurso}/`))
    return new Map(pagina?.results.map((item) => [item.id, item.nome]))
  }
  const [marcas, categorias] = await Promise.all([carregarNomes('marcas'), carregarNomes('categorias')])
  const termos = String(search).split(/[\s,]+/).filter(Boolean).map(normalizar)
  const resultados = produtos.filter((produto) => {
    const texto = normalizar(`${produto.nome} ${produto.descricao}`)
    return (!marca || (produto.marca?.nome ?? marcas.get(produto.marca)) === marca)
      && (!categoria || (produto.categoria?.nome ?? categorias.get(produto.categoria)) === categoria)
      && termos.every((termo) => texto.includes(termo))
  })
  const campo = ordering.replace(/^-/, '')
  const direcao = ordering.startsWith('-') ? -1 : 1
  resultados.sort((a, b) => {
    const diferenca = ['preco', 'quantidade'].includes(campo) ? direcao * (Number(a[campo]) - Number(b[campo])) : 0
    return diferenca || a.nome.localeCompare(b.nome, 'pt-BR')
  })
  const tamanho = 10
  const inicio = (page - 1) * tamanho
  return { results: resultados.slice(inicio, inicio + tamanho), page, total_pages: Math.max(1, Math.ceil(resultados.length / tamanho)) }
}

async function getProdutosApi(page = 1, search = '', ordering = '', marca = '', categoria = '') {
  try {
    const resposta = await apiClient.get('/produtos/', {
      params: { page, search, ordering, marca__nome: marca, categoria__nome: categoria },
    })
    if (!resposta.offline) await guardarProdutosLocais(resposta.data.results ?? []).catch(() => {})
    return resposta.data
  } catch (erro) {
    if (erro.response && erro.response.status < 500) throw erro
    const dados = await pesquisarLocal(page, search, ordering, marca, categoria).catch(() => null)
    if (!dados) throw erro
    return dados
  }
}

async function getProdutoByIdApi(id) {
  try {
    const { data } = await apiClient.get(`/produtos/${id}/`)
    return data
  } catch (erro) {
    if (erro.response && erro.response.status < 500) throw erro
    const produto = await lerConsulta(chaveConsulta(null, `produto-local/${id}`)).catch(() => null)
    if (!produto) throw erro
    return produto
  }
}

export { getProdutosApi, getProdutoByIdApi }

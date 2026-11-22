const nome = 'terroir-offline'
let conexao

export function contaAtual(token = localStorage.getItem('access_token')) {
  try {
    const carga = token?.split('.')[1]
    const { user_id } = JSON.parse(atob(carga.replace(/-/g, '+').replace(/_/g, '/')))
    return Number.isSafeInteger(Number(user_id)) && Number(user_id) > 0 ? String(user_id) : null
  } catch {
    return null
  }
}

function abrir() {
  if (conexao) return conexao
  conexao = new Promise((resolve, reject) => {
    const pedido = indexedDB.open(nome, 1)
    pedido.onupgradeneeded = () => {
      pedido.result.createObjectStore('consultas')
      const fila = pedido.result.createObjectStore('fila', { keyPath: 'ordem', autoIncrement: true })
      fila.createIndex('conta', 'conta')
    }
    pedido.onsuccess = () => resolve(pedido.result)
    pedido.onerror = () => reject(pedido.error)
  }).catch((erro) => {
    conexao = null
    throw erro
  })
  return conexao
}

async function ler(loja, consulta) {
  const banco = await abrir()
  return new Promise((resolve, reject) => {
    const pedido = consulta(banco.transaction(loja).objectStore(loja))
    pedido.onsuccess = () => resolve(pedido.result)
    pedido.onerror = () => reject(pedido.error)
  })
}

async function gravar(lojas, alterar) {
  const banco = await abrir()
  return new Promise((resolve, reject) => {
    const transacao = banco.transaction(lojas, 'readwrite')
    transacao.oncomplete = resolve
    transacao.onabort = () => reject(transacao.error ?? new Error('Não foi possível gravar no dispositivo.'))
    try {
      alterar(transacao)
    } catch (erro) {
      transacao.abort()
      reject(erro)
    }
  })
}

export const lerConsulta = (chave) => ler('consultas', (loja) => loja.get(chave))
export const salvarConsulta = (chave, dados) => gravar('consultas', (tx) => tx.objectStore('consultas').put(dados, chave))
export const lerFila = (conta) => ler('fila', (loja) => loja.index('conta').getAll(conta))
export const guardarOperacao = (operacao) => gravar('fila', (tx) => tx.objectStore('fila').add(operacao))

export const chaveConsulta = (conta, caminho) => `${conta ?? 'publico'}|${caminho}`

export function concluirOperacao(operacao, atualizar, essenciais = {}) {
  return gravar(['fila', 'consultas'], (tx) => {
    const fila = tx.objectStore('fila')
    const pedido = fila.get(operacao.ordem)
    pedido.onsuccess = () => {
      if (!pedido.result) return
      if (atualizar) {
        const prefixo = chaveConsulta(operacao.conta, '')
        const consultas = tx.objectStore('consultas')
        for (const [caminho, dados] of Object.entries(essenciais)) {
          consultas.put(dados, chaveConsulta(operacao.conta, caminho))
        }
        const busca = consultas.openCursor(IDBKeyRange.bound(prefixo, prefixo + '\uffff'))
        busca.onsuccess = () => {
          const cursor = busca.result
          if (!cursor) return
          const caminho = cursor.key.slice(prefixo.length)
          const dados = atualizar(caminho, cursor.value)
          if (dados !== cursor.value) cursor.update(dados)
          cursor.continue()
        }
      }
      fila.delete(operacao.ordem)
    }
  })
}


export async function produtosLocais() {
  const banco = await abrir()
  return new Promise((resolve, reject) => {
    const prefixo = chaveConsulta(null, 'produto-local/')
    const produtos = []
    const loja = banco.transaction('consultas').objectStore('consultas')
    const pedido = loja.openCursor(IDBKeyRange.bound(prefixo, prefixo + '\uffff'))
    pedido.onsuccess = () => {
      const cursor = pedido.result
      if (!cursor) return resolve(produtos)
      produtos.push(cursor.value)
      cursor.continue()
    }
    pedido.onerror = () => reject(pedido.error)
  })
}

export function guardarProdutosLocais(produtos) {
  return gravar('consultas', (tx) => {
    const loja = tx.objectStore('consultas')
    for (const produto of produtos) {
      loja.put(produto, chaveConsulta(null, `produto-local/${produto.id}`))
    }
  })
}

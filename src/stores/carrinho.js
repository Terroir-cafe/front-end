import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { useNotificacoesStore } from './notificacoes';
import { useAuthStore } from '@/stores/auth.js';
import { getCarrinhoApi, finalizarCompraApi } from '@/api/carrinhoApi.js';
import { chaveConsulta, contaAtual, lerConsulta, salvarConsulta } from '@/offline/banco';
import { aplicarCarrinho, conectado, enfileirar, pendencias, sincronizar } from '@/offline/sincronizacao';

const MENSAGEM_PADRAO = 'Não foi possível atualizar o carrinho. Tente novamente.';

// Procura a primeira mensagem de texto dentro da resposta de erro do DRF,
// que pode vir como string, lista ou objeto aninhado.
function extrairMensagem(error) {
    const achar = (valor) => {
        if (typeof valor === 'string') return valor;
        if (Array.isArray(valor)) {
            for (const v of valor) {
                const msg = achar(v);
                if (msg) return msg;
            }
        } else if (valor && typeof valor === 'object') {
            for (const v of Object.values(valor)) {
                const msg = achar(v);
                if (msg) return msg;
            }
        }
        return null;
    };

    const data = error.response?.data;

    // erro de estoque do "finalizar": { status, produto, quantidade_disponivel }
    if (data?.produto && data?.quantidade_disponivel !== undefined) {
        return `Estoque insuficiente para "${data.produto}": há apenas ${data.quantidade_disponivel} unidade(s).`;
    }

    return achar(data) ?? MENSAGEM_PADRAO;
}

// Converte um item do back-end para o formato que as telas já usam.
function normalizarItem(item) {
    const produto = item.produto;
    return {
        id: produto.id, // id do PRODUTO
        nome: produto.nome,
        preco: Number(item.preco) || 0,
        imagem: produto.capa?.url || '',
        quantidade: item.quantidade,
        estoque: produto.quantidade,
    };
}

export const useCarrinhoStore = defineStore('carrinho', () => {
    const vazio = { id: null, itens: [] };
    const compra = ref(vazio);
    const carregando = ref(false);
    const salvando = ref(false);
    const erro = ref('');
    let leitura = 0;

    const itensComProduto = computed(() => aplicarCarrinho(compra.value).itens);
    const itens = computed(() => itensComProduto.value.map(normalizarItem));
    const quantidadeTotal = computed(() => itens.value.reduce((total, item) => total + item.quantidade, 0));
    const subtotal = computed(() => itens.value.reduce((total, item) => total + item.preco * item.quantidade, 0));
    const pendente = computed(() => pendencias.value.some((op) => ['adicionar', 'quantidade'].includes(op.tipo)));

    function limpar() {
        leitura++;
        compra.value = vazio;
        carregando.value = false;
        erro.value = '';
    }

    function limparErro() {
        erro.value = '';
    }

    async function carregar() {
        const conta = contaAtual();
        if (!conta) {
            limpar();
            return;
        }
        const pedido = ++leitura;
        carregando.value = true;
        try {
            const cache = await lerConsulta(chaveConsulta(conta, '/compras/carrinho/')).catch(() => null);
            if (pedido !== leitura || conta !== contaAtual()) return;
            if (cache) compra.value = cache;
            if (pendente.value || !navigator.onLine) return;
            const dados = await getCarrinhoApi({ contaEsperada: conta });
            if (pedido === leitura && conta === contaAtual()) compra.value = dados;
        } catch (e) {
            if (pedido === leitura && e.response) erro.value = extrairMensagem(e);
        } finally {
            if (pedido === leitura) carregando.value = false;
        }
    }

    async function enviar(tipo, produto, quantidade) {
        if (salvando.value) return false;
        salvando.value = true;
        erro.value = '';
        try {
            await enfileirar(tipo, { produto: produto.id, quantidade }, produto);
            return true;
        } catch (e) {
            erro.value = e.message || MENSAGEM_PADRAO;
            return false;
        } finally {
            salvando.value = false;
        }
    }

    async function adicionar(produto, quantidade = 1) {
        if (!useAuthStore().isAuthenticated) {
            erro.value = 'Faça login para adicionar produtos ao carrinho.';
            router.push('/login');
            return false;
        }
        const atual = itensComProduto.value.find((item) => item.produto.id === produto.id);
        if ((atual?.quantidade ?? 0) + quantidade > produto.quantidade) {
            erro.value = 'Quantidade indisponível no estoque consultado.';
            return false;
        }
        return enviar('adicionar', produto, quantidade);
    }

    async function atualizarQuantidade(id, quantidade) {
        const item = itensComProduto.value.find((entrada) => entrada.produto.id === id);
        if (!item) return false;
        return enviar('quantidade', item.produto, Math.max(0, quantidade));
    }

    const remover = (id) => atualizarQuantidade(id, 0);

    async function finalizar() {
        const conta = contaAtual();
        if (!conta || salvando.value || !navigator.onLine) return false;

        salvando.value = true;
        erro.value = '';
        try {
            await sincronizar();
            if (pendente.value) {
                erro.value = 'Aguarde a sincronização do carrinho para finalizar.';
                return false;
            }
            const dados = await getCarrinhoApi({ semCache: true, contaEsperada: conta });
            if (!dados.id || !dados.itens.length) {
                limpar();
                erro.value = 'O carrinho está vazio no servidor.';
                return false;
            }
            const resumo = (carrinho) => JSON.stringify(carrinho.itens.map(
                (item) => [item.produto.id, item.quantidade, Number(item.preco)],
            ).sort((a, b) => a[0] - b[0]));
            if (dados.id !== compra.value.id || resumo(dados) !== resumo(compra.value)) {
                compra.value = dados;
                erro.value = 'O carrinho foi atualizado. Confira os itens antes de finalizar.';
                return false;
            }
            await finalizarCompraApi(dados.id, conta);
            limpar();
            await salvarConsulta(chaveConsulta(conta, '/compras/carrinho/'), vazio).catch(() => {});
            useNotificacoesStore().atualizar();
            return true;
        } catch (e) {
            erro.value = e.response ? extrairMensagem(e) : 'Conecte-se para finalizar a compra.';
            return false;
        } finally {
            salvando.value = false;
        }
    }

    return {
        itens,
        carregando,
        salvando,
        erro,
        quantidadeTotal,
        subtotal,
        pendente,
        conectado,
        carregar,
        adicionar,
        atualizarQuantidade,
        remover,
        finalizar,
        limpar,
        limparErro,
    };
});

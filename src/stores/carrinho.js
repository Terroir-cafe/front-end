import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { useNotificacoesStore } from './notificacoes';
import { useAuthStore } from '@/stores/auth.js';
import {
    getCarrinhoApi,
    adicionarItemApi,
    substituirItensApi,
    finalizarCompraApi,
} from '@/api/carrinhoApi.js';

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
    const compraId = ref(null);
    const itens = ref([]);
    const carregando = ref(false); // lendo do back-end
    const salvando = ref(false); // enviando para o back-end
    const erro = ref('');

    const quantidadeTotal = computed(() =>
        itens.value.reduce((total, item) => total + item.quantidade, 0)
    );
    const subtotal = computed(() =>
        itens.value.reduce((total, item) => total + item.preco * item.quantidade, 0)
    );

    // o carrinho antigo ficava no localStorage; não é mais usado
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('terroir-carrinho');
    }

    function aplicar(compra) {
        compraId.value = compra.id;
        itens.value = (compra.itens ?? []).map(normalizarItem);
    }

    // Zera só o estado local (ex.: ao sair da conta). Não apaga nada no back-end.
    function limpar() {
        compraId.value = null;
        itens.value = [];
        erro.value = '';
    }

    function limparErro() {
        erro.value = '';
    }

    // Lê o carrinho do back-end
    async function carregar() {
        if (!useAuthStore().isAuthenticated) {
            limpar();
            return;
        }

        carregando.value = true;
        try {
            aplicar(await getCarrinhoApi());
        } catch (e) {
            console.error(e);
            erro.value = extrairMensagem(e);
        } finally {
            carregando.value = false;
        }
    }

    // Envia uma alteração e já recebe o carrinho completo de volta
    async function enviar(requisicao) {
        if (salvando.value) return false;

        salvando.value = true;
        erro.value = '';
        try {
            aplicar(await requisicao());
            useNotificacoesStore().atualizar();
            return true;
        } catch (e) {
            console.error(e);
            erro.value = extrairMensagem(e);
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

        return enviar(() => adicionarItemApi(produto.id, quantidade));
    }

    async function atualizarQuantidade(id, quantidade) {
        if (quantidade <= 0) return remover(id);
        if (!compraId.value) return false;

        const novosItens = itens.value.map((item) => ({
            produto: item.id,
            quantidade: item.id === id ? quantidade : item.quantidade,
        }));

        return enviar(() => substituirItensApi(compraId.value, novosItens));
    }

    async function remover(id) {
        if (!compraId.value) return false;

        const novosItens = itens.value
            .filter((item) => item.id !== id)
            .map((item) => ({ produto: item.id, quantidade: item.quantidade }));

        return enviar(() => substituirItensApi(compraId.value, novosItens));
    }

    // Envia o carrinho para finalização no back-end
    async function finalizar() {
        if (!compraId.value || salvando.value) return false;

        salvando.value = true;
        erro.value = '';
        try {
            await finalizarCompraApi(compraId.value);
            useNotificacoesStore().atualizar();
            limpar(); // essa compra deixou de ser carrinho; o próximo começa vazio
            return true;
        } catch (e) {
            console.error(e);
            erro.value = extrairMensagem(e);
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
        carregar,
        adicionar,
        atualizarQuantidade,
        remover,
        finalizar,
        limpar,
        limparErro,
    };
});

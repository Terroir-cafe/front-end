import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'terroir-carrinho';

function carregarItens() {
    if (typeof localStorage === 'undefined') return [];

    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export const useCarrinhoStore = defineStore('carrinho', () => {
    const itens = ref(carregarItens());
    const quantidadeTotal = computed(() =>
        itens.value.reduce((total, item) => total + item.quantidade, 0)
    );
    const subtotal = computed(() =>
        itens.value.reduce((total, item) => total + Number(item.preco) * item.quantidade, 0)
    );

    watch(itens, (novosItens) => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(novosItens));
        }
    }, { deep: true });

    function adicionar(produto) {
        const existente = itens.value.find((item) => item.id === produto.id);

        if (existente) {
            existente.quantidade += 1;
            return;
        }

        itens.value.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco) || 0,
            imagem: produto.capa?.url || '',
            quantidade: 1,
        });
    }

    function atualizarQuantidade(id, quantidade) {
        const item = itens.value.find((produto) => produto.id === id);
        if (!item) return;

        if (quantidade <= 0) {
            remover(id);
            return;
        }

        item.quantidade = quantidade;
    }

    function remover(id) {
        itens.value = itens.value.filter((item) => item.id !== id);
    }

    function limpar() {
        itens.value = [];
    }

    return { itens, quantidadeTotal, subtotal, adicionar, atualizarQuantidade, remover, limpar };
});
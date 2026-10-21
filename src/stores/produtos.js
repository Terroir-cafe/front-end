import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getProdutosApi, getProdutoByIdApi } from '../api/produtosApi';
import getCategoriasApi from '../api/categoriasApi';
import getMarcasApi from '../api/marcasApi';

export const useProdutosStore = defineStore('produtos', () => {
    const categorias = ref([]);
    const marcas = ref([]);
    const produtos = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const menuIsOpen = ref(false);
    const currentSearch = ref('');
    const produtoAtual = ref([]);

    async function getProdutos(
        page = 1,
        search = '',
        ordering = '',
        marca = '',
        categoria = ''
    ) {
        loading.value = true;
        error.value = null;
        currentSearch.value = search;
        produtos.value = [];

        try {
            const data = await getProdutosApi(
                page,
                search,
                ordering,
                marca,
                categoria
            );

            produtos.value = data?.results ?? [];
        } catch (err) {
            error.value = 'Erro ao carregar produtos';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    async function getProdutoById(id){
        const data = await getProdutoByIdApi(id);
        produtoAtual.value = data;
    }

    async function search(text) {
        await getProdutos(1, text);
    }

    function toggleMenu() {
        menuIsOpen.value = !menuIsOpen.value;
    }

    async function getCategorias() {
        const data = await getCategoriasApi();
        categorias.value = data?.results ?? [];
    }

    async function getMarcas() {
        const data = await getMarcasApi();
        marcas.value = data?.results ?? [];
    }

    return {
        produtos,
        categorias,
        marcas,
        loading,
        error,
        menuIsOpen,
        currentSearch,
        toggleMenu,
        getProdutos,
        getMarcas,
        getCategorias,
        search,
        produtoAtual,
        getProdutoById
    };
});
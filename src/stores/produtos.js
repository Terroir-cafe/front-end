import { ref } from 'vue';
import { defineStore } from 'pinia';
import produtosApi from '../api/produtosApi';
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

    async function fetchProdutos(
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
            const data = await produtosApi(
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

    async function search(text) {
        await fetchProdutos(1, text);
    }

    function toggleMenu() {
        menuIsOpen.value = !menuIsOpen.value;
    }

    async function fetchCategorias() {
        const data = await getCategoriasApi();
        categorias.value = data?.results ?? [];
    }

    async function fetchMarcas() {
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
        fetchProdutos,
        fetchMarcas,
        fetchCategorias,
        search
    };
});
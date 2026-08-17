import { computed,ref } from 'vue';
import { defineStore } from 'pinia';
import produtosApi from '../api/produtosApi';

export const useProdutosStore = defineStore('produtos', () => {
const produtos = ref([]);
const loading = ref(false);
const error = ref(null);
const menuIsOpen = ref(false);
const currentSearch = ref('');

async function fetchProdutos(page =1, search = '') {
    loading.value = true;
    error.value = null;
    currentSearch.value = search
    produtos.value = [];
    try{
        const data = await produtosApi(page, search);
        produtos.value = data?.results ?? [];
    } catch (err) {
        error.value = 'Erro ao carregar produtos';
        console.error(err);
    } finally {
        loading.value = false;
    }
    console.log('Produtos carregados:', produtos.value);
}

async function search(text){
    await produtosApi(1, text);
}

function toggleMenu(){
    menuIsOpen.value = !menuIsOpen.value;
}

return{
    produtos,
    loading,
    error,
    menuIsOpen,
    toggleMenu,
    fetchProdutos,
    search,
}
}
)
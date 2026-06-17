import { computed,ref } from 'vue';
import { defineStore } from 'pinia';
import produtosApi from '../api/produtosApi';

export const useProdutosStore = defineStore('produtos', () => {
const produtos = ref([]);
const loading = ref(false);
const error = ref(null);
const menuIsOpen = ref(false);

async function fetchProdutos(){
    loading.value = true;
    error.value = null;
    try{
        const response = await produtosApi.getAll();
        produtos.value = response.data.results;
    } catch (err) {
        error.value = 'Erro ao carregar produtos';
        console.error(err);
    } finally {
        loading.value = false;
    }
    console.log('Produtos carregados:', produtos.value);
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
}
})
<script setup>
defineProps({
    showBack: Boolean,
    showCart: Boolean,
    showMenu: Boolean,
});

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProdutosStore } from '@/stores/produtos.js'
import { mdiCart, mdiMenu, mdiArrowLeft } from '@mdi/js'
import appMenu from './appMenu.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import appInput from '../forms/appInput.vue';
const router = useRouter()
const store = useProdutosStore()

const mdiCartIcon = ref(mdiCart)
const mdiMenuIcon = ref(mdiMenu)
const mdiArrowLeftIcon = ref(mdiArrowLeft)
const showBusca = ref(false)
const busca = ref('');
let buscaTimer = null;

onMounted(() => {
    clearTimeout(buscaTimer);
})

async function onBusca(){
    clearTimeout(buscaTimer);
    showBusca.value = true;
    buscaTimer = setTimeout(() => {
        store.fetchProdutos(1, busca.value)
    }, 400);
}

</script>
<template>
<header>
    <div class="app-header">
        <app-menu v-if="store.menuIsOpen" />
    <ul class="container">
    <li>
        <button class="menu-hamburguer icon" v-if="showMenu" @click="store.toggleMenu">
            <SvgIcon type="mdi" :path="mdiMenuIcon" />
        </button>
    </li>
    <li>
        <button @click="router.back()" class="voltar icon" v-if="showBack">
            <SvgIcon type="mdi" :path="mdiArrowLeftIcon" />
        </button>
    </li>
    <li>
        <p><img src="/Logo.png" alt="Terroir Café" class="logo" /></p>
    </li>
    <li>
        <button @click="router.push('/cart')" class="carrinho icon" v-if="showCart">
            <SvgIcon type="mdi" :path="mdiCartIcon" />
        </button>
    </li>
    </ul>
    <div class="pesquisa-container">
    <div class="barra-de-pesquisa">
        <appInput placeholder="Buscar produtos..." v-model="busca" @input="onBusca"/>
    </div>
    <div class="pesquisa" v-if="showBusca && busca.trim() && store.produtos.length">
        <ul v-for="produto in store.produtos" :key="produto.id">
            <li>
                <div class="resultado-imagem">
                    <p class="imagem-produto"><img :src="produto?.capa?.url" :alt="produto.nome" class="imagem-produto" /></p>
                </div>
                <div class="resultado-info">
                    <router-link :to="`/produto/${produto.id}`">{{ produto.nome }}</router-link>
                </div>
            </li>
        </ul>
    </div>
    </div>
    </div>
</header>
</template>
<style scoped>
header{
    background-color: #74403E;
    height: 12vh;
}

.container{
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 20px;
}

.icon{
    text-decoration: none;
    background-color: transparent;
    border: none;
    padding: 10px;
    color:#fff;
}

.logo{
    width: 250px;
    height: auto;
}

.barra-de-pesquisa{
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
}

.pesquisa {
    position: absolute;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    max-height: 300px;
    overflow-y: auto;

    background-color: white;
    border-radius: 0 0 8px 8px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    z-index: 9;
}

.pesquisa ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.pesquisa li {
    display: flex;
    align-items: center;
    gap: 15px;

    padding: 10px 20px;

    border-bottom: 1px solid #ddd;
}

.pesquisa li:hover {
    background-color: #f5f5f5;
}

.resultado-imagem {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
}

.imagem-produto {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.resultado-info a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
}
</style>
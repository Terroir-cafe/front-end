<script setup>
defineProps({
    showBack: Boolean,
    showCart: Boolean,
    showMenu: Boolean,
});

import { ref } from 'vue'
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
    <div class="barra-de-pesquisa">
        <appInput placeholder="Buscar produtos..." />
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
</style>
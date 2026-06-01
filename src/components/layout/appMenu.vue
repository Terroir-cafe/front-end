<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
import { mdiAccountCircle, mdiArrowExpandLeft } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { useProdutosStore } from '@/stores/produtos.js'

const store = useProdutosStore()
const mdiArrowExpandLeftIcon = ref(mdiArrowExpandLeft)
const mdiAccountCircleIcon = ref(mdiAccountCircle)
const isAdmin = ref(false);
const isLoggedIn = ref(false);

</script>
<template>
<div class="menu-hamburguer">
    <div class="container-titulo">
    <h2 class="titulo">
        Menu
    </h2>
    <SvgIcon type="mdi" :path="mdiArrowExpandLeftIcon" @click="store.toggleMenu"/>
    </div>
    <div class="linha-menu"></div>
    <ul class="lista-menu">
        <li>
            <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
            <RouterLink to="/sobre">Sobre</RouterLink>
        </li>
        <li>
            <RouterLink to="/cadastro">Contato</RouterLink>
        </li>
        <li v-if="isAdmin">
            <RouterLink to="/cadastrar-objeto">Cadastrar Produto</RouterLink>
        </li>
        <li>
            <div class="perfil">
                <SvgIcon type="mdi" :path="mdiAccountCircleIcon" />
                <p v-if="isLoggedIn">Perfil</p>
                <RouterLink to="/login" v-else>Login</RouterLink>
            </div>
        </li>
    </ul>
</div>
</template>
<style scoped>
.menu-hamburguer {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px; /* define largura do menu */
    height: 100vh; /* ocupa altura toda */
    background-color: white; /* importante pra aparecer */
    padding: 20px;
    z-index: 10;
}

.menu-hamburguer.ativo {
    transform: translateX(0); /* aparece */
}

.container-titulo {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.titulo {
    color: #000;
    font-size: 32px;
    margin-bottom: 5px;
}

.linha-menu {
    height: 2px;
    background-color: #000;
}

.lista-menu {
    list-style: none;
    padding: 0;
}

.lista-menu li {
    padding-top: 10px;
    padding-bottom: 20px;
    border-bottom: 2px solid #000;
}

.lista-menu li a {
    text-decoration: none;
    color: #000;
    font-size: 24px;
}

.perfil{
    display: flex;
    align-items: center;
}
</style>
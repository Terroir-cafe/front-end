<script setup>
defineProps({
    showBack: Boolean,
    showCart: Boolean,
    showMenu: Boolean,
});

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProdutosStore } from '@/stores/produtos.js'
import { useAuthStore } from '@/stores/auth.js'
import { mdiCart, mdiMenu, mdiArrowLeft, mdiAccountCircle } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import appInput from '../forms/appInput.vue';

const router = useRouter()
const store = useProdutosStore()
const authStore = useAuthStore()

const mdiCartIcon = ref(mdiCart)
const mdiMenuIcon = ref(mdiMenu)
const mdiArrowLeftIcon = ref(mdiArrowLeft)
const mdiAccountIcon = ref(mdiAccountCircle) 
</script>

<template>
<header class="custom-header">
  <nav class="header-nav">

    <div class="nav-left">
      <button class="icon" v-if="showMenu" @click="store.toggleMenu">
        <SvgIcon type="mdi" :path="mdiMenuIcon"/>
      </button>

      <button class="icon" v-if="showBack" @click="router.back()">
        <SvgIcon type="mdi" :path="mdiArrowLeftIcon"/>
      </button>
    </div>

    <div class="nav-logo" @click="router.push('/')">
      <img src="/Logo.png" alt="Terroir Café" class="logo">
    </div>

    <div class="nav-search">
      <appInput placeholder="Buscar produto" class="search-input" />
    </div>

    <div class="nav-user-desktop" v-if="authStore.isAuthenticated">
      <button class="btn-user" @click="router.push('/usuario')">
        <img :src="authStore.user?.foto.url" v-if="authStore.user?.foto?.url">
        <SvgIcon type="mdi" :path="mdiAccountIcon" class="user-icon" v-else/>
        <span>{{ authStore.user?.name || 'Usuário' }}</span>
      </button>
    </div>

    <div class="nav-user-desktop" v-else>
      <button class="btn-user" @click="router.push('/login')">
        <SvgIcon type="mdi" :path="mdiAccountIcon" class="user-icon"/>
        <span>Entrar</span>
      </button>
    </div>

    <div class="nav-right">
      <button class="icon" v-if="showCart" @click="router.push('/cart')">
        <SvgIcon type="mdi" :path="mdiCartIcon"/>
      </button>
    </div>

  </nav>
</header>
</template>

<style scoped>
.custom-header {
    background: #6d423b; /* Ajustado para bater com o marrom café exato da foto */
    padding: 15px 20px;
    box-sizing: border-box;
}

/* No mobile, usamos o CSS Grid para criar duas linhas organizadas */
.header-nav {
    display: grid;
    grid-template-columns: 50px 1fr 50px;
    grid-template-rows: auto auto;
    align-items: center;
    width: 100%;
}

.nav-left {
    grid-column: 1;
    display: flex;
    justify-content: flex-start;
}

.nav-logo {
    grid-column: 2;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.logo {
    height: 32px; /* Mantém a proporção correta sem esticar a barra */
    width: auto;
}

.nav-right {
    grid-column: 3;
    display: flex;
    justify-content: flex-end;
}

/* Força a barra de pesquisa a ocupar a segunda linha inteira no mobile */
.nav-search {
    grid-column: 1 / span 3;
    grid-row: 2;
    margin-top: 15px;
    width: 100%;
}

/* Remove completamente o bloco de usuário do fluxo mobile */
.nav-user-desktop {
    display: none;
}

.nav-user-desktop img{
    width: 3vw;
    height: 3vw;
    border-radius: 50%;
}

/* Estilização profunda na pílula do input de busca */
:deep(.search-input input) {
    width: 100% !important;
    height: 40px !important;
    border-radius: 20px !important;
    border: 2px solid #e2c29f !important; /* Borda bege sutil do input da imagem */
    padding: 0 15px 0 40px !important; /* Espaço para o ícone de lupa interno */
    font-size: 14px !important;
    outline: none !important;
}

.icon {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon :deep(svg) {
    width: 28px;
    height: 28px;
}

@media (min-width: 1024px) {
    .custom-header {
        padding: 12px 40px;
    }

    /* Transforma o Grid em uma linha flexível única horizontal */
    .header-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Remove o botão hambúrguer do desktop se necessário (ou mantém se showMenu for true) */
    .nav-left {
        display: none; /* No seu print de desktop não há menu hambúrguer */
    }

    .nav-logo {
        flex-shrink: 0;
    }

    .logo {
        height: 38px;
    }

    /* Centraliza e limita o tamanho da barra de pesquisa no meio do layout */
    .nav-search {
        margin-top: 0;
        flex: 1;
        max-width: 500px;
    }

    /* Ativa o botão de Usuário ao lado da busca */
    .nav-user-desktop {
        display: flex;
        align-items: center;
    }

    .btn-user {
        background: none;
        border: none;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        padding: 5px 10px;
        transition: opacity 0.2s;
    }

    .btn-user:hover {
        opacity: 0.8;
    }

    .user-icon {
        width: 28px;
        height: 28px;
    }

    .nav-right {
        flex-shrink: 0;
    }
}
</style>
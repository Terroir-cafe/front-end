<script setup>
defineProps({
    showBack: Boolean,
    showCart: Boolean,
    showMenu: Boolean,
});

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProdutosStore } from '@/stores/produtos.js'
import { useAuthStore } from '@/stores/auth.js'
import { mdiCart, mdiMenu, mdiArrowLeft, mdiAccountCircle } from '@mdi/js'
import appMenu from './appMenu.vue';
import SvgIcon from '@jamescoyle/vue-icon'
import appInput from '../forms/appInput.vue';

const router = useRouter()
const store = useProdutosStore()
const authStore = useAuthStore()

const mdiCartIcon = ref(mdiCart)
const mdiMenuIcon = ref(mdiMenu)
const mdiArrowLeftIcon = ref(mdiArrowLeft)
const mdiAccountIcon = ref(mdiAccountCircle) 

const showBusca = ref(false)
const busca = ref('');
const buscaTimer = null;

async function onBusca() {
    clearTimeout(buscaTimer);

    if (!busca.value.trim()) {
        showBusca.value = false;
        return;
    }

    showBusca.value = true;

    buscaTimer = setTimeout(() => {
        store.fetchProdutos(1, busca.value.trim());
    }, 400);
}

function onBuscaEnter() {
    const texto = busca.value.trim();

    if (!texto) return;

    clearTimeout(buscaTimer);

    showBusca.value = false;

    router.push({
        path: '/pesquisa',
        query: {
            search: texto
        }
    });
}


</script>

<template>
  <header class="custom-header">
    <nav class="header-nav">
      <app-menu v-if="store.menuIsOpen" />

      <div class="nav-left">
        <button class="icon" v-if="showMenu" @click="store.toggleMenu">
          <SvgIcon type="mdi" :path="mdiMenuIcon" />
        </button>

        <button class="icon" v-if="showBack" @click="router.back()">
          <SvgIcon type="mdi" :path="mdiArrowLeftIcon" />
        </button>
      </div>

      <div class="nav-logo" @click="router.push('/')">
        <img src="/Logo.png" alt="Terroir Café" class="logo" />
      </div>

      <div class="pesquisa-container">
        <div class="barra-de-pesquisa">
          <appInput
            placeholder="Buscar produtos..."
            v-model="busca"
            @input="onBusca"
            @keyup.enter="onBuscaEnter"
          />
        </div>

        <div
          class="pesquisa"
          v-if="showBusca && busca.trim() && store.produtos.length"
        >
          <ul v-for="produto in store.produtos" :key="produto.id">
            <li>
              <div class="resultado-imagem">
                <img
                  :src="produto?.capa?.url"
                  :alt="produto.nome"
                />
              </div>

              <div class="resultado-info">
                <router-link :to="`/produto/${produto.id}`">
                  {{ produto.nome }}
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="nav-user-desktop" v-if="authStore.isAuthenticated">
        <button class="btn-user" @click="router.push('/usuario')">
          <img
            v-if="authStore.user?.foto?.url"
            :src="authStore.user.foto.url"
          />
          <SvgIcon
            v-else
            type="mdi"
            :path="mdiAccountIcon"
            class="user-icon"
          />
          <span>{{ authStore.user?.name || 'Usuário' }}</span>
        </button>
      </div>

      <div class="nav-user-desktop" v-else>
        <button class="btn-user" @click="router.push('/login')">
          <SvgIcon type="mdi" :path="mdiAccountIcon" class="user-icon" />
          <span>Entrar</span>
        </button>
      </div>

      <div class="nav-right">
        <button class="icon" v-if="showCart" @click="router.push('/cart')">
          <SvgIcon type="mdi" :path="mdiCartIcon" />
        </button>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.custom-header {
    background: #6d423b;
    padding: 15px 20px;
    box-sizing: border-box;
}

.header-nav {
    display: grid;
    grid-template-columns: 50px 1fr 50px;
    grid-template-rows: auto auto;
    align-items: center;
    width: 100%;
}

.pesquisa-container {
    position: relative;
}

.pesquisa {
    position: absolute;
    top: 100%;
    left: 0;
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

.resultado-imagem img {
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
    height: 32px;
    width: auto;
}

.nav-right {
    grid-column: 3;
    display: flex;
    justify-content: flex-end;
}

.nav-user-desktop {
    display: none;
}

.nav-user-desktop img {
    width: 3vw;
    height: 3vw;
    border-radius: 50%;
}

:deep(.search-input input) {
    width: 100% !important;
    height: 40px !important;
    border-radius: 20px !important;
    border: 2px solid #e2c29f !important;
    padding: 0 15px 0 40px !important;
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

    .header-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .nav-left {
        display: none;
    }

    .nav-logo {
        flex-shrink: 0;
    }

    .logo {
        height: 38px;
    }

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
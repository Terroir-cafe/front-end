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
  <nav>
  <app-menu v-if="store.menuIsOpen" />

  <div class="header-top">

    <button
      class="icon"
      v-if="showMenu"
      @click="store.toggleMenu"
    >
      <SvgIcon type="mdi" :path="mdiMenuIcon"/>
    </button>

    <button
      class="icon"
      v-if="showBack"
      @click="router.back()"
    >
      <SvgIcon type="mdi" :path="mdiArrowLeftIcon"/>
    </button>

    <img src="/Logo.png"
         alt="Terroir Café"
         class="logo">

    <button
      class="icon"
      v-if="showCart"
      @click="router.push('/cart')"
    >
      <SvgIcon type="mdi" :path="mdiCartIcon"/>
    </button>

  </div>

  <div class="barra-de-pesquisa">
      <appInput placeholder="Buscar produtos..." />
  </div>
</nav>
</header>
</template>
<style scoped>
header{
    background:#74403E;
    height: 12vh;
}
.header-top{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;
}

.icon{
    background:none;
    border:none;
    color:white;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:28px;
}

.logo{
    width:230px;
    height:auto;
}

.barra-de-pesquisa{
    width:100%;
    margin-top:15px;
    justify-content:center;
    display:flex;
}

@media (min-width:1024px){
    .container{
        max-width:1024px;
        margin:0 auto;
    }
    .barra-de-pesquisa{
        border-radius: 25px;;
    }
  }
</style>
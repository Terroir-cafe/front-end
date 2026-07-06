<script setup>
import { RouterLink, RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
import appMenu from '@/components/layout/appMenu.vue';
import { useProdutosStore } from '@/stores/produtos.js';

const store = useProdutosStore()

</script>

<template>
  <div class="layout">
    <appMenu v-if="store.menuIsOpen" />
    <appHeader showMenu  showCart/>
    <main>
      <router-view />
    </main>
    <appFooter />
  </div>
</template> 
<style scoped>
.layout{
    min-height:100vh;
    display:flex;
    flex-direction:column;
}

main{
    flex:1;
}
</style>


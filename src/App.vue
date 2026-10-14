<script setup>
import { RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
import appFooterMobile from '@/components/layout/appFooterMobile.vue';
import { onMounted } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';

onMounted(() => {
  const produtosStore = useProdutosStore();

  produtosStore.fetchCategorias();
  produtosStore.fetchMarcas();
});

</script>

<template>
  <div class="layout">

    <appHeader />

    <main>
      <router-view />
    </main>

    <appFooter class="footer-desktop" />
    <appFooterMobile class="footer-mobile-host" />

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

.footer-mobile-host {
  display: none;
}

@media (max-width: 600px) {
  .footer-desktop {
    display: none;
  }

  .footer-mobile-host {
    display: block;
  }

  main {
    padding-bottom: 76px;
  }
}
</style>


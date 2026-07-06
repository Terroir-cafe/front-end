<script setup>
import { RouterLink, RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
import { useAuthStore } from '@/stores/auth.js';

</script>

<template>
  <div class="layout">

    <appHeader />

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


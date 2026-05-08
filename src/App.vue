<script setup>
import { RouterLink, RouterView } from 'vue-router'
import appFooter from './components/layout/appFooter.vue';
import SobreNosView from './views/SobreNosView.vue';
</script>

<template>
  <RouterView />
  <app-footer />
  <SobreNosView />
</template>

<style scoped>

</style>

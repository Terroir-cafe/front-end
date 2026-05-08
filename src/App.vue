<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppCadastro from './components/forms/appCadastro.vue';
import appFooter from './components/layout/appFooter.vue';
import SobreNosView from './views/SobreNosView.vue';
</script>

<template>
  <RouterView />
  <AppCadastro/>
  <app-footer />
  <SobreNosView />
</template>

<style scoped>

</style>

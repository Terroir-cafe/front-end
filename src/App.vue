<script setup>
import { RouterLink, RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
</script>

<template>
  <appHeader show-menu show-cart />
  <RouterView/>
  <appFooter />
</template>

<style scoped>

</style>

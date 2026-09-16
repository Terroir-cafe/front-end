<script setup>
import { onMounted } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';

const store = useProdutosStore();

const props = defineProps({
  produtoId: {
    type: Number,
    required: true
  }
});

onMounted(async ()=> {
    await store.fetchProdutoById(props.produtoId)
})

</script>
<template>

</template>
<style scoped>

</style>
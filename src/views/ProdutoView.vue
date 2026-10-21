<script setup>
import { onMounted } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';
import appButton from '@/components/forms/appButton.vue';
import Swiper from 'swiper/bundle';

const store = useProdutosStore();

const props = defineProps({
  produtoId: {
    type: Number,
    required: true
  }
});

onMounted(async ()=> {
    await store.getProdutoById(props.produtoId)
    console.log('Produto atual:', store.produtoAtual);
    await store.getProdutos(1, { categoria: store.produtoAtual.categoria.nome })
})

</script>
<template>
<div class="produto-view">
  <div v-if="store.produtoAtual" class="produto-detalhes">
    <div class="produto-imagem">
      <p><img :src="store.produtoAtual?.capa?.url" :alt="store.produtoAtual.nome"></p>
    </div>
    <div class="produto">
    <div class="produto-info">
      <h1 class="nome">{{ store.produtoAtual.nome }}</h1>
      <p class="preco">Preço: R${{ store.produtoAtual.preco }}</p>
      <p class="desc">Descrição: {{ store.produtoAtual.descricao }}</p>
    </div>
    <div class="buttons">
      <appButton variant="primary">
        <span>Adicionar ao Carrinho</span>
        </appButton>
      <appButton variant="secondary">
        <span>Favoritos</span>
      </appButton>
    </div>
    </div>
  </div>
  <div class="produtos-categorias">
    <div v-for="produto in store.produtos" :key="produto.id" class="produto-item">
      <p><img :src="produto.capa?.url" :alt="produto.nome"></p>
      <h2>{{ produto.nome }}</h2>
      <p>Preço: R${{ produto.preco }}</p>
    </div>
  </div>
</div>
</template>
<style scoped>
.produto-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
}
.produto-detalhes {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 1vh;
}
.produto-imagem p {
  width: 400px;
  height: auto;
}
.produto-imagem img{
  width: 100%;
  height: auto;
}
.produto-info h1{
  font-size: 2rem;
  margin-top: 5vh;
  margin-bottom: 10px;
}
.produto-info .preco {
  font-size: 1.5rem;
}
.produto-info .desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1vh;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-top: 2vh;
}
</style>
<script setup>
import { onMounted, watch } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';
import appButton from '@/components/forms/appButton.vue';
import { useRouter } from 'vue-router';
import {Swiper, SwiperSlide} from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';

const modules = [Navigation];

const router = useRouter();
const store = useProdutosStore();

const props = defineProps({
  produtoId: {
    type: Number,
    required: true
  }
});

const carregarDadosProduto = async (id) => {
  await store.getProdutoById(id);

  if (store.produtoAtual && store.produtoAtual.categoria?.nome) {
    const categoriaNome = store.produtoAtual.categoria.nome;
    console.log('Categoria do produto atual:', categoriaNome);
    await store.getProdutos(1, "", "", "", categoriaNome);
  }
};

onMounted(async () => {
  await carregarDadosProduto(props.produtoId);
});

watch(
  () => props.produtoId,
  async (novoId) => {
    if (novoId) {
      await carregarDadosProduto(novoId);
    }
  }
);

function abrirProduto(produtoId){
  router.push({ name: 'Produto', params: { produtoId } });
};

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
  <div class="produtos-semelhantes">
    <Swiper
    :modules="modules"
    :slides-per-view="8"
    :space-between="5"
    :navigation="true"
    :style="{
    '--swiper-navigation-color': '#6d423b',
    '--swiper-pagination-color': '#6d423b',
    '--swiper-navigation-size': '35px'
    }"
    >
    <SwiperSlide v-for="produto in store.produtos" :key="produto.id" class="produto-item" @click="abrirProduto(produto.id)">
      <p><img :src="produto.capa?.url" :alt="produto.nome"></p>
      <h3>{{ produto.nome }}</h3>
      <p>Preço: R${{ produto.preco }}</p>
    </SwiperSlide>
    </Swiper>
  </div>
</div>
</template>
<style scoped>
.produto-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  box-sizing: border-box;
}
.produto-detalhes {
  padding: 0 20px;
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

/* 1. Dá espaçamento nas laterais do carrossel para as setinhas não ficarem em cima dos produtos */
.produtos-semelhantes :deep(.swiper) {
  padding: 0 40px 0 40px;
}

/* 2. Posiciona as setinhas exatamente nesse espaço de respiro que criamos */
.produtos-semelhantes :deep(.swiper-button-prev) {
  left: 5px;
}

.produtos-semelhantes :deep(.swiper-button-next) {
  right: 5px;
}

/* Caso o ícone continue usando o formato antigo */
.produtos-semelhantes :deep(.swiper-button-prev::after),
.produtos-semelhantes :deep(.swiper-button-next::after) {
  font-size: 20px;
  color: #6d423b !important; /* Força a cor */
}

.produtos-semelhantes {
  margin-top: 5vh;
  align-items: center;
  align-content: center;
}
.produtos-semelhantes p{
  width: 100px;
  height: auto;
}
.produtos-semelhantes img{
  width: 100%;
  height: auto;
}
.produtos-semelhantes h3{
  font-size: 0.8rem;
  margin-top: 5px;
}
.produto-item {
  display: inline-block;
  width: 200px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
  align-content: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.produto-item:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

</style>
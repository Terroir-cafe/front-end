<script setup>
import { onMounted, reactive } from 'vue'
import { useProdutosStore } from '@/stores/produtos.js';
import Loading from 'vue-loading-overlay';
import appButton from '@/components/forms/appButton.vue';

const store = useProdutosStore()

onMounted(() => {
  store.fetchProdutos()
  const produtos = reactive({ ...store.produtos })
  console.log(produtos)
})
</script>
<template>
  <main class="container">
    <div class="banner">
      <p class="imagem-container"><img src="/banner.png" :alt="store.produtos.nome" class="imagem-banner" /></p>
      <div class="banner-info">
      <h3 class="banner-titulo">
        Café Microlote
      </h3>
      <p class="banner-descricao">
        Café Microlote - 100% arábica - peso Líq. 200g
Origem: Carmo de Minas/MG
Perfil de torra: Clara
Pontuação: 88
Variedade: Bourbon Amarelo
      </p>
      <appButton variant="primary">Comprar</appButton>
      </div>
    </div>
    <div class="lista-produtos">
      <h2>Em destaque</h2>
      <div class="produtos">
        <Loading v-model:active="store.loading.value" is-full-page />
        <!-- Aqui vão os produtos em destaque -->
        <div v-for="produto in store.produtos" :key="produto.id" class="produto">
          <div class="imagem-container">
          <img :src="produto.capa.url" :alt="produto.nome" class="imagem-produto" />
          </div>
          <div class="desc-item">
          <h3>{{ produto.nome }}</h3>
            <p class="descricao">{{ produto.descricao }}</p>
            <p class="preco">R$ {{ produto.preco }}</p>
            <appButton variant="primary">Adicionar ao carrinho</appButton>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
main {
  padding-left: 1vw;
  padding-right: 1vw;
  margin-top: 4vh;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.banner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #E8B88E;
  padding: 20px;
  border-radius: 56px;
  margin-bottom: 30px;
}

.imagem-container {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.banner .imagem-banner {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 56px;
  margin: 1vw 0 1vw 0;
  align-items: center;
  align-content: center;
}

.lista-produtos {
  margin-bottom: 30px;
}

.lista-produtos h2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px;
  font-size: 24px;
  background-color: #74403e;
  border-radius: 56px;
  color: #fff;
}

.produto{
  background:#E8B88E;
  padding:20px;
  border-radius:20px;
  display:flex;
  justify-content:center;
  flex-direction:column;
  align-items:center;
}

.produtos{
  margin-top:1vw;
  display:grid;
  grid-template-columns:1fr;
  gap:30px;
}

.desc-item{
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:10px;
}

.preco{
  font-size: 18px;
  font-weight: bold;
}

.imagem-produto {
  width: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 300px;
  border-radius: 16px;
  object-fit: contain;
}


@media (min-width: 1024px) {
  main{
    max-width:1200px;
    margin:auto;
    padding:40px;
}
  .banner{
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    gap:60px;
}
.imagem-container{
    width:100%;
}

.banner-info{
  width:50%;main{
  max-width:1200px;
  margin:auto;
  padding:40px;
}
}

.banner .imagem-banner{
height:500px;
}

.produtos{
  grid-template-columns:repeat(2,1fr);
}
}
</style>

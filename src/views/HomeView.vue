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
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis non corporis veritatis incidunt ullam, esse
        deleniti accusamus, veniam iste unde mollitia blanditiis libero inventore animi aliquam perferendis molestias
        enim explicabo. 
      </p>
    </div>
    <div class="lista-produtos">
      <h2>Em destaque</h2>
      <div class="produtos">
        <Loading v-model:active="store.loading.value" is-full-page />
        <!-- Aqui vão os produtos em destaque -->
        <div v-for="produto in store.produtos" :key="produto.id" class="produto">
          <img :src="produto.capa.url" :alt="produto.nome" class="imagem-produto" />
            <h3>{{ produto.nome }}</h3>
            <p class="descricao">{{ produto.descricao }}</p>
            <p class="preco">R$ {{ produto.preco }}</p>
            <appButton variant="primary">Adicionar ao carrinho</appButton>
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
}
.produtos{
  display:grid;
  grid-template-columns:1fr;
  gap:30px;

}

.preco{
  font-size: 18px;
  font-weight: bold;
}

.imagem-produto {
  width: 100%;margin-bottom: 30px;
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
    width:50%;
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

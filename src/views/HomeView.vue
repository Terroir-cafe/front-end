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
          <ul>
            <li>
              <p class="imagem-produto"><img :src="produto.capa.url" :alt="produto.nome" class="imagem-produto" /></p>
            </li>
            <li>
              <h3>{{ produto.nome }}</h3>
            </li>
            <li>
              <p class="preco">R$ {{ produto.preco }}</p>
            </li>
            <li>
              <appButton variant="primary">Adicionar ao carrinho</appButton>
            </li>
          </ul>
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
  margin-bottom: 30px;
  justify-content: center;
  align-content: center;
  align-items: center;
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

.lista-produtos .produtos ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.preco{
  font-size: 18px;
  font-weight: bold;
}

.imagem-produto {
  width: 100%;
  height: 300px;
  border-radius: 16px;
  object-fit: contain;
}
</style>

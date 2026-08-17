<script setup>
import { onMounted, reactive } from 'vue'
import { useProdutosStore } from '@/stores/produtos.js';
import Loading from 'vue-loading-overlay';
import appButton from '@/components/forms/appButton.vue';

const store = useProdutosStore()

onMounted(() => {
  store.fetchProdutos()
  store.fetchCategorias()
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
}

/* Banner Principal */
.banner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #e8b88e;
  padding: 30px;
  border-radius: 28px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.imagem-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.banner .imagem-banner {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.banner-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}

.banner-titulo {
  font-size: 28px;
  font-weight: 700;
  color: #74403e;
  margin: 0;
}

.banner-descricao {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  white-space: pre-line;
}

/* Lista de Produtos */
.lista-produtos {
  margin-bottom: 40px;
}

.lista-produtos h2 {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  font-size: 22px;
  font-weight: 600;
  background-color: #74403e;
  border-radius: 28px;
  color: #ffffff;
  margin-bottom: 24px;
}

.produtos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.produto {
  background: #ffffff;
  border: 1px solid #e8b88e;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.produto:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(116, 64, 62, 0.12);
}

.imagem-produto {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  object-fit: contain;
}

.desc-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.desc-item h3 {
  font-size: 18px;
  color: #74403e;
  margin: 0;
}

.descricao {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preco {
  font-size: 20px;
  font-weight: 700;
  color: #74403e;
  margin: 5px 0;
}

/* Responsividade */
@media (min-width: 640px) {
  .produtos {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .banner {
    flex-direction: row;
    align-items: center;
  }

  .imagem-container {
    width: 50%;
  }

  .banner-info {
    width: 50%;
  }

  .banner .imagem-banner {
    height: 400px;
  }

  .produtos {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
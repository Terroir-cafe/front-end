<script setup>
import { onMounted } from 'vue'
import { mdiArrowRight } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import ProductCard from '@/components/cards/productCard.vue'
import { useProdutosStore } from '@/stores/produtos'

const store = useProdutosStore()
onMounted(() => store.getProdutos())
</script>

<template>
  <div class="site-container home">
    <section class="banner" aria-labelledby="banner-titulo">
      <img src="/banner.png" alt="Lata de Café Microlote ao lado de grãos torrados" width="1080" height="1080" fetchpriority="high" />
      <div class="banner-info">
        <h1 id="banner-titulo">Café Microlote</h1>
        <p>Café 100% arábica, com torra clara.</p>
        <RouterLink to="/pesquisa" class="botao">
          Explorar cafés
          <SvgIcon type="mdi" :path="mdiArrowRight" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>

    <section class="destaques" aria-labelledby="titulo-destaques">
      <div class="titulo-faixa destaques-cabecalho">
        <h2 id="titulo-destaques">Em destaque</h2>
        <RouterLink to="/pesquisa">Ver catálogo <SvgIcon type="mdi" :path="mdiArrowRight" aria-hidden="true" /></RouterLink>
      </div>
      <p v-if="store.loading" role="status">Carregando cafés…</p>
      <p v-else-if="store.error" role="alert">{{ store.error }}</p>
      <p v-else-if="!store.produtos.length">Nenhum café disponível no momento.</p>
      <div v-else class="produtos-grid">
        <ProductCard v-for="produto in store.produtos" :key="produto.id" :produto="produto" mostrar-descricao />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  padding-block: 28px 52px;
}
.banner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(22px, 4vw, 46px);
  padding: clamp(18px, 3vw, 32px);
  border-radius: var(--radius-panel);
  background: var(--caramelo);
  box-shadow: var(--shadow);
}
.banner-info {
  display: grid;
  justify-items: start;
  gap: 14px;
}
.banner h1 {
  font-size: clamp(1.85rem, 4.5vw, 2.8rem);
}
.banner p {
  font-size: clamp(.95rem, 1.5vw, 1.1rem);
}
.banner img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 4;
  object-fit: cover;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
}
.destaques {
  margin-top: clamp(28px, 5vw, 44px);
}
.destaques-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-bottom: 20px;
}
.destaques h2 {
  font-size: inherit;
}
.destaques-cabecalho a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: inherit;
  font-size: .875rem;
  font-weight: 600;
}
.destaques-cabecalho svg,
.banner svg {
  width: 18px;
  height: 18px;
}
.produtos-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 850px) {
  .produtos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 590px) {
  .banner {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 500px) {
  .produtos-grid {
    grid-template-columns: 1fr;
  }
}
</style>

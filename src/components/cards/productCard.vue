<script setup>
import { mdiCoffeeOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { useCarrinhoStore } from '@/stores/carrinho'

defineProps({ produto: { type: Object, required: true }, mostrarDescricao: Boolean })
const carrinho = useCarrinhoStore()
const moeda = new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' })
</script>

<template>
  <article class="produto-card">
    <RouterLink class="produto-link" :to="{ name: 'Produto', params: { produtoId: produto.id } }">
      <div class="produto-foto">
        <img v-if="produto.capa?.url" :src="produto.capa.url" alt="" loading="lazy" />
        <SvgIcon v-else type="mdi" :path="mdiCoffeeOutline" aria-hidden="true" />
      </div>
      <div class="produto-conteudo">
        <h3>{{ produto.nome }}</h3>
        <p v-if="mostrarDescricao && produto.descricao" class="produto-descricao">{{ produto.descricao }}</p>
        <strong>{{ moeda.format(produto.preco) }}</strong>
      </div>
    </RouterLink>
    <button type="button" class="botao" :disabled="carrinho.salvando || !produto.quantidade"
      @click="carrinho.adicionar(produto)">
      {{ produto.quantidade ? 'Adicionar ao carrinho' : 'Indisponível' }}
    </button>
  </article>
</template>

<style scoped>
.produto-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.produto-card:hover {
  border-color: var(--caramelo);
  box-shadow: 0 8px 22px #74403e26;
}
.produto-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: inherit;
  text-decoration: none;
}
.produto-foto {
  display: grid;
  place-items: center;
  aspect-ratio: 5 / 4;
  padding: 14px;
  background: #fff;
  color: var(--brand);
}
.produto-foto img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
}
.produto-conteudo {
  flex: 1;
  padding: 6px 16px 16px;
  text-align: center;
}
.produto-conteudo h3 {
  font-size: 1rem;
  line-height: 1.35;
  margin-bottom: 8px;
  color: var(--brand);
}
.produto-conteudo strong {
  color: var(--brand);
  font-size: 1.2rem;
}
.produto-descricao {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 8px;
  font-size: .875rem;
  color: var(--muted);
}
.produto-card button {
  margin: 0 16px 16px;
}
</style>

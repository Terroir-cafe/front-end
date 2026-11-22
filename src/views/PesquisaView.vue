<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProdutosStore } from '@/stores/produtos';
import ProductCard from '@/components/cards/productCard.vue';

const route = useRoute();
const store = useProdutosStore();
const categoria = ref('');
const marca = ref('');
const ordenacao = ref('');

async function pesquisar() {
    await store.getProdutos(
        1,
        route.query.search || '',
        ordenacao.value,
        marca.value,
        categoria.value
    );
}

watch(
    () => route.query.search,
    () => {
        marca.value = '';
        categoria.value = '';
        ordenacao.value = '';
        pesquisar();
    },
    { immediate: true }
);

function limparFiltros() {
    marca.value = '';
    categoria.value = '';
    ordenacao.value = '';
    pesquisar();
}

</script>
<template>
  <div class="site-container pagina-pesquisa">
    <div class="cabecalho-pesquisa">
      <h1>{{ route.query.search ? 'Resultados da busca' : 'Catálogo de cafés' }}</h1>
      <p v-if="route.query.search">
        Resultados para:
        <strong>{{ route.query.search }}</strong>
      </p>
    </div>
    <div class="conteudo">
      <aside class="filtros">
        <h2>Filtrar</h2>
        <div class="filtro">
          <label for="marca">Marca</label>
          <select id="marca" v-model="marca">
            <option value="">Todas as marcas</option>
            <option v-for="opcao in store.marcas" :key="opcao.id" :value="opcao.nome">
              {{ opcao.nome }}
            </option>
          </select>
        </div>
        <div class="filtro">
          <label for="categoria">Categoria</label>
          <select id="categoria" v-model="categoria">
            <option value="">Todas as categorias</option>
            <option v-for="opcao in store.categorias" :key="opcao.id" :value="opcao.nome">
              {{ opcao.nome }}
            </option>
          </select>
        </div>
        <div class="filtro">
          <label for="ordenacao"> Ordenar por </label>
          <select id="ordenacao" v-model="ordenacao">
            <option value="">Padrão</option>
            <option value="preco">Menor preço</option>
            <option value="-preco">Maior preço</option>
            <option value="quantidade">Menor quantidade</option>
            <option value="-quantidade">Maior quantidade</option>
          </select>
        </div>
        <button class="btn-filtrar" @click="pesquisar">Aplicar filtros</button>
        <button class="btn-limpar" @click="limparFiltros">Limpar filtros</button>
      </aside>
      <section class="resultados">
        <div v-if="store.loading" class="mensagem" role="status">Carregando produtos...</div>
        <div v-else-if="store.error" class="mensagem erro" role="alert">
          {{ store.error }}
        </div>
        <div v-else-if="store.produtos.length === 0" class="mensagem">
          Nenhum produto encontrado.
        </div>
        <div v-else class="produtos-grid">
          <ProductCard v-for="produto in store.produtos" :key="produto.id" :produto="produto" />
        </div>
      </section>
    </div>
  </div>
</template>
<style scoped>
.pagina-pesquisa {
  width: 100%;
  margin: 0 auto;
  padding-block: 38px 64px;
  box-sizing: border-box;
}

.cabecalho-pesquisa {
  margin-bottom: 30px;
}

.cabecalho-pesquisa h1 {
  margin: 0 0 8px;
  color: var(--brand);
}

.cabecalho-pesquisa p {
  margin: 0;
  color: var(--muted);
}

.conteudo {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 30px;
}

/* Painel de Filtros */
.filtros {
  border: 1px solid var(--line);
  padding: 24px;
  background: var(--caramelo);
  border-radius: var(--radius-card);
  height: fit-content;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.filtros h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--brand);
  font-size: 20px;
}

.filtro {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.filtro label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.filtro input,
.filtro select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid rgba(116, 64, 62, 0.2);
  border-radius: 10px;
  background: var(--surface);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.filtro input:focus,
.filtro select:focus {
  border-color: var(--brand);
}

.btn-filtrar,
.btn-limpar {
  width: 100%;
  height: 42px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-filtrar {
  border: none;
  background: var(--brand);
  color: var(--surface);
  margin-bottom: 10px;
}

.btn-filtrar:hover {
  background: var(--brand-hover);
}

.btn-limpar {
  border: 1px solid var(--brand);
  background: transparent;
  color: var(--brand);
}

.btn-limpar:hover {
  background: rgba(116, 64, 62, 0.1);
}

/* Grid de Resultados */
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.mensagem {
  padding: 60px;
  text-align: center;
  color: var(--muted);
  font-size: 16px;
}

.erro {
  color: #b00020;
}

/* Responsividade */
@media (max-width: 900px) {
  .conteudo {
    grid-template-columns: 1fr;
  }

  .produtos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 550px) {
  .produtos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProdutosStore } from '@/stores/produtos';

const route = useRoute();
const store = useProdutosStore();
const categoria = ref('');
const marca = ref('');
const ordenacao = ref('');

async function pesquisar() {
    await store.fetchProdutos(
        1,
        route.query.search || '',
        ordenacao.value,
        marca.value,
        categoria.value
    );
}

onMounted(async () => {
    await store.fetchCategorias();
    await store.fetchMarcas();
});

watch(
    [marca, categoria, ordenacao],
    () => {
        pesquisar();
    }
);

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

async function limparFiltros() {
    marca.value = '';
    categoria.value = '';
    ordenacao.value = '';
}
</script>

<template>
  <main class="pagina-pesquisa">
    <div class="cabecalho-pesquisa">
      <h1>Resultados da pesquisa</h1>

      <p v-if="route.query.search">
        Resultados para:
        <strong>"{{ route.query.search }}"</strong>
      </p>
    </div>

    <div class="conteudo">
      <aside class="filtros">
        <h2>Filtrar</h2>

        <div class="filtro">
          <label for="marca"> Marca </label>

          <select id="marca" v-model="marca">
        <option value="">
            Todas as marcas
        </option>

        <option
            v-for="marca in store.marcas"
            :key="marca.id"
            :value="marca.nome"
        >
            {{ marca.nome }}
        </option>
    </select>
        </div>

        <div class="filtro">
          <div class="filtro">
            <label for="categoria"> Categoria </label>

            <select id="categoria" v-model="categoria">
              <option value="">Todas as categorias</option>

              <option v-for="categoria in store.categorias" :key="categoria.id" :value="categoria.nome">
                {{ categoria.nome }}
              </option>
            </select>
          </div>
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
        <div v-if="store.loading" class="mensagem">Carregando produtos...</div>

        <div v-else-if="store.error" class="mensagem erro">
          {{ store.error }}
        </div>

        <div v-else-if="store.produtos.length === 0" class="mensagem">
          Nenhum produto encontrado.
        </div>

        <div v-else class="produtos-grid">
          <article v-for="produto in store.produtos" :key="produto.id" class="produto-card">
            <router-link :to="`/produto/${produto.id}`">
              <div class="produto-imagem">
                <img :src="produto?.capa?.url" :alt="produto.nome" />
              </div>

              <div class="produto-info">
                <h3>
                  {{ produto.nome }}
                </h3>

                <p v-if="produto.marca?.nome">
                  {{ produto.marca.nome }}
                </p>

                <strong>
                  R$
                  {{ Number(produto.preco).toFixed(2) }}
                </strong>
              </div>
            </router-link>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.pagina-pesquisa {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
}

.cabecalho-pesquisa {
  margin-bottom: 30px;
}

.cabecalho-pesquisa h1 {
  margin: 0 0 8px;
  color: #74403e;
  font-size: 28px;
}

.cabecalho-pesquisa p {
  margin: 0;
  color: #666;
}

.conteudo {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 30px;
}

/* Painel de Filtros */
.filtros {
  padding: 24px;
  background: #e8b88e;
  border-radius: 20px;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.filtros h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #74403e;
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
  background: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.filtro input:focus,
.filtro select:focus {
  border-color: #74403e;
}

.btn-filtrar,
.btn-limpar {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-filtrar {
  border: none;
  background: #74403e;
  color: #ffffff;
  margin-bottom: 10px;
}

.btn-filtrar:hover {
  background: #5b3231;
}

.btn-limpar {
  border: 1px solid #74403e;
  background: transparent;
  color: #74403e;
}

.btn-limpar:hover {
  background: rgba(116, 64, 62, 0.1);
}

/* Grid de Resultados */
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.produto-card {
  border: 1px solid #e8b88e;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.produto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(116, 64, 62, 0.12);
}

.produto-card a {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.produto-imagem {
  width: 100%;
  height: 220px;
  padding: 15px;
  box-sizing: border-box;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.produto-imagem img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.produto-info {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  flex-grow: 1;
}

.produto-info h3 {
  margin: 0;
  font-size: 18px;
  color: #74403e;
}

.produto-info p {
  margin: 0;
  font-size: 13px;
  color: #777;
}

.produto-info strong {
  color: #74403e;
  font-size: 20px;
  margin-top: auto;
  padding-top: 8px;
}

.mensagem {
  padding: 60px;
  text-align: center;
  color: #666;
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .produtos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
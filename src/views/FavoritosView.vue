<script setup>
import PrecoProduto from '@/components/cards/PrecoProduto.vue'
import { ref } from 'vue'
import ListaDaConta from '@/components/conta/ListaDaConta.vue'
import { listarFavoritos, salvarFavorito } from '@/api/contaApi'

const removendo = ref(null)
const erro = ref('')

async function desfavoritar(id, atualizarLista) {
  removendo.value = id
  erro.value = ''
  try {
    await salvarFavorito(id, false)
    atualizarLista(id)
  } catch {
    erro.value = 'Não foi possível remover o favorito. Tente novamente.'
  } finally {
    removendo.value = null
  }
}
</script>

<template>
  <section class="conta-pagina">
    <RouterLink to="/usuario">Meu perfil</RouterLink>
    <h1>Produtos favoritos</h1>
    <p v-if="erro" role="alert">{{ erro }}</p>
    <ListaDaConta :carregar="listarFavoritos" vazio="Você ainda não tem produtos favoritos.">
      <template #default="{ itens, remover }">
        <ul class="conta-lista">
          <li v-for="produto in itens" :key="produto.id" class="conta-card conta-linha">
            <RouterLink class="favorito-produto" :to="{ name: 'Produto', params: { produtoId: produto.id } }">
              <img v-if="produto.capa?.url" :src="produto.capa.url" alt="" />
              <div>
                <h2>{{ produto.nome }}</h2>
                <PrecoProduto :preco="produto.preco" :anterior="produto.preco_anterior" />
              </div>
            </RouterLink>
            <button type="button" class="conta-button" :disabled="removendo !== null" @click="desfavoritar(produto.id, remover)">
              Remover dos favoritos
            </button>
          </li>
        </ul>
      </template>
    </ListaDaConta>
    <RouterLink to="/pesquisa">Explorar produtos</RouterLink>
  </section>
</template>

<style scoped>
.favorito-produto {
  display: flex;
  align-items: center;
  gap: 16px;
}
.favorito-produto img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 8px;
}
</style>

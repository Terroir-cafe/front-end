<script setup>
import { ref } from 'vue'
import AlertasNoDispositivo from '@/components/conta/AlertasNoDispositivo.vue'
import ListaDaConta from '@/components/conta/ListaDaConta.vue'
import { lerNotificacao, listarNotificacoes } from '@/api/contaApi'
import { useNotificacoesStore } from '@/stores/notificacoes'

const notificacoes = useNotificacoesStore()
const pendentes = ref(new Set())
const erro = ref('')
const data = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const titulos = {
  compra: 'Status da compra',
  carrinho: 'Carrinho',
  preco: 'Mudança de preço',
}

async function marcarComoLida(item) {
  erro.value = ''
  pendentes.value.add(item.id)
  try {
    const atualizada = await lerNotificacao(item.id)
    item.lida_em = atualizada.lida_em
    notificacoes.atualizar()
  } catch {
    erro.value = 'Não foi possível marcar a notificação como lida. Tente novamente.'
  } finally {
    pendentes.value.delete(item.id)
  }
}
</script>

<template>
  <section class="conta-pagina">
    <RouterLink to="/usuario">Meu perfil</RouterLink>
    <h1>Notificações</h1>
    <AlertasNoDispositivo />
    <p v-if="erro" role="alert">{{ erro }}</p>
    <ListaDaConta :carregar="listarNotificacoes" vazio="Você ainda não tem notificações.">
      <template #default="{ itens }">
        <ul class="conta-lista">
          <li v-for="item in itens" :key="item.id" class="conta-card" :class="{ 'nao-lida': !item.lida_em }">
            <div class="conta-linha">
              <h2>{{ titulos[item.tipo] }}</h2>
              <time :datetime="item.criada_em">{{ data.format(new Date(item.criada_em)) }}</time>
            </div>
            <p>{{ item.mensagem }}</p>
            <div class="conta-linha">
              <RouterLink v-if="item.tipo === 'compra'" to="/usuario#historico-compras">Ver histórico de compras</RouterLink>
              <RouterLink v-else-if="item.tipo === 'carrinho'" to="/cart">Ver carrinho</RouterLink>
              <RouterLink v-else-if="item.produto" :to="{ name: 'Produto', params: { produtoId: item.produto } }">
                Ver produto
              </RouterLink>
              <button v-if="!item.lida_em" type="button" class="conta-button" :disabled="pendentes.has(item.id)" @click="marcarComoLida(item)">
                Marcar como lida
              </button>
            </div>
          </li>
        </ul>
      </template>
    </ListaDaConta>
  </section>
</template>

<style scoped>
.nao-lida {
  border-inline-start: 4px solid var(--brand);
  background: var(--surface-accent);
}
</style>

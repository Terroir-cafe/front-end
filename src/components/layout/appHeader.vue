<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiAccountCircleOutline, mdiBellOutline, mdiCartOutline, mdiHeartOutline, mdiMagnify } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { getProdutosApi } from '@/api/produtosApi'
import { useAuthStore } from '@/stores/auth'
import { useCarrinhoStore } from '@/stores/carrinho'
import { useNotificacoesStore } from '@/stores/notificacoes'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const carrinho = useCarrinhoStore()
const notificacoes = useNotificacoesStore()
const busca = ref('')
const resultados = ref([])
const buscaAberta = ref(false)
let consultaNotificacoes

watch(() => route.fullPath, () => {
  busca.value = typeof route.query.search === 'string' ? route.query.search : ''
  buscaAberta.value = false
}, { immediate: true })

watch(busca, (texto, _anterior, cancelar) => {
  resultados.value = []
  if (!texto.trim() || !buscaAberta.value) return
  let atual = true
  const timer = setTimeout(async () => {
    try {
      const dados = await getProdutosApi(1, texto.trim())
      if (atual) resultados.value = (dados.results ?? []).slice(0, 5)
    } catch {
      if (atual) resultados.value = []
    }
  }, 300)
  cancelar(() => { atual = false; clearTimeout(timer) })
})

function pesquisar() {
  const search = busca.value.trim()
  buscaAberta.value = false
  router.push({ path: '/pesquisa', query: search ? { search } : {} })
}

onMounted(() => {
  consultaNotificacoes = setInterval(notificacoes.atualizar, 60000)
})
onUnmounted(() => clearInterval(consultaNotificacoes))
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="marca" to="/">
        <img src="/Logo.png" alt="Terroir Café" width="620" height="130" />
      </RouterLink>
      <nav class="header-paginas" aria-label="Loja">
        <RouterLink to="/pesquisa">Cafés</RouterLink>
        <RouterLink to="/sobre">Sobre nós</RouterLink>
      </nav>

      <form class="header-busca" role="search" @submit.prevent="pesquisar"
        @focusout="buscaAberta = $event.currentTarget.contains($event.relatedTarget)"
        @keydown.esc="buscaAberta = false">
        <input v-model="busca" type="search" placeholder="Buscar cafés..." aria-label="Buscar cafés"
          @focus="buscaAberta = true" @input="buscaAberta = true" />
        <button type="submit" aria-label="Pesquisar"><SvgIcon type="mdi" :path="mdiMagnify" /></button>
        <ul v-if="buscaAberta && resultados.length" class="resultados-busca">
          <li v-for="produto in resultados" :key="produto.id">
            <RouterLink :to="{ name: 'Produto', params: { produtoId: produto.id } }" @click="buscaAberta = false">
              <img v-if="produto.capa?.url" :src="produto.capa.url" alt="" />
              {{ produto.nome }}
            </RouterLink>
          </li>
        </ul>
      </form>

      <nav class="header-acoes" aria-label="Conta e carrinho">
        <RouterLink v-if="auth.isAuthenticated" to="/favoritos" aria-label="Produtos favoritos" title="Favoritos">
          <SvgIcon type="mdi" :path="mdiHeartOutline" />
        </RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/notificacoes" title="Notificações"
          :aria-label="`Notificações, ${notificacoes.naoLidas} não lidas`">
          <SvgIcon type="mdi" :path="mdiBellOutline" />
          <span v-if="notificacoes.naoLidas" class="indicador" aria-hidden="true">{{ Math.min(notificacoes.naoLidas, 99) }}{{ notificacoes.naoLidas > 99 ? '+' : '' }}</span>
        </RouterLink>
        <RouterLink :to="auth.isAuthenticated ? '/usuario' : '/login'" :aria-label="auth.isAuthenticated ? 'Meu perfil' : 'Entrar'" title="Minha conta">
          <SvgIcon type="mdi" :path="mdiAccountCircleOutline" />
        </RouterLink>
        <RouterLink to="/cart" title="Carrinho" :aria-label="`Carrinho, ${carrinho.quantidadeTotal} itens`">
          <SvgIcon type="mdi" :path="mdiCartOutline" />
          <span v-if="carrinho.quantidadeTotal" class="indicador" aria-hidden="true">{{ carrinho.quantidadeTotal }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--header);
  color: var(--surface);
  border-radius: 0 0 var(--radius-panel) var(--radius-panel);
}
.header-inner {
  width: min(100%, var(--site-width));
  min-height: 80px;
  margin-inline: auto;
  padding: 12px var(--gutter);
  display: grid;
  grid-template-columns: auto auto minmax(140px, 1fr) auto;
  align-items: center;
  gap: clamp(14px, 3vw, 40px);
}
.marca img {
  display: block;
  width: clamp(112px, 17vw, 204px);
  height: auto;
}
.header-paginas,
.header-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-paginas {
  gap: clamp(12px, 2vw, 24px);
  white-space: nowrap;
}
.header-paginas a,
.header-acoes a {
  color: inherit;
  text-decoration: none;
}
.header-paginas a:hover,
.header-paginas .router-link-active {
  color: var(--caramelo);
}
.header-acoes a,
.header-busca button {
  display: grid;
  min-width: 40px;
  min-height: 42px;
  place-items: center;
  position: relative;
  border-radius: var(--radius-control);
}
.header-acoes a:hover,
.header-acoes .router-link-active {
  background: #ffffff25;
}
.indicador {
  position: absolute;
  top: 1px;
  right: -2px;
  min-width: 17px;
  text-align: center;
  padding: 0 3px;
  border-radius: 20px;
  background: var(--caramelo);
  color: #442d29;
  font-size: .67rem;
  font-weight: 800;
}
.header-busca {
  display: flex;
  position: relative;
  background: var(--surface);
  border: 2px solid var(--line);
  border-radius: 999px;
  color: var(--brand);
}
.header-busca input {
  min-width: 0;
  flex: 1;
  padding: 0 15px;
  border: 0;
  background: transparent;
  color: inherit;
}
.header-busca input::placeholder {
  color: var(--muted);
}
.header-busca button {
  cursor: pointer;
  border: 0;
  background: transparent;
  color: inherit;
}
.resultados-busca {
  position: absolute;
  z-index: 30;
  inset: calc(100% + 6px) 0 auto;
  padding: 6px;
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  box-shadow: var(--shadow);
  list-style: none;
}
.resultados-busca a {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 6px;
  text-decoration: none;
}
.resultados-busca a:hover {
  background: var(--surface-accent);
}
.resultados-busca img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}
@media (max-width: 780px) {
  .header-inner {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
  }
  .header-paginas {
    display: none;
  }
  .header-busca {
    grid-row: 2;
    grid-column: 1 / -1;
  }
  .header-acoes {
    gap: 3px;
  }
  .header-acoes a {
    min-width: 36px;
  }
}
@media (max-width: 600px) {
  .header-inner {
    grid-template-columns: minmax(0, 1fr);
  }
  .marca {
    justify-self: center;
  }
  .header-acoes {
    display: none;
  }
}
</style>

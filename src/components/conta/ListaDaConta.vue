<script setup>
import { onMounted, ref, watch } from 'vue'
import { versao } from '@/offline/sincronizacao'

const props = defineProps({
  carregar: { type: Function, required: true },
  vazio: { type: String, required: true },
})

const itens = ref([])
const pagina = ref(1)
const totalPaginas = ref(1)
const carregando = ref(true)
const erro = ref(false)
let leitura = 0

async function abrir(destino = pagina.value) {
  const pedido = ++leitura
  carregando.value = true
  erro.value = false
  try {
    const dados = await props.carregar(destino)
    if (pedido !== leitura) return
    itens.value = dados.results
    pagina.value = dados.page
    totalPaginas.value = dados.total_pages
  } catch {
    if (pedido === leitura) erro.value = true
  } finally {
    if (pedido === leitura) carregando.value = false
  }
}

function remover(id) {
  const restantes = itens.value.filter((item) => item.id !== id)
  abrir(restantes.length ? pagina.value : Math.max(1, pagina.value - 1))
}

onMounted(() => abrir())
watch(versao, () => abrir())
</script>

<template>
  <p v-if="carregando" role="status">Carregando…</p>
  <div v-else-if="erro">
    <p role="alert">Não foi possível carregar esta lista.</p>
    <button type="button" class="conta-button" @click="abrir()">Tentar novamente</button>
  </div>
  <p v-else-if="!itens.length">{{ vazio }}</p>
  <template v-else>
    <slot :itens="itens" :remover="remover" />
    <nav v-if="totalPaginas > 1" class="conta-paginacao" aria-label="Paginação">
      <button type="button" class="conta-button" :disabled="pagina === 1" @click="abrir(pagina - 1)">Anterior</button>
      <span>{{ pagina }} de {{ totalPaginas }}</span>
      <button type="button" class="conta-button" :disabled="pagina === totalPaginas" @click="abrir(pagina + 1)">Próxima</button>
    </nav>
  </template>
</template>

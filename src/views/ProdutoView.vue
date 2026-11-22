<script setup>
import PrecoProduto from '@/components/cards/PrecoProduto.vue'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { mdiHeart, mdiHeartOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from '@/components/cards/productCard.vue'
import { salvarFavorito } from '@/api/contaApi'
import { getProdutoByIdApi, getProdutosApi } from '@/api/produtosApi'
import { useAuthStore } from '@/stores/auth'
import { useCarrinhoStore } from '@/stores/carrinho'
import { pendencias } from '@/offline/sincronizacao'

const props = defineProps({ produtoId: { type: Number, required: true } })
const router = useRouter()
const auth = useAuthStore()
const carrinho = useCarrinhoStore()
const produto = ref(null)
const relacionados = ref([])
const carregando = ref(true)
const erro = ref('')
const carregandoFavoritos = ref(false)
const salvandoFavorito = ref(false)
const erroFavorito = ref('')
const modulosCarrossel = [Navigation, A11y]
const colunasCarrossel = { 520: { slidesPerView: 2 }, 820: { slidesPerView: 3 }, 1100: { slidesPerView: 4 } }

const favoritado = computed(() => auth.user?.favoritos.some((item) => item.id === props.produtoId)
  ?? pendencias.value.findLast((op) => op.tipo === 'favorito' && op.produto === props.produtoId)?.favorito
  ?? false)

watch(() => props.produtoId, async (id, _anterior, cancelar) => {
  let atual = true
  cancelar(() => { atual = false })
  produto.value = null
  relacionados.value = []
  carregando.value = true
  erro.value = ''
  erroFavorito.value = ''
  try {
    const dados = await getProdutoByIdApi(id)
    if (!atual) return
    produto.value = dados
  } catch {
    if (atual) erro.value = 'Não foi possível carregar este café.'
  } finally {
    if (atual) carregando.value = false
  }

  if (!atual || !produto.value?.categoria?.nome) return
  try {
    const dados = await getProdutosApi(1, '', '', '', produto.value.categoria.nome)
    if (atual) relacionados.value = dados.results.filter((item) => item.id !== id)
  } catch {
    // O produto continua disponível se a consulta dos relacionados falhar.
  }
}, { immediate: true })

async function carregarFavoritos() {
  if (!auth.isAuthenticated) return
  carregandoFavoritos.value = true
  erroFavorito.value = ''
  try {
    await auth.getUser()
  } catch {
    erroFavorito.value = 'Não foi possível consultar seus favoritos.'
  } finally {
    carregandoFavoritos.value = false
  }
}

watch(() => auth.isAuthenticated, carregarFavoritos, { immediate: true })

async function alternarFavorito() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  const selecionado = produto.value
  if (!selecionado) return
  const adicionar = !favoritado.value
  salvandoFavorito.value = true
  erroFavorito.value = ''
  try {
    await salvarFavorito(selecionado.id, adicionar, selecionado)
  } catch {
    erroFavorito.value = 'Não foi possível atualizar seus favoritos. Tente novamente.'
  } finally {
    salvandoFavorito.value = false
  }
}
</script>

<template>
  <div class="site-container detalhe">
    <RouterLink to="/pesquisa" class="voltar">Voltar ao catálogo</RouterLink>
    <p v-if="carregando" role="status">Carregando café…</p>
    <p v-else-if="erro" role="alert">{{ erro }}</p>
    <template v-else-if="produto">
      <section class="detalhe-painel" :class="{ 'sem-foto': !produto.capa?.url }">
        <div v-if="produto.capa?.url" class="detalhe-foto">
          <img :src="produto.capa.url" :alt="produto.nome" />
        </div>
        <div class="detalhe-info">
          <p v-if="produto.marca?.nome" class="detalhe-marca">{{ produto.marca.nome }}</p>
          <h1>{{ produto.nome }}</h1>
          <PrecoProduto class="detalhe-preco" :preco="produto.preco" :anterior="produto.preco_anterior" />
          <p class="detalhe-descricao">{{ produto.descricao }}</p>
          <div class="detalhe-acoes">
            <button type="button" class="botao" :disabled="carrinho.salvando || !produto.quantidade"
              @click="carrinho.adicionar(produto)">
              {{ produto.quantidade ? 'Adicionar ao carrinho' : 'Indisponível' }}
            </button>
            <button type="button" class="botao botao-secundario" :aria-pressed="favoritado"
              :disabled="carregandoFavoritos || salvandoFavorito" @click="alternarFavorito">
              <SvgIcon type="mdi" :path="favoritado ? mdiHeart : mdiHeartOutline" aria-hidden="true" />
              {{ favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos' }}
            </button>
          </div>
          <p v-if="erroFavorito" role="alert">{{ erroFavorito }}</p>
        </div>
      </section>
      <section v-if="relacionados.length" class="relacionados" aria-labelledby="tit-relacionados">
        <h2 id="tit-relacionados" class="titulo-faixa">Cafés da mesma categoria</h2>
        <Swiper
          :modules="modulosCarrossel"
          :slides-per-view="1"
          :space-between="16"
          :breakpoints="colunasCarrossel"
          :a11y="{ prevSlideMessage: 'Café anterior', nextSlideMessage: 'Próximo café' }"
          navigation
        >
          <SwiperSlide v-for="item in relacionados" :key="item.id">
            <ProductCard :produto="item" />
          </SwiperSlide>
        </Swiper>
      </section>
    </template>
  </div>
</template>

<style scoped>
.detalhe {
  padding-block: 30px 64px;
}
.voltar {
  display: inline-block;
  margin-bottom: 18px;
}
.detalhe-painel {
  display: grid;
  grid-template-columns: minmax(0, .95fr) minmax(0, 1fr);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  overflow: hidden;
  background: var(--surface);
}
.detalhe-painel.sem-foto {
  grid-template-columns: 1fr;
}
.detalhe-foto {
  display: grid;
  min-height: 280px;
  place-items: center;
  background: var(--surface-accent);
}
.detalhe-foto img {
  width: 100%;
  height: 100%;
  max-height: 520px;
  padding: 20px;
  object-fit: contain;
}
.detalhe-info {
  display: grid;
  align-content: center;
  gap: 16px;
  padding: clamp(20px, 4vw, 54px);
}
.detalhe-marca,
.detalhe-descricao {
  color: var(--muted);
}
.detalhe-descricao {
  white-space: pre-line;
}
.detalhe-preco {
  font-size: 1.45rem;
  color: var(--brand);
}
.detalhe-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.detalhe-acoes svg {
  width: 18px;
  height: 18px;
}
.relacionados {
  margin-top: 40px;
}
.relacionados h2 {
  margin-bottom: 18px;
}
.relacionados :deep(.swiper) {
  padding: 3px 3px 12px;
  --swiper-navigation-color: var(--brand);
  --swiper-navigation-size: 23px;
}
.relacionados :deep(.swiper-wrapper) {
  align-items: stretch;
}
.relacionados :deep(.swiper-slide) {
  height: auto;
  display: flex;
}
.relacionados :deep(.produto-card) {
  width: 100%;
}
.relacionados :deep(.swiper-button-next),
.relacionados :deep(.swiper-button-prev) {
  width: 36px;
  height: 36px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
}
@media (max-width: 760px) {
  .detalhe-painel {
    grid-template-columns: 1fr;
  }
  .detalhe-foto img {
    max-height: 360px;
  }
}
</style>

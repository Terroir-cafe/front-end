<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCarrinhoStore } from '@/stores/carrinho.js';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const carrinho = useCarrinhoStore();
const authStore = useAuthStore();

// sempre que a tela abre, busca o carrinho atualizado no back-end
onMounted(() => carrinho.carregar());

const formatarPreco = (valor) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
}).format(valor);

const compraFinalizada = ref(false);

async function finalizarCompra() {
    compraFinalizada.value = await carrinho.finalizar();
}
</script>

<template>
  <div class="pagina-carrinho">
    <div class="carrinho-cabecalho">
      <div>
        <h1>Seu carrinho</h1>
      </div>
      <span class="contador">{{ carrinho.quantidadeTotal }} {{ carrinho.quantidadeTotal === 1 ? 'item' : 'itens' }}</span>
    </div>

    <section v-if="compraFinalizada" class="carrinho-vazio">
      <h2>Compra finalizada!</h2>
      <p>Obrigado por escolher a Terroir Café.</p>
      <button class="botao-finalizar" type="button" @click="router.push('/pesquisa')">Continuar comprando</button>
    </section>

    <div v-else-if="carrinho.itens.length" class="carrinho-layout">
      <section class="lista-itens" aria-label="Produtos no carrinho">
        <article v-for="item in carrinho.itens" :key="item.id" class="item-carrinho">
          <div class="item-imagem">
            <img v-if="item.imagem" :src="item.imagem" :alt="item.nome" />
            <span v-else aria-hidden="true">TC</span>
          </div>

          <div class="item-detalhes">
            <h2>{{ item.nome }}</h2>
            <p class="item-preco">{{ formatarPreco(item.preco) }}</p>
            <div class="controle-quantidade" :aria-label="`Quantidade de ${item.nome}`">
              <button type="button" :disabled="carrinho.salvando" :aria-label="`Diminuir quantidade de ${item.nome}`" @click="carrinho.atualizarQuantidade(item.id, item.quantidade - 1)">−</button>
              <span>{{ item.quantidade }}</span>
              <button type="button" :disabled="carrinho.salvando || item.quantidade >= item.estoque" :aria-label="`Aumentar quantidade de ${item.nome}`" @click="carrinho.atualizarQuantidade(item.id, item.quantidade + 1)">+</button>
            </div>
          </div>

          <div class="item-final">
            <strong>{{ formatarPreco(item.preco * item.quantidade) }}</strong>
            <button class="remover-item" type="button" :disabled="carrinho.salvando" :aria-label="`Remover ${item.nome} do carrinho`" @click="carrinho.remover(item.id)">Remover</button>
          </div>
        </article>
      </section>

      <aside class="resumo-pedido" aria-label="Resumo do pedido">
        <h2>Resumo do pedido</h2>
        <div class="linha-resumo">
          <span>Subtotal</span>
          <strong>{{ formatarPreco(carrinho.subtotal) }}</strong>
        </div>
        <div class="linha-resumo total">
          <span>Total</span>
          <strong>{{ formatarPreco(carrinho.subtotal) }}</strong>
        </div>

        <button class="botao-finalizar" type="button" :disabled="carrinho.salvando || carrinho.pendente || !carrinho.conectado" @click="finalizarCompra">
          {{ carrinho.salvando ? 'Processando...' : 'Finalizar compra' }}
        </button>
        <p v-if="!carrinho.conectado" class="aviso-finalizacao">Conecte-se para finalizar a compra.</p>
        <p v-else-if="carrinho.pendente" class="aviso-finalizacao">Aguardando a sincronização do carrinho.</p>
        <button class="botao-continuar" type="button" @click="router.push('/pesquisa')">Continuar comprando</button>
      </aside>
    </div>

    <section v-else-if="carrinho.carregando" class="carrinho-vazio">
      <p>Carregando seu carrinho…</p>
    </section>

    <section v-else-if="!authStore.isAuthenticated" class="carrinho-vazio">
      <h2>Entre na sua conta</h2>
      <p>Faça login para ver e montar o seu carrinho.</p>
      <button class="botao-finalizar" type="button" @click="router.push('/login')">Fazer login</button>
    </section>

    <section v-else class="carrinho-vazio">
      <h2>Seu carrinho está vazio</h2>
      <p>Escolha seus cafés favoritos e eles aparecerão aqui.</p>
      <button class="botao-finalizar" type="button" @click="router.push('/pesquisa')">Explorar cafés</button>
    </section>
  </div>
</template>

<style scoped>
.pagina-carrinho {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 44px 28px 64px;
  color: #292522;
}

.carrinho-cabecalho {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--line);
}

h1 {
  color: var(--brand);
  line-height: 1.15;
}

.contador {
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--surface-accent);
  color: #554b44;
  font-size: 13px;
  font-weight: 700;
}

.carrinho-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
  gap: 44px;
  padding-top: 28px;
}

.lista-itens {
  display: grid;
  gap: 14px;
}

.item-carrinho {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: #e9c69e;
}

.item-imagem {
  display: grid;
  width: 92px;
  height: 104px;
  place-items: center;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.44);
  color: var(--brand);
  font-size: 22px;
  font-weight: 800;
}

.item-imagem img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-detalhes h2 {
  margin-bottom: 6px;
  color: #292522;
  font-size: 17px;
  line-height: 1.35;
}

.item-preco {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
}

.controle-quantidade {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.controle-quantidade button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: #e49a72;
  color: #362a25;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.controle-quantidade button:hover {
  background: #d8875e;
}

.controle-quantidade button:disabled,
.remover-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.controle-quantidade span {
  min-width: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
}

.item-final {
  display: flex;
  min-width: 94px;
  flex-direction: column;
  align-items: end;
  gap: 14px;
  align-self: stretch;
  justify-content: space-between;
}

.item-final strong {
  font-size: 14px;
  white-space: nowrap;
}

.remover-item {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--brand);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.resumo-pedido {
  position: sticky;
  top: 24px;
  padding-top: 4px;
}

.resumo-pedido h2 {
  margin-bottom: 22px;
  color: var(--brand);
  font-size: 20px;
}

.linha-resumo {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 17px;
  font-size: 14px;
}

.linha-resumo.total {
  margin-top: 18px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  font-size: 17px;
}

.botao-finalizar,
.botao-continuar {
  width: 100%;
  min-height: 46px;
  border-radius: 999px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.botao-finalizar {
  border: 0;
  background: var(--brand);
  color: white;
}

.botao-finalizar:hover {
  background: #5e3432;
}

.botao-finalizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botao-continuar {
  margin-top: 10px;
  border: 1px solid var(--line);
  background: white;
  color: #403933;
}

.carrinho-vazio {
  display: flex;
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.carrinho-vazio h2 {
  margin-bottom: 8px;
  color: var(--brand);
  font-size: 25px;
}

.carrinho-vazio > p:not(.sobretitulo) {
  margin-bottom: 22px;
  color: #716b65;
}

.carrinho-vazio .botao-finalizar {
  width: min(260px, 100%);
}

@media (max-width: 760px) {
  .pagina-carrinho {
    padding: 24px 18px 38px;
  }

  .carrinho-cabecalho {
    align-items: center;
    padding-bottom: 17px;
  }

  h1 {
    font-size: 27px;
  }

  .carrinho-layout {
    grid-template-columns: 1fr;
    gap: 28px;
    padding-top: 18px;
  }

  .item-carrinho {
    grid-template-columns: 68px minmax(0, 1fr) auto;
    gap: 12px;
    padding: 13px;
  }

  .item-imagem {
    width: 68px;
    height: 86px;
  }

  .item-detalhes h2 {
    font-size: 15px;
  }

  .item-final {
    min-width: auto;
  }

  .resumo-pedido {
    position: static;
    padding-top: 21px;
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 390px) {
  .pagina-carrinho {
    padding-right: 13px;
    padding-left: 13px;
  }

  .item-carrinho {
    grid-template-columns: 58px minmax(0, 1fr) auto;
    gap: 9px;
    padding: 10px;
  }

  .item-imagem {
    width: 58px;
    height: 76px;
  }

  .item-final strong {
    font-size: 12px;
  }
}
.aviso-finalizacao {
  margin-block: 8px;
  color: var(--muted);
  font-size: .875rem;
}
</style>
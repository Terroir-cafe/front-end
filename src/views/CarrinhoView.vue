<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCarrinhoStore } from '@/stores/carrinho.js';

const router = useRouter();
const carrinho = useCarrinhoStore();
const cupom = ref('');
const cupomAplicado = ref(false);
const mensagemCupom = ref('');

const desconto = computed(() => cupomAplicado.value ? carrinho.subtotal * 0.1 : 0);
const total = computed(() => carrinho.subtotal - desconto.value);
const formatarPreco = (valor) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
}).format(valor);

function aplicarCupom() {
    if (cupom.value.trim().toUpperCase() === 'CAFE10') {
        cupomAplicado.value = true;
        mensagemCupom.value = 'Cupom CAFE10 aplicado: 10% de desconto.';
        return;
    }

    cupomAplicado.value = false;
    mensagemCupom.value = 'Cupom inválido.';
}

function finalizarCompra() {
    mensagemCupom.value = 'A finalização de pedidos ainda não está disponível.';
}
</script>

<template>
  <main class="pagina-carrinho">
    <div class="carrinho-cabecalho">
      <div>
        <p class="sobretitulo">SUA SELEÇÃO</p>
        <h1>Seu carrinho</h1>
      </div>
      <span class="contador">{{ carrinho.quantidadeTotal }} {{ carrinho.quantidadeTotal === 1 ? 'item' : 'itens' }}</span>
    </div>

    <div v-if="carrinho.itens.length" class="carrinho-layout">
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
              <button type="button" :aria-label="`Diminuir quantidade de ${item.nome}`" @click="carrinho.atualizarQuantidade(item.id, item.quantidade - 1)">−</button>
              <span>{{ item.quantidade }}</span>
              <button type="button" :aria-label="`Aumentar quantidade de ${item.nome}`" @click="carrinho.atualizarQuantidade(item.id, item.quantidade + 1)">+</button>
            </div>
          </div>

          <div class="item-final">
            <strong>{{ formatarPreco(item.preco * item.quantidade) }}</strong>
            <button class="remover-item" type="button" :aria-label="`Remover ${item.nome} do carrinho`" @click="carrinho.remover(item.id)">Remover</button>
          </div>
        </article>
      </section>

      <aside class="resumo-pedido" aria-label="Resumo do pedido">
        <h2>Resumo do pedido</h2>
        <form class="form-cupom" @submit.prevent="aplicarCupom">
          <label for="cupom">Inserir cupom</label>
          <div class="cupom-campo">
            <input id="cupom" v-model="cupom" placeholder="Código do cupom" :aria-describedby="mensagemCupom ? 'mensagem-cupom' : undefined" />
            <button type="submit">Aplicar</button>
          </div>
          <p v-if="mensagemCupom && !mensagemCupom.includes('finalização')" id="mensagem-cupom" class="mensagem-cupom" role="status">{{ mensagemCupom }}</p>
        </form>

        <div class="linha-resumo">
          <span>Subtotal</span>
          <strong>{{ formatarPreco(carrinho.subtotal) }}</strong>
        </div>
        <div v-if="desconto" class="linha-resumo desconto">
          <span>Desconto (10%)</span>
          <strong>−{{ formatarPreco(desconto) }}</strong>
        </div>
        <div class="linha-resumo total">
          <span>Total</span>
          <strong>{{ formatarPreco(total) }}</strong>
        </div>

        <button class="botao-finalizar" type="button" @click="finalizarCompra">Finalizar compra</button>
        <p v-if="mensagemCupom.includes('finalização')" class="mensagem-finalizacao" role="status">{{ mensagemCupom }}</p>
        <button class="botao-continuar" type="button" @click="router.push('/pesquisa')">Continuar comprando</button>
      </aside>
    </div>

    <section v-else class="carrinho-vazio">
      <p class="sobretitulo">PRONTO PARA DESCOBRIR?</p>
      <h2>Seu carrinho está vazio</h2>
      <p>Escolha seus cafés favoritos e eles aparecerão aqui.</p>
      <button class="botao-finalizar" type="button" @click="router.push('/pesquisa')">Explorar cafés</button>
    </section>
  </main>
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
  border-bottom: 1px solid #d8d2cb;
}

.sobretitulo {
  margin-bottom: 8px;
  color: #8b5148;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

h1 {
  color: #6d423b;
  font-size: 32px;
  line-height: 1.15;
}

.contador {
  padding: 6px 12px;
  border-radius: 20px;
  background: #f0ece7;
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
  border-radius: 10px;
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
  color: #6d423b;
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
  color: #6d423b;
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
  color: #6d423b;
  font-size: 20px;
}

.form-cupom {
  padding-bottom: 20px;
  border-bottom: 1px solid #d8d2cb;
}

.form-cupom label {
  display: block;
  margin-bottom: 9px;
  font-size: 14px;
  font-weight: 700;
}

.cupom-campo {
  display: flex;
  gap: 8px;
}

.cupom-campo input {
  min-width: 0;
  flex: 1;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #cfc7bf;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
}

.cupom-campo button {
  padding: 0 13px;
  border: 1px solid #6d423b;
  border-radius: 6px;
  background: white;
  color: #6d423b;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.mensagem-cupom,
.mensagem-finalizacao {
  margin-top: 8px;
  color: #6d423b;
  font-size: 12px;
}

.linha-resumo {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 17px;
  font-size: 14px;
}

.desconto strong {
  color: #3f7351;
}

.linha-resumo.total {
  margin-top: 18px;
  padding: 18px 0;
  border-top: 1px solid #d8d2cb;
  font-size: 17px;
}

.botao-finalizar,
.botao-continuar {
  width: 100%;
  min-height: 46px;
  border-radius: 7px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.botao-finalizar {
  border: 0;
  background: #74403e;
  color: white;
}

.botao-finalizar:hover {
  background: #5e3432;
}

.botao-continuar {
  margin-top: 10px;
  border: 1px solid #d8d2cb;
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
  color: #6d423b;
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
    border-top: 1px solid #d8d2cb;
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
</style>
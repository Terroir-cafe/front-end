<script setup>
import { RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
import appFooterMobile from '@/components/layout/appFooterMobile.vue';
import { onMounted, onUnmounted, watch } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';
import { useAuthStore } from '@/stores/auth.js';
import { useCarrinhoStore } from '@/stores/carrinho.js';
import { listarCompras, listarFavoritos, listarNotificacoes } from '@/api/contaApi';
import { useNotificacoesStore } from '@/stores/notificacoes';
import { conectado, erroSincronizacao, observarConexao, pendencias, sincronizando, trocarConta, versao } from '@/offline/sincronizacao';

const authStore = useAuthStore();
const carrinho = useCarrinhoStore();
const notificacoes = useNotificacoesStore();
let pararObservacao;

function atualizarConta() {
  if (!authStore.isAuthenticated) return;
  void authStore.getUser().catch(() => {});
  void carrinho.carregar();
  void notificacoes.atualizar();
}

function prepararConsultasOffline() {
  if (!authStore.isAuthenticated || !navigator.onLine) return;
  void Promise.allSettled([listarCompras(1), listarFavoritos(1), listarNotificacoes(1)]);
}

onMounted(() => {
  pararObservacao = observarConexao();
  const produtosStore = useProdutosStore();

  void produtosStore.getCategorias().catch(() => {});
  void produtosStore.getMarcas().catch(() => {});
});

onUnmounted(() => pararObservacao?.());

watch(() => authStore.conta, () => {
  carrinho.limpar();
  void trocarConta().then(() => {
    atualizarConta();
    prepararConsultasOffline();
  });
}, { immediate: true });

watch(versao, atualizarConta);
watch(conectado, (online) => {
  if (online) {
    atualizarConta();
    prepararConsultasOffline();
  }
});

// Mensagens de erro do carrinho (ex.: estoque insuficiente) somem sozinhas
watch(
  () => carrinho.erro,
  (mensagem) => {
    if (!mensagem) return;
    setTimeout(() => {
      if (carrinho.erro === mensagem) carrinho.limparErro();
    }, 5000);
  }
);

</script>

<template>
  <div class="layout">

    <appHeader />

    <p v-if="!conectado || pendencias.length" class="aviso-offline" role="status">
      <template v-if="!conectado">Sem conexão. Você pode consultar os dados já salvos neste dispositivo.</template>
      <template v-if="pendencias.length">
        {{ pendencias.length }} {{ pendencias.length === 1 ? 'alteração pendente' : 'alterações pendentes' }}.
        {{ sincronizando ? 'Sincronizando…' : 'O envio será feito quando o servidor estiver disponível.' }}
      </template>
    </p>
    <div v-if="erroSincronizacao" class="aviso-offline" role="alert">
      {{ erroSincronizacao }}
      <button type="button" class="conta-button" @click="erroSincronizacao = ''">Dispensar</button>
    </div>

    <main>
      <router-view />
    </main>

    <div v-if="carrinho.erro" class="toast-carrinho" role="alert" @click="carrinho.limparErro()">
      {{ carrinho.erro }}
    </div>

    <appFooter />
    <appFooterMobile />

  </div>
</template> 
<style scoped>
.layout{
    min-height:100vh;
    display:flex;
    flex-direction:column;
}

main{
    flex:1;
}

.aviso-offline {
  margin: 8px var(--gutter) 0;
  padding: 10px 14px;
  border-radius: var(--radius-control);
  background: var(--surface-accent);
  color: var(--brand-hover);
}
.aviso-offline button {
  margin-inline-start: 8px;
}
.toast-carrinho {
  position: fixed;
  right: 20px;
  bottom: 24px;
  z-index: 1000;
  max-width: min(360px, calc(100vw - 40px));
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--brand);
  color: white;
  font-size: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

@media (max-width: 600px) {
  .toast-carrinho {
    bottom: 90px; /* acima do menu inferior mobile */
  }

  .layout {
    padding-bottom: calc(64px + max(10px, env(safe-area-inset-bottom)));
  }
}
</style>


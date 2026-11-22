<script setup>
import { RouterView } from 'vue-router'
import appHeader from '@/components/layout/appHeader.vue';
import appFooter from '@/components/layout/appFooter.vue';
import appFooterMobile from '@/components/layout/appFooterMobile.vue';
import { onMounted, watch } from 'vue';
import { useProdutosStore } from '@/stores/produtos.js';
import { useAuthStore } from '@/stores/auth.js';
import { useCarrinhoStore } from '@/stores/carrinho.js';

const authStore = useAuthStore();
const carrinho = useCarrinhoStore();

onMounted(() => {
  const produtosStore = useProdutosStore();

  produtosStore.getCategorias();
  produtosStore.getMarcas();
});

// Lê o carrinho do back-end ao abrir o site e ao fazer login;
// zera o carrinho local ao fazer logout.
watch(
  () => authStore.isAuthenticated,
  (logado) => (logado ? carrinho.carregar() : carrinho.limpar()),
  { immediate: true }
);

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


import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { contarNaoLidas } from '@/api/contaApi'
import { useAuthStore } from './auth'

export const useNotificacoesStore = defineStore('notificacoes', () => {
  const auth = useAuthStore()
  const naoLidas = ref(0)
  const revisao = ref(0)
  let requisicao = 0

  async function atualizar() {
    const atual = ++requisicao
    if (!auth.isAuthenticated) {
      naoLidas.value = 0
      return
    }

    try {
      const total = await contarNaoLidas()
      if (atual === requisicao) naoLidas.value = total
    } catch {
      // Mantém a última contagem disponível até a próxima consulta.
    }
  }

  watch(() => auth.accessToken, atualizar, { immediate: true })

  function receberPush() {
    revisao.value++
    void atualizar()
  }

  return { naoLidas, revisao, atualizar, receberPush }
})

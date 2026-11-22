<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { mdiBellRingOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { ativarPush, consultarPush, desativarPush, obterAssinatura, suportaPush } from '@/api/pushApi'

import { conectado, pendencias, versao } from '@/offline/sincronizacao'

const chave = ref('')
const ativo = ref(false)
const ocupado = ref(false)
const bloqueado = ref(suportaPush && Notification.permission === 'denied')
const erro = ref('')
const descricao = computed(() => {
  if (!suportaPush) return 'Use um navegador compatível. No iPhone, abra o site pelo ícone adicionado à Tela de Início.'
  if (bloqueado.value) return 'Libere as notificações deste site nos ajustes do navegador ou do dispositivo.'
  if (ocupado.value) return 'Atualizando preferência…'
  if (ativo.value) return 'Os alertas estão ativados neste dispositivo.'
  if (!conectado.value) return 'Conecte-se para ativar os alertas neste dispositivo.'
  if (!chave.value) return 'O envio para este dispositivo está indisponível.'
  return 'Receba alertas de compras, carrinho e favoritos mesmo com o site fechado.'
})

async function consultar() {
  if (!suportaPush) return
  ocupado.value = true
  erro.value = ''
  try {
    const estado = await consultarPush(await obterAssinatura())
    chave.value = estado.chave_publica
    ativo.value = estado.ativo
  } catch {
    erro.value = 'Não foi possível consultar os alertas neste dispositivo.'
  } finally {
    ocupado.value = false
  }
}

async function alternar() {
  ocupado.value = true
  erro.value = ''
  try {
    if (ativo.value) {
      await desativarPush({ salvarDepois: true })
      ativo.value = false
    } else {
      const permissao = await Notification.requestPermission()
      bloqueado.value = permissao === 'denied'
      if (permissao === 'granted') {
        await ativarPush(chave.value)
        ativo.value = true
      }
    }
  } catch {
    erro.value = 'Não foi possível atualizar os alertas neste dispositivo. Tente novamente.'
  } finally {
    ocupado.value = false
  }
}

onMounted(consultar)
watch(versao, consultar)
</script>

<template>
  <section class="conta-card alertas-dispositivo">
    <div class="alertas-icone" aria-hidden="true"><SvgIcon type="mdi" :path="mdiBellRingOutline" /></div>
    <div class="alertas-texto">
      <h2>Alertas neste dispositivo</h2>
      <p aria-live="polite">{{ descricao }}</p>
      <p v-if="erro" role="alert">{{ erro }}</p>
    </div>
    <button v-if="suportaPush && (chave || ativo) && (!bloqueado || ativo)" type="button" class="conta-button"
      :disabled="ocupado || (!ativo && (!conectado || pendencias.some((op) => op.tipo === 'desativar_push')))" @click="alternar">
      {{ ativo ? 'Desativar alertas' : 'Ativar alertas' }}
    </button>
    <button v-else-if="erro" type="button" class="conta-button" @click="consultar">Tentar novamente</button>
  </section>
</template>

<style scoped>
.alertas-dispositivo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.alertas-icone {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--surface-accent);
  color: var(--brand);
}
.alertas-texto {
  flex: 1 1 220px;
}
.alertas-texto p {
  margin: 4px 0 0;
  color: var(--muted);
}
</style>

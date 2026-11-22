<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { mdiBellRingOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { usePushNotifications } from '@/composables/usePushNotifications'
import { useAuthStore } from '@/stores/auth'
import { conectado, versao } from '@/offline/sincronizacao'

const props = defineProps({ convite: Boolean })
const auth = useAuthStore()
const push = usePushNotifications()
const { suportaPush } = push

const chaveConvite = `terroir-convite-push-${auth.conta}`
const dispensado = ref(sessionStorage.getItem(chaveConvite) === 'dispensado')
const podeConvidar = ref(false)
const chave = ref('')
const ativo = ref(false)
const ocupado = ref(false)
const bloqueado = ref(suportaPush && Notification.permission === 'denied')
const erro = ref('')
let consultarNovamente = false
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
  if (!suportaPush || !auth.conta || (props.convite && dispensado.value)) return
  if (ocupado.value) {
    consultarNovamente = true
    return
  }
  ocupado.value = true
  erro.value = ''
  try {
    const estado = await push.consultar(auth.conta)
    chave.value = estado.chave_publica
    ativo.value = estado.ativo
    podeConvidar.value = estado.podeConvidar
  } catch {
    if (conectado.value) erro.value = 'Não foi possível consultar os alertas neste dispositivo.'
  } finally {
    concluir()
  }
}

function concluir() {
  ocupado.value = false
  if (consultarNovamente) {
    consultarNovamente = false
    void consultar()
  }
}

function dispensar() {
  sessionStorage.setItem(chaveConvite, 'dispensado')
  dispensado.value = true
}

async function alternar() {
  ocupado.value = true
  erro.value = ''
  try {
    if (ativo.value) {
      await push.desativar(auth.conta)
      ativo.value = false
    } else {
      ativo.value = await push.ativar(chave.value, auth.conta)
      bloqueado.value = Notification.permission === 'denied'
    }
  } catch {
    erro.value = 'Não foi possível atualizar os alertas neste dispositivo. Tente novamente.'
  } finally {
    concluir()
  }
}

onMounted(consultar)
watch([versao, conectado, push.revisaoPush], consultar)
</script>

<template>
  <section v-if="!props.convite || (podeConvidar && chave && conectado && !dispensado && !ativo && !bloqueado)"
    class="conta-card alertas-dispositivo" :class="{ convite: props.convite }">
    <div class="alertas-icone" aria-hidden="true"><SvgIcon type="mdi" :path="mdiBellRingOutline" /></div>
    <div class="alertas-texto">
      <h2>Alertas neste dispositivo</h2>
      <p aria-live="polite">{{ descricao }}</p>
      <p v-if="erro" role="alert">{{ erro }}</p>
    </div>
    <button v-if="suportaPush && (chave || ativo) && (!bloqueado || ativo)" type="button" class="conta-button"
      :disabled="ocupado || (!ativo && !conectado)" @click="alternar">
      {{ ativo ? 'Desativar alertas' : 'Ativar alertas' }}
    </button>
    <button v-else-if="erro" type="button" class="conta-button" @click="consultar">Tentar novamente</button>
    <button v-if="props.convite" type="button" class="conta-button" @click="dispensar">Agora não</button>
  </section>
</template>

<style scoped>
.alertas-dispositivo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.convite {
  margin: 8px var(--gutter) 0;
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

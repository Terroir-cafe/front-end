<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
import { desativarPush } from '@/api/pushApi'
import HistoricoCompras from '@/components/conta/HistoricoCompras.vue'
import appButton from '@/components/forms/appButton.vue'
import { mdiAccountCircle } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const authStore = useAuthStore();
const isLoading = ref(false);
const selectedFile = ref(null);
const router = useRouter();
const mdiAccountIcon = ref(mdiAccountCircle)

function handleFileChange(event) {
    selectedFile.value = event.target.files[0];
    erroAvatar.value = '';
};

const erroAvatar = ref('')

async function handleImageUpload(event) {
    if (!selectedFile.value || isLoading.value) return
    if (!['image/jpeg', 'image/png'].includes(selectedFile.value.type)) {
        erroAvatar.value = 'Selecione uma foto JPEG ou PNG.'
        return
    }
    const form = event.currentTarget
    isLoading.value = true
    erroAvatar.value = ''
    try {
        await authStore.adicionarImagemAoUsuario(selectedFile.value)
        selectedFile.value = null
        form.reset()
    } catch {
        erroAvatar.value = 'Não foi possível atualizar a foto. Tente novamente.'
    } finally {
        isLoading.value = false
    }
}

const saindo = ref(false)

async function handleLogout() {
    saindo.value = true
    try {
        await desativarPush()
    } catch {
        // A sessão local ainda deve ser encerrada se o servidor estiver indisponível.
    } finally {
        authStore.logout()
        router.push('/login')
    }
}

onMounted(() => {
    void authStore.getUser().catch(() => {});
});
</script>
<template>
    <div class="main-container">
        <div class="user-info-container">
        <div>
            <p>
                <img :src="authStore.user?.foto?.url" class="avatar" alt="Foto do perfil" v-if="authStore.user?.foto?.url">
                <SvgIcon type="mdi" :path="mdiAccountIcon" class="user-icon avatar" v-else/>
            </p>
        </div>
        <div class="user-container">
            <h1>Bem-vindo, {{ authStore.user?.name || 'Usuário' }}!</h1>
            <p>Email: {{ authStore.user?.email || 'Não disponível' }}</p>
        </div>
        </div>
        <nav class="conta-links" aria-label="Minha conta">
            <RouterLink to="/notificacoes">Notificações</RouterLink>
            <RouterLink to="/favoritos">Produtos favoritos</RouterLink>
            <RouterLink to="/usuario#historico-compras">Histórico de compras</RouterLink>
        </nav>
        <HistoricoCompras />
        <div class="actions-container">
            <form @submit.prevent="handleImageUpload" class="avatar-upload-form">
                <h2>Atualizar foto do perfil</h2>
                <input type="file" accept="image/jpeg,image/png" aria-label="Selecionar foto do perfil" @change="handleFileChange" />
                <p v-if="erroAvatar" class="error-message" role="alert">{{ erroAvatar }}</p>
                <appButton type="submit" variant="primary" :disabled="isLoading || !selectedFile">
                    {{ isLoading ? 'Enviando...' : 'Enviar' }}
                </appButton>
            </form>
            <appButton @click="handleLogout" variant="danger" :disabled="saindo">Sair da conta</appButton>
        </div>
    </div>
</template>
<style scoped>
.main-container {
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user-info-container {
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: var(--caramelo);
  padding: 30px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--surface);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-icon {
  color: var(--brand);
}

.user-container h1 {
  color: var(--brand);
  margin: 0 0 8px 0;
  font-size: 24px;
}

.user-container p {
  color: var(--muted);
  margin: 0;
  font-size: 15px;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 30px;
  border-radius: 24px;
}

.avatar-upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-upload-form h2 {
  margin: 0;
  color: var(--brand);
  font-size: 18px;
}

.avatar-upload-form input[type="file"] {
  padding: 10px;
  border: 1px dashed var(--brand);
  border-radius: 12px;
  background: #faf8f5;
  cursor: pointer;
}

@media (min-width: 640px) {
  .user-info-container {
    flex-direction: row;
    text-align: left;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }
}

.conta-links a {
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-accent);
  text-decoration: none;
  font-weight: 600;
}

.conta-links a:hover {
  background: var(--caramelo);
}
</style>
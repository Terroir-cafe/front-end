<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { mdiAccountCircle } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import appButton from '@/components/forms/appButton.vue'

const authStore = useAuthStore();
const isLoading = ref(false);
const mdiAccountCircleIcon = ref(mdiAccountCircle)
const selectedFile = ref(null);

function handleFileChange(event) {
    selectedFile.value = event.target.files[0];
};

async function handleImageUpload() {
    isLoading.value = true;
    authStore.adicionarImagemAoUsuario(selectedFile.value);
    isLoading.value = false;
};

onMounted(() => {
    authStore.getUser();
});
</script>
<template>
    <div class="main-container">
        <div class="perfil">
            <div class="user-foto">
                <p>
                    <img v-if="authStore.user?.foto.url" :src="authStore.user?.foto.url" class="avatar" />
                    <SvgIcon v-else :icon="mdiAccountCircleIcon" type="mdi" :path="mdiAccountCircleIcon"
                        class="avatar" />
                </p>
            </div>
            <div class="user-info">
                <h2>Bem-vindo, {{ authStore.user?.name || 'Usuário' }}!</h2>
                <p>Email: {{ authStore.user?.email || 'Não disponível' }}</p>
            </div>
        </div>
        <div>
            <form @submit.prevent="handleImageUpload" class="avatar-upload-form">
                <h3>Atualizar Avatar</h3>
                <input type="file" accept="image/*" @change="handleFileChange" />
                <appButton type="submit" variant="primary" :disabled="isLoading" class="upload-button">
                    {{ isLoading ? 'Enviando...' : 'Enviar' }}
                </appButton>
            </form>
            <appButton @click="authStore.logout" variant="danger">Sair da conta</appButton>

        </div>
    </div>
</template>
<style scoped>
.main-container {
    margin: 6vh 1vh 6vh 1vh;
}

.perfil {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
    align-content: center;
}

.avatar {
    max-width: 100px;
    min-width: 100px;
    max-height: 100px;
    min-height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.perfil {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    gap: 20px;
}

.avatar-upload-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}
.upload-button{
    margin-top: 20px;
}
</style>
<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import appButton from '@/components/forms/appButton.vue'

const authStore = useAuthStore();
const isLoading = ref(false);
const selectedFile = ref(null);

function handleFileChange(event) {
    selectedFile.value = event.target.files[0];
};

 async function handleImageUpload () {
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
        <div class="user-info-container">
        <div>
            <p>
                <img :src="authStore.user?.foto?.url" alt="Avatar do usuário" class="avatar">
            </p>
        </div>
        <div class="user-container">
            <h2>Bem-vindo, {{ authStore.user?.name || 'Usuário' }}!</h2>
            <p>Email: {{ authStore.user?.email || 'Não disponível' }}</p>
        </div>
        </div>
        <div class="actions-container">
            <form @submit.prevent="handleImageUpload" class="avatar-upload-form">
                <h3>Atualizar Avatar</h3>
                <input type="file" accept="image/*" @change="handleFileChange" />
                <appButton type="submit" variant="primary" :disabled="isLoading">
                    {{ isLoading ? 'Enviando...' : 'Enviar' }}
                </appButton>
            </form>
            <appButton @click="authStore.logout" variant="danger">Sair da conta</appButton>
        </div>
    </div>
</template>
<style scoped>
@media (max-width: 480px) {
.main-container {
    margin-top: 4vh;
}

.user-info-container {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 2vh;
}

.avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

}

@media (min-width: 1024px){
.main-container {
    margin-top: 4vh;
}

.user-info-container {
    display: flex;
    align-items: center;
    gap: 20px;
}

.avatar{
    width: 10vw;
    height: 10vw;
    border-radius: 50%;
}
}
</style>
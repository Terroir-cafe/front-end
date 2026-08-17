<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js';
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
};

 async function handleImageUpload () {
    isLoading.value = true;
    authStore.adicionarImagemAoUsuario(selectedFile.value);
    isLoading.value = false;
};


function handleLogout() {
    authStore.logout();
    router.push('/login');
}

onMounted(() => {
    authStore.getUser();
});
</script>
<template>
    <div class="main-container">
        <div class="user-info-container">
        <div>
            <p>
                <img :src="authStore.user?.foto?.url" class="avatar" v-if="authStore.user?.foto?.url">
                <SvgIcon type="mdi" :path="mdiAccountIcon" class="user-icon avatar" v-else/>
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
            <appButton @click="handleLogout" variant="danger">Sair da conta</appButton>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: #e8b88e;
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
  border: 4px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-icon {
  color: #74403e;
}

.user-container h2 {
  color: #74403e;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.user-container p {
  color: #444444;
  margin: 0;
  font-size: 15px;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  border: 1px solid #e8b88e;
  padding: 30px;
  border-radius: 24px;
}

.avatar-upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-upload-form h3 {
  margin: 0;
  color: #74403e;
  font-size: 18px;
}

.avatar-upload-form input[type="file"] {
  padding: 10px;
  border: 1px dashed #74403e;
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
</style>
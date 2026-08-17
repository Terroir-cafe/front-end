<script setup>
import appButton from '@/components/forms/appButton.vue'
import appInput from '@/components/forms/appInput.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin(){
    loading.value = true;
    errorMessage.value = '';
    try{
        await authStore.login(email.value, password.value);
        router.push('/');
    } catch (error){
        errorMessage.value = error.response?.data?.message ?? 'Erro ao fazer login. Verifique suas credenciais.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="signup-container">
        <div class="title-wrapper">
            <h2 class="signup-title">Faça Login</h2>
            <div class="title-line"></div>
        </div>

        <form class="signup-form" @submit.prevent="handleLogin">
            <appInput v-model="email" type="email" placeholder="Email" required class="custom-input" />
            <appInput v-model="password" type="password" placeholder="Senha" required class="custom-input" />
            
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            
            <appButton type="submit" variant="primary" :disabled="loading">
                {{ loading ? 'Processando...' : 'Confirmar' }}
            </appButton>
        </form>

        <div class="login-prompt">
            <span>Não possui uma conta?</span>
            <router-link to="/cadastro" class="login-link">Cadastre-se</router-link>
        </div>
    </div>
</template>

<style scoped>
/* --- CONTAINER PRINCIPAL --- */
.signup-container {
  padding: 40px 24px;
  width: 100%;
  max-width: 460px;
  margin: 40px auto;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #e8b88e;
  box-shadow: 0 8px 24px rgba(116, 64, 62, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* --- TOPO / TÍTULO --- */
.title-wrapper {
  width: 100%;
  max-width: 340px;
  text-align: center;
  margin-bottom: 32px;
}

.signup-title {
  color: #74403e;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.title-line {
  width: 100%;
  height: 3px;
  background-color: #e8b88e;
  border-radius: 2px;
}

/* --- FORMULÁRIO --- */
.signup-form {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

:deep(.custom-input) {
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}

:deep(.custom-input input) {
  width: 100% !important;
  box-sizing: border-box !important;
  height: 48px !important;
  border-radius: 12px !important;
  border: 1.5px solid #e8b88e !important;
  background-color: #ffffff !important;
  padding: 0 18px !important;
  font-size: 15px !important;
  color: #333333 !important;
  outline: none !important;
  transition: all 0.2s ease !important;
}

:deep(.custom-input input:focus) {
  border-color: #74403e !important;
  box-shadow: 0 0 0 3px rgba(116, 64, 62, 0.15) !important;
}

/* --- TEXTOS INFERIORES E BOTÕES --- */
.error-message {
  color: #b00020;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.login-prompt {
  text-align: center;
  font-size: 15px;
  margin-top: 32px;
}

.login-prompt span {
  color: #555555;
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}

.login-link {
  color: #74403e;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #5b3231;
  text-decoration: underline;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 480px) {
  .signup-container {
    margin: 20px auto;
    padding: 30px 16px;
    border-radius: 16px;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
}
</style>
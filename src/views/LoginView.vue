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
    padding: 60px 40px;
    width: 100%;
    max-width: 450px;
    margin: 40px auto;
    background-color: #ffffff;
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
    margin-bottom: 50px;
}

.signup-title {
    color: #000000;
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 10px 0;
    letter-spacing: -0.5px;
}

.title-line {
    width: 100%;
    height: 2px;
    background-color: #000000;
}

/* --- FORMULÁRIO --- */
.signup-form {
    width: 100%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
}

/* CORREÇÃO DAS BORDAS DUPLICADAS:
  Removemos estilos do container do appInput e aplicamos a pílula APENAS na tag input nativa.
*/
.custom-input {
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}

:deep(.custom-input input) {
    width: 100% !important;
    box-sizing: border-box !important;
    height: 52px !important;
    border-radius: 30px !important; /* Formato pílula perfeito */
    border: 3px solid #cccccc !important; /* Borda única cinza da imagem */
    background-color: #ffffff !important;
    padding: 0 24px !important;
    font-size: 16px !important;
    color: #333333 !important;
    outline: none !important;
}

/* --- TEXTOS INFERIORES --- */
.error-message {
    color: #ff3333;
    font-size: 14px;
    margin: 0;
    text-align: center;
}

.login-prompt {
    text-align: center;
    font-size: 15px;
    margin-top: 40px;
}

.login-prompt span {
    color: #000000;
    font-weight: 800;
    display: block;
    margin-bottom: 8px;
}

.login-link {
    color: #c49a6c;
    font-weight: 700;
    text-decoration: none;
}

.login-link:hover {
    text-decoration: underline;
}

/* --- DESKTOP --- */
@media (min-width: 1024px) {
    .signup-container {
        max-width: 550px;
        padding: 80px 60px;
        border-radius: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    }
}
</style>
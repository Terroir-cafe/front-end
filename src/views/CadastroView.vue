<script setup>
import appButton from '@/components/forms/appButton.vue'
import appInput from '@/components/forms/appInput.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

function validateForm(){
    if(password.value !== confirmPassword.value){
        errorMessage.value = 'As senhas não coincidem.';
        return false;
    }
    return true;
}

async function handleRegister(){
    if (validateForm() === true){
        loading.value = true;
        errorMessage.value = '';
        try{
            await authStore.register(email.value, name.value, password.value);
            router.push('/login');
        } catch (error){
            errorMessage.value = error.response?.data?.message ?? 'Erro ao registrar. Tente novamente.';
        } finally {
            loading.value = false;
        }
    }
}
</script>

<template>
    <div class="signup-container">
        <div class="title-wrapper">
            <h2 class="signup-title">Cadastre-se</h2>
            <div class="title-line"></div>
        </div>

        <form class="signup-form" @submit.prevent="handleRegister">
            <appInput v-model="name" type="text" placeholder="Nome" required class="custom-input" />
            <appInput v-model="email" type="email" placeholder="Email" required class="custom-input" />
            <appInput v-model="password" type="password" placeholder="Senha" required class="custom-input" />
            <appInput v-model="confirmPassword" type="password" placeholder="Confirmar Senha" required class="custom-input" />
            
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            
            <appButton type="submit" class="btn-confirmar" :disabled="loading">
                {{ loading ? 'Processando...' : 'Confirmar' }}
            </appButton>
        </form>

        <div class="login-prompt">
            <span>Já possui uma conta?</span>
            <router-link to="/login" class="login-link">Entrar</router-link>
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
    max-width: 320px;
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

/* --- FORMULÁRIO E ALINHAMENTO --- */
.signup-form {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
}

/* CORREÇÃO DO DUPLO CONTORNO:
   Limpamos o elemento pai (.custom-input) para ele não gerar bordas extras 
*/
:deep(.custom-input) {
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
}

/* Aplicamos a pílula cinza estritamente no elemento INPUT interno */
:deep(.custom-input input) {
    width: 100% !important;
    box-sizing: border-box !important;
    height: 48px !important;
    border-radius: 24px !important;
    border: 3px solid #cccccc !important; /* A borda cinza da imagem original */
    background-color: #ffffff !important;
    padding: 0 24px !important;
    font-size: 16px !important;
    color: #333333 !important;
    outline: none !important;
    text-align: left !important;
}

/* --- BOTÃO CONFIRMAR --- */
.btn-confirmar,
:deep(.btn-confirmar),
:deep(.btn-confirmar button) {
    background-color: #eeeeee !important; 
    color: #000000 !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    border: none !important;
    padding: 12px 40px !important;
    border-radius: 25px !important;
    cursor: pointer !important;
    transition: background-color 0.2s !important;
    margin-top: 15px !important;
    width: auto !important;
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.btn-confirmar:hover {
    background-color: #e0e0e0 !important;
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

/* --- RESPONSIVIDADE DESKTOP --- */
@media (min-width: 1024px) {
    .signup-container {
        max-width: 550px;
        padding: 80px 60px;
        border-radius: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    }
}
</style>
<script setup>
import appButton from '@/components/forms/appButton.vue'
import appInput from '@/components/forms/appInput.vue'
import { ref } from 'vue';
import  { useRouter } from 'vue-router';
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
    if (validateForm() == true){
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
    }else{
        errorMessage.value = 'As senhas não coincidem.';
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
        <appInput v-model="name" type="text" placeholder="Nome" required />
        <appInput v-model="email" type="email" placeholder="Email" required />
        <appInput v-model="password" type="password" placeholder="Senha" required />
        <appInput v-model="confirmPassword" type="password" placeholder="Confirmar Senha" required />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <appButton type="submit" class="secondary" :disabled="loading">
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
    .signup-container {
        padding: 40px 30px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
        border-radius: 15px;
    }

    .title-wrapper {
        width: 100%;
        text-align: center;
        margin-bottom: 40px;
    }

    .signup-title {
        color: #000000;
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 10px;
    }

    .title-line {
        width: 100%;
        height: 2px;
        background-color: #000000;
    }

    .signup-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 70px;
        margin-top: 20px;
        gap: 20px;
    }

    .input-field {
        width: 100%;
        padding: 12px 20px;
        margin-bottom: 25px;
        border: 1px solid #e2c29f; 
        border-radius: 25px; 
        font-size: 16px;
        font-weight: 600;
        color: #333;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .input-field:focus {
        border-color: #6d423b; 
    }

    .input-field::placeholder {
        color: #bfa89a; 
        font-weight: 600;
    }

    .btn-submit {
        background-color: #6d423b;
        color: #ffffff;
        border: none;
        border-radius: 25px;
        padding: 12px 40px;
        font-size: 16px;
        font-weight: 700;
        margin-top: 40px; 
        margin-bottom: 40px;
        cursor: pointer;
        width: max-content;
    }

    .btn-submit:active {
        transform: scale(0.98); 
    }

    .login-prompt {
        text-align: center;
        font-size: 14px;
    }

    .login-prompt span {
        color: #000000;
        font-weight: 800;
        display: block;
        margin-bottom: 5px;
    }

    .login-link {
        color: #e2c29f; 
        font-weight: 700;
        text-decoration: none;
    }
</style>
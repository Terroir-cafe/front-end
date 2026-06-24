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
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <appButton type="submit" class="secondary" :disabled="loading">
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
@media (max-width: 480px) {
    .signup-container {
        padding: 40px 30px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
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
}
    /* Versão Desktop */
    @media (min-width: 768px) {
        .signup-container {
            max-width: 600px;
            padding: 60px 50px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-radius: 56px;
        }

        .signup-title {
            font-size: 32px;
        }

        .input-field {
            padding: 15px 25px;
            font-size: 18px;
        }

        .btn-submit {
            padding: 15px 50px;
            font-size: 18px;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .login-prompt {
            font-size: 16px;
        }
    }

    @media (min-width: 1024px) {
        .signup-container {
            max-width: 700px;
            padding: 80px 60px;
        }

        .signup-title {
            font-size: 36px;
        }

        .input-field {
            padding: 18px 30px;
            font-size: 20px;
        }

        .btn-submit {
            padding: 18px 60px;
            font-size: 20px;
        }
    }
</style>
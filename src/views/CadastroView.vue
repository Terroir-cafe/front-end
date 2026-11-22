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
    if (!navigator.onLine) {
        errorMessage.value = 'Conecte-se para criar sua conta.';
        return;
    }
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
        <h1>Criar conta</h1>
        <form class="signup-form" @submit.prevent="handleRegister">
            <appInput v-model="name" type="text" label="Nome" autocomplete="name" required />
            <appInput v-model="email" type="email" label="E-mail" autocomplete="email" required />
            <appInput v-model="password" type="password" label="Senha" autocomplete="new-password" required />
            <appInput v-model="confirmPassword" type="password" label="Confirmar senha" autocomplete="new-password" required />
            <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
            <appButton type="submit" variant="primary" :disabled="loading">
                {{ loading ? 'Processando…' : 'Criar conta' }}
            </appButton>
        </form>
        <div class="login-prompt">
            <span>Já possui uma conta?</span>
            <router-link to="/login" class="login-link">Entrar</router-link>
        </div>
    </div>
</template>

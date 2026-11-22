<script setup>
import appButton from '@/components/forms/appButton.vue'
import appInput from '@/components/forms/appInput.vue'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const route = useRoute();
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
        const retorno = route.query.retorno;
        router.push(typeof retorno === 'string' && router.resolve(retorno).meta.requerLogin ? retorno : '/');
    } catch (error){
        errorMessage.value = error.response?.data?.detail ?? 'Erro ao fazer login. Verifique suas credenciais.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="signup-container">
        <h1>Entrar na conta</h1>

        <form class="signup-form" @submit.prevent="handleLogin">
            <appInput v-model="email" type="email" label="E-mail" autocomplete="email" required />
            <appInput v-model="password" type="password" label="Senha" autocomplete="current-password" required />
            
            <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
            
            <appButton type="submit" variant="primary" :disabled="loading">
                {{ loading ? 'Processando…' : 'Entrar' }}
            </appButton>
        </form>

        <div class="login-prompt">
            <span>Não possui uma conta?</span>
            <router-link to="/cadastro" class="login-link">Cadastre-se</router-link>
        </div>
    </div>
</template>

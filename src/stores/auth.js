import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import authApi from '../api/authApi';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const user = ref(null);
    const accessToken = ref(localStorage.getItem('access_token'));
    const refreshToken = ref(localStorage.getItem('refresh_token'));

    const isAuthenticated = computed(() => !!accessToken.value);

    async function register(email, name, password){
        await authApi.register(email, name, password);
    }

    async function login(email, password){
        const { data } = await authApi.login(email, password);
        accessToken.value = data.access;
        refreshToken.value = data.refresh;
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
    }

    function logout(){
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push("/login")
    }

    async function getUser(){
        const { data } = await authApi.getUser();
        user.value = data;
    }

    async function adicionarImagemAoUsuario(file){
        const response = await authApi.uploadAvatar(file);
        await authApi.patchUser(user.value.id, { "foto_attachment_key": response.data.attachment_key });
        await getUser();
    }

    return {
        accessToken,
        refreshToken,
        isAuthenticated,
        user,
        login,
        logout,
        register, 
        getUser,
        adicionarImagemAoUsuario,
    };
});
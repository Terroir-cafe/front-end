import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import authApi from '../api/authApi';
import { chaveConsulta, contaAtual, lerConsulta } from '@/offline/banco';
import { aplicarConta, enfileirar, pendencias } from '@/offline/sincronizacao';


export const useAuthStore = defineStore('auth', () => {
    const usuarioServidor = ref(null);
    const fotoPendente = ref(null);
    watch(
        () => pendencias.value.findLast((op) => op.tipo === 'avatar')?.arquivo,
        (arquivo, _anterior, cancelar) => {
            const url = arquivo ? URL.createObjectURL(arquivo) : null;
            fotoPendente.value = url;
            if (url) cancelar(() => URL.revokeObjectURL(url));
        },
    );
    const user = computed(() => {
        const usuario = aplicarConta(usuarioServidor.value);
        return usuario && fotoPendente.value ? { ...usuario, foto: { url: fotoPendente.value } } : usuario;
    });
    const accessToken = ref(localStorage.getItem('access_token'));
    const refreshToken = ref(localStorage.getItem('refresh_token'));

    const conta = computed(() => contaAtual(accessToken.value));
    const isAuthenticated = computed(() => conta.value !== null);

    window.addEventListener('storage', (evento) => {
        if (evento.key !== 'access_token' && evento.key !== null) return;
        const token = localStorage.getItem('access_token');
        if (conta.value !== contaAtual(token)) usuarioServidor.value = null;
        accessToken.value = token;
        refreshToken.value = localStorage.getItem('refresh_token');
    });

    async function register(email, name, password){
        await authApi.register(email, name, password);
    }

    async function login(email, password){
        const { data } = await authApi.login(email, password);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('access_token', data.access);
        accessToken.value = data.access;
        refreshToken.value = data.refresh;
        await getUser().catch(() => {});
    }

    function logout(){
        usuarioServidor.value = null;
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    let leituraUsuario = 0;

    async function getUser(){
        const conta = contaAtual();
        if (!conta) return;
        const leitura = ++leituraUsuario;
        const atual = () => leitura === leituraUsuario && conta === contaAtual();
        const cache = await lerConsulta(chaveConsulta(conta, '/usuarios/me/')).catch(() => null);
        if (!atual()) return;
        if (cache) usuarioServidor.value = cache;
        if (cache && !navigator.onLine) return;
        const { data } = await authApi.getUser();
        if (atual()) usuarioServidor.value = data;
    }

    async function adicionarImagemAoUsuario(file){
        await enfileirar('avatar', { arquivo: file });
    }

    return {
        accessToken,
        refreshToken,
        isAuthenticated,
        conta,
        user,
        login,
        logout,
        register, 
        getUser,
        adicionarImagemAoUsuario,
    };
});
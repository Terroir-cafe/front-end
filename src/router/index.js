import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Página Inicial',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/sobre',
      name: 'Sobre',
      component: () => import('../views/SobreNosView.vue'),
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: () => import('../views/CadastroView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/usuario',
      name: 'Perfil do Usuário',
      component: () => import('../views/UsuarioView.vue'),
      meta: { requiresAuth: true },
    }
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
});

export default router

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
    }
  ],
})

  router.beforeEach((to) => {
    const authStore = useAuthStore();
    if(to.meta.requiresAuth && !authStore.isAuthenticated){
      return '/login';
    }
  })

export default router

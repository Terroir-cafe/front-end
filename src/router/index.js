import { createRouter, createWebHistory } from 'vue-router'

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
    },
    {
      path: '/pesquisa',
      name: 'Pesquisa',
      component: () => import('../views/PesquisaView.vue'),
    },
    {
      path: '/produto/:produtoId',
      name: 'Produto',
      component: () => import('../views/ProdutoView.vue'),
      props: true
    },
  ],
})



export default router

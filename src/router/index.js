import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    return savedPosition ?? (to.hash ? { el: to.hash } : { top: 0 })
  },
  routes: [
    {
      path: '/notificacoes',
      name: 'Notificações',
      component: () => import('../views/NotificacoesView.vue'),
      meta: { requerLogin: true },
    },
    {
      path: '/favoritos',
      name: 'Favoritos',
      component: () => import('../views/FavoritosView.vue'),
      meta: { requerLogin: true },
    },
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
      meta: { requerLogin: true },
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
      props: (route) => ({ produtoId: Number(route.params.produtoId) })
    },
    {
      path: '/cart',
      name: 'Carrinho',
      component: () => import('../views/CarrinhoView.vue'),
    },
  ]
})



router.beforeEach((to) => {
  if (to.meta.requerLogin && !localStorage.getItem('access_token')) {
    return { path: '/login', query: { retorno: to.fullPath } }
  }
})

export default router

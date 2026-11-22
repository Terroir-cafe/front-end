# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Uso offline

Depois da primeira visita com conexão, a versão de produção pode abrir offline.
O catálogo, a busca, as imagens e os dados da conta usam o conteúdo já
consultado neste dispositivo. Faça login antes de ficar sem conexão para
acessar os dados da conta. Páginas e imagens que ainda não foram baixadas
podem ficar indisponíveis offline.

Alterações do carrinho, dos favoritos, da foto de perfil, da leitura de
notificações e da desativação dos alertas ficam numa fila local por conta. A fila é enviada quando o site
aberto recupera a conexão ou na próxima abertura online com a mesma conta.
O servidor confere estoque e permissões e aplica cada operação uma vez.
Uma alteração rejeitada aparece como aviso no site.

Cadastro, login, ativação dos alertas de sistema e finalização de compra
precisam de conexão. Para testar a PWA offline, use a compilação de produção
em HTTPS ou localhost. No back-end, aplique a migração `0027` antes de testar
a sincronização.

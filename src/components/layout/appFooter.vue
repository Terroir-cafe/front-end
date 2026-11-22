<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <RouterLink to="/">
        <img src="/Logo.png" alt="Terroir Café" width="620" height="130" />
      </RouterLink>
      <nav aria-label="Rodapé">
        <RouterLink to="/pesquisa">Catálogo de cafés</RouterLink>
        <RouterLink to="/sobre">Sobre nós</RouterLink>
        <RouterLink to="/usuario">Minha conta</RouterLink>
      </nav>
      <small>© {{ new Date().getFullYear() }} Terroir Café</small>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--header);
  color: var(--surface);
  border-radius: 20px 20px 0 0;
}
.footer-inner {
  width: min(100%, var(--site-width));
  margin-inline: auto;
  padding: 32px var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-inner img {
  display: block;
  width: 158px;
  height: auto;
}
.footer-inner nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.footer-inner a {
  color: inherit;
  text-decoration: none;
}
.footer-inner a:hover {
  color: var(--caramelo);
}
.footer-inner small {
  color: #e7d9cc;
}
</style>

<template>
  <div class="site-container sobre">
    <h1>Sobre o Terroir Café</h1>

    <section class="sobre-card">
      <h2>Quem somos</h2>
      <p>O Terroir Café reúne cafés de diferentes marcas e categorias em um só catálogo.</p>
    </section>

    <section class="sobre-card">
      <h2>Nossa missão</h2>
      <p>Facilitar a escolha do seu próximo café, com descrições e filtros para comparar as opções.</p>
      <RouterLink to="/pesquisa" class="botao">Conhecer o catálogo</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.sobre {
  max-width: 900px;
  padding-block: 34px 56px;
  text-align: center;
}
.sobre > * + * {
  margin-top: 22px;
}
.sobre-card {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: clamp(20px, 5vw, 34px);
  border-radius: var(--radius-panel);
  background: var(--caramelo);
  box-shadow: var(--shadow);
}
.sobre-card h2 {
  color: var(--brand);
}
.sobre-card p {
  max-width: 54ch;
}
</style>

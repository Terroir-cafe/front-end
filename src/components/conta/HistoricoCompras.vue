<script setup>
import ListaDaConta from './ListaDaConta.vue'
import { listarCompras } from '@/api/contaApi'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const data = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
</script>

<template>
  <section id="historico-compras" class="conta-historico">
    <h2>Histórico de compras</h2>
    <ListaDaConta :carregar="listarCompras" vazio="Você ainda não finalizou uma compra.">
      <template #default="{ itens }">
        <ul class="conta-lista">
          <li v-for="compra in itens" :key="compra.id" class="conta-card">
            <div class="conta-linha">
              <h3>Compra #{{ compra.id }}</h3>
              <time :datetime="compra.data">{{ data.format(new Date(compra.data)) }}</time>
            </div>
            <p>{{ compra.status }} · {{ moeda.format(compra.total) }}</p>
            <ul class="itens-compra">
              <li v-for="item in compra.itens" :key="item.produto.id">
                {{ item.quantidade }} × {{ item.produto.nome }} · {{ moeda.format(item.preco) }} por unidade
              </li>
            </ul>
          </li>
        </ul>
      </template>
    </ListaDaConta>
  </section>
</template>

<style scoped>
.itens-compra {
  margin-top: 8px;
  padding-inline-start: 20px;
}
</style>

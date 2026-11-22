<script setup>
import { computed } from 'vue'

const props = defineProps({
  preco: { type: [String, Number], required: true },
  anterior: { type: [String, Number], default: null },
})

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const economia = computed(() =>
  props.anterior === null ? 0 : (Math.round(Number(props.anterior) * 100) - Math.round(Number(props.preco) * 100)) / 100,
)
</script>

<template>
  <div class="preco-produto">
    <div class="preco-valores">
      <span v-if="economia > 0" class="preco-anterior">De <s>{{ moeda.format(anterior) }}</s> por</span>
      <strong>{{ moeda.format(preco) }}</strong>
    </div>
    <span v-if="economia > 0" class="preco-aviso">Preço baixou · Economize {{ moeda.format(economia) }}</span>
  </div>
</template>

<style scoped>
.preco-produto {
  display: grid;
  justify-items: start;
  gap: 4px;
}
.preco-valores {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}
.preco-valores strong {
  color: var(--brand);
}
.preco-anterior,
.preco-aviso {
  font-size: .82rem;
}
.preco-anterior {
  color: var(--muted);
}
.preco-aviso {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--surface-accent);
  color: var(--brand-hover);
  font-weight: 700;
}
</style>

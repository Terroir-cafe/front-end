<script setup>
defineProps({
    type: {
        type: String,
        default: 'button'
    },
    variant: {
        type: String,
        default: 'primary'
    },
    disabled: Boolean
})
</script>
<template>
  <button class="botao app-button" :type="type" :disabled="disabled" :class="`variant-${variant}`">
    <slot />
  </button>
</template>
<style scoped>
.variant-secondary {
  background: var(--surface);
  border-color: var(--line);
  color: var(--brand);
}
.variant-secondary:hover {
  background: var(--surface-accent);
}
.variant-danger {
  background: var(--surface);
  border-color: var(--line);
  color: #922d27;
}
.variant-danger:hover {
  background: #fff1ef;
}
</style>

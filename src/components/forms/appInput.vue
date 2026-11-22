<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  autocomplete: String,
  required: Boolean
})

const id = useId()
const emit = defineEmits(['update:modelValue', 'input'])

const value = computed({
  get: () => props.modelValue ?? '',
  set: (val) => {
    emit('update:modelValue', val)
    emit('input', val)
  }
})
</script>

<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required">*</span>
    </label>

    <input
      :id="id"
      v-model="value"
      :autocomplete="autocomplete"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="input"
    />
  </div>

</template>
<style scoped>
.label{
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: bold;
  color: var(--ink);
}
.required{
  color: red;
}
input{
  width:100%;
  min-height: 48px;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  background: var(--surface);
  color: var(--ink);
  transition: border-color 0.3s;
}
input:focus{
  border-color: var(--brand);
}

</style>
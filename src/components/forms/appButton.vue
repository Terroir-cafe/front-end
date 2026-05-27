<script setup>
defineProps({
    type: {
        type: String,
        default: 'primary'
    },
    variant: {
        type: String,
        default: 'default'
    },
    disabled: Boolean
})
</script>
<template>
<div>
    <button 
    class="app-button"
    :type="type"
    :disabled="disabled"
    :class="['app-button', `variant-${variant}`]"
    >
        <slot></slot>
    </button>
</div>
</template>
<style scoped>
.app-button {
    padding: 10px 20px;
    border: none;
    min-height: 48px;
    border-radius: 56px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease opacity 0.2s transform 0.1s;
}
.app-button :active{
    transform: scale(0.98)
}
.app-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.variant-primary {
    background-color: #74403e;
    color: #fff;
}
.variant-secondary {
    background-color: #fff;
    color: #74403e;
}
.variant-danger {
    background-color: #e74c3c;
    color: #fff;
}
</style>
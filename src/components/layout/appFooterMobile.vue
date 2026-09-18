<script setup>
import { mdiCartOutline, mdiHomeVariant, mdiPackageVariant, mdiAccountCircle } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
</script>

<template>
    <nav class="mobile-footer" aria-label="Navegação principal">
        <RouterLink to="/" class="footer-link" active-class="footer-link-active">
            <SvgIcon type="mdi" :path="mdiHomeVariant" class="footer-icon" />
            <span>Início</span>
        </RouterLink>

        <RouterLink to="/pesquisa" class="footer-link" active-class="footer-link-active">
            <SvgIcon type="mdi" :path="mdiPackageVariant" class="footer-icon" />
            <span>Produtos</span>
        </RouterLink>

        <button class="footer-link footer-link-disabled" type="button" disabled aria-label="Carrinho em breve">
            <SvgIcon type="mdi" :path="mdiCartOutline" class="footer-icon" />
            <span>Carrinho</span>
        </button>

        <RouterLink to="/usuario" class="footer-link" active-class="footer-link-active">
            <SvgIcon type="mdi" :path="mdiAccountCircle" class="footer-icon" />
            <span>Perfil</span>
        </RouterLink>
    </nav>
</template>

<style scoped>
.mobile-footer {
    display: none;
}

@media (max-width: 600px) {
    .mobile-footer {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 20;
        display: flex !important;
        width: 100%;
        flex-direction: row !important;
        align-items: stretch;
        justify-content: space-around;
        gap: 4px;
        padding: 10px 12px max(10px, env(safe-area-inset-bottom));
        background: #6d423b;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.24);
    }

    .footer-link {
        display: flex !important;
        width: 25% !important;
        flex: 1 1 25% !important;
        min-width: 0;
        min-height: 52px;
        align-items: center;
        justify-content: center;
        gap: 4px;
        flex-direction: column;
        color: #8d909b;
        background: transparent;
        border: 0;
        font: inherit;
        font-size: 11px;
        text-decoration: none;
        transition: color 0.2s ease, transform 0.2s ease;
    }

    .footer-link:active {
        transform: translateY(1px);
    }

    .footer-link-active {
        color: #f4f1f8;
    }

    .footer-icon {
        width: 23px;
        height: 23px;
    }

    .footer-link-disabled {
        cursor: not-allowed;
        opacity: 0.58;
    }
}
</style>
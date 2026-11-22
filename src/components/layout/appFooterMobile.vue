<script setup>
import { mdiCartOutline, mdiHomeVariant, mdiPackageVariant, mdiAccountCircle, mdiBellOutline, mdiHeartOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { useCarrinhoStore } from '@/stores/carrinho'
import { useAuthStore } from '@/stores/auth'
import { useNotificacoesStore } from '@/stores/notificacoes'

const auth = useAuthStore()
const carrinho = useCarrinhoStore()
const notificacoes = useNotificacoesStore()
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

        <RouterLink v-if="auth.isAuthenticated" to="/favoritos" class="footer-link" active-class="footer-link-active">
            <SvgIcon type="mdi" :path="mdiHeartOutline" class="footer-icon" aria-hidden="true" />
            <span>Favoritos</span>
        </RouterLink>

        <RouterLink to="/cart" class="footer-link" active-class="footer-link-active"
            :aria-label="`Carrinho, ${carrinho.quantidadeTotal} itens`">
            <span class="footer-icone-com-contador" aria-hidden="true">
                <SvgIcon type="mdi" :path="mdiCartOutline" class="footer-icon" />
                <span v-if="carrinho.quantidadeTotal" class="footer-contador">
                    {{ carrinho.quantidadeTotal > 99 ? '99+' : carrinho.quantidadeTotal }}
                </span>
            </span>
            <span>Carrinho</span>
        </RouterLink>

        <RouterLink v-if="auth.isAuthenticated" to="/notificacoes" class="footer-link" active-class="footer-link-active"
            :aria-label="`Notificações, ${notificacoes.naoLidas} não lidas`">
            <span class="footer-icone-com-contador" aria-hidden="true">
                <SvgIcon type="mdi" :path="mdiBellOutline" class="footer-icon" />
                <span v-if="notificacoes.naoLidas" class="footer-contador">
                    {{ notificacoes.naoLidas > 99 ? '99+' : notificacoes.naoLidas }}
                </span>
            </span>
            <span>Alertas</span>
        </RouterLink>

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
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: stretch;
        justify-content: space-around;
        gap: 2px;
        padding: 10px 8px max(10px, env(safe-area-inset-bottom));
        background: var(--header);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.24);
    }

    .footer-link {
        display: flex;
        flex: 1 1 0;
        min-width: 0;
        min-height: 52px;
        align-items: center;
        justify-content: center;
        gap: 4px;
        flex-direction: column;
        color: #f4e5dc;
        background: transparent;
        border: 0;
        font: inherit;
        font-size: clamp(10px, 2.8vw, 11px);
        text-decoration: none;
        transition: color 0.2s ease, transform 0.2s ease;
    }

    .footer-link:active {
        transform: translateY(1px);
    }

    .footer-link-active {
        color: var(--caramelo);
    }

    .footer-icone-com-contador {
        position: relative;
        display: flex;
    }

    .footer-contador {
        position: absolute;
        top: -5px;
        left: 65%;
        min-width: 16px;
        padding: 0 3px;
        border-radius: 999px;
        background: var(--caramelo);
        color: #442d29;
        font-size: 10px;
        font-weight: 800;
        text-align: center;
    }

    .footer-icon {
        width: 23px;
        height: 23px;
    }

}
</style>
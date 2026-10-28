<script setup>
import { mdiCoffee, mdiShieldCheck, mdiInstagram, mdiCopyright } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
</script>
<template>
    <div class="footer">
    <div class="footer-logo">
            <SvgIcon type="mdi" :path="mdiCoffee" class="footer-logo-icon" /> TerroirCafé
        </div>
        <div class="footer-shield">
            <SvgIcon type="mdi" :path="mdiShieldCheck" class="footer-shield-icon" />
        </div>
        <div class="footer-text">
                Conheça mais dos nossos objetivos e histórias aqui em
                <RouterLink to="/sobre" class="footer-about">Sobre nós</RouterLink>
        </div>
        <div class="footer-social">
            <SvgIcon type="mdi" :path="mdiInstagram" class="footer-social-icon" />
        </div>
        <div class="footer-copy">
            <SvgIcon type="mdi" :path="mdiCopyright" class="footer-copy-icon" />
            <span>all rights<br>Reserved</span>
        </div>
    </div>
</template>

<style scoped>
    .footer {
        background-color: #6d423b;
        color: white;
        border-radius: 15px 15px 0px 0px;
        position: relative;
        padding: 25px 20px 20px 20px;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: auto auto auto;
        gap: 15px;
        margin-top: 1vh
    }

    .footer-logo {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        font-size: 18px;
        font-weight: 700;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 10px;
        display: inline-block;
        width: max-content;
    }

    .footer-shield {
        grid-column: 3 / 4;
        grid-row: 2 / 3;
        text-align: right;
    }

    .footer-text {
        grid-column: 1 / 3;
        grid-row: 2 / 3;
        font-size: 15px;
        font-weight: bold;
        line-height: 1.4;
        max-width: 80%;
    }

    .footer-social {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
        display: flex;
        align-items: flex-end;
    }

    .footer-about {
        color: white;
        font-size: 15px;
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 4px;
        transition: color 0.2s ease;
    }

    .footer-about:hover {
        color: #e8b88e;
    }

    .footer-logo-icon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
    }

    .footer-shield-icon {
        width: 24px;
        height: 24px;
    }

    .footer-social-icon {
        width: 20px;
        height: 20px;
        transition: color 0.3s;
    }

    .footer-copy {
        grid-column: 3 / 4;
        grid-row: 3 / 4;
        text-align: right;
        font-size: 9px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .footer-copy-icon {
        width: 14px;
        height: 14px;
        margin-bottom: 3px;
    }
</style>
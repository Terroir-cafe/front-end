<template>
    <div class="footer">
    <div class="footer-logo">
            <i class="mdi mdi-coffee" style="font-size: 14px; margin-right: 5px;"></i> TerroirCafé
        </div>
        <div class="footer-shield">
            <i class="mdi mdi-shield-alt"></i>
        </div>
        <div class="footer-text">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </div>
        <div class="footer-social">
            <i class="mdi mdi-instagram"></i>
        </div>
        <div class="footer-copy">
            <i class="mdi mdi-copyright"></i>
            <span>all rights<br>Reserved</span>
        </div>
    </div>
</template>

<style scoped>
    .footer {
        background-color: #6d423b;
        color: white;
        border-radius: 15px;
        padding: 25px 20px 20px 20px;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto auto;
        gap: 15px;
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
        grid-column: 2 / 3;
        grid-row: 1 / 2;
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

    .footer-social i {
        font-size: 20px;
        transition: color 0.3s;
    }

    .footer-copy {
        grid-column: 2 / 3;
        grid-row: 3 / 4;
        text-align: right;
        font-size: 9px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .footer-copy i {
        font-size: 14px;
        margin-bottom: 3px;
    }
</style>
<template>
    <div class="content">
        
        <div class="section-title-container">
            <h2 class="section-title">Quem somos ?</h2>
        </div>
        <div class="text-card">  
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>

        <div class="section-title-container">
            <h2 class="section-title">Nossa Missão</h2>
        </div>
        <div class="text-card">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>

        <div class="section-title-container">
            <h2 class="section-title">Nossos Valores</h2>
        </div>
        
        <div class="value-card">
            <i class="mdi mdi-coffee"></i>
            <span>Qualidade</span>
        </div>
        
        <div class="value-card">  
        <i class="mdi mdi-currency-usd"></i>
            <span>Preço Baixo</span>
        </div>
        
        <div class="value-card">
            <i class="mdi mdi-truck"></i>
            <span>Entrega Rápida</span>
        </div>

    </div>
</template>

<style scoped>
        .content {
            padding: 0 20px 30px 20px;
            flex: 1;
            margin-top: -10px; 
        }

        .section-title-container {
            text-align: center;
            margin: 25px 0 15px 0;
        }

        .section-title {
            color: #6d423b;
            font-size: 22px;
            font-weight: 700;
            display: inline-block;
            position: relative;
            padding-bottom: 5px;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: -20%;
            width: 140%;
            height: 2px;
            background-color: #6d423b;
        }

        .text-card {
            background-color: #e2c29f;
            border-radius: 12px;
            padding: 25px 20px;
            color: #000;
            font-size: 13px;
            font-weight: 700;
            text-align: center; 
            line-height: 1.5;
            margin-bottom: 10px;
        }

        .value-card {
            background-color: #e2c29f;
            border-radius: 4px;
            padding: 15px 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center; 
            gap: 15px;
            color: #6d423b;
            font-weight: 700;
            font-size: 16px;
        }

        .value-card i {
            font-size: 20px;
            color: #000; 
        }
</style>
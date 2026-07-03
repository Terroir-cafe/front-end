<template>
    <div class="about-container">
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
            
            <div class="values-grid">
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

        </div>
    </div>
</template>

<style scoped> 
        /* Wrapper global para centralizar a página inteira no desktop */
        .about-container {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .content {
            padding: 0 20px 30px 20px;
            flex: 1;
            margin-top: -10px; 
            max-width: 100%; /* No mobile ocupa tudo */
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
            margin-top: 30px;
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

        /* Container dos valores empilhado por padrão no mobile */
        .values-grid {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
        }

        .value-card {
            background-color: #e2c29f;
            border-radius: 4px;
            padding: 15px 20px;
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

        /* --- DESIGN RESPONSIVO (Desktop) --- */
        @media (min-width: 1024px) {
            .content {
                max-width: 900px; /* Evita que o texto estique infinitamente nas laterais */
                padding: 40px 20px;
            }

            .section-title {
                font-size: 26px; /* Títulos ligeiramente maiores no desktop */
            }

            .text-card {
                font-size: 15px; /* Aumenta o texto para melhor leitura em telas grandes */
                padding: 35px 40px;
                border-radius: 16px;
                line-height: 1.6;
            }

            /* Distribui os 3 cards de valores lado a lado simetricamente */
            .values-grid {
                flex-direction: row;
                justify-content: space-between;
                gap: 20px;
                margin-top: 10px;
            }

            .value-card {
                flex: 1; /* Faz com que todos os três cards tenham exatamente o mesmo tamanho */
                padding: 25px 20px;
                border-radius: 8px; /* Cantos um pouco mais suaves que combinam com o desktop */
                flex-direction: column; /* Ícone em cima, texto embaixo para um visual mais "card" */
                gap: 10px;
            }

            .value-card i {
                font-size: 28px; /* Destaca mais os ícones no desktop */
            }
        }
</style>
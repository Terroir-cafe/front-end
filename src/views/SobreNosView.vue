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
.about-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content {
  width: 100%;
  max-width: 1200px;
  padding: 30px 20px;
  box-sizing: border-box;
}

.section-title-container {
  text-align: center;
  margin: 30px 0 20px 0;
}

.section-title {
  color: #74403e;
  font-size: 26px;
  font-weight: 700;
  display: inline-block;
  position: relative;
  padding-bottom: 8px;
  margin: 0;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #74403e;
  border-radius: 2px;
}

.text-card {
  background-color: #e8b88e;
  border-radius: 20px;
  padding: 24px 28px;
  color: #333333;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 10px;
}

.value-card {
  background-color: #ffffff;
  border: 1px solid #e8b88e;
  border-radius: 20px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #74403e;
  font-weight: 700;
  font-size: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(116, 64, 62, 0.12);
}

.value-card i {
  font-size: 32px;
  color: #74403e;
}

@media (min-width: 768px) {
  .values-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
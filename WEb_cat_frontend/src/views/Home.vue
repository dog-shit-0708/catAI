<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <div class="tag">WUST CAMPUS CATS</div>
          <h1 class="hero-title">
            毛毛务克蛋
          </h1>
          <p class="hero-subtitle hero-subtitle-small">
            武汉科技大学校园流浪猫信息管理平台
          </p>
          <p class="hero-subtitle">
            在这里可以查询猫咪的具体信息，添加投喂记录，收藏你感兴趣的猫咪，与猫咪AI助手对话，进行AI识猫、了解领养、喂养、常见知识误区的对话。
          </p>
          <div class="hero-buttons">
            <router-link to="/chat" class="btn-primary">
              立即对话 / CHAT NOW
              <span>→</span>
            </router-link>
            <router-link to="/archives" class="btn-secondary">
              查看档案 /<br>PROFILES
            </router-link>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="image-container">
            <img src="../../assets/images/cat_05.jpg" alt="Orange Soda 猫咪">
            <div class="image-tag">#001 ORANGE_SODA</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-divider"></div>
        
        <div class="features-grid">
          <!-- Feature 1 -->
          <div class="feature-item">
            <div class="feature-icon" style="background: var(--color-cat-orange);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </div>
            <h3 class="feature-title">档案浏览 <span style="opacity: 0.5;">/ PROFILES</span></h3>
            <p class="feature-desc">
              查看校园流浪猫的详细档案，包括照片、性格特点、健康状况和出没地点等信息。
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-item">
            <div class="feature-icon" style="background: var(--color-cat-pink);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 class="feature-title">AI对话 <span style="opacity: 0.5;">/ AI CHAT</span></h3>
            <p class="feature-desc">
              与AI猫咪助手对话，了解校园猫咪的趣事、喂养知识和猫咪识别等相关信息。
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="feature-item">
            <div class="feature-icon" style="background: white;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <h3 class="feature-title">猫咪识别 <span style="opacity: 0.5;">/ CAT IDENTIFY</span></h3>
            <p class="feature-desc">
              上传猫咪照片，AI将自动识别这是哪只校园猫咪，帮助记录和追踪校园流浪猫的信息。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Residents Section -->
    <section class="residents-section">
      <div class="container">
        <div class="residents-header">
          <div>
            <p class="residents-label">CURRENT RESIDENTS</p>
            <h2 class="residents-title">本期<span style="font-family: var(--font-hand);">居民</span></h2>
          </div>
          <router-link to="/archives" class="residents-link">查看全部 / VIEW ALL →</router-link>
        </div>
        
        <div class="residents-grid">
          <div class="resident-card">
            <div class="resident-image">
              <img src="../../assets/images/cat_05.jpg" alt="Orange Soda">
            </div>
            <div class="resident-info">
              <h3 class="resident-name">ORANGE_SODA <span>/ 001</span></h3>
              <p class="resident-trait">Playful & Curious</p>
            </div>
            <router-link to="/cat/1" class="resident-arrow">→</router-link>
          </div>
          
          <div class="resident-card resident-card-offset">
            <div class="resident-image">
              <img src="../../assets/images/cat_01.jpg" alt="Shadow">
            </div>
            <div class="resident-info">
              <h3 class="resident-name">SHADOW <span>/ 002</span></h3>
              <p class="resident-trait">Quiet & Observant</p>
            </div>
            <router-link to="/cat/2" class="resident-arrow">→</router-link>
          </div>
          
          <div class="resident-card">
            <div class="resident-image">
              <img src="../../assets/images/cat_02.jpg" alt="Mochi">
            </div>
            <div class="resident-info">
              <h3 class="resident-name">MOCHI <span>/ 003</span></h3>
              <p class="resident-trait">Soft & Cuddly</p>
            </div>
            <router-link to="/cat/3" class="resident-arrow">→</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-paw">🐾</div>
        <h2 class="cta-title">准备好开始了吗？</h2>
        <p class="cta-desc">
          每一只猫咪都在等待与你相遇。<br>
          开启对话，探索它们独特的灵魂世界。
        </p>
        <router-link to="/chat" class="cta-btn">开始对话 / START CHAT</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Section */
.hero {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 0 60px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 3rem;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-cat-orange);
  color: var(--color-black);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 2px solid var(--color-black);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
}

.hero-title .highlight {
  color: var(--color-cat-orange);
  font-family: var(--font-hand);
  font-size: 1.1em;
  font-weight: 400;
}

.hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  opacity: 0.75;
  max-width: 380px;
}

.hero-subtitle-small {
  font-size: 0.875rem;
  opacity: 0.6;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.125rem 2rem;
  background: var(--color-black);
  color: var(--color-bg);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  border: 2px solid var(--color-black);
  transition: all 0.2s ease;
  cursor: pointer;
  line-height: 1.4;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.125rem 2rem;
  background: transparent;
  color: var(--color-black);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  border: 2px solid var(--color-black);
  transition: all 0.2s ease;
  cursor: pointer;
  line-height: 1.4;
  text-align: center;
}

.btn-secondary:hover {
  background: var(--color-cat-pink);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  position: relative;
  background: white;
  border: 2px solid var(--color-black);
  padding: 1.5rem;
}

.image-container::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--color-black);
  z-index: -1;
}

.image-container img {
  width: 100%;
  max-width: 500px;
  height: 400px;
  object-fit: cover;
  display: block;
  filter: grayscale(100%);
  transition: filter 0.5s ease;
}

.image-container:hover img {
  filter: grayscale(0%);
}

.image-tag {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-cat-pink);
  color: var(--color-black);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: 2px solid var(--color-black);
}

/* Features Section */
.features-section {
  padding: 4rem 3rem 6rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.features-divider {
  height: 2px;
  background: var(--color-black);
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border: 2px solid var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-black);
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.feature-desc {
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.8;
}

/* Residents Section */
.residents-section {
  background: var(--color-black);
  color: var(--color-bg);
  padding: 4rem 3rem;
}

.residents-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.residents-label {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-cat-orange);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.residents-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-bg);
}

.residents-link {
  color: var(--color-bg);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-bottom: 1px solid var(--color-bg);
  padding-bottom: 2px;
  transition: color 0.2s ease;
}

.residents-link:hover {
  color: var(--color-cat-orange);
  border-color: var(--color-cat-orange);
}

.residents-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
}

.resident-card {
  position: relative;
}

.resident-card-offset {
  margin-top: 3rem;
}

.resident-image {
  background: white;
  border: 4px solid var(--color-bg);
  overflow: hidden;
}

.resident-image img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.5s ease;
  display: block;
}

.resident-image:hover img {
  filter: grayscale(0%);
}

.resident-info {
  margin-top: 1rem;
}

.resident-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-bg);
  letter-spacing: 0.02em;
}

.resident-name span {
  opacity: 0.8;
}

.resident-trait {
  font-size: 0.75rem;
  color: var(--color-bg);
  opacity: 0.5;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
  text-transform: uppercase;
}

.resident-arrow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-bg);
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.resident-arrow:hover {
  background: var(--color-cat-orange);
  border-color: var(--color-cat-orange);
  color: var(--color-black);
}

/* CTA Section */
.cta-section {
  padding: 3rem;
  background: var(--color-bg);
}

.cta-container {
  position: relative;
  background: white;
  border: 3px solid var(--color-black);
  padding: 4rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.cta-paw {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 4rem;
  opacity: 0.15;
  transform: rotate(-15deg);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
  color: var(--color-black);
}

.cta-desc {
  font-size: 1rem;
  color: var(--color-black);
  opacity: 0.7;
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

.cta-btn {
  display: inline-block;
  padding: 1rem 3rem;
  background: var(--color-cat-orange);
  color: var(--color-black);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  border: 2px solid var(--color-black);
  transition: all 0.2s ease;
}

.cta-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

/* Responsive */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding: 1.5rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .hero-subtitle {
    max-width: 100%;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .image-container img {
    max-width: 350px;
    height: 280px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .residents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .resident-card-offset {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
  
  .image-container img {
    height: 240px;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .features-section {
    padding: 3rem 1.5rem 4rem;
  }
  
  .residents-section {
    padding: 3rem 1.5rem;
  }
  
  .residents-grid {
    grid-template-columns: 1fr;
  }

  .residents-title {
    font-size: 2rem;
  }
  
  .cta-container {
    padding: 3rem 1.5rem;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
}
</style>

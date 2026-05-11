<template>
  <div class="about">
    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-header">
          <div class="mission-tag">OUR MISSION</div>
          <h2 class="mission-title">让爱不再流浪</h2>
          <p class="mission-subtitle">科学控制流浪猫数量，守护校园生态平衡</p>
        </div>

        <div class="mission-stats">
          <div class="stat-item">
            <div class="stat-number">151</div>
            <div class="stat-label">已绝育猫咪</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔬</div>
            <div class="stat-label">科学TNR管理</div>
          </div>
        </div>

        <div class="mission-content">
          <div class="mission-do">
            <h3>✅ 我们这样做</h3>
            <ul>
              <li>主营 TNR（诱捕-绝育-放归），科学控制流浪猫数量</li>
              <li>不定期发布校园小流浪信息，记录猫咪动态</li>
              <li>保护猫咪安全，不在网上暴露具体位置</li>
            </ul>
          </div>
          <div class="mission-dont">
            <h3>❌ 我们不这样做</h3>
            <ul>
              <li>不救助校外遗弃猫咪，专注校内流浪猫管理</li>
              <li>不接奶猫，避免干扰母猫哺育</li>
              <li>不支持宿舍养猫，禁止宿舍内喂猫</li>
              <li>禁止猫条投喂，提倡科学喂养</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="about-content">
      <div class="about-section">
        <h2>项目简介</h2>
        <p>
          武汉科技大学校园流浪猫信息管理平台，致力于为校园流浪猫建立完整的数字化档案。
          通过AI技术辅助管理，我们希望为校园猫咪提供更好的照护，同时促进师生对流浪动物的关注与关爱。
        </p>
      </div>

      <div class="about-section">
        <h2>核心功能</h2>
        <ul>
          <li>📋 <strong>猫咪档案</strong> - 查询校园流浪猫的具体信息</li>
          <li>📝 <strong>投喂记录</strong> - 添加和查看猫咪投喂记录</li>
          <li>⭐ <strong>收藏关注</strong> - 收藏你感兴趣的猫咪</li>
          <li>🤖 <strong>AI助手</strong> - 与猫咪AI助手对话</li>
          <li>🔍 <strong>AI识猫</strong> - 上传照片识别猫咪身份</li>
          <li>🏠 <strong>领养信息</strong> - 了解猫咪领养相关流程</li>
          <li>📚 <strong>知识科普</strong> - 喂养知识、常见误区解答</li>
        </ul>
      </div>

      <div class="about-section">
        <h2>关注我们</h2>
        <p>获取最新校园流浪猫动态，欢迎通过以下平台关注我们：</p>
        <div class="social-links">
          <div class="social-item">
            <span class="social-icon">📕</span>
            <span class="social-name">小红书</span>
          </div>
          <div class="social-item">
            <span class="social-icon">🎵</span>
            <span class="social-name">抖音</span>
          </div>
          <div class="social-item">
            <span class="social-icon">💬</span>
            <span class="social-name">微信公众号</span>
          </div>
        </div>
        <p class="social-username">搜索账号：<strong>@毛毛务克蛋</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-hero {
  padding: 8rem 3rem 4rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.highlight {
  font-family: var(--font-hand);
  color: var(--color-coral);
}

.section-subtitle {
  text-align: center;
  font-size: 1rem;
  margin-bottom: 3rem;
  opacity: 0.7;
}

/* Mission Section */
.mission-section {
  padding: 4rem 3rem;
  background: linear-gradient(135deg, #FFFCF9 0%, #FFF5ED 100%);
  border-top: 3px solid var(--color-black);
  border-bottom: 3px solid var(--color-black);
  margin-bottom: 3rem;
}

.mission-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.mission-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-coral);
  border: 2px solid var(--color-black);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.mission-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.mission-subtitle {
  font-size: 1rem;
  opacity: 0.7;
  font-weight: 500;
}

.mission-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 2.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-coral);
  line-height: 1;
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.8;
  font-weight: 600;
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.mission-do, .mission-dont {
  background: white;
  border: 3px solid var(--color-black);
  padding: 1.5rem;
}

.mission-do h3, .mission-dont h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-black);
}

.mission-do ul, .mission-dont ul {
  list-style: none;
}

.mission-do li, .mission-dont li {
  padding: 0.6rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  border-bottom: 1px dashed rgba(26, 26, 26, 0.2);
}

.mission-do li:last-child, .mission-dont li:last-child {
  border-bottom: none;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 3rem 4rem;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-black);
}

.about-section p {
  line-height: 1.8;
  opacity: 0.85;
  margin-bottom: 1rem;
}

.about-section ul {
  list-style: none;
}

.about-section li {
  padding: 0.75rem 0;
  border-bottom: 1px dashed rgba(26, 26, 26, 0.2);
}

.social-links {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid var(--color-black);
  font-weight: 600;
}

.social-icon {
  font-size: 1.25rem;
}

.social-username {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-black);
  color: var(--color-bg);
  text-align: center;
}

.social-username strong {
  color: var(--color-cat-orange);
  font-size: 1.25rem;
}

@media (max-width: 968px) {
  .mission-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .mission-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .social-links {
    flex-direction: column;
    gap: 0.75rem;
  }

  .social-item {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .mission-section {
    padding: 2.5rem 1.5rem;
  }

  .mission-title {
    font-size: 1.75rem;
  }

  .mission-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .about-content {
    padding: 0 1.5rem 3rem;
  }
}
</style>

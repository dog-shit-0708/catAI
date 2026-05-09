<template>
  <div class="about">
    <div class="about-hero">
      <h1 class="section-title">关于<span class="highlight">我们</span></h1>
      <p class="section-subtitle">MEOWASSIST - AI 猫咪伴侣平台</p>
    </div>

    <div class="about-content">
      <div class="about-section">
        <h2>项目简介</h2>
        <p>
          MEOWASSIST 是一个采用极简主义美学设计的 AI 猫咪交互空间。
          通过素描风格的档案展示与深度 AI 对话，我们希望为用户开启一段纯粹的治愈之旅。
        </p>
      </div>

      <div class="about-section">
        <h2>核心功能</h2>
        <ul>
          <li>🎨 <strong>素描档案</strong> - 每只猫咪都有独特的档案展示</li>
          <li>💬 <strong>智能对话</strong> - 与 AI 猫咪进行深度交流</li>
          <li>🏠 <strong>领养系统</strong> - 了解猫咪领养信息</li>
          <li>🔍 <strong>拍照识猫</strong> - 上传照片识别猫咪品种</li>
        </ul>
      </div>

      <div class="about-section">
        <h2>联系我们</h2>
        <p>如有任何问题或建议，欢迎联系我们：</p>
        <p>Email: hello@meowassist.com</p>
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

@media (max-width: 640px) {
  .about-content {
    padding: 0 1.5rem 3rem;
  }
}
</style>

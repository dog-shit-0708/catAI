<template>
  <div class="about">
    <div class="about-hero">
      <h1 class="section-title">关于<span class="highlight">我们</span></h1>
      <p class="section-subtitle">武汉科技大学校园流浪猫信息管理平台</p>
    </div>

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
        <h2>联系我们</h2>
        <p>如有任何问题或建议，欢迎联系我们：</p>
        <p>Email: catcare@wust.edu.cn</p>
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

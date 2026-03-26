<template>
  <div class="profile">
    <header class="header">
      <h1>👤 我的</h1>
    </header>

    <div class="content">
      <div class="user-card">
        <div class="avatar">😊</div>
        <div class="user-info">
          <h2>猫咪爱好者</h2>
          <p>已加入 30 天</p>
        </div>
      </div>

      <div class="achievements">
        <h3>我的成就</h3>
        <div class="badges">
          <div class="badge">
            <div class="icon">💕</div>
            <div class="name">爱心铲屎官</div>
          </div>
          <div class="badge">
            <div class="icon">📸</div>
            <div class="name">识猫达人</div>
          </div>
          <div class="badge">
            <div class="icon">🎯</div>
            <div class="name">投喂专家</div>
          </div>
        </div>
      </div>

      <div class="stats">
        <h3>我的数据</h3>
        <div class="stat-list">
          <div class="stat-item">
            <span class="label">总投喂次数</span>
            <span class="value">12 次</span>
          </div>
          <div class="stat-item">
            <span class="label">投喂猫咪</span>
            <span class="value">8 只</span>
          </div>
          <div class="stat-item">
            <span class="label">获得点赞</span>
            <span class="value">25 个</span>
          </div>
        </div>
      </div>

      <div class="menu">
        <div class="menu-item">
          <span>📖 我的投喂记录</span>
          <span>></span>
        </div>
        <div class="menu-item">
          <span>🐱 关注的猫咪</span>
          <span>></span>
        </div>
        <div class="menu-item">
          <span>⚙️ 设置</span>
          <span>></span>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 20px;
  color: #333;
}

.content {
  padding: 15px;
}

.user-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-right: 15px;
}

.user-info h2 {
  color: #333;
  margin-bottom: 5px;
}

.user-info p {
  color: #666;
  font-size: 14px;
}

.achievements {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.achievements h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.badges {
  display: flex;
  gap: 15px;
}

.badge {
  text-align: center;
  flex: 1;
}

.badge .icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.badge .name {
  font-size: 12px;
  color: #666;
}

.stats {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.stats h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item .label {
  color: #666;
}

.stat-item .value {
  color: #667eea;
  font-weight: bold;
}

.menu {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f9fa;
}
</style>
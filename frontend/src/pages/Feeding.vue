<template>
  <div class="feeding">
    <header class="header">
      <h1>📊 投喂统计</h1>
      <button @click="goToAdd" class="add-btn">+ 记录投喂</button>
    </header>

    <div class="content">
      <div class="stats-card">
        <h2>我的投喂数据</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="number">12</div>
            <div class="label">总投喂次数</div>
          </div>
          <div class="stat-item">
            <div class="number">5</div>
            <div class="label">今日投喂</div>
          </div>
          <div class="stat-item">
            <div class="number">8</div>
            <div class="label">投喂猫咪数</div>
          </div>
        </div>
      </div>

      <div class="recent-feeding">
        <h2>最近投喂记录</h2>
        <div class="feeding-list">
          <div class="feeding-item" @click="goToCatDetail('1')">
            <div class="cat-info">
              <div class="cat-avatar">🐱</div>
              <div class="cat-details">
                <div class="cat-name">大橘</div>
                <div class="feeding-time">2小时前</div>
              </div>
            </div>
            <div class="feeding-info">
              <div class="food-type">猫粮</div>
              <div class="food-amount">100g</div>
            </div>
          </div>

          <div class="feeding-item" @click="goToCatDetail('2')">
            <div class="cat-info">
              <div class="cat-avatar">🐈</div>
              <div class="cat-details">
                <div class="cat-name">小花</div>
                <div class="feeding-time">昨天</div>
              </div>
            </div>
            <div class="feeding-info">
              <div class="food-type">罐头</div>
              <div class="food-amount">1个</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const goToAdd = () => {
  router.push('/feeding-add')
}

const goToCatDetail = (catId) => {
  router.push(`/cat-detail/${catId}`)
}
</script>

<style scoped>
.feeding {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 20px;
  color: #333;
}

.add-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.content {
  padding: 15px;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.stats-card h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.number {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.label {
  font-size: 12px;
  color: #666;
}

.recent-feeding h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.feeding-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.feeding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.feeding-item:last-child {
  border-bottom: none;
}

.cat-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.cat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 20px;
}

.cat-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.feeding-time {
  font-size: 12px;
  color: #666;
}

.feeding-info {
  text-align: right;
}

.food-type {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.food-amount {
  font-size: 12px;
  color: #666;
}
</style>
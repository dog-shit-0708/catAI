<template>
  <div class="home">
    <header class="header">
      <h1>🐱 校园流浪猫百科</h1>
      <p>发现身边的毛茸茸朋友们</p>
    </header>

    <div class="content">
      <div class="card">
        <h2>猫咪表情包</h2>
        <div class="cat-gallery">
          <!-- 猫咪列表 -->
          <div class="cat-list">
            <div
              v-for="cat in cats"
              :key="cat.id"
              class="cat-item"
              @click="goToCatDetail(cat.id)"
            >
              <div class="cat-avatar">{{ cat.emoji }}</div>
              <div class="cat-name">{{ cat.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>投喂建议</h2>
        <div class="feeding-tips">
          <p>今日投喂提醒：适量投喂，关爱猫咪健康 💕</p>
          <button @click="goToAiChat" class="btn-primary">
            💬 AI 智能问答
          </button>
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

// Mock cat data
const cats = [
  { id: '1', name: '大橘', emoji: '🐱' },
  { id: '2', name: '小花', emoji: '🐈' },
  { id: '3', name: '小黑', emoji: '😺' }
]

const goToAiChat = () => {
  router.push('/ai-chat')
}

const goToCatDetail = (catId) => {
  router.push(`/cat-detail/${catId}`)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  color: white;
  text-align: center;
  padding: 20px 15px;
  padding-top: max(20px, env(safe-area-inset-top));
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

.content {
  padding: 15px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.card h2 {
  color: #333;
  margin-bottom: 15px;
}

.cat-gallery {
  min-height: 150px;
}

.cat-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.cat-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.cat-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.cat-avatar {
  font-size: 32px;
  margin-bottom: 8px;
}

.cat-name {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.placeholder {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #666;
}

.feeding-tips {
  text-align: center;
}

.feeding-tips p {
  color: #666;
  margin-bottom: 15px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}
</style>
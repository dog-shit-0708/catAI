<template>
  <div class="cat-detail">
    <header class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h1>{{ catInfo?.name || '猫咪详情' }}</h1>
      <button @click="goToFeeding" class="feed-btn">投喂</button>
    </header>

    <div class="content" v-if="catInfo">
      <div class="cat-profile">
        <div class="cat-avatar">🐱</div>
        <div class="cat-basic-info">
          <h2>{{ catInfo.name }}</h2>
          <div class="tags">
            <span class="tag" v-for="tag in catInfo.tags" :key="tag">
              {{ tag }}
            </span>
          </div>
          <p class="location">📍 {{ catInfo.location }}</p>
        </div>
      </div>

      <div class="cat-details">
        <div class="detail-item">
          <span class="label">性别</span>
          <span class="value">{{ catInfo.gender }}</span>
        </div>
        <div class="detail-item">
          <span class="label">年龄</span>
          <span class="value">{{ catInfo.age }}</span>
        </div>
        <div class="detail-item">
          <span class="label">绝育状态</span>
          <span class="value">{{ catInfo.sterilized ? '已绝育' : '未绝育' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">性格</span>
          <span class="value">{{ catInfo.personality }}</span>
        </div>
        <div class="detail-item">
          <span class="label">健康状况</span>
          <span class="value">{{ catInfo.health }}</span>
        </div>
      </div>

      <div class="feeding-history">
        <h3>投喂历史</h3>
        <div class="history-list">
          <div
            v-for="record in feedingHistory"
            :key="record.id"
            class="history-item"
          >
            <div class="time">{{ record.time }}</div>
            <div class="details">
              <span class="food">{{ record.food }}</span>
              <span class="amount">{{ record.amount }}</span>
            </div>
            <div class="feeder">by {{ record.feeder }}</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="goToFeeding" class="action-btn primary">
          🍽️ 我要投喂
        </button>
        <button @click="shareCat" class="action-btn secondary">
          📤 分享猫咪
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const route = useRoute()

const catInfo = ref(null)
const feedingHistory = ref([])

// 模拟数据
const mockCatData = {
  '1': {
    id: '1',
    name: '大橘',
    gender: '公',
    age: '2岁',
    sterilized: true,
    personality: '粘人、温顺',
    health: '健康',
    location: '图书馆门口',
    tags: ['橘猫', '已绝育', '亲人']
  }
}

const mockFeedingHistory = [
  {
    id: 1,
    time: '2小时前',
    food: '猫粮',
    amount: '100g',
    feeder: '匿名用户'
  },
  {
    id: 2,
    time: '昨天 14:30',
    food: '罐头',
    amount: '1个',
    feeder: '猫咪爱好者'
  },
  {
    id: 3,
    time: '昨天 09:15',
    food: '猫粮',
    amount: '80g',
    feeder: '匿名用户'
  }
]

onMounted(() => {
  const catId = route.params.id
  catInfo.value = mockCatData[catId] || mockCatData['1']
  feedingHistory.value = mockFeedingHistory
})

const goBack = () => {
  router.back()
}

const goToFeeding = () => {
  router.push('/feeding-add')
}

const shareCat = () => {
  // TODO: 实现分享功能
  alert('分享功能开发中...')
}
</script>

<style scoped>
.cat-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.back-btn, .feed-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.back-btn {
  color: #666;
}

.feed-btn {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.header h1 {
  font-size: 18px;
  color: #333;
}

.content {
  padding: 15px;
}

.cat-profile {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.cat-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: 20px;
}

.cat-basic-info h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

.tags {
  margin-bottom: 10px;
}

.tag {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 5px;
  display: inline-block;
}

.location {
  color: #666;
  font-size: 14px;
}

.cat-details {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: #666;
}

.detail-item .value {
  color: #333;
  font-weight: bold;
}

.feeding-history {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.feeding-history h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item .time {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.history-item .details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.history-item .food {
  color: #333;
  font-weight: bold;
}

.history-item .amount {
  color: #667eea;
}

.history-item .feeder {
  color: #999;
  font-size: 12px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.action-btn {
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
</style>
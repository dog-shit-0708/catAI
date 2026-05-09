<template>
  <div class="profile-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>加载猫咪档案中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <router-link to="/archives" class="btn-back">返回档案馆</router-link>
    </div>
    
    <!-- 内容 -->
    <div v-else class="profile-content">
      <!-- 图片轮播区域 -->
      <div class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-wrapper">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(img, index) in images" :key="index" class="carousel-slide">
                <img :src="img" :alt="`猫咪照片 ${index + 1}`">
              </div>
            </div>
          </div>
          
          <button class="carousel-btn prev" @click="prevSlide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="carousel-btn next" @click="nextSlide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div class="carousel-dots">
          <button 
            v-for="(_, index) in images" 
            :key="index"
            class="carousel-dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></button>
        </div>
        
        <div class="action-buttons">
          <router-link to="/chat" class="btn-chat">开始对话 / CHAT</router-link>
          <router-link to="/archives" class="btn-back">返回档案馆 / BACK</router-link>
        </div>
      </div>
      
      <!-- 信息区域 -->
      <div class="info-section">
        <div class="info-header">
          <div class="cat-number-badge">#{{ String(cat.id).padStart(3, '0') }}</div>
          <h1 class="cat-name-main">{{ cat.name }}</h1>
          <div class="cat-alias" v-if="cat.alias">
            <span class="alias-label">别名 / ALIAS</span>
            <span>{{ cat.alias }}</span>
          </div>
        </div>
        
        <div class="info-block">
          <h3 class="info-block-title">简介 / BIO</h3>
          <p class="info-block-content">{{ cat.notes || '暂无简介' }}</p>
        </div>
        
        <div class="info-block">
          <h3 class="info-block-title">领养状态 / ADOPTION STATUS</h3>
          <div class="adoption-status">
            <div class="status-badge" :class="statusClass">
              <span class="status-dot"></span>
              <span class="status-text">{{ statusText }}</span>
            </div>
            <p class="adoption-info" v-if="cat.adoption_status === 0">
              这只猫咪正在寻找新的家庭！如果你喜欢它，欢迎联系我们了解更多领养信息。
            </p>
            <p class="adoption-info" v-else-if="cat.adoption_status === 1">
              这只猫咪已经被领养了，恭喜它找到了温暖的家！
            </p>
            <p class="adoption-info" v-else>
              这只猫咪正在领养审核中，请耐心等待。
            </p>
            <div class="adoption-meta">
              <div class="meta-item">
                <span class="meta-label">投喂次数</span>
                <span class="meta-value">{{ cat.feed_count || 0 }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">关注人数</span>
                <span class="meta-value">{{ cat.favorite_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import catsApi from '../api/cats.js'

const route = useRoute()
const cat = ref({})
const loading = ref(true)
const error = ref('')

// 图片列表（使用cover_images或profile_image）
const images = computed(() => {
  if (cat.value.cover_images && cat.value.cover_images.length > 0) {
    return cat.value.cover_images
  }
  if (cat.value.profile_image) {
    return [cat.value.profile_image]
  }
  return ['/assets/images/cat_07.jpg']
})

// 领养状态样式
const statusClass = computed(() => {
  const status = cat.value.adoption_status
  if (status === 0) return 'available'
  if (status === 1) return 'adopted'
  return 'pending'
})

// 领养状态文字
const statusText = computed(() => {
  const status = cat.value.adoption_status
  if (status === 0) return '待领养 / AVAILABLE'
  if (status === 1) return '已领养 / ADOPTED'
  return '领养中 / PENDING'
})

const currentSlide = ref(0)
let autoPlayInterval = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % images.value.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length
}

function goToSlide(index) {
  currentSlide.value = index
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 5000)
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval)
}

// 加载猫咪详情
async function loadCatDetail() {
  loading.value = true
  error.value = ''
  try {
    const catId = route.params.id
    const res = await catsApi.getCat(catId)
    if (res.code === 200 && res.data) {
      cat.value = res.data
    } else {
      error.value = '获取猫咪信息失败'
    }
  } catch (err) {
    console.error('获取猫咪详情失败:', err)
    error.value = err.message || '获取猫咪信息失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCatDetail()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.profile-container {
  padding-top: 70px;
  min-height: 100vh;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.loading-state p, .error-state p {
  font-size: 1.125rem;
  opacity: 0.7;
}

.profile-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 3rem;
}

/* 图片轮播区域 */
.carousel-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.carousel-container {
  position: relative;
  background: white;
  border: 3px solid var(--color-black);
  padding: 1.5rem;
}

.carousel-container::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: -6px;
  bottom: -6px;
  border: 3px solid var(--color-black);
  z-index: -1;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  margin: 0 48px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  flex-shrink: 0;
}

.carousel-slide img {
  width: 100%;
  height: 520px;
  object-fit: cover;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--color-cat-orange);
  border: 2px solid var(--color-black);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.carousel-btn:hover {
  transform: translateY(-50%) translate(-2px, -2px);
  box-shadow: 4px 4px 0px var(--color-black);
}

.carousel-btn.prev {
  left: 24px;
}

.carousel-btn.next {
  right: 24px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid var(--color-black);
  cursor: pointer;
  transition: all 0.2s ease;
}

.carousel-dot.active {
  background: var(--color-cat-orange);
}

.carousel-dot:hover {
  background: var(--color-cat-pink);
}

/* 信息区域 */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-header {
  border-bottom: 3px solid var(--color-black);
  padding-bottom: 1.5rem;
}

.cat-number-badge {
  display: inline-block;
  padding: 0.375rem 1rem;
  background: var(--color-cat-orange);
  border: 2px solid var(--color-black);
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cat-name-main {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.cat-alias {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.7;
}

.alias-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.5rem;
  background: var(--color-cat-pink);
  border: 2px solid var(--color-black);
}

.info-block {
  background: white;
  border: 3px solid var(--color-black);
  padding: 1.5rem;
}

.info-block-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-black);
}

.info-block-content {
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.85;
}

.adoption-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid;
  font-size: 0.875rem;
  font-weight: 700;
  width: fit-content;
}

.status-badge.available {
  background: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
}

.status-badge.available .status-dot {
  background: #4caf50;
}

.status-badge.adopted {
  background: #f5f5f5;
  border-color: #9e9e9e;
  color: #616161;
}

.status-badge.adopted .status-dot {
  background: #9e9e9e;
}

.status-badge.pending {
  background: #fff3e0;
  border-color: #ff9800;
  color: #e65100;
}

.status-badge.pending .status-dot {
  background: #ff9800;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.adoption-info {
  font-size: 0.95rem;
  line-height: 1.7;
  opacity: 0.8;
}

.adoption-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-black);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.meta-value {
  font-size: 0.95rem;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-chat {
  flex: 1;
  padding: 1rem 2rem;
  background: var(--color-black);
  color: var(--color-bg);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;
  text-align: center;
  border: 2px solid var(--color-black);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-chat:hover {
  background: var(--color-cat-orange);
  color: var(--color-black);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

.btn-back {
  padding: 1rem 2rem;
  background: transparent;
  color: var(--color-black);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;
  text-align: center;
  border: 2px solid var(--color-black);
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: var(--color-cat-pink);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

/* 响应式 */
@media (max-width: 968px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 2rem 1.5rem;
  }
  
  .carousel-slide img {
    height: 400px;
  }
  
  .cat-name-main {
    font-size: 2.25rem;
  }
}

@media (max-width: 640px) {
  .carousel-slide img {
    height: 320px;
  }
  
  .cat-name-main {
    font-size: 1.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>

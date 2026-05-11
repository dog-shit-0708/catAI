<template>
  <div class="archives">
    <div class="archives-hero">
      <div class="tag">CAT ARCHIVES</div>
      <h1 class="section-title">猫咪<span class="highlight">档案</span>馆</h1>
      <p class="section-subtitle">探索每一只独特AI猫咪的故事与个性</p>
    </div>

    

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>加载猫咪档案中...</p>
    </div>

    <!-- 猫咪列表 -->
    <div v-else-if="cats.length > 0" class="archives-grid">
      <router-link v-for="cat in cats" :key="cat.id" :to="`/cat/${cat.id}`" class="cat-card">
        <div class="cat-card-image">
          <img 
            :src="resolveCatImageUrl(cat.profile_image)" 
            :alt="cat.name"
            loading="lazy"
            @load="$event.target.classList.add('loaded')"
            class="lazy-image"
          >
          <div class="image-skeleton"></div>
          <div v-if="cat.adoption_status === 1" class="status-badge adopted">已领养</div>
          <div v-else-if="cat.adoption_status === 2" class="status-badge pending">领养中</div>
          <div v-else class="status-badge available">待领养</div>
        </div>
        <div class="cat-card-info">
          <div class="cat-number">#{{ String(cat.id).padStart(3, '0') }}</div>
          <h3 class="cat-name">{{ cat.name }}</h3>
          <p class="cat-alias" v-if="cat.alias">{{ cat.alias }}</p>
        </div>
      </router-link>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无猫咪档案</p>
    </div>

    <!-- 分页 -->
    <div v-if="pagination.total > pagination.page_size" class="pagination">
      <button 
        :disabled="pagination.page <= 1" 
        @click="changePage(pagination.page - 1)"
        class="page-btn"
      >
        上一页
      </button>
      <span class="page-info">{{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.page_size) }}</span>
      <button 
        :disabled="pagination.page >= Math.ceil(pagination.total / pagination.page_size)" 
        @click="changePage(pagination.page + 1)"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import catsApi from '../api/cats.js'
import { resolveCatImageUrl } from '../utils/catImages.js'

const cats = ref([])
const loading = ref(false)



const pagination = reactive({
  page: 1,
  page_size: 12,
  total: 0
})



// 加载猫咪列表
async function loadCats() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.page_size
    }
    
    const res = await catsApi.getCats(params)
    if (res.code === 200 && res.data) {
      // 按 ID 正序排列
      const sortedData = (res.data.data || []).sort((a, b) => a.id - b.id)
      cats.value = sortedData
      pagination.total = res.data.total || 0
      console.log('排序后的猫咪列表:', sortedData.map(c => ({ id: c.id, name: c.name })))
    }
  } catch (err) {
    console.error('获取猫咪列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 切换页码
function changePage(page) {
  pagination.page = page
  loadCats()
}

onMounted(() => {
  loadCats()
})
</script>

<style scoped>
.archives-hero {
  padding: 8rem 3rem 2rem;
  text-align: center;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-cat-orange);
  border: 2px solid var(--color-black);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
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
  margin-bottom: 2rem;
  opacity: 0.7;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem;
  opacity: 0.6;
}

.archives-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem 4rem;
}

.cat-card {
  background: white;
  border: 3px solid var(--color-black);
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.cat-card:hover {
  transform: translate(-6px, -6px);
  box-shadow: 10px 10px 0px var(--color-coral);
}

.cat-card-image {
  position: relative;
  padding: 1.5rem;
  border-bottom: 3px solid var(--color-black);
  background: #f0f0f0;
  overflow: hidden;
}

.cat-card-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 1;
}

.cat-card-image img.loaded {
  opacity: 1;
}

.image-skeleton {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 1.5rem;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  z-index: 0;
}

.cat-card-image img.loaded + .image-skeleton {
  display: none;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.status-badge {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid var(--color-black);
}

.status-badge.available {
  background: #4CAF50;
  color: white;
}

.status-badge.adopted {
  background: #9E9E9E;
  color: white;
}

.status-badge.pending {
  background: #FF9800;
  color: white;
}

.cat-card-info {
  padding: 1.5rem;
}

.cat-number {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-cat-pink);
  border: 2px solid var(--color-black);
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.cat-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.cat-alias {
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.cat-area {
  font-size: 0.8rem;
  opacity: 0.6;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 3rem 4rem;
}

.page-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid var(--color-black);
  font-family: var(--font-main);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-cat-orange);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 968px) {
  .archives-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 1.5rem 3rem;
  }
}

@media (max-width: 640px) {
  .archives-grid {
    grid-template-columns: 1fr;
  }
}
</style>

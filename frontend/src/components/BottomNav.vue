<template>
  <nav class="bottom-nav">
    <button class="nav-item" :class="{ active: currentPath === '/' }" @click="goToPage('/')">🏠 首页</button>
    <button class="nav-item" :class="{ active: currentPath === '/ai-chat' }" @click="goToPage('/ai-chat')">💬 AI问答</button>
    <button class="nav-item" :class="{ active: currentPath === '/feeding' }" @click="goToPage('/feeding')">📊 投喂</button>
    <button class="nav-item" :class="{ active: currentPath === '/profile' }" @click="goToPage('/profile')">👤 我的</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)

const goToPage = (path) => {
  router.push(path)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  border-top: 1px solid #eee;
  padding: 10px 0;
  /* 移动端安全区域适配 */
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  /* 确保导航栏与页面内容一致宽度 */
  max-width: 414px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 100;
}

.nav-item {
  flex: 1;
  border: none;
  background: none;
  padding: 10px 5px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  /* 防止按钮内容溢出 */
  word-break: keep-all;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item.active {
  color: #667eea;
  font-weight: bold;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .nav-item {
    font-size: 11px;
    padding: 8px 3px;
  }
}

@media (max-width: 320px) {
  .nav-item {
    font-size: 10px;
    padding: 6px 2px;
  }
}
</style>
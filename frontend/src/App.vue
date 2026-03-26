<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// App 根组件 - 移动端优化
import { onMounted } from 'vue'

onMounted(() => {
  // 移除加载动画
  const loadingElement = document.querySelector('.app-loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }

  // 移动端适配检测
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) {
    document.body.classList.add('mobile-device')
  }

  // 防止双击缩放
  let lastTouchEnd = 0
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  /* 移动端优化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

#app {
  min-height: 100vh;
  /* 移动端安全区域适配 */
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

/* 移动端特定样式 */
.mobile-device #app {
  /* 防止iOS橡皮筋效果 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 桌面设备模拟移动设备显示 */
@media (min-width: 769px) {
  html {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  body {
    width: 414px !important;
    height: 896px !important;
    border-radius: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }

  #app {
    border-radius: 40px;
    overflow: hidden;
    height: 896px;
  }
}

/* 防止图片拖动 */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  pointer-events: none;
}

/* 选中文本样式优化 */
::selection {
  background-color: rgba(102, 126, 234, 0.3);
}

::-moz-selection {
  background-color: rgba(102, 126, 234, 0.3);
}
</style>
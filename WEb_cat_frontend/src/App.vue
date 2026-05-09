<template>
  <div id="app">
    <Navbar />

    <main>
      <router-view />
    </main>

    <Footer v-if="showFooter" />

    <AuthModal v-model="authStore.showLoginModal" @success="onAuthSuccess" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import AuthModal from './components/AuthModal.vue'

const authStore = useAuthStore()
const route = useRoute()

// 对话页面不显示footer
const showFooter = computed(() => {
  return route.name !== 'Chat'
})

function onAuthSuccess() {
  authStore.fetchProfile()
  alert('欢迎回来！')
}
</script>

<style>
/* 全局样式 */
:root {
  --color-bg: #FFFCF9;
  --color-black: #1A1A1A;
  --color-cat-orange: #FF9E66;
  --color-cat-pink: #FFB7C5;
  --color-coral: #FF6B6B;
  --font-main: 'Plus Jakarta Sans', sans-serif;
  --font-hand: 'Zeyada', cursive;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-main);
  background-color: var(--color-bg);
  color: var(--color-black);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 70px;
}
</style>

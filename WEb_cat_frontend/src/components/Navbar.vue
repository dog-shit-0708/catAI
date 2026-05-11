<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="logo" title="返回首页">
        <div class="logo-icon">🐱</div>
        <span>MEOWASSIST.</span>
      </router-link>

      <ul class="nav-links">
        <li><router-link to="/archives">档案馆 <span style="opacity: 0.5;">/ ARCHIVES</span></router-link></li>
        <li><router-link to="/chat">AI 对话 <span style="opacity: 0.5;">/ DIALOGUE</span></router-link></li>
        <li><router-link to="/about">关于 <span style="opacity: 0.5;">/ ABOUT</span></router-link></li>
      </ul>

      <button v-if="!authStore.isLoggedIn" class="btn-login" @click="showLogin">
        登录 / LOGIN
      </button>
      <button v-else class="btn-login" @click="handleLogout">
        退出 / LOGOUT
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

function showLogin() {
  authStore.setShowLoginModal('login')
}

function handleLogout() {
  authStore.logout()
  alert('已退出登录')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #FFFCF9;
  border-bottom: 2px solid #1A1A1A;
  z-index: 1000;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: #1A1A1A;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border: 2px solid #1A1A1A;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.nav-links {
  display: flex;
  gap: 3rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #1A1A1A;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #FF9E66;
}

.btn-login {
  padding: 0.625rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: 2px solid #1A1A1A;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 未登录状态 - 空心按钮 */
.btn-login--guest {
  background: transparent;
  color: #1A1A1A;
}

.btn-login--guest:hover {
  background: #1A1A1A;
  color: #FFFCF9;
}

/* 已登录状态 - 实心按钮 */
.btn-login--user {
  background: #FF9E66;
  color: #1A1A1A;
}

.btn-login--user:hover {
  background: #1A1A1A;
  color: #FFFCF9;
}

.user-icon {
  font-size: 1rem;
}

@media (max-width: 968px) {
  .nav-links {
    display: none;
  }
  
  .navbar-content {
    padding: 1rem 1.5rem;
  }
}
</style>

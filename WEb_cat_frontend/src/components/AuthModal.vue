<template>
  <!-- 登录弹窗 -->
  <div v-if="modelValue === 'login'" class="modal-overlay" @click="closeOnOverlay">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="close">×</button>
      <div class="modal-header">
        <h2>登录 <span style="opacity: 0.5;">/ LOGIN</span></h2>
      </div>
      <form class="modal-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>邮箱 <span style="opacity: 0.5;">/ EMAIL</span></label>
          <input v-model="loginForm.email" type="email" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <label>密码 <span style="opacity: 0.5;">/ PASSWORD</span></label>
          <input v-model="loginForm.password" type="password" placeholder="••••••••" required minlength="6">
        </div>
        <p v-if="authStore.error" class="form-error">{{ authStore.error }}</p>
        <button type="submit" class="btn-modal" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登录 / LOGIN' }}
        </button>
      </form>
      <div class="modal-footer">
        <p>还没有账号？<a href="#" @click.prevent="switchToRegister">立即注册 / REGISTER</a></p>
      </div>
    </div>
  </div>

  <!-- 注册弹窗 -->
  <div v-if="modelValue === 'register'" class="modal-overlay" @click="closeOnOverlay">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="close">×</button>
      <div class="modal-header">
        <h2>注册 <span style="opacity: 0.5;">/ REGISTER</span></h2>
      </div>
      <form class="modal-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label>昵称 <span style="opacity: 0.5;">/ NICKNAME</span></label>
          <input v-model="registerForm.nickname" type="text" placeholder="你的昵称（可选）">
        </div>
        <div class="form-group">
          <label>邮箱 <span style="opacity: 0.5;">/ EMAIL</span></label>
          <input v-model="registerForm.email" type="email" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <label>密码 <span style="opacity: 0.5;">/ PASSWORD</span></label>
          <input v-model="registerForm.password" type="password" placeholder="至少6位密码" required minlength="6">
        </div>
        <p v-if="authStore.error" class="form-error">{{ authStore.error }}</p>
        <button type="submit" class="btn-modal" :disabled="authStore.loading">
          {{ authStore.loading ? '注册中...' : '注册 / REGISTER' }}
        </button>
      </form>
      <div class="modal-footer">
        <p>已有账号？<a href="#" @click.prevent="switchToLogin">立即登录 / LOGIN</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '' // '', 'login', 'register'
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  email: '',
  password: '',
  nickname: ''
})

// 监听弹窗打开，清空错误
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    authStore.error = ''
  }
})

function close() {
  emit('update:modelValue', '')
  authStore.error = ''
}

function closeOnOverlay(e) {
  if (e.target === e.currentTarget) {
    close()
  }
}

function switchToRegister() {
  emit('update:modelValue', 'register')
  authStore.error = ''
}

function switchToLogin() {
  emit('update:modelValue', 'login')
  authStore.error = ''
}

async function handleLogin() {
  const result = await authStore.login(loginForm.email, loginForm.password)
  if (result.success) {
    emit('success')
    close()
    // 清空表单
    loginForm.email = ''
    loginForm.password = ''
  }
}

async function handleRegister() {
  const result = await authStore.register(
    registerForm.email,
    registerForm.password,
    registerForm.nickname
  )
  if (result.success) {
    emit('success')
    close()
    // 清空表单
    registerForm.email = ''
    registerForm.password = ''
    registerForm.nickname = ''
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: #FFFCF9;
  border: 2px solid #1A1A1A;
  padding: 2.5rem;
  max-width: 420px;
  width: 90%;
  position: relative;
  box-shadow: 8px 8px 0px #1A1A1A;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 2px solid #1A1A1A;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #1A1A1A;
  color: #FFFCF9;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid #1A1A1A;
  background: white;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-group input:focus {
  box-shadow: 4px 4px 0px #1A1A1A;
  transform: translate(-2px, -2px);
}

.form-error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: -0.5rem;
}

.btn-modal {
  padding: 1rem 1.5rem;
  background: #1A1A1A;
  color: #FFFCF9;
  border: 2px solid #1A1A1A;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.btn-modal:hover:not(:disabled) {
  background: #FF9E66;
  color: #1A1A1A;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1A1A1A;
}

.btn-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #1A1A1A;
  text-align: center;
}

.modal-footer p {
  font-size: 0.875rem;
  color: #1A1A1A;
}

.modal-footer a {
  color: #FF9E66;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s ease;
}

.modal-footer a:hover {
  color: #1A1A1A;
}
</style>

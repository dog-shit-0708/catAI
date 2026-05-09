import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authApi from '../api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')
  const showLoginModal = ref('') // '', 'login', 'register'

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  async function register(email, password, nickname = '') {
    loading.value = true
    error.value = ''
    try {
      const res = await authApi.register(email, password, nickname)
      if (res.data && res.data.access_token) {
        token.value = res.data.access_token
        localStorage.setItem('token', res.data.access_token)
        return { success: true }
      }
      return { success: false, message: res.message || '注册失败' }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''
    try {
      const res = await authApi.login(email, password)
      if (res.data && res.data.access_token) {
        token.value = res.data.access_token
        localStorage.setItem('token', res.data.access_token)
        return { success: true }
      }
      return { success: false, message: res.message || '登录失败' }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res = await authApi.getProfile()
      user.value = res.data
      return res.data
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    authApi.logout()
  }

  function setShowLoginModal(value) {
    showLoginModal.value = value
  }

  function clearLoginModal() {
    showLoginModal.value = ''
  }

  return {
    token,
    user,
    loading,
    error,
    showLoginModal,
    isAuthenticated,
    isLoggedIn,
    register,
    login,
    fetchProfile,
    logout,
    setShowLoginModal,
    clearLoginModal
  }
})

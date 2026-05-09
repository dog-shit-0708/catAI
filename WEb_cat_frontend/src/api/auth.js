import axios from 'axios'
import { axiosConfig } from './config.js'

// 创建 axios 实例
const apiClient = axios.create(axiosConfig)

// 请求拦截器 - 自动添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default {
  // 邮箱注册
  register(email, password, nickname = '') {
    return apiClient.post('/auth/web-register', {
      email,
      password,
      nickname
    })
  },

  // 邮箱登录
  login(email, password) {
    return apiClient.post('/auth/web-login', {
      email,
      password
    })
  },

  // 获取用户信息
  getProfile() {
    return apiClient.get('/auth/profile')
  },

  // 更新用户信息
  updateProfile(data) {
    return apiClient.put('/auth/profile', data)
  },

  // 退出登录
  logout() {
    localStorage.removeItem('token')
  }
}

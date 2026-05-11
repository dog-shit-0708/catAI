import axios from 'axios'
import { axiosConfig } from './config.js'

const apiClient = axios.create(axiosConfig)

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}`, new Date().toISOString())
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API响应] ${response.config.url}`, response.status, new Date().toISOString())
    return response.data
  },
  (error) => {
    console.error(`[API错误] ${error.config?.url}`, error.message, new Date().toISOString())
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default apiClient

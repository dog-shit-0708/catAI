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
    console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}`, new Date().toISOString())
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 统一处理错误
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

export default {
  // 获取猫咪列表
  getCats(params = {}) {
    const { keyword, adoption_status, location_area, page = 1, page_size = 20 } = params
    let url = `/cats?page=${page}&page_size=${page_size}`
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
    if (adoption_status !== undefined && adoption_status !== null) url += `&adoption_status=${adoption_status}`
    if (location_area) url += `&location_area=${encodeURIComponent(location_area)}`
    return apiClient.get(url)
  },

  // 获取猫咪详情
  getCat(id) {
    return apiClient.get(`/cats/${id}`)
  },

  // 获取猫咪相册
  getCatGallery(id) {
    return apiClient.get(`/cats/${id}/gallery`)
  },

  // 投喂猫咪
  feedCat(id) {
    return apiClient.post(`/cats/${id}/feed`)
  },

  // 收藏猫咪
  favoriteCat(id) {
    return apiClient.post(`/cats/${id}/favorite`)
  },

  // 上传图片到OSS（猫咪识别前置步骤）- 超时100秒
  uploadIdentifyImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/cats/identify/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 100000 // 100秒超时
    })
  }
}

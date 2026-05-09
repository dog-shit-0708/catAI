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
  // 创建会话
  createConversation(title, chat_type = 1, cat_id = null) {
    return apiClient.post('/chat/conversations', { title, chat_type, cat_id })
  },

  // 获取会话列表
  getConversations(page = 1, page_size = 20) {
    return apiClient.get(`/chat/conversations?page=${page}&page_size=${page_size}`)
  },

  // 获取会话详情
  getConversation(id) {
    return apiClient.get(`/chat/conversations/${id}`)
  },

  // 删除会话
  deleteConversation(id) {
    return apiClient.delete(`/chat/conversations/${id}`)
  },

  // 获取消息列表
  getMessages(conversation_id, page = 1, page_size = 50) {
    return apiClient.get(`/chat/conversations/${conversation_id}/messages?page=${page}&page_size=${page_size}`)
  },

  // 发送消息（核心）- 超时120秒
  sendMessage(conversation_id, content, msg_type = 'text') {
    return apiClient.post('/chat/completions', { conversation_id, content, msg_type }, {
      timeout: 120000 // 120秒超时
    })
  },

  // 消息反馈（点赞/点踩）
  sendFeedback(message_id, feedback_type) {
    return apiClient.post(`/chat/messages/${message_id}/feedback`, { feedback_type })
  },

  // 图片识猫 - 超时100秒
  identifyCat(image_url, conversation_id) {
    let url = `/chat/identify-cat-ark?image_url=${encodeURIComponent(image_url)}`
    if (conversation_id) {
      url += `&conversation_id=${conversation_id}`
    }
    return apiClient.post(url, null, {
      timeout: 100000
    })
  }
}

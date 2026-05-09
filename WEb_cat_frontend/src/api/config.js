// API 配置 - 根据环境自动切换
const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api/v1'
  : 'http://你的服务器IP:8000/api/v1'  // 生产环境替换为实际后端地址

// axios 配置
export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 默认120秒超时
}

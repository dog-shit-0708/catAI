// API 配置
export const API_BASE_URL = 'http://127.0.0.1:9000/api/v1'

// axios 配置
export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 默认120秒超时
}

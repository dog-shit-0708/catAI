// API 配置 - 根据环境自动切换
const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api/v1'
  : 'https://68ee-23-172-200-70.ngrok-free.app/api/v1'  // ngrok 公网后端地址

// axios 配置
export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 默认120秒超时
}

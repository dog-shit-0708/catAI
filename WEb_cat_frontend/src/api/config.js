const isDevelopment = import.meta.env.DEV
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const API_BASE_URL = envApiBaseUrl
  || (isDevelopment
    ? 'http://127.0.0.1:8000/api/v1'
    : 'https://dd46-217-217-222-227.ngrok-free.app/api/v1')

const defaultHeaders = {
  'Content-Type': 'application/json'
}

// Free ngrok domains return an interstitial page unless this header is set.
if (API_BASE_URL.includes('ngrok-free.app')) {
  defaultHeaders['ngrok-skip-browser-warning'] = '1'
}

export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
  timeout: 120000
}

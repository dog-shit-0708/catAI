// API 配置文件
const config = {
  // 开发环境 - 使用 localhost（需开启开发者工具"不校验合法域名"）
  development: {
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 30000
  },
  // 局域网开发 - 用于真机调试（需填写实际IP）
  lan: {
    baseURL: 'http://YOUR_IP:8000/api/v1',
    timeout: 30000
  },
  // 生产环境
  production: {
    baseURL: 'https://your-domain.com/api/v1',
    timeout: 30000
  }
};

// 当前环境 - 可选: 'development'(localhost) / 'lan'(局域网) / 'production'
const env = 'development';

export default config[env];

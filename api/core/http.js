// HTTP 请求基类
import config from '../config';

class HttpClient {
  constructor() {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  // 获取当前token
  getToken() {
    return wx.getStorageSync('access_token');
  }

  // 设置token
  setToken(token) {
    wx.setStorageSync('access_token', token);
  }

  // 清除token
  clearToken() {
    wx.removeStorageSync('access_token');
  }

  // 统一请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      const token = this.getToken();
      const headers = {};

      // 只有有 data 时才设置 Content-Type
      if (options.data !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      
      // 合并自定义 headers
      Object.assign(headers, options.headers);

      if (token && options.auth !== false) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const requestOptions = {
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        header: headers,
        timeout: options.timeout || this.timeout
      };
      
      // 只有 data 不为 undefined 时才添加
      if (options.data !== undefined) {
        requestOptions.data = options.data;
      }

      wx.request({
        ...requestOptions,
        success: (res) => {
          console.log('【HTTP】响应状态:', res.statusCode, 'URL:', options.url);
          if (res.statusCode !== 200) {
            console.log('【HTTP】错误响应:', res.data);
          }
          this.handleResponse(res, resolve, reject);
        },
        fail: (err) => {
          console.error('[HTTP Error]', err);
          reject(new Error('网络请求失败，请检查网络连接'));
        }
      });
    });
  }

  // 响应处理
  handleResponse(res, resolve, reject) {
    const { statusCode, data } = res;

    if (statusCode === 200 && data.code === 200) {
      resolve(data.data);
    } else if (statusCode === 401) {
      this.clearToken();
      wx.showToast({ title: '登录已过期，请重新进入', icon: 'none' });
      reject(new Error('未登录'));
    } else if (statusCode === 403) {
      reject(new Error('权限不足'));
    } else if (statusCode === 404) {
      reject(new Error('请求的资源不存在'));
    } else if (statusCode === 500) {
      reject(new Error('服务器内部错误'));
    } else {
      reject(new Error(data?.message || `请求失败(${statusCode})`));
    }
  }

  // 快捷方法
  get(url, params = {}) {
    // 过滤掉 undefined 和 null 的参数
    const validParams = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    
    const queryString = Object.keys(validParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(validParams[key])}`)
      .join('&');
    return this.request({
      url: queryString ? `${url}?${queryString}` : url,
      method: 'GET'
    });
  }

  post(url, data = null, auth = true) {
    return this.request({
      url,
      method: 'POST',
      data,
      auth
    });
  }

  put(url, data = null) {
    return this.request({
      url,
      method: 'PUT',
      data
    });
  }

  delete(url) {
    return this.request({
      url,
      method: 'DELETE'
    });
  }
}

export const http = new HttpClient();

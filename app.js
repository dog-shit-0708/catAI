// app.js
import { promisifyAll } from 'miniprogram-api-promise';
import { api } from './api/index';

const wxp = wx.p = {};
promisifyAll(wx, wxp);

App({
  async onLaunch() {
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 自动登录获取token
    await this.autoLogin();
  },

  async autoLogin() {
    // 检查是否已有token
    const token = wx.getStorageSync('access_token');
    if (token) {
      console.log('已有token，跳过登录');
      return;
    }

    // 微信登录获取code
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            const loginRes = await api.auth.wechatLogin(res.code);
            console.log('登录成功:', loginRes);
          } catch (error) {
            console.error('登录失败:', error);
          }
        }
      },
      fail: (err) => {
        console.error('wx.login失败:', err);
      }
    });
  },

  globalData: {
    userInfo: null
  }
});

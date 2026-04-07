// 认证服务
import { http } from '../core/http';

export const authService = {
  // 微信登录
  async wechatLogin(code) {
    const data = await http.post('/auth/wechat-login', { code }, false);
    http.setToken(data.access_token);
    return data;
  }
};

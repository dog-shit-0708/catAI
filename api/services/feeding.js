// 投喂记录服务
import { http } from '../core/http';

export const feedingService = {
  // 检查投喂状态
  checkFeedingStatus(data) {
    return http.post('/feeding/check-status', data);
  },

  // 创建投喂记录
  createFeeding(data) {
    return http.post('/feeding', data);
  },

  // 获取投喂记录列表
  getFeedings(params = {}) {
    return http.get('/feeding', params);
  },

  // 获取我的投喂记录
  getMyFeedings() {
    return http.get('/feeding/my/records');
  },

  // 获取投喂统计
  getStatistics() {
    return http.get('/feeding/stats/summary');
  },

  // 获取用户排行榜
  getUserRankings() {
    return http.get('/feeding/rankings/users');
  },

  // 获取猫咪投喂排行榜
  getCatRankings(params = {}) {
    return http.get('/feeding/rankings/cats', params);
  }
};

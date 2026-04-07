// 用户服务
import { http } from '../core/http';

export const userService = {
  // 获取用户信息
  getProfile() {
    return http.get('/auth/profile');
  },

  // 更新用户信息
  updateProfile(data) {
    return http.put('/auth/profile', data);
  },

  // 获取收藏的猫咪
  getFavoriteCats() {
    return http.get('/auth/favorite-cats');
  },

  // 添加收藏猫咪
  addFavoriteCat(catId) {
    return http.post('/auth/favorite-cats', { cat_id: catId });
  },

  // 取消收藏猫咪
  removeFavoriteCat(catId) {
    return http.delete(`/auth/favorite-cats/${catId}`);
  },

  // 获取排行榜
  getRankings() {
    return http.get('/auth/rankings');
  }
};

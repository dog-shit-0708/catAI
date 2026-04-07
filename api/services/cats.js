// 猫咪管理服务
import { http } from '../core/http';

export const catsService = {
  // 获取猫咪列表
  getCats(params = {}) {
    return http.get('/cats', {
      keyword: params.keyword,
      adoption_status: params.adoptionStatus,
      location_area: params.locationArea,
      page: params.page || 1,
      page_size: params.pageSize || 20
    });
  },

  // 创建猫咪
  createCat(data) {
    return http.post('/cats', data);
  },

  // 获取猫咪统计
  getStats() {
    return http.get('/cats/stats');
  },

  // 获取猫咪排行榜
  getRankings(params = {}) {
    return http.get('/cats/rankings', {
      limit: params.limit || 10,
      adoption_status: params.adoptionStatus
    });
  },

  // 获取猫咪详情
  getCatDetail(catId) {
    return http.get(`/cats/${catId}`);
  },

  // 更新猫咪信息
  updateCat(catId, data) {
    return http.put(`/cats/${catId}`, data);
  },

  // 删除猫咪
  deleteCat(catId) {
    return http.delete(`/cats/${catId}`);
  },

  // 获取猫咪图片
  getCatImages(catId) {
    return http.get(`/cats/${catId}/images`);
  },

  // 上传猫咪图片
  uploadCatImage(catId, tempFilePath) {
    return new Promise((resolve, reject) => {
      const token = http.getToken();
      wx.uploadFile({
        url: `${http.baseURL}/cats/${catId}/images`,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            resolve(data.data);
          } else {
            reject(new Error('上传失败'));
          }
        },
        fail: reject
      });
    });
  }
};

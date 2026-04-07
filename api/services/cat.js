// 猫咪识别服务
import { http } from '../core/http';
import config from '../config';

export const catService = {
  /**
   * 识别猫咪
   * @param {string} imageUrl - 图片URL
   * @returns {Promise<{
   *   recognized: boolean,
   *   cat_name: string,
   *   cat_info: object,
   *   alternatives: array,
   *   message: string
   * }>}
   */
  identifyCat(imageUrl) {
    // image_url 作为 query 参数
    const url = `/chat/identify-cat-ark?image_url=${encodeURIComponent(imageUrl)}`;
    const fullUrl = `${config.baseURL}${url}`;
    const token = wx.getStorageSync('access_token');
    
    console.log('【catService】调用identifyCat, imageUrl:', imageUrl);
    console.log('【catService】请求URL:', fullUrl);
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': ''  // 显式设为空
        },
        data: null,  // 显式设为 null
        success: (res) => {
          console.log('【catService】响应状态:', res.statusCode);
          console.log('【catService】响应数据:', res.data);
          if (res.statusCode === 200 && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data?.message || `请求失败(${res.statusCode})`));
          }
        },
        fail: (err) => {
          console.error('【catService】请求失败:', err);
          reject(new Error('网络请求失败'));
        }
      });
    });
  }
};

// 文件上传服务
import { http } from '../core/http';
import config from '../config';

export const uploadService = {
  /**
   * 上传图片
   * @param {string} tempFilePath - 临时文件路径
   * @returns {Promise<{url: string}>}
   */
  uploadImage(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${config.baseURL}/upload/image`,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${http.getToken()}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                resolve(data.data);
              } else {
                reject(new Error(data.message || '上传失败'));
              }
            } catch (e) {
              reject(new Error('解析响应失败'));
            }
          } else {
            reject(new Error(`上传失败(${res.statusCode})`));
          }
        },
        fail: (err) => {
          console.error('上传失败:', err);
          reject(new Error('网络请求失败'));
        }
      });
    });
  }
};

import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
import { api } from '../../api/index'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      userPoints: 'userPoints',
      userInfo: 'userInfo',
      feedingRecords: 'feedingRecords',
      cats: 'cats'
    },
    actions: {
      addFeedingRecord: 'addFeedingRecord'
    }
  },

  data: {
    tabBarHeight: 50,

    // 打卡弹框状态
    showCheckinDialog: false,

    // 猫咪投喂排行
    catsFeedingRanking: [],

    // AI智能建议（硬编码投喂建议）
    aiSuggestions: [
      {
        id: 1,
        type: 'warning',
        icon: 'clock',
        title: '今日投喂提醒',
        content: '今天不建议喂建国，已经喂了2次了，营养摄入已足够。'
      },
      {
        id: 2,
        type: 'tip',
        icon: 'health',
        title: '推荐投喂',
        content: '可以喂喂歪猪，今天还没有被投喂过，应该饿坏了。'
      },
      {
        id: 3,
        type: 'info',
        icon: 'leaf',
        title: '投喂小贴士',
        content: '建议早晚各喂一次，每次量不宜过多，保持猫咪良好饮食习惯。'
      }
    ]
  },

  async onShow() {
    // 如果猫咪列表为空，从API加载
    if (!this.data.cats || this.data.cats.length === 0) {
      await this.loadCats();
    }
    // 从API获取今日猫咪投喂排行
    await this.fetchCatsFeedingRanking();
  },

  // 从API加载猫咪列表
  async loadCats() {
    try {
      const res = await api.cats.getCats({ page: 1, pageSize: 100 });
      // 更新store中的猫咪列表
      const cats = res.data || [];
      this.setData({ cats });
    } catch (error) {
      console.error('加载猫咪列表失败:', error);
    }
  },

  // 打卡弹框
  onCheckinTap() {
    // 确保猫咪列表已加载
    if (!this.data.cats || this.data.cats.length === 0) {
      wx.showToast({ title: '正在加载猫咪数据...', icon: 'none' });
      return;
    }
    this.setData({ showCheckinDialog: true });
  },

  onCloseCheckinDialog() {
    this.setData({ showCheckinDialog: false });
  },

  // 打卡成功回调
  onCheckinSuccess(e) {
    const { record } = e.detail;
    // 更新本地store
    this.addFeedingRecord(record);
    // 刷新排行
    this.fetchCatsFeedingRanking();
  },

  // 从API获取今日猫咪投喂排行
  async fetchCatsFeedingRanking() {
    try {
      const res = await api.feeding.getCatRankings({ period: 'today', limit: 10 });
      const rankings = res.rankings || [];
      const catsFeedingRanking = rankings.map(item => ({
        id: item.id,
        name: item.name,
        profile_image: item.profile_image || item.avatar || '',
        feed_count: item.feed_count,
        rank: item.rank
      }));
      this.setData({ catsFeedingRanking });
    } catch (error) {
      console.error('【首页】获取猫咪投喂排行失败:', error);
    }
  },

  onMoreRanking() {
    wx.switchTab({
      url: '/pages/cats/cats'
    });
  },

  // 打卡失败回调
  onCheckinError(e) {
    console.error('打卡失败:', e.detail.error);
  },

  // 点击猫咪跳转到详情页
  onCatTap(e) {
    const catId = e.currentTarget.dataset.id;
    if (catId) {
      wx.navigateTo({
        url: `/pages/cat-detail/cat-detail?id=${catId}`
      });
    }
  },

  onRefreshSuggestions() {
    // 硬编码的更多建议内容
    const moreSuggestions = [
      {
        id: 4,
        type: 'warning',
        icon: 'clock',
        title: '投喂提醒',
        content: '小花今天已经被投喂3次了，请勿过度投喂。'
      },
      {
        id: 5,
        type: 'tip',
        icon: 'health',
        title: '推荐投喂',
        content: '胖橘今天只吃了1次，可以去看看它。'
      },
      {
        id: 6,
        type: 'info',
        icon: 'leaf',
        title: '健康建议',
        content: '天气较热，记得给猫咪准备充足的清水。'
      }
    ];
    
    // 随机选择3条建议
    const shuffled = moreSuggestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    this.setData({ aiSuggestions: selected });
    wx.showToast({ title: '建议已更新', icon: 'success' });
  },

  // 工具函数
  formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  // ========== 跳转到AI助手识别猫咪 ==========
  onCameraTap() {
    // 设置标志，让AI助手页面自动显示底部抽屉
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.showCameraAction = true;
    
    // 跳转到AI助手页面
    wx.switchTab({
      url: '/pages/ai/ai'
    });
  }
})

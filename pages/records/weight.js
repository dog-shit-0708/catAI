import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
import { api } from '../../api/index'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      feedingRecords: 'feedingRecords',
      cats: 'cats',
      userInfo: 'userInfo'
    },
    actions: {
      addFeedingRecord: 'addFeedingRecord',
      setFeedingRecords: 'setFeedingRecords'
    }
  },

  data: {
    tabBarHeight: 50,
    chartPeriod: 'month',
    ec: {},

    // 统计数据
    totalFeedingCount: 0,
    totalCatsCount: 0,
    thisMonthCount: 0,

    // 猫咪投喂总结
    catsFeedingSummary: [],

    // 显示数据
    displayCatsSummary: [],
    recentRecords: [],
    displayRecords: [],

    // 打卡弹框
    showCheckinDialog: false,

    // 是否已加载数据
    isDataLoaded: false,

    // 图表数据
    chartData: {
      week: [
        { date: '12-28', count: 3 },
        { date: '12-29', count: 5 },
        { date: '12-30', count: 2 },
        { date: '12-31', count: 4 },
        { date: '01-01', count: 6 },
        { date: '01-02', count: 3 },
        { date: '01-03', count: 4 }
      ],
      month: [
        { date: '12月', count: 45 },
        { date: '01月', count: 52 }
      ],
      year: [
        { date: '2023', count: 280 },
        { date: '2024', count: 350 }
      ]
    }
  },

  onLoad() {
    this.getTabBarHeight();
    this.initChart();
    // 首次加载数据
    this.fetchFeedingRecords();
  },

  // 从API加载用户的投喂记录
  async fetchFeedingRecords() {
    try {
      wx.showLoading({ title: '加载中...' });
      const res = await api.feeding.getMyFeedings();
      console.log('【记录页】获取投喂记录:', res);
      
      // API返回分页格式 {total, page, page_size, data}
      const records = res.data || [];
      
      // 更新store中的记录
      this.setFeedingRecords(records);
      
      // 直接使用API返回的数据渲染页面（不依赖MobX绑定）
      this.processAndDisplayRecords(records);
      
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('【记录页】加载投喂记录失败:', error);
      wx.showToast({ title: '加载记录失败', icon: 'none' });
    }
  },

  // 处理并显示记录
  processAndDisplayRecords(records) {
    // 按时间倒序排列
    const sortedRecords = [...records].sort((a, b) => {
      const timeA = a.feeding_time ? new Date(a.feeding_time.replace(/-/g, '/').replace('T', ' ')).getTime() : 0;
      const timeB = b.feeding_time ? new Date(b.feeding_time.replace(/-/g, '/').replace('T', ' ')).getTime() : 0;
      return timeB - timeA;
    });
    
    const recentRecords = sortedRecords.map(record => ({
      ...record,
      cat_name: record.cat_name || record.cat?.name || '未知猫咪',
      food_type: record.food_type || '-',
      amount: record.amount || '-',
      feeding_time: this.formatDate(record.feeding_time)
    }));
    
    this.setData({
      recentRecords: recentRecords,
      displayRecords: recentRecords.slice(0, 5),
      isDataLoaded: true
    });

    // 计算统计数据
    this.calculateStatsWithRecords(records);
  },

  // 使用指定记录计算统计
  calculateStatsWithRecords(records) {
    const cats = this.data.cats || [];
    const totalFeedingCount = records.length;

    // 计算照顾的猫咪数量（去重）
    const uniqueCatIds = new Set(records.filter(r => r.cat_id).map(record => record.cat_id));
    const totalCatsCount = uniqueCatIds.size || cats.length;

    // 计算本月投喂次数
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthCount = records.filter(record => {
      if (!record.feeding_time) return false;
      const compatibleDateString = record.feeding_time.replace(/-/g, '/').replace('T', ' ');
      const recordDate = new Date(compatibleDateString);
      if (isNaN(recordDate.getTime())) return false;
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;

    // 计算猫咪投喂总结
    const catsFeedingSummary = this.getCatsFeedingSummaryWithRecords(records);

    this.setData({
      totalFeedingCount,
      totalCatsCount,
      thisMonthCount,
      catsFeedingSummary
    });
  },

  // 使用指定记录获取猫咪投喂总结
  getCatsFeedingSummaryWithRecords(records) {
    const cats = this.data.cats || [];
    const totalFeedingCount = records.length;

    // 统计每只猫的投喂次数
    const catStats = {};
    records.forEach(record => {
      if (record.cat_id) {
        if (!catStats[record.cat_id]) {
          catStats[record.cat_id] = 0;
        }
        catStats[record.cat_id]++;
      }
    });

    // 转换为总结数据，只显示有投喂记录的猫咪
    const summary = cats
      .map(cat => {
        const feedCount = catStats[cat.id] || 0;
        let percentage = 0;
        if (totalFeedingCount > 0 && feedCount > 0) {
          percentage = Math.round((feedCount / totalFeedingCount) * 100);
        }
        return {
          ...cat,
          feed_count: feedCount,
          percentage: percentage
        };
      })
      .filter(cat => cat.feed_count > 0)
      .sort((a, b) => b.feed_count - a.feed_count);

    return summary;
  },

  async getTabBarHeight() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const tabBarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;
      this.setData({ tabBarHeight });
    } catch (error) {
      this.setData({ tabBarHeight: 50 });
    }
  },

  onShow() {
    const pages = getCurrentPages();
    const route = pages[pages.length - 1].route;
    const tabbar = this.getTabBar && this.getTabBar();
    if (tabbar && tabbar.updateActiveByRoute) {
      tabbar.updateActiveByRoute(route);
    }
    
    // 如果还没有加载过数据，则加载
    if (!this.data.isDataLoaded) {
      this.fetchFeedingRecords();
    }
  },

  // 加载记录列表
  loadRecords() {
    const allRecords = this.data.feedingRecords || [];
    // 按时间倒序排列
    const sortedRecords = [...allRecords].sort((a, b) => {
      const timeA = a.feeding_time ? new Date(a.feeding_time.replace(/-/g, '/')).getTime() : 0;
      const timeB = b.feeding_time ? new Date(b.feeding_time.replace(/-/g, '/')).getTime() : 0;
      return timeB - timeA;
    });
    
    const recentRecords = sortedRecords.map(record => ({
      ...record,
      cat_name: record.cat_name || record.cat?.name || '未知猫咪',
      food_type: record.food_type || '-',
      amount: record.amount || '-',
      feeding_time: this.formatDate(record.feeding_time)
    }));
    
    this.setData({
      recentRecords: recentRecords,
      displayRecords: recentRecords.slice(0, 5)
    });
  },

  calculateStats() {
    const records = this.data.feedingRecords || [];
    const cats = this.data.cats || [];

    // 计算总投喂次数
    const totalFeedingCount = records.length;

    // 计算照顾的猫咪数量（去重）
    const uniqueCatIds = new Set(records.map(record => record.cat_id));
    const totalCatsCount = uniqueCatIds.size || cats.length;

    // 计算本月投喂次数
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthCount = records.filter(record => {
      if (!record.feeding_time) return false;
      const compatibleDateString = record.feeding_time.replace(/-/g, '/');
      const recordDate = new Date(compatibleDateString);
      // 检查日期是否有效
      if (isNaN(recordDate.getTime())) return false;
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;

    // 计算猫咪投喂总结
    const catsFeedingSummary = this.getCatsFeedingSummary();

    this.setData({
      totalFeedingCount,
      totalCatsCount,
      thisMonthCount,
      catsFeedingSummary
    });
  },

  // 获取猫咪投喂总结（简化版，只显示投喂过的猫咪）
  getCatsFeedingSummary() {
    const records = this.data.feedingRecords || [];
    const cats = this.data.cats || [];
    const totalFeedingCount = records.length;

    // 统计每只猫的投喂次数
    const catStats = {};
    records.forEach(record => {
      if (record.cat_id) {
        if (!catStats[record.cat_id]) {
          catStats[record.cat_id] = 0;
        }
        catStats[record.cat_id]++;
      }
    });

    // 转换为总结数据，只显示有投喂记录的猫咪
    const summary = cats
      .map(cat => {
        const feedCount = catStats[cat.id] || 0;
        let percentage = 0;
        if (totalFeedingCount > 0 && feedCount > 0) {
          percentage = Math.round((feedCount / totalFeedingCount) * 100);
        }
        return {
          ...cat,
          feed_count: feedCount,
          percentage: percentage
        };
      })
      .filter(cat => cat.feed_count > 0)
      .sort((a, b) => b.feed_count - a.feed_count);

    return summary;
  },

  getRecentRecords() {
    const records = this.data.feedingRecords || [];
    console.log('获取记录，总数：', records.length);
    return records.map(record => ({
      ...record,
      feeding_time: this.formatDate(record.feeding_time)
    }));
  },

  onChartPeriodChange(e) {
    const period = e.detail.name;
    this.setData({ chartPeriod: period });
    this.updateChart();
  },

  initChart() {
    this.setData({
      ec: {
        onInit: (canvas, width, height) => {
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#f0f0f0'
          ctx.fillRect(0, 0, width, height)
        }
      }
    });
  },

  updateChart() {
    console.log('Updating chart for period:', this.data.chartPeriod);
  },

  onAddRecord() {
    // 打开打卡抽屉
    this.setData({ showCheckinDialog: true });
  },

  onCloseCheckinDialog() {
    this.setData({ showCheckinDialog: false });
  },

  // 打卡成功回调
  onCheckinSuccess(e) {
    const { record } = e.detail;
    // 更新本地 store
    this.addFeedingRecord(record);
    // 刷新记录列表（从API重新获取）
    setTimeout(() => {
      this.fetchFeedingRecords();
    }, 500);
    wx.showToast({
      title: '打卡成功！+10积分',
      icon: 'success'
    });
  },

  // 打卡失败回调
  onCheckinError(e) {
    console.error('打卡失败:', e.detail.error);
  },

  onRecordTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看记录详情功能开发中',
      icon: 'none'
    });
  },

  formatDate(dateString) {
    if (!dateString) return '-';
    // 处理 ISO 格式 "2026-04-06T00:37:12" 或普通格式 "2026-04-06 00:37:12"
    // 将 - 替换为 /，将 T 替换为 空格，以兼容 iOS
    const compatibleDateString = dateString.replace(/-/g, '/').replace('T', ' ');
    const date = new Date(compatibleDateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  },

  async onPullDownRefresh() {
    // 重置加载标志，强制刷新
    this.setData({ isDataLoaded: false });
    await this.fetchFeedingRecords();
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    // 可以加载更多记录
  },

  onShareAppMessage() {
    return {
      title: '我的投喂记录统计',
      path: '/pages/records/weight'
    };
  },

  onReady() {
    const recentRecords = this.getRecentRecords();
    this.setData({
      recentRecords: recentRecords,
      displayRecords: recentRecords.slice(0, 5),
      catsFeedingSummary: this.getCatsFeedingSummary()
    });
  }
})

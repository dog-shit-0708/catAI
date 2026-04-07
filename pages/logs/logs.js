import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'

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
      updateUserInfo: 'updateUserInfo',
      updateUserPoints: 'updateUserPoints',
      addFeedingRecord: 'addFeedingRecord'
    }
  },

  data: {
    tabBarHeight: 50,
    userLevel: 1,
    nextLevelPoints: 200,
    pointsToNext: 80,
    progressPercentage: 60,
    totalFeeding: 0,
    unlockedAchievements: 0,
    totalAchievements: 8,

    achievements: [
      {
        id: 1,
        name: '初来乍到',
        description: '完成首次投喂',
        icon: '🌟',
        unlocked: true
      },
      {
        id: 2,
        name: '爱心使者',
        description: '累计投喂10次',
        icon: '💝',
        unlocked: true
      },
      {
        id: 3,
        name: '猫咪朋友',
        description: '照顾5只不同的猫咪',
        icon: '🐾',
        unlocked: false
      },
      {
        id: 4,
        name: '坚持不懈',
        description: '连续打卡7天',
        icon: '📅',
        unlocked: false
      },
      {
        id: 5,
        name: '积分达人',
        description: '获得500积分',
        icon: '🏆',
        unlocked: false
      },
      {
        id: 6,
        name: '摄影大师',
        description: '上传50张投喂照片',
        icon: '📸',
        unlocked: false
      },
      {
        id: 7,
        name: '分享达人',
        description: '分享应用给朋友',
        icon: '📤',
        unlocked: false
      },
      {
        id: 8,
        name: '守护者',
        description: '成为猫咪守护者',
        icon: '🛡️',
        unlocked: false
      }
    ],

    recentCheckins: [
      {
        id: 1,
        date: '今天',
        time: '10:30',
        cat_name: '大橘',
        action: '投喂猫粮 50g',
        points: 10
      },
      {
        id: 2,
        date: '昨天',
        time: '17:15',
        cat_name: '狸花将军',
        action: '更换清水',
        points: 5
      },
      {
        id: 3,
        date: '12-28',
        time: '08:45',
        cat_name: '小白',
        action: '投喂猫罐头',
        points: 10
      }
    ]
  },

  onLoad() {
    this.getTabBarHeight();
    this.calculateUserStats();
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
    this.calculateUserStats();
  },

  calculateUserStats() {
    const records = this.data.feedingRecords || [];
    const totalFeeding = records.length;

    // 计算等级和进度
    const userLevel = Math.floor(this.data.userPoints / 100) + 1;
    const currentLevelPoints = (userLevel - 1) * 100;
    const nextLevelPoints = userLevel * 100;
    const pointsToNext = nextLevelPoints - this.data.userPoints;
    const progressPercentage = ((this.data.userPoints - currentLevelPoints) / 100) * 100;

    // 计算已解锁成就
    const unlockedAchievements = this.calculateUnlockedAchievements(totalFeeding);

    this.setData({
      totalFeeding,
      userLevel,
      nextLevelPoints,
      pointsToNext,
      progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
      unlockedAchievements
    });
  },

  calculateUnlockedAchievements(totalFeeding) {
    let unlocked = 0;
    const achievements = this.data.achievements.map(achievement => {
      let isUnlocked = false;

      switch (achievement.id) {
        case 1: // 初来乍到
          isUnlocked = totalFeeding >= 1;
          break;
        case 2: // 爱心使者
          isUnlocked = totalFeeding >= 10;
          break;
        case 3: // 猫咪朋友
          isUnlocked = this.getUniqueCatsCount() >= 5;
          break;
        case 5: // 积分达人
          isUnlocked = this.data.userPoints >= 500;
          break;
        default:
          isUnlocked = achievement.unlocked;
      }

      if (isUnlocked) unlocked++;
      return { ...achievement, unlocked: isUnlocked };
    });

    this.setData({ achievements });
    return unlocked;
  },

  getUniqueCatsCount() {
    const records = this.data.feedingRecords || [];
    const uniqueCatIds = new Set(records.filter(r => r.cat_id).map(record => record.cat_id));
    return uniqueCatIds.size;
  },

  onEditProfile() {
    wx.showModal({
      title: '编辑资料',
      content: '编辑个人资料功能开发中...',
      showCancel: false
    });
  },

  onCheckinAction() {
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
    // 刷新统计数据
    this.calculateUserStats();
    wx.showToast({
      title: '打卡成功！+10积分',
      icon: 'success'
    });
  },

  // 打卡失败回调
  onCheckinError(e) {
    console.error('打卡失败:', e.detail.error);
  },

  onViewRecords() {
    wx.switchTab({
      url: '/pages/records/weight'
    });
  },

  onViewFavoriteCats() {
    wx.navigateTo({
      url: '/pages/favorite-cats/favorite-cats'
    });
  },

  onShareApp() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onViewAllHistory() {
    wx.showToast({
      title: '查看全部历史功能开发中',
      icon: 'none'
    });
  },

  onNotificationSettings() {
    wx.showToast({
      title: '通知设置功能开发中',
      icon: 'none'
    });
  },

  onPrivacySettings() {
    wx.showToast({
      title: '隐私设置功能开发中',
      icon: 'none'
    });
  },

  onHelpFeedback() {
    wx.showToast({
      title: '帮助反馈功能开发中',
      icon: 'none'
    });
  },

  onAboutUs() {
    wx.showModal({
      title: '关于我们',
      content: '校园流浪猫守护小程序 v1.0\n\n致力于保护校园流浪猫，传播爱护动物的理念。\n\n开发团队：爱心志愿者团队',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
          // 这里可以添加退出登录的逻辑
        }
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '校园流浪猫守护 - 用爱守护每一个小生命',
      path: '/pages/logs/logs',
      imageUrl: '/assets/share-image.png'
    };
  }
})

Component({
  properties: {
    // 是否显示页面头部
    showHeader: {
      type: Boolean,
      value: false
    },
    // 页面标题
    title: {
      type: String,
      value: ''
    },
    // 页面副标题
    subtitle: {
      type: String,
      value: ''
    },
    // 底部tabBar高度（自动计算，包含安全区域）
    tabBarHeight: {
      type: Number,
      value: 60
    }
  },

  lifetimes: {
    attached() {
      this.calculateTabBarHeight();
    }
  },

  methods: {
    calculateTabBarHeight() {
      const systemInfo = wx.getSystemInfoSync();
      // 底部安全区域高度
      const safeAreaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
      // tabBar 默认高度 50px
      const tabBarHeight = 50;
      // 总高度 = tabBar高度 + 安全区域
      const totalHeight = tabBarHeight + safeAreaBottom + 10; // 额外 10px 缓冲
      this.setData({ tabBarHeight: totalHeight });
    }
  }
});

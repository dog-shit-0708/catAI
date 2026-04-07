import { api } from '../../../api/index'

Page({
  data: {
    tabBarHeight: 50,
    favoriteCats: [],
    isLoading: false
  },

  onLoad() {
    this.getTabBarHeight()
    this.loadFavoriteCats()
  },

  // 获取tabbar高度
  getTabBarHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const tabBarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom
    this.setData({ tabBarHeight: tabBarHeight > 0 ? tabBarHeight : 50 })
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadFavoriteCats()
  },

  // 加载关注的猫咪列表
  async loadFavoriteCats() {
    this.setData({ isLoading: true })
    try {
      wx.showLoading({ title: '加载中...' })
      const cats = await api.user.getFavoriteCats()
      this.setData({
        favoriteCats: cats || []
      })
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('加载关注猫咪失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 点击猫咪跳转到详情
  onCatTap(e) {
    const catId = e.currentTarget.dataset.id
    if (catId) {
      wx.navigateTo({
        url: `/pages/cat-detail/cat-detail?id=${catId}`
      })
    }
  },

  // 取消关注
  async onUnfavorite(e) {
    const catId = e.currentTarget.dataset.id
    if (!catId) return

    try {
      await api.user.removeFavoriteCat(catId)
      wx.showToast({ title: '已取消关注', icon: 'success' })
      // 刷新列表
      this.loadFavoriteCats()
    } catch (error) {
      console.error('取消关注失败:', error)
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  onPullDownRefresh() {
    this.loadFavoriteCats().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 跳转到猫咪列表
  onViewAllCats() {
    wx.switchTab({
      url: '/pages/cats/cats'
    })
  }
})
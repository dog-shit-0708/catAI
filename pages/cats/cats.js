import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
import { api } from '../../api/index'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      cats: 'cats'
    },
    actions: {
      setCats: 'setCats',
      setCurrentCatId: 'setCurrentCatId'
    }
  },

  data: {
    tabBarHeight: 50,
    isLoading: false
  },

  onLoad() {
    this.getTabBarHeight()
    this.loadCats()
  },

  async getTabBarHeight() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      const tabBarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom
      this.setData({ tabBarHeight })
    } catch (error) {
      this.setData({ tabBarHeight: 50 })
    }
  },

  onShow() {
    const pages = getCurrentPages()
    const route = pages[pages.length - 1].route
    const tabbar = this.getTabBar && this.getTabBar()
    if (tabbar && tabbar.updateActiveByRoute) {
      tabbar.updateActiveByRoute(route)
    }
  },

  // 从API加载猫咪列表
  async loadCats() {
    this.setData({ isLoading: true })
    try {
      wx.showLoading({ title: '加载中...' })
      const res = await api.cats.getCats({
        page: 1,
        pageSize: 100
      })
      console.log('【调试】API返回数据:', res)
      // 更新store中的猫咪列表
      this.setCats(res.data || [])
      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('加载猫咪列表失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 点击猫咪卡片跳转到详情页
  onCatTap(e) {
    const catId = e.currentTarget.dataset.id
    if (catId) {
      this.setCurrentCatId(catId)
      wx.navigateTo({
        url: `/pages/cat-detail/cat-detail?id=${catId}`
      })
    }
  },

  onPullDownRefresh() {
    this.loadCats().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage() {
    return {
      title: '校园猫咪图鉴',
      path: '/pages/cats/cats'
    }
  }
})

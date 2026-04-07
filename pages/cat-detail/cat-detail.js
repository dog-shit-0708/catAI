import { api } from '../../api/index'
import { AdoptionStatus } from '../../api/constants'

Page({
  data: {
    tabBarHeight: 50,
    cat: null,
    isFavorited: false,
    isLoading: false,
    catId: null,
    feedings: [], // 投喂记录
    isLoadingFeedings: false
  },

  onLoad(options) {
    this.getTabBarHeight()
    const catId = parseInt(options.id)
    if (catId) {
      this.setData({ catId })
      this.loadCatDetail(catId)
    } else {
      wx.showToast({ title: '无效猫咪ID', icon: 'none' })
    }
  },

  // 获取tabbar高度
  getTabBarHeight() {
    try {
      const windowInfo = wx.getWindowInfo()
      if (windowInfo?.safeArea?.bottom) {
        const tabBarHeight = windowInfo.screenHeight - windowInfo.safeArea.bottom
        this.setData({ tabBarHeight: tabBarHeight > 0 ? tabBarHeight : 50 })
      }
    } catch (e) {
      console.error('获取窗口信息失败:', e)
    }
  },

  // 加载猫咪详情
  async loadCatDetail(catId) {
    this.setData({ isLoading: true })
    try {
      // 并行获取猫咪详情和投喂记录
      const [catDetail, feedings] = await Promise.all([
        this.fetchCatDetail(catId),
        this.fetchCatFeedings(catId)
      ])

      if (catDetail) {
        this.setData({
          cat: catDetail,
          feedings: feedings
        })
      }
    } catch (error) {
      console.error('加载猫咪详情失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 获取猫咪投喂记录
  async fetchCatFeedings(catId) {
    this.setData({ isLoadingFeedings: true })
    try {
      const res = await api.feeding.getFeedings({ cat_id: catId })
      console.log('【投喂记录】API返回:', res)
      // 处理投喂记录数据
      if (res && res.data && Array.isArray(res.data)) {
        return res.data.map(item => {
          console.log('【投喂记录】单条数据:', item)
          return {
            id: item.id,
            foodType: item.food_type,
            amount: item.amount,
            feedingTime: this.formatFeedingTime(item.feeding_time),
            foodDetail: item.food_detail,
            feedingLocation: item.feeding_location,
            imageUrl: item.image_url,
            status: item.status,
            userId: item.user_id,
            openid: item.openid || item.user_openid || item.user?.openid || ''
          }
        })
      }
      return []
    } catch (error) {
      console.error('获取投喂记录失败:', error)
      return []
    } finally {
      this.setData({ isLoadingFeedings: false })
    }
  },

  // 格式化投喂时间
  formatFeedingTime(timeStr) {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now - date
    
    // 小于1小时显示"X分钟前"
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`
    }
    // 小于24小时显示"X小时前"
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours}小时前`
    }
    // 小于7天显示"X天前"
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days}天前`
    }
    // 否则显示具体日期
    return `${date.getMonth() + 1}月${date.getDate()}日`
  },

  // 从API获取猫咪详情
  async fetchCatDetail(catId) {
    try {
      const res = await api.cats.getCatDetail(catId)
      if (res && res.id) {
        return {
          id: res.id,
          name: res.name || '',
          alias: res.alias || '',
          adoption_status: res.adoption_status || 0,
          profile_image: res.profile_image || '',
          cover_images: res.cover_images?.length > 0 
            ? res.cover_images 
            : [res.profile_image].filter(Boolean),
          notes: res.notes || ''
        }
      }
      return null
    } catch (error) {
      console.error('获取猫咪详情失败:', error)
      return null
    }
  },

  // 获取领养状态文本
  getAdoptionStatusText(status) {
    const statusMap = {
      [AdoptionStatus.NOT_ADOPTED]: '待领养',
      [AdoptionStatus.ADOPTING]: '领养中',
      [AdoptionStatus.ADOPTED]: '已领养'
    }
    return statusMap[status] || '未知'
  },

  // 点击图片预览
  onPhotoTap(e) {
    const index = e.currentTarget.dataset.index
    const { cat } = this.data
    
    if (!cat?.cover_images?.length) return

    wx.previewImage({
      current: cat.cover_images[index] || cat.cover_images[0],
      urls: cat.cover_images
    })
  },

  // 预览投喂记录图片
  onPreviewFeedingImage(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.previewImage({
        current: url,
        urls: [url]
      })
    }
  },

  // 点击关注/取消关注
  async onFavoriteTap() {
    const { cat, isFavorited } = this.data
    if (!cat?.id) return

    try {
      if (isFavorited) {
        await api.user.removeFavoriteCat(cat.id)
        this.setData({ isFavorited: false })
        wx.showToast({ title: '已取消关注', icon: 'success' })
      } else {
        await api.user.addFavoriteCat(cat.id)
        this.setData({ isFavorited: true })
        wx.showToast({ title: '关注成功', icon: 'success' })
      }
    } catch (error) {
      console.error('关注操作失败:', error)
      wx.showToast({ title: '操作失败，请重试', icon: 'none' })
    }
  },

  // 点击分享
  onShareTap() {
    wx.showShareMenu({ withShareTicket: true })
  },

  // 分享配置
  onShareAppMessage() {
    const { cat } = this.data
    if (!cat) {
      return {
        title: '校园猫咪图鉴',
        path: '/pages/cats/cats'
      }
    }
    return {
      title: `快来看看可爱的${cat.name || '猫咪'}吧！`,
      path: `/pages/cat-detail/cat-detail?id=${cat.id}`,
      imageUrl: cat.profile_image
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    const { catId } = this.data
    if (catId) {
      this.loadCatDetail(catId).then(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  }
})

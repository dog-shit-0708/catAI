import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
import { api } from '../../api/index'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      userInfo: 'userInfo'
    },
    actions: {
      addFeedingRecord: 'addFeedingRecord'
    }
  },

  data: {
    tabBarHeight: 50,
    cats: [],
    selectedCat: null,
    feedingData: {
      food_type: '',
      amount: '',
      notes: ''
    },
    submitting: false,

    // 选择器状态
    showCatPicker: false,
    showFoodTypePicker: false,
    showAmountPicker: false,

    // 选择器选项
    foodTypes: [
      { name: '猫粮' },
      { name: '猫罐头' },
      { name: '冻干' },
      { name: '猫条' },
      { name: '羊奶粉' }
    ],

    amountOptions: [
      { name: '少量（约20-30g）' },
      { name: '适量（约30-50g）' },
      { name: '中等（约50-80g）' },
      { name: '大量（80g以上）' }
    ]
  },

  async onLoad(options) {
    // 获取tabbar高度
    this.getTabBarHeight()
    
    // 加载猫咪列表
    await this.loadCats()

    // 如果从猫咪详情页跳转过来，预选猫咪
    if (options.catId) {
      const cat = this.data.cats.find(c => c.id == options.catId)
      if (cat) {
        this.setData({ selectedCat: cat })
      }
    }
  },

  // 获取tabbar高度
  getTabBarHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const tabBarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom
    this.setData({ tabBarHeight: tabBarHeight > 0 ? tabBarHeight : 50 })
  },

  // 从API加载猫咪列表
  async loadCats() {
    try {
      const res = await api.cats.getCats({ page: 1, pageSize: 100 })
      const cats = res.data || []
      this.setData({ cats })
    } catch (error) {
      console.error('加载猫咪列表失败:', error)
      wx.showToast({ title: '加载猫咪列表失败', icon: 'none' })
    }
  },

  // 猫咪选择器
  onShowCatPicker() {
    this.setData({ showCatPicker: true })
  },

  onCloseCatPicker() {
    this.setData({ showCatPicker: false })
  },

  onSelectCat(e) {
    const catName = e.detail.name
    const cat = this.data.cats.find(c => c.name === catName)
    if (cat) {
      this.setData({
        selectedCat: cat,
        showCatPicker: false
      })
    }
  },

  // 食物类型选择器
  onShowFoodTypePicker() {
    this.setData({ showFoodTypePicker: true })
  },

  onCloseFoodTypePicker() {
    this.setData({ showFoodTypePicker: false })
  },

  onSelectFoodType(e) {
    this.setData({
      'feedingData.food_type': e.detail.name,
      showFoodTypePicker: false
    })
  },

  // 投喂量选择器
  onShowAmountPicker() {
    this.setData({ showAmountPicker: true })
  },

  onCloseAmountPicker() {
    this.setData({ showAmountPicker: false })
  },

  onSelectAmount(e) {
    this.setData({
      'feedingData.amount': e.detail.name,
      showAmountPicker: false
    })
  },

  // 备注输入
  onNotesInput(e) {
    this.setData({
      'feedingData.notes': e.detail.value
    })
  },

  // 提交表单
  async onSubmit() {
    if (!this.validateForm()) {
      return
    }

    this.setData({ submitting: true })

    try {
      await this.submitFeedingRecord()
    } catch (error) {
      console.error('提交失败:', error)
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
      this.setData({ submitting: false })
    }
  },

  validateForm() {
    const { selectedCat, feedingData } = this.data

    if (!selectedCat) {
      wx.showToast({ title: '请选择猫咪', icon: 'none' })
      return false
    }

    if (!feedingData.food_type) {
      wx.showToast({ title: '请选择食物类型', icon: 'none' })
      return false
    }

    if (!feedingData.amount) {
      wx.showToast({ title: '请选择投喂量', icon: 'none' })
      return false
    }

    return true
  },

  async submitFeedingRecord() {
    const { selectedCat, feedingData } = this.data

    // 调用API创建投喂记录
    const record = await api.feeding.createFeeding({
      cat_id: selectedCat.id,
      food_type: feedingData.food_type,
      amount: feedingData.amount,
      notes: feedingData.notes,
      image_url: ''
    })

    // 更新本地store
    this.addFeedingRecord(record)

    wx.showToast({
      title: '打卡成功！+10积分',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })

    this.setData({ submitting: false })
  }
})

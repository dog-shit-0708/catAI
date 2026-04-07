import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  // 状态
  activeTabbarIndex: 0,
  userPoints: 0,
  userInfo: {
    id: null,
    nickname: '',
    avatar: ''
  },
  cats: [],
  feedingRecords: [],
  currentCatId: null,
  leaderboard: [],
  aiSuggestions: [],

  // Actions
  updateActiveTabbarIndex: action(function(index) {
    this.activeTabbarIndex = index
  }),

  setCurrentCatId: action(function(id) {
    this.currentCatId = id
  }),

  // 设置猫咪列表
  setCats: action(function(cats) {
    this.cats = cats
  }),

  // 设置投喂记录
  setFeedingRecords: action(function(records) {
    this.feedingRecords = records
  }),

  // 添加投喂记录
  addFeedingRecord: action(function(record) {
    this.feedingRecords.unshift(record)
    this.userPoints += 10
  }),

  // 设置用户信息
  setUserInfo: action(function(info) {
    this.userInfo = info
  }),

  // 更新积分
  updateUserPoints: action(function(points) {
    this.userPoints = points
  }),

  // 设置排行榜
  setLeaderboard: action(function(leaderboard) {
    this.leaderboard = leaderboard
  }),

  // 设置AI建议
  setAiSuggestions: action(function(suggestions) {
    this.aiSuggestions = suggestions
  }),

  // 获取猫咪详情
  getCatById: action(function(id) {
    return this.cats.find(cat => cat.id === id)
  }),

  // 获取猫咪投喂记录
  getFeedingRecordsByCat: action(function(catId) {
    return this.feedingRecords.filter(record => record.cat_id === catId)
  })
})

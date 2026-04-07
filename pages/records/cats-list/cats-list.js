import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../store/store'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      feedingRecords: 'feedingRecords',
      cats: 'cats'
    }
  },

  data: {
    catsFeedingSummary: []
  },

  onLoad() {
    this.loadCatsSummary();
  },

  onShow() {
    this.loadCatsSummary();
  },

  loadCatsSummary() {
    const records = this.data.feedingRecords || [];
    const cats = this.data.cats || [];
    const totalFeedingCount = records.length;

    // 统计每只猫的投喂次数
    const catStats = {};
    records.forEach(record => {
      if (!catStats[record.cat_id]) {
        catStats[record.cat_id] = 0;
      }
      catStats[record.cat_id]++;
    });

    // 转换为总结数据
    const summary = cats
      .map(cat => {
        const feedCount = catStats[cat.id] || 0;
        return {
          ...cat,
          feed_count: feedCount,
          percentage: totalFeedingCount > 0 ? Math.round((feedCount / totalFeedingCount) * 100) : 0
        };
      })
      .filter(cat => cat.feed_count > 0)
      .sort((a, b) => b.feed_count - a.feed_count);

    this.setData({
      catsFeedingSummary: summary
    });
  }
})

import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../store/store'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      feedingRecords: 'feedingRecords'
    }
  },

  data: {
    recentRecords: []
  },

  onLoad() {
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    const allRecords = this.data.feedingRecords || [];
    const recentRecords = allRecords.map(record => ({
      ...record,
      feeding_time: this.formatDate(record.feeding_time)
    }));

    this.setData({
      recentRecords: recentRecords
    });
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const compatibleDateString = dateString.replace(/-/g, '/');
    const date = new Date(compatibleDateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }
})

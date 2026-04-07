// custom-tab-bar/index.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../store/store'
Component({

  /**
   * 组件的属性列表
   */
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,//绑定全局变量store
    fields:{
      active:'activeTabbarIndex'
    },//映射数据
    actions:{
      updateActive:'updateActiveTabbarIndex'
    }//映射方法
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    tabs: [
      {
        url: "/pages/index/index",
        text: "首页",
        src: "/assets/tabbar/home.png",
        width1:25,
        height1:18,
        width2:30,
        height2:30,
        info:3
      },
      {
        url: "/pages/cats/cats",
        text: "猫咪",
        src: "/assets/tabbar/cat.png",
        iconActive: "/assets/tabbar/cat-active.png",
        width1:28,
        height1:28,
        width2:40,
        height2:40
      },
      {
        url: "/pages/ai/ai",
        text: "AI助手",
        src: "/assets/11 (2804).png",
        width1:28,
        height1:28,
        width2:40,
        height2:40
      },
      {
        url: "/pages/records/weight",
        text: "记录",
        src: "/assets/tabbar/record.png",
        iconActive: "/assets/tabbar/record-active.png",
        width1:30,
        height1:23,
        width2:37,
        height2:37
      },
      {
        url: "/pages/logs/logs",
        text: "我的",
        src: "/assets/tabbar/me.png",
        iconActive: "/assets/tabbar/me-active.png",
        width1:30,
        height1:30,
        width2:48,
        height2:48
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      const index = event.detail;
      const target = this.data.tabs[index];
      if (!target) return;
      if (index === this.data.active) return; // 避免重复切换
      if (this._switching) return; // 避免并发切换
      this._switching = true;

      this.updateActive(index);
      // 交由 updateActiveByRoute 在目标页 onShow 时同步高亮，避免双次渲染
      wx.switchTab({
        url: target.url,
        complete: () => {
          // 略微延迟释放，防止多次点击
          setTimeout(() => { this._switching = false; }, 50);
        }
      });
    },

    updateActiveByRoute(route) {
      // 根据路由更新tabbar高亮状态
      const index = this.data.tabs.findIndex(tab => {
        // 移除开头的斜杠进行比较
        const tabPath = tab.url.substring(1);
        return route === tabPath;
      });

      if (index !== -1 && index !== this.data.active) {
        this.updateActive(index);
      }
    }
  }
})
// 投喂打卡组件
import { api } from '../../api/index';

Component({
  properties: {
    // 是否显示弹框
    visible: {
      type: Boolean,
      value: false
    },
    // 猫咪列表
    cats: {
      type: Array,
      value: []
    }
  },

  data: {
    // 内部猫咪列表（当外部没有传入时使用）
    internalCats: [],
    // 选中的猫咪
    selectedCat: null,
    // 投喂表单数据
    feedingData: {
      food_type: '',
      amount: '',
      notes: ''
    },
    // 选择器显示状态
    showCatPicker: false,
    showFoodTypePicker: false,
    showAmountPicker: false,
    // 选择器选项
    catPickerActions: [],
    foodTypeActions: [
      { name: '猫粮' },
      { name: '猫罐头' },
      { name: '冻干' },
      { name: '猫条' },
      { name: '羊奶粉' }
    ],
    amountActions: [
      { name: '少量（约20-30g）' },
      { name: '适量（约30-50g）' },
      { name: '中等（约50-80g）' },
      { name: '大量（80g以上）' }
    ]
  },

  observers: {
    // 监听 visible 变化，打开时构建猫咪选择器
    'visible': function(visible) {
      if (visible) {
        // 如果没有外部传入的猫咪列表，自动加载
        if (!this.data.cats || this.data.cats.length === 0) {
          this._loadCats();
        } else {
          this._buildCatPickerActions();
        }
        // 重置表单
        this.setData({
          selectedCat: null,
          feedingData: {
            food_type: '',
            amount: '',
            notes: ''
          }
        });
      }
    },
    // 监听外部传入的猫咪列表变化
    'cats': function(cats) {
      if (cats && cats.length > 0) {
        this._buildCatPickerActions();
      }
    },
    // 监听内部猫咪列表变化
    'internalCats': function(cats) {
      if (cats && cats.length > 0) {
        this._buildCatPickerActions();
      }
    }
  },

  methods: {
    // 关闭弹框
    onClose() {
      this.triggerEvent('close');
    },

    // 获取有效的猫咪列表
    _getCats() {
      const cats = this.data.cats;
      if (cats && cats.length > 0) {
        return cats;
      }
      return this.data.internalCats;
    },

    // 显示猫咪选择器
    onShowCatPicker() {
      const cats = this._getCats();
      if (!cats || cats.length === 0) {
        wx.showToast({ title: '暂无猫咪数据', icon: 'none' });
        return;
      }
      this._buildCatPickerActions();
      this.setData({ showCatPicker: true });
    },

    onCloseCatPicker() {
      this.setData({ showCatPicker: false });
    },

    onSelectCatPicker(e) {
      const selectedName = e.detail.name;
      const cats = this._getCats();
      const cat = cats.find(c => c.name === selectedName);
      if (cat) {
        this.setData({
          selectedCat: cat,
          showCatPicker: false
        });
      }
    },

    // 显示食物类型选择器
    onShowFoodTypePicker() {
      this.setData({ showFoodTypePicker: true });
    },

    onCloseFoodTypePicker() {
      this.setData({ showFoodTypePicker: false });
    },

    onSelectFoodTypePicker(e) {
      this.setData({
        'feedingData.food_type': e.detail.name,
        showFoodTypePicker: false
      });
    },

    // 显示投喂量选择器
    onShowAmountPicker() {
      this.setData({ showAmountPicker: true });
    },

    onCloseAmountPicker() {
      this.setData({ showAmountPicker: false });
    },

    onSelectAmountPicker(e) {
      this.setData({
        'feedingData.amount': e.detail.name,
        showAmountPicker: false
      });
    },

    // 备注输入
    onNotesInput(e) {
      this.setData({
        'feedingData.notes': e.detail.value
      });
    },

    // 提交打卡
    async onSubmit() {
      const { selectedCat, feedingData } = this.data;

      // 表单验证
      if (!selectedCat || !selectedCat.id) {
        wx.showToast({ title: '请选择猫咪', icon: 'none' });
        return;
      }
      if (!feedingData.food_type) {
        wx.showToast({ title: '请选择食物类型', icon: 'none' });
        return;
      }
      if (!feedingData.amount) {
        wx.showToast({ title: '请选择投喂量', icon: 'none' });
        return;
      }

      try {
        wx.showLoading({ title: '提交中...' });

        const requestData = {
          cat_id: selectedCat.id,
          food_type: feedingData.food_type,
          amount: feedingData.amount,
          notes: feedingData.notes || '',
          image_url: ''
        };
        console.log('【投喂组件】发送数据:', requestData);

        const record = await api.feeding.createFeeding(requestData);
        console.log('【投喂组件】API返回:', record);

        wx.hideLoading();

        // 触发成功事件
        this.triggerEvent('success', { record });

        // 关闭弹框
        this.onClose();

        wx.showToast({
          title: '打卡成功！',
          icon: 'success',
          duration: 2000
        });
      } catch (error) {
        wx.hideLoading();
        console.error('【投喂组件】打卡失败:', error);
        wx.showToast({ title: '打卡失败，请重试', icon: 'none' });
        this.triggerEvent('error', { error });
      }
    },

    // 加载猫咪列表
    async _loadCats() {
      try {
        const res = await api.cats.getCats({ page: 1, pageSize: 100 });
        const cats = res.data || [];
        this.setData({ internalCats: cats });
      } catch (error) {
        console.error('【投喂组件】加载猫咪列表失败:', error);
      }
    },

    // 构建猫咪选择器选项
    _buildCatPickerActions() {
      const cats = this._getCats();
      const actions = cats.map(cat => ({ name: cat.name }));
      this.setData({ catPickerActions: actions });
    }
  },

  lifetimes: {
    attached() {
      // 组件挂载时预加载猫咪列表
      if (!this.data.cats || this.data.cats.length === 0) {
        this._loadCats();
      }
    }
  }
});

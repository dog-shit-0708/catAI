import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../store/store';
import { api } from '../../api/index';
import config from '../../api/config';
import { transformMessage, transformCatIdentifyResult, getCurrentTime } from '../../api/utils/transform';
import { FeedbackType } from '../../api/constants';

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      userInfo: 'userInfo'
    }
  },

  data: {
    tabBarHeight: 50,
    inputMessage: '',
    canSubmit: false,
    lastMessageId: '',
    messageIdCounter: 1,
    conversationId: null,
    isLoading: false,

    feedingSuggestion: '今天不建议喂建国，已经喂了2次了，可以喂喂歪猪。',

    messages: [
      {
        id: 1,
        type: 'ai',
        content: '你好！我是猫咪守护助手，有什么可以帮助你的吗？我可以为你提供猫咪护理建议、投喂指导、健康观察等信息。',
        time: getCurrentTime(),
        isRAG: false,
        sources: []
      }
    ],

    quickQuestions: [
      { id: 1, title: '如何正确投喂', question: '如何正确投喂流浪猫？' },
      { id: 2, title: '健康观察', question: '如何观察猫咪的健康状况？' },
      { id: 3, title: '安全距离', question: '与流浪猫接触时要注意什么？' },
      { id: 4, title: 'TNR知识', question: '什么是TNR？' },
      { id: 5, title: '紧急情况', question: '遇到受伤的猫咪怎么办？' },
      { id: 6, title: '猫咪疫苗', question: '流浪猫需要打哪些疫苗？' },
      { id: 7, title: '绝育好处', question: '为什么要给流浪猫做绝育？' },
      { id: 8, title: '幼猫照顾', question: '发现幼猫没有妈妈怎么办？' },
      { id: 9, title: '驱虫指南', question: '流浪猫多久需要驱虫一次？' },
      { id: 10, title: '冬季保暖', question: '冬天如何帮助流浪猫保暖？' },
      { id: 11, title: '常见疾病', question: '流浪猫常见的疾病有哪些？' },
      { id: 12, title: '诱捕技巧', question: '如何安全地诱捕流浪猫？' }
    ]
  },

  async onLoad(options) {
    this.getTabBarHeight();

    // 如果有 conversationId，加载历史消息
    if (options.id) {
      this.setData({ conversationId: parseInt(options.id) });
      await this.loadMessages();
    } else {
      // 检查本地是否已有对话ID
      const savedConvId = wx.getStorageSync('ai_conversation_id');
      if (savedConvId) {
        console.log('【AI调试】使用已保存的对话ID:', savedConvId);
        this.setData({ conversationId: savedConvId });
        await this.loadMessages();
      } else {
        // 创建新对话
        await this.createNewConversation();
      }
    }
  },

  onShow() {
    const pages = getCurrentPages();
    const route = pages[pages.length - 1].route;
    const tabbar = this.getTabBar && this.getTabBar();
    if (tabbar && tabbar.updateActiveByRoute) {
      tabbar.updateActiveByRoute(route);
    }

    const app = getApp();
    if (app?.globalData?.showCameraAction) {
      app.globalData.showCameraAction = false;
      this.onCameraTap();
    }
  },

  getTabBarHeight() {
    wx.getSystemInfo({
      success: (systemInfo) => {
        const tabBarHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        this.setData({ tabBarHeight });
      },
      fail: () => {
        this.setData({ tabBarHeight: 50 });
      }
    });
  },

  // 创建新对话
  async createNewConversation() {
    try {
      console.log('【AI调试】开始创建对话');
      const conv = await api.chat.createConversation('猫咪咨询');
      console.log('【AI调试】创建对话成功:', conv);
      this.setData({ conversationId: conv.id });
      // 保存对话ID到本地，避免重复创建
      wx.setStorageSync('ai_conversation_id', conv.id);
    } catch (error) {
      console.error('【AI调试】创建对话失败:', error);
      wx.showToast({ title: '创建对话失败', icon: 'none' });
    }
  },

  onInputChange(e) {
    // 兼容 Vant Field 的不同事件格式
    const value = (typeof e.detail === 'string' ? e.detail : e.detail?.value) || '';
    this.setData({ 
      inputMessage: value,
      canSubmit: value.trim().length > 0
    });
  },

  onQuickQuestion(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({ 
      inputMessage: question,
      canSubmit: question.trim().length > 0
    });
    this.sendMessage();
  },

  onSendMessage() {
    this.sendMessage();
  },

  async sendMessage() {
    const message = (this.data.inputMessage || '').trim();
    console.log('【AI调试】发送消息:', message);
    console.log('【AI调试】当前对话ID:', this.data.conversationId);
    
    if (!message || this.data.isLoading) {
      console.log('【AI调试】消息为空或正在加载中，跳过发送');
      return;
    }

    const userMessage = {
      id: ++this.data.messageIdCounter,
      type: 'user',
      content: message,
      time: getCurrentTime(),
      isRAG: false,
      sources: []
    };

    const newMessages = [...this.data.messages, userMessage];
    this.setData({
      messages: newMessages,
      inputMessage: '',
      canSubmit: false,
      lastMessageId: 'msg-' + userMessage.id,
      isLoading: true
    });

    try {
      console.log('【AI调试】调用API发送消息...');
      const response = await api.chat.sendMessage(this.data.conversationId, message);
      console.log('【AI调试】API返回:', response);
      
      const aiMessage = transformMessage({
        ...response,
        role: 'assistant',
        id: response.message_id
      });
      console.log('【AI调试】转换后的AI消息:', aiMessage);

      const updatedMessages = [...this.data.messages, aiMessage];
      this.setData({
        messages: updatedMessages,
        lastMessageId: 'msg-' + aiMessage.id,
        isLoading: false
      });
      console.log('【AI调试】消息已添加到UI');
    } catch (error) {
      console.error('【AI调试】发送消息失败:', error);
      this.handleError('发送失败，请重试');
    }
  },

  async loadMessages() {
    try {
      wx.showLoading({ title: '加载中...' });
      const detail = await api.chat.getConversationDetail(this.data.conversationId);

      const loadedMessages = detail.messages.map((msg, index) =>
        transformMessage({ ...msg, id: msg.id || index + 1 })
      );

      // 如果没有历史消息，保留默认的打招呼消息
      if (loadedMessages.length === 0) {
        wx.hideLoading();
        return;
      }

      this.setData({
        messages: loadedMessages,
        lastMessageId: loadedMessages.length > 0 ? 'msg-' + loadedMessages[loadedMessages.length - 1].id : ''
      });
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('加载历史消息失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 错误处理
  handleError(msg) {
    wx.showToast({ title: msg, icon: 'none' });
    const errorMessage = {
      id: ++this.data.messageIdCounter,
      type: 'ai',
      content: '抱歉，我遇到了一些问题，请稍后再试。',
      time: getCurrentTime(),
      isRAG: false,
      sources: []
    };

    this.setData({
      messages: [...this.data.messages, errorMessage],
      lastMessageId: 'msg-' + errorMessage.id,
      isLoading: false
    });
  },

  onShareAppMessage() {
    return {
      title: '猫咪守护助手',
      path: '/pages/ai/ai'
    };
  },

  // ========== 猫咪识别功能 ==========

  onCameraTap() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.takePhoto();
        } else if (res.tapIndex === 1) {
          this.chooseFromAlbum();
        }
      }
    });
  },

  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.handleImageUpload(tempFilePath);
      }
    });
  },

  chooseFromAlbum() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.handleImageUpload(tempFilePath);
      }
    });
  },

  // 上传图片并识别
  async handleImageUpload(tempFilePath) {
    // 显示用户发送的图片
    const userMessage = {
      id: ++this.data.messageIdCounter,
      type: 'user',
      content: '[图片]',
      imageUrl: tempFilePath,
      isImage: true,
      time: getCurrentTime()
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      lastMessageId: 'msg-' + userMessage.id,
      isLoading: true
    });

    try {
      wx.showLoading({ title: '上传中...' });

      // 第一步：上传图片获取URL
      const uploadRes = await this.uploadImage(tempFilePath);
      wx.hideLoading();

      wx.showLoading({ title: '识别中...' });

      // 第二步：调用识别接口
      console.log('【识别】上传结果uploadRes:', uploadRes);
      console.log('【识别】调用identifyCat, image_url:', uploadRes.image_url);
      const identifyRes = await api.cat.identifyCat(uploadRes.image_url);
      console.log('【识别】识别接口返回:', identifyRes);

      // 第三步：显示识别结果
      const aiContent = transformCatIdentifyResult(identifyRes);

      const aiMessage = {
        id: ++this.data.messageIdCounter,
        type: 'ai',
        content: aiContent,
        time: getCurrentTime(),
        isRAG: false,
        sources: [],
        catInfo: identifyRes.cat_info,
        recognized: identifyRes.recognized
      };

      this.setData({
        messages: [...this.data.messages, aiMessage],
        lastMessageId: 'msg-' + aiMessage.id,
        isLoading: false
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('【识别流程】捕获到错误:', error);
      console.error('【识别流程】错误详情:', error.message, error.stack);
      this.handleError('图片识别失败: ' + (error.message || '请重试'));
    }
  },

  // 第一步：上传图片到服务器
  uploadImage(tempFilePath) {
    const token = wx.getStorageSync('access_token');
    const uploadUrl = `${config.baseURL}/cats/identify/images`;
    console.log('【上传】请求URL:', uploadUrl);
    console.log('【上传】当前环境baseURL:', config.baseURL);
    console.log('【上传】token存在:', !!token);
    
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'Authorization': `Bearer ${token}`
          // 不要设置 Content-Type，让 wx.uploadFile 自动处理
        },
        success: (res) => {
          console.log('【上传】响应状态:', res.statusCode);
          console.log('【上传】响应数据:', res.data);
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              console.log('【上传】解析后data:', data);
              console.log('【上传】data.data:', data.data);
              if (data.code === 200) {
                console.log('【上传】返回的image_url:', data.data?.image_url);
                resolve(data.data);
              } else {
                reject(new Error(data.message || '上传失败'));
              }
            } catch (e) {
              console.error('【上传】解析响应失败:', e);
              reject(new Error('解析响应失败'));
            }
          } else {
            // 打印完整错误
            let errorMsg = `上传失败(${res.statusCode})`;
            try {
              const errData = JSON.parse(res.data);
              errorMsg = errData.message || errData.detail || JSON.stringify(errData);
            } catch (e) {}
            console.error('【上传】错误详情:', res.data);
            reject(new Error(errorMsg));
          }
        },
        fail: (err) => {
          console.error('上传失败:', err);
          reject(new Error('网络请求失败'));
        }
      });
    });
  },

  onPreviewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    });
  }
});

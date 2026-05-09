# 前端数据交互方案

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Page   │  │   Page   │  │   Page   │  │ Component│ │
│  │(archives)│  │ (chat)   │  │ (about)  │  │(modals) │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │              │      │
│       └─────────────┴─────────────┴──────────────┘      │
│                          │                               │
│                   ┌──────▼──────┐                        │
│                   │    Store    │  ← 全局状态管理         │
│                   │  (Reactive) │                        │
│                   └──────┬──────┘                        │
│                          │                               │
│                   ┌──────▼──────┐                        │
│                   │   API Layer │  ← 接口封装            │
│                   │  (api.js)   │                        │
│                   └──────┬──────┘                        │
└──────────────────────────┼──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   Backend API                           │
│              http://localhost:8000                      │
└─────────────────────────────────────────────────────────┘
```

## 2. API 模块说明

### 2.1 认证模块 (auth)

```javascript
// 登录（微信 code）
api.auth.login(wechatCode)
  .then(data => {
    // 自动保存 token
    console.log('登录成功', data);
  });

// 退出
api.auth.logout();

// 检查登录状态
const isAuth = api.auth.isAuthenticated();
```

### 2.2 猫咪模块 (cats)

```javascript
// 获取猫咪列表
const cats = await api.cats.getList({ page: 1, size: 10 });

// 获取猫咪详情
const cat = await api.cats.getDetail('cat_001');

// 更新猫咪（需管理员权限）
await api.cats.update('cat_001', { name: '新名字', description: '...' });

// 上传图片
await api.cats.uploadImage('cat_001', fileInput.files[0]);
```

### 2.3 对话模块 (chat)

```javascript
// 发送消息（AI 对话）
const response = await api.chat.sendMessage([
  { role: 'user', content: '你好，橘子汽水！' }
]);

// 创建会话
const conv = await api.chat.createConversation('与橘子的对话');

// 获取会话列表
const conversations = await api.chat.getConversations();

// 获取消息历史
const messages = await api.chat.getMessages(convId);

// 拍照识猫
const result = await api.chat.identifyCat(imageFile);
```

## 3. 状态管理

### 3.1 Store 结构

```javascript
store: {
  user: {
    isAuthenticated: false,  // 登录状态
    token: null,            // JWT Token
    info: null,             // 用户信息
  },
  cats: {
    list: [],               // 猫咪列表
    current: null,          // 当前查看的猫咪
    loading: false,         // 加载状态
    error: null,            // 错误信息
  },
  chat: {
    conversations: [],      // 会话列表
    currentConversation: null,
    messages: [],           // 当前会话消息
    loading: false,
    streaming: false,       // 是否正在流式接收
  }
}
```

### 3.2 使用方式

```javascript
import { store } from './js/store.js';

// 在组件中使用
export default function MyComponent() {
  return {
    store,  // 直接暴露到模板
    
    async loadCats() {
      store.cats.loading = true;
      try {
        const data = await api.cats.getList();
        store.setCats(data.items);
      } catch (err) {
        store.cats.error = err.message;
      } finally {
        store.cats.loading = false;
      }
    }
  };
}
```

## 4. 页面集成方案

### 4.1 档案馆页面 (archives.html)

```javascript
// 数据获取
async function loadCats() {
  const data = await api.cats.getList();
  this.cats = data.items;
}

// 点击卡片查看详情
async function viewCatDetail(catId) {
  const cat = await api.cats.getDetail(catId);
  this.selectedCat = cat;
  // 打开详情弹窗
}
```

### 4.2 对话页面 (chat.html)

```javascript
// 加载会话列表
async function loadConversations() {
  const data = await api.chat.getConversations();
  this.conversations = data.items;
}

// 发送消息
async function sendMessage(content) {
  // 添加用户消息到列表
  this.messages.push({ role: 'user', content });
  
  // 调用 API
  const response = await api.chat.sendMessage([
    ...this.messages,
    { role: 'user', content }
  ]);
  
  // 添加 AI 回复
  this.messages.push({
    role: 'assistant',
    content: response.content
  });
}
```

### 4.3 登录弹窗

```javascript
// 微信登录流程
async function wechatLogin() {
  // 1. 调用微信接口获取 code
  wx.login({
    success: async (res) => {
      // 2. 用 code 换取后端 token
      const data = await api.auth.login(res.code);
      // 3. 更新登录状态
      store.login(data.access_token, data.user);
      // 4. 关闭弹窗
      closeModal('loginModal');
    }
  });
}
```

## 5. 错误处理

### 5.1 全局错误拦截

```javascript
// 在 api.js 中添加响应拦截
async function request(url, options) {
  try {
    const response = await fetch(...);
    
    if (response.status === 401) {
      // Token 过期，跳转登录
      store.logout();
      openModal('loginModal');
      throw new Error('登录已过期，请重新登录');
    }
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (err) {
    // 统一错误提示
    showToast(err.message);
    throw err;
  }
}
```

### 5.2 请求重试

```javascript
async function requestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request(url, options);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await delay(1000 * (i + 1)); // 指数退避
    }
  }
}
```

## 6. 性能优化

### 6.1 数据缓存

```javascript
// 猫咪列表缓存 5 分钟
const cache = new Map();

async function getCatsWithCache() {
  const cacheKey = 'cats_list';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.time < 5 * 60 * 1000) {
    return cached.data;
  }
  
  const data = await api.cats.getList();
  cache.set(cacheKey, { data, time: Date.now() });
  return data;
}
```

### 6.2 防抖/节流

```javascript
// 搜索防抖
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 图片上传节流
const uploadImage = debounce(async (file) => {
  await api.cats.uploadImage(catId, file);
}, 300);
```

## 7. 安全考虑

1. **Token 存储**: 使用 localStorage，设置 7 天过期
2. **XSS 防护**: 所有用户输入内容在渲染前进行转义
3. **CSRF 防护**: 后端接口使用 JWT，不依赖 Cookie
4. **权限控制**: 前端只做 UI 控制，实际权限校验在后端

## 8. 接口调用示例

### 完整示例：猫咪档案页

```javascript
import { createApp } from 'https://unpkg.com/petite-vue?module';
import { store } from '../js/store.js';

createApp({
  store,
  cats: [],
  loading: false,
  error: null,
  
  async mounted() {
    await this.loadCats();
  },
  
  async loadCats() {
    this.loading = true;
    this.error = null;
    
    try {
      const data = await api.cats.getList({ page: 1, size: 20 });
      this.cats = data.items;
      store.setCats(data.items);
    } catch (err) {
      this.error = err.message;
      console.error('加载猫咪列表失败:', err);
    } finally {
      this.loading = false;
    }
  },
  
  async viewDetail(catId) {
    try {
      const cat = await api.cats.getDetail(catId);
      store.setCurrentCat(cat);
      // 跳转详情页或打开弹窗
    } catch (err) {
      alert('获取猫咪详情失败: ' + err.message);
    }
  },
  
  get isLoggedIn() {
    return store.user.isAuthenticated;
  }
}).mount('#archives-app');
```
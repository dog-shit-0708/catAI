<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- Sidebar - Conversation List -->
      <div class="chat-sidebar">
        <div class="sidebar-header">
          <div class="sidebar-title">对话列表</div>
          <button class="btn-new-chat" @click="createNewConversation" title="新建对话">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="conversation-list">
          <div v-if="loadingConversations" class="loading-text">加载中...</div>
          <div v-else-if="conversations.length === 0" class="empty-text">暂无对话</div>
          <div 
            v-for="conv in conversations" 
            :key="conv.id"
            class="conversation-item"
            :class="{ active: currentConversationId === conv.id }"
            @click="switchConversation(conv.id)"
          >
            <div class="conversation-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div class="conversation-info">
              <p>{{ conv.title }}</p>
            </div>
            <button class="btn-delete-chat" @click.stop="deleteConversation(conv.id)" title="删除对话">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <span class="conversation-time">{{ formatTime(conv.updated_at) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Main Chat -->
      <div class="chat-main">
        <div class="chat-header">
          <img src="./assets/images/cat_07.jpg" alt="Orange Soda" class="chat-header-avatar">
          <div class="chat-header-info">
            <h3>ORANGE_SODA</h3>
            <p>活泼好动的橘子汽水</p>
          </div>
        </div>
        
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="loadingMessages" class="loading-text">加载消息中...</div>
          <template v-else>
            <div 
              v-for="(msg, index) in messages" 
              :key="msg.id || index"
              class="message"
              :class="msg.role"
            >
              <div v-if="msg.role === 'user'" class="message-avatar user">我</div>
              <img v-else src="./assets/images/cat_07.jpg" alt="Cat" class="message-avatar">
              <div class="message-content">
                <p v-if="msg.streaming" class="streaming-text">{{ msg.content }}<span class="cursor">|</span></p>
                <p v-else>{{ msg.content }}</p>
                <!-- 显示用户上传的图片 -->
                <img v-if="msg.imageUrl" :src="msg.imageUrl" alt="上传的图片" class="message-image">
              </div>
            </div>
          </template>
        </div>
        
        <!-- 图片预览 -->
        <div v-if="imagePreview" class="image-preview-container">
          <div class="image-preview-wrapper">
            <img :src="imagePreview" alt="预览" class="image-preview">
            <button class="btn-remove-image" @click="removeSelectedImage" title="移除图片">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <span class="image-hint">已选择图片，点击发送进行识别</span>
        </div>
        
        <div class="chat-input">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleImageSelect"
          >
          <button 
            class="btn-upload" 
            @click="triggerImageUpload"
            :disabled="uploadingImage || !currentConversationId"
            title="上传图片识别猫咪"
            type="button"
          >
            <img src="/assets/11 (559).png" alt="上传图片" class="upload-icon">
          </button>
          <input 
            v-model="inputMessage" 
            type="text" 
            placeholder="输入消息与猫咪对话..."
            @keypress.enter="sendMessage('enter-key')"
            :disabled="sending || !currentConversationId"
          >
          <button @click="sendMessage('button-click')" :disabled="sending || !currentConversationId || (!inputMessage.trim() && !selectedImage)">
            {{ sending ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import chatApi from '../api/chat.js'
import catsApi from '../api/cats.js'

const authStore = useAuthStore()

// 会话列表
const conversations = reactive([])
const loadingConversations = ref(false)

// 消息列表
const messages = reactive([])
const loadingMessages = ref(false)

// 当前状态
const currentConversationId = ref(null)
const inputMessage = ref('')
const sending = ref(false)
const messagesContainer = ref(null)

// 图片上传相关
const uploadingImage = ref(false)
const selectedImage = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

// 防抖相关
const sendDebounceTimer = ref(null)
const lastSendTime = ref(0)
const DEBOUNCE_DELAY = 2000 // 2秒防抖
const isProcessingSend = ref(false) // 防止重复发送

// 本地缓存键名
const CACHE_KEY = 'chat_messages_cache'

// 从localStorage加载缓存的消息
function loadCachedMessages() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached)
      console.log('从缓存加载消息:', Object.keys(data).length, '个会话')
      return data
    }
  } catch (e) {
    console.error('加载缓存失败:', e)
  }
  return {}
}

// 保存消息到localStorage
function saveMessagesToCache(conversationId, msgList) {
  try {
    const cached = loadCachedMessages()
    cached[conversationId] = {
      messages: msgList,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch (e) {
    console.error('保存缓存失败:', e)
  }
}

// 获取缓存的消息
function getCachedMessages(conversationId) {
  const cached = loadCachedMessages()
  const data = cached[conversationId]
  if (data && data.messages) {
    return data.messages
  }
  return null
}

// 格式化时间
function formatTime(timeStr) {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  // 小于1小时显示分钟
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`
  }
  // 小于24小时显示小时
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  }
  // 否则显示日期
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 获取会话列表
async function loadConversations() {
  loadingConversations.value = true
  try {
    const res = await chatApi.getConversations(1, 20)
    if (res.code === 200 && res.data) {
      conversations.length = 0
      // 后端返回的是 data.data 而不是 data.items
      const list = res.data.data || []
      conversations.push(...list)
      // 如果有会话，默认选中第一个
      if (conversations.length > 0 && !currentConversationId.value) {
        currentConversationId.value = conversations[0].id
        await loadMessages(conversations[0].id)
      }
    }
  } catch (err) {
    console.error('获取会话列表失败:', err)
    // 不弹出alert，只在控制台显示错误
  } finally {
    loadingConversations.value = false
  }
}

// 获取消息列表
async function loadMessages(conversationId) {
  console.log('加载消息:', conversationId)
  loadingMessages.value = true
  
  // 先尝试从缓存加载
  const cached = getCachedMessages(conversationId)
  if (cached && cached.length > 0) {
    console.log('使用缓存消息:', cached.length)
    messages.length = 0
    messages.push(...cached)
    nextTick(scrollToBottom)
    // 缓存加载后，仍然尝试从服务器获取最新数据（后台静默更新）
    fetchMessagesFromServer(conversationId, false)
    return
  }
  
  // 没有缓存，从服务器加载
  await fetchMessagesFromServer(conversationId, true)
}

// 从服务器获取消息
async function fetchMessagesFromServer(conversationId, showLoading = true) {
  if (showLoading) {
    loadingMessages.value = true
  }
  try {
    const res = await chatApi.getMessages(conversationId, 1, 50)
    console.log('消息响应:', res)
    if (res.code === 200 && res.data) {
      // 后端直接返回消息数组在data中
      const msgList = Array.isArray(res.data) ? res.data : []
      console.log('消息列表:', msgList.length, '条')
      const formattedMessages = []
      msgList.forEach(msg => {
        formattedMessages.push({
          id: msg.id,
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
      
      // 只有当有消息时才更新（避免覆盖缓存）
      if (formattedMessages.length > 0) {
        messages.length = 0
        messages.push(...formattedMessages)
        console.log('加载后消息数:', messages.length)
        
        // 保存到缓存
        saveMessagesToCache(conversationId, formattedMessages)
      }
    }
  } catch (err) {
    console.error('获取消息失败:', err)
    // 如果已经有消息就不显示错误提示（可能是切换回来）
    if (messages.length === 0) {
      messages.push({
        role: 'assistant',
        content: '喵~ 加载消息失败了，请稍后再试...'
      })
    }
  } finally {
    loadingMessages.value = false
    nextTick(scrollToBottom)
  }
}

// 创建新会话
async function createNewConversation() {
  // 检查登录状态
  if (!authStore.isLoggedIn) {
    authStore.setShowLoginModal('login')
    return
  }

  try {
    const res = await chatApi.createConversation('新对话', 1, null)
    console.log('创建会话响应:', res)
    if (res.code === 200 && res.data) {
      const newConv = res.data
      console.log('新会话:', newConv)
      conversations.unshift(newConv)
      // 确保有id再切换
      if (newConv.id) {
        console.log('切换到新会话:', newConv.id)
        // 直接设置当前会话ID并清空消息列表（新会话没有消息）
        currentConversationId.value = newConv.id
        messages.length = 0
      } else {
        console.error('新会话没有id:', newConv)
      }
    }
  } catch (err) {
    console.error('创建会话失败:', err)
    alert('创建会话失败: ' + err.message)
  }
}

// 切换会话
async function switchConversation(id) {
  if (currentConversationId.value === id) return
  console.log('切换会话:', id)
  currentConversationId.value = id
  messages.length = 0
  await loadMessages(id)
}

// 删除会话
async function deleteConversation(id) {
  // 检查登录状态
  if (!authStore.isLoggedIn) {
    authStore.setShowLoginModal('login')
    return
  }

  if (!confirm('确定要删除这个对话吗？')) return
  try {
    const res = await chatApi.deleteConversation(id)
    if (res.code === 200) {
      const index = conversations.findIndex(c => c.id === id)
      if (index > -1) {
        conversations.splice(index, 1)
      }
      // 如果删除的是当前会话，切换到第一个或清空
      if (currentConversationId.value === id) {
        if (conversations.length > 0) {
          await switchConversation(conversations[0].id)
        } else {
          currentConversationId.value = null
          messages.length = 0
        }
      }
    }
  } catch (err) {
    console.error('删除会话失败:', err)
    alert('删除会话失败: ' + err.message)
  }
}

// 触发图片选择
function triggerImageUpload() {
  fileInput.value?.click()
}

// 处理图片选择
function handleImageSelect(event) {
  const file = event.target.files[0]
  console.log('[图片识别] 1. 选择图片:', file?.name, '大小:', file?.size)
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  
  // 验证文件大小（最大10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过10MB')
    return
  }
  
  selectedImage.value = file
  console.log('[图片识别] 2. 图片已保存到 selectedImage')
  
  // 生成预览
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    console.log('[图片识别] 3. 预览生成完成')
  }
  reader.readAsDataURL(file)
  
  // 清空input以便可以再次选择同一文件
  event.target.value = ''
}

// 移除选择的图片
function removeSelectedImage() {
  selectedImage.value = null
  imagePreview.value = null
}

// 发送消息（流式）
async function sendMessage(source = 'unknown') {
  console.log(`[sendMessage] 被调用，来源: ${source}, sending: ${sending.value}, isProcessing: ${isProcessingSend.value}`)
  
  // 防止重复处理
  if (isProcessingSend.value) {
    console.log('[sendMessage] 被拦截：正在处理中')
    return
  }
  
  // 检查登录状态
  if (!authStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  // 检查是否有当前会话
  if (!currentConversationId.value) {
    alert('请先创建或选择一个会话')
    return
  }

  const content = inputMessage.value.trim()
  const hasImage = selectedImage.value !== null
  
  console.log(`[sendMessage] content: ${content ? '有' : '无'}, hasImage: ${hasImage}, sending: ${sending.value}`)
  
  if ((!content && !hasImage)) {
    console.log('[sendMessage] 被拦截：无内容')
    return
  }
  
  // 防抖检查
  const now = Date.now()
  const timeSinceLastSend = now - lastSendTime.value
  console.log(`[sendMessage] 距离上次发送: ${timeSinceLastSend}ms, 防抖阈值: ${DEBOUNCE_DELAY}ms`)
  
  if (timeSinceLastSend < DEBOUNCE_DELAY && lastSendTime.value > 0) {
    console.log('[sendMessage] 进入防抖，重新计时')
    // 如果不到2秒，清除之前的计时器并重新设置
    if (sendDebounceTimer.value) {
      clearTimeout(sendDebounceTimer.value)
    }
    sendDebounceTimer.value = setTimeout(() => {
      sendMessage('debounce')
    }, DEBOUNCE_DELAY - timeSinceLastSend)
    return
  }
  
  // 标记正在处理
  isProcessingSend.value = true
  
  // 更新最后发送时间
  lastSendTime.value = now
  console.log('[sendMessage] 通过防抖检查，开始发送流程')
  
  // 保存当前图片预览
  const currentImagePreview = imagePreview.value
  const currentImageFile = selectedImage.value
  
  // 先显示用户消息（带图片）
  if (hasImage) {
    messages.push({ 
      role: 'user', 
      content: content || '[图片]',
      imageUrl: currentImagePreview
    })
  } else {
    messages.push({ role: 'user', content })
  }
  
  // 清空输入和图片
  inputMessage.value = ''
  removeSelectedImage()
  sending.value = true
  
  // 如果有图片，先上传到OSS获取URL，然后调用识别接口
  if (currentImageFile) {
    try {
      console.log('[sendMessage] 开始上传图片到OSS...', new Date().toISOString())
      const uploadStartTime = Date.now()
      const uploadRes = await catsApi.uploadIdentifyImage(currentImageFile)
      console.log(`[sendMessage] 上传完成，耗时: ${Date.now() - uploadStartTime}ms, 结果:`, uploadRes)
      
      if (uploadRes.code === 200 && uploadRes.data?.image_url) {
        const imageUrl = uploadRes.data.image_url
        console.log('[sendMessage] 图片上传成功:', imageUrl)
        
        // 调用猫咪识别接口（传入 conversation_id 保存到对话记忆）
        console.log('[sendMessage] 开始调用猫咪识别接口...', new Date().toISOString())
        const identifyStartTime = Date.now()
        const identifyRes = await chatApi.identifyCat(imageUrl, currentConversationId.value)
        console.log(`[sendMessage] 识别完成，耗时: ${Date.now() - identifyStartTime}ms, 结果:`, identifyRes)
        
        if (identifyRes.code === 200) {
          // 显示识别结果
          const result = identifyRes.data
          const aiMessage = { 
            role: 'assistant', 
            content: result.recognized 
              ? `喵~ 我识别出这只猫咪是「${result.cat_name}」！${result.message || ''}`
              : `喵~ ${result.message || '没能识别出这只猫咪呢~'}`,
            streaming: false
          }
          messages.push(aiMessage)
          
          // 保存到缓存
          const currentMessages = messages.filter(m => !m.loading).map(m => ({...m}))
          saveMessagesToCache(currentConversationId.value, currentMessages)
          
          sending.value = false
          isProcessingSend.value = false
          nextTick(scrollToBottom)
          return
        }
      }
    } catch (err) {
      console.error('[sendMessage] 图片处理失败:', err)
      messages.push({
        role: 'assistant',
        content: '喵~ 图片处理出错了: ' + err.message
      })
      sending.value = false
      isProcessingSend.value = false
      nextTick(scrollToBottom)
      return
    }
  }
  
  // 纯文字消息，使用流式API
  const userMessageContent = content
  
  // 添加AI消息占位（用于流式显示）
  const aiMessage = { role: 'assistant', content: '', streaming: true }
  messages.push(aiMessage)
  
  await nextTick()
  scrollToBottom()
  
  try {
    // 使用普通API（非SSE）
    console.log('[sendMessage] 调用普通对话API...')
    const res = await chatApi.sendMessage(currentConversationId.value, userMessageContent, 'text')
    console.log('[sendMessage] 对话响应:', res)
    
    if (res.code === 200 && res.data) {
      // 显示AI回复
      aiMessage.content = res.data.content || res.data.message || '喵~'
      aiMessage.streaming = false
      aiMessage.id = res.data.message_id || res.data.id
    } else {
      aiMessage.content = '喵~ 出错了: ' + (res.message || '请求失败')
      aiMessage.streaming = false
    }
    
    // 保存到缓存
    const currentMessages = messages.filter(m => !m.loading).map(m => ({...m}))
    saveMessagesToCache(currentConversationId.value, currentMessages)
    
    // 更新会话标题（如果是新对话）
    const conv = conversations.find(c => c.id === currentConversationId.value)
    if (conv && conv.title === '新对话') {
      conv.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
    }
    
  } catch (err) {
    console.error('发送失败:', err)
    // 移除AI消息占位，显示错误
    messages.pop()
    messages.push({
      role: 'assistant',
      content: '喵~ 发送失败了: ' + err.message
    })
  } finally {
    sending.value = false
    isProcessingSend.value = false
    console.log('[sendMessage] 处理完成，重置状态')
    nextTick(scrollToBottom)
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function scrollToTop() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = 0
  }
}

// 页面加载时
onMounted(() => {
  scrollToTop()
  if (!authStore.isLoggedIn) {
    authStore.setShowLoginModal('login')
  } else {
    loadConversations()
  }
})

// 监听登录状态变化，重新加载会话
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    // 清空当前状态
    conversations.length = 0
    messages.length = 0
    currentConversationId.value = null
    // 重新加载
    loadConversations()
  }
})
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 70px);
}

.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: 100%;
}

.chat-sidebar {
  background: white;
  border-right: 3px solid var(--color-black);
  padding: 2rem;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-black);
}

.sidebar-title {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.btn-new-chat {
  width: 32px;
  height: 32px;
  background: var(--color-cat-orange);
  border: 2px solid var(--color-black);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-new-chat:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px var(--color-black);
}

.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-text, .empty-text {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.875rem;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-black);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.conversation-item:hover,
.conversation-item.active {
  background: var(--color-cat-orange);
  transform: translate(-3px, -3px);
  box-shadow: 6px 6px 0px var(--color-black);
}

.conversation-icon {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  flex-shrink: 0;
}

.conversation-item:hover .conversation-icon,
.conversation-item.active .conversation-icon {
  background: white;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-info p {
  font-size: 0.875rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.7rem;
  opacity: 0.4;
  font-weight: 500;
}

.btn-delete-chat {
  width: 24px;
  height: 24px;
  background: transparent;
  border: 2px solid var(--color-black);
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.conversation-item:hover .btn-delete-chat {
  display: flex;
}

.btn-delete-chat:hover {
  background: #e74c3c;
  color: white;
  opacity: 1;
}

.chat-main {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  height: 100%;
  overflow: hidden;
}

.chat-header {
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--color-black);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.chat-header-avatar {
  width: 50px;
  height: 50px;
  border: 2px solid var(--color-black);
}

.chat-header-info h3 {
  font-weight: 700;
}

.chat-header-info p {
  font-size: 0.875rem;
  opacity: 0.6;
}

.chat-messages {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 70%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-black);
  flex-shrink: 0;
}

.message-avatar.user {
  background: var(--color-cat-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.message-content {
  background: white;
  border: 2px solid var(--color-black);
  padding: 1rem;
}

.message.user .message-content {
  background: var(--color-cat-orange);
}

.message-content p {
  font-size: 0.95rem;
  line-height: 1.6;
}

.streaming-text .cursor {
  animation: cursor-blink 1s infinite;
  color: var(--color-cat-orange);
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 图片上传相关样式 */
.image-preview-container {
  padding: 1rem 2rem;
  background: white;
  border-top: 2px solid var(--color-black);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.image-preview-wrapper {
  position: relative;
  display: inline-block;
}

.image-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid var(--color-black);
}

.btn-remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #e74c3c;
  color: white;
  border: 2px solid var(--color-black);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-remove-image:hover {
  transform: scale(1.1);
}

.image-hint {
  font-size: 0.875rem;
  color: #666;
}

.btn-upload {
  width: 50px;
  height: 50px;
  background: transparent !important;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  overflow: hidden;
}

.btn-upload:hover:not(:disabled) {
  transform: scale(1.1);
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  background: transparent;
  display: block;
}

/* 消息中的图片 */
.message-image {
  max-width: 200px;
  max-height: 200px;
  border: 2px solid var(--color-black);
  margin-top: 0.5rem;
  object-fit: cover;
}

.chat-input {
  padding: 1.5rem 2rem;
  border-top: 2px solid var(--color-black);
  background: white;
  display: flex;
  gap: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid var(--color-black);
  font-family: var(--font-main);
  font-size: 1rem;
  outline: none;
}

.chat-input input:focus {
  box-shadow: 6px 6px 0px var(--color-black);
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.chat-input button {
  padding: 1rem 2rem;
  background: var(--color-black);
  color: white;
  border: 2px solid var(--color-black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-input button:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--color-black);
}

.chat-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 968px) {
  .chat-container {
    grid-template-columns: 1fr;
  }
  
  .chat-sidebar {
    display: none;
  }
}
</style>

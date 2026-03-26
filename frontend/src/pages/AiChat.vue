<template>
  <div class="ai-chat">
    <header class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h1>💬 AI 智能问答</h1>
    </header>

    <div class="chat-container">
      <div class="chat-messages">
        <div class="message ai">
          <div class="avatar">🤖</div>
          <div class="content">
            你好！我是猫咪百科AI助手，可以帮你：
            <br>• 查询校园猫咪信息
            <br>• 解答养猫知识问题
            <br>• 提供投喂建议
            <br><br>试试问我："图书馆门口的橘猫叫什么？"
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="输入你的问题..."
          class="input-field"
        />
        <button @click="sendMessage" class="send-btn">发送</button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()
const message = ref('')

const goBack = () => {
  router.back()
}

const sendMessage = () => {
  if (message.value.trim()) {
    // TODO: 实现AI对话逻辑
    console.log('发送消息:', message.value)
    message.value = ''
  }
}
</script>

<style scoped>
.ai-chat {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  margin-right: 15px;
  cursor: pointer;
  color: #666;
}

.header h1 {
  font-size: 20px;
  color: #333;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 80px; /* 为底部导航留出空间 */
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.message.ai {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: white;
  font-size: 20px;
}

.content {
  background: white;
  padding: 15px;
  border-radius: 12px;
  max-width: 70%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  line-height: 1.5;
}

.chat-input {
  background: white;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
}

.input-field {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.input-field:focus {
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

.send-btn:hover {
  background: #5a6fd8;
}
</style>
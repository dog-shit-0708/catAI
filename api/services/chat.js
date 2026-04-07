// 对话服务
import { http } from '../core/http';

export const chatService = {
  // 创建对话
  createConversation(title = '新对话', chatType = 1) {
    return http.post('/chat/conversations', { title, chat_type: chatType });
  },

  // 获取对话列表
  getConversations(page = 1, pageSize = 20) {
    return http.get('/chat/conversations', { page, page_size: pageSize });
  },

  // 获取对话详情
  getConversationDetail(conversationId) {
    return http.get(`/chat/conversations/${conversationId}`);
  },

  // 发送消息 - AI响应时间较长，设置120秒超时
  sendMessage(conversationId, content, msgType = 'text', attachments = null) {
    return http.request({
      url: '/chat/completions',
      method: 'POST',
      data: {
        conversation_id: conversationId,
        content,
        msg_type: msgType,
        attachments
      },
      timeout: 120000  // 120秒超时，AI生成需要时间
    });
  },

  // 消息反馈
  sendFeedback(messageId, feedback) {
    return http.post(`/chat/messages/${messageId}/feedback?feedback=${feedback}`);
  }
};

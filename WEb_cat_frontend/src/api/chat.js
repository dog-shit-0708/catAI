import apiClient from './client.js'

export default {
  createConversation(title, chat_type = 1, cat_id = null) {
    return apiClient.post('/chat/conversations', { title, chat_type, cat_id })
  },

  getConversations(page = 1, page_size = 20) {
    return apiClient.get(`/chat/conversations?page=${page}&page_size=${page_size}`)
  },

  getConversation(id) {
    return apiClient.get(`/chat/conversations/${id}`)
  },

  deleteConversation(id) {
    return apiClient.delete(`/chat/conversations/${id}`)
  },

  getMessages(conversation_id, page = 1, page_size = 50) {
    return apiClient.get(`/chat/conversations/${conversation_id}/messages?page=${page}&page_size=${page_size}`)
  },

  sendMessage(conversation_id, content, msg_type = 'text') {
    return apiClient.post('/chat/completions', { conversation_id, content, msg_type }, {
      timeout: 120000
    })
  },

  sendFeedback(message_id, feedback_type) {
    return apiClient.post(`/chat/messages/${message_id}/feedback`, { feedback_type })
  },

  identifyCat(image_url, conversation_id) {
    let url = `/chat/identify-cat-ark?image_url=${encodeURIComponent(image_url)}`
    if (conversation_id) {
      url += `&conversation_id=${conversation_id}`
    }
    return apiClient.post(url, null, {
      timeout: 100000
    })
  }
}

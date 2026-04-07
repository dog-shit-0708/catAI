// 数据转换工具

/**
 * 转换后端消息为前端格式
 */
export function transformMessage(msg) {
  return {
    id: msg.id,
    type: msg.role === 'assistant' ? 'ai' : 'user',
    content: msg.content,
    time: formatTime(msg.created_at),
    isRAG: msg.context_data?.mode === 'rag',
    sources: msg.context_data?.knowledge_sources || [],
    ragMode: msg.context_data?.mode,
    ragReason: msg.context_data?.rag_reason,
    messageId: msg.message_id
  };
}

/**
 * 格式化时间
 */
export function formatTime(timestamp) {
  if (!timestamp) return getCurrentTime();
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 获取当前时间
 */
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 转换猫咪识别结果为消息文本
 */
export function transformCatIdentifyResult(result) {
  if (!result.recognized) {
    return '抱歉，未能识别出这只猫咪。请尝试上传更清晰的图片。';
  }

  const { cat_name, cat_info, message } = result;

  let text = message || `这只猫是：**${cat_name}**`;

  if (cat_info) {
    text += '\n\n猫咪信息：';
    if (cat_info.feature) {
      text += `\n• 特征：${cat_info.feature}`;
    }
  }

  return text;
}

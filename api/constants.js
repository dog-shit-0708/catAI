// API 常量定义

// 消息类型
export const MsgType = {
  TEXT: 'text',
  IMAGE: 'image'
};

// 对话类型
export const ChatType = {
  NORMAL: 1,
  IDENTIFY_CAT: 2
};

// RAG模式
export const RagMode = {
  RAG: 'rag',
  PLAIN_CHAT: 'plain_chat',
  IDENTIFY_CAT: 'identify_cat',
  PRIVACY_BLOCK: 'privacy_block'
};

// 反馈类型
export const FeedbackType = {
  LIKE: 1,
  DISLIKE: 2
};

// 领养状态
export const AdoptionStatus = {
  NOT_ADOPTED: 0,    // 未领养
  ADOPTING: 1,       // 领养中
  ADOPTED: 2         // 已领养
};

// 猫咪状态
export const CatStatus = {
  ACTIVE: 0,         // 活跃
  INACTIVE: 1,       // 不活跃
  MISSING: 2         // 失踪
};

// 默认分页
export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

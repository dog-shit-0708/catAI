// API 统一入口
export { http } from './core/http';
export { authService } from './services/auth';
export { userService } from './services/user';
export { catsService } from './services/cats';
export { feedingService } from './services/feeding';
export { chatService } from './services/chat';
export { catService } from './services/cat';
export { uploadService } from './services/upload';

// 统一API对象
import { authService } from './services/auth';
import { userService } from './services/user';
import { catsService } from './services/cats';
import { feedingService } from './services/feeding';
import { chatService } from './services/chat';
import { catService } from './services/cat';
import { uploadService } from './services/upload';

export const api = {
  auth: authService,
  user: userService,
  cats: catsService,
  feeding: feedingService,
  chat: chatService,
  cat: catService,
  upload: uploadService
};

export default api;

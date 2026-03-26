from typing import Dict, List, Optional, Any
from ..ai.factory import AIFactory
from ..core.config import settings
from ..core.logger import logger
from ..core.exceptions import AIError

class AIService:
    """AI服务封装层 - 业务逻辑与AI模型解耦"""

    def __init__(self):
        self._text_ai = None
        self._vision_ai = None

    @property
    def text_ai(self):
        """延迟初始化文本AI"""
        if self._text_ai is None:
            try:
                self._text_ai = AIFactory.create_text_ai(settings.ai.text_model.__dict__)
            except Exception as e:
                logger.error(f"文本AI初始化失败: {e}")
                raise AIError("文本AI服务初始化失败", "text_ai")
        return self._text_ai

    @property
    def vision_ai(self):
        """延迟初始化视觉AI"""
        if self._vision_ai is None:
            try:
                self._vision_ai = AIFactory.create_vision_ai(settings.ai.vision_model.__dict__)
            except Exception as e:
                logger.error(f"视觉AI初始化失败: {e}")
                raise AIError("视觉AI服务初始化失败", "vision_ai")
        return self._vision_ai

    async def chat_with_ai(self, message: str, user_id: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """AI对话服务"""
        try:
            # 输入验证
            if not message or not message.strip():
                raise AIError("消息内容不能为空", "validation")

            # 调用AI模型
            response = self.text_ai.chat(message.strip(), context)

            # 记录对话历史（这里可以保存到数据库）
            await self._save_chat_history(user_id, message, response)

            return {
                "success": True,
                "response": response,
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"AI对话失败 [用户: {user_id}]: {e}")
            return {
                "success": False,
                "error": "AI服务暂时不可用，请稍后重试",
                "timestamp": self._get_timestamp()
            }

    async def recognize_cat(self, image_path: Optional[str] = None,
                           image_bytes: Optional[bytes] = None,
                           cat_vectors: Dict[str, List[float]] = None) -> Dict[str, Any]:
        """猫咪识别服务"""
        try:
            # 参数验证
            if not image_path and not image_bytes:
                raise AIError("必须提供图片路径或图片字节流", "validation")

            if not cat_vectors:
                raise AIError("猫咪特征向量库不能为空", "validation")

            # 设置阈值
            threshold = settings.ai.vision_model.similarity_threshold

            # 调用视觉AI模型
            if image_bytes:
                result = self.vision_ai.recognize_cat_from_bytes(
                    image_bytes, cat_vectors, threshold
                )
            else:
                result = self.vision_ai.recognize_cat(
                    image_path, cat_vectors, threshold
                )

            return {
                "success": True,
                "recognition_result": result,
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"猫咪识别失败: {e}")
            return {
                "success": False,
                "error": "猫咪识别服务暂时不可用，请稍后重试",
                "timestamp": self._get_timestamp()
            }

    async def generate_embedding(self, text: str) -> Dict[str, Any]:
        """生成文本向量"""
        try:
            if not text or not text.strip():
                raise AIError("文本内容不能为空", "validation")

            vector = self.text_ai.generate_embedding(text.strip())

            return {
                "success": True,
                "embedding": vector,
                "dimensions": len(vector),
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"向量生成失败: {e}")
            return {
                "success": False,
                "error": "向量生成服务暂时不可用",
                "timestamp": self._get_timestamp()
            }

    async def extract_image_features(self, image_path: Optional[str] = None,
                                   image_bytes: Optional[bytes] = None) -> Dict[str, Any]:
        """提取图片特征向量"""
        try:
            if not image_path and not image_bytes:
                raise AIError("必须提供图片路径或图片字节流", "validation")

            if image_bytes:
                vector = self.vision_ai.extract_features_from_bytes(image_bytes)
            else:
                vector = self.vision_ai.extract_features(image_path)

            return {
                "success": True,
                "features": vector,
                "dimensions": len(vector),
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"特征提取失败: {e}")
            return {
                "success": False,
                "error": "特征提取服务暂时不可用",
                "timestamp": self._get_timestamp()
            }

    async def health_check(self) -> Dict[str, Any]:
        """服务健康检查"""
        try:
            text_ai_status = self.text_ai.health_check() if self._text_ai else False
            vision_ai_status = self.vision_ai.health_check() if self._vision_ai else False

            overall_status = text_ai_status and vision_ai_status

            return {
                "success": overall_status,
                "services": {
                    "text_ai": {
                        "status": "healthy" if text_ai_status else "unhealthy",
                        "type": settings.ai.text_model.type
                    },
                    "vision_ai": {
                        "status": "healthy" if vision_ai_status else "unhealthy",
                        "type": settings.ai.vision_model.type
                    }
                },
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"健康检查失败: {e}")
            return {
                "success": False,
                "error": "健康检查失败",
                "timestamp": self._get_timestamp()
            }

    async def _save_chat_history(self, user_id: str, question: str, answer: str) -> None:
        """保存对话历史（待实现数据库操作）"""
        # TODO: 实现对话历史保存到数据库
        logger.info(f"对话历史: 用户[{user_id}] 问: {question} 答: {answer}")

    def _get_timestamp(self) -> str:
        """获取当前时间戳"""
        from datetime import datetime
        return datetime.now().isoformat()

    async def switch_model(self, service_type: str, model_type: str) -> Dict[str, Any]:
        """动态切换AI模型"""
        try:
            if service_type == "text":
                # 重新创建文本AI实例
                AIFactory.reload_model(model_type, "text")
                self._text_ai = None  # 强制重新初始化
                logger.info(f"文本AI模型已切换到: {model_type}")

            elif service_type == "vision":
                # 重新创建视觉AI实例
                AIFactory.reload_model(model_type, "vision")
                self._vision_ai = None  # 强制重新初始化
                logger.info(f"视觉AI模型已切换到: {model_type}")

            else:
                raise AIError(f"不支持的服务类型: {service_type}", "validation")

            return {
                "success": True,
                "message": f"{service_type} AI模型已切换到 {model_type}",
                "timestamp": self._get_timestamp()
            }

        except Exception as e:
            logger.error(f"切换AI模型失败: {e}")
            return {
                "success": False,
                "error": f"切换模型失败: {str(e)}",
                "timestamp": self._get_timestamp()
            }
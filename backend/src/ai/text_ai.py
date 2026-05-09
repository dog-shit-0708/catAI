import os
from typing import Dict, Any, List, Optional
from .base import BaseTextAI
from ..core.logger import logger
from ..core.exceptions import AIError

class MockTextAI(BaseTextAI):
    """模拟文本AI - 用于开发和测试"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.initialized = False

    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化模拟AI"""
        self.knowledge_base = {
            "猫咪能吃火腿肠吗": "不建议给猫咪吃火腿肠，因为火腿肠含有较高的盐分和添加剂，对猫咪健康不利。建议选择专门的猫粮或猫罐头。",
            "如何科学投喂流浪猫": "1. 选择优质猫粮，避免人类食物\n2. 定时定量投喂，避免过度投喂\n3. 提供清洁的饮用水\n4. 观察猫咪的健康状况\n5. 如有异常及时联系救助组织",
            "大橘": "大橘是一只橘色的公猫，2岁，已绝育，性格温顺亲人，经常在图书馆门口活动。",
            "默认": "我是猫咪百科AI助手，可以帮您了解校园猫咪信息、养猫知识和投喂建议。请告诉我您想了解什么？"
        }
        self.initialized = True
        logger.info("Mock文本AI初始化完成")

    def chat(self, message: str, context: Optional[Dict] = None) -> str:
        """模拟对话"""
        if not self.initialized:
            raise AIError("模型未初始化", "text_ai")

        message = message.strip().lower()

        # 简单的关键词匹配
        for keyword, response in self.knowledge_base.items():
            if keyword in message:
                return response

        return self.knowledge_base["默认"]

    def generate_embedding(self, text: str) -> List[float]:
        """生成模拟向量"""
        if not self.initialized:
            raise AIError("模型未初始化", "text_ai")

        # 返回一个固定的模拟向量
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        hash_int = int(hash_obj.hexdigest()[:8], 16)

        # 生成512维的模拟向量
        vector = [(hash_int + i) % 1000 / 1000.0 for i in range(512)]
        return vector

    def health_check(self) -> bool:
        """健康检查"""
        return self.initialized

class OpenAITextAI(BaseTextAI):

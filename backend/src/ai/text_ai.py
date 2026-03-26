import os
from typing import Dict, Any, List, Optional
from .base import BaseTextAI
from ..core.logger import logger
from ..core.exceptions import AIError

class MockTextAI(BaseTextAI):
    """模拟文本AI - 用于开发和测试"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)

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
    """OpenAI文本AI实现"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get('api_key', '')
        self.model = config.get('model', 'gpt-3.5-turbo')
        self.temperature = config.get('temperature', 0.7)

    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化OpenAI"""
        try:
            import openai
            openai.api_key = self.api_key
            self.openai = openai
            self.initialized = True
            logger.info("OpenAI文本AI初始化完成")
        except ImportError:
            raise AIError("OpenAI库未安装，请先安装: pip install openai", "text_ai")
        except Exception as e:
            raise AIError(f"OpenAI初始化失败: {str(e)}", "text_ai")

    def chat(self, message: str, context: Optional[Dict] = None) -> str:
        """OpenAI对话"""
        if not self.initialized:
            raise AIError("模型未初始化", "text_ai")

        try:
            # 构建系统提示词
            system_prompt = """你是校园流浪猫百科AI助手，专门帮助学生了解校园猫咪信息、养猫知识和科学投喂建议。

            你的能力包括：
            1. 回答关于校园猫咪的基本信息
            2. 提供科学的养猫和投喂知识
            3. 给出合理的投喂建议

            请用友好、专业的语气回答问题。如果不知道确切答案，请诚实地说明并提供一般性建议。"""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]

            response = self.openai.ChatCompletion.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=500
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"OpenAI对话失败: {e}")
            raise AIError(f"AI对话服务暂时不可用: {str(e)}", "text_ai")

    def generate_embedding(self, text: str) -> List[float]:
        """生成OpenAI向量"""
        if not self.initialized:
            raise AIError("模型未初始化", "text_ai")

        try:
            response = self.openai.Embedding.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI向量生成失败: {e}")
            raise AIError(f"向量生成失败: {str(e)}", "text_ai")

    def health_check(self) -> bool:
        """健康检查"""
        if not self.initialized:
            return False

        try:
            # 简单的健康检查
            self.openai.models.list()
            return True
        except Exception as e:
            logger.warning(f"OpenAI健康检查失败: {e}")
            return False
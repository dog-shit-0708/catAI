from typing import Dict, Any
from .base import BaseTextAI, BaseVisionAI
from .text_ai import OpenAITextAI, MockTextAI
from .glm4_ai import GLM4TextAI
from .vision_ai import CLIPVisionAI, MockVisionAI
from ..core.logger import logger
from ..core.exceptions import AIError

class AIFactory:
    """AI模型工厂"""

    _text_instances = {}
    _vision_instances = {}

    @classmethod
    def create_text_ai(cls, config: Dict[str, Any]) -> BaseTextAI:
        """创建文本AI实例"""
        model_type = config.get('type', 'mock').lower()

        # 检查是否已有实例
        if model_type in cls._text_instances:
            return cls._text_instances[model_type]

        try:
            if model_type == 'openai':
                instance = OpenAITextAI(config)
            elif model_type == 'glm4':
                instance = GLM4TextAI(config)
            elif model_type == 'mock':
                instance = MockTextAI(config)
            else:
                # 未来可以添加更多模型
                raise ValueError(f"不支持的文本模型: {model_type}")

            # 初始化模型
            instance.initialize(config)
            cls._text_instances[model_type] = instance

            logger.info(f"文本AI模型 {model_type} 初始化成功")
            return instance

        except Exception as e:
            logger.error(f"创建文本AI模型失败: {e}")
            raise AIError(f"文本AI模型初始化失败: {str(e)}", "text_ai")

    @classmethod
    def create_vision_ai(cls, config: Dict[str, Any]) -> BaseVisionAI:
        """创建视觉AI实例"""
        model_type = config.get('type', 'mock').lower()

        # 检查是否已有实例
        if model_type in cls._vision_instances:
            return cls._vision_instances[model_type]

        try:
            if model_type == 'clip':
                instance = CLIPVisionAI(config)
            elif model_type == 'mock':
                instance = MockVisionAI(config)
            else:
                # 未来可以添加更多模型
                raise ValueError(f"不支持的视觉模型: {model_type}")

            # 初始化模型
            instance.initialize(config)
            cls._vision_instances[model_type] = instance

            logger.info(f"视觉AI模型 {model_type} 初始化成功")
            return instance

        except Exception as e:
            logger.error(f"创建视觉AI模型失败: {e}")
            raise AIError(f"视觉AI模型初始化失败: {str(e)}", "vision_ai")

    @classmethod
    def get_available_text_models(cls) -> list:
        """获取可用的文本模型列表"""
        return ['mock', 'openai', 'glm4']  # 可扩展

    @classmethod
    def get_available_vision_models(cls) -> list:
        """获取可用的视觉模型列表"""
        return ['mock', 'clip']  # 可扩展

    @classmethod
    def reload_model(cls, model_type: str, model_category: str = 'text') -> bool:
        """重新加载模型"""
        try:
            if model_category == 'text':
                if model_type in cls._text_instances:
                    del cls._text_instances[model_type]
            elif model_category == 'vision':
                if model_type in cls._vision_instances:
                    del cls._vision_instances[model_type]

            logger.info(f"模型 {model_type} ({model_category}) 已重新加载")
            return True

        except Exception as e:
            logger.error(f"重新加载模型失败: {e}")
            return False
"""
AI能力层模块
提供模型无关的AI服务抽象，支持多种AI模型动态切换
"""

from .base import BaseTextAI, BaseVisionAI, BaseAIModel
from .factory import AIFactory

__all__ = [
    'BaseTextAI',
    'BaseVisionAI',
    'BaseAIModel',
    'AIFactory'
]
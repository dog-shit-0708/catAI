"""
核心框架模块
包含配置管理、日志系统、异常处理等基础功能
"""

from .config import settings, Config
from .logger import logger, Logger
from .exceptions import (
    BaseException,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    ResourceNotFoundError,
    AIError,
    DatabaseError,
    RateLimitError,
    handle_exception
)

__all__ = [
    'settings',
    'Config',
    'logger',
    'Logger',
    'BaseException',
    'ValidationError',
    'AuthenticationError',
    'AuthorizationError',
    'ResourceNotFoundError',
    'AIError',
    'DatabaseError',
    'RateLimitError',
    'handle_exception'
]
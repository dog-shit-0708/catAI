from typing import Optional, Dict, Any
from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR

class BaseException(Exception):
    """基础异常类"""
    def __init__(self, message: str, code: str = None, details: Dict[str, Any] = None):
        self.message = message
        self.code = code or self.__class__.__name__
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(BaseException):
    """数据验证异常"""
    def __init__(self, message: str = "数据验证失败", details: Dict[str, Any] = None):
        super().__init__(message, "VALIDATION_ERROR", details)

class AuthenticationError(BaseException):
    """认证异常"""
    def __init__(self, message: str = "认证失败"):
        super().__init__(message, "AUTHENTICATION_ERROR")

class AuthorizationError(BaseException):
    """授权异常"""
    def __init__(self, message: str = "权限不足"):
        super().__init__(message, "AUTHORIZATION_ERROR")

class ResourceNotFoundError(BaseException):
    """资源不存在异常"""
    def __init__(self, resource: str, resource_id: str = None):
        message = f"{resource}不存在"
        if resource_id:
            message += f" (ID: {resource_id})"
        super().__init__(message, "RESOURCE_NOT_FOUND")

class AIError(BaseException):
    """AI服务异常"""
    def __init__(self, message: str = "AI服务暂时不可用", service: str = None):
        details = {"service": service} if service else {}
        super().__init__(message, "AI_ERROR", details)

class DatabaseError(BaseException):
    """数据库异常"""
    def __init__(self, message: str = "数据库操作失败"):
        super().__init__(message, "DATABASE_ERROR")

class RateLimitError(BaseException):
    """限流异常"""
    def __init__(self, message: str = "请求过于频繁，请稍后重试"):
        super().__init__(message, "RATE_LIMIT_ERROR")

def handle_exception(exc: BaseException) -> HTTPException:
    """将自定义异常转换为HTTP异常"""
    status_code_map = {
        ValidationError: HTTP_400_BAD_REQUEST,
        AuthenticationError: HTTP_401_UNAUTHORIZED,
        AuthorizationError: HTTP_401_UNAUTHORIZED,
        ResourceNotFoundError: HTTP_404_NOT_FOUND,
        AIError: HTTP_500_INTERNAL_SERVER_ERROR,
        DatabaseError: HTTP_500_INTERNAL_SERVER_ERROR,
        RateLimitError: 429,  # Too Many Requests
    }

    status_code = status_code_map.get(type(exc), HTTP_500_INTERNAL_SERVER_ERROR)

    return HTTPException(
        status_code=status_code,
        detail={
            "message": exc.message,
            "code": exc.code,
            "details": exc.details
        }
    )
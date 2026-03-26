"""
API v1版本接口
"""

from .ai import router as ai_router

__all__ = [
    'ai_router'
]

# 未来可以添加更多路由
# from .cats import router as cats_router
# from .feeding import router as feeding_router
# from .auth import router as auth_router

# __all__.extend([
#     'cats_router',
#     'feeding_router',
#     'auth_router'
# ])
"""
业务服务层模块
封装核心业务逻辑，与AI能力层和数据访问层解耦
"""

from .ai_service import AIService

__all__ = [
    'AIService'
]

# 未来可以添加其他服务
# from .user_service import UserService
# from .cat_service import CatService
# from .feeding_service import FeedingService

# __all__.extend([
#     'UserService',
#     'CatService',
#     'FeedingService'
# ])
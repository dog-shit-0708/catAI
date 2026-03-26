from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os

from src.api.v1.ai import router as ai_router
from src.core.config import settings
from src.core.logger import logger
from src.core.exceptions import BaseException, handle_exception

# 全局异常处理器
@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    logger.info(f"启动 {settings.app.name} v{settings.app.version}")
    logger.info(f"调试模式: {settings.app.debug}")
    logger.info(f"服务监听: {settings.app.host}:{settings.app.port}")

    # 创建必要的目录
    os.makedirs("temp_uploads", exist_ok=True)
    os.makedirs("logs", exist_ok=True)

    yield

    # 关闭时执行
    logger.info(f"{settings.app.name} 正在关闭...")

# 创建FastAPI应用
app = FastAPI(
    title=settings.app.name,
    version=settings.app.version,
    debug=settings.app.debug,
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该设置为具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册异常处理器
@app.exception_handler(BaseException)
async def custom_exception_handler(request: Request, exc: BaseException):
    """自定义异常处理器"""
    return handle_exception(exc)

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """通用异常处理器"""
    logger.error(f"未处理的异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "服务器内部错误",
            "timestamp": ""
        }
    )

# 健康检查端点
@app.get("/health")
async def health_check():
    """服务健康检查"""
    return {
        "status": "healthy",
        "service": settings.app.name,
        "version": settings.app.version,
        "timestamp": ""
    }

# 根路径
@app.get("/")
async def root():
    """根路径"""
    return {
        "message": f"欢迎使用 {settings.app.name}",
        "version": settings.app.version,
        "docs": "/docs",
        "redoc": "/redoc"
    }

# 注册API路由
app.include_router(ai_router, prefix="/api/v1")

# 添加更多API路由的占位符
@app.get("/api/v1/cats")
async def get_cats():
    """获取猫咪列表 - 待实现"""
    return {
        "message": "猫咪列表接口待实现",
        "timestamp": ""
    }

@app.get("/api/v1/feeding")
async def get_feeding():
    """获取投喂记录 - 待实现"""
    return {
        "message": "投喂记录接口待实现",
        "timestamp": ""
    }

if __name__ == "__main__":
    # 启动服务
    uvicorn.run(
        "main:app",
        host=settings.app.host,
        port=settings.app.port,
        reload=settings.app.debug,
        log_level="info"
    )
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import aiofiles
import os
import uuid
from datetime import datetime

from ...services.ai_service import AIService
from ...core.logger import logger
from ...core.exceptions import handle_exception

router = APIRouter(prefix="/ai", tags=["AI服务"])

# 依赖注入
async def get_ai_service():
    return AIService()

@router.post("/chat")
async def chat_with_ai(
    message: str = Form(...),
    user_id: str = Form(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """AI对话接口"""
    try:
        result = await ai_service.chat_with_ai(message, user_id)
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"AI对话接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="AI服务内部错误")

@router.post("/recognize-cat")
async def recognize_cat(
    image: UploadFile = File(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """猫咪识别接口"""
    temp_file_path = None
    try:
        # 验证文件类型
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="请上传图片文件")

        # 保存上传的文件到临时目录
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)

        file_ext = os.path.splitext(image.filename)[1] or '.jpg'
        temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_ext}")

        # 异步保存文件
        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await image.read()
            await f.write(content)

        # 模拟猫咪特征向量库（实际应该从数据库获取）
        mock_cat_vectors = {
            "cat_001": [0.8, 0.2, 0.1, 0.9, 0.3] * 100 + [0.1] * 412,  # 大橘
            "cat_002": [0.2, 0.8, 0.9, 0.1, 0.7] * 100 + [0.2] * 412,  # 小花
            "cat_003": [0.9, 0.1, 0.8, 0.2, 0.1] * 100 + [0.3] * 412,  # 小黑
        }

        # 调用识别服务
        result = await ai_service.recognize_cat(
            image_path=temp_file_path,
            cat_vectors=mock_cat_vectors
        )

        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"猫咪识别接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="猫咪识别服务内部错误")

    finally:
        # 清理临时文件
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logger.warning(f"清理临时文件失败: {e}")

@router.post("/recognize-cat-bytes")
async def recognize_cat_from_bytes(
    image: UploadFile = File(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """猫咪识别接口（字节流版本）"""
    try:
        # 验证文件类型
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="请上传图片文件")

        # 读取图片字节流
        image_bytes = await image.read()

        # 模拟猫咪特征向量库
        mock_cat_vectors = {
            "cat_001": [0.8, 0.2, 0.1, 0.9, 0.3] * 100 + [0.1] * 412,
            "cat_002": [0.2, 0.8, 0.9, 0.1, 0.7] * 100 + [0.2] * 412,
            "cat_003": [0.9, 0.1, 0.8, 0.2, 0.1] * 100 + [0.3] * 412,
        }

        # 调用识别服务
        result = await ai_service.recognize_cat(
            image_bytes=image_bytes,
            cat_vectors=mock_cat_vectors
        )

        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"猫咪识别接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="猫咪识别服务内部错误")

@router.post("/generate-embedding")
async def generate_embedding(
    text: str = Form(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """生成文本向量接口"""
    try:
        result = await ai_service.generate_embedding(text)
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"向量生成接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="向量生成服务内部错误")

@router.post("/extract-features")
async def extract_features(
    image: UploadFile = File(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """提取图片特征接口"""
    temp_file_path = None
    try:
        # 验证文件类型
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="请上传图片文件")

        # 保存临时文件
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)

        file_ext = os.path.splitext(image.filename)[1] or '.jpg'
        temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_ext}")

        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await image.read()
            await f.write(content)

        # 调用特征提取服务
        result = await ai_service.extract_image_features(image_path=temp_file_path)
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"特征提取接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="特征提取服务内部错误")

    finally:
        # 清理临时文件
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logger.warning(f"清理临时文件失败: {e}")

@router.get("/health")
async def ai_health_check(ai_service: AIService = Depends(get_ai_service)):
    """AI服务健康检查"""
    try:
        result = await ai_service.health_check()
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"AI健康检查接口异常: {e}")
        return JSONResponse(
            content={
                "success": False,
                "error": "健康检查失败",
                "timestamp": datetime.now().isoformat()
            },
            status_code=500
        )

@router.post("/switch-model/{service_type}")
async def switch_ai_model(
    service_type: str,  # text 或 vision
    model_type: str = Form(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """切换AI模型接口（管理员用）"""
    try:
        # 这里应该添加管理员权限验证
        result = await ai_service.switch_model(service_type, model_type)
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"切换AI模型接口异常: {e}")
        if hasattr(e, 'code'):
            raise handle_exception(e)
        raise HTTPException(status_code=500, detail="模型切换服务内部错误")

@router.get("/available-models")
async def get_available_models():
    """获取可用的AI模型列表"""
    try:
        from ...ai.factory import AIFactory

        return JSONResponse(content={
            "success": True,
            "text_models": AIFactory.get_available_text_models(),
            "vision_models": AIFactory.get_available_vision_models(),
            "current": {
                "text_model": "mock",  # 可以从配置中获取当前使用的模型
                "vision_model": "mock"
            },
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"获取可用模型列表异常: {e}")
        return JSONResponse(
            content={
                "success": False,
                "error": "获取模型列表失败",
                "timestamp": datetime.now().isoformat()
            },
            status_code=500
        )
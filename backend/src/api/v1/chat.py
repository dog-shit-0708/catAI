"""
聊天与猫咪识别路由
"""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import aiofiles
import os
import uuid
from datetime import datetime

from ...services.ai_service import AIService
from ...core.logger import logger
from ...core.config import settings

router = APIRouter(tags=["聊天与识别"])

# 依赖注入
async def get_ai_service():
    return AIService()


@router.post("/cats/identify/images")
async def upload_identify_image(
    file: UploadFile = File(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """
    上传猫咪识别图片
    返回图片URL供识别接口使用
    """
    temp_file_path = None
    try:
        # 验证文件类型
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="请上传图片文件(jpg/png/gif/webp)")
        
        # 验证文件大小 (最大10MB)
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="图片大小不能超过10MB")
        
        # 创建上传目录
        upload_dir = "uploads/identify"
        os.makedirs(upload_dir, exist_ok=True)
        
        # 生成文件名
        file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else '.jpg'
        if file_ext not in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            file_ext = '.jpg'
        
        filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(upload_dir, filename)
        
        # 保存文件
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # 构建图片URL (使用相对路径，实际生产环境应该使用OSS/CDN)
        # 这里返回一个可以被访问的URL
        image_url = f"/uploads/identify/{filename}"
        
        logger.info(f"图片上传成功: {image_url}")
        
        return JSONResponse(content={
            "code": 200,
            "message": "上传成功",
            "data": {
                "image_url": image_url
            }
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"图片上传失败: {e}")
        raise HTTPException(status_code=500, detail="图片上传失败")
    
    finally:
        # 清理临时文件
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logger.warning(f"清理临时文件失败: {e}")


@router.post("/chat/identify-cat-ark")
async def identify_cat_by_url(
    image_url: str = Form(...),
    ai_service: AIService = Depends(get_ai_service)
):
    """
    根据图片URL识别猫咪
    使用视觉AI模型分析图片中的猫咪特征
    """
    try:
        if not image_url:
            raise HTTPException(status_code=400, detail="image_url不能为空")
        
        # 构建完整的文件路径
        if image_url.startswith('/'):
            image_path = image_url.lstrip('/')
        else:
            image_path = image_url
        
        # 检查文件是否存在
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="图片文件不存在")
        
        # 模拟猫咪特征向量库（实际应该从数据库获取）
        # 这里使用模拟数据，实际应该查询数据库获取所有猫咪的特征向量
        mock_cat_vectors = {
            "建国": [0.8, 0.2, 0.1, 0.9, 0.3] * 100 + [0.1] * 412,
            "十一": [0.2, 0.8, 0.9, 0.1, 0.7] * 100 + [0.2] * 412,
            "珠圆": [0.9, 0.1, 0.8, 0.2, 0.1] * 100 + [0.3] * 412,
            "歪猪": [0.3, 0.9, 0.2, 0.8, 0.4] * 100 + [0.4] * 412,
            "奶霸": [0.7, 0.3, 0.6, 0.4, 0.8] * 100 + [0.5] * 412,
        }
        
        # 调用识别服务
        result = await ai_service.recognize_cat(
            image_path=image_path,
            cat_vectors=mock_cat_vectors
        )
        
        if result.get("success"):
            recognition = result.get("recognition_result", {})
            
            # 判断是否识别成功
            if recognition.get("recognized", False):
                cat_name = recognition.get("cat_name", "")
                similarity = recognition.get("similarity", 0)
                
                # 构建猫咪信息
                cat_info = {
                    "id": hash(cat_name) % 10000,  # 模拟ID
                    "name": cat_name,
                    "description": f"{cat_name}是一只可爱的猫咪",
                    "features": recognition.get("features", "")
                }
                
                # 构建备选列表
                alternatives = recognition.get("alternatives", [])
                
                return JSONResponse(content={
                    "code": 200,
                    "message": "识别成功",
                    "data": {
                        "recognized": True,
                        "cat_name": cat_name,
                        "cat_info": cat_info,
                        "similarity": similarity,
                        "alternatives": alternatives,
                        "message": f"识别成功！这是{cat_name}"
                    }
                })
            else:
                # 未识别出猫咪
                return JSONResponse(content={
                    "code": 200,
                    "message": "识别完成",
                    "data": {
                        "recognized": False,
                        "message": "未能识别出该猫咪，可能是数据库中没有这只猫咪的信息",
                        "raw_response": recognition
                    }
                })
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "识别失败"))
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"猫咪识别失败: {e}")
        raise HTTPException(status_code=500, detail="猫咪识别服务暂时不可用")

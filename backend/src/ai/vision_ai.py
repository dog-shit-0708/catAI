import os
import base64
from typing import Dict, Any, List, Optional
from .base import BaseVisionAI
from ..core.logger import logger
from ..core.exceptions import AIError

class MockVisionAI(BaseVisionAI):
    """模拟视觉AI - 用于开发和测试"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.threshold = config.get('similarity_threshold', 0.8)

    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化模拟视觉AI"""
        # 模拟一些猫咪的特征向量
        self.mock_cat_vectors = {
            "cat_001": [0.8, 0.2, 0.1, 0.9, 0.3] * 100 + [0.1] * 412,  # 大橘
            "cat_002": [0.2, 0.8, 0.9, 0.1, 0.7] * 100 + [0.2] * 412,  # 小花
            "cat_003": [0.9, 0.1, 0.8, 0.2, 0.1] * 100 + [0.3] * 412,  # 小黑
        }
        self.initialized = True
        logger.info("Mock视觉AI初始化完成")

    def extract_features(self, image_path: str) -> List[float]:
        """模拟特征提取"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        if not os.path.exists(image_path):
            raise AIError(f"图片文件不存在: {image_path}", "vision_ai")

        # 基于文件名的hash生成模拟向量
        import hashlib
        with open(image_path, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()

        hash_int = int(file_hash[:8], 16)
        vector = [(hash_int + i) % 1000 / 1000.0 for i in range(512)]
        return vector

    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        """从字节流提取模拟特征"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        import hashlib
        hash_obj = hashlib.md5(image_bytes)
        hash_int = int(hash_obj.hexdigest()[:8], 16)

        vector = [(hash_int + i) % 1000 / 1000.0 for i in range(512)]
        return vector

    def compare_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算相似度"""
        return self.cosine_similarity(vec1, vec2)

    def recognize_cat(self,
                     image_path: str,
                     cat_vectors: Dict[str, List[float]],
                     threshold: float = 0.8) -> Dict[str, Any]:
        """模拟猫咪识别"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            # 提取特征
            query_vector = self.extract_features(image_path)

            # 与数据库中的猫咪进行比对
            best_match = None
            best_similarity = 0.0

            for cat_id, cat_vector in cat_vectors.items():
                similarity = self.compare_similarity(query_vector, cat_vector)
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = cat_id

            # 判断是否超过阈值
            if best_similarity >= threshold:
                return {
                    "success": True,
                    "cat_id": best_match,
                    "similarity": best_similarity,
                    "message": f"识别成功，相似度: {best_similarity:.3f}"
                }
            else:
                return {
                    "success": False,
                    "cat_id": None,
                    "similarity": best_similarity,
                    "message": "未找到匹配的猫咪"
                }

        except Exception as e:
            logger.error(f"猫咪识别失败: {e}")
            raise AIError(f"猫咪识别失败: {str(e)}", "vision_ai")

    def recognize_cat_from_bytes(self,
                                image_bytes: bytes,
                                cat_vectors: Dict[str, List[float]],
                                threshold: float = 0.8) -> Dict[str, Any]:
        """从字节流识别猫咪"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            # 提取特征
            query_vector = self.extract_features_from_bytes(image_bytes)

            # 与数据库中的猫咪进行比对
            best_match = None
            best_similarity = 0.0

            for cat_id, cat_vector in cat_vectors.items():
                similarity = self.compare_similarity(query_vector, cat_vector)
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_match = cat_id

            # 判断是否超过阈值
            if best_similarity >= threshold:
                return {
                    "success": True,
                    "cat_id": best_match,
                    "similarity": best_similarity,
                    "message": f"识别成功，相似度: {best_similarity:.3f}"
                }
            else:
                return {
                    "success": False,
                    "cat_id": None,
                    "similarity": best_similarity,
                    "message": "未找到匹配的猫咪"
                }

        except Exception as e:
            logger.error(f"猫咪识别失败: {e}")
            raise AIError(f"猫咪识别失败: {str(e)}", "vision_ai")

    def health_check(self) -> bool:
        """健康检查"""
        return self.initialized

class CLIPVisionAI(BaseVisionAI):
    """CLIP视觉AI实现"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.model_path = config.get('model_path', './models/clip')
        self.threshold = config.get('similarity_threshold', 0.8)
        self.max_results = config.get('max_results', 5)

    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化CLIP模型"""
        try:
            import torch
            import clip
            from PIL import Image

            # 检查模型路径
            if not os.path.exists(self.model_path):
                os.makedirs(self.model_path, exist_ok=True)

            # 加载CLIP模型
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.device = device
            self.model, self.preprocess = clip.load("ViT-B/32", device=device)
            self.model.eval()

            self.initialized = True
            logger.info(f"CLIP模型初始化完成，设备: {device}")

        except ImportError as e:
            raise AIError(f"CLIP依赖未安装: {str(e)}。请安装: pip install torch torchvision clip", "vision_ai")
        except Exception as e:
            raise AIError(f"CLIP模型初始化失败: {str(e)}", "vision_ai")

    def extract_features(self, image_path: str) -> List[float]:
        """使用CLIP提取特征"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            from PIL import Image
            import torch
            import clip

            # 加载和预处理图片
            image = Image.open(image_path).convert("RGB")
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)

            # 提取特征
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)

            # 转换为列表并返回
            return image_features.cpu().numpy().flatten().tolist()

        except Exception as e:
            logger.error(f"CLIP特征提取失败: {e}")
            raise AIError(f"特征提取失败: {str(e)}", "vision_ai")

    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        """从字节流使用CLIP提取特征"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            from PIL import Image
            import torch
            import io

            # 从字节流加载图片
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)

            # 提取特征
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)

            # 转换为列表并返回
            return image_features.cpu().numpy().flatten().tolist()

        except Exception as e:
            logger.error(f"CLIP特征提取失败: {e}")
            raise AIError(f"特征提取失败: {str(e)}", "vision_ai")

    def compare_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算相似度"""
        return self.cosine_similarity(vec1, vec2)

    def recognize_cat(self,
                     image_path: str,
                     cat_vectors: Dict[str, List[float]],
                     threshold: float = 0.8) -> Dict[str, Any]:
        """使用CLIP识别猫咪"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            # 提取查询图片特征
            query_vector = self.extract_features(image_path)

            # 与数据库中的猫咪进行比对
            similarities = []
            for cat_id, cat_vector in cat_vectors.items():
                similarity = self.compare_similarity(query_vector, cat_vector)
                similarities.append((cat_id, similarity))

            # 按相似度排序
            similarities.sort(key=lambda x: x[1], reverse=True)

            # 获取最佳匹配
            if similarities and similarities[0][1] >= threshold:
                best_cat_id, best_similarity = similarities[0]
                return {
                    "success": True,
                    "cat_id": best_cat_id,
                    "similarity": best_similarity,
                    "all_matches": similarities[:self.max_results],
                    "message": f"识别成功，相似度: {best_similarity:.3f}"
                }
            else:
                return {
                    "success": False,
                    "cat_id": None,
                    "similarity": similarities[0][1] if similarities else 0.0,
                    "all_matches": similarities[:self.max_results],
                    "message": "未找到匹配的猫咪"
                }

        except Exception as e:
            logger.error(f"CLIP猫咪识别失败: {e}")
            raise AIError(f"猫咪识别失败: {str(e)}", "vision_ai")

    def recognize_cat_from_bytes(self,
                                image_bytes: bytes,
                                cat_vectors: Dict[str, List[float]],
                                threshold: float = 0.8) -> Dict[str, Any]:
        """从字节流使用CLIP识别猫咪"""
        if not self.initialized:
            raise AIError("模型未初始化", "vision_ai")

        try:
            # 提取查询图片特征
            query_vector = self.extract_features_from_bytes(image_bytes)

            # 与数据库中的猫咪进行比对
            similarities = []
            for cat_id, cat_vector in cat_vectors.items():
                similarity = self.compare_similarity(query_vector, cat_vector)
                similarities.append((cat_id, similarity))

            # 按相似度排序
            similarities.sort(key=lambda x: x[1], reverse=True)

            # 获取最佳匹配
            if similarities and similarities[0][1] >= threshold:
                best_cat_id, best_similarity = similarities[0]
                return {
                    "success": True,
                    "cat_id": best_cat_id,
                    "similarity": best_similarity,
                    "all_matches": similarities[:self.max_results],
                    "message": f"识别成功，相似度: {best_similarity:.3f}"
                }
            else:
                return {
                    "success": False,
                    "cat_id": None,
                    "similarity": similarities[0][1] if similarities else 0.0,
                    "all_matches": similarities[:self.max_results],
                    "message": "未找到匹配的猫咪"
                }

        except Exception as e:
            logger.error(f"CLIP猫咪识别失败: {e}")
            raise AIError(f"猫咪识别失败: {str(e)}", "vision_ai")

    def health_check(self) -> bool:
        """健康检查"""
        if not self.initialized:
            return False

        try:
            # 简单的健康检查 - 测试模型是否能正常工作
            import torch
            dummy_input = torch.randn(1, 3, 224, 224).to(self.device)
            with torch.no_grad():
                self.model.encode_image(dummy_input)
            return True
        except Exception as e:
            logger.warning(f"CLIP健康检查失败: {e}")
            return False
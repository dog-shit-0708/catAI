from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import numpy as np

class BaseTextAI(ABC):
    """文本AI模型基类"""

    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化模型"""
        pass

    @abstractmethod
    def chat(self, message: str, context: Optional[Dict] = None) -> str:
        """对话接口"""
        pass

    @abstractmethod
    def generate_embedding(self, text: str) -> List[float]:
        """文本向量化"""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """健康检查"""
        pass

class BaseVisionAI(ABC):
    """视觉AI模型基类"""

    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化模型"""
        pass

    @abstractmethod
    def extract_features(self, image_path: str) -> List[float]:
        """提取图像特征向量"""
        pass

    @abstractmethod
    def extract_features_from_bytes(self, image_bytes: bytes) -> List[float]:
        """从字节流提取特征向量"""
        pass

    @abstractmethod
    def compare_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算向量相似度"""
        pass

    @abstractmethod
    def recognize_cat(self,
                     image_path: str,
                     cat_vectors: Dict[str, List[float]],
                     threshold: float = 0.8) -> Dict[str, Any]:
        """识别猫咪"""
        pass

    @abstractmethod
    def recognize_cat_from_bytes(self,
                                image_bytes: bytes,
                                cat_vectors: Dict[str, List[float]],
                                threshold: float = 0.8) -> Dict[str, Any]:
        """从字节流识别猫咪"""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """健康检查"""
        pass

class BaseAIModel(ABC):
    """AI模型基础类"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.initialized = False

    @abstractmethod
    def initialize(self) -> None:
        """初始化模型"""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """健康检查"""
        pass

    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """计算余弦相似度"""
        if not vec1 or not vec2:
            return 0.0

        # 转换为numpy数组进行计算
        a = np.array(vec1)
        b = np.array(vec2)

        # 计算余弦相似度
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        return float(dot_product / (norm_a * norm_b))
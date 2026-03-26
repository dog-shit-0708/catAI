import os
import yaml
from typing import Any, Dict
from dataclasses import dataclass

@dataclass
class AppConfig:
    name: str
    version: str
    debug: bool
    host: str
    port: int

@dataclass
class DatabaseConfig:
    host: str
    port: int
    database: str
    username: str
    password: str
    pool_size: int
    max_overflow: int

@dataclass
class RedisConfig:
    host: str
    port: int
    db: int
    password: str
    decode_responses: bool

@dataclass
class TextAIConfig:
    type: str
    api_key: str
    model: str
    temperature: float

@dataclass
class VisionAIConfig:
    type: str
    model_path: str
    similarity_threshold: float
    max_results: int

@dataclass
class AIConfig:
    text_model: TextAIConfig
    vision_model: VisionAIConfig

@dataclass
class CacheConfig:
    default_ttl: int
    ai_response_ttl: int
    cat_stats_ttl: int

@dataclass
class RateLimitConfig:
    chat: str
    recognition: str
    default: str

class Config:
    """配置管理类"""

    def __init__(self, config_path: str = "config.yaml"):
        self.config_path = config_path
        self._config = self._load_config()

    def _load_config(self) -> Dict[str, Any]:
        """加载配置文件"""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)

        # 环境变量替换
        return self._replace_env_vars(config)

    def _replace_env_vars(self, obj: Any) -> Any:
        """递归替换环境变量"""
        if isinstance(obj, dict):
            return {k: self._replace_env_vars(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._replace_env_vars(item) for item in obj]
        elif isinstance(obj, str) and obj.startswith("${") and obj.endswith("}"):
            env_var = obj[2:-1]
            return os.getenv(env_var, "")
        return obj

    @property
    def app(self) -> AppConfig:
        app_config = self._config['app']
        return AppConfig(**app_config)

    @property
    def database(self) -> DatabaseConfig:
        db_config = self._config['database']['mysql']
        return DatabaseConfig(**db_config)

    @property
    def redis(self) -> RedisConfig:
        redis_config = self._config['database']['redis']
        return RedisConfig(**redis_config)

    @property
    def ai(self) -> AIConfig:
        ai_config = self._config['ai']
        text_config = TextAIConfig(**ai_config['text_model'])
        vision_config = VisionAIConfig(**ai_config['vision_model'])
        return AIConfig(text_model=text_config, vision_model=vision_config)

    @property
    def cache(self) -> CacheConfig:
        cache_config = self._config['cache']
        return CacheConfig(**cache_config)

    @property
    def rate_limit(self) -> RateLimitConfig:
        rate_config = self._config['rate_limit']
        return RateLimitConfig(**rate_config)

# 全局配置实例
settings = Config()
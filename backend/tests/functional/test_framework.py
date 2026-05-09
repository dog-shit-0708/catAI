#!/usr/bin/env python3
"""
框架功能测试脚本
用于验证核心组件是否正常工作
"""

import sys
import os

# 添加项目根目录到Python路径
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from src.core.config import settings
from src.core.logger import logger
from src.ai.factory import AIFactory
from src.services.ai_service import AIService

def test_config_loading():
    """测试配置加载"""
    print("\n=== 测试配置加载 ===")
    try:
        print(f"应用名称: {settings.app.name}")
        print(f"应用版本: {settings.app.version}")
        print(f"调试模式: {settings.app.debug}")
        print(f"文本AI类型: {settings.ai.text_model.type}")
        print(f"视觉AI类型: {settings.ai.vision_model.type}")
        print("✅ 配置加载测试通过")
        return True
    except Exception as e:
        print(f"❌ 配置加载测试失败: {e}")
        return False

def test_ai_factory():
    """测试AI工厂"""
    print("\n=== 测试AI工厂 ===")
    try:
        # 测试文本AI创建
        text_config = settings.ai.text_model.__dict__
        text_ai = AIFactory.create_text_ai(text_config)
        print(f"✅ 文本AI创建成功: {type(text_ai).__name__}")

        # 测试视觉AI创建
        vision_config = settings.ai.vision_model.__dict__
        vision_ai = AIFactory.create_vision_ai(vision_config)
        print(f"✅ 视觉AI创建成功: {type(vision_ai).__name__}")

        return True
    except Exception as e:
        print(f"❌ AI工厂测试失败: {e}")
        return False

def test_ai_service():
    """测试AI服务"""
    print("\n=== 测试AI服务 ===")
    try:
        ai_service = AIService()

        # 测试健康检查
        import asyncio
        health_result = asyncio.run(ai_service.health_check())
        print(f"健康检查: {health_result}")

        # 测试文本对话
        chat_result = asyncio.run(ai_service.chat_with_ai(
            "你好，我想了解如何科学投喂流浪猫",
            "test_user_001"
        ))
        print(f"对话测试: {chat_result['success']}")
        if chat_result['success']:
            print(f"回复: {chat_result['response'][:50]}...")

        # 测试向量生成
        embedding_result = asyncio.run(ai_service.generate_embedding(
            "这是一只可爱的橘猫"
        ))
        print(f"向量生成: {embedding_result['success']}")
        if embedding_result['success']:
            print(f"向量维度: {embedding_result['dimensions']}")

        print("✅ AI服务测试通过")
        return True
    except Exception as e:
        print(f"❌ AI服务测试失败: {e}")
        return False

def test_available_models():
    """测试可用模型列表"""
    print("\n=== 测试可用模型列表 ===")
    try:
        text_models = AIFactory.get_available_text_models()
        vision_models = AIFactory.get_available_vision_models()

        print(f"可用文本模型: {text_models}")
        print(f"可用视觉模型: {vision_models}")
        print("✅ 可用模型列表测试通过")
        return True
    except Exception as e:
        print(f"❌ 可用模型列表测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("开始测试校园流浪猫管理系统后端框架")
    print("=" * 50)

    # 运行所有测试
    tests = [
        test_config_loading,
        test_ai_factory,
        test_ai_service,
        test_available_models
    ]

    passed = 0
    total = len(tests)

    for test_func in tests:
        if test_func():
            passed += 1

    print("\n" + "=" * 50)
    print(f"测试结果: {passed}/{total} 通过")

    if passed == total:
        print("🎉 所有测试通过！框架运行正常。")
        return 0
    else:
        print("⚠️  部分测试失败，请检查错误信息。")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
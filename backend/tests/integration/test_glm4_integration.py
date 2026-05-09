#!/usr/bin/env python3
"""
GLM-4集成测试脚本
"""

import os
import sys
import json
import requests
from datetime import datetime

# 添加项目路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.ai.glm4_ai import GLM4TextAI
from src.core.logger import logger

def test_glm4_direct():
    """直接测试GLM-4 API"""
    print("=== 直接测试GLM-4 API ===")

    api_key = os.getenv('ARK_API_KEY')
    if not api_key:
        print("❌ 错误: 需要设置 ARK_API_KEY 环境变量")
        return False

    # 测试数据
    payload = {
        "model": "glm-4-7-251222",
        "stream": False,
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "你好，请介绍一下自己"
                    }
                ]
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        print("发送请求到GLM-4 API...")
        response = requests.post(
            "https://ark.cn-beijing.volces.com/api/v3/responses",
            headers=headers,
            json=payload,
            timeout=30
        )

        print(f"状态码: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("API调用成功!")
            print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"API调用失败: {response.text}")
            return False

    except Exception as e:
        print(f"请求异常: {e}")
        return False

def test_glm4_class():
    """测试GLM-4类"""
    print("\n=== 测试GLM-4类 ===")

    api_key = os.getenv('ARK_API_KEY')
    if not api_key:
        print("❌ 错误: 需要设置 ARK_API_KEY 环境变量")
        return False

    try:
        # 配置
        config = {
            "api_key": api_key,
            "model": "glm-4-7-251222",
            "temperature": 0.7
        }

        # 创建实例
        glm4 = GLM4TextAI(config)
        glm4.initialize(config)

        print("GLM-4类初始化成功!")

        # 测试健康检查
        health = glm4.health_check()
        print(f"健康检查: {'通过' if health else '失败'}")

        # 测试对话
        print("\n测试对话功能...")
        response = glm4.chat("你好，请简单介绍一下GLM-4模型")
        print(f"对话响应: {response}")

        # 测试向量生成
        print("\n测试向量生成...")
        vector = glm4.generate_embedding("这是一个测试文本")
        print(f"向量维度: {len(vector)}")
        print(f"向量样例: {vector[:5]}...")  # 只显示前5个元素

        return True

    except Exception as e:
        print(f"GLM-4类测试失败: {e}")
        return False

def test_web_search():
    """测试网络搜索功能"""
    print("\n=== 测试网络搜索功能 ===")

    api_key = os.getenv('ARK_API_KEY')
    if not api_key:
        print("❌ 错误: 需要设置 ARK_API_KEY 环境变量")
        return False

    payload = {
        "model": "glm-4-7-251222",
        "stream": False,
        "tools": [
            {
                "type": "web_search",
                "max_keyword": 3
            }
        ],
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "今天有什么热点新闻"
                    }
                ]
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        print("发送带网络搜索的请求...")
        response = requests.post(
            "https://ark.cn-beijing.volces.com/api/v3/responses",
            headers=headers,
            json=payload,
            timeout=60
        )

        print(f"状态码: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("网络搜索API调用成功!")
            print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"网络搜索API调用失败: {response.text}")
            return False

    except Exception as e:
        print(f"网络搜索请求异常: {e}")
        return False

def main():
    """主测试函数"""
    print("GLM-4集成测试")
    print("=" * 50)
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"ARK_API_KEY: {'已设置' if os.getenv('ARK_API_KEY') else '未设置'}")
    print("=" * 50)

    results = []

    # 运行测试
    results.append(("直接API测试", test_glm4_direct()))
    results.append(("GLM-4类测试", test_glm4_class()))
    results.append(("网络搜索测试", test_web_search()))

    # 总结结果
    print("\n" + "=" * 50)
    print("测试总结:")
    print("=" * 50)

    passed = 0
    for test_name, result in results:
        status = "通过" if result else "失败"
        print(f"{test_name}: {status}")
        if result:
            passed += 1

    print(f"\n总计: {passed}/{len(results)} 测试通过")

    if passed == len(results):
        print("所有测试通过! GLM-4集成成功!")
        return 0
    else:
        print("部分测试失败，请检查配置和日志。")
        return 1

if __name__ == "__main__":
    exit(main())
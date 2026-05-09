#!/usr/bin/env python3
"""
GLM-4 API 客户端示例
展示如何与后端GLM-4服务进行交互
"""

import requests
import json
import asyncio
import aiohttp
from typing import Dict, Any

class GLM4Client:
    """GLM-4 API 客户端"""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()

    def chat(self, message: str, user_id: str) -> Dict[str, Any]:
        """普通对话"""
        url = f"{self.base_url}/api/v1/ai/chat"

        data = {
            "message": message,
            "user_id": user_id
        }

        try:
            response = self.session.post(url, data=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"请求失败: {str(e)}"}

    def stream_chat(self, message: str, user_id: str, enable_web_search: bool = False):
        """流式对话"""
        url = f"{self.base_url}/api/v1/ai/stream-chat"

        data = {
            "message": message,
            "user_id": user_id,
            "enable_web_search": str(enable_web_search).lower()
        }

        try:
            response = self.session.post(url, data=data, stream=True)
            response.raise_for_status()

            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]  # 去掉 'data: ' 前缀
                        try:
                            event_data = json.loads(data_str)
                            yield event_data
                        except json.JSONDecodeError:
                            print(f"解析失败: {data_str}")

        except requests.exceptions.RequestException as e:
            yield {"type": "error", "error": f"请求失败: {str(e)}"}

    def switch_model(self, service_type: str, model_type: str) -> Dict[str, Any]:
        """切换模型"""
        url = f"{self.base_url}/api/v1/ai/switch-model/{service_type}"

        data = {
            "model_type": model_type
        }

        try:
            response = self.session.post(url, data=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"请求失败: {str(e)}"}

    def health_check(self) -> Dict[str, Any]:
        """健康检查"""
        url = f"{self.base_url}/api/v1/ai/health"

        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"请求失败: {str(e)}"}

    def get_available_models(self) -> Dict[str, Any]:
        """获取可用模型列表"""
        url = f"{self.base_url}/api/v1/ai/available-models"

        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"请求失败: {str(e)}"}

async def async_stream_chat(base_url: str, message: str, user_id: str, enable_web_search: bool = False):
    """异步流式对话"""
    url = f"{base_url.rstrip('/')}/api/v1/ai/stream-chat"

    data = {
        "message": message,
        "user_id": user_id,
        "enable_web_search": str(enable_web_search).lower()
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as response:
                response.raise_for_status()

                async for line in response.content:
                    if line:
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data: '):
                            data_str = line_str[6:]
                            try:
                                event_data = json.loads(data_str)
                                yield event_data
                            except json.JSONDecodeError:
                                print(f"解析失败: {data_str}")

    except Exception as e:
        yield {"type": "error", "error": f"请求失败: {str(e)}"}

def demo_normal_chat():
    """演示普通对话"""
    print("=== 普通对话演示 ===")

    client = GLM4Client()

    # 测试对话
    messages = [
        "你好，请介绍一下自己",
        "GLM-4模型有什么特点？",
        "请用中文回答"
    ]

    for i, message in enumerate(messages, 1):
        print(f"\n对话 {i}:")
        print(f"用户: {message}")

        result = client.chat(message, f"demo_user_{i}")

        if "error" in result:
            print(f"❌ 错误: {result['error']}")
        else:
            print(f"AI: {result.get('response', '无响应')}")

def demo_stream_chat():
    """演示流式对话"""
    print("\n=== 流式对话演示 ===")

    client = GLM4Client()

    message = "请详细介绍一下人工智能的发展历程"
    print(f"用户: {message}")
    print("AI: ", end="", flush=True)

    full_response = ""
    for event in client.stream_chat(message, "demo_user_stream"):
        if event.get("type") == "chunk":
            content = event.get("content", "")
            print(content, end="", flush=True)
            full_response += content
        elif event.get("type") == "end":
            print("\n✅ 流式响应结束")
        elif event.get("type") == "error":
            print(f"\n❌ 错误: {event.get('error')}")
            break

def demo_web_search():
    """演示网络搜索"""
    print("\n=== 网络搜索演示 ===")

    client = GLM4Client()

    message = "今天有什么热点新闻"
    print(f"用户: {message}")
    print("AI (启用网络搜索): ", end="", flush=True)

    full_response = ""
    for event in client.stream_chat(message, "demo_user_search", enable_web_search=True):
        if event.get("type") == "chunk":
            content = event.get("content", "")
            print(content, end="", flush=True)
            full_response += content
        elif event.get("type") == "end":
            print("\n✅ 网络搜索响应结束")
        elif event.get("type") == "error":
            print(f"\n❌ 错误: {event.get('error')}")
            break

def demo_model_management():
    """演示模型管理"""
    print("\n=== 模型管理演示 ===")

    client = GLM4Client()

    # 获取可用模型
    print("获取可用模型列表...")
    models = client.get_available_models()
    if "error" not in models:
        print(f"文本模型: {models.get('text_models', [])}")
        print(f"视觉模型: {models.get('vision_models', [])}")
    else:
        print(f"❌ 获取模型列表失败: {models['error']}")

    # 健康检查
    print("\n执行健康检查...")
    health = client.health_check()
    if "error" not in health:
        services = health.get('services', {})
        print(f"文本AI状态: {services.get('text_ai', {}).get('status', 'unknown')}")
        print(f"视觉AI状态: {services.get('vision_ai', {}).get('status', 'unknown')}")
    else:
        print(f"❌ 健康检查失败: {health['error']}")

def demo_model_switching():
    """演示模型切换"""
    print("\n=== 模型切换演示 ===")

    client = GLM4Client()

    # 切换到GLM-4
    print("切换到GLM-4模型...")
    result = client.switch_model("text", "glm4")
    if "error" not in result:
        print(f"✅ {result.get('message', '切换成功')}")
    else:
        print(f"❌ 切换失败: {result['error']}")

    # 测试切换后的对话
    print("\n测试GLM-4模型...")
    result = client.chat("你好", "demo_user_switch")
    if "error" not in result:
        print(f"AI: {result.get('response', '无响应')}")
    else:
        print(f"❌ 对话失败: {result['error']}")

async def demo_async_stream():
    """演示异步流式对话"""
    print("\n=== 异步流式对话演示 ===")

    base_url = "http://localhost:8000"
    message = "请用诗歌的形式介绍一下春天"

    print(f"用户: {message}")
    print("AI: ", end="", flush=True)

    async for event in async_stream_chat(base_url, message, "demo_user_async"):
        if event.get("type") == "chunk":
            content = event.get("content", "")
            print(content, end="", flush=True)
        elif event.get("type") == "end":
            print("\n✅ 异步流式响应结束")
        elif event.get("type") == "error":
            print(f"\n❌ 错误: {event.get('error')}")
            break

def main():
    """主演示函数"""
    print("GLM-4 API 客户端演示")
    print("=" * 50)

    # 检查服务是否可用
    client = GLM4Client()
    health = client.health_check()

    if "error" in health:
        print(f"❌ 服务不可用: {health['error']}")
        print("请确保后端服务已启动")
        return

    print("✅ 服务连接正常")

    # 运行演示
    try:
        demo_normal_chat()
        demo_stream_chat()
        demo_web_search()
        demo_model_management()
        demo_model_switching()

        # 异步演示需要在事件循环中运行
        print("\n运行异步演示...")
        asyncio.run(demo_async_stream())

        print("\n" + "=" * 50)
        print("🎉 所有演示完成!")

    except KeyboardInterrupt:
        print("\n⚠️  演示被用户中断")
    except Exception as e:
        print(f"\n❌ 演示过程中出现错误: {e}")

if __name__ == "__main__":
    main()
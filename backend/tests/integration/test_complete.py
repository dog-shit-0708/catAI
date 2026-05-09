#!/usr/bin/env python3
"""
完整集成测试 - 验证GLM-4后端集成的所有功能
"""

import os
import sys
import json
import time
import requests
import subprocess
from datetime import datetime

# 添加项目路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def print_header(title):
    """打印测试标题"""
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")

def print_result(test_name, success, message=""):
    """打印测试结果"""
    status = "✅ 通过" if success else "❌ 失败"
    print(f"{test_name}: {status}")
    if message:
        print(f"  说明: {message}")

def check_environment():
    """检查环境配置"""
    print_header("环境检查")

    results = []

    # 检查ARK_API_KEY
    api_key = os.getenv('ARK_API_KEY')
    if api_key and len(api_key) > 10:
        print_result("ARK_API_KEY", True, "API密钥已设置")
        results.append(True)
    else:
        print_result("ARK_API_KEY", False, "API密钥未设置或格式错误")
        results.append(False)

    # 检查Python版本
    python_version = sys.version_info
    if python_version.major >= 3 and python_version.minor >= 8:
        print_result("Python版本", True, f"Python {python_version.major}.{python_version.minor}.{python_version.micro}")
        results.append(True)
    else:
        print_result("Python版本", False, f"需要Python 3.8+，当前版本: {python_version.major}.{python_version.minor}")
        results.append(False)

    # 检查必要文件
    required_files = [
        "requirements.txt",
        "config.yaml",
        "main.py",
        "src/ai/glm4_ai.py"
    ]

    for file_path in required_files:
        if os.path.exists(file_path):
            print_result(f"文件检查: {file_path}", True)
            results.append(True)
        else:
            print_result(f"文件检查: {file_path}", False, "文件不存在")
            results.append(False)

    return all(results)

def test_glm4_unit():
    """单元测试 - GLM-4类功能"""
    print_header("GLM-4单元测试")

    try:
        from src.ai.glm4_ai import GLM4TextAI
        from src.core.logger import logger

        api_key = os.getenv('ARK_API_KEY')
        config = {
            "api_key": api_key,
            "model": "glm-4-7-251222",
            "temperature": 0.7
        }

        # 测试初始化
        glm4 = GLM4TextAI(config)
        glm4.initialize(config)
        print_result("GLM-4初始化", True)

        # 测试健康检查
        health = glm4.health_check()
        print_result("健康检查", health, "服务状态正常" if health else "服务状态异常")

        # 测试向量生成
        vector = glm4.generate_embedding("测试文本")
        if isinstance(vector, list) and len(vector) > 0:
            print_result("向量生成", True, f"生成{len(vector)}维向量")
        else:
            print_result("向量生成", False, "向量生成失败")

        return True

    except Exception as e:
        print_result("GLM-4单元测试", False, str(e))
        return False

def test_direct_api():
    """直接API测试"""
    print_header("直接API测试")

    api_key = os.getenv('ARK_API_KEY')
    if not api_key:
        print_result("API测试", False, "缺少API密钥")
        return False

    try:
        # 测试普通对话
        payload = {
            "model": "glm-4-7-251222",
            "stream": False,
            "input": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": "你好，请简单介绍一下自己"
                        }
                    ]
                }
            ]
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            "https://ark.cn-beijing.volces.com/api/v3/responses",
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print_result("普通对话API", True, "API调用成功")

            # 测试网络搜索
            payload_search = {
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

            response_search = requests.post(
                "https://ark.cn-beijing.volces.com/api/v3/responses",
                headers=headers,
                json=payload_search,
                timeout=60
            )

            if response_search.status_code == 200:
                print_result("网络搜索API", True, "网络搜索功能正常")
                return True
            else:
                print_result("网络搜索API", False, f"状态码: {response_search.status_code}")
                return False
        else:
            print_result("普通对话API", False, f"状态码: {response.status_code}")
            return False

    except Exception as e:
        print_result("直接API测试", False, str(e))
        return False

def test_backend_service():
    """后端服务测试"""
    print_header("后端服务测试")

    base_url = "http://localhost:8000"

    try:
        # 检查服务是否已运行
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            if response.status_code == 200:
                print_result("服务状态", True, "服务已在运行")
                return True
        except:
            pass

        # 启动服务
        print("启动后端服务...")
        process = subprocess.Popen(
            [sys.executable, "main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )

        # 等待服务启动
        max_wait = 30
        start_time = time.time()

        while time.time() - start_time < max_wait:
            try:
                response = requests.get(f"{base_url}/health", timeout=2)
                if response.status_code == 200:
                    print_result("服务启动", True, f"服务启动成功 (等待{time.time() - start_time:.1f}秒)")
                    return True
            except:
                time.sleep(1)

        print_result("服务启动", False, "服务启动超时")
        process.terminate()
        return False

    except Exception as e:
        print_result("后端服务测试", False, str(e))
        return False

def test_api_endpoints():
    """API端点测试"""
    print_header("API端点测试")

    base_url = "http://localhost:8000"
    results = []

    try:
        # 测试根路径
        response = requests.get(f"{base_url}/")
        success = response.status_code == 200
        print_result("根路径 (/)", success)
        results.append(success)

        # 测试健康检查
        response = requests.get(f"{base_url}/health")
        success = response.status_code == 200
        print_result("健康检查 (/health)", success)
        results.append(success)

        # 测试AI健康检查
        response = requests.get(f"{base_url}/api/v1/ai/health")
        success = response.status_code == 200
        print_result("AI健康检查 (/api/v1/ai/health)", success)
        results.append(success)

        # 测试可用模型
        response = requests.get(f"{base_url}/api/v1/ai/available-models")
        if response.status_code == 200:
            data = response.json()
            has_glm4 = 'glm4' in data.get('text_models', [])
            print_result("可用模型 (/api/v1/ai/available-models)", has_glm4, "包含GLM-4模型" if has_glm4 else "不包含GLM-4模型")
            results.append(has_glm4)
        else:
            print_result("可用模型 (/api/v1/ai/available-models)", False, f"状态码: {response.status_code}")
            results.append(False)

        # 测试普通对话
        response = requests.post(
            f"{base_url}/api/v1/ai/chat",
            data={
                "message": "你好，请简单介绍一下自己",
                "user_id": "test_user"
            }
        )
        success = response.status_code == 200
        if success:
            data = response.json()
            has_response = 'response' in data
            print_result("普通对话 (/api/v1/ai/chat)", has_response, "获得AI响应" if has_response else "无响应内容")
            results.append(has_response)
        else:
            print_result("普通对话 (/api/v1/ai/chat)", False, f"状态码: {response.status_code}")
            results.append(False)

        # 测试流式对话
        response = requests.post(
            f"{base_url}/api/v1/ai/stream-chat",
            data={
                "message": "你好",
                "user_id": "test_user"
            },
            stream=True
        )
        success = response.status_code == 200
        print_result("流式对话 (/api/v1/ai/stream-chat)", success)
        results.append(success)

        return all(results)

    except Exception as e:
        print_result("API端点测试", False, str(e))
        return False

def test_integration_scenarios():
    """集成场景测试"""
    print_header("集成场景测试")

    base_url = "http://localhost:8000"
    results = []

    try:
        # 场景1: 普通对话流程
        print("测试场景1: 普通对话流程")
        response = requests.post(
            f"{base_url}/api/v1/ai/chat",
            data={
                "message": "你好，GLM-4！请介绍一下你的特点",
                "user_id": "integration_test_user"
            }
        )

        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'response' in data:
                print_result("普通对话场景", True, "对话流程正常")
                results.append(True)
            else:
                print_result("普通对话场景", False, "对话响应异常")
                results.append(False)
        else:
            print_result("普通对话场景", False, f"状态码: {response.status_code}")
            results.append(False)

        # 场景2: 流式对话流程
        print("测试场景2: 流式对话流程")
        full_response = ""
        response = requests.post(
            f"{base_url}/api/v1/ai/stream-chat",
            data={
                "message": "请用简短的话介绍一下人工智能",
                "user_id": "integration_test_user"
            },
            stream=True
        )

        if response.status_code == 200:
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]
                        try:
                            event = json.loads(data_str)
                            if event.get('type') == 'chunk':
                                full_response += event.get('content', '')
                        except:
                            continue

            if full_response:
                print_result("流式对话场景", True, f"收到{len(full_response)}字符响应")
                results.append(True)
            else:
                print_result("流式对话场景", False, "未收到响应内容")
                results.append(False)
        else:
            print_result("流式对话场景", False, f"状态码: {response.status_code}")
            results.append(False)

        # 场景3: 网络搜索流程
        print("测试场景3: 网络搜索流程")
        response = requests.post(
            f"{base_url}/api/v1/ai/stream-chat",
            data={
                "message": "今天有什么重要新闻",
                "user_id": "integration_test_user",
                "enable_web_search": "true"
            },
            stream=True
        )

        if response.status_code == 200:
            print_result("网络搜索场景", True, "网络搜索接口正常")
            results.append(True)
        else:
            print_result("网络搜索场景", False, f"状态码: {response.status_code}")
            results.append(False)

        return all(results)

    except Exception as e:
        print_result("集成场景测试", False, str(e))
        return False

def main():
    """主测试函数"""
    print("GLM-4 完整集成测试")
    print("=" * 60)
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"工作目录: {os.getcwd()}")
    print(f"ARK_API_KEY: {'已设置' if os.getenv('ARK_API_KEY') else '未设置'}")

    test_results = []

    # 运行所有测试
    test_results.append(("环境检查", check_environment()))
    test_results.append(("GLM-4单元测试", test_glm4_unit()))
    test_results.append(("直接API测试", test_direct_api()))
    test_results.append(("后端服务测试", test_backend_service()))
    test_results.append(("API端点测试", test_api_endpoints()))
    test_results.append(("集成场景测试", test_integration_scenarios()))

    # 总结结果
    print_header("测试总结")

    passed = 0
    for test_name, result in test_results:
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{test_name}: {status}")
        if result:
            passed += 1

    total_tests = len(test_results)
    print(f"\n总计: {passed}/{total_tests} 测试通过")

    if passed == total_tests:
        print("🎉 恭喜！所有测试通过，GLM-4集成成功！")
        print("\n下一步:")
        print("1. 查看 QUICK_START.md 了解使用方法")
        print("2. 查看 GLM4_INTEGRATION.md 了解详细文档")
        print("3. 运行 examples/glm4_client_example.py 查看客户端示例")
        return 0
    else:
        print("⚠️  部分测试失败，请检查配置和日志。")
        print("\n建议:")
        print("1. 检查 ARK_API_KEY 环境变量")
        print("2. 查看 logs/app.log 获取详细错误信息")
        print("3. 运行 test_glm4.py 进行基础测试")
        return 1

if __name__ == "__main__":
    exit(main())
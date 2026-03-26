#!/usr/bin/env python3
"""
快速启动脚本 - 用于开发和测试
"""

import os
import sys
import subprocess
import webbrowser
import time

def install_dependencies():
    """安装依赖"""
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to install dependencies: {e}")
        return False

def check_environment():
    """检查环境"""
    print("Checking environment...")

    # 检查Python版本
    if sys.version_info < (3, 8):
        print("Error: Python 3.8+ is required")
        return False

    # 检查配置文件
    if not os.path.exists("config.yaml"):
        print("Warning: config.yaml not found, creating default config...")
        create_default_config()

    print("Environment check passed!")
    return True

def create_default_config():
    """创建默认配置文件"""
    default_config = """app:
  name: cat-ai-backend
  version: 1.0.0
  debug: true
  host: 0.0.0.0
  port: 8000

database:
  mysql:
    host: localhost
    port: 3306
    database: cat_ai
    username: root
    password: password
    pool_size: 20
    max_overflow: 30

  redis:
    host: localhost
    port: 6379
    db: 0
    password: null
    decode_responses: true

ai:
  text_model:
    type: "mock"  # Use mock for development
    api_key: ""
    model: "gpt-3.5-turbo"
    temperature: 0.7

  vision_model:
    type: "mock"  # Use mock for development
    model_path: "./models"
    similarity_threshold: 0.8
    max_results: 5

cache:
  default_ttl: 3600
  ai_response_ttl: 1800
  cat_stats_ttl: 300

rate_limit:
  chat: "100/minute"
  recognition: "20/minute"
  default: "1000/hour"
"""

    with open("config.yaml", "w", encoding="utf-8") as f:
        f.write(default_config)
    print("Default config.yaml created!")

def start_server():
    """启动服务器"""
    print("Starting Cat AI Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")

    try:
        # 启动服务器
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "main:app",
            "--host", "0.0.0.0", "--port", "8000", "--reload"
        ])

        # 等待服务器启动
        time.sleep(3)

        # 自动打开API文档
        print("Opening API documentation in browser...")
        webbrowser.open("http://localhost:8000/docs")

        # 等待服务器进程
        process.wait()

    except KeyboardInterrupt:
        print("\nShutting down server...")
        if process:
            process.terminate()
    except Exception as e:
        print(f"Failed to start server: {e}")

def run_tests():
    """运行测试"""
    print("Running framework tests...")
    try:
        subprocess.check_call([sys.executable, "test_simple.py"])
        print("All tests passed!")
        return True
    except subprocess.CalledProcessError:
        print("Some tests failed!")
        return False

def main():
    """主函数"""
    print("🐱 Cat AI Backend - Quick Start")
    print("=" * 40)

    # 检查命令行参数
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "install":
            install_dependencies()
            return
        elif command == "test":
            run_tests()
            return
        elif command == "config":
            create_default_config()
            return

    # 默认流程
    print("1. Checking environment...")
    if not check_environment():
        sys.exit(1)

    print("\n2. Installing dependencies...")
    if not install_dependencies():
        sys.exit(1)

    print("\n3. Running tests...")
    if not run_tests():
        print("Warning: Some tests failed, but continuing...")

    print("\n4. Starting server...")
    start_server()

if __name__ == "__main__":
    main()
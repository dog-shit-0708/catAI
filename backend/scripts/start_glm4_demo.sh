#!/bin/bash

# GLM-4 集成演示启动脚本

echo "=== GLM-4 集成演示 ==="
echo "时间: $(date)"
echo

# 检查环境变量
if [ -z "$ARK_API_KEY" ]; then
    echo "❌ 错误: 需要设置 ARK_API_KEY 环境变量"
    echo "请运行: export ARK_API_KEY='your_api_key_here'"
    exit 1
fi

echo "✅ ARK_API_KEY 已设置"
echo

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 python3"
    exit 1
fi

echo "✅ Python3 已安装"
echo

# 安装依赖
echo "安装依赖..."
pip install -q -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装完成"
else
    echo "❌ 依赖安装失败"
    exit 1
fi
echo

# 运行GLM-4集成测试
echo "运行GLM-4集成测试..."
python test_glm4.py
if [ $? -eq 0 ]; then
    echo "✅ GLM-4集成测试通过"
else
    echo "❌ GLM-4集成测试失败"
    exit 1
fi
echo

# 启动后端服务
echo "启动后端服务..."
echo "服务将在 http://localhost:8000 上运行"
echo "按 Ctrl+C 停止服务"
echo
echo "访问以下端点进行测试:"
echo "  - http://localhost:8000/docs (Swagger UI)"
echo "  - http://localhost:8000/api/v1/ai/health (健康检查)"
echo

# 在后台启动服务
python main.py &
SERVER_PID=$!

# 等待服务启动
sleep 3

# 测试服务是否启动成功
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ 服务启动成功"
    echo

    # 运行客户端演示
    echo "运行客户端演示..."
    python examples/glm4_client_example.py
else
    echo "❌ 服务启动失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# 清理函数
cleanup() {
    echo
    echo "停止服务..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup SIGINT SIGTERM

# 保持脚本运行，等待用户中断
echo
echo "按 Ctrl+C 停止演示"
echo "=" | tr -d '\n'
while true; do
    sleep 1
done
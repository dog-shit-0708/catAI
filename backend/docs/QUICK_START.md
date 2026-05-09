# GLM-4 快速使用指南

## 🚀 5分钟快速开始

### 步骤1: 设置环境变量

```bash
# Linux/Mac
export ARK_API_KEY="your_ark_api_key_here"

# Windows (CMD)
set ARK_API_KEY=your_ark_api_key_here

# Windows (PowerShell)
$env:ARK_API_KEY="your_ark_api_key_here"
```

### 步骤2: 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 步骤3: 运行测试

```bash
# 测试GLM-4集成
python test_glm4.py
```

### 步骤4: 启动服务

```bash
# 启动后端服务
python main.py
```

### 步骤5: 测试API

```bash
# 测试普通对话
curl -X POST "http://localhost:8000/api/v1/ai/chat" \
  -F "message=你好" \
  -F "user_id=test_user"

# 测试流式对话
curl -X POST "http://localhost:8000/api/v1/ai/stream-chat" \
  -F "message=介绍一下北京" \
  -F "user_id=test_user"

# 测试网络搜索
curl -X POST "http://localhost:8000/api/v1/ai/stream-chat" \
  -F "message=今天有什么热点新闻" \
  -F "user_id=test_user" \
  -F "enable_web_search=true"
```

## 🎯 核心功能

### 1. 普通对话

**用途**: 标准的AI对话功能

```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/ai/chat",
    data={
        "message": "你好，请介绍一下自己",
        "user_id": "user123"
    }
)

result = response.json()
print(result['response'])
```

### 2. 流式对话

**用途**: 实时流式响应，适合聊天应用

```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/ai/stream-chat",
    data={
        "message": "请详细介绍一下人工智能",
        "user_id": "user123"
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        data = line.decode('utf-8')[6:]  # 去掉 'data: ' 前缀
        event = json.loads(data)
        if event['type'] == 'chunk':
            print(event['content'], end='', flush=True)
```

### 3. 网络搜索

**用途**: 获取实时信息和新闻

```python
response = requests.post(
    "http://localhost:8000/api/v1/ai/stream-chat",
    data={
        "message": "今天有什么热点新闻",
        "user_id": "user123",
        "enable_web_search": "true"
    },
    stream=True
)
```

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `ARK_API_KEY` | GLM-4 API密钥 | ✅ |

### 配置文件 (config.yaml)

```yaml
ai:
  text_model:
    type: "glm4"              # 模型类型
    api_key: "${ARK_API_KEY}" # API密钥
    model: "glm-4-7-251222"   # 模型版本
    temperature: 0.7          # 温度参数 (0.0-1.0)
```

## 📊 API 参考

### 基础端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 根路径，服务状态 |
| GET | `/health` | 健康检查 |
| GET | `/docs` | Swagger UI文档 |
| GET | `/redoc` | ReDoc文档 |

### AI 功能端点

| 方法 | 路径 | 说明 | 流式 |
|------|------|------|------|
| POST | `/api/v1/ai/chat` | 普通对话 | ❌ |
| POST | `/api/v1/ai/stream-chat` | 流式对话 | ✅ |
| POST | `/api/v1/ai/recognize-cat` | 猫咪识别 | ❌ |
| POST | `/api/v1/ai/generate-embedding` | 生成向量 | ❌ |
| POST | `/api/v1/ai/extract-features` | 提取特征 | ❌ |

### 管理端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/health` | AI服务健康检查 |
| GET | `/api/v1/ai/available-models` | 获取可用模型 |
| POST | `/api/v1/ai/switch-model/{type}` | 切换模型 |

## 💡 使用技巧

### 1. 错误处理

```python
try:
    response = requests.post(url, data=data, timeout=30)
    response.raise_for_status()
    result = response.json()

    if result.get('success'):
        print("成功:", result['response'])
    else:
        print("失败:", result.get('error', '未知错误'))

except requests.exceptions.Timeout:
    print("请求超时")
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
```

### 2. 流式响应处理

```python
def handle_stream_response(response):
    """处理流式响应"""
    full_response = ""

    for line in response.iter_lines():
        if line:
            line_str = line.decode('utf-8')
            if line_str.startswith('data: '):
                data_str = line_str[6:]

                if data_str == '[DONE]':
                    break

                try:
                    event = json.loads(data_str)

                    if event['type'] == 'chunk':
                        content = event['content']
                        full_response += content
                        # 实时处理内容
                        print(content, end='', flush=True)

                    elif event['type'] == 'error':
                        print(f"\n错误: {event['error']}")
                        break

                except json.JSONDecodeError:
                    continue

    return full_response
```

### 3. 网络搜索使用

```python
# 启用网络搜索获取最新信息
messages_with_search = [
    "今天有什么热点新闻",
    "最新的科技动态",
    "当前的股市行情"
]

for message in messages_with_search:
    response = requests.post(
        "http://localhost:8000/api/v1/ai/stream-chat",
        data={
            "message": message,
            "user_id": "user123",
            "enable_web_search": "true"  # 启用网络搜索
        },
        stream=True
    )

    handle_stream_response(response)
    print("\n" + "="*50)
```

## 🐛 故障排除

### 常见错误

#### 1. API密钥错误
```
❌ GLM-4 API密钥不能为空
✅ 解决方案: 检查 ARK_API_KEY 环境变量
```

#### 2. 网络连接问题
```
❌ GLM-4网络请求失败
✅ 解决方案: 检查网络连接和防火墙设置
```

#### 3. 服务启动失败
```
❌ 服务启动失败
✅ 解决方案: 检查端口8000是否被占用
```

### 调试步骤

1. **检查环境变量**
   ```bash
   echo $ARK_API_KEY  # Linux/Mac
   echo %ARK_API_KEY% # Windows
   ```

2. **运行测试**
   ```bash
   python test_glm4.py
   ```

3. **检查服务状态**
   ```bash
   curl http://localhost:8000/health
   ```

4. **查看详细日志**
   ```bash
   tail -f logs/app.log
   ```

## 🚀 进阶使用

### 1. 模型切换

```bash
# 切换到GLM-4
curl -X POST "http://localhost:8000/api/v1/ai/switch-model/text" \
  -F "model_type=glm4"

# 切换到Mock模型（测试用）
curl -X POST "http://localhost:8000/api/v1/ai/switch-model/text" \
  -F "model_type=mock"
```

### 2. 批量处理

```python
import concurrent.futures

def process_message(message):
    response = requests.post(
        "http://localhost:8000/api/v1/ai/chat",
        data={"message": message, "user_id": "batch_user"}
    )
    return response.json()

messages = ["问题1", "问题2", "问题3"]

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(process_message, messages))
```

### 3. 异步处理

```python
import asyncio
import aiohttp

async def async_chat(session, message):
    async with session.post(
        "http://localhost:8000/api/v1/ai/chat",
        data={"message": message, "user_id": "async_user"}
    ) as response:
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [
            async_chat(session, "问题1"),
            async_chat(session, "问题2"),
            async_chat(session, "问题3")
        ]
        results = await asyncio.gather(*tasks)

asyncio.run(main())
```

## 📚 更多资源

- [详细集成文档](GLM4_INTEGRATION.md)
- [API客户端示例](examples/glm4_client_example.py)
- [GLM-4官方文档](https://open.bigmodel.cn/dev/api)
- [FastAPI文档](https://fastapi.tiangolo.com/)
# 🐱 校园流浪猫管理系统 - 后端服务

基于FastAPI的模型无关AI服务框架，支持多种AI模型动态切换。

## 🏗️ 架构设计

### 分层架构
```
┌─────────────────┐
│   微信小程序     │ ← 前端层
└─────────────────┘
        ↓
┌─────────────────┐
│   API Gateway   │ ← 统一入口
└─────────────────┘
        ↓
┌─────────────────┐
│  业务服务层      │ ← 核心业务
└─────────────────┘
        ↓
┌─────────────────┐
│   AI能力层       │ ← 模型无关
└─────────────────┘
        ↓
┌─────────────────┐
│   数据存储层     │ ← 数据持久化
└─────────────────┘
```

### 核心特性
- 🤖 **模型无关**: 支持多种AI模型动态切换
- 🔌 **插件化**: 易于扩展新的AI模型
- 🚀 **高性能**: 异步处理，支持高并发
- 🛡️ **健壮性**: 完善的异常处理和日志系统
- 📊 **可观测**: 健康检查和服务监控

## 🚀 快速开始

### 环境要求
- Python 3.8+
- pip 包管理器

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd cat-ai-backend

# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 配置环境

1. **复制配置文件模板**
```bash
cp config.yaml.example config.yaml
```

2. **编辑配置文件**
```yaml
ai:
  text_model:
    type: "mock"  # mock, openai
    api_key: "your-api-key"

  vision_model:
    type: "mock"  # mock, clip
    model_path: "./models"
```

3. **设置环境变量**
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### 启动服务

```bash
# 开发模式（热重载）
python main.py

# 生产模式
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 运行测试

```bash
# 运行框架测试
python test_framework.py

# 运行单元测试
pytest tests/
```

## 📡 API接口

### 健康检查
```bash
GET /health
GET /api/v1/ai/health
```

### AI对话
```bash
POST /api/v1/ai/chat
Content-Type: multipart/form-data

message=你好，我想了解如何科学投喂流浪猫
user_id=user_001
```

### 猫咪识别
```bash
POST /api/v1/ai/recognize-cat
Content-Type: multipart/form-data

image=@cat_photo.jpg
```

### 生成向量
```bash
POST /api/v1/ai/generate-embedding
Content-Type: multipart/form-data

text=这是一只可爱的橘猫
```

## 🔧 模型配置

### 支持的文本AI模型
- `mock`: 模拟AI（开发测试用）
- `openai`: OpenAI GPT系列
- `claude`: Anthropic Claude（待实现）
- `ernie`: 百度文心一言（待实现）

### 支持的视觉AI模型
- `mock`: 模拟视觉AI（开发测试用）
- `clip`: OpenAI CLIP模型
- `ernie-vil`: 百度ERNIE-ViL（待实现）
- `qwen-v`: 阿里通义千问-V（待实现）

### 动态切换模型

```bash
POST /api/v1/ai/switch-model/text
Content-Type: multipart/form-data

model_type=openai
```

## 📁 项目结构

```
src/
├── core/                    # 核心框架
│   ├── config.py           # 配置管理
│   ├── logger.py           # 日志系统
│   └── exceptions.py       # 异常处理
│
├── ai/                     # AI能力层
│   ├── base.py            # AI模型基类
│   ├── factory.py         # AI模型工厂
│   ├── text_ai.py         # 文本AI实现
│   └── vision_ai.py       # 视觉AI实现
│
├── services/               # 业务服务层
│   └── ai_service.py      # AI服务封装
│
└── api/                    # API接口层
    └── v1/                # API版本
        └── ai.py         # AI相关接口
```

## 🧪 开发指南

### 添加新的AI模型

1. **继承基类**
```python
from src.ai.base import BaseTextAI

class MyTextAI(BaseTextAI):
    def initialize(self, config):
        # 初始化你的模型
        pass

    def chat(self, message, context=None):
        # 实现对话逻辑
        pass
```

2. **注册到工厂**
```python
# 在 factory.py 中添加
if model_type == 'my-model':
    return MyTextAI(config)
```

3. **更新配置文件**
```yaml
text_model:
  type: "my-model"
```

### 添加新的API接口

1. **创建路由文件**
```python
# src/api/v1/my_feature.py
from fastapi import APIRouter

router = APIRouter(prefix="/my-feature", tags=["我的功能"])

@router.get("/hello")
async def hello():
    return {"message": "Hello World"}
```

2. **注册路由**
```python
# main.py
from src.api.v1.my_feature import router as my_feature_router
app.include_router(my_feature_router, prefix="/api/v1")
```

## 📊 监控和日志

### 日志文件
- 位置: `logs/app_YYYYMMDD.log`
- 级别: INFO, ERROR, WARNING, DEBUG
- 格式: `时间 - 模块 - 级别 - 函数:行号 - 消息`

### 健康检查
```bash
# 检查服务状态
curl http://localhost:8000/health

# 检查AI服务状态
curl http://localhost:8000/api/v1/ai/health
```

## 🚀 部署指南

### Docker部署

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 生产环境建议

1. **使用Gunicorn**
```bash
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

2. **配置反向代理**
```nginx
location / {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

3. **启用HTTPS**
```nginx
ssl_certificate /path/to/cert.pem;
ssl_certificate_key /path/to/key.pem;
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

- 📧 邮箱: support@cat-ai.com
- 🐛 Bug报告: [GitHub Issues](https://github.com/your-repo/issues)
- 💡 功能建议: [GitHub Discussions](https://github.com/your-repo/discussions)
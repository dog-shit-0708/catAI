import requests
import json

API_KEY = "a068362a-9b11-42dd-9e56-d075749337df"
URL = "https://ark.cn-beijing.volces.com/api/v3/responses"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "glm-4-7-251222",
    "stream": True,
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
                    "text": "cat + dog = ?" # 你可以随便改问题
                }
            ]
        }
    ]
}

# 发送请求
try:
    print("正在发送请求到GLM-4...")
    response = requests.post(URL, headers=headers, json=data, stream=True, timeout=30)
    print(f"响应状态码: {response.status_code}")

    if response.status_code != 200:
        print(f"请求失败: {response.status_code}")
        print(f"错误信息: {response.text}")
        exit(1)

    print("开始接收流式响应...")
    # 逐字输出（不乱码）
    for line in response.iter_lines():
        if line:
            line = line.decode("utf-8")
            if line.startswith("data:"):
                json_str = line[5:].strip()
                if json_str == "[DONE]":
                    print("\n流式响应结束")
                    break
                try:
                    obj = json.loads(json_str)
                    # 处理GLM-4的SSE响应格式
                    event_type = obj.get("type", "")
                    if event_type == "response.output_text.delta":
                        # 文本增量内容
                        delta_text = obj.get("delta", "")
                        if delta_text:
                            print(delta_text, end="", flush=True)
                    elif event_type == "response.output_text.done":
                        # 文本完成
                        print(f"\n[文本完成]")
                    elif event_type == "response.done":
                        # 整个响应完成
                        print(f"\n[响应完成]")
                except Exception as e:
                    print(f"\nJSON解析错误: {e}")
                    continue

    print("\n响应处理完成")

except requests.exceptions.RequestException as e:
    print(f"网络请求错误: {e}")
except Exception as e:
    print(f"其他错误: {e}")
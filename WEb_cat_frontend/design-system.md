# 极简素描风AI猫咪首页 - 设计系统

## 概述
此设计系统基于"极简素描风AI猫咪首页"设计，强调简约、手绘风格和功能性。

## 颜色
| 名称 | 色值 | 用途 |
|------|------|------|
| 纸张白 | `#FFFCF9` | 背景色 |
| 墨水黑 | `#1A1A1A` | 文字、边框、主要元素 |
| 猫咪粉 | `#FFB7C5` | 强调色、悬停效果 |
| 猫咪橙 | `#FF9E66` | 强调色、按钮、图标背景 |

## 字体
### 主字体
- **Plus Jakarta Sans** (400, 500, 700, 800)
- 用途：正文、标题、导航
- 导入：`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');`

### 手写字体
- **Zeyada**
- 用途：装饰性文本、特殊标题
- 导入：`@import url('https://fonts.googleapis.com/css2?family=Zeyada&display=swap');`

## 文字样式
- **标题追踪**：`letter-spacing: -0.04em`
- **大写字母**：广泛使用 `uppercase`
- **字体粗细**：大量使用 `font-extrabold` (800)

## 边框与阴影
### 素描边框
```css
.sketch-border {
    border: 2px solid #1A1A1A;
    transition: all 0.2s ease;
}
```

### 厚素描边框
```css
.sketch-border-thick {
    border: 4px solid #1A1A1A;
}
```

### 素描盒子
```css
.sketch-box {
    position: relative;
    background: white;
    border: 2px solid #1A1A1A;
}
.sketch-box::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid #1A1A1A;
    z-index: -1;
}
```

## 交互效果
### 按钮悬停
```css
.btn-hover:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #1A1A1A;
}
```

### 图片悬停
```css
.grayscale {
    filter: grayscale(100%);
}
.group-hover:grayscale-0 {
    filter: grayscale(0%);
}
.transition-all {
    transition: all 0.5s ease;
}
```

## 间距与布局
### 容器
- 最大宽度：`max-w-[1440px]`
- 水平居中：`mx-auto`
- 水平内边距：`px-10` (2.5rem)

### 间距系统
基于Tailwind CSS的间距比例：
- `py-6`: 1.5rem (垂直内边距)
- `gap-4`: 1rem (网格/弹性布局间距)
- `mb-6`: 1.5rem (底部外边距)

## 组件
已创建的Petite-Vue组件：

### 1. NavBar (导航栏)
- **组件ID**: `9a8fba28-bcb7-4e45-8a60-0a9b2bc071f2`
- **描述**: 极简素描风导航栏组件
- **预览URL**: https://p.superdesign.dev/draftcomponent/9a8fba28-bcb7-4e45-8a60-0a9b2bc071f2

### 2. CatProfileCard (猫咪名片)
- **组件ID**: `4e021b6c-4342-48a6-989b-9dd4c80ce3d2`
- **描述**: 猫咪素描风格名片组件
- **预览URL**: https://p.superdesign.dev/draftcomponent/4e021b6c-4342-48a6-989b-9dd4c80ce3d2

## 图片处理
- **素描风格**: 使用灰度滤镜 (`grayscale`)
- **悬停效果**: 悬停时移除灰度滤镜
- **对象适应**: `object-cover` 或 `object-contain`
- **边框**: 2px白色边框（深色背景上）

## 响应式设计
- **移动端**: 隐藏导航链接 (`hidden md:flex`)
- **网格布局**: 使用 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **弹性布局**: 使用 `flex-col md:flex-row`

## 实用类
```css
.hand-drawn-font { font-family: 'Zeyada', cursive; }
.title-tracking { letter-spacing: -0.04em; }
.minimal-line { height: 2px; background: #1A1A1A; width: 100%; }
```

## 使用指南
1. **保持简约**: 避免过多装饰，注重留白
2. **强调边框**: 使用素描边框定义元素边界
3. **限制颜色**: 主要使用黑白，辅以猫咪粉/橙作为强调色
4. **交互反馈**: 使用悬停效果提供视觉反馈
5. **保持一致性**: 在整个应用中使用相同的字体、颜色和间距
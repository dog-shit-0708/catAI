# 数据库表结构设计文档

## 基于用户提供的数据库设计

### feeding_records 表结构

根据用户提供的数据库设计，feeding_records 表包含以下字段：

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | bigint | 是 | - | 投喂记录ID |
| user_id | bigint | 否 | - | 用户ID(关联users表) |
| cat_id | bigint | 否 | - | 猫咪ID(关联cats表) |
| food_type | varchar(50) | 否 | - | 食物类型: 鸡肉/鱼肉/猫粮/罐头/冻干/猫条/其他 |
| food_detail | varchar(100) | 否 | 空字符串 | 食物详情描述 |
| amount | varchar(50) | 否 | - | 投喂量: 适量/少量/中等/大量 |
| feeding_location | varchar(200) | 否 | 空字符串 | 投喂地点描述 |
| image_url | varchar(500) | 否 | 空字符串 | 投喂照片URL |
| feeding_time | datetime | 否 | - | 投喂时间 |
| status | tinyint | 否 | 1 | 状态: 0-已取消 1-正常 |
| created_at | datetime | 否 | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | datetime | 否 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 在 Uniapp 项目中的实现

#### 1. Store 数据结构对应

在 `store/store.js` 中，feedingRecords 数组完全对应数据库表结构：

```javascript
feedingRecords: [
  {
    id: 1,
    cat_id: 1,
    cat_name: '大橘',           // 关联显示用
    feeding_time: '2024-10-24 10:30',
    food_type: '猫粮',
    amount: '50g',
    location: '西区草坪',        // 对应 feeding_location
    image_url: 'https://...',
    user_id: 1,
    user_name: '护猫志愿者',     // 关联显示用
    status: 1
  }
]
```

#### 2. 打卡页面表单对应

在 `pages/checkin/checkin.js` 中，表单数据结构与数据库字段完全对应：

```javascript
feedingData: {
  food_type: '',        // 对应 food_type
  food_detail: '',      // 对应 food_detail
  amount: '',          // 对应 amount
  location: '',        // 对应 feeding_location
  feeding_time: '',    // 对应 feeding_time
  images: [],          // 用于上传，第一张对应 image_url
  notes: ''            // 额外字段，用于备注
}
```

#### 3. 提交时的数据映射

在打卡提交时，前端数据正确映射到数据库结构：

```javascript
const record = {
  id: Date.now(),                              // 自动生成
  cat_id: selectedCat.id,                     // 从选择器获取
  cat_name: selectedCat.name,                 // 显示用字段
  food_type: feedingData.food_type,           // 表单输入
  food_detail: feedingData.food_detail,       // 表单输入
  amount: feedingData.amount,                 // 表单输入
  location: feedingData.location || selectedCat.location_area, // 表单输入或默认
  image_url: feedingData.images[0] || '',     // 第一张图片
  feeding_time: feedingData.feeding_time,     // 表单输入
  user_id: this.data.userInfo.id,             // 当前用户
  user_name: this.data.userInfo.nickname,     // 显示用字段
  notes: feedingData.notes,                   // 额外备注
  status: 1                                    // 默认正常状态
};
```

### 数据验证和约束

#### 必填字段验证
- `cat_id`: 在提交前验证是否选择了猫咪
- `food_type`: 在提交前验证是否选择了食物类型
- `amount`: 在提交前验证是否选择了投喂量
- `feeding_time`: 在提交前验证是否选择了时间

#### 字段长度限制
- `food_type`: 限制在50字符内
- `food_detail`: 限制在100字符内
- `amount`: 使用预设选项避免超长
- `location`: 限制在200字符内
- `image_url`: 限制在500字符内

### 状态管理

#### 状态字段说明
- `status: 1`: 正常状态（默认）
- `status: 0`: 已取消状态（暂未实现取消功能）

#### 时间戳管理
- `created_at`: 记录创建时间（前端生成）
- `updated_at`: 记录更新时间（前端生成，后端可覆盖）

### 关联关系

#### 用户关联
- `user_id` 关联到 users 表
- `user_name` 用于显示，避免频繁查询用户表

#### 猫咪关联
- `cat_id` 关联到 cats 表
- `cat_name` 用于显示，避免频繁查询猫咪表

### 扩展字段

除了数据库表结构外，前端还使用了一些扩展字段：

- `cat_name`: 猫咪名称（显示用）
- `user_name`: 用户名称（显示用）
- `notes`: 备注信息（可考虑加入数据库表）

### 数据完整性保障

1. **前端验证**: 表单提交前的完整性检查
2. **默认值处理**: 为空字段提供合理的默认值
3. **数据转换**: 确保数据类型与数据库一致
4. **错误处理**: 提交失败时的用户反馈

### 性能考虑

1. **索引建议**: 数据库层面建议为 `cat_id`, `user_id`, `feeding_time` 建立索引
2. **分页加载**: 大量记录时分页显示
3. **数据缓存**: 使用 MobX 进行前端缓存
4. **图片优化**: 压缩上传图片，使用CDN存储

## 总结

当前的 Uniapp 实现完全兼容用户提供的数据库表结构，所有字段都有对应的处理逻辑，确保了数据的一致性和完整性。前端数据结构与后端数据库设计完美对应，为后续的数据同步和API对接奠定了良好基础。
<template>
  <div class="feeding-add">
    <header class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h1>记录投喂</h1>
      <button @click="saveFeeding" class="save-btn">保存</button>
    </header>

    <div class="content">
      <form class="feeding-form">
        <div class="form-group">
          <label>选择猫咪 *</label>
          <select v-model="selectedCat" class="form-select">
            <option value="">请选择猫咪</option>
            <option value="1">大橘</option>
            <option value="2">小花</option>
            <option value="3">小黑</option>
          </select>
        </div>

        <div class="form-group">
          <label>投喂食物 *</label>
          <div class="food-options">
            <button
              v-for="food in foodTypes"
              :key="food"
              type="button"
              :class="['food-btn', { active: selectedFood === food }]"
              @click="selectedFood = food"
            >
              {{ food }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>投喂量 *</label>
          <input
            v-model="feedingAmount"
            type="text"
            placeholder="例如：100g、1个、适量"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>投喂时间</label>
          <input
            v-model="feedingTime"
            type="datetime-local"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>备注</label>
          <textarea
            v-model="notes"
            placeholder="记录猫咪状态或其他备注..."
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="warning" v-if="showWarning">
          ⚠️ 这只猫咪今天已经被投喂多次，建议适量投喂哦！
        </div>
      </form>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const selectedCat = ref('')
const selectedFood = ref('')
const feedingAmount = ref('')
const feedingTime = ref('')
const notes = ref('')

const foodTypes = ['猫粮', '罐头', '冻干', '其他']

const showWarning = computed(() => {
  // TODO: 根据实际投喂数据判断是否显示警告
  return selectedCat.value && Math.random() > 0.7
})

const goBack = () => {
  router.back()
}

const saveFeeding = () => {
  if (!selectedCat.value || !selectedFood.value || !feedingAmount.value) {
    alert('请填写必填项')
    return
  }

  // TODO: 保存投喂记录到后端
  console.log('保存投喂记录:', {
    cat: selectedCat.value,
    food: selectedFood.value,
    amount: feedingAmount.value,
    time: feedingTime.value,
    notes: notes.value
  })

  alert('投喂记录保存成功！')
  router.back()
}
</script>

<style scoped>
.feeding-add {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.back-btn, .save-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.back-btn {
  color: #666;
}

.save-btn {
  color: #667eea;
  font-weight: bold;
}

.header h1 {
  font-size: 18px;
  color: #333;
}

.content {
  padding: 15px;
}

.feeding-form {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  /* 移动端适配 */
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
}

.form-select, .form-input, .form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  border-color: #667eea;
}

.food-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.food-btn {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.food-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.food-btn:hover {
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  color: #856404;
  font-size: 14px;
  margin-top: 20px;
}
</style>
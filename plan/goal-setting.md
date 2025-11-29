---
layout: false
title: 理財目標設定
---

<script setup>
import { ref, computed } from 'vue'
import { 
  Plus, 
  EditPen, 
  Delete, 
  Money, 
  Calendar, 
  Trophy,
  List,
  ArrowRight
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 1. 定義目標數據結構
// 預設帶入高氏家族的案例數據 (參考 PDF P.6 & P.11)
const goals = ref([
  { id: 1, year: 0, title: '孫女教育基金', amount: 2000000 },
  { id: 2, year: 3, title: '長子購屋頭期', amount: 20000000 },
  { id: 3, year: 6, title: '次子購屋頭期', amount: 20000000 },
  { id: 4, year: 10, title: '退休購車計畫', amount: 2000000 },
  { id: 5, year: 30, title: '資產傳承目標', amount: 300000000 }
])

// 2. 表單控制
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)

// 初始表單狀態
const defaultForm = {
  id: null,
  year: 1,
  title: '',
  amount: 100000
}
const currentForm = ref({ ...defaultForm })

// 3. 動作函數
const formatCurrency = (value) => {
  if (!value) return '$0'
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(value)
}

// 開啟新增
const openAdd = () => {
  isEditMode.value = false
  currentForm.value = { ...defaultForm, id: Date.now() } // 產生暫時 ID
  dialogVisible.value = true
}

// 開啟編輯
const openEdit = (item) => {
  isEditMode.value = true
  currentForm.value = { ...item }
  dialogVisible.value = true
}

// 刪除目標
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '確定要移除這個理財目標嗎？',
    '刪除確認',
    {
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      type: 'warning',
      icon: 'InfoFilled'
    }
  ).then(() => {
    goals.value = goals.value.filter(g => g.id !== id)
    ElMessage.success('目標已移除')
  })
}

// 儲存 (新增或更新)
const handleSave = () => {
  if (!currentForm.value.title || !currentForm.value.amount) {
    ElMessage.warning('請填寫完整資訊')
    return
  }

  if (isEditMode.value) {
    // 更新現有
    const index = goals.value.findIndex(g => g.id === currentForm.value.id)
    if (index !== -1) {
      goals.value[index] = { ...currentForm.value }
    }
  } else {
    // 新增
    goals.value.push({ ...currentForm.value })
  }
  
  dialogVisible.value = false
  ElMessage.success(isEditMode.value ? '更新成功' : '新增成功')
}

// 排序邏輯：按年份自動排序
const sortedGoals = computed(() => {
  return [...goals.value].sort((a, b) => a.year - b.year)
})
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main>
    <el-row justify="center" style="margin-bottom: 30px; margin-top: 20px;">
      <el-col :xs="22" :sm="20" :md="18" :lg="16" style="text-align: center;">
        <el-icon :size="48" color="var(--el-color-primary)" style="margin-bottom: 16px;">
          <List />
        </el-icon>
        <el-text tag="h1" type="primary" style="font-size: 2rem; margin: 0; display: block;">
          理財目標設定
        </el-text>
        <el-text type="info" style="margin-top: 10px; display: block;">
          設定具體的財務目標，是達成財富自由的第一步。
        </el-text>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18">
        <el-row :gutter="20">
          <el-col 
            v-for="item in sortedGoals" 
            :key="item.id" 
            :xs="24" :sm="12" :md="8" :lg="6"
            style="margin-bottom: 20px;"
          >
            <el-card 
              shadow="hover" 
              style="border-radius: 12px; position: relative; height: 100%; display: flex; flex-direction: column;"
              :body-style="{ flex: 1, display: 'flex', flexDirection: 'column' }"
            >
              <div style="position: absolute; top: 12px; right: 12px; z-index: 2;">
                <el-button link type="primary" @click="openEdit(item)">
                  <el-icon :size="16"><EditPen /></el-icon>
                </el-button>
                <el-button link type="primary" @click="handleDelete(item.id)" style="margin-left: 4px;">
                  <el-icon :size="16"><Delete /></el-icon>
                </el-button>
              </div>
              <div style="text-align: center; margin-top: 10px; flex-grow: 1;">                
                <el-tag effect="plain" round type="primary" style="margin-bottom: 16px;">
                  <el-icon style="margin-right: 4px"><Calendar /></el-icon>
                  {{ item.year === 0 ? '現在 / 即刻' : `${item.year} 年後` }}
                </el-tag>
                <el-text tag="b" size="large" style="display: block; font-size: 1.1rem; margin-bottom: 8px; height: 2.4em; line-height: 1.2em; overflow: hidden;">
                  {{ item.title }}
                </el-text>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--el-border-color);">
                  <el-text type="info" size="small" style="display: block; margin-bottom: 4px;">預計金額</el-text>
                  <el-text type="primary" style="font-size: 1.4rem; font-weight: bold; font-family: monospace;">
                    {{ formatCurrency(item.amount) }}
                  </el-text>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" style="margin-bottom: 20px;">
            <div 
              @click="openAdd"
              style="
                height: 100%;
                min-height: 220px;
                border: 2px dashed var(--el-color-primary-light-5);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                background-color: transparent;
                transition: all 0.3s;
              "
              class="add-card-placeholder"
              onmouseover="this.style.borderColor='var(--el-color-primary)'; this.style.backgroundColor='var(--el-color-primary-light-9)'"
              onmouseout="this.style.borderColor='var(--el-color-primary-light-5)'; this.style.backgroundColor='transparent'"
            >
              <el-icon :size="48" color="var(--el-color-primary)"><Plus /></el-icon>
              <el-text type="primary" style="margin-top: 12px; font-weight: bold;">新增目標</el-text>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 40px; margin-bottom: 40px;">
      <el-button type="primary" size="large" round style="width: 200px;" @click="() => window.location.href='./financial-status'">
        下一步：現況分析 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </el-row>
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '編輯理財目標' : '新增理財目標'"
      width="90%"
      style="max-width: 500px; border-radius: 12px;"
      align-center
    >
      <el-form :model="currentForm" label-position="top" size="large">        
        <el-form-item label="預計實現時間 (幾年後)">
          <el-input-number 
            v-model="currentForm.year" 
            :min="0" 
            :max="100" 
            style="width: 100%;"
          >
            <template #prefix>
              <el-icon><Calendar /></el-icon>
            </template>
            <template #suffix>
              <span>年後</span>
            </template>
          </el-input-number>
          <el-text type="info" size="small" style="margin-top: 4px;">
            輸入 0 代表現在或即刻需要執行的目標
          </el-text>
        </el-form-item>
        <el-form-item label="目標名稱">
          <el-input 
            v-model="currentForm.title" 
            placeholder="例如：退休金、子女教育金、購屋..."
            clearable
          >
            <template #prefix>
              <el-icon><Trophy /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="目標金額 (新台幣)">
          <el-input-number 
            v-model="currentForm.amount" 
            :min="0" 
            :step="10000" 
            style="width: 100%;"
            controls-position="right"
          >
             <template #prefix>
              <el-icon><Money /></el-icon>
            </template>
          </el-input-number>
           <div style="margin-top: 8px; text-align: right;">
            <el-text type="primary" tag="b">
              {{ formatCurrency(currentForm.amount) }}
            </el-text>
          </div>
        </el-form-item>
      </el-form>    
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">
            確認儲存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-main>
</el-container>
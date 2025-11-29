---
layout: false
title: 家庭成員與背景
---

<script setup>
import { ref, computed } from 'vue'
import { 
  Plus, 
  EditPen, 
  Delete, 
  User, 
  UserFilled,
  Briefcase,
  ChatLineSquare,
  ArrowRight,
  Male,
  Female
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 1. 定義家庭成員數據結構
// 預設帶入高氏家族的案例數據 (參考 PDF P.4)
const members = ref([
  { id: 1, relation: '本人', name: '高大志', age: 60, job: '太陽貿易 負責人', note: '穩健型投資人，希望60歲退休' },
  { id: 2, relation: '配偶', name: '王美美', age: 59, job: '家庭主婦', note: '領有身心障礙手冊(重度)，需定期回診' },
  { id: 3, relation: '父親', name: '高父', age: 85, job: '退休', note: '中度中風，需人照護' },
  { id: 4, relation: '母親', name: '高母', age: 83, job: '退休', note: '需人照護' },
  { id: 5, relation: '長子', name: '高一為', age: 30, job: '待業中', note: '目前有法律問題需處理' }
])

// 2. 表單控制
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)

// 初始表單狀態
const defaultForm = {
  id: null,
  relation: '',
  name: '',
  age: 30,
  job: '',
  note: ''
}
const currentForm = ref({ ...defaultForm })

// 3. 動作函數

// 開啟新增
const openAdd = () => {
  isEditMode.value = false
  currentForm.value = { ...defaultForm, id: Date.now() }
  dialogVisible.value = true
}

// 開啟編輯
const openEdit = (item) => {
  isEditMode.value = true
  currentForm.value = { ...item }
  dialogVisible.value = true
}

// 刪除成員
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '確定要移除這位家庭成員嗎？',
    '刪除確認',
    {
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      type: 'warning',
      icon: 'InfoFilled'
    }
  ).then(() => {
    members.value = members.value.filter(m => m.id !== id)
    ElMessage.success('成員已移除')
  })
}

// 儲存 (新增或更新)
const handleSave = () => {
  if (!currentForm.value.relation || !currentForm.value.name) {
    ElMessage.warning('稱謂與姓名為必填欄位')
    return
  }

  if (isEditMode.value) {
    // 更新現有
    const index = members.value.findIndex(m => m.id === currentForm.value.id)
    if (index !== -1) {
      members.value[index] = { ...currentForm.value }
    }
  } else {
    // 新增
    members.value.push({ ...currentForm.value })
  }
  
  dialogVisible.value = false
  ElMessage.success(isEditMode.value ? '更新成功' : '新增成功')
}

// 簡單的排序邏輯：本人優先，其他隨意或按年齡
const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => {
    if (a.relation === '本人') return -1
    if (b.relation === '本人') return 1
    if (a.relation === '配偶') return -1
    if (b.relation === '配偶') return 1
    return b.age - a.age // 其他按年齡由大到小
  })
})
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main>    
    <el-row justify="center" style="margin-bottom: 30px; margin-top: 20px;">
      <el-col :xs="22" :sm="20" :md="18" :lg="16" style="text-align: center;">
        <el-icon :size="48" color="var(--el-color-primary)" style="margin-bottom: 16px;">
          <UserFilled />
        </el-icon>
        <el-text tag="h1" type="primary" style="font-size: 2rem; margin: 0; display: block;">
          家庭成員與背景
        </el-text>
        <el-text type="info" style="margin-top: 10px; display: block;">
          建立完整的家庭結構，有助於評估收支負擔與保險需求。
        </el-text>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18">
        <el-row :gutter="20">          
          <el-col 
            v-for="item in sortedMembers" 
            :key="item.id" 
            :xs="24" :sm="12" :md="8" :lg="6"
            style="margin-bottom: 20px;"
          >
            <el-card 
              shadow="hover" 
              style="border-radius: 12px; position: relative; height: 100%; display: flex; flex-direction: column;"
              :body-style="{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }"
            >
              <div style="position: absolute; top: 12px; right: 12px; z-index: 2;">
                <el-button link type="primary" @click="openEdit(item)">
                  <el-icon :size="16"><EditPen /></el-icon>
                </el-button>
                <el-button link type="primary" @click="handleDelete(item.id)" style="margin-left: 4px;">
                  <el-icon :size="16"><Delete /></el-icon>
                </el-button>
              </div>
              <div style="text-align: center; flex-grow: 1;">                
                <div style="margin-bottom: 16px;">
                  <el-avatar 
                    :size="64" 
                    style="background-color: var(--el-color-primary-light-9); color: var(--el-color-primary); font-size: 24px;"
                  >
                    {{ item.relation.charAt(0) }}
                  </el-avatar>
                </div>
                <el-text tag="b" size="large" style="font-size: 1.2rem; display: block; margin-bottom: 8px;">
                  {{ item.name }}
                </el-text>                
                <el-space style="margin-bottom: 16px;">
                  <el-tag effect="dark" round type="primary" size="small">{{ item.relation }}</el-tag>
                  <el-tag effect="plain" round type="primary" size="small">{{ item.age }} 歲</el-tag>
                </el-space>
                <div style="text-align: left; margin-top: 10px; border-top: 1px solid var(--el-border-color-lighter); padding-top: 16px;">
                  <div style="margin-bottom: 8px; display: flex; align-items: center;">
                    <el-icon color="var(--el-color-primary)" style="margin-right: 6px;"><Briefcase /></el-icon>
                    <el-text size="small" style="flex: 1;" truncate>{{ item.job || '未填寫職業' }}</el-text>
                  </div>
                  <div style="display: flex; align-items: flex-start;">
                    <el-icon color="var(--el-color-primary)" style="margin-right: 6px; margin-top: 2px;"><ChatLineSquare /></el-icon>
                    <el-text type="info" size="small" style="line-height: 1.4; flex: 1; height: 2.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                      {{ item.note || '無特殊備註' }}
                    </el-text>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" style="margin-bottom: 20px;">
            <div 
              @click="openAdd"
              style="
                height: 100%;
                min-height: 280px; 
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
              <el-text type="primary" style="margin-top: 12px; font-weight: bold;">新增成員</el-text>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 40px; margin-bottom: 40px;">
      <el-button type="primary" size="large" round style="width: 200px;" @click="() => window.location.href='./goal-setting'">
        下一步：目標設定 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </el-row>
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '編輯家庭成員' : '新增家庭成員'"
      width="90%"
      style="max-width: 500px; border-radius: 12px;"
      align-center
    >
      <el-form :model="currentForm" label-position="top" size="large">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="稱謂 (Relation)">
              <el-input v-model="currentForm.relation" placeholder="如：配偶、長子">
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年齡 (Age)">
              <el-input-number 
                v-model="currentForm.age" 
                :min="0" :max="120" 
                style="width: 100%;" 
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="姓名 (Name)">
          <el-input v-model="currentForm.name" placeholder="請輸入真實姓名">
            <template #prefix><el-icon><UserFilled /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="職業 (Job)">
          <el-input v-model="currentForm.job" placeholder="如：公司負責人、家管、學生">
            <template #prefix><el-icon><Briefcase /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="備註 (Note)">
          <el-input 
            v-model="currentForm.note" 
            type="textarea" 
            :rows="3" 
            placeholder="可填寫健康狀況、特殊需求或其他補充資訊"
          />
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
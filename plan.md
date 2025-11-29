---
layout: false
title: 理財規劃書封面
---

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, UserFilled, Monitor, InfoFilled } from '@element-plus/icons-vue'

// 定義報告數據
const reportData = ref({
  clientName: '', 
  advisors: ['EN Chu'],
  date: new Date().toLocaleDateString('zh-TW'),
  disclaimer: '機密財務文件｜僅供本人參考｜嚴禁外流'
})

// 動態標題邏輯
const dynamicTitle = computed(() => {
  return reportData.value.clientName 
    ? `${reportData.value.clientName} 的理財規劃書` 
    : '全方位理財規劃書'
})

// 開始規劃導航
const startPlanning = () => {
  window.location.href = './plan/table-of-contents' 
}
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main style="display: flex; justify-content: center; align-items: center;">
    <el-row justify="center" style="width: 100%;">
      <el-col :xs="22" :sm="18" :md="14" :lg="10" :xl="8">
        <el-card shadow="hover" style="border-radius: 12px; text-align: center; border-top: 4px solid var(--el-color-primary);">
          <template #header>
            <el-space direction="vertical" alignment="center" :size="16" style="width: 100%; padding: 20px 0;">
              <el-icon :size="48" color="var(--el-color-primary)"><Monitor /></el-icon>
              <el-text type="primary" tag="h1" style="font-size: 1.8rem; margin: 0; line-height: 1.2;">
                {{ dynamicTitle }}
              </el-text> 
              <el-text type="info" size="small" style="letter-spacing: 2px;">
                PERSONAL FINANCIAL PLANNING REPORT
              </el-text>
            </el-space>
          </template>
          <el-form size="large" style="margin-top: 10px;">
            <el-form-item>
              <el-input 
                v-model="reportData.clientName" 
                placeholder="請輸入客戶姓名" 
                clearable
              >
                <template #prefix>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-descriptions :column="1" border style="margin-bottom: 24px;">
              <el-descriptions-item label-align="center" align="center">
                <template #label>
                  <el-text type="primary"><el-icon><UserFilled /></el-icon> 規劃顧問</el-text>
                </template>
                <el-space>
                  <el-tag 
                    v-for="advisor in reportData.advisors" 
                    :key="advisor" 
                    type="primary" 
                    effect="plain" 
                    round
                  >
                    {{ advisor }}
                  </el-tag>
                </el-space>
              </el-descriptions-item>
              <el-descriptions-item label-align="center" align="center">
                <template #label>
                  <el-text type="primary"><el-icon><InfoFilled /></el-icon> 報告日期</el-text>
                </template>
                <el-text>{{ reportData.date }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                style="width: 100%; font-weight: bold; letter-spacing: 1px;"
                round
                @click="startPlanning"
              >
                開始閱覽 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
          <template #footer>
            <div style="text-align: center;">
              <el-text type="primary" size="small" style="opacity: 0.8;">
                <el-icon style="vertical-align: middle; margin-right: 4px;"><InfoFilled /></el-icon>
                {{ reportData.disclaimer }}
              </el-text>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</el-container>
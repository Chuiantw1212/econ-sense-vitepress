---
layout: false
title: 理財規劃書封面
---

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, DocumentChecked, UserFilled, InfoFilled } from '@element-plus/icons-vue'

// 定義報告數據
const reportData = ref({
  clientName: '', 
  advisors: ['EN Chu'],
  date: new Date().toLocaleDateString('zh-TW'),
  disclaimer: '本報告書包含機密財務資訊，僅供用戶本人參考，嚴禁外流。'
})

// 動態標題邏輯
const dynamicTitle = computed(() => {
  return reportData.value.clientName 
    ? `${reportData.value.clientName} 專屬理財規劃書` 
    : '全方位理財規劃書'
})

// 開始規劃導航
const startPlanning = () => {
  // 這裡建議使用 VitePress 的 router 或相對路徑
  window.location.href = './table-of-contents' 
}
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <el-row justify="center" style="width: 100%;">
      <el-col :xs="22" :sm="20" :md="16" :lg="12" :xl="10">
        <el-card shadow="hover" style="border-radius: 16px; text-align: center; padding: 20px;">
          <template #header>
            <el-space direction="vertical" :size="10" style="width: 100%">
               <el-text type="primary" tag="b" size="large" style="font-size: 2rem;">
                {{ dynamicTitle }}
              </el-text>
              <el-text type="info" size="small">
                Financial Planning Report
              </el-text>
            </el-space>
          </template>
          <el-form label-position="top" size="large" style="margin-top: 20px;">
            <el-form-item>
              <el-input 
                v-model="reportData.clientName" 
                placeholder="請輸入客戶姓名以生成封面" 
                size="large"
                clearable
              >
                <template #prefix>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-descriptions :column="1" border style="margin-bottom: 30px;">
              <el-descriptions-item label="規劃顧問" label-align="center" align="center">
                <el-space>
                  <el-tag 
                    v-for="advisor in reportData.advisors" 
                    :key="advisor" 
                    type="success" 
                    effect="dark" 
                    round
                  >
                    {{ advisor }}
                  </el-tag>
                </el-space>
              </el-descriptions-item>
              <el-descriptions-item label="報告日期" label-align="center" align="center">
                <el-text tag="b">{{ reportData.date }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                round 
                color="#626aef" 
                @click="startPlanning" 
                style="width: 100%; height: 50px; font-size: 1.2rem;"
              >
                開始閱覽規劃 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-alert
              :title="reportData.disclaimer"
              type="warning"
              :closable="false"
              show-icon
              center
            />
            <div style="margin-top: 15px;">
              <el-text type="info" size="small">
                Powered by VitePress & Element Plus
              </el-text>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</el-container>
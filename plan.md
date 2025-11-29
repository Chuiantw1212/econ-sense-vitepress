---
layout: false
title: 理財規劃書封面
---

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, DocumentChecked } from '@element-plus/icons-vue'

const reportData = ref({
  clientName: '', 
  advisors: ['EN Chu'],
  date: new Date().toLocaleDateString('zh-TW'),
  disclaimer: '本報告書包含機密財務資訊，僅供用戶本人參考，嚴禁外流。'
})

// 動態標題邏輯
const dynamicTitle = computed(() => {
  return reportData.value.clientName 
    ? `${reportData.value.clientName} 的理財規劃書` 
    : '全方位理財規劃書'
})

const startPlanning = () => {
  window.location.href = '/docs/table-of-contents' 
}
</script>

<div class="page-container">
  <el-row justify="center" align="middle" style="width: 100%;">
    <el-col :xs="22" :sm="20" :md="16" :lg="12" :xl="10">
      <el-card shadow="always" class="cover-card">
        <template #header>
          <div style="text-align: center;">
            <h1 style="margin: 20px 0; font-size: 2rem; color: #303133;">
              {{ dynamicTitle }}
            </h1>
          </div>
        </template>
        <el-descriptions :column="1" border size="large">
          <el-descriptions-item label="姓名" label-align="center" align="center">
            <el-input 
              v-model="reportData.clientName" 
              placeholder="請輸入用戶姓名" 
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><DocumentChecked /></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="規劃顧問" label-align="left" align="left">
            <el-space wrap>
              <el-tag 
                v-for="advisor in reportData.advisors" 
                :key="advisor" 
                type="success" 
                effect="plain"
              >
                {{ advisor }}
              </el-tag>
            </el-space>
          </el-descriptions-item>
          <el-descriptions-item label="報告日期" label-align="left" align="left">
            <el-tag type="info" effect="plain">{{ reportData.date }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 40px; text-align: center;">
          <el-button type="primary" size="large" round @click="startPlanning" style="padding: 20px 40px; font-size: 1.1rem;">
            開始規劃 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-divider>
            <el-text type="info" size="small">CONFIDENTIAL</el-text>
          </el-divider>
          <el-alert
            :title="reportData.disclaimer"
            type="info"
            center
            show-icon
            :closable="false"
          />
        </div>
      </el-card>
      <div style="text-align: center; margin-top: 20px;">
        <el-text type="info" size="small">Powered by VitePress & Element Plus</el-text>
      </div>
    </el-col>
  </el-row>
</div>

<style>
/* 僅保留最基礎的佈局樣式 
  這些是為了讓卡片在螢幕正中間顯示，
  以及給予一個乾淨的背景色。
*/
.page-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa; /* Element Plus 標準背景灰 */
  padding: 20px;
}

/* 讓標題在手機版不要太大 */
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem !important;
  }
}
</style>
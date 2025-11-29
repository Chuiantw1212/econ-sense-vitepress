---
layout: false
title: 責任與義務聲明
---

<script setup>
import { ref } from 'vue'
import { 
  DocumentChecked, 
  Service, 
  User, 
  InfoFilled, 
  ArrowRight 
} from '@element-plus/icons-vue'

// 同意條款狀態
const isAgreed = ref(false)

// 顧問責任內容
const advisorDuties = [
  {
    title: '專業與道德',
    content: '本報告由專業理財顧問團隊製作，嚴格遵守 CFP® 國際認證標準與職業道德規範，以客戶最佳利益為優先考量。'
  },
  {
    title: '客觀估算',
    content: '規劃內容基於現行法令、稅制及合理之經濟預測（如通膨率、投資報酬率）進行估算，僅供決策參考，非獲利保證。'
  },
  {
    title: '隱私保密',
    content: '對於客戶所提供之所有個人資料與財務數據，本團隊負有絕對保密責任，未經授權絕不向第三方揭露。'
  }
]

// 客戶義務內容
const clientDuties = [
  {
    title: '誠實揭露',
    content: '客戶應盡可能提供正確且完整的家庭資訊、資產負債與收支狀況，以確保規劃結果符合真實需求。'
  },
  {
    title: '定期檢視',
    content: '當家庭結構改變（如結婚、生子）、職涯變動或國內外政經情勢有重大變化時，應主動與顧問聯繫進行方案調整。'
  },
  {
    title: '專屬客製',
    content: '本規劃書為量身定製之方案，不宜直接套用於其他個案家庭，亦不建議隨意更動規劃內容以免影響執行效益。'
  }
]

// 下一步導航
const nextStep = () => {
  if (isAgreed.value) {
    window.location.href = './family-background'
  }
}
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main>
    <el-row justify="center" style="margin-bottom: 30px; margin-top: 20px;">
      <el-col :xs="22" :sm="20" :md="18" :lg="16" style="text-align: center;">
        <el-icon :size="48" color="var(--el-color-primary)" style="margin-bottom: 16px;">
          <DocumentChecked />
        </el-icon>
        <el-text tag="h1" type="primary" style="font-size: 2rem; margin: 0; display: block;">
          責任與義務聲明
        </el-text>
        <el-text type="info" style="margin-top: 10px; display: block;">
          為了確保理財規劃的順利進行，請詳閱以下雙方之權利與義務。
        </el-text>
      </el-col>
    </el-row>
    <el-row justify="center" :gutter="40">
      <el-col :xs="22" :sm="10" :md="9" :lg="7" style="margin-bottom: 20px;">
        <el-card shadow="never" style="height: 100%; border-radius: 12px; border-top: 4px solid var(--el-color-primary);">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: center;">
              <el-icon :size="24" color="var(--el-color-primary)" style="margin-right: 10px;">
                <Service />
              </el-icon>
              <el-text tag="b" size="large">顧問的責任</el-text>
            </div>
          </template>
          <div style="text-align: left;">
            <div 
              v-for="(item, index) in advisorDuties" 
              :key="index" 
              style="display: flex; align-items: flex-start; margin-bottom: 24px;"
            >
              <div style="flex-shrink: 0; width: 32px; margin-right: 8px;">
                <el-text tag="b" type="primary" size="large" style="font-family: monospace;">
                  0{{ index + 1 }}.
                </el-text>
              </div>
              <div>
                <el-text tag="b" type="primary" style="display: block; margin-bottom: 4px;">
                  {{ item.title }}
                </el-text>
                <el-text type="info" size="small" style="line-height: 1.6; display: block;">
                  {{ item.content }}
                </el-text>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="22" :sm="10" :md="9" :lg="7" style="margin-bottom: 20px;">
        <el-card shadow="never" style="height: 100%; border-radius: 12px; border-top: 4px solid var(--el-color-primary);">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: center;">
              <el-icon :size="24" color="var(--el-color-primary)" style="margin-right: 10px;">
                <User />
              </el-icon>
              <el-text tag="b" size="large">客戶的義務</el-text>
            </div>
          </template>
          <div style="text-align: left;">
            <div 
              v-for="(item, index) in clientDuties" 
              :key="index" 
              style="display: flex; align-items: flex-start; margin-bottom: 24px;"
            >
              <div style="flex-shrink: 0; width: 32px; margin-right: 8px;">
                <el-text tag="b" type="primary" size="large" style="font-family: monospace;">
                  0{{ index + 1 }}.
                </el-text>
              </div>
              <div>
                <el-text tag="b" type="primary" style="display: block; margin-bottom: 4px;">
                  {{ item.title }}
                </el-text>
                <el-text type="info" size="small" style="line-height: 1.6; display: block;">
                  {{ item.content }}
                </el-text>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row justify="center" style="margin-top: 20px; margin-bottom: 60px;">
      <el-col :xs="22" :sm="18" :md="14" :lg="10">
        <el-card shadow="hover" style="border-radius: 12px; text-align: center;">
          <el-space direction="vertical" :size="20" style="width: 100%;">
            <div style="display: flex; align-items: center; justify-content: center; opacity: 0.8;">
              <el-icon color="var(--el-color-primary)" style="margin-right: 6px;"><InfoFilled /></el-icon>
              <el-text type="info" size="small">
                點擊下方確認以繼續規劃流程
              </el-text>
            </div>
            <el-checkbox 
              v-model="isAgreed" 
              size="large" 
              style="--el-checkbox-checked-bg-color: var(--el-color-primary); --el-checkbox-checked-input-border-color: var(--el-color-primary);"
            >
              <el-text tag="b" :type="isAgreed ? 'primary' : 'regular'">
                我已充分理解並同意上述聲明內容
              </el-text>
            </el-checkbox>
            <el-button 
              type="primary" 
              size="large" 
              round 
              :disabled="!isAgreed"
              style="width: 200px; height: 44px; font-weight: bold;"
              @click="nextStep"
            >
              下一步：家庭背景
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</el-container>
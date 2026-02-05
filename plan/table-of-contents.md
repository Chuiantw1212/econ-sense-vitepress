---
layout: false
title: 理財規劃目錄
---

<script setup>
import { ref } from 'vue'
import { 
  DocumentChecked,  // 01. 聲明 (比 Reading 更像契約)
  User,             // 02. 家庭 (保留)
  List,             // 03. 目標 (保留)
  Wallet,           // 04. 現況 (錢包 -> 資產/收支)
  Compass,          // 05. 建議 (指南針 -> 指引方向)
  TrendCharts,      // 06. 效益 (保留)
  Promotion,        // 07. 執行 (紙飛機 -> 行動/出發)
  Refresh,          // 08. 檢視 (刷新 -> 循環檢視)
  ArrowRight
} from '@element-plus/icons-vue'

// 模擬整體規劃進度
const totalProgress = ref(35)

// 章節定義
const chapters = ref([
  {
    title: '責任聲明',
    desc: '權利義務說明',
    icon: DocumentChecked,
    path: './disclaimer',
    status: 'completed'
  },
  {
    title: '家庭背景',
    desc: '成員與風險屬性',
    icon: User,
    path: './family-background',
    status: 'completed'
  },
  {
    title: '目標設定',
    desc: '短中長期目標',
    icon: List,
    path: './goal-setting',
    status: 'process'
  },
  {
    title: '現況分析',
    desc: '資產與收支表',
    icon: Wallet,
    path: './financial-status',
    status: 'pending'
  },
  {
    title: '規劃建議',
    desc: '配置與稅務策略',
    icon: Compass,
    path: './recommendations',
    status: 'pending'
  },
  {
    title: '效益分析',
    desc: '資產成長預測',
    icon: TrendCharts,
    path: './benefit-analysis',
    status: 'pending'
  },
  {
    title: '執行計畫',
    desc: '具體行動方案',
    icon: Promotion,
    path: './execution-plan',
    status: 'pending'
  },
  {
    title: '定期檢視',
    desc: '監控與調整',
    icon: Refresh,
    path: './review',
    status: 'pending'
  }
])

const navigateTo = (path) => {
  window.location.href = path
}
</script>

<el-container style="min-height: 100vh; background-color: var(--el-bg-color-page);">
  <el-main>
    <el-row justify="center" style="margin-bottom: 40px; margin-top: 20px;">
      <el-col :xs="22" :sm="18" :md="16" :lg="14">
        <div style="text-align: center;">
          <el-text type="info" size="small" style="letter-spacing: 1px; text-transform: uppercase;">Overall Progress</el-text>
          <div style="margin: 10px 0;">
            <el-text type="primary" style="font-size: 2.5rem; font-weight: bold;">{{ totalProgress }}%</el-text>
          </div>
          <el-progress 
            :percentage="totalProgress" 
            :stroke-width="8" 
            :show-text="false"
            color="var(--el-color-primary)"
            style="max-width: 300px; margin: 0 auto;"
          />
        </div>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="16">
        <el-row :gutter="20">
          <el-col 
            v-for="(item, index) in chapters" 
            :key="index" 
            :xs="12" :sm="8" :md="6" 
            style="margin-bottom: 20px;"
          >
            <el-card 
              shadow="hover" 
              class="chapter-card"
              style="
                border-radius: 16px; 
                cursor: pointer; 
                height: 180px; 
                border: none;
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                position: relative;
                overflow: visible;
              "
              @click="navigateTo(item.path)"
            >
              <div 
                v-if="item.status !== 'pending'"
                style="
                  position: absolute; 
                  top: 12px; 
                  right: 12px; 
                  width: 8px; 
                  height: 8px; 
                  border-radius: 50%;
                  background-color: var(--el-color-primary);
                "
              ></div>
              <el-icon 
                :size="48" 
                color="var(--el-color-primary)" 
                style="margin-bottom: 16px; opacity: 0.9;"
              >
                <component :is="item.icon" />
              </el-icon>   
              <el-text tag="b" size="default" style="display: block; margin-bottom: 4px; color: var(--el-text-color-primary);">
                {{ item.title }}
              </el-text> 
              <el-text type="info" size="small" style="font-size: 12px; opacity: 0.7;">
                {{ item.desc }}
              </el-text>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</el-container>
---
outline: [2,3]
---

# 熵腦人格測驗：找出你的原廠設定與部落原型

你是否曾經因為投資決策太衝動而懊惱？或是因為在重要時刻想太多、猶豫不決而錯失良機？

傳統經濟學假設我們是「理性人」，能毫無偏見地極大化利益。然而，現實中的泡沫經濟與債務危機證明，金錢決策本質上是**心理決策**。行為金融學告訴我們，我們的大腦是一台精密的生物機器，如果一個部落全是衝動的獵人，會在飢荒中滅絕；如果全是深思熟慮的長老，會在變局中被淘汰。

這套 **熵腦模型** 將帶你解開動機 (Why)、認知 (Where) 與控制 (How) 的原廠設定。這不只是一場人格測驗，更是一次對你「財務行為」與「潛在認知偏差」的深度掃描。

## 🧠 熵腦人格測驗 (The Entropy Brain Test)

<ClientOnly>
  <KeywordQuizCard @update="handleAnalysisUpdate" />

  <div v-show="visualData.length >= 5" class="result-section">
      <BrainUniverseCard :selectedKeywords="visualData" />
  </div>
</ClientOnly>

## 🧬 核心本質與生存 (To Consumer)

這部分解析你的靈魂原廠設定，以及你在社會部落中的最佳位置。

<ClientOnly>
  <div v-if="visualData.length >= 10" class="analysis-container">
    <HybridSoulCard 
        :primaryRole="topArchetypes.primary"
        :secondary-role="topArchetypes.secondary" 
    />
    <ArchetypeCompositionCard 
        :selectedKeywords="visualData" 
    />
    <KeyDimensionsCard 
        :userVector="dimensionScores" 
    />   
    <InternalFrictionCard 
        :primaryRole="topArchetypes.primary"
        :secondary-role="topArchetypes.secondary"
    />
    <SelfCareCard 
        :primaryRole="topArchetypes.primary"
        :secondary-role="topArchetypes.secondary"
    />
    <IntimacyCard 
        :primaryRole="topArchetypes.primary" 
        :secondary-role="topArchetypes.secondary"
    />
</div>
  <div v-else class="placeholder-box">
      <el-skeleton :rows="3" animated />
      <div class="skeleton-text">請回到上方勾選至少 10 個關鍵字...</div>
  </div>
</ClientOnly>

## 💰 財富戰略矩陣 (To Consumer)

從行為金融學角度，為你量身打造的「賺、留、滾」三部曲，並確立你的最終身分。

<ClientOnly>
  <div v-if="visualData.length >= 10" class="analysis-container">
      <CareerStrategyCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <WealthManagementCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <WealthInvestmentCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <AntiScamCard :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"/>
      <FinalIdentityCard :primaryRole="topArchetypes.primary" />
  </div>
  <div v-else class="placeholder-box">
      <el-skeleton :rows="3" animated />
      <div class="skeleton-text">請回到上方勾選至少 10 個關鍵字...</div>
  </div>
</ClientOnly>

## 🏢 創業與組織架構 (To Business)

如果你是創業者或團隊領導者，這部分揭示你在組織中的「物理屬性」與「化學反應」。

<ClientOnly>
  <div v-if="visualData.length >= 10" class="analysis-container">
      <FounderDualCard 
          :primaryRole="topArchetypes.primary" 
          :secondaryRole="topArchetypes.secondary" 
      />
  </div>
  <div v-else class="placeholder-box">
      <el-skeleton :rows="3" animated />
      <div class="skeleton-text">請先完成測驗以解鎖創業架構分析...</div>
  </div>
</ClientOnly>

## 📚 熵腦模型的進階策略

作者留：還在做，未來會每個頁面都為每個類型量身打造互動體驗。
會有典範、人類學故事、從0到超越的學習步驟(純理論)、推薦的學習資源。

| 角色符號與名稱 | 核心代碼 (Code) | 內在驅動力             | 完整策略連結                                                   |
| :------------- | :-------------- | :--------------------- | :------------------------------------------------------------- |
| **🏹 獵人**     | IRH             | **個體 - 現證 - 熱動** | <a href="./entropy/hunter.html" target="_blank">查看進階策略</a>    |
| **🧭 先驅**     | IVH             | **個體 - 內觀 - 熱動** | <a href="./entropy/pioneer.html" target="_blank">查看進階策略</a>   |
| **🍇 採集者**   | ORH             | **他人 - 現證 - 熱動** | <a href="./entropy/gatherer.html" target="_blank">查看進階策略</a>  |
| **🦋 薩滿**     | OVH             | **他人 - 內觀 - 熱動** | <a href="./entropy/shaman.html" target="_blank">查看進階策略</a>    |
| **🛠 工匠**     | IRC             | **個體 - 現證 - 冷控** | <a href="./entropy/toolmaker.html" target="_blank">查看進階策略</a> |
| **🛡️ 哨兵**     | IVC             | **個體 - 內觀 - 冷控** | <a href="./entropy/sentry.html" target="_blank">查看進階策略</a>    |
| **🫂 助人者**   | ORC             | **他人 - 現證 - 冷控** | <a href="./entropy/helper.html" target="_blank">查看進階策略</a>    |
| **🌳 長老**     | OVC             | **他人 - 內觀 - 冷控** | <a href="./entropy/elder.html" target="_blank">查看進階策略</a>     |


<script setup lang="ts">
import { ref } from 'vue'

// 1. 引入新封裝的測驗卡片
import KeywordQuizCard from './components/entropy/keywordQuizCard.vue'

// 2. 引入其他展示卡片
import HybridSoulCard from './components/entropy/hybridSoulCard/hybridSoulCard.vue'
import ArchetypeCompositionCard from './components/entropy/archetypeCompositionCard.vue'
import KeyDimensionsCard from './components/entropy/keyDimensionsCard/keyDimensionsCard.vue'
import BrainUniverseCard from './components/entropy/brainUniverseCard.vue'
import InternalFrictionCard from './components/entropy/internalFrictionCard.vue'
import IntimacyCard from './components/entropy/intimacyRationCard/intimacyRationCard.vue'
import SelfCareCard from './components/entropy/selfCareCard/selfCareCard.vue'

import CareerStrategyCard from './components/entropy/careerStrategyCard/careerStrategyCard.vue'
import WealthManagementCard from './components/entropy/wealthManagement/wealthManagementCard.vue'
import WealthLeverageCard from './components/entropy/wealthLeverage/wealthLeverageCard.vue'
import WealthInvestmentCard from './components/entropy/wealthInvestment/wealthInvestmentCard.vue'
import AntiScamCard from './components/entropy/antiScamCard/antiScamCard.vue'
import FinalIdentityCard from './components/entropy/finalIdentityCard.vue'
import FounderDualCard from './components/entropy/founderDual/founderDualCard.vue'

// --- 資料狀態管理 ---

interface IKeyword {
    "id": number,  
    "keyword_zh": string, 
    "keyword_en": string, 
    "archetype": string, 
    "vector": { 
        "x": number, 
        "y": number, 
        "z": number, 
    }
}

const visualData = ref<IKeyword[]>([]) 
const dimensionScores = ref<any>(null)
const topArchetypes = ref<{ primary: string; secondary: string | undefined }>({
    primary: '',
    secondary: undefined
});

// --- 處理來自 KeywordQuizCard 的更新 ---
function handleAnalysisUpdate(result: any) {
    visualData.value = result.keywords;
    dimensionScores.value = result.dimension;
    topArchetypes.value = result.archetypes;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.result-section { padding: 20px 0; border-radius: 12px; animation: fadeIn 0.6s ease; }
.analysis-container { display: flex; flex-direction: column; gap: 30px; }
.placeholder-box { margin-top: 20px; padding: 40px; background: #f9f9f9; border-radius: 12px; border: 2px dashed #e0e0e0; text-align: center; }
.skeleton-text { margin-top: 15px; color: #909399; font-size: 0.9rem; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
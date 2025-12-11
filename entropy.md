---
outline: [2,3]
---

# 熵腦人格測驗：找出你的原廠設定與部落原型

你是否曾經因為投資決策太衝動而懊惱？或是因為在重要時刻想太多、猶豫不決而錯失良機？

傳統經濟學假設我們是「理性人」，能毫無偏見地極大化利益。然而，現實中的泡沫經濟與債務危機證明，金錢決策本質上是**心理決策**。行為金融學告訴我們，我們的大腦是一台精密的生物機器，如果一個部落全是衝動的獵人，會在飢荒中滅絕；如果全是深思熟慮的長老，會在變局中被淘汰。

這套 **熵腦模型** 將帶你解開動機 (Why)、認知 (Where) 與控制 (How) 的原廠設定。這不只是一場人格測驗，更是一次對你「財務行為」與「潛在認知偏差」的深度掃描。

## 🧠 熵腦人格測驗 (The Entropy Brain Test)

<ClientOnly>
  <el-card v-loading="fullscreenLoading" class="quiz-card">
    <template #header>
        <div class="card-header">
            <div class="header-content">
                <span>請憑直覺勾選 10~20 個關鍵字</span>
                <el-tag effect="dark" round :type="selectedKeywords.length >= 10 ? 'success' : 'info'">
                    {{ selectedKeywords.length }} / 20
                </el-tag>
            </div>
            <el-button @click="resetTest" size="small">重置</el-button>
        </div>
    </template>
    <el-row class="keyword-container">
        <el-checkbox-group v-model="selectedKeywords" @change="calculateResults">
            <el-checkbox v-for="item in visibleKeywords" :key="item.keyword_zh" :label="item.keyword_zh"
                :value="item" border style="margin: 5px;">
                {{ item.keyword_zh }}
            </el-checkbox>
        </el-checkbox-group>
    </el-row>
    <div v-if="!isExpanded" class="expand-section">
        <el-divider content-position="center">
            <el-button text bg type="primary" @click="isExpanded = true">
                覺得不夠？顯示更多關鍵字
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
        </el-divider>
    </div>
    <div v-else class="expanded-hint">
        <el-text type="info" size="small">已顯示所有 128 個關鍵字</el-text>
    </div>
  </el-card>

  <div v-show="selectedKeywords.length >= 5" class="result-section">
      <BrainUniverseCard :selectedKeywords="selectedKeywords" />
  </div>
</ClientOnly>

## 👤 個人修煉報告 (To Consumer)

這份報告專注於你的「個體優化」。無論你是上班族、自由工作者或投資人，這裡提供最適合你大腦的生存與致富策略。

<ClientOnly>
  <div v-if="selectedKeywords.length >= 10" class="analysis-container">
      <HybridSoulCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary" 
      />
      <KeyDimensionsCard :userVector="dimensionScores" />
      <InternalFrictionCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <CareerStrategyCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <WealthManagementCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <WealthLeverageCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <WealthInvestmentCard 
          :primaryRole="topArchetypes.primary"
          :secondary-role="topArchetypes.secondary"
      />
      <SocialCompatibilityCard 
          :primaryRole="topArchetypes.primary" 
          :secondary-role="topArchetypes.secondary"
      />
      <FinalIdentityCard :primaryRole="topArchetypes.primary" />

  </div>
  
  <div v-else class="placeholder-box">
      <el-empty description="數據量不足，無法生成報告">
          <template #extra>
              <el-button type="primary" @click="scrollToTop">
                  請回到上方勾選至少 10 個關鍵字
              </el-button>
          </template>
      </el-empty>
  </div>
</ClientOnly>

## 🏢 創業與組織架構 (To Business)

如果你是創業者、合夥人或團隊領導者，這部分將揭示你在組織中的「物理屬性」。
一個健康的團隊需要 **熱動 (H)** 來點火，也需要 **冷控 (C)** 來降溫。這裡將分析你的領導風格與最適合你的互補夥伴。

<ClientOnly>
  <div v-if="selectedKeywords.length >= 10" class="analysis-container">
      <FounderDualCard 
          :primaryRole="topArchetypes.primary" 
          :secondaryRole="topArchetypes.secondary" 
      />
      </div>
  <div v-else class="placeholder-box">
      <el-skeleton :rows="5" animated />
      <div class="skeleton-text">請先完成測驗以解鎖創業架構分析...</div>
  </div>
</ClientOnly>

---

## 📚 熵腦模型的進階策略

| 角色符號與名稱 | 核心代碼 (Code) | 內在驅動力             | 完整策略連結                           |
| :------------- | :-------------- | :--------------------- | :------------------------------------- |
| **🏹 獵人**     | IRH             | **個體 - 現證 - 熱動** | [查看進階策略](./entropy/hunter.md)    |
| **🧭 先驅**     | IVH             | **個體 - 內觀 - 熱動** | [查看進階策略](./entropy/pioneer.md)   |
| **🍇 採集者**   | ORH             | **他人 - 現證 - 熱動** | [查看進階策略](./entropy/gatherer.md)  |
| **🦋 薩滿**     | OVH             | **他人 - 內觀 - 熱動** | [查看進階策略](./entropy/shaman.md)    |
| **🛠 工匠**     | IRC             | **個體 - 現證 - 冷控** | [查看進階策略](./entropy/toolmaker.md) |
| **🛡️ 哨兵**     | IVC             | **個體 - 內觀 - 冷控** | [查看進階策略](./entropy/sentry.md)    |
| **🫂 助人者**   | ORC             | **他人 - 現證 - 冷控** | [查看進階策略](./entropy/helper.md)    |
| **🌳 長老**     | OVC             | **他人 - 內觀 - 冷控** | [查看進階策略](./entropy/elder.md)     |


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { data } from './components/entropy/keywords.data.js'

// --- Component Imports ---
// ToC Components
import BrainUniverseCard from './components/entropy/brainUniverseCard.vue'
import HybridSoulCard from './components/entropy/hybridSoulCard/hybridSoulCard.vue'
import KeyDimensionsCard from './components/entropy/keyDimensionsCard/keyDimensionsCard.vue'
import SocialCompatibilityCard from './components/entropy/socialCompatibilityCard/socialCompatibilityCard.vue'
import InternalFrictionCard from './components/entropy/internalFrictionCard.vue'
import CareerStrategyCard from './components/entropy/careerStrategyCard/careerStrategyCard.vue'
import WealthManagementCard from './components/entropy/wealthManagement/wealthManagementCard.vue'
import WealthLeverageCard from './components/entropy/wealthLeverage/wealthLeverageCard.vue'
import WealthInvestmentCard from './components/entropy/wealthInvestment/wealthInvestmentCard.vue'
import FinalIdentityCard from './components/entropy/finalIdentityCard.vue'

// ToB Components
// import FounderAdvantageCard from './components/entropy/founderAdvantage/FounderAdvantageCard.vue'
import FounderDualCard from './components/entropy/founderDual/founderDualCard.vue'

// --- 狀態與邏輯 ---
// (這部分邏輯與您原本的完全相同，只需保留即可)
// 為了版面簡潔，我這裡省略了中間重複的 initKeywords / calculateResults 等函數
// 請直接沿用您原本寫好的 script setup 內容

interface Vector3 { x: number; y: number; z: number; }
interface KeywordItem { id: number; keyword_zh: string; keyword_en: string; archetype: string; vector: Vector3; description?: string; }

const shuffledKeywords = ref<KeywordItem[]>([])
const selectedKeywords = ref<KeywordItem[]>([])
const fullscreenLoading = ref<boolean>(false)
const dimensionScores = ref<Vector3 | null>(null)
const isExpanded = ref<boolean>(false)

const visibleKeywords = computed(() => {
    if (isExpanded.value) return shuffledKeywords.value;
    const limit = Math.ceil(shuffledKeywords.value.length / 2);
    return shuffledKeywords.value.slice(0, limit);
})

const topArchetypes = ref<{ primary: string; secondary: string | undefined }>({
    primary: '',
    secondary: undefined
});

onMounted(() => { initKeywords(); });

function initKeywords() {
    const rawData = data.keywords || [];
    const uniqueMap = new Map<string, KeywordItem>();
    rawData.forEach((item: any) => {
        if (item && item.keyword_zh) {
            const cleanKey = item.keyword_zh.trim();
            if (!uniqueMap.has(cleanKey)) uniqueMap.set(cleanKey, { ...item, keyword_zh: cleanKey });
        }
    });
    const uniqueData = Array.from(uniqueMap.values());
    const groups: Record<string, KeywordItem[]> = {};
    uniqueData.forEach(item => {
        if (!groups[item.archetype]) groups[item.archetype] = [];
        groups[item.archetype].push(item);
    });
    let visiblePool: KeywordItem[] = [];
    let hiddenPool: KeywordItem[] = [];
    Object.keys(groups).forEach(key => {
        const groupItems = shuffle(groups[key]);
        const mid = Math.ceil(groupItems.length / 2);
        visiblePool = visiblePool.concat(groupItems.slice(0, mid));
        hiddenPool = hiddenPool.concat(groupItems.slice(mid));
    });
    const finalSequence = [...shuffle(visiblePool), ...shuffle(hiddenPool)];
    shuffledKeywords.value = finalSequence.map((item, index) => ({ ...item, id: index }));
}

function calculateResults() {
    if (selectedKeywords.value.length === 0) {
        dimensionScores.value = null;
        topArchetypes.value = { primary: '', secondary: undefined };
        return;
    }
    let totalVec = { x: 0, y: 0, z: 0 };
    const counts: Record<string, number> = {};
    selectedKeywords.value.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });
    const count = selectedKeywords.value.length;
    dimensionScores.value = { x: totalVec.x / count, y: totalVec.y / count, z: totalVec.z / count };
    const sortedRoles = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primary = sortedRoles[0] ? sortedRoles[0][0] : '';
    const secondary = (sortedRoles[1] && sortedRoles[1][1] > 0) ? sortedRoles[1][0] : undefined;
    topArchetypes.value = { primary, secondary };
}

function resetTest() {
    selectedKeywords.value = [];
    dimensionScores.value = null;
    topArchetypes.value = { primary: '', secondary: undefined };
    isExpanded.value = false;
    initKeywords();
}

function shuffle<T>(sourceArray: T[]): T[] {
    const array = Array.from(sourceArray);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
.quiz-card { margin-bottom: 20px; transition: all 0.3s ease; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-content { display: flex; align-items: center; gap: 10px; font-weight: bold; color: #303133; }
.keyword-container { justify-content: center; margin-bottom: 10px; }
.expand-section { margin-top: 15px; margin-bottom: 5px; }
.expanded-hint { text-align: center; margin-top: 10px; opacity: 0.6; }
.result-section { padding: 20px 0; border-radius: 12px; animation: fadeIn 0.6s ease; }

/* Analysis Container: 卡片間距 */
.analysis-container {
    display: flex;
    flex-direction: column;
    gap: 30px; /* 卡片之間的垂直距離 */
}

/* Placeholder Box */
.placeholder-box {
    margin-top: 20px;
    padding: 40px;
    background: #f9f9f9;
    border-radius: 12px;
    border: 2px dashed #e0e0e0;
    text-align: center;
}
.skeleton-text {
    margin-top: 15px;
    color: #909399;
    font-size: 0.9rem;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
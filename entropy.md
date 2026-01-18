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

## 🧬 核心本質與生存

<ClientOnly>
  <div 
    v-if="visualData.length >= 10 && dimensionResult" 
    :key="topArchetypes.primary + '-core'" 
    class="analysis-container "
    ref="part1Ref"
  >
    <KeyDimensionsCard 
        :result="dimensionResult" 
    />
    <HybridSoulCard 
        :primaryRole="topArchetypes.primary"
        :secondary-role="topArchetypes.secondary" 
    />
    <ArchetypeCompositionCard 
        :selectedKeywords="visualData" 
        :primary-role="topArchetypes.primary"
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

## 💰 財富戰略矩陣

<ClientOnly>
  <div 
    v-if="visualData.length >= 10" 
    :key="topArchetypes.primary + '-wealth'" 
    class="analysis-container "
    ref="part2Ref"
  >
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
    <AntiScamCard 
        :primaryRole="topArchetypes.primary"
        :secondary-role="topArchetypes.secondary"
    />
    <FinalIdentityCard 
        :primaryRole="topArchetypes.primary" 
        :isGenerating="isGeneratingImage"
        @download="handleDualScreenshot"
    />
  </div>

  <div v-else class="placeholder-box">
      <el-skeleton :rows="3" animated />
      <div class="skeleton-text">請回到上方勾選至少 10 個關鍵字...</div>
  </div>
</ClientOnly>

## 🏢 創業與組織架構

性格標籤能解釋你的行為動機，但無法保證團隊的存活率。在真實的創業戰場上，你需要一套超越性格的 「物理法則」。我們提出的 《熵腦動力學》 將微型團隊（1-5人）視為一座正在演化的 「熱力學反應爐」：你需要在初期（1-3人）尋找 高動能 (High H) 的夥伴來對抗市場摩擦，並在擴張期（4-5人）引入 冷卻機制 (Heat Sink) 以防止系統過熱崩潰。無論你是獵人還是工匠，請停止單憑「感覺」找人，改以 能量、資訊與邊界 作為組隊標準。

<a href="./entropy/one-to-five.html" target="_blank">點擊閱讀完整報告。</a>  

## 📚 熵腦模型的進階策略

作者留：還在做，未來會每個頁面都為每個類型量身打造互動體驗。
會有典範、人類學故事、從0到超越的學習步驟(純理論)、推薦的學習資源。

| 角色符號與名稱 | 核心代碼 (Code) | 內在驅動力             | 完整策略連結                                                        |
| :------------- | :-------------- | :--------------------- | :------------------------------------------------------------------ |
| **🏹 獵人** | IRH             | **個體 - 現證 - 熱動** | <a href="./entropy/hunter.html" target="_blank">查看進階策略</a>    |
| **🧭 先驅** | IVH             | **個體 - 內觀 - 熱動** | <a href="./entropy/pioneer.html" target="_blank">查看進階策略</a>   |
| **🍇 採集者** | ORH             | **他人 - 現證 - 熱動** | <a href="./entropy/gatherer.html" target="_blank">查看進階策略</a>  |
| **🦋 薩滿** | OVH             | **他人 - 內觀 - 熱動** | <a href="./entropy/shaman.html" target="_blank">查看進階策略</a>    |
| **🛠 工匠** | IRC             | **個體 - 現證 - 冷控** | <a href="./entropy/toolmaker.html" target="_blank">查看進階策略</a> |
| **🛡️ 哨兵** | IVC             | **個體 - 內觀 - 冷控** | <a href="./entropy/sentry.html" target="_blank">查看進階策略</a>    |
| **🫂 助人者** | ORC             | **他人 - 現證 - 冷控** | <a href="./entropy/helper.html" target="_blank">查看進階策略</a>    |
| **🌳 長老** | OVC             | **他人 - 內觀 - 冷控** | <a href="./entropy/elder.html" target="_blank">查看進階策略</a>     |


<script setup lang="ts">
import { ref, nextTick } from 'vue'

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

// --- 引入維度資料定義檔 ---
import { data as dimensionConfigData } from './components/entropy/keyDimensionsCard/keyDimensionCard.data.js'

// --- 資料狀態管理 ---
interface IKeyword {
    "id": number,  
    "keyword_zh": string, 
    "keyword_en": string, 
    "archetype": string, 
    "vector": { x: number, y: number, z: number }
}

interface Vector3 { x: number; y: number; z: number; }

interface KeywordItem { id: number; keyword_zh: string; archetype: string; vector: Vector3; }

export interface AnalysisResult {
    keywords: KeywordItem[];
    dimension: Vector3 | null;
    archetypes: { primary: string; secondary: string | undefined; };
}

const visualData = ref<IKeyword[]>([]) 
const dimensionScores = ref<any>(null)
// 儲存計算後的維度說明書資料
const dimensionResult = ref<any>(null)

const topArchetypes = ref<{ primary: string; secondary: string | undefined }>({
    primary: '',
    secondary: undefined
});

// --- 新增：角色向量定義 (用於加權排序) ---
// 1 = 正向 (I, R, H), -1 = 負向 (O, V, C)
const ARCHETYPE_DEFINITIONS: Record<string, { x: number, y: number, z: number }> = {
    'Hunter':    { x: 1,  y: 1,  z: 1 },  // IRH
    'Pioneer':   { x: 1,  y: -1, z: 1 },  // IVH
    'Gatherer':  { x: -1, y: 1,  z: 1 },  // ORH
    'Shaman':    { x: -1, y: -1, z: 1 },  // OVH
    'Toolmaker': { x: 1,  y: 1,  z: -1 }, // IRC
    'Sentry':    { x: 1,  y: -1, z: -1 }, // IVC
    'Helper':    { x: -1, y: 1,  z: -1 }, // ORC
    'Elder':     { x: -1, y: -1, z: -1 }  // OVC
};

// --- 新增：重新計算角色排名的邏輯 (權重共振) ---
function recalculateArchetypes(keywords: any[], vector: { x: number, y: number, z: number }) {
    if (!vector) return { primary: '', secondary: undefined };

    // 1. 統計每個角色的關鍵字數量
    const counts: Record<string, number> = {};
    keywords.forEach(k => {
        if (k.archetype) {
            counts[k.archetype] = (counts[k.archetype] || 0) + 1;
        }
    });

    // 2. 進行排序 
    // 公式：總分 = (關鍵字數 * 1000) + 共振分數
    // 這樣可以確保關鍵字數是第一優先級，而共振分數處理同票數(或極接近)的排序
    const sortedRoles = Object.keys(counts).sort((roleA, roleB) => {
        const scoreA = (counts[roleA] * 1000) + getResonanceScore(roleA, vector);
        const scoreB = (counts[roleB] * 1000) + getResonanceScore(roleB, vector);
        return scoreB - scoreA; // 降序排列
    });

    return {
        primary: sortedRoles[0] || '',
        secondary: sortedRoles[1] // 可能為 undefined
    };
}

// 輔助函式：計算單一角色與使用者向量的共振程度
function getResonanceScore(role: string, userVector: { x: number, y: number, z: number }): number {
    const def = ARCHETYPE_DEFINITIONS[role];
    if (!def) return 0;

    let score = 0;

    // X 軸共振 (同向才加分)
    if ((def.x > 0 && userVector.x > 0) || (def.x < 0 && userVector.x < 0)) {
        score += Math.abs(userVector.x);
    }
    
    // Y 軸共振
    if ((def.y > 0 && userVector.y > 0) || (def.y < 0 && userVector.y < 0)) {
        score += Math.abs(userVector.y);
    }

    // Z 軸共振
    if ((def.z > 0 && userVector.z > 0) || (def.z < 0 && userVector.z < 0)) {
        score += Math.abs(userVector.z);
    }

    return score;
}

// --- 維度運算邏輯 ---
function calculateDimensionManual(vector: { x: number, y: number, z: number }) {
    if (!vector) return null;
    const { x, y, z } = vector;

    // 計算總能量 (分母)
    const totalScore = Math.abs(x) + Math.abs(y) + Math.abs(z);
    
    // 如果總分為 0，回傳 null
    if (totalScore === 0) return null;

    const denominator = totalScore;
    const fixedOrderKeys = ['x', 'y', 'z'] as const;
    const dims: any[] = [];

    fixedOrderKeys.forEach(axis => {
        const value = vector[axis];
        
        // 如果偏向是 0，直接跳過
        if (value === 0) return;

        const abs = Math.abs(value);
        // @ts-ignore
        const config = dimensionConfigData[axis];

        // 判斷正負向
        const side = value > 0 ? config.pos : config.neg;

        // 計算佔比
        const percent = Math.round((abs / denominator) * 100);

        dims.push({
            axis: axis,
            metaphor: config.metaphor,
            value: value,
            percentage: percent,
            label: side.label,
            shortLabel: side.label.split(' ')[0],
            color: side.color,
            icon: side.icon,
            manual: side.manual
        });
    });

    if (dims.length === 0) return null;

    return { dims };
}

// --- 雙重截圖邏輯 ---
const part1Ref = ref<HTMLElement | null>(null);
const part2Ref = ref<HTMLElement | null>(null);
const isGeneratingImage = ref(false);

async function handleDualScreenshot() {
    if (!part1Ref.value || !part2Ref.value) {
        console.error('Capture areas not found');
        return;
    }

    isGeneratingImage.value = true;

    try {
        const html2canvas = (await import('html2canvas')).default;
        await nextTick();

        const options = {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: document.body.scrollWidth >= 1200 ? document.body.scrollWidth : 1200, 
        };

        const canvas1 = await html2canvas(part1Ref.value, options);
        downloadImage(canvas1, `熵腦報告_${topArchetypes.value.primary}_核心本質.png`);

        await new Promise(r => setTimeout(r, 300));

        const canvas2 = await html2canvas(part2Ref.value, options);
        downloadImage(canvas2, `熵腦報告_${topArchetypes.value.primary}_財富戰略.png`);

    } catch (error) {
        console.error('Screenshot failed:', error);
        alert('部分圖片生成失敗，請檢查瀏覽器設定。');
    } finally {
        isGeneratingImage.value = false;
    }
}

function downloadImage(canvas: HTMLCanvasElement, filename: string) {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    link.click();
}

// --- 處理更新 (更新核心邏輯) ---
function handleAnalysisUpdate(result: AnalysisResult) {
    visualData.value = result.keywords;
    dimensionScores.value = result.dimension;

    // 1. 維度運算
    if (result.dimension) {
        dimensionResult.value = calculateDimensionManual(result.dimension);
        
        // 2. 使用新的「權重共振」邏輯重新計算角色排名
        topArchetypes.value = recalculateArchetypes(result.keywords, result.dimension);
    } else {
        dimensionResult.value = null;
        topArchetypes.value = result.archetypes;
    }
}
</script>

<style scoped>
.result-section { padding: 20px 0; border-radius: 12px; animation: fadeIn 0.6s ease; }

.analysis-container { display: flex; flex-direction: column; gap: 30px; }
.placeholder-box { margin-top: 20px; padding: 40px; background: #f9f9f9; border-radius: 12px; border: 2px dashed #e0e0e0; text-align: center; }
.skeleton-text { margin-top: 15px; color: #909399; font-size: 0.9rem; }

/* 報告內部的標題樣式 */
.report-section-header {
    margin-top: 10px;
    margin-bottom: 20px;
    border-left: 5px solid #303133;
    padding-left: 15px;
}

.report-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    line-height: 1.2;
}

.report-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 5px 0 0 0;
    font-weight: 500;
}

.bg-white { background-color: #ffffff; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
---
outline: [2,4]
---

# 熵腦人格測驗：找出你的原廠設定與部落原型

你是否曾經因為投資決策太衝動而懊惱？或是因為在重要時刻想太多、猶豫不決而錯失良機？

傳統經濟學假設我們是「理性人」，能毫無偏見地極大化利益。然而，現實中的泡沫經濟與債務危機證明，金錢決策本質上是**心理決策**。行為金融學告訴我們，我們的大腦是一台精密的生物機器，如果一個部落全是衝動的獵人，會在飢荒中滅絕；如果全是深思熟慮的長老，會在變局中被淘汰。

這套 **熵腦模型** 將帶你解開動機 (Why)、認知 (Where) 與控制 (How) 的原廠設定。這不只是一場人格測驗，更是一次對你「財務行為」與「潛在認知偏差」的深度掃描。

## 熵腦人格測驗

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
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </el-button>
            </el-divider>
        </div>
        <div v-else class="expanded-hint">
            <el-text type="info" size="small">已顯示所有 128 個關鍵字</el-text>
        </div>
    </el-card>
    <div v-show="selectedKeywords.length >= 5" class="result-section">
        <BrainUniverseCard :selectedKeywords="selectedKeywords" />
        <div v-if="selectedKeywords.length >= 10" class="analysis-container">
            <HybridSoulCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary" />
            <KeyDimensionsCard v-if="dimensionScores" :userVector="dimensionScores" />
            <CareerStrategyCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary"></CareerStrategyCard>
            <WealthManagementCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary"></WealthManagementCard>
            <WealthLeverageCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary"></WealthLeverageCard>
            <InternalFrictionCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary">
            </InternalFrictionCard>
            <SocialCompatibilityCard :primaryRole="topArchetypes.primary" :secondary-role="topArchetypes.secondary">
            </SocialCompatibilityCard>
            <FinalIdentityCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary" />
        </div>
        <div v-else class="hint-text">
            <el-alert title="數據量不足" type="info"
                :description="`請再勾選 ${10 - selectedKeywords.length} 個關鍵字，以解鎖完整人格分析報告（包含潛意識陰影解析）。`" show-icon center
                :closable="false" />
        </div>
    </div>
</ClientOnly>



## 熵腦模型的進階策略

作者留：還在做，未來會每個頁面都為每個類型量身打造互動體驗。
會有典範、人類學故事、從0到超越的學習步驟(純理論)、推薦的學習資源。

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
import BrainUniverseCard from './components/entropy/brainUniverseCard.vue'
import HybridSoulCard from './components/entropy/hybridSoulCard/hybridSoulCard.vue'
import KeyDimensionsCard from './components/entropy/keyDimensionsCard/keyDimensionsCard.vue'
import SocialCompatibilityCard from './components/entropy/socialCompatibilityCard/socialCompatibilityCard.vue'
import ShadowAnalysisCard from './components/entropy/shadowAnalysis/shadowAnalysisCard.vue'
import InternalFrictionCard from './components/entropy/internalFrictionCard.vue'
import CareerStrategyCard from './components/entropy/careerStrategyCard/careerStrategyCard.vue'
import WealthManagementCard from './components/entropy/wealthManagement/wealthManagementCard.vue'
import WealthLeverageCard from './components/entropy/wealthLeverage/wealthLeverageCard.vue'
import FinalIdentityCard from './components/entropy/finalIdentityCard.vue'

// --- 介面定義 ---
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface KeywordItem {
    id: number;
    keyword_zh: string;
    keyword_en: string;
    archetype: string;
    vector: Vector3;
    description?: string;
}

// --- 狀態變數 ---
const shuffledKeywords = ref<KeywordItem[]>([])
const selectedKeywords = ref<KeywordItem[]>([])
const fullscreenLoading = ref<boolean>(false)
const dimensionScores = ref<Vector3 | null>(null)

// 狀態控制
const isExpanded = ref<boolean>(false)

// 計算屬性：控制顯示數量
const visibleKeywords = computed(() => {
    if (isExpanded.value) {
        return shuffledKeywords.value;
    }
    // 這裡的切分點會剛好切在我們精心安排的「前半段」與「後半段」之間
    const limit = Math.ceil(shuffledKeywords.value.length / 2);
    return shuffledKeywords.value.slice(0, limit);
})

const topArchetypes = ref<{ primary: string; secondary: string | undefined }>({
    primary: '',
    secondary: undefined
});

// --- 初始化 ---
onMounted(() => {
    initKeywords();
});

// [核心修正] 初始化函式：實作分層抽樣
function initKeywords() {
    const rawData = data.keywords || [];

    // 1. 嚴格去重 (與之前相同)
    const uniqueMap = new Map<string, KeywordItem>();
    rawData.forEach((item: any) => {
        if (item && item.keyword_zh) {
            const cleanKey = item.keyword_zh.trim();
            if (!uniqueMap.has(cleanKey)) {
                uniqueMap.set(cleanKey, { ...item, keyword_zh: cleanKey });
            }
        }
    });
    const uniqueData = Array.from(uniqueMap.values());

    // 2. [新增] 依角色分組 (Stratification)
    const groups: Record<string, KeywordItem[]> = {};
    uniqueData.forEach(item => {
        if (!groups[item.archetype]) {
            groups[item.archetype] = [];
        }
        groups[item.archetype].push(item);
    });

    // 3. [新增] 建構平衡的兩個池子
    let visiblePool: KeywordItem[] = [];
    let hiddenPool: KeywordItem[] = [];

    // 遍歷每個角色組 (例如：Hunter, Shaman...)
    Object.keys(groups).forEach(key => {
        // 先將該角色的關鍵字內部洗牌，避免每次都是固定的詞排前面
        const groupItems = shuffle(groups[key]);

        // 計算切分點 (無條件進位，確保顯示區至少有一半)
        const mid = Math.ceil(groupItems.length / 2);

        // 前半段丟入顯示池，後半段丟入隱藏池
        visiblePool = visiblePool.concat(groupItems.slice(0, mid));
        hiddenPool = hiddenPool.concat(groupItems.slice(mid));
    });

    // 4. [新增] 分別對兩個池子進行最終洗牌，並合併
    // 這樣確保用戶在前 64 個選項中，看到的是隨機排序但角色數量平衡的結果
    const finalSequence = [...shuffle(visiblePool), ...shuffle(hiddenPool)];

    // 5. 重新分配 ID (與之前相同)
    shuffledKeywords.value = finalSequence.map((item, index) => ({
        ...item,
        id: index
    }));
}

// --- 核心計算邏輯 (保持不變) ---
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

    dimensionScores.value = {
        x: totalVec.x / count,
        y: totalVec.y / count,
        z: totalVec.z / count
    };

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

// 通用洗牌函式 (保持純粹的隨機功能)
function shuffle<T>(sourceArray: T[]): T[] {
    const array = Array.from(sourceArray);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
</script>

<style scoped lang="scss">
.quiz-card {
    margin-bottom: 20px;
    transition: all 0.3s ease;
    /* 讓高度變化平滑一點 */
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    color: #303133;
}

.keyword-container {
    justify-content: center;
    margin-bottom: 10px;
}

/* [新增] 展開區塊樣式：增加一點間距 */
.expand-section {
    margin-top: 15px;
    margin-bottom: 5px;
}

/* [新增] 已展開後的底部微調 */
.expanded-hint {
    text-align: center;
    margin-top: 10px;
    opacity: 0.6;
}

/* 結果區背景，讓卡片浮起來 */
.result-section {
    padding: 20px 0;
    /* 移除左右 padding，讓手機版卡片滿版 */
    border-radius: 12px;
    animation: fadeIn 0.6s ease;
}

/* 提示文字區 */
.hint-text {
    margin-top: 30px;
    opacity: 0.9;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
<template>
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

            <HybridSoulCard :selectedKeywords="selectedKeywords" />

            <KeyDimensionsCard v-if="dimensionScores" :userVector="dimensionScores" />

            <FinalIdentityCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :userVector="dimensionScores" />

            <InternalFrictionCard v-if="dimensionScores && topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondary-role="topArchetypes.secondary">
            </InternalFrictionCard>

        </div>

        <div v-else class="hint-text">
            <el-alert title="數據量不足" type="info"
                :description="`請再勾選 ${10 - selectedKeywords.length} 個關鍵字，以解鎖完整人格分析報告（包含潛意識陰影解析）。`" show-icon center
                :closable="false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { data } from './keywords.data.js'

// 引入四個子元件
import BrainUniverseCard from './brainUniverseCard.vue'
import HybridSoulCard from './hybridSoulCard.vue'
import KeyDimensionsCard from './keyDimensionsCard.vue'
// import ShadowAnalysisCard from './shadowAnalysisCard.vue'
import FinalIdentityCard from './finalIdentityCard.vue'
import InternalFrictionCard from './internalFrictionCard.vue'

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
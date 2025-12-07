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
                <el-checkbox v-for="item in shuffledKeywords" :key="item.id" :label="item.keyword_zh" :value="item"
                    border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>
    </el-card>

    <div v-show="selectedKeywords.length >= 5" class="result-section">

        <BrainUniverseCard :selectedKeywords="selectedKeywords" />

        <div v-if="selectedKeywords.length >= 10" class="analysis-container">

            <HybridSoulCard :selectedKeywords="selectedKeywords" />

            <KeyDimensionsCard v-if="dimensionScores" :userVector="dimensionScores" />

            <ShadowAnalysisCard v-if="topArchetypes.primary" :primaryRole="topArchetypes.primary"
                :secondaryRole="topArchetypes.secondary" />

        </div>

        <div v-else class="hint-text">
            <el-alert title="數據量不足" type="info"
                :description="`請再勾選 ${10 - selectedKeywords.length} 個關鍵字，以解鎖完整人格分析報告（包含潛意識陰影解析）。`" show-icon center
                :closable="false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { data } from './keywords.data.js'

// 引入四個子元件
import BrainUniverseCard from './brainUniverseCard.vue'
import HybridSoulCard from './hybridSoulCard.vue'
import KeyDimensionsCard from './keyDimensionsCard.vue'
import ShadowAnalysisCard from './shadowAnalysisCard.vue'

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
    description: string;
}

// --- 狀態變數 ---
const shuffledKeywords = ref<KeywordItem[]>([])
const selectedKeywords = ref<KeywordItem[]>([])
const fullscreenLoading = ref<boolean>(false)
const dimensionScores = ref<Vector3 | null>(null)

// 新增狀態：儲存前兩名角色
const topArchetypes = ref<{ primary: string; secondary: string | undefined }>({
    primary: '',
    secondary: undefined
});

// --- 初始化 ---
onMounted(() => {
    shuffledKeywords.value = shuffle([...data.keywords]);
});

// --- 核心計算邏輯 ---
function calculateResults() {
    if (selectedKeywords.value.length === 0) {
        dimensionScores.value = null;
        topArchetypes.value = { primary: '', secondary: undefined };
        return;
    }

    // 1. 計算維度向量平均值 (給 KeyDimensionsCard)
    let totalVec = { x: 0, y: 0, z: 0 };
    // 2. 計算角色出現次數 (給 ShadowAnalysisCard)
    const counts: Record<string, number> = {};

    selectedKeywords.value.forEach(kw => {
        // 向量累加
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;

        // 計數累加
        counts[kw.archetype] = (counts[kw.archetype] || 0) + 1;
    });

    const count = selectedKeywords.value.length;

    // 設定維度分數
    dimensionScores.value = {
        x: totalVec.x / count,
        y: totalVec.y / count,
        z: totalVec.z / count
    };

    // 3. 排序找出前兩名 (Sort Logic)
    // 轉為陣列: [['Hunter', 5], ['Shaman', 3], ...]
    const sortedRoles = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    const primary = sortedRoles[0] ? sortedRoles[0][0] : '';
    // 如果有第二名，且票數 > 0，則設為次顯，否則 undefined
    const secondary = (sortedRoles[1] && sortedRoles[1][1] > 0) ? sortedRoles[1][0] : undefined;

    topArchetypes.value = { primary, secondary };
}

function resetTest() {
    selectedKeywords.value = [];
    dimensionScores.value = null;
    topArchetypes.value = { primary: '', secondary: undefined };
    shuffledKeywords.value = shuffle(shuffledKeywords.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fisher-Yates Shuffle
function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
</script>

<style scoped lang="scss">
.quiz-card {
    margin-bottom: 20px;
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
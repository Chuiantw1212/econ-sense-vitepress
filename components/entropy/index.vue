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
            <el-checkbox-group v-model="selectedKeywords" @change="calculateDimensionScores">
                <el-checkbox v-for="item in shuffledKeywords" :key="item.id" :label="item.keyword_zh" :value="item"
                    border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>
    </el-card>

    <BrainUniverseCard :selectedKeywords="selectedKeywords" />

    <div v-if="selectedKeywords.length >= 10" class="analysis-container">
        <HybridSoulCard :selectedKeywords="selectedKeywords" />
        <KeyDimensionsCard v-if="dimensionScores" :userVector="dimensionScores" />
    </div>
    <div v-else class="hint-text">
        <el-alert title="數據量不足" type="info" :description="`請再勾選 ${10 - selectedKeywords.length} 個關鍵字，以解鎖完整人格分析報告。`"
            show-icon center :closable="false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { data } from './keywords.data.js'

// 引入三個子元件
import BrainUniverseCard from './brainUniverseCard.vue'
import HybridSoulCard from './hybridSoulCard.vue'
import KeyDimensionsCard from './keyDimensionsCard.vue'

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
const dimensionScores = ref<Vector3 | null>(null) // 計算出的使用者重心向量

// --- 初始化 ---
onMounted(() => {
    shuffledKeywords.value = shuffle([...data.keywords]);
});

// --- 核心計算：算出平均向量 (給 KeyDimensionsCard 用) ---
function calculateDimensionScores() {
    if (selectedKeywords.value.length === 0) {
        dimensionScores.value = null;
        return;
    }

    let totalVec = { x: 0, y: 0, z: 0 };
    selectedKeywords.value.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
    });

    const count = selectedKeywords.value.length;

    // 計算平均值 (-1 ~ 1)
    dimensionScores.value = {
        x: totalVec.x / count,
        y: totalVec.y / count,
        z: totalVec.z / count
    };
}

function resetTest() {
    selectedKeywords.value = [];
    dimensionScores.value = null;
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

.result-section {
    padding: 20px;
    background: #f8f9fa;
    /* 淺灰背景區隔結果區 */
    border-radius: 12px;
    animation: fadeIn 0.6s ease;
}

.section-block {
    margin-bottom: 40px;
}

.divider-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #606266;
    letter-spacing: 1px;
}

.hint-text {
    margin-top: 30px;
    opacity: 0.8;
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
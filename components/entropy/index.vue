<template>
    <el-card v-loading="fullscreenLoading">
        <template #header>
            <div class="card-header">
                <div class="header-content">
                    <span>請憑直覺勾選 10~20 個關鍵字</span>
                    <el-tag effect="dark" round>{{ selectedKeywords.length }} / 20</el-tag>
                </div>
                <el-button @click="resetTest" size="small">重置</el-button>
            </div>
        </template>

        <el-row class="keyword-container">
            <el-checkbox-group v-model="selectedKeywords">
                <el-checkbox v-for="item in shuffledKeywords" :key="item.id" :label="item.keyword_zh" :value="item"
                    border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>
    </el-card>

    <div v-show="selectedKeywords.length >= 10" class="result-section">
        <BrainUniverseCard :selectedKeywords="selectedKeywords" />

        <div v-if="selectedKeywords.length >= 10" class="analysis-container">

            <HybridSoulCard :selectedKeywords="selectedKeywords" />

            <div class="dimension-analysis">
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, } from 'vue' // 加上 markRaw
import Chart from 'chart.js/auto';
import { data } from './keywords.data.js'
import HybridSoulCard from './hybridSoulCard.vue'; // 引入元件
import BrainUniverseCard from './brainUniverseCard.vue'

interface Vector3 {
    x: number; // Drive: -1(O) ~ 1(T)
    y: number; // Entropy: -1(L) ~ 1(H)
    z: number; // Topology: -1(TD) ~ 1(BU)
}

// 定義混合人格的結果介面
interface HybridResult {
    primary: any;   // 主顯角色 (距離最近)
    secondary: any; // 次顯角色 (距離第二近)
    ratio: string;  // 混合比例 (例如 "60% : 40%")
}

interface KeywordItem {
    id: number;
    keyword_zh: string;
    keyword_en: string;
    archetype: string;
    vector: Vector3;
    description: string;
}

const shuffledKeywords = ref<KeywordItem[]>([])
const selectedKeywords = ref<KeywordItem[]>([]) // 注意這裡存的是物件，不是字串
const fullscreenLoading = ref<boolean>(false)
const dimensionScores = ref<Vector3 | null>(null)
const radarInstance = shallowRef<Chart | null>(null)

onMounted(() => {
    shuffledKeywords.value = shuffle(data.keywords);
});

function resetTest() {
    selectedKeywords.value = [];
    dimensionScores.value = null;
    if (radarInstance.value) {
        radarInstance.value.destroy();
        radarInstance.value = undefined;
    }
    shuffledKeywords.value = shuffle(shuffledKeywords.value);
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
.card-header {
    display: flex;
    justify-content: space-between;
}

.keyword-container {
    justify-content: center;
    margin-bottom: 20px;
}

.result-section {
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
}
</style>
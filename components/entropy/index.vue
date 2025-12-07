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
            <el-checkbox-group v-model="selectedKeywords" @change="calculateResults">
                <el-checkbox v-for="item in shuffledKeywords" :key="item.id" :label="item.keyword_zh" :value="item"
                    border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>

        <br />

        <div v-show="selectedKeywords.length >= 5" class="result-section">

            <el-divider content-position="center">你的大腦神經宇宙座標</el-divider>

            <div id="brain3D" style="width: 100%; height: 500px;"></div>

            <div v-if="selectedKeywords.length >= 10 && dimensionScores" class="analysis-container">

                <div class="dimension-analysis">
                    <el-descriptions title="神經動力分析" direction="vertical" :column="3" border>
                        <el-descriptions-item label="驅動力 (Drive)">
                            <el-tag :type="dimensionScores.x > 0 ? 'danger' : 'success'" effect="dark">
                                {{ dimensionScores.x > 0 ? '個體 (T)' : '群體 (O)' }}
                            </el-tag>
                            <div class="desc-text">{{ dimensionScores.x > 0 ? '競爭/成就' : '連結/共情' }}</div>
                        </el-descriptions-item>

                        <el-descriptions-item label="熵狀態 (Entropy)">
                            <el-tag :type="dimensionScores.y > 0 ? 'warning' : 'info'" effect="dark">
                                {{ dimensionScores.y > 0 ? '熱系統 (H)' : '冷系統 (L)' }}
                            </el-tag>
                            <div class="desc-text">{{ dimensionScores.y > 0 ? '發散/創造' : '收斂/秩序' }}</div>
                        </el-descriptions-item>

                        <el-descriptions-item label="資訊拓撲 (Topology)">
                            <el-tag :type="dimensionScores.z > 0 ? 'primary' : 'info'" effect="dark">
                                {{ dimensionScores.z > 0 ? '實證 (BU)' : '內觀 (TD)' }}
                            </el-tag>
                            <div class="desc-text">{{ dimensionScores.z > 0 ? '感知/外求' : '預測/內求' }}</div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>

            <div v-else class="warning-text">
                <p>🔵 目前數據量較少，請再勾選 <strong>{{ 10 - selectedKeywords.length }}</strong> 個關鍵字以解鎖完整分析...</p>
            </div>

        </div>

        <template #footer>
            <el-collapse>
                <el-collapse-item title="測驗說明">
                    <ul>
                        <li>本測驗基於「熵腦假說 (Entropic Brain Hypothesis)」與「自由能原則」。</li>
                        <li>透過分析你的選擇，模擬大腦在處理資訊與能量時的偏好路徑。</li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, } from 'vue' // 加上 markRaw
import Chart from 'chart.js/auto';
import { data } from '../keywords.data.js'

// --- 1. 定義資料介面 ---
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

interface ArchetypeDef {
    key: string;
    name: string;
    vector: Vector3; // 該角色的標準向量中心
    desc: string;
}

// --- 2. 狀態變數 ---
const shuffledKeywords = ref<KeywordItem[]>([])
const selectedKeywords = ref<KeywordItem[]>([]) // 注意這裡存的是物件，不是字串
const fullscreenLoading = ref<boolean>(false)
const dimensionScores = ref<Vector3 | null>(null)
const hybridAnalysis = ref<HybridResult | null>(null);
const radarInstance = shallowRef<Chart | null>(null)

// --- 8 大角色座標 (恆星) ---
// 為了視覺效果，我們把座標放大一點 (例如 +/- 10)
const archetypeStars = [
    { name: '獵人', x: 10, y: 10, z: 10, color: '#FF4500', symbol: 'diamond' },     // T-H-BU
    { name: '先驅', x: 10, y: 10, z: -10, color: '#FF8C00', symbol: 'diamond' },  // T-H-TD
    { name: '工匠', x: 10, y: -10, z: 10, color: '#1E90FF', symbol: 'square' },     // T-L-BU
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B', symbol: 'square' },    // T-L-TD
    { name: '薩滿', x: -10, y: 10, z: 10, color: '#9370DB', symbol: 'circle' },     // O-H-BU
    { name: '採集者', x: -10, y: 10, z: -10, color: '#FF69B4', symbol: 'circle' },    // O-H-TD
    { name: '助人者', x: -10, y: -10, z: 10, color: '#32CD32', symbol: 'cross' },   // O-L-BU
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57', symbol: 'cross' },    // O-L-TD
];

// --- 4. 初始化 ---
onMounted(() => {
    shuffledKeywords.value = shuffle(data.keywords);
});

function calculateResults() {
    if (selectedKeywords.value.length < 10) return;

    // ... (原本的向量計算代碼) ...

    let totalVec = { x: 0, y: 0, z: 0 };
    selectedKeywords.value.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
    });
    const count = selectedKeywords.value.length;
    const scale = 10;

    const userX = (totalVec.x / count) * scale;
    const userY = (totalVec.y / count) * scale;
    const userZ = (totalVec.z / count) * scale;

    // 設定 3D 座標
    dimensionScores.value = { x: userX, y: userY, z: userZ };

    // 1. 繪製 3D 圖
    draw3DChart(userX, userY, userZ);

    // 2. 【新增】計算雙重混合人格
    calculateHybridArchetypes({ x: userX, y: userY, z: userZ });
}

function calculateHybridArchetypes(userVec: { x: number, y: number, z: number }) {
    // 1. 計算使用者與 8 大恆星的距離
    const distances = archetypeStars.map(star => {
        // 歐幾里得距離公式：√((x1-x2)² + (y1-y2)² + (z1-z2)²)
        const dist = Math.sqrt(
            Math.pow(userVec.x - star.x, 2) +
            Math.pow(userVec.y - star.y, 2) +
            Math.pow(userVec.z - star.z, 2)
        );
        return { ...star, distance: dist };
    });

    // 2. 依照距離由近到遠排序 (距離越小代表越像)
    distances.sort((a, b) => a.distance - b.distance);

    // 3. 取出前兩名
    const primary = distances[0];
    const secondary = distances[1];

    // 4. 計算混合權重 (距離越近權重越高)
    // 使用反距離加權法 (Inverse Distance Weighting) 的簡化版
    // 避免除以零 (雖然不太可能完全重疊)
    const w1 = 1 / (primary.distance + 0.1);
    const w2 = 1 / (secondary.distance + 0.1);
    const totalW = w1 + w2;

    const p1Percent = Math.round((w1 / totalW) * 100);
    const p2Percent = 100 - p1Percent;

    // 5. 更新結果
    hybridAnalysis.value = {
        primary: primary,
        secondary: secondary,
        ratio: `${p1Percent}% : ${p2Percent}%`
    };
}

// --- Plotly 3D 繪圖函數 (無連線版) ---
async function draw3DChart(ux: number, uy: number, uz: number) {
    const chartDiv = document.getElementById('brain3D');
    if (!chartDiv) return;

    // 1. 原型恆星 (8大角色定點)
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text',
        type: 'scatter3d',
        name: '原型恆星',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        textfont: { size: 11, color: '#888' },
        marker: {
            size: 5,
            color: archetypeStars.map(a => a.color),
            opacity: 0.7,
            symbol: 'circle'
        },
        hoverinfo: 'text'
    };

    // 2. 關鍵字星塵 (使用者選的詞)
    const keywordPoints = selectedKeywords.value.map(kw => ({
        x: kw.vector.x * 10,
        y: kw.vector.y * 10,
        z: kw.vector.z * 10,
        text: kw.keyword_zh,
        // 這裡可以依據關鍵字的 archetype 給予對應顏色，或者統一色
        // color: archetypeStars.find(a => a.name.includes(kw.archetype))?.color || '#409EFF' 
    }));

    const keywordsTrace = {
        x: keywordPoints.map(p => p.x),
        y: keywordPoints.map(p => p.y),
        z: keywordPoints.map(p => p.z),
        mode: 'markers', // 只顯示點，滑鼠移上去才顯示文字 (避免畫面太亂)
        type: 'scatter3d',
        name: '你的選擇',
        text: keywordPoints.map(p => p.text),
        marker: {
            size: 4,
            color: '#409EFF', // 統一用藍色，或者可以用上面的邏輯變色
            opacity: 0.8,
            line: { color: 'white', width: 0.5 }
        },
        hoverinfo: 'text'
    };

    // 3. 使用者飛船 (重心位置)
    const userTrace = {
        x: [ux],
        y: [uy],
        z: [uz],
        mode: 'markers+text',
        type: 'scatter3d',
        name: '你的重心',
        text: ['YOU'],
        textposition: 'bottom center',
        textfont: { size: 14, color: '#000', family: 'Arial Black' },
        marker: {
            size: 12,
            color: '#FFD700',
            line: { color: '#FFF', width: 2 },
            symbol: 'diamond'
        },
        hoverinfo: 'text'
    };

    // 4. 佈局設定
    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力 (Drive)', range: [-12, 12] },
            yaxis: { title: '熵狀態 (Entropy)', range: [-12, 12] },
            zaxis: { title: '拓撲向 (Topology)', range: [-12, 12] },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
            aspectmode: 'cube'
        },
        showlegend: true,
        legend: { x: 0, y: 1 } // 圖例放在左上角
    };

    // 繪製！只保留：原型星、關鍵字星塵、使用者重心
    const Plotly = await import('plotly.js-dist-min')
    Plotly.newPlot('brain3D', [
        archetypesTrace,
        keywordsTrace,
        userTrace
    ], layout, { responsive: true, displayModeBar: false });
}

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
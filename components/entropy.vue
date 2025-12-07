<template>
    <el-card v-loading="fullscreenLoading">
        <template #header>
            <div class="card-header">
                <span>請憑直覺勾選 10~20 個最能引起你共鳴的關鍵字 (已選 {{ selectedKeywords.length }} 個)</span>
                <el-button @click="resetTest">重做測驗</el-button>
            </div>
        </template>

        <el-row class="keyword-container">
            <el-checkbox-group v-model="selectedKeywords" @change="calculateResults">
                <el-checkbox v-for="(item, index) in shuffledKeywords" :key="index" :label="item.keyword_zh"
                    :value="item" style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>

        <br />

        <div v-show="selectedKeywords.length >= 10" class="result-section">
            <div class="dimension-analysis" v-if="dimensionScores">
                <el-descriptions title="神經動力分析" direction="vertical" :column="3" border>
                    <el-descriptions-item label="驅動力 (Drive)">
                        <el-tag :type="dimensionScores.x > 0 ? 'danger' : 'success'">
                            {{ dimensionScores.x > 0 ? '個體' : '群體' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="熵狀態 (Entropy)">
                        <el-tag :type="dimensionScores.y > 0 ? 'warning' : 'info'">
                            {{ dimensionScores.y > 0 ? '熱系統' : '冷系統' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="資訊拓撲 (Topology)">
                        <el-tag :type="dimensionScores.z > 0 ? 'primary' : 'info'">
                            {{ dimensionScores.z > 0 ? '實證' : '內觀' }}
                        </el-tag>
                    </el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="result-section" v-show="selectedKeywords.length >= 5">
                <el-divider content-position="center">你的大腦神經宇宙座標</el-divider>

                <div id="brain3D" style="width: 100%; height: 500px;"></div>

            </div>

            <!-- <div class="buttonGroup" style="margin-top: 20px; text-align: center;">
                <el-button type="primary" size="large" @click="shareRadar">
                    分享我的原野角色圖
                </el-button>
            </div> -->
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
import { data } from './keywords.data.js'

// --- 1. 定義資料介面 ---
interface Vector3 {
    x: number; // Drive: -1(O) ~ 1(T)
    y: number; // Entropy: -1(L) ~ 1(H)
    z: number; // Topology: -1(TD) ~ 1(BU)
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
    if (selectedKeywords.value.length < 10) {
        return;
    }

    // 1. 計算使用者向量 (平均值 -1 ~ 1)
    let totalVec = { x: 0, y: 0, z: 0 };
    selectedKeywords.value.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
    });
    const count = selectedKeywords.value.length;

    // 放大倍率 (跟角色座標匹配，設為 10)
    const scale = 10;
    const userX = (totalVec.x / count) * scale;
    const userY = (totalVec.y / count) * scale;
    const userZ = (totalVec.z / count) * scale;

    dimensionScores.value = { x: userX, y: userY, z: userZ };

    // 繪製 3D 圖
    draw3DChart(userX, userY, userZ);
}

// --- 修改後的 3D 繪圖函數 ---
async function draw3DChart(ux: number, uy: number, uz: number) {
    const chartDiv = document.getElementById('brain3D');
    if (!chartDiv) return;

    // 1.【恆星】8 大角色原型 (不變)
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text', // 顯示點與文字
        type: 'scatter3d',
        name: '原型恆星',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        textfont: { size: 12, color: '#666' },
        marker: {
            size: 6, // 稍微縮小一點，讓畫面不擁擠
            color: archetypeStars.map(a => a.color),
            opacity: 0.8,
            symbol: 'circle' // 統一用圓形比較好看
        },
        hoverinfo: 'text'
    };

    // 2.【新增】使用者選取的關鍵字點 (星塵)
    // 將選中的關鍵字座標放大到圖表尺度 (x10)
    const scale = 10;
    const keywordPoints = selectedKeywords.value.map(kw => ({
        x: kw.vector.x * scale,
        y: kw.vector.y * scale,
        z: kw.vector.z * scale,
        text: kw.keyword_zh,
        // 根據所在象限決定顏色，或者統一用一種微光色
        color: 'rgba(100, 200, 255, 0.6)'
    }));

    const keywordsTrace = {
        x: keywordPoints.map(p => p.x),
        y: keywordPoints.map(p => p.y),
        z: keywordPoints.map(p => p.z),
        mode: 'markers+text', // 同時顯示點和文字
        type: 'scatter3d',
        name: '你的選擇',
        text: keywordPoints.map(p => p.text), // 顯示關鍵字名稱
        textposition: 'middle center',
        textfont: { size: 10, color: '#333' }, // 字體稍微小一點
        marker: {
            size: 4, // 比恆星小
            color: '#409EFF', // Element Plus Primary Blue
            opacity: 0.8,
            line: { color: 'white', width: 0.5 } // 加個白邊增加識別度
        },
        hoverinfo: 'text' // 滑鼠移上去只顯示文字
    };

    // 3.【飛船】使用者重心 (不變，但在視覺上強調)
    const userTrace = {
        x: [ux], y: [uy], z: [uz],
        mode: 'markers',
        type: 'scatter3d',
        name: '你的重心',
        text: ['YOU'],
        marker: {
            size: 15, // 最大顆
            color: '#FFD700', // 金色
            line: { color: '#FFF', width: 2 },
            opacity: 1
        },
        hoverinfo: 'text'
    };

    // 6. 佈局設定
    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力', range: [-12, 12] },
            yaxis: { title: '熵狀態', range: [-12, 12] },
            zaxis: { title: '拓撲向', range: [-12, 12] },
            camera: { eye: { x: 1.6, y: 1.6, z: 1.6 } }, // 稍微拉遠一點
            aspectmode: 'cube' // 強制立方體比例
        },
        showlegend: true,
        legend: { x: 0, y: 1 }
    };

    // 繪製！包含：原型星、關鍵字星塵、星座連線、使用者重心、中心連線
    const Plotly = await import('plotly.js-dist-min')
    Plotly.newPlot('brain3D', [
        archetypesTrace,
        keywordsTrace,
        // starConstellationTrace,
        userTrace,
        // lineTrace
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
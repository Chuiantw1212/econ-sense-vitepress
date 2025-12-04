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
                            {{ dimensionScores.x > 0 ? '競爭 (T)' : '連結 (O)' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="熵狀態 (Entropy)">
                        <el-tag :type="dimensionScores.y > 0 ? 'warning' : 'info'">
                            {{ dimensionScores.y > 0 ? '高熵 (發散)' : '低熵 (穩定)' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="資訊拓撲 (Topology)">
                        <el-tag :type="dimensionScores.z > 0 ? 'primary' : 'info'">
                            {{ dimensionScores.z > 0 ? '感知 (外求)' : '預測 (內求)' }}
                        </el-tag>
                    </el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="result-section" v-show="selectedKeywords.length >= 5">
                <el-divider content-position="center">你的大腦神經宇宙座標</el-divider>

                <div id="brain3D" style="width: 100%; height: 500px;"></div>

            </div>

            <div class="buttonGroup" style="margin-top: 20px; text-align: center;">
                <el-button type="primary" size="large" @click="shareRadar">
                    分享我的原野角色圖
                </el-button>
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
import { ref, shallowRef, onMounted, markRaw, nextTick } from 'vue' // 加上 markRaw
import Chart from 'chart.js/auto';
// 引入 Plotly (建議用 CDN 或動態引入以節省打包體積)
import Plotly from 'plotly.js-dist-min'
import { ElMessage } from 'element-plus'

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
    { name: '尋路人', x: 10, y: 10, z: -10, color: '#FF8C00', symbol: 'diamond' },  // T-H-TD
    { name: '工匠', x: 10, y: -10, z: 10, color: '#1E90FF', symbol: 'square' },     // T-L-BU
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B', symbol: 'square' },    // T-L-TD
    { name: '薩滿', x: -10, y: 10, z: 10, color: '#9370DB', symbol: 'circle' },     // O-H-BU
    { name: '信使', x: -10, y: 10, z: -10, color: '#FF69B4', symbol: 'circle' },    // O-H-TD
    { name: '助人者', x: -10, y: -10, z: 10, color: '#32CD32', symbol: 'cross' },   // O-L-BU
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57', symbol: 'cross' },    // O-L-TD
];

// --- 4. 初始化 ---
onMounted(async () => {
    const rawKeywords = await getKeywordsData()
    shuffledKeywords.value = shuffle(rawKeywords);
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

function draw3DChart(ux: number, uy: number, uz: number) {
    const chartDiv = document.getElementById('brain3D');
    if (!chartDiv) return;

    // 1. 角色數據集 (8個定點)
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text',
        type: 'scatter3d',
        name: '原型角色',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        marker: {
            size: 8,
            color: archetypeStars.map(a => a.color),
            opacity: 0.8
        }
    };

    // 2. 使用者數據集 (1個動點)
    const userTrace = {
        x: [ux],
        y: [uy],
        z: [uz],
        mode: 'markers+text',
        type: 'scatter3d',
        name: '你的位置',
        text: ['YOU'],
        textposition: 'bottom center',
        marker: {
            size: 15,
            color: '#FFD700', // 金色
            symbol: 'circle',
            line: { color: '#000', width: 2 }
        }
    };

    // 4. 佈局設定
    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力 (競爭 vs 連結)', range: [-12, 12] },
            yaxis: { title: '熵狀態 (發散 vs 收斂)', range: [-12, 12] },
            zaxis: { title: '拓撲向 (感知 vs 預測)', range: [-12, 12] },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.5 } // 視角
            }
        },
        showlegend: true,
        legend: { x: 0, y: 1 }
    };

    Plotly.newPlot('brain3D', [archetypesTrace, userTrace,], layout, { responsive: true });
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

async function shareRadar() {
    if (!navigator.share) {
        ElMessage.info('您的瀏覽器不支援直接分享，請截圖保存。');
        return;
    }
    // 這裡可以接您原本的 html2canvas 邏輯
    ElMessage.success('正在準備分享圖片...');
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

// 模擬數據獲取 (將您生成的 JSON 放在這裡)
async function getKeywordsData(): Promise<KeywordItem[]> {
    // 這裡填入您剛剛生成的 48 個關鍵字 JSON array
    const keywordPack = await fetch('./growth/entropy.json')
    const keywordJson = await keywordPack.json()
    console.log({
        keywordJson
    })
    return keywordJson.keywords
    // return [
    //     { id: 1, keyword_zh: "挑戰", keyword_en: "Challenge", archetype: "Hunter", vector: { x: 0.9, y: 0.7, z: 0.6 }, description: "..." },
    //     { id: 7, keyword_zh: "趨勢", keyword_en: "Trends", archetype: "Pathfinder", vector: { x: 0.7, y: 0.8, z: -0.6 }, description: "..." },
    //     // ... (放入全部 48 個)
    //     { id: 48, keyword_zh: "長久", keyword_en: "Long-term", archetype: "Elder", vector: { x: -0.6, y: -0.8, z: -0.9 }, description: "..." }
    // ];
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
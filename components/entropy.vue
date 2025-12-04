<template>
    <h2 id="熵腦原野八職測驗" tabindex="-1">熵腦原野八職測驗 <a class="header-anchor" href="#熵腦原野八職測驗"
            aria-label="Permalink to &quot;熵腦原野八職測驗&quot;">&ZeroWidthSpace;</a></h2>
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
                    :value="item" border style="margin: 5px;">
                    {{ item.keyword_zh }}
                </el-checkbox>
            </el-checkbox-group>
        </el-row>

        <br />

        <div v-show="selectedKeywords.length >= 5" class="result-section">
            <el-divider content-position="center">你的大腦原野分佈</el-divider>
            <canvas id="neuroRadar"></canvas>

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
                        <el-tag :type="dimensionScores.z > 0 ? 'primary' : 'secondary'">
                            {{ dimensionScores.z > 0 ? '感知 (外求)' : '預測 (內求)' }}
                        </el-tag>
                    </el-descriptions-item>
                </el-descriptions>
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
import { ref, shallowRef, onMounted } from 'vue'
import Chart from 'chart.js/auto';
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
let radarInstance = ref<Chart>()

// --- 3. 八大角色原型定義 (標準座標) ---
const archetypes: ArchetypeDef[] = [
    // T 組
    { key: 'Hunter', name: '獵人 (Hunter)', vector: { x: 1, y: 1, z: 1 }, desc: '瞬間反應的征服者' },
    { key: 'Pathfinder', name: '尋路人 (Pathfinder)', vector: { x: 1, y: 1, z: -1 }, desc: '願景導航者' },
    { key: 'Toolmaker', name: '工匠 (Toolmaker)', vector: { x: 1, y: -1, z: 1 }, desc: '精確執行者' },
    { key: 'Sentry', name: '哨兵 (Sentry)', vector: { x: 1, y: -1, z: -1 }, desc: '秩序防禦者' },
    // O 組
    { key: 'Shaman', name: '薩滿 (Shaman)', vector: { x: -1, y: 1, z: 1 }, desc: '靈性共鳴者' },
    { key: 'Envoy', name: '信使 (Envoy)', vector: { x: -1, y: 1, z: -1 }, desc: '意義傳遞者' },
    { key: 'Helper', name: '助人者 (Helper)', vector: { x: -1, y: -1, z: 1 }, desc: '溫暖供給者' },
    { key: 'Elder', name: '長老 (Elder)', vector: { x: -1, y: -1, z: -1 }, desc: '智慧傳承者' },
]

// --- 4. 初始化 ---
onMounted(async () => {
    const rawKeywords = await getKeywordsData()
    console.log({
rawKeywords
    })
    shuffledKeywords.value = shuffle(rawKeywords);
});

// --- 5. 核心計算邏輯 ---
function calculateResults() {
    if (selectedKeywords.value.length === 0) {
        dimensionScores.value = null;
        if (radarInstance.value) radarInstance.value.destroy();
        return;
    }

    // 1. 計算使用者總向量 (Sum Vector)
    let totalVec: Vector3 = { x: 0, y: 0, z: 0 };
    selectedKeywords.value.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
    });

    // 2. 歸一化 (變成平均傾向，範圍約 -1 ~ 1)
    const count = selectedKeywords.value.length;
    const userVec: Vector3 = {
        x: totalVec.x / count,
        y: totalVec.y / count,
        z: totalVec.z / count
    };
    dimensionScores.value = userVec;

    // 3. 計算與 8 個角色的「相似度」 (使用向量點積 + 歸一化映射到 0-100)
    // 相似度公式: Cosine Similarity 或是簡單的投影
    // 這裡使用簡單的投影分數： Score = (User . Archetype)
    // 因為 Archetype 向量長度固定為 sqrt(3)，我們簡化計算。

    const radarData = archetypes.map(arch => {
        // 計算歐幾里得距離 (距離越小越相似)
        const dist = Math.sqrt(
            Math.pow(userVec.x - arch.vector.x, 2) +
            Math.pow(userVec.y - arch.vector.y, 2) +
            Math.pow(userVec.z - arch.vector.z, 2)
        );

        // 將距離轉換為分數 (最大距離約為 3.46 (從 -1,-1,-1 到 1,1,1)，我們反轉它)
        // 分數 = (1 - (dist / max_dist)) * 100
        const maxDist = 3.5;
        let score = (1 - (dist / maxDist)) * 100;
        return Math.max(0, Math.round(score)); // 確保不小於 0
    });

    drawRadar(radarData);
}

function drawRadar(dataValues: number[]) {
    const ctx = document.querySelector('#neuroRadar') as HTMLCanvasElement;
    if (!ctx) return;

    const data = {
        labels: archetypes.map(a => a.name),
        datasets: [{
            label: '角色共鳴度 (%)',
            data: dataValues,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };

    if (radarInstance.value) {
        radarInstance.value.data = data;
        radarInstance.value.update();
    } else {
        radarInstance.value = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                elements: {
                    line: { borderWidth: 3 }
                },
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { stepSize: 20 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
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

<style scoped>
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
<template>
    <el-card class="universe-card" shadow="hover" v-loading="loading">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🌌 大腦神經宇宙座標</span>
                    <el-tooltip content="這是一個模擬大腦認知向度的三維空間。金色的鑽石代表你的意識重心，藍色的星塵是你選擇的特質。" placement="top">
                        <el-icon class="info-icon">
                            <Info />
                        </el-icon>
                    </el-tooltip>
                </div>
                <el-tag size="small" effect="dark" type="warning">3D 視覺化</el-tag>
            </div>
        </template>

        <div class="universe-content">
            <div id="brain3D" ref="chartContainer" class="chart-container"></div>

            <div class="mobile-hint">
                <el-icon>
                    <Rank />
                </el-icon>
                <span>可拖曳旋轉 / 滾輪縮放</span>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { Info, Rank } from '@element-plus/icons-vue';
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
// --- Props ---
const props = defineProps<{
    selectedKeywords: Array<{
        keyword_zh: string;
        vector: { x: number; y: number; z: number }
    }>
}>();

// --- 狀態 ---
const chartContainer = ref<HTMLElement | null>(null);
const loading = ref(false);

// --- 8 大角色恆星座標 ---
const archetypeStars = [
    { name: '獵人', x: 10, y: 10, z: 10, color: '#FF4500', symbol: 'diamond' },
    { name: '先驅', x: 10, y: 10, z: -10, color: '#FF8C00', symbol: 'diamond' },
    { name: '工匠', x: 10, y: -10, z: 10, color: '#1E90FF', symbol: 'square' },
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B', symbol: 'square' },
    { name: '薩滿', x: -10, y: 10, z: 10, color: '#9370DB', symbol: 'circle' },
    { name: '信使', x: -10, y: 10, z: -10, color: '#FF69B4', symbol: 'circle' },
    { name: '助人者', x: -10, y: -10, z: 10, color: '#32CD32', symbol: 'cross' },
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57', symbol: 'cross' },
];

// --- 核心繪圖邏輯 (改為 async) ---
async function drawChart() {
    if (!chartContainer.value || props.selectedKeywords.length === 0) return;

    loading.value = true;

    // ✅ 【關鍵修改】在這裡動態引入 Plotly
    // 加上 .default 是為了確保在不同打包工具 (Vite/Webpack) 下都能正確拿到物件
    const Plotly = (await import('plotly.js-dist-min')).default;

    // 1. 計算使用者重心
    let totalVec = { x: 0, y: 0, z: 0 };
    props.selectedKeywords.forEach(kw => {
        totalVec.x += kw.vector.x;
        totalVec.y += kw.vector.y;
        totalVec.z += kw.vector.z;
    });
    const count = props.selectedKeywords.length;
    const scale = 10;
    const ux = (totalVec.x / count) * scale;
    const uy = (totalVec.y / count) * scale;
    const uz = (totalVec.z / count) * scale;

    // 2. 設定 Trace 數據
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
        marker: { size: 5, color: archetypeStars.map(a => a.color), opacity: 0.7, symbol: 'circle' },
        hoverinfo: 'text'
    };

    const keywordPoints = props.selectedKeywords.map(kw => ({
        x: kw.vector.x * scale,
        y: kw.vector.y * scale,
        z: kw.vector.z * scale,
        text: kw.keyword_zh
    }));

    const keywordsTrace = {
        x: keywordPoints.map(p => p.x),
        y: keywordPoints.map(p => p.y),
        z: keywordPoints.map(p => p.z),
        mode: 'markers',
        type: 'scatter3d',
        name: '你的選擇',
        text: keywordPoints.map(p => p.text),
        marker: { size: 4, color: '#409EFF', opacity: 0.8, line: { color: 'white', width: 0.5 } },
        hoverinfo: 'text'
    };

    const userTrace = {
        x: [ux], y: [uy], z: [uz],
        mode: 'markers+text',
        type: 'scatter3d',
        name: '你的重心',
        text: ['YOU'],
        textposition: 'bottom center',
        textfont: { size: 14, color: '#000', family: 'Arial Black' },
        marker: { size: 12, color: '#FFD700', line: { color: '#FFF', width: 2 }, symbol: 'diamond' },
        hoverinfo: 'text'
    };

    // 3. 佈局設定
    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力', range: [-12, 12] },
            yaxis: { title: '熵狀態', range: [-12, 12] },
            zaxis: { title: '拓撲向', range: [-12, 12] },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
            aspectmode: 'cube'
        },
        showlegend: true,
        legend: { x: 0, y: 1 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    const config = {
        responsive: true,
        displayModeBar: false,
        scrollZoom: true
    };

    // 4. 繪製 (因為在 async 函數內，這裡的 Plotly 已經確認載入)
    Plotly.newPlot(chartContainer.value, [
        archetypesTrace,
        keywordsTrace,
        userTrace
    ], layout, config).then(() => {
        loading.value = false;
    });
}

// --- 生命週期 ---
onMounted(() => {
    nextTick(() => {
        drawChart();
    });
});

watch(() => props.selectedKeywords, () => {
    drawChart();
}, { deep: true });

// 清理資源 (這裡也需要動態載入 Plotly 才能呼叫 purge，或者直接清空 DOM)
onBeforeUnmount(async () => {
    if (chartContainer.value) {
        try {
            const Plotly = (await import('plotly.js-dist-min')).default;
            Plotly.purge(chartContainer.value);
        } catch (e) {
            // 忽略錯誤，可能 Plotly 還沒載入完組件就被銷毀
        }
    }
});
</script>

<style scoped>
.universe-card {
    margin-top: 20px;
    border-radius: 12px;
    border: 1px solid #e4e7ed;
    background: linear-gradient(to bottom, #ffffff, #fdfdfd);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 6px;
}

.title {
    font-weight: bold;
    font-size: 16px;
    color: #303133;
}

.info-icon {
    font-size: 14px;
    color: #909399;
    cursor: help;
}

.universe-content {
    position: relative;
    width: 100%;
}

.chart-container {
    width: 100%;
    height: 500px;
}

.mobile-hint {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.8);
    padding: 4px 8px;
    border-radius: 12px;
    Rank-events: none;
}
</style>
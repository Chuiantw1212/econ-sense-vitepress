<template>
    <el-card class="universe-card" shadow="hover" v-loading="loading">
        <template #header>
            <div class="card-header">
                <div class="header-left">
                    <span class="title">🌌 大腦神經宇宙座標</span>
                    <el-tooltip content="金色的鑽石是你的重心，藍色星塵是你選擇的特質。開啟「意識場域」可看見你的思維覆蓋範圍。" placement="top">
                        <el-icon class="info-icon">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                </div>

                <div class="header-right">
                    <el-switch v-model="showHull" active-text="意識場域" inline-prompt :active-icon="Connection"
                        :inactive-icon="Close" style="--el-switch-on-color: #e6a23c" />
                </div>
            </div>
        </template>

        <div class="universe-content">
            <div id="brain3D" ref="chartContainer" class="chart-container"></div>

            <div class="mobile-hint">
                <el-icon>
                    <Pointer />
                </el-icon>
                <span>可拖曳旋轉 / 滾輪縮放</span>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { InfoFilled, Pointer, Connection, Close } from '@element-plus/icons-vue';

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
const showHull = ref(true); // 控制多面體開關

// --- 8 大角色恆星座標 ---
const archetypeStars = [
    { name: '獵人', x: 10, y: 10, z: 10, color: '#FF4500', symbol: 'diamond' },
    { name: '先驅', x: 10, y: 10, z: -10, color: '#FF8C00', symbol: 'diamond' },
    { name: '工匠', x: 10, y: -10, z: 10, color: '#1E90FF', symbol: 'square' },
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B', symbol: 'square' },
    { name: '採集者', x: -10, y: 10, z: 10, color: '#FF69B4', symbol: 'circle' },
    { name: '薩滿', x: -10, y: 10, z: -10, color: '#9370DB', symbol: 'circle' },
    { name: '助人者', x: -10, y: -10, z: 10, color: '#32CD32', symbol: 'cross' },
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57', symbol: 'cross' },
];

async function drawChart() {
    if (!chartContainer.value || props.selectedKeywords.length === 0) return;

    loading.value = true;
    const Plotly = (await import('plotly.js-dist-min')).default;

    const count = props.selectedKeywords.length;
    const scale = 10;

    // 1. 準備數據 + 微小厚度處理 (Jitter)
    // 這裡的 Jitter 極小 (0.01)，肉眼看不出偏移，但足以讓共面的點產生體積
    const jitter = () => (Math.random() - 0.5) * 0.05;

    const kwX = props.selectedKeywords.map(k => (k.vector.x * scale) + jitter());
    const kwY = props.selectedKeywords.map(k => (k.vector.y * scale) + jitter());
    const kwZ = props.selectedKeywords.map(k => (k.vector.z * scale) + jitter());
    const kwText = props.selectedKeywords.map(k => k.keyword_zh);

    // 重心計算
    const ux = (kwX.reduce((a, b) => a + b, 0) / count);
    const uy = (kwY.reduce((a, b) => a + b, 0) / count);
    const uz = (kwZ.reduce((a, b) => a + b, 0) / count);

    // --- Trace 設定 ---

    // Trace A: 意識場域 (Convex Hull) - 放在最底層
    let meshTrace = null;
    if (showHull.value && count >= 4) {
        meshTrace = {
            x: kwX,
            y: kwY,
            z: kwZ,
            type: 'mesh3d',

            // 【關鍵修正】
            // alphahull: 0 -> 計算 Convex Hull (凸包)，即「最小包覆多面體」
            // 這會忽略內部點，只連接最外圍的點形成一個殼
            alphahull: 0,

            opacity: 0.3, // 半透明，呈現能量場感
            color: '#FFD700', // 實心黃色
            flatshading: true,
            hoverinfo: 'skip', // 不顯示 hover 資訊
            name: '意識場域'
        };
    }

    // Trace B: 原型恆星
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text',
        type: 'scatter3d',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        textfont: { size: 11, color: '#888' },
        marker: { size: 5, color: archetypeStars.map(a => a.color), opacity: 0.5, symbol: 'circle' },
        hoverinfo: 'text'
    };

    // Trace C: 關鍵字星塵
    const keywordsTrace = {
        x: kwX, y: kwY, z: kwZ,
        mode: 'markers',
        type: 'scatter3d',
        text: kwText,
        marker: { size: 4, color: '#409EFF', opacity: 1, line: { color: 'white', width: 0.8 } },
        hoverinfo: 'text'
    };

    // Trace D: 使用者飛船
    const userTrace = {
        x: [ux], y: [uy], z: [uz],
        mode: 'markers+text',
        type: 'scatter3d',
        text: ['YOU'],
        textposition: 'bottom center',
        textfont: { size: 14, color: '#000', family: 'Arial Black' },
        marker: { size: 12, color: '#FFD700', line: { color: '#FFF', width: 2 }, symbol: 'diamond' },
        hoverinfo: 'text'
    };

    // 組合 Traces (將 mesh 放在第一位，這是 WebGL 渲染透明物體的最佳實踐)
    const data = [archetypesTrace, keywordsTrace, userTrace];
    if (meshTrace) data.unshift(meshTrace);

    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力', range: [-12, 12] },
            yaxis: { title: '熵狀態', range: [-12, 12] },
            zaxis: { title: '拓撲向', range: [-12, 12] },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
            aspectmode: 'cube'
        },
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    const config = { responsive: true, displayModeBar: false, scrollZoom: true };

    Plotly.newPlot(chartContainer.value, data, layout, config).then(() => {
        loading.value = false;
    });
}

// --- Watchers ---
onMounted(() => { nextTick(() => drawChart()); });

// 監聽數據變化 OR 開關變化，都觸發重繪
watch([() => props.selectedKeywords, showHull], () => {
    drawChart();
}, { deep: true });

onBeforeUnmount(async () => {
    if (chartContainer.value) {
        try {
            const Plotly = (await import('plotly.js-dist-min')).default;
            Plotly.purge(chartContainer.value);
        } catch (e) { }
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
    pointer-events: none;
}
</style>
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
    { name: '先驅', x: 10, y: -10, z: 10, color: '#FF8C00', symbol: 'diamond' },
    { name: '採集者', x: -10, y: 10, z: 10, color: '#FF69B4', symbol: 'circle' },
    { name: '薩滿', x: -10, y: -10, z: 10, color: '#9370DB', symbol: 'circle' },
    { name: '工匠', x: 10, y: 10, z: -10, color: '#1E90FF', symbol: 'square' },
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B', symbol: 'square' },
    { name: '助人者', x: -10, y: 10, z: -10, color: '#32CD32', symbol: 'cross' },
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57', symbol: 'cross' },
];

async function drawChart() {
    if (!chartContainer.value || props.selectedKeywords.length === 0) return;

    loading.value = true;
    const Plotly = (await import('plotly.js-dist-min')).default;

    // 1. 數據計算與座標準備
    const count = props.selectedKeywords.length;
    const scale = 10;
    const jitter = () => (Math.random() - 0.5) * 0.05;

    // 原始座標 (已加入微小擾動)
    const kwX = props.selectedKeywords.map(k => (k.vector.x * scale) + jitter());
    const kwY = props.selectedKeywords.map(k => (k.vector.y * scale) + jitter());
    const kwZ = props.selectedKeywords.map(k => (k.vector.z * scale) + jitter());
    const kwText = props.selectedKeywords.map(k => k.keyword_zh);

    // 計算重心
    const ux = (kwX.reduce((a, b) => a + b, 0) / count);
    const uy = (kwY.reduce((a, b) => a + b, 0) / count);
    const uz = (kwZ.reduce((a, b) => a + b, 0) / count);

    // --- Trace A: 軸線向量 (從原點連向恆星) ---
    let lineX: (number | null)[] = [];
    let lineY: (number | null)[] = [];
    let lineZ: (number | null)[] = [];

    // archetypeStars 應在元件頂部定義
    archetypeStars.forEach(a => {
        lineX.push(0, a.x, null);
        lineY.push(0, a.y, null);
        lineZ.push(0, a.z, null);
    });

    const axisLinesTrace = {
        x: lineX, y: lineY, z: lineZ,
        mode: 'lines',
        type: 'scatter3d',
        line: { color: '#ccc', width: 1.5, dash: 'dot' },
        opacity: 0.6,
        hoverinfo: 'none',
        name: '維度方向'
    };

    // --- Trace B: 意識場域 (Mesh) ---
    let meshTrace = null;
    if (showHull.value && count >= 4) {
        meshTrace = {
            x: kwX, y: kwY, z: kwZ,
            type: 'mesh3d',
            alphahull: 0,
            opacity: 0.5, // 保持半透明，增加實心感
            color: '#FFD700',
            flatshading: true,
            hoverinfo: 'skip',
            name: '意識場域'
        };
    }

    // *** 這裡移除了 keywordDropsTrace 和 centroidDropTrace 的生成邏輯 ***

    // --- Trace C: 原型恆星 ---
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text',
        type: 'scatter3d',
        name: '原型恆星',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        textfont: { size: 11, color: '#444' },
        marker: { size: 6, color: archetypeStars.map(a => a.color), opacity: 0.9, symbol: 'circle' },
        hoverinfo: 'text'
    };

    // --- Trace D: 關鍵字星塵 (點) ---
    const keywordsTrace = {
        x: kwX, y: kwY, z: kwZ,
        mode: 'markers',
        type: 'scatter3d',
        name: '你的選擇',
        text: kwText,
        marker: { size: 4, color: '#409EFF', opacity: 1.0, line: { color: 'white', width: 0.5 } },
        hoverinfo: 'text'
    };

    // Trace E: 使用者飛船 (重心點)
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

    // 組合 Traces (只保留軸線、恆星、星塵、飛船)
    const data = [
        axisLinesTrace,
        archetypesTrace,
        keywordsTrace,
        userTrace
    ];
    if (meshTrace) data.unshift(meshTrace);


    // 2. 佈局設定 (維持 Z=0 地平線強化)
    const layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        scene: {
            xaxis: { title: '驅動力 (Drive)', showgrid: true, zeroline: true, showbackground: true, backgroundcolor: '#f7f7f7', gridcolor: '#e0e0e0', range: [-12, 12] },
            yaxis: { title: '熵狀態 (Entropy)', showgrid: true, zeroline: true, showbackground: true, backgroundcolor: '#f7f7f7', gridcolor: '#e0e0e0', range: [-12, 12] },
            zaxis: {
                title: '拓撲向 (Topology)',
                showgrid: true,
                zeroline: true,
                showbackground: true,
                backgroundcolor: '#f7f7f7',
                gridcolor: '#e0e0e0',
                range: [-12, 12],
                zerolinecolor: '#000000',
                zerolinewidth: 3,
            },

            aspectmode: 'cube',
            bgcolor: '#ffffff',
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
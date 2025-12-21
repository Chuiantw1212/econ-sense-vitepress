<template>
    <el-card class="universe-card" shadow="hover">
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
                    <span v-if="loading" class="loading-text">
                        <el-icon class="is-loading">
                            <Loading />
                        </el-icon> 計算中...
                    </span>
                    <el-switch v-model="showHull" active-text="意識場域" inline-prompt :active-icon="Connection"
                        :inactive-icon="Close" style="--el-switch-on-color: #e6a23c" />
                </div>
            </div>
        </template>

        <div class="universe-content" v-loading="loading">
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
import { ref, onMounted, watch, onBeforeUnmount, markRaw } from 'vue';
import { InfoFilled, Pointer, Connection, Close, Loading } from '@element-plus/icons-vue';

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
const showHull = ref(true);
let plotlyInstance: any = null; // 保存 Plotly 實例

// --- 8 大角色恆星座標 (靜態資料) ---
const archetypeStars = [
    { name: '獵人', x: 10, y: 10, z: 10, color: '#FF4500' },
    { name: '先驅', x: 10, y: -10, z: 10, color: '#FF8C00' },
    { name: '採集者', x: -10, y: 10, z: 10, color: '#FF69B4' },
    { name: '薩滿', x: -10, y: -10, z: 10, color: '#9370DB' },
    { name: '工匠', x: 10, y: 10, z: -10, color: '#1E90FF' },
    { name: '哨兵', x: 10, y: -10, z: -10, color: '#00008B' },
    { name: '助人者', x: -10, y: 10, z: -10, color: '#32CD32' },
    { name: '長老', x: -10, y: -10, z: -10, color: '#2E8B57' },
];

// --- 繪圖核心邏輯 ---
async function drawChart() {
    // 1. 基礎檢查
    if (!chartContainer.value || chartContainer.value.offsetParent === null) return;

    // 如果沒有關鍵字，清空圖表並退出
    if (props.selectedKeywords.length === 0) {
        if (plotlyInstance) plotlyInstance.purge(chartContainer.value);
        loading.value = false;
        return;
    }

    // 動態載入 Plotly (只載入一次)
    const Plotly = (await import('plotly.js-dist-min')).default;

    // 2. 數據準備
    const count = props.selectedKeywords.length;
    const scale = 10;
    const jitter = () => (Math.random() - 0.5) * 0.05;

    const kwX = props.selectedKeywords.map(k => (k.vector.x * scale) + jitter());
    const kwY = props.selectedKeywords.map(k => (k.vector.y * scale) + jitter());
    const kwZ = props.selectedKeywords.map(k => (k.vector.z * scale) + jitter());
    const kwText = props.selectedKeywords.map(k => k.keyword_zh);

    // 重心計算
    const ux = (kwX.reduce((a, b) => a + b, 0) / count);
    const uy = (kwY.reduce((a, b) => a + b, 0) / count);
    const uz = (kwZ.reduce((a, b) => a + b, 0) / count);

    // Trace A: 軸線
    let lineX: (number | null)[] = [];
    let lineY: (number | null)[] = [];
    let lineZ: (number | null)[] = [];
    archetypeStars.forEach(a => {
        lineX.push(0, a.x, null);
        lineY.push(0, a.y, null);
        lineZ.push(0, a.z, null);
    });

    // Trace B: 意識場域 (Convex Hull Mesh)
    // 優化：只有當點數 >= 4 時才計算，避免少於4點時 WebGL 報錯或形狀怪異
    let meshTrace = null;
    if (showHull.value && count >= 4) {
        meshTrace = {
            x: kwX, y: kwY, z: kwZ,
            type: 'mesh3d',
            alphahull: 0,
            // 1. 稍微調高不透明度：從 0.15 提升到 0.25 或 0.3
            // 這樣才能對背後的藍點產生足夠的「濾鏡效果」，讓它們變淡
            opacity: 0.5,

            // 2. 顏色建議：使用更亮一點的金黃色或淡黃色
            // 深色容易讓畫面髒掉，亮色比較像能量場
            color: '#FFEC8B', // LightGoldenrod (比 #FFD700 更淡雅一點)

            flatshading: true,

            // 3. 增加 lighting 讓表面有反光感，增強實體感
            lighting: {
                ambient: 0.6,
                diffuse: 0.5,
                roughness: 0.1,
                specular: 0.1
            },

            hoverinfo: 'skip',
            name: '意識場域'
        };
    }

    // Trace C: 原型恆星
    const archetypesTrace = {
        x: archetypeStars.map(a => a.x),
        y: archetypeStars.map(a => a.y),
        z: archetypeStars.map(a => a.z),
        mode: 'markers+text',
        type: 'scatter3d',
        name: '原型恆星',
        text: archetypeStars.map(a => a.name),
        textposition: 'top center',
        textfont: { size: 10, color: '#666' },
        marker: { size: 5, color: archetypeStars.map(a => a.color), opacity: 0.8 },
        hoverinfo: 'text'
    };

    // Trace D: 關鍵字星塵
    const keywordsTrace = {
        x: kwX, y: kwY, z: kwZ,
        mode: 'markers',
        type: 'scatter3d',
        name: '你的選擇',
        text: kwText,
        marker: { size: 4, color: '#409EFF', opacity: 0.9 },
        hoverinfo: 'text'
    };

    // Trace E: 使用者重心
    const userTrace = {
        x: [ux], y: [uy], z: [uz],
        mode: 'markers',
        type: 'scatter3d',
        name: '重心',
        text: ['YOU'],
        marker: { size: 10, color: '#FFD700', line: { color: '#FFF', width: 2 }, symbol: 'diamond' },
        hoverinfo: 'text'
    };

    // 修改後：確保網格 (Mesh) 是最後一個被加入 data 陣列的
    // 這樣它才會在最後被渲染，覆蓋在那些位於內部的點之上
    const data: any[] = [
        archetypesTrace,
        keywordsTrace, // 藍色點點先畫
        userTrace
    ];

    // 如果有網格，把它放在最後面 (push)
    if (meshTrace) data.push(meshTrace);

    // 3. 佈局配置
    // 使用 Plotly.react 而不是 newPlot，react 對更新更有效率
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
        displayModeBar: false, // 隱藏 Plotly 工具列
        scrollZoom: true
    };

    // 使用 react 進行高效更新
    await Plotly.react(chartContainer.value, data, layout, config);

    loading.value = false;
}

// --- 防抖函數 (核心優化) ---
function debounce(fn: Function, delay: number) {
    let timer: any = null;
    return (...args: any[]) => {
        // 只要一觸發，立刻顯示 loading
        loading.value = true;

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

// 建立防抖版本的繪圖函數，延遲 800ms
// 這樣即使你 1 秒選 5 個，也只會畫最後一次
const debouncedDrawChart = debounce(drawChart, 800);

// --- Watchers ---
// 監聽數據變化
watch(
    [() => props.selectedKeywords, showHull],
    () => {
        debouncedDrawChart();
    },
    { deep: true }
);

onMounted(() => {
    // 首次載入不需要防抖，直接畫
    drawChart();
});

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
    background: #fff;
    transition: all 0.3s;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.loading-text {
    font-size: 12px;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 4px;
}

.title {
    font-weight: 800;
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
    min-height: 300px;
}

.chart-container {
    width: 100%;
    height: 400px;
    /* 稍微調低高度，適配手機 */
}

.mobile-hint {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    color: #909399;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 8px;
    border-radius: 12px;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid #ebeef5;
}

@media (max-width: 768px) {
    .universe-card {
        display: none !important;
    }
}
</style>
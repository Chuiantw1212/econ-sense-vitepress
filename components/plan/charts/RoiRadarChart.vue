<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue'
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartData,
    ChartConfiguration
} from 'chart.js'
import { UserPortfolio } from '../types/user'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
    portfolios: UserPortfolio[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = shallowRef<Chart | null>(null)

// ----------------------------------------------------
// 1. 新增：總計摘要計算 (Summary Logic)
// ----------------------------------------------------
const summary = computed(() => {
    const totalValue = props.portfolios.reduce((sum, item) => {
        const rate = item.exchangeRate || 1
        return sum + ((item.marketValue || 0) * rate)
    }, 0)

    const totalPnl = props.portfolios.reduce((sum, item) => {
        return sum + (item.realizedPnl || 0)
    }, 0)

    // 本金 = 市值 - 損益
    const principal = totalValue - totalPnl

    // ROI 計算 (防呆：本金為0時 ROI 為 0)
    // 若本金 < 0 且賺錢 (totalPnl > 0)，代表已回本 (ROI 無限大)，這裡簡單處理讓其為正值
    let totalRoi = 0
    if (principal !== 0) {
        totalRoi = totalPnl / principal
    }

    return { totalValue, totalPnl, totalRoi }
})

// ----------------------------------------------------
// 2. 圖表資料轉換邏輯 (保持不變)
// ----------------------------------------------------
function getChartData(): ChartData<'bar'> {
    const marketStats = new Map<string, { totalValueTwd: number; totalPnlTwd: number }>()

    props.portfolios.forEach(item => {
        const code = item.countryCode || '未分類'
        const valueTwd = (item.marketValue || 0) * (item.exchangeRate || 1)
        const pnlTwd = item.realizedPnl || 0

        if (!marketStats.has(code)) {
            marketStats.set(code, { totalValueTwd: 0, totalPnlTwd: 0 })
        }
        const stat = marketStats.get(code)!
        stat.totalValueTwd += valueTwd
        stat.totalPnlTwd += pnlTwd
    })

    // 排序：依市值由大到小
    const sortedStats = Array.from(marketStats.entries())
        .map(([code, stat]) => ({
            label: code,
            value: stat.totalValueTwd,
            pnl: stat.totalPnlTwd
        }))
        .sort((a, b) => b.value - a.value)

    const labels = sortedStats.map(item => item.label)

    // Dataset A: 市值
    const valueData = sortedStats.map(item => item.value)

    // Dataset B: 損益 (動態顏色)
    const pnlData = sortedStats.map(item => item.pnl)
    const pnlColors = sortedStats.map(item =>
        item.pnl >= 0 ? 'rgba(245, 108, 108, 0.8)' : 'rgba(103, 194, 58, 0.8)'
    )

    return {
        labels,
        datasets: [
            {
                label: '庫存市值 (存量)',
                data: valueData,
                backgroundColor: 'rgba(64, 158, 255, 0.6)',
                borderColor: '#409eff',
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            },
            {
                label: '已實現損益 (流量)',
                data: pnlData,
                backgroundColor: pnlColors,
                borderColor: pnlColors.map(c => c.replace('0.8', '1')),
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }
        ]
    }
}

// ----------------------------------------------------
// 3. 圖表選項 (保持不變)
// ----------------------------------------------------
const chartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { right: 20, top: 10 }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
                color: '#909399',
                callback: (val: any) => {
                    if (Math.abs(val) >= 1000000) return (val / 1000000).toFixed(1) + 'M'
                    if (Math.abs(val) >= 1000) return (val / 1000).toFixed(0) + 'K'
                    return val
                }
            }
        },
        y: {
            grid: { display: false },
            ticks: {
                color: '#e5e7eb',
                font: { size: 14, weight: 'bold' }
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: '#e5e7eb', usePointStyle: true, padding: 20 }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 12,
            displayColors: true,
            callbacks: {
                label: (context) => {
                    const raw = context.raw as number
                    const label = context.dataset.label
                    return ` ${label}: NT$ ${raw.toLocaleString()}`
                }
            }
        }
    }
}

onMounted(() => {
    if (canvasRef.value) {
        chartInstance.value = new Chart(canvasRef.value, {
            type: 'bar',
            data: getChartData(),
            options: chartOptions
        })
    }
})

watch(() => props.portfolios, () => {
    if (chartInstance.value) {
        chartInstance.value.data = getChartData()
        chartInstance.value.update()
    }
}, { deep: true })

onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
    }
})
</script>

<template>
    <div class="chart-container">

        <div class="chart-header">
            <div class="title-section">
                <span class="main-title">資產規模 vs 損益比較</span>
            </div>

            <div class="summary-metrics">

                <div class="metric-item">
                    <span class="label">總庫存</span>
                    <span class="value">NT$ {{ Math.round(summary.totalValue).toLocaleString() }}</span>
                </div>

                <el-divider direction="vertical" style="height: 2em;" />

                <div class="metric-item">
                    <span class="label">年實現損益</span>
                    <span class="value"
                        :style="{ color: summary.totalPnl >= 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
                        {{ summary.totalPnl > 0 ? '+' : '' }}{{ Math.round(summary.totalPnl).toLocaleString() }}
                    </span>
                </div>

                <el-divider direction="vertical" style="height: 2em;" />

                <div class="metric-item">
                    <span class="label">年報酬率</span>
                    <span class="value"
                        :style="{ color: summary.totalRoi >= 0 ? 'var(--el-color-danger)' : 'var(--el-color-success)' }">
                        {{ summary.totalRoi > 0 ? '+' : '' }}{{ (summary.totalRoi * 100).toFixed(2) }}%
                    </span>
                </div>

            </div>
        </div>

        <div class="canvas-wrapper">
            <canvas ref="canvasRef"></canvas>
            <div v-if="portfolios.length === 0" class="empty-mask">
                <el-empty description="尚無數據" :image-size="60" />
            </div>
        </div>

    </div>
</template>

<style scoped>
.chart-container {
    width: 100%;
    padding: 20px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);
    display: flex;
    flex-direction: column;
}

.chart-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
}

/* 標題樣式 */
.main-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    display: block;
}

/* 數據摘要區塊：預設桌面版 (Flex) */
.summary-metrics {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
}

.metric-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.metric-item .label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.metric-item .value {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-regular);
    font-family: 'Roboto Mono', monospace;
}

.canvas-wrapper {
    position: relative;
    height: 300px;
    width: 100%;
}

.empty-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--el-bg-color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

/* --- RWD 手機版優化 --- */
@media (max-width: 768px) {
    .chart-container {
        padding: 12px; /* 縮小邊距，把空間留給圖表 */
    }

    /* 改用 Grid 佈局，讓資訊更有層次 */
    .summary-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr; /* 分兩欄 */
        gap: 12px;
        padding: 12px;
    }

    /* 第一個項目 (總庫存) 跨滿兩欄，並放大顯示 */
    .metric-item:first-child {
        grid-column: 1 / -1;
        border-bottom: 1px dashed var(--el-border-color-lighter);
        padding-bottom: 8px;
        margin-bottom: 4px;
    }

    .metric-item:first-child .value {
        font-size: 20px; /* 總金額放大 */
    }

    /* 手機版隱藏原本的垂直分隔線 */
    .el-divider--vertical {
        display: none;
    }
    
    /* 調整圖表高度，避免手機橫屏時太高 */
    .canvas-wrapper {
        height: 250px; 
    }
}
</style>
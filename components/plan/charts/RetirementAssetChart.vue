<template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';

// 定義圖表需要的數據結構
export interface ChartPayload {
    labels: string[];       // X軸：年齡 ['65', '66', ...]
    assets: number[];       // 右軸：資產餘額 (Line/Area)
    incomes: number[];      // 左軸：年金收入 (Line)
    
    // 左軸：支出堆疊 (Stacked Bar)
    expenses: {
        living: number[];   // 基礎生活 (含居住)
        medical: number[];  // 醫療防禦
        ltc: number[];      // 長照支出
    };
}

const props = defineProps<{
    data: ChartPayload;
    height?: number; // 預設 400
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// --- Chart 配置 ---
const renderChart = () => {
    if (!chartCanvas.value) return;
    
    // 銷毀舊實例
    if (chartInstance) chartInstance.destroy();

    const { labels, assets, incomes, expenses } = props.data;

    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar', // 主類型
        data: {
            labels,
            datasets: [
                // 1. 右軸：資產餘額 (藍色山丘) - 最底層背景
                {
                    label: '資產餘額 (Stock)',
                    data: assets,
                    type: 'line',
                    yAxisID: 'yAssets',
                    backgroundColor: 'rgba(64, 158, 255, 0.15)', // 淺藍填充
                    borderColor: '#409EFF',
                    borderWidth: 2,
                    pointRadius: 0,       // 不顯示點，保持線條流暢
                    pointHoverRadius: 4,
                    fill: true,           // 填滿下方區域
                    tension: 0.4,         // 平滑曲線
                    order: 0              // 渲染順序：雖是背景，但在 Tooltip 優先級可調整
                },
                // 2. 左軸：收入基準線 (綠色階梯線)
                {
                    label: '年金收入 (Income)',
                    data: incomes,
                    type: 'line',
                    yAxisID: 'yFlow',
                    borderColor: '#67C23A',
                    borderWidth: 2,
                    borderDash: [5, 5],   // 虛線
                    stepped: true,        // 階梯狀 (因為年金通常固定)
                    pointRadius: 0,
                    order: 1
                },
                // 3. 左軸：支出堆疊 (Bars)
                // 順序：由下而上堆疊
                {
                    label: '長照支出 (LTC)', // 最上層：紅色警示
                    data: expenses.ltc,
                    backgroundColor: '#F56C6C',
                    stack: 'expenseStack',
                    yAxisID: 'yFlow',
                    order: 2
                },
                {
                    label: '醫療防禦 (Medical)', // 中間層：橘色
                    data: expenses.medical,
                    backgroundColor: '#E6A23C',
                    stack: 'expenseStack',
                    yAxisID: 'yFlow',
                    order: 3
                },
                {
                    label: '基礎生活 (Living)', // 最底層：灰色/藍灰
                    data: expenses.living,
                    backgroundColor: '#909399',
                    stack: 'expenseStack',
                    yAxisID: 'yFlow',
                    order: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8 }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            let label = ctx.dataset.label || '';
                            if (label) label += ': ';
                            if (ctx.parsed.y !== null) {
                                label += new Intl.NumberFormat('zh-TW', { 
                                    style: 'currency', currency: 'TWD', maximumFractionDigits: 0 
                                }).format(ctx.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: '年齡 (Age)' }
                },
                // 左軸：流量 (Flow)
                yFlow: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: '年度收支 (NT$)' },
                    stacked: true, // 啟用堆疊
                    grid: { color: '#f0f2f5' }
                },
                // 右軸：存量 (Stock)
                yAssets: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: '資產餘額 (NT$)' },
                    grid: { drawOnChartArea: false }, // 不畫格線，避免混亂
                    min: 0 // 只顯示正資產
                }
            }
        }
    });
};

// Lifecycle
onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
onUnmounted(() => { if (chartInstance) chartInstance.destroy(); });
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px; /* CSS 控制高度 */
}
</style>
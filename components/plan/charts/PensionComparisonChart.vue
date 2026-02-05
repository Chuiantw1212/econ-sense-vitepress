<template>
    <div style="position: relative; height: 300px; width: 100%;">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue';
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

// 註冊需要的 Chart.js 元件 (Tree Shaking)
Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
);

interface Props {
    labels: string[];       // X軸: 年齡/年份
    totalData: number[];    // Y軸1: 雇主+自提
    employerData: number[]; // Y軸2: 僅雇主
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart | null>(null); // 使用 shallowRef 避免深層響應式效能問題

// 初始化圖表
const initChart = () => {
    if (!canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: props.labels,
            datasets: [
                {
                    label: '僅雇主提撥 (6%)',
                    data: props.employerData,
                    backgroundColor: '#dcdfe6', // 灰色放在後面或左邊
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    order: 2 // 控制繪製順序
                },
                {
                    label: '雇主+自提 (目前規劃)',
                    data: props.totalData,
                    backgroundColor: '#409EFF', // Element Plus Primary Blue
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { family: 'Helvetica Neue, Helvetica, Arial, sans-serif' }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += Math.round(context.parsed.y).toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f2f5',
                    },
                    ticks: {
                        callback: (value) => {
                            const v = Number(value);
                            if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
                            if (v >= 1000) return (v / 1000).toFixed(0) + 'k';
                            return v;
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
};

// 監聽資料變更並更新圖表
watch(
    () => [props.labels, props.totalData, props.employerData],
    () => {
        if (chartInstance.value) {
            chartInstance.value.data.labels = props.labels;
            chartInstance.value.data.datasets[0].data = props.employerData;
            chartInstance.value.data.datasets[1].data = props.totalData;
            chartInstance.value.update();
        }
    },
    { deep: true }
);

onMounted(() => {
    initChart();
});

onBeforeUnmount(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
});
</script>
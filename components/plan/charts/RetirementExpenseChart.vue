<template>
    <div style="position: relative; height: 350px; width: 100%;">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, shallowRef, watch } from 'vue';
import { debounce } from 'lodash-es';
import Chart from 'chart.js/auto';
import type { ExpenseDataPoint } from '@/components/plan/composables/useRetirementExpenseCalculator';

// 接收計算好的數據陣列
const props = defineProps<{
    dataSeries: ExpenseDataPoint[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart | null>(null);

const initChart = () => {
    if (!chartCanvas.value) return;
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;

    // 解析數據
    const labels = props.dataSeries.map(d => `${d.age}歲`);
    const dataBase = props.dataSeries.map(d => d.base);
    const dataMedical = props.dataSeries.map(d => d.medical);
    const dataDream = props.dataSeries.map(d => d.dream);
    const dataCare = props.dataSeries.map(d => d.care);

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '基本生活(3%)', data: dataBase, backgroundColor: '#91cc75', stack: '0' },
                { label: '醫療保健(4%)', data: dataMedical, backgroundColor: '#73c0de', stack: '0' },
                { label: '圓夢品質(3%)', data: dataDream, backgroundColor: '#fac858', stack: '0' },
                { label: '失能照護(4%)', data: dataCare, backgroundColor: '#ee6666', stack: '0' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => (Number(value) / 10000).toFixed(1) + '萬'
                    }
                }
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (c) => `${c.dataset.label}: ${Math.round(c.parsed.y).toLocaleString()}`,
                        footer: (items) => `總月開銷: ${Math.round(items.reduce((a, b) => a + b.parsed.y, 0)).toLocaleString()}`
                    }
                }
            }
        }
    });
};

const updateChart = () => {
    if (!chartInstance.value) { initChart(); return; }

    const labels = props.dataSeries.map(d => `${d.age}歲`);
    const dataBase = props.dataSeries.map(d => d.base);
    const dataMedical = props.dataSeries.map(d => d.medical);
    const dataDream = props.dataSeries.map(d => d.dream);
    const dataCare = props.dataSeries.map(d => d.care);

    chartInstance.value.data.labels = labels;
    chartInstance.value.data.datasets[0].data = dataBase;
    chartInstance.value.data.datasets[1].data = dataMedical;
    chartInstance.value.data.datasets[2].data = dataDream;
    chartInstance.value.data.datasets[3].data = dataCare;

    chartInstance.value.update();
};

const debouncedUpdate = debounce(updateChart, 300);

watch(() => props.dataSeries, () => { debouncedUpdate(); }, { deep: true });

onMounted(() => nextTick(initChart));
onUnmounted(() => chartInstance.value?.destroy());
</script>
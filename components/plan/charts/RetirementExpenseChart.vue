<template>
    <div style="position: relative; height: 350px; width: 100%;">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, shallowRef, watch } from 'vue';
import { debounce } from 'lodash-es';
import Chart from 'chart.js/auto';

// --- Props 定義：接收繪圖所需的所有參數 ---
const props = defineProps<{
    currentAge: number;         // 當前年齡 (用於計算通膨年數)
    retirementAge: number;      // 退休/請領年齡 (圖表起點)
    lifeExpectancy: number;     // 預估餘命 (圖表終點)
    baseMonthlyExpense: number; // 真實月開銷基數 (PV)

    // 全期參數
    medicalExpense: number;     // 醫療預算 (PV)

    // 階段一參數
    dreamCoefficient: number;   // 圓夢係數

    // 階段二參數
    disabilityAge: number;      // 失能啟動年齡
    disabilityExpense: number;  // 照護費用 (PV)
    livingExpenseAdjustment: number; // 生活費調整係數
}>();

// --- 常數設定 (內建於圖表組件的業務邏輯) ---
const GENERAL_INFLATION_RATE = 0.03;  // 一般通膨 3%
const MEDICAL_INFLATION_RATE = 0.04;  // 醫療通膨 4%

// --- 通膨計算 Helper ---
function calculateFV(pv: number, rate: number, years: number) {
    if (years <= 0) return pv;
    return pv * Math.pow(1 + rate, years);
}

// --- Chart Logic ---
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart | null>(null);

const generateChartData = () => {
    const {
        currentAge, retirementAge, lifeExpectancy, disabilityAge,
        baseMonthlyExpense, medicalExpense, dreamCoefficient,
        disabilityExpense, livingExpenseAdjustment
    } = props;

    const labels: string[] = [];
    const dataBase: number[] = [];
    const dataDream: number[] = [];
    const dataMedical: number[] = [];
    const dataCare: number[] = [];

    for (let age = retirementAge; age <= lifeExpectancy; age++) {
        labels.push(`${age}歲`);

        // 計算該年距離現在幾年 (用於通膨複利)
        const yearsFromNow = age - currentAge;

        // 1. 醫療費 (全期, 4% 通膨)
        const medFV = calculateFV(medicalExpense, MEDICAL_INFLATION_RATE, yearsFromNow);
        dataMedical.push(medFV);

        if (age < disabilityAge) {
            // [階段一：活躍期]

            // 基本生活 (3% 通膨)
            const baseFV = calculateFV(baseMonthlyExpense, GENERAL_INFLATION_RATE, yearsFromNow);
            dataBase.push(baseFV);

            // 圓夢金 (3% 通膨) - 基於基本生活費的加成
            const dreamPV = baseMonthlyExpense * (dreamCoefficient - 1);
            const dreamFV = calculateFV(dreamPV, GENERAL_INFLATION_RATE, yearsFromNow);
            dataDream.push(Math.max(0, dreamFV));

            dataCare.push(0);
        } else {
            // [階段二：失能期]

            // 基本生活 (打折, 3% 通膨)
            const baseAdjustedPV = baseMonthlyExpense * livingExpenseAdjustment;
            const baseFV = calculateFV(baseAdjustedPV, GENERAL_INFLATION_RATE, yearsFromNow);
            dataBase.push(baseFV);

            dataDream.push(0);

            // 照護費 (4% 通膨)
            const careFV = calculateFV(disabilityExpense, MEDICAL_INFLATION_RATE, yearsFromNow);
            dataCare.push(careFV);
        }
    }
    return { labels, dataBase, dataDream, dataMedical, dataCare };
};

const initChart = () => {
    if (!chartCanvas.value) return;
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;
    const d = generateChartData();

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.labels,
            datasets: [
                { label: '基本生活(3%)', data: d.dataBase, backgroundColor: '#91cc75', stack: '0' },
                { label: '醫療保健(4%)', data: d.dataMedical, backgroundColor: '#73c0de', stack: '0' },
                { label: '圓夢品質(3%)', data: d.dataDream, backgroundColor: '#fac858', stack: '0' },
                { label: '失能照護(4%)', data: d.dataCare, backgroundColor: '#ee6666', stack: '0' }
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
                        callback: function (value) {
                            return (Number(value) / 10000).toFixed(1) + '萬';
                        }
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
    const d = generateChartData();
    chartInstance.value.data.labels = d.labels;
    chartInstance.value.data.datasets[0].data = d.dataBase;
    chartInstance.value.data.datasets[1].data = d.dataMedical;
    chartInstance.value.data.datasets[2].data = d.dataDream;
    chartInstance.value.data.datasets[3].data = d.dataCare;
    chartInstance.value.update();
};

const debouncedUpdate = debounce(updateChart, 300);

// 監聽 props 變更，觸發重繪
watch(() => props, () => { debouncedUpdate(); }, { deep: true });

onMounted(() => nextTick(initChart));
onUnmounted(() => chartInstance.value?.destroy());
</script>
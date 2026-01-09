<template>
    <el-card shadow="never" :class="{ 'danger-border': isDanger }">
        <template #header>
            <div class="card-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <el-icon :size="20" :color="isDanger ? '#F56C6C' : '#67C23A'">
                        <component :is="isDanger ? 'Warning' : 'CircleCheck'" />
                    </el-icon>
                    <span style="font-weight: bold; font-size: 16px;">退休資金缺口分析 (提領期)</span>
                </div>
                <el-tag :type="isDanger ? 'danger' : 'success'" effect="dark">
                    {{ statusText }}
                </el-tag>
            </div>
        </template>

        <el-row :gutter="24">
            <el-col :span="8" :xs="24">

                <div class="stat-block">
                    <div class="label">勞退一次金 (稅後淨額)</div>
                    <div class="value">{{ formatMoney(predictedNetLumpSum) }}</div>
                    <div class="sub">
                        於 {{ retirementAge }} 歲可領，
                        <span v-if="retirementAge < startSimulationAge">
                            滾存至 {{ startSimulationAge }} 歲啟用
                        </span>
                        <span v-else>
                            模擬起點注入
                        </span>
                    </div>
                </div>

                <el-divider style="margin: 15px 0" />

                <div class="stat-block">
                    <div class="label">勞保年金 (每月領取)</div>
                    <div class="value">{{ formatMoney(predictedMonthlyAnnuity) }} / 月</div>
                    <div class="sub">
                        於 {{ laborInsuranceParams.claimAge }} 歲起領，具抗通膨機制
                    </div>
                </div>

                <el-divider style="margin: 15px 0" />

                <div class="stat-block">
                    <div class="label">資產耗盡年齡</div>
                    <div class="value" :style="{ color: isDanger ? '#F56C6C' : '#67C23A' }">
                        {{ depletionAgeText }}
                    </div>
                    <div class="sub" style="margin-top: 5px;">
                        * 模擬從 {{ startSimulationAge }} 歲 (最晚退休日) 開始扣款
                    </div>
                </div>
            </el-col>

            <el-col :span="16" :xs="24">
                <div style="height: 300px; width: 100%;">
                    <canvas ref="gapChartCanvas"></canvas>
                </div>
            </el-col>
        </el-row>

        <div style="margin-top: 20px;">
            <el-alert v-if="isDanger" title="資金缺口警示" type="error"
                :description="`從 ${startSimulationAge} 歲完全退休後，您的資產預計在 ${depletionAge} 歲耗盡。`" show-icon
                :closable="false" />
            <el-alert v-else title="規劃穩健" type="success"
                :description="`恭喜！從 ${startSimulationAge} 歲完全退休後，您的資產足以支應至 ${lifeExpectancy} 歲以後。`" show-icon
                :closable="false" />
        </div>

    </el-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick, shallowRef } from 'vue';
import { Warning, CircleCheck } from '@element-plus/icons-vue';
import Chart from 'chart.js/auto';
import type { UserFormState } from './types/user';
import { useRetirementGapCalculator } from '@/components/plan/composables/useRetirementGapCalculator';

const model = defineModel<UserFormState>({ required: true });
const { runSimulation } = useRetirementGapCalculator();

// --- 基礎參數 ---
const currentYear = new Date().getFullYear();
const birthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return currentYear - 30;
    return new Date(dateStr).getFullYear();
});
const currentAge = computed(() => currentYear - birthYear.value);

// --- 1. 勞退參數 ---
const roi = computed(() => model.value.laborPension?.retirementRoi ?? 3.0);
const retirementAge = computed(() => model.value.laborPension?.expectedRetirementAge || 65);
const predictedNetLumpSum = computed(() => model.value.laborPension?.predictedNetLumpSum || 0);

// --- 2. 勞保參數 ---
const predictedMonthlyAnnuity = computed(() => model.value.laborInsurance?.predictedMonthlyAnnuity || 0);
const laborInsuranceParams = computed(() => ({
    claimAge: model.value.laborInsurance?.expectedClaimAge || 65,
    predictedMonthlyAnnuity: predictedMonthlyAnnuity.value
}));

// --- 3. 支出參數 ---
const expenseParams = computed(() => ({
    currentAge: currentAge.value,
    retirementAge: retirementAge.value,
    lifeExpectancy: Math.floor(retirementAge.value + (model.value.laborPension?.remainingLifeAtRetirement || 25)),
    baseMonthlyExpense: getBaseExpense(),
    medicalExpense: model.value.retirementQuality?.medicalExpense || 2000,
    disabilityExpense: model.value.retirementQuality?.disabilityExpense || 45000,
    dreamCoefficient: model.value.retirementQuality?.dreamCoefficient || 1.2,
    disabilityAge: model.value.retirementQuality?.disabilityAge || 75,
    livingExpenseAdjustment: model.value.retirementQuality?.livingExpenseAdjustment || 1.0
}));

function getBaseExpense() {
    const cards = model.value.creditCards;
    let total = 0;
    if (Array.isArray(cards)) {
        total = cards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0);
    }
    return total > 0 ? total : 30000;
}

// --- 核心：執行模擬 ---
const simulationData = computed(() => {
    return runSimulation({
        birthYear: birthYear.value,
        laborPension: {
            retirementAge: retirementAge.value,
            predictedNetLumpSum: predictedNetLumpSum.value,
            roi: roi.value
        },
        laborInsurance: laborInsuranceParams.value,
        expenseParams: expenseParams.value
    });
});

// 計算模擬起點 (UI顯示用)
const startSimulationAge = computed(() =>
    Math.max(retirementAge.value, laborInsuranceParams.value.claimAge)
);

// --- 結果指標 ---
const lifeExpectancy = computed(() => expenseParams.value.lifeExpectancy);

const depletionAge = computed(() => {
    const depletedYear = simulationData.value.find(d => d.isDepleted);
    return depletedYear ? depletedYear.age : null;
});
const depletionAgeText = computed(() => depletionAge.value ? `${depletionAge.value} 歲` : '安全 (未耗盡)');
const isDanger = computed(() => depletionAge.value !== null && depletionAge.value < lifeExpectancy.value);
const statusText = computed(() => isDanger.value ? '資金不足' : '規劃穩健');

// --- Chart Logic ---
const gapChartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart | null>(null);

const initChart = () => {
    if (!gapChartCanvas.value) return;
    const ctx = gapChartCanvas.value.getContext('2d');
    if (!ctx) return;

    const displayData = simulationData.value;
    const labels = displayData.map(d => `${d.age}`);
    const assets = displayData.map(d => d.assetsBalance);
    const zeroLine = displayData.map(() => 0);

    chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '資產剩餘金額',
                    data: assets,
                    borderColor: '#409EFF',
                    backgroundColor: (ctx) => {
                        const canvas = ctx.chart.ctx;
                        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(64, 158, 255, 0.4)');
                        gradient.addColorStop(1, 'rgba(64, 158, 255, 0.0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: '破產警戒線',
                    data: zeroLine,
                    borderColor: '#F56C6C',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (c) => `剩餘資產: ${Math.round(c.parsed.y).toLocaleString()}`,
                        footer: (items) => {
                            const idx = items[0].dataIndex;
                            const d = displayData[idx];
                            // 顯示當年流入細節
                            let notes = [];
                            if (d.inflowLumpSum > 0) notes.push(`勞退入帳: +${formatMoney(d.inflowLumpSum)}`);

                            return [
                                ...notes,
                                `年收入(勞保): +${formatMoney(d.inflowAnnuity)}`,
                                `年支出(總額): -${formatMoney(d.outflowExpense)}`
                            ].join('\n');
                        }
                    }
                },
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: { ticks: { callback: (val) => (Number(val) / 10000).toFixed(0) + '萬' } }
            }
        }
    });
};

const updateChart = () => {
    if (!chartInstance.value) { initChart(); return; }
    const displayData = simulationData.value;
    chartInstance.value.data.labels = displayData.map(d => `${d.age}`);
    chartInstance.value.data.datasets[0].data = displayData.map(d => d.assetsBalance);
    chartInstance.value.data.datasets[1].data = displayData.map(() => 0);
    chartInstance.value.update();
};

const debouncedUpdate = (() => {
    let timer: any;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(updateChart, 300);
    };
})();

watch(simulationData, debouncedUpdate);
onMounted(() => nextTick(initChart));

function formatMoney(val: number) { return Math.round(val).toLocaleString(); }
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-block {
    margin-bottom: 10px;
}

.label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
}

.value {
    font-size: 24px;
    font-weight: bold;
    color: var(--el-text-color-primary);
}

.sub {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 2px;
}

.danger-border {
    border: 1px solid var(--el-color-danger-light-5);
}
</style>
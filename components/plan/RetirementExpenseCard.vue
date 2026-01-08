<template>
    <el-card shadow="never">
        <el-form :model="localData" label-position="top">

            <el-divider>退休品質參數設定</el-divider>

            <el-row :gutter="20">

                <el-col :span="12" :xs="24">
                    <el-form-item label="真實月開銷基數 (信用卡帳單加總)">
                        <el-input :value="formatMoney(baseMonthlyExpense)" disabled>
                            <template #suffix>元/月</template>
                        </el-input>
                        <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 4px;">
                            * 此金額由您輸入的各張信用卡平均月消費自動加總
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預計退休/請領年齡">
                        <el-input :value="retirementAge" disabled>
                            <template #suffix>歲</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估額外醫療支出 (月)">
                        <el-input-number v-model="localData.medicalExpense" :min="0" :step="1000" style="width: 100%">
                            <template #suffix>元</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估失能/長照啟動年齡">
                        <el-input-number v-model="localData.disabilityAge" :min="retirementAge + 1" :max="100"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="長照照顧模式配置">
                        <el-select v-model="localData.careMode" placeholder="請選擇照顧模式" style="width: 100%"
                            @change="handleCareModeChange">
                            <el-option v-for="opt in careCostOptions" :key="opt.key" :label="opt.label"
                                :value="opt.key">
                                <span style="float: left">{{ opt.label }}</span>
                                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                                    {{ formatMoney(opt.amount) }}元
                                </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估失能照護費用 (月)">
                        <el-input-number v-model="localData.disabilityExpense" :min="0" :step="1000"
                            style="width: 100%">
                            <template #suffix>元</template>
                        </el-input-number>
                        <div v-if="currentCareModeNote"
                            style="font-size: 12px; color: var(--el-text-color-secondary); line-height: 1.4; margin-top: 4px;">
                            <el-icon style="vertical-align: middle">
                                <InfoFilled />
                            </el-icon>
                            {{ currentCareModeNote }}
                        </div>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-alert title="階段性支出說明" type="info" :closable="false" show-icon style="margin-bottom: 20px;">
                <div>1. 活躍期 ({{ retirementAge }}~{{ localData.disabilityAge }}歲): 額外提撥 20% 圓夢預算。</div>
                <div v-if="localData.livingExpenseAdjustment < 1">
                    2. 失能期 ({{ localData.disabilityAge }}歲~): 選擇機構照護，基本生活費調整為 {{
                        Math.round(localData.livingExpenseAdjustment * 100)
                    }}% (因機構已含食宿)。
                </div>
                <div v-else>
                    2. 失能期 ({{ localData.disabilityAge }}歲~): 圓夢預算取消，轉為照護支出。
                </div>
            </el-alert>

            <el-divider>退休全期開支變化預測</el-divider>

            <div style="position: relative; height: 400px; width: 100%;">
                <canvas ref="chartCanvas"></canvas>
            </div>

            <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="12">
                    <el-statistic title="活躍期預估月開銷 (含圓夢加給)" :value="activePhaseMonthlyTotal">
                        <template #suffix>元</template>
                    </el-statistic>
                </el-col>
                <el-col :span="12">
                    <el-statistic title="失能期預估月開銷 (含照護費)" :value="passivePhaseMonthlyTotal"
                        value-style="color: var(--el-color-danger)">
                        <template #suffix>元</template>
                    </el-statistic>
                </el-col>
            </el-row>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
import { debounce } from 'lodash-es';
import { InfoFilled } from '@element-plus/icons-vue';
import Chart from 'chart.js/auto';
import type { UserFormState } from './types/user';

// --- 1. Props 定義 ---
interface CareOptionItem {
    key: string;
    label: string;
    amount: number;
    livingExpenseAdjustment: number;
    note: string;
    sort?: number;
}

const props = defineProps<{
    metadata: {
        opt_care_costs?: {
            list: CareOptionItem[]
        }
    }
}>();

const model = defineModel<UserFormState>({ required: true });

// --- 2. 資料來源 ---
const careCostOptions = computed(() => {
    return props.metadata?.opt_care_costs?.list || [];
});

const FIXED_DREAM_COEFFICIENT = 1.2;

interface QualitySettings {
    medicalExpense: number;
    disabilityAge: number;
    disabilityExpense: number;
    careMode?: string;
    livingExpenseAdjustment?: number;
}

const localData = computed({
    get: () => {
        const defaults = {
            medicalExpense: 3000,
            disabilityAge: 80,
            disabilityExpense: 45000,
            careMode: 'day_care',
            livingExpenseAdjustment: 1.0
        };
        return { ...defaults, ...model.value.retirementQuality };
    },
    set: (val: QualitySettings) => {
        model.value.retirementQuality = val;
    }
});

// --- 修改核心：計算真實月開銷基數 ---
const baseMonthlyExpense = computed(() => {
    const cards = model.value.creditCards;
    let total = 0;

    // 如果 creditCards 存在且為陣列，進行加總
    if (Array.isArray(cards)) {
        total = cards.reduce((sum, card) => {
            return sum + (Number(card.averageMonthlyExpense) || 0);
        }, 0);
    }

    // 若加總結果大於 0，回傳加總值；否則回傳預設值 30000 (避免圖表全空)
    return total > 0 ? total : 30000;
});

const retirementAge = computed(() => model.value.laborInsurance?.expectedClaimAge || 65);
const lifeExpectancy = computed(() => {
    const remaining = model.value.laborInsurance?.predictedRemainingLife || 25;
    return Math.floor(retirementAge.value + remaining);
});

// 顯示當前模式的備註
const currentCareModeNote = computed(() => {
    const mode = localData.value.careMode;
    const opt = careCostOptions.value.find(o => o.key === mode);
    return opt ? opt.note : '';
});

// --- 3. 邏輯處理 ---

function handleCareModeChange(key: string) {
    const opt = careCostOptions.value.find(o => o.key === key);
    if (opt) {
        const newData = { ...localData.value };
        newData.disabilityExpense = opt.amount;
        newData.livingExpenseAdjustment = opt.livingExpenseAdjustment;
        localData.value = newData;
    }
}

// --- 4. 統計計算 ---
const activePhaseMonthlyTotal = computed(() => {
    return Math.round(
        (baseMonthlyExpense.value * FIXED_DREAM_COEFFICIENT) +
        localData.value.medicalExpense
    );
});

const passivePhaseMonthlyTotal = computed(() => {
    const adj = localData.value.livingExpenseAdjustment ?? 1.0;

    return Math.round(
        (baseMonthlyExpense.value * adj) +
        localData.value.disabilityExpense +
        localData.value.medicalExpense
    );
});

// --- 5. Chart.js 圖表邏輯 ---
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = shallowRef<Chart | null>(null);

const generateChartData = () => {
    const startAge = retirementAge.value;
    const endAge = lifeExpectancy.value;
    const disAge = localData.value.disabilityAge;
    const adj = localData.value.livingExpenseAdjustment ?? 1.0;

    const labels: string[] = [];
    const dataBase: number[] = [];
    const dataDream: number[] = [];
    const dataMedical: number[] = [];
    const dataCare: number[] = [];

    for (let age = startAge; age <= endAge; age++) {
        labels.push(`${age}歲`);

        dataMedical.push(localData.value.medicalExpense);

        if (age < disAge) {
            // [活躍期]
            dataBase.push(baseMonthlyExpense.value);
            const dreamAmount = Math.round(baseMonthlyExpense.value * (FIXED_DREAM_COEFFICIENT - 1));
            dataDream.push(dreamAmount);
            dataCare.push(0);
        } else {
            // [失能期]
            dataBase.push(Math.round(baseMonthlyExpense.value * adj));
            dataDream.push(0);
            dataCare.push(localData.value.disabilityExpense);
        }
    }

    return { labels, dataBase, dataDream, dataMedical, dataCare };
};

const initChart = () => {
    if (!chartCanvas.value) return;
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;

    const { labels, dataBase, dataDream, dataMedical, dataCare } = generateChartData();

    chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: '基本生活', data: dataBase, backgroundColor: '#91cc75', stack: 'Stack 0' },
                { label: '醫療支出', data: dataMedical, backgroundColor: '#73c0de', stack: 'Stack 0' },
                { label: '圓夢品質', data: dataDream, backgroundColor: '#fac858', stack: 'Stack 0' },
                { label: '失能照護', data: dataCare, backgroundColor: '#ee6666', stack: 'Stack 0' }
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
                    ticks: { callback: (val) => (Number(val) / 10000) + '萬' },
                    title: { display: true, text: '月支出 (元)' }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            let label = ctx.dataset.label || '';
                            if (label) label += ': ';
                            if (ctx.parsed.y !== null) label += formatMoney(ctx.parsed.y);
                            return label;
                        },
                        footer: (items) => {
                            let sum = 0;
                            items.forEach((item) => sum += item.parsed.y);
                            return '總月開銷: ' + formatMoney(sum);
                        }
                    }
                },
                legend: { position: 'bottom' }
            }
        }
    });
};

const updateChart = () => {
    if (!chartInstance.value) { initChart(); return; }
    const { labels, dataBase, dataDream, dataMedical, dataCare } = generateChartData();
    chartInstance.value.data.labels = labels;
    chartInstance.value.data.datasets[0].data = dataBase;
    chartInstance.value.data.datasets[1].data = dataMedical;
    chartInstance.value.data.datasets[2].data = dataDream;
    chartInstance.value.data.datasets[3].data = dataCare;
    chartInstance.value.update();
};

const debouncedUpdate = debounce(updateChart, 300);

watch(
    [
        () => localData.value,
        baseMonthlyExpense,
        retirementAge,
        lifeExpectancy,
        careCostOptions
    ],
    () => { debouncedUpdate(); },
    { deep: true }
);

onMounted(() => { nextTick(() => { initChart(); }); });
onUnmounted(() => { if (chartInstance.value) { chartInstance.value.destroy(); chartInstance.value = null; } });

function formatMoney(val: number) { return Math.round(val).toLocaleString(); }
</script>
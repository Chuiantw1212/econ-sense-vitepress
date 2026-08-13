<template>
    <el-card shadow="never">
        <el-form v-if="model.laborPension" :model="model" label-width="auto" label-position="top">

            <el-divider>退休參數設定</el-divider>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item :label="`預計請領年齡 (距請領 ${futureWorkYears} 年)`">
                        <el-input-number v-model="model.laborPension.expectedRetirementAge" :min="minClaimingAge"
                            :max="80" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="預估年化報酬率 (%)">
                        <el-input-number v-model="model.laborPension.retirementRoi" :precision="2" :step="0.5" :min="0"
                            :max="15" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>現有資產明細 (PV)</el-divider>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="雇主提繳-累計金額">
                        <el-input-number v-model="model.laborPension.employerContribution" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="個人自提-累計金額">
                        <el-input-number v-model="model.laborPension.personalContribution" :min="0" :step="10000"
                        style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="雇主提繳-累計收益">
                        <el-input-number v-model="model.laborPension.employerEarnings" :min="0" :step="5000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="個人自提-累計收益">
                        <el-input-number v-model="model.laborPension.personalEarnings" :min="0" :step="5000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>年資與未來規劃 (PMT)</el-divider>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item
                        :label="`已累積年資 (${model.laborPension.currentWorkSeniority}月 ≈ ${(model.laborPension.currentWorkSeniority / 12).toFixed(1)}年)`"
                        required>
                        <el-input-number v-model="model.laborPension.currentWorkSeniority" :min="0" :max="720"
                            placeholder="輸入總月數" style="width: 100%">
                            <template #suffix>月</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="未來每月持續投入 (PMT)">
                        <el-input :model-value="formatMoney(monthlyContributionPMT)" disabled style="width: 100%">
                            <template #prefix>$</template>
                        </el-input>
                        <!-- <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 5px;">
                            * 此金額來自「職業試算卡片」的薪資提撥設定
                        </div> -->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>資產累積差異分析</el-divider>
            <el-row :gutter="20">
                <el-col :span="24">
                    <PensionComparisonChart :labels="chartLabels" :total-data="chartTotalData"
                        :employer-data="chartEmployerData" />
                    <div style="text-align: center; margin-top: 15px; font-size: 13px; color: #606266;">
                        透過自提預估可多累積:
                        <b style="color: var(--el-color-primary)">
                            {{ formatMoney(finalProjectedFV - finalEmployerFV) }}
                        </b>
                    </div>
                </el-col>
            </el-row>

            <el-divider>試算結果 (FV)</el-divider>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-statistic title="預估應繳稅額 (退職所得)" :value="taxResult.final.taxAmount" :precision="0"
                        :value-style="{ color: taxResult.final.taxAmount > 0 ? 'var(--el-color-danger)' : 'var(--el-text-color-regular)' }">
                        <template #suffix>元</template>
                    </el-statistic>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-statistic title="稅後實拿淨額" :value="taxResult.final.netReceive" :precision="0"
                        value-style="color: var(--el-color-primary); font-weight: bold;">
                        <template #suffix>元</template>
                    </el-statistic>
                    <!-- <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 5px;">
                        * 此金額將作為退休缺口分析的資產基準
                    </div> -->
                </el-col>
            </el-row>

        </el-form>

        <el-skeleton v-else :rows="5" animated />
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { UserFormState, UserLaborPension } from './types/user';
import { useApi } from '@/components/plan/composables/useApi';
import { useFinancialCalculator } from '@/components/plan/composables/useFinancialCalculator';
import { useRetirementTaxCalculator } from '@/components/plan/composables/useRetirementTaxCalculator';
import PensionComparisonChart from './charts/PensionComparisonChart.vue';

const { authFetch } = useApi();
const { calcRetirementFVSeries } = useFinancialCalculator();
const { getTaxableIncomeBuckets, calculateFinalTaxAndNet } = useRetirementTaxCalculator();
const model = defineModel<UserFormState>({ required: true });

// --- 1. 初始化邏輯 ---
const defaultLaborPension: UserLaborPension = {
    expectedRetirementAge: 65,
    remainingLifeAtRetirement: 20,
    retirementRoi: 3.0,
    employerContribution: 0,
    employerEarnings: 0,
    personalContribution: 0,
    personalEarnings: 0,
    currentWorkSeniority: 0,
    predictedLumpSum: 0,     // 新增
    predictedNetLumpSum: 0   // 新增
};

watch(
    () => model.value,
    (newVal) => {
        if (newVal && !newVal.laborPension) {
            newVal.laborPension = { ...defaultLaborPension };
        }
    },
    { immediate: true, deep: true }
);

// --- 2. 基礎參數計算 ---
const currentYear = new Date().getFullYear();
const userBirthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return 1990;
    return new Date(dateStr).getFullYear();
});
const currentAge = computed(() => currentYear - userBirthYear.value);
const minClaimingAge = computed(() => Math.max(60, currentAge.value));

const futureWorkYears = computed(() => {
    if (!model.value.laborPension) return 0;
    const years = model.value.laborPension.expectedRetirementAge - currentAge.value;
    return years > 0 ? years : 0;
});

const calculatedTaxSeniority = computed(() => {
    if (!model.value.laborPension) return 0;
    return (model.value.laborPension.currentWorkSeniority || 0) / 12 + futureWorkYears.value;
});

// --- 3. 資金參數 ---
const totalLaborPensionPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) + (lp.employerEarnings || 0) + (lp.personalContribution || 0) + (lp.personalEarnings || 0);
});

const employerOnlyPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) + (lp.employerEarnings || 0);
});

const monthlyContributionPMT = computed(() => model.value.career?.pensionTotalAmount || 0);
const employerOnlyPMT = computed(() => model.value.career?.pensionEmployerAmount || 0);

// --- 4. 複利序列計算 ---
const totalSeries = computed(() => {
    return calcRetirementFVSeries(
        model.value.laborPension?.retirementRoi || 0,
        futureWorkYears.value,
        monthlyContributionPMT.value,
        totalLaborPensionPV.value
    );
});

const employerSeries = computed(() => {
    return calcRetirementFVSeries(
        model.value.laborPension?.retirementRoi || 0,
        futureWorkYears.value,
        employerOnlyPMT.value,
        employerOnlyPV.value
    );
});

// Chart Data
const chartLabels = computed(() => totalSeries.value.map((_, i) => `${currentAge.value + i}歲`));
const chartTotalData = computed(() => totalSeries.value);
const chartEmployerData = computed(() => employerSeries.value);

// --- 5. 終值結果 ---
const finalProjectedFV = computed(() => {
    const data = totalSeries.value;
    return data.length > 0 ? data[data.length - 1] : totalLaborPensionPV.value;
});

const finalEmployerFV = computed(() => {
    const data = employerSeries.value;
    return data.length > 0 ? data[data.length - 1] : employerOnlyPV.value;
});

// --- 6. 稅務計算 ---
const taxResult = computed(() => {
    const totalFV = finalProjectedFV.value;
    const yearsService = calculatedTaxSeniority.value;
    const yearsIntoFuture = Math.max(0, futureWorkYears.value);

    // 計算級距與稅額
    const buckets = getTaxableIncomeBuckets(totalFV, yearsService, yearsIntoFuture);
    const final = calculateFinalTaxAndNet(buckets.totalTaxableIncome, totalFV, yearsIntoFuture);

    return { buckets, final };
});

// --- 7. [新增] 同步計算結果回 Model ---
// 這是讓下一張卡片能拿到資料的關鍵
watch(
    taxResult,
    (newVal) => {
        if (model.value.laborPension && newVal.final) {
            // 寫入稅前總額
            model.value.laborPension.predictedLumpSum = finalProjectedFV.value;
            // 寫入稅後淨額 (Critical Data)
            model.value.laborPension.predictedNetLumpSum = newVal.final.netReceive;
        }
    },
    { immediate: true }
);

// --- 8. 存檔與 Helper ---
function formatMoney(val: number | undefined) {
    if (val === undefined) return '0';
    return Math.round(val).toLocaleString();
}

async function performSave() {
    const item = model.value.laborPension;
    if (!item) return;
    try {
        await authFetch(`/api/v1/user/labor-pension`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    } catch (error) {
        console.error('[AutoSave] Failed:', error);
    }
}

const debouncedSave = debounce(performSave, 800);

// 當 model 內的數值變動 (包含我們剛寫入的 predictedNetLumpSum)，觸發存檔
watch(
    () => model.value.laborPension,
    (newVal) => { if (newVal) debouncedSave(); },
    { deep: true }
);
</script>
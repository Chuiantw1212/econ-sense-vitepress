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
                    <el-form-item label="雇主提繳-累計收益">
                        <el-input-number v-model="model.laborPension.employerEarnings" :min="0" :step="5000"
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
                        <el-input-number :model-value="monthlyContributionPMT" disabled
                            :formatter="(val: number) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            style="width: 100%" />
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
                    <el-statistic title="預估應繳稅額" :value="taxResult.final.taxAmount" :precision="0"
                        :value-style="{ color: taxResult.final.taxAmount > 0 ? 'var(--el-color-danger)' : 'var(--el-text-color-regular)' }" />
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-statistic title="稅後實拿淨額" :value="taxResult.final.netReceive" :precision="0"
                        value-style="color: var(--el-color-primary); font-weight: bold;" />
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
import type { LifeExpectancyRes } from './types/util';
import { useApi } from '@/components/plan/composables/useApi';
import { useFinancialCalculator } from '@/components/plan/composables/useFinancialCalculator';
import { useRetirementTaxCalculator } from '@/components/plan/composables/useRetirementTaxCalculator';

// 引入您建立的 Chart 元件 (請確認路徑正確)
import PensionComparisonChart from './charts/PensionComparisonChart.vue';

const { authFetch } = useApi();
const { calcRetirementFVSeries } = useFinancialCalculator();
const { getTaxableIncomeBuckets, calculateFinalTaxAndNet } = useRetirementTaxCalculator();
const model = defineModel<UserFormState>({ required: true });

// --- 1. 預設值與初始化 ---
const defaultLaborPension: UserLaborPension = {
    expectedRetirementAge: 65,
    remainingLifeAtRetirement: 20,
    retirementRoi: 3.0,
    employerContribution: 0,
    employerEarnings: 0,
    personalContribution: 0,
    personalEarnings: 0,
    currentWorkSeniority: 0
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

// --- 2. 時間與年資計算 ---
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

// 總累積年資 (稅務用) = 目前已累積(月/12) + 未來工作年數
const calculatedTaxSeniority = computed(() => {
    if (!model.value.laborPension) return 0;
    return (model.value.laborPension.currentWorkSeniority || 0) / 12 + futureWorkYears.value;
});

// --- 3. 資金運算 (PV & PMT) ---

// A. 現有資產 (PV) - 總額
const totalLaborPensionPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) +
        (lp.employerEarnings || 0) +
        (lp.personalContribution || 0) +
        (lp.personalEarnings || 0);
});

// B. 現有資產 (PV) - 僅雇主
const employerOnlyPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) + (lp.employerEarnings || 0);
});

// C. 未來投入 (PMT) - 總額 (來自 CareerCard 計算)
const monthlyContributionPMT = computed(() => {
    return model.value.career?.pensionTotalAmount || 0;
});

// D. 未來投入 (PMT) - 僅雇主
const employerOnlyPMT = computed(() => {
    return model.value.career?.pensionEmployerAmount || 0;
});

// --- 4. 圖表資料準備 (Series Calculation) ---

// 序列 A: 總資產 (雇主+自提)
const totalSeries = computed(() => {
    return calcRetirementFVSeries(
        model.value.laborPension?.retirementRoi || 0,
        futureWorkYears.value,
        monthlyContributionPMT.value,
        totalLaborPensionPV.value
    );
});

// 序列 B: 僅雇主
const employerSeries = computed(() => {
    return calcRetirementFVSeries(
        model.value.laborPension?.retirementRoi || 0,
        futureWorkYears.value,
        employerOnlyPMT.value,
        employerOnlyPV.value
    );
});

// Chart Props: Labels
const chartLabels = computed(() => {
    const startAge = currentAge.value;
    // totalSeries 的長度代表 0 ~ N 年
    return totalSeries.value.map((_, i) => `${startAge + i}歲`);
});

// Chart Props: Data
const chartTotalData = computed(() => totalSeries.value);
const chartEmployerData = computed(() => employerSeries.value);

// --- 5. 最終數值 (Final Values) ---

// 預估總終值
const finalProjectedFV = computed(() => {
    const data = totalSeries.value;
    return data.length > 0 ? data[data.length - 1] : totalLaborPensionPV.value;
});

// 預估僅雇主終值 (用於計算差異)
const finalEmployerFV = computed(() => {
    const data = employerSeries.value;
    return data.length > 0 ? data[data.length - 1] : employerOnlyPV.value;
});

// --- 6. 稅務試算 (含通膨校正) ---
const taxResult = computed(() => {
    const totalFV = finalProjectedFV.value;
    const yearsService = calculatedTaxSeniority.value;

    // 計算距離退休還有幾年，用於通膨調整免稅額
    const yearsIntoFuture = Math.max(0, futureWorkYears.value);

    // 1. 取得退職所得級距
    const buckets = getTaxableIncomeBuckets(totalFV, yearsService, yearsIntoFuture);

    // 2. 計算最終稅額與淨額
    const final = calculateFinalTaxAndNet(buckets.totalTaxableIncome, totalFV, yearsIntoFuture);

    return { buckets, final };
});

// --- 7. 輔助函式與 API ---

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

watch(
    () => model.value.laborPension,
    (newVal) => { if (newVal) debouncedSave(); },
    { deep: true }
);
</script>
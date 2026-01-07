<template>
    <el-card shadow="never">
        <template #header>
            <el-row justify="space-between" align="middle">
                <el-col :span="16">
                    <el-text size="large" tag="b">勞退終值預估與稅務規劃</el-text>
                </el-col>
                <el-col :span="8" style="text-align: right">
                    <el-tag type="info" effect="plain">複利滾存預測</el-tag>
                </el-col>
            </el-row>
        </template>

        <el-form :model="model" label-width="auto" label-position="top">

            <el-divider content-position="left">1. 退休參數設定</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="預計退休年齡">
                        <el-input-number v-model="model.expected_retirement_age" :min="currentAge" :max="80"
                            style="width: 100%" />
                        <div class="sub-label">
                            目前 {{ currentAge }} 歲，距退休 {{ futureWorkYears }} 年
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估投資報酬率 (%)">
                        <el-input-number v-model="model.retirement_roi" :precision="2" :step="0.5" :min="0" :max="15"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="退休時預估餘命">
                        <el-input-number v-model="model.remaining_life_at_retirement" disabled :precision="0"
                            style="width: 100%">
                            <template #suffix>年</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">2. 勞工退休金專戶累計 (現值 PV)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="雇主提繳累計金額">
                        <el-input-number v-model="model.employer_contribution" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="雇主提繳收益累計">
                        <el-input-number v-model="model.employer_earnings" :min="0" :step="5000" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="個人提繳累計金額">
                        <el-input-number v-model="model.personal_contribution" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="個人提繳收益累計">
                        <el-input-number v-model="model.personal_earnings" :min="0" :step="5000" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20"
                style="background-color: var(--el-fill-color-light); padding: 15px 0; border-radius: 4px; margin: 0;">
                <el-col :span="12">
                    <el-form-item label="目前已累積工作年資" style="margin-bottom: 0;">
                        <el-input-number v-model="model.current_work_seniority" :min="0" :max="60"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" style="display: flex; align-items: center;">
                    <div style="font-size: 0.9rem; color: var(--el-text-color-regular);">
                        <div style="margin-bottom: 4px;">目前專戶現值 (PV): <b>{{ formatMoney(totalLaborPensionPV) }}</b>
                        </div>
                        <div>
                            預計總年資: {{ model.current_work_seniority }} (已累) + {{ futureWorkYears }} (未來) = <b>{{
                                calculatedTaxSeniority }} 年</b>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-divider content-position="left">3. 退休領取總額與稅務預估 (終值 FV)</el-divider>

            <el-descriptions border :column="1" size="default">

                <el-descriptions-item label="預估領取總額 (FV)">
                    <span style="font-weight: bold; font-size: 1.1em;">{{ formatMoney(projectedLumpSumFV) }}</span>
                </el-descriptions-item>

                <el-descriptions-item label="稅務試算明細">
                    <div class="tax-detail-row">
                        <span class="detail-label">免稅額度 ({{ (19.8 * calculatedTaxSeniority).toFixed(1) }}萬內):</span>
                        <span class="detail-value">- {{ formatMoney(taxResult.tier1Exempt) }}</span>
                    </div>
                    <div class="tax-detail-row">
                        <span class="detail-label">半數課稅 ({{ (19.8 * calculatedTaxSeniority).toFixed(1) }}~{{ (39.8 *
                            calculatedTaxSeniority).toFixed(1) }}萬):</span>
                        <span class="detail-value">計入 {{ formatMoney(taxResult.tier2Taxable) }}</span>
                    </div>
                    <div class="tax-detail-row">
                        <span class="detail-label">全數課稅 (超過 {{ (39.8 * calculatedTaxSeniority).toFixed(1) }}萬):</span>
                        <span class="detail-value">計入 {{ formatMoney(taxResult.tier3Taxable) }}</span>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item label="預估應繳稅額">
                    {{ formatMoney(finalTaxableIncome) }}
                </el-descriptions-item>

                <el-descriptions-item label="稅後實拿金額 (Net)">
                    <span style="color: var(--el-color-primary); font-weight: bold; font-size: 1.2em;">
                        {{ formatMoney(projectedLumpSumFV - finalTaxableIncome) }}
                    </span>
                </el-descriptions-item>

            </el-descriptions>

            <div style="margin-top: 15px; font-size: 12px; color: var(--el-text-color-secondary);">
                * 試算假設現有資金以固定報酬率複利滾存至退休，未包含未來每個月持續提撥的新增金額 (保守估計)。
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

interface RetirementPlan {
    expected_retirement_age: number;
    remaining_life_at_retirement: number;
    retirement_roi: number;
    employer_contribution: number;
    employer_earnings: number;
    personal_contribution: number;
    personal_earnings: number;
    current_work_seniority: number;
}

const props = withDefaults(defineProps<{
    gender?: 'MALE' | 'FEMALE';
    birthYear?: number;
}>(), {
    gender: 'MALE',
    birthYear: 1963
});

const model = defineModel<RetirementPlan>({
    default: () => ({
        expected_retirement_age: 65,
        remaining_life_at_retirement: 20,
        retirement_roi: 3.0,
        employer_contribution: 1500000,
        employer_earnings: 300000,
        personal_contribution: 1500000,
        personal_earnings: 300000,
        current_work_seniority: 25
    })
});

// --- 時間運算 ---
const currentYear = new Date().getFullYear();
const currentAge = computed(() => currentYear - props.birthYear);

const futureWorkYears = computed(() => {
    const years = model.value.expected_retirement_age - currentAge.value;
    return years > 0 ? years : 0;
});

const calculatedTaxSeniority = computed(() => {
    return (model.value.current_work_seniority || 0) + futureWorkYears.value;
});

// --- 資金運算 (PV -> FV) ---
const totalLaborPensionPV = computed(() => {
    return (model.value.employer_contribution || 0) +
        (model.value.employer_earnings || 0) +
        (model.value.personal_contribution || 0) +
        (model.value.personal_earnings || 0);
});

const projectedLumpSumFV = computed(() => {
    const pv = totalLaborPensionPV.value;
    const r = (model.value.retirement_roi || 0) / 100;
    const n = futureWorkYears.value;
    if (n <= 0) return pv;
    return Math.round(pv * Math.pow(1 + r, n));
});

// --- 稅務運算 (FV) ---
const taxResult = computed(() => {
    const N = calculatedTaxSeniority.value || 1;
    const totalFV = projectedLumpSumFV.value;

    const THRESHOLD_1 = 198000;
    const THRESHOLD_2 = 398000;

    const T1_Limit = THRESHOLD_1 * N;
    const T2_Limit = THRESHOLD_2 * N;

    let remaining = totalFV;

    const tier1Exempt = Math.min(remaining, T1_Limit);
    remaining = Math.max(0, remaining - T1_Limit);

    const tier2BandWidth = T2_Limit - T1_Limit;
    const tier2Amount = Math.min(remaining, tier2BandWidth);
    const tier2Taxable = tier2Amount * 0.5;
    remaining = Math.max(0, remaining - tier2BandWidth);

    const tier3Taxable = remaining;

    return {
        tier1Exempt,
        tier2Taxable,
        tier3Taxable
    };
});

const finalTaxableIncome = computed(() => {
    return taxResult.value.tier2Taxable + taxResult.value.tier3Taxable;
});

// --- API 模擬 ---
const fetchRemainingLifespan = async () => {
    let baseLife = 85;
    if (props.gender === 'FEMALE') baseLife = 89;
    const lifespan = Math.max(0, baseLife - model.value.expected_retirement_age);
    model.value.remaining_life_at_retirement = lifespan;
};

watch(
    () => model.value.expected_retirement_age,
    () => { fetchRemainingLifespan(); },
    { immediate: true }
);

watch(
    () => [props.gender, props.birthYear],
    () => { fetchRemainingLifespan(); }
);

const formatMoney = (val: number) => {
    return Math.round(val).toLocaleString() + ' 元';
};
</script>

<style scoped>
.sub-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.2;
    margin-top: 4px;
}

.tax-detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 14px;
    color: var(--el-text-color-regular);
}

.detail-label {
    color: var(--el-text-color-secondary);
}

.detail-value {
    font-family: var(--el-font-family-monospace);
}
</style>
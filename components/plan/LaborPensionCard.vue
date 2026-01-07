<template>
    <el-card shadow="never">
        <template #header>
            <el-row justify="space-between" align="middle">
                <el-col :span="16">
                    <el-text size="large" tag="b">勞退終值預估與稅務規劃</el-text>
                </el-col>
                <el-col :span="8" style="text-align: right">
                    <el-tag type="info" effect="plain">複利滾存 + 持續提撥</el-tag>
                </el-col>
            </el-row>
        </template>

        <el-form v-if="model.laborPension" :model="model" label-width="auto" label-position="top">

            <el-divider content-position="left">1. 退休參數設定</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="預計請領年齡 (依法需滿 60 歲)">
                        <el-input-number v-model="model.laborPension.expectedRetirementAge" :min="minClaimingAge"
                            :max="80" style="width: 100%" />
                        <div class="sub-label">
                            目前 {{ currentAge }} 歲，距請領 {{ futureWorkYears }} 年
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估投資報酬率 (%)">
                        <el-input-number v-model="model.laborPension.retirementRoi" :precision="2" :step="0.5" :min="0"
                            :max="15" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="請領時預估餘命">
                        <el-input-number v-model="model.laborPension.remainingLifeAtRetirement" disabled :precision="0"
                            style="width: 100%">
                            <template #suffix>年</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">2. 勞退資產累積來源</el-divider>

            <div class="section-title">A. 現有專戶累計 (截至目前)</div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="雇主提繳累計金額">
                        <el-input-number v-model="model.laborPension.employerContribution" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="雇主提繳收益累計">
                        <el-input-number v-model="model.laborPension.employerEarnings" :min="0" :step="5000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="個人提繳累計金額">
                        <el-input-number v-model="model.laborPension.personalContribution" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="個人提繳收益累計">
                        <el-input-number v-model="model.laborPension.personalEarnings" :min="0" :step="5000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="section-title" style="margin-top: 10px;">B. 未來持續提撥 (依據職業設定)</div>
            <el-row :gutter="20"
                style="background-color: #f5f7fa; padding: 15px 0; border-radius: 4px; margin: 0; border: 1px solid #e4e7ed;">

                <el-col :span="12">
                    <el-form-item label="每月持續存入 (PMT)" style="margin-bottom: 0;">
                        <el-input-number :model-value="monthlyContributionPMT" disabled
                            :formatter="(value: number) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            style="width: 100%" />
                        <div class="sub-label">
                            來自 [職業與收入] 設定 (雇主+自提)
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" style="display: flex; align-items: center;">
                    <div style="font-size: 0.9rem; color: #606266; width: 100%;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>現有資產 (PV):</span>
                            <b>{{ formatMoney(totalLaborPensionPV) }}</b>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>預計累積年資:</span>
                            <span>{{ calculatedTaxSeniority.toFixed(1) }} 年</span>
                        </div>
                    </div>
                </el-col>
            </el-row>


            <el-divider content-position="left">3. 退休領取總額與稅務預估 (終值 FV)</el-divider>

            <div class="result-panel">
                <div class="result-row main">
                    <span class="label">預估領取總額 (FV)</span>
                    <span class="value main-value">{{ formatMoney(finalProjectedFV) }}</span>
                </div>

                <div class="composition-row">
                    <span class="comp-item">舊資產滾存: {{ formatMoney(fvFromPV) }}</span>
                    <span class="comp-plus">+</span>
                    <span class="comp-item">新提撥累積: {{ formatMoney(fvFromPMT) }}</span>
                </div>

                <div class="separator"></div>

                <div class="tax-details">
                    <div class="detail-row">
                        <span>免稅額度 ({{ (19.8 * calculatedTaxSeniority).toFixed(1) }}萬內)</span>
                        <span class="deduction">- {{ formatMoney(taxResult.tier1Exempt) }}</span>
                    </div>
                    <div class="detail-row">
                        <span>半數課稅 ({{ (19.8 * calculatedTaxSeniority).toFixed(1) }}~{{ (39.8 *
                            calculatedTaxSeniority).toFixed(1) }}萬)</span>
                        <span>計入 {{ formatMoney(taxResult.tier2Taxable) }}</span>
                    </div>
                    <div class="detail-row">
                        <span>全數課稅 (超過 {{ (39.8 * calculatedTaxSeniority).toFixed(1) }}萬)</span>
                        <span>計入 {{ formatMoney(taxResult.tier3Taxable) }}</span>
                    </div>
                </div>

                <div class="separator dashed"></div>

                <div class="result-row">
                    <span class="label">預估應繳稅額 (Tax)</span>
                    <span class="value tax-value">{{ formatMoney(finalTaxableIncome) }}</span>
                </div>
                <div class="result-row net-row">
                    <span class="label">稅後實拿金額 (Net)</span>
                    <span class="value net-value">{{ formatMoney(finalProjectedFV - finalTaxableIncome) }}</span>
                </div>
            </div>

            <div style="margin-top: 15px; font-size: 12px; color: #909399;">
                * 試算假設：1. 現有資金以固定報酬率複利滾存。 2. 未來工作期間，每月持續提撥固定金額 (未考量加薪)，並採月複利計算。
            </div>

        </el-form>

        <el-skeleton v-else :rows="5" animated />
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
// 1. [新增] 引入 lodash-es 的 debounce
import { debounce } from 'lodash-es';
import type { UserFormState, UserLaborPension } from './types/user';
import type { LifeExpectancyRes } from './types/util';
import { useApi } from '@/components/plan/composables/useApi';

const { authFetch } = useApi();
const model = defineModel<UserFormState>({ required: true });

// ========================================================
// 1. 初始化與預設值
// ========================================================

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

// ========================================================
// 2. 時間與年資計算
// ========================================================

const currentYear = new Date().getFullYear();

const userBirthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return 1990;
    return new Date(dateStr).getFullYear();
});

const currentAge = computed(() => {
    return currentYear - userBirthYear.value;
});

const minClaimingAge = computed(() => Math.max(60, currentAge.value));

const futureWorkYears = computed(() => {
    if (!model.value.laborPension) return 0;
    const years = model.value.laborPension.expectedRetirementAge - currentAge.value;
    return years > 0 ? years : 0;
});

const calculatedTaxSeniority = computed(() => {
    if (!model.value.laborPension) return 0;
    // 輸入是月數，轉成年
    const currentYears = (model.value.laborPension.currentWorkSeniority || 0) / 12;
    return currentYears + futureWorkYears.value;
});

// ========================================================
// 3. 資金運算 (PV + PMT -> FV)
// ========================================================

// A. 現有資產 (PV)
const totalLaborPensionPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) +
        (lp.employerEarnings || 0) +
        (lp.personalContribution || 0) +
        (lp.personalEarnings || 0);
});

// B. 每月提撥 (PMT) - 來自 CareerCard
const monthlyContributionPMT = computed(() => {
    return model.value.career?.pensionTotalAmount || 0;
});

// C.1 計算舊資產終值 (FV from PV)
const fvFromPV = computed(() => {
    const pv = totalLaborPensionPV.value;
    const r = (model.value.laborPension?.retirementRoi || 0) / 100;
    const n = futureWorkYears.value;

    if (n <= 0) return pv;
    return Math.round(pv * Math.pow(1 + r, n));
});

// C.2 計算新提撥終值 (FV from PMT)
const fvFromPMT = computed(() => {
    const pmt = monthlyContributionPMT.value;
    const nYears = futureWorkYears.value;
    const annualRate = (model.value.laborPension?.retirementRoi || 0) / 100;

    if (nYears <= 0 || pmt <= 0) return 0;

    if (annualRate === 0) {
        return Math.round(pmt * nYears * 12);
    }

    const monthlyRate = annualRate / 12;
    const totalMonths = nYears * 12;

    const fv = pmt * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    return Math.round(fv);
});

// D. 總終值 (Total FV)
const finalProjectedFV = computed(() => {
    return fvFromPV.value + fvFromPMT.value;
});

// ========================================================
// 4. 稅務試算
// ========================================================

const taxResult = computed(() => {
    const N = calculatedTaxSeniority.value || 1;
    const totalFV = finalProjectedFV.value;

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

    return { tier1Exempt, tier2Taxable, tier3Taxable };
});

const finalTaxableIncome = computed(() => {
    return taxResult.value.tier2Taxable + taxResult.value.tier3Taxable;
});

// ========================================================
// 5. 工具函式
// ========================================================

function formatMoney(val: number) {
    return Math.round(val).toLocaleString() + ' 元';
}

// [移除] 手寫的 function debounce(...) { ... }

// ========================================================
// 6. API 與事件
// ========================================================

async function fetchRemainingLifespan() {
    const lp = model.value.laborPension;
    const profile = model.value.profile;

    if (!lp || !profile || !profile.birthDate || !profile.gender) return;

    const retireAge = lp.expectedRetirementAge;
    const birthYear = userBirthYear.value;
    const targetYear = birthYear + retireAge;

    try {
        const response = await authFetch(
            `/api/tools/life-expectancy?year=${targetYear}&gender=${profile.gender}&age=${retireAge}`,
            { method: 'GET' }
        );

        if (response && response.ok) {
            const data = (await response.json()) as LifeExpectancyRes;
            if (data && data.expectedLifespan) {
                const remaining = Math.max(0, data.expectedLifespan - retireAge);
                model.value.laborPension.remainingLifeAtRetirement = Math.round(remaining);
            }
        }
    } catch (error) {
        console.error('獲取預期壽命失敗', error);
    }
}

// 使用 lodash 的 debounce (用法相同)
const debouncedFetchLifespan = debounce(fetchRemainingLifespan, 500);

watch(
    () => [
        model.value.laborPension?.expectedRetirementAge,
        model.value.profile?.gender,
        model.value.profile?.birthDate
    ],
    () => { debouncedFetchLifespan(); },
    { immediate: true }
);

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

// 使用 lodash 的 debounce
const debouncedSave = debounce(performSave, 800);

watch(
    () => model.value.laborPension,
    (newVal) => { if (newVal) debouncedSave(); },
    { deep: true }
);
</script>

<style scoped>
/* 樣式保持原樣 */
.section-title {
    font-size: 13px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
    padding-left: 5px;
    border-left: 3px solid #409EFF;
}

.sub-label {
    font-size: 12px;
    color: #909399;
    line-height: 1.2;
    margin-top: 4px;
}

.result-panel {
    background-color: #ffffff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 20px;
    color: #303133;
}

.result-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.result-row.main {
    margin-bottom: 5px;
}

.composition-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    color: #909399;
    margin-bottom: 10px;
    gap: 8px;
}

.comp-item {
    background-color: #f2f6fc;
    padding: 2px 6px;
    border-radius: 4px;
}

.result-row.net-row {
    margin-top: 15px;
    background-color: #f0f9eb;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 0;
}

.label {
    font-size: 14px;
    color: #606266;
}

.value {
    font-family: monospace;
    font-weight: bold;
}

.main-value {
    font-size: 1.4em;
    color: #303133;
}

.tax-value {
    color: #606266;
}

.net-value {
    font-size: 1.3em;
    color: #409EFF;
}

.separator {
    height: 1px;
    background-color: #ebeef5;
    margin: 10px 0;
}

.separator.dashed {
    background-color: transparent;
    border-bottom: 1px dashed #dcdfe6;
}

.tax-details {
    font-size: 13px;
    color: #909399;
    padding-left: 5px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.deduction {
    color: #67c23a;
}
</style>
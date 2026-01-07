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
                        <el-input-number v-model="model.laborPension.remainingLifeAtRetirement" disabled
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

            <el-row :gutter="20"
                style="background-color: #f5f7fa; padding: 15px 0; border-radius: 4px; margin: 0; border: 1px solid #e4e7ed;">
                <el-col :span="12">
                    <el-form-item label="目前已累積工作年資 (總月數)" style="margin-bottom: 0;">
                        <el-input-number v-model="model.laborPension.currentWorkSeniority" :min="0" :max="720"
                            placeholder="例如: 97" style="width: 100%" />
                        <div class="sub-label">
                            換算約 <b>{{ (model.laborPension.currentWorkSeniority / 12).toFixed(1) }}</b> 年
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" style="display: flex; align-items: center;">
                    <div style="font-size: 0.9rem; color: #606266;">
                        <div style="margin-bottom: 4px;">目前專戶現值 (PV): <b>{{ formatMoney(totalLaborPensionPV) }}</b>
                        </div>
                        <div>
                            預計總年資: {{ calculatedTaxSeniority.toFixed(1) }} 年
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-divider content-position="left">3. 退休領取總額與稅務預估 (終值 FV)</el-divider>

            <div class="result-panel">
                <div class="result-row main">
                    <span class="label">預估領取總額 (FV)</span>
                    <span class="value main-value">{{ formatMoney(projectedLumpSumFV) }}</span>
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
                    <span class="value net-value">{{ formatMoney(projectedLumpSumFV - finalTaxableIncome) }}</span>
                </div>
            </div>

            <div style="margin-top: 15px; font-size: 12px; color: #909399;">
                * 試算假設現有資金以固定報酬率複利滾存至退休，未包含未來每個月持續提撥的新增金額 (保守估計)。
            </div>

        </el-form>

        <el-skeleton v-else :rows="5" animated />
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { UserFormState, UserLaborPension } from './types/user';
import type { LifeExpectancyRes } from './types/util';
import { useApi } from '@/components/plan/composables/useApi';

const { authFetch } = useApi();
const model = defineModel<UserFormState>({ required: true });

// ========================================================
// 1. 初始化與預設值邏輯
// ========================================================

const defaultLaborPension: UserLaborPension = {
    expectedRetirementAge: 65,
    remainingLifeAtRetirement: 20,
    retirementRoi: 3.0,
    employerContribution: 0,
    employerEarnings: 0,
    personalContribution: 0,
    personalEarnings: 0,
    currentWorkSeniority: 0 // 這裡現在存的是「月數」
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

// [修正] 計算總年資 (用於稅務計算)
// 公式：(目前累積月數 / 12) + 未來工作年數
const calculatedTaxSeniority = computed(() => {
    if (!model.value.laborPension) return 0;

    // 將輸入的月數轉為年
    const currentYears = (model.value.laborPension.currentWorkSeniority || 0) / 12;

    return currentYears + futureWorkYears.value;
});

// ========================================================
// 3. 資金運算 (PV -> FV)
// ========================================================

const totalLaborPensionPV = computed(() => {
    const lp = model.value.laborPension;
    if (!lp) return 0;
    return (lp.employerContribution || 0) +
        (lp.employerEarnings || 0) +
        (lp.personalContribution || 0) +
        (lp.personalEarnings || 0);
});

const projectedLumpSumFV = computed(() => {
    const pv = totalLaborPensionPV.value;
    const lp = model.value.laborPension;
    if (!lp) return 0;

    const r = (lp.retirementRoi || 0) / 100;
    const n = futureWorkYears.value;

    if (n <= 0) return pv;
    return Math.round(pv * Math.pow(1 + r, n));
});

// ========================================================
// 4. 稅務試算 (114年度標準)
// ========================================================

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

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return function (...args: Parameters<T>) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

// ========================================================
// 6. [API] 獲取預期壽命 (GET)
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
                model.value.laborPension.remainingLifeAtRetirement = data.expectedLifespan
            }
        }
    } catch (error) {
        console.error('獲取預期壽命失敗', error);
    }
}

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

// ========================================================
// 7. [API] 自動儲存 (PUT - 手動處理 JSON)
// ========================================================

async function performSave() {
    const item = model.value.laborPension;
    if (!item) return;

    try {
        await authFetch(`/api/v1/user/labor-pension`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
    } catch (error) {
        console.error('[AutoSave] Failed:', error);
    }
}

const debouncedSave = debounce(performSave, 800);

watch(
    () => model.value.laborPension,
    (newVal) => {
        if (newVal) {
            debouncedSave();
        }
    },
    { deep: true }
);
</script>

<style scoped>
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
    margin-bottom: 15px;
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
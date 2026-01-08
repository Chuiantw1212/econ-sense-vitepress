<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><b>勞保老年年金試算</b></span>
                <el-tag type="primary" effect="plain">公共年金第一層</el-tag>
            </div>
        </template>

        <el-form v-if="model.laborInsurance" :model="model" label-width="auto" label-position="top">

            <el-divider>投保參數設定</el-divider>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="出生年次 (法定起支年齡)">
                        <el-input :value="birthYearDisplay" disabled style="width: 100%">
                            <template #suffix>
                                <span style="color: var(--el-text-color-secondary)">
                                    法定: {{ statutoryAge }} 歲
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預計開始請領年齡">
                        <el-input-number v-model="model.laborInsurance.expectedClaimAge" :min="minValidClaimAge"
                            :max="80" style="width: 100%" />
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            最早可於 {{ minValidClaimAge }} 歲請領 (減給 20%)
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="最高 60 個月平均投保薪資">
                        <el-input-number v-model="model.laborInsurance.averageMonthlySalary" :min="0" :max="45800"
                            :step="1000" style="width: 100%" @change="handleSalaryCheck" />
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            目前上限 45,800 元 (取生涯最高 5 年平均)
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item
                        :label="`保險年資 (${model.laborInsurance.insuranceSeniority}月 ≈ ${(model.laborInsurance.insuranceSeniority / 12).toFixed(1)}年)`">
                        <el-input-number v-model="model.laborInsurance.insuranceSeniority" :min="0" :max="720"
                            placeholder="輸入總月數" style="width: 100%">
                            <template #suffix>月</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider>每月年金試算結果</el-divider>

            <div style="background-color: var(--el-fill-color-light); padding: 20px; border-radius: 8px;">
                <el-row :gutter="20">

                    <el-col :span="12" :xs="24" style="margin-bottom: 10px;">
                        <el-statistic title="預估每月領取金額" :value="result.bestAmount" precision="0"
                            value-style="color: var(--el-color-primary); font-weight: bold; font-size: 1.5rem;" />
                        <div style="margin-top: 8px;">
                            <el-tag :type="result.diffYears < 0 ? 'warning' : 'success'" size="small" effect="dark">
                                {{ result.msg }}
                            </el-tag>
                        </div>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <div style="font-size: 13px; color: #606266; line-height: 1.8;">
                            <div style="margin-bottom: 4px; font-weight: bold;">計算公式擇優：</div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>A式 (保底型):</span>
                                <span>{{ formatMoney(result.amountA) }}</span>
                            </div>
                            <div style="font-size: 12px; color: #909399; margin-bottom: 6px;">
                                (均薪 × 年資 × 0.775%) + 3,000
                            </div>

                            <div style="display: flex; justify-content: space-between;">
                                <span>B式 (年資型):</span>
                                <span>{{ formatMoney(result.amountB) }}</span>
                            </div>
                            <div style="font-size: 12px; color: #909399;">
                                均薪 × 年資 × 1.55%
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

        </el-form>
        <el-skeleton v-else :rows="5" animated />
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { UserFormState } from './types/user';
import { useApi } from '@/components/plan/composables/useApi';
import { useLaborInsuranceCalculator } from '@/components/plan/composables/useLaborInsuranceCalculator';

const { authFetch } = useApi();
const { getStatutoryAge, calculateAnnuity } = useLaborInsuranceCalculator();
const model = defineModel<UserFormState>({ required: true });

// --- 1. 預設值與初始化 ---
const defaultLaborInsurance: UserLaborInsurance = {
    expectedClaimAge: 65,
    averageMonthlySalary: 45800,
    insuranceSeniority: 0 // 月數
};

watch(
    () => model.value,
    (newVal) => {
        // 若 laborInsurance 物件不存在則初始化
        if (newVal && !newVal.laborInsurance) {
            newVal.laborInsurance = { ...defaultLaborInsurance };
        }
    },
    { immediate: true, deep: true }
);

// --- 2. 基礎資料計算 ---

// 取得出生年 (西元)
const birthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return 1990; // Fallback
    return new Date(dateStr).getFullYear();
});

// 顯示用的民國年次字串
const birthYearDisplay = computed(() => {
    const roc = birthYear.value - 1911;
    return `民國 ${roc} 年次`;
});

// 計算法定請領年齡
const statutoryAge = computed(() => {
    return getStatutoryAge(birthYear.value);
});

// 最小可請領年齡 (法定 - 5)
const minValidClaimAge = computed(() => {
    return statutoryAge.value - 5;
});

// --- 3. 輸入驗證與連動 ---

// 當出生日期改變時，若目前設定的請領年齡 < 新的最小年齡，自動校正
watch(minValidClaimAge, (newMin) => {
    if (model.value.laborInsurance && model.value.laborInsurance.expectedClaimAge < newMin) {
        model.value.laborInsurance.expectedClaimAge = newMin;
    }
});

// 強制修正投保薪資上限 (雖然 InputNumber 有 max，但這是雙重保險)
function handleSalaryCheck(val: number | undefined) {
    if (val && val > 45800) {
        if (model.value.laborInsurance) {
            model.value.laborInsurance.averageMonthlySalary = 45800;
        }
    }
}

// --- 4. 試算結果 (Computed) ---

const result = computed(() => {
    const li = model.value.laborInsurance;
    if (!li) {
        return {
            bestAmount: 0, amountA: 0, amountB: 0,
            diffYears: 0, bonusPercentage: 0, msg: '', statutoryAge: 65
        };
    }

    return calculateAnnuity(
        li.averageMonthlySalary || 0,
        li.insuranceSeniority || 0,
        li.expectedClaimAge,
        statutoryAge.value
    );
});

// --- 5. 存檔邏輯 ---

async function performSave() {
    const item = model.value.laborInsurance;
    if (!item) return;
    try {
        // 假設 API endpoint 為 /api/v1/user/labor-insurance
        await authFetch(`/api/v1/user/labor-insurance`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    } catch (error) {
        console.error('[LaborInsurance] Save failed:', error);
    }
}

const debouncedSave = debounce(performSave, 800);

watch(
    () => model.value.laborInsurance,
    (newVal) => { if (newVal) debouncedSave(); },
    { deep: true }
);

function formatMoney(val: number) {
    return Math.round(val).toLocaleString();
}
</script>
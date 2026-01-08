<template>
    <el-card shadow="never">
        <el-form v-if="model.laborInsurance" :model="model" label-width="auto" label-position="top">

            <el-divider>投保參數設定</el-divider>

            <el-row :gutter="20">

                <el-col :span="12" :xs="24">
                    <el-form-item label="出生年次 (法定起支年齡)">
                        <el-input :value="birthYearDisplay" disabled style="width: 100%">
                            <template #suffix>
                                <span style="color: var(--el-text-color-secondary)">法定: {{ statutoryAge }} 歲</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="最高 60 個月平均投保薪資">
                        <el-input-number v-model="model.laborInsurance.averageMonthlySalary" :min="0" :max="45800"
                            :step="1000" style="width: 100%" @change="handleSalaryCheck" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預計開始請領年齡">
                        <el-input-number v-model="model.laborInsurance.expectedClaimAge" :min="minValidClaimAge"
                            :max="80" style="width: 100%" />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="請領時預估餘命 (可手動調整)">
                        <el-input-number v-model="model.laborInsurance.predictedRemainingLife" :min="0" :max="100"
                            :step="0.1" :precision="1" style="width: 100%">
                            <template #suffix>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <el-icon v-if="isLoadingLifespan" class="is-loading">
                                        <Loading />
                                    </el-icon>
                                    <span>年</span>
                                </div>
                            </template>
                        </el-input-number>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="目前已累積保險年資">
                        <el-input-number v-model="model.laborInsurance.insuranceSeniority" :min="0" :max="720"
                            placeholder="輸入已累積月數" style="width: 100%">
                            <template #suffix>月</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="退休時總預估年資 (自動加計)">
                        <el-input :value="(totalProjectedSeniority / 12).toFixed(1)" disabled style="width: 100%">
                            <template #suffix>年</template>
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-divider>試算結果 (PV分析)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="預估每月領取金額 (擇優)">
                        <el-input :value="formatMoney(result.bestAmount)" disabled style="width: 100%">
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="終身總現值 (折現3%)">
                        <el-input :value="formatMoney(stableLifetimePV)" disabled style="width: 100%">
                            <template #suffix>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <el-icon v-if="isLoadingLifespan" class="is-loading">
                                        <Loading />
                                    </el-icon>
                                    <span>元</span>
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="狀態判定">
                        <el-input :value="result.msg" disabled style="width: 100%">
                            <template #prefix>
                                <span
                                    :style="{ color: result.diffYears < 0 ? 'var(--el-color-warning)' : (result.diffYears > 0 ? 'var(--el-color-success)' : 'var(--el-text-color-regular)') }"
                                    style="font-weight: bold; margin-right: 5px;">
                                    ●
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <el-skeleton v-else :rows="5" animated />
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch, ref, watchEffect } from 'vue';
import { debounce } from 'lodash-es';
import { Loading } from '@element-plus/icons-vue';
import type { UserFormState, UserLaborInsurance } from './types/user';
import { useApi } from '@/components/plan/composables/useApi';
import { useLaborInsuranceCalculator } from '@/components/plan/composables/useLaborInsuranceCalculator';

const { authFetch } = useApi();
const { getStatutoryAge, calculateAnnuity, calculateLifetimePV } = useLaborInsuranceCalculator();
const model = defineModel<UserFormState>({ required: true });

// --- 1. 預設值 ---
// 修改：預設值欄位名稱更新
const defaultLaborInsurance: UserLaborInsurance = {
    expectedClaimAge: 65,
    averageMonthlySalary: 45800,
    insuranceSeniority: 0,
    predictedRemainingLife: 0
};

watch(
    () => model.value,
    (newVal) => {
        if (newVal && !newVal.laborInsurance) {
            newVal.laborInsurance = { ...defaultLaborInsurance };
        }
    },
    { immediate: true, deep: true }
);

// --- 2. 基礎計算 ---
const currentYear = new Date().getFullYear();
const birthYear = computed(() => {
    const dateStr = model.value.profile?.birthDate;
    if (!dateStr) return 1990;
    return new Date(dateStr).getFullYear();
});
const currentAge = computed(() => currentYear - birthYear.value);
const birthYearDisplay = computed(() => `民國 ${birthYear.value - 1911} 年次`);
const statutoryAge = computed(() => getStatutoryAge(birthYear.value));
const minValidClaimAge = computed(() => statutoryAge.value - 5);

// --- 3. 年資計算 ---
const futureYears = computed(() => {
    const li = model.value.laborInsurance;
    if (!li) return 0;
    return Math.max(0, li.expectedClaimAge - currentAge.value);
});

const totalProjectedSeniority = computed(() => {
    const li = model.value.laborInsurance;
    if (!li) return 0;
    return (li.insuranceSeniority || 0) + (futureYears.value * 12);
});

// --- 4. 餘命 API 與 同步控制 ---
const isLoadingLifespan = ref(false);

async function fetchLifespan() {
    const li = model.value.laborInsurance;
    const profile = model.value.profile;
    if (!li || !profile || !profile.gender) return;

    const requestAge = li.expectedClaimAge;
    const targetYear = birthYear.value + requestAge;

    try {
        const response = await authFetch(
            `/api/tools/life-expectancy?year=${targetYear}&gender=${profile.gender}&age=${requestAge}`,
            { method: 'GET' }
        );
        if (response && response.ok) {
            const data = await response.json();
            const remaining = Number(data.expectedLifespan || 0);

            // 修改：寫入 predictedRemainingLife
            li.predictedRemainingLife = Math.round(remaining * 10) / 10;
        }
    } catch (error) {
        console.error('Fetch lifespan failed', error);
        // 修改：讀取 predictedRemainingLife 判斷
        if (!li.predictedRemainingLife) {
            li.predictedRemainingLife = 19;
        }
    } finally {
        isLoadingLifespan.value = false;
    }
}

const debouncedFetchLifespan = debounce(fetchLifespan, 500);

// 監聽關鍵參數變更
watch(
    () => [
        model.value.laborInsurance?.expectedClaimAge,
        model.value.profile?.gender,
        birthYear.value
    ],
    (newValues, oldValues) => {
        // 修改：讀取 predictedRemainingLife
        const currentLifespan = model.value.laborInsurance?.predictedRemainingLife || 0;

        const isInit = oldValues === undefined;

        if (isInit && currentLifespan > 0) {
            return;
        }

        isLoadingLifespan.value = true;
        debouncedFetchLifespan();
    },
    { immediate: true }
);

// --- 5. 試算結果 ---
const result = computed(() => {
    const li = model.value.laborInsurance;
    if (!li) return { bestAmount: 0, amountA: 0, amountB: 0, diffYears: 0, bonusPercentage: 0, msg: '', statutoryAge: 65 };

    return calculateAnnuity(
        li.averageMonthlySalary || 0,
        totalProjectedSeniority.value,
        li.expectedClaimAge,
        statutoryAge.value
    );
});

// PV 計算
const stableLifetimePV = ref(0);

watchEffect(() => {
    const li = model.value.laborInsurance;
    if (!li) return;

    if (isLoadingLifespan.value) {
        stableLifetimePV.value = 0;
        return;
    }

    // 修改：讀取 predictedRemainingLife
    const lifespan = li.predictedRemainingLife || 0;

    if (result.value.bestAmount > 0 && lifespan > 0) {
        stableLifetimePV.value = calculateLifetimePV(
            result.value.bestAmount,
            currentAge.value,
            li.expectedClaimAge,
            li.expectedClaimAge + lifespan,
            0.03
        );
    } else {
        stableLifetimePV.value = 0;
    }
});

// --- 6. 輔助與存檔 ---
watch(minValidClaimAge, (newMin) => {
    if (model.value.laborInsurance && model.value.laborInsurance.expectedClaimAge < newMin) {
        model.value.laborInsurance.expectedClaimAge = newMin;
    }
});

function handleSalaryCheck(val: number | undefined) {
    if (val && val > 45800) model.value.laborInsurance!.averageMonthlySalary = 45800;
}

function formatMoney(val: number) {
    return Math.round(val).toLocaleString();
}

async function performSave() {
    const item = model.value.laborInsurance;
    if (!item) return;
    try {
        await authFetch(`/api/v1/user/labor-insurance`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    } catch (e) { console.error(e); }
}
const debouncedSave = debounce(performSave, 800);
watch(() => model.value.laborInsurance, (newVal) => { if (newVal) debouncedSave(); }, { deep: true });
</script>
<template>
    <el-card shadow="never">
        <el-form label-position="top">
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="全年總薪資 (稅前)">
                        <el-input :value="`NT$ ${formatNumber(userForm.career.annualTotalIncome)}`" disabled>
                            <template #suffix>
                                <span style="color: var(--el-text-color-secondary)">
                                    月均: {{ formatNumber(userForm.career.annualTotalIncome / 12) }}
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="全台受僱員工薪資排名 (PR)">
                        <el-input :value="rankingText" disabled>
                            <template #suffix v-if="currentTier">
                                <el-tag size="small" type="primary" effect="plain">{{ currentTier.label }}</el-tag>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="每月實領現金流 (扣除稅費/認股/自提)">
                        <el-input :value="`NT$ ${formatNumber(userForm.career.monthlyNetIncome)}`" disabled />
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="生活營運支出率 (Operating Ratio)">
                        <el-input :value="`${operationRate}%`" disabled>
                            <template #suffix>
                                <span :style="{ color: statusColor, fontWeight: 'bold' }">
                                    {{ statusLabel }}
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="當前階層體質分析">
                        <div style="padding: 12px; border: 1px solid var(--el-border-color-lighter); background-color: var(--el-fill-color-blank); border-radius: 4px; line-height: 1.6;">
                            <div style="font-weight: bold; color: var(--el-color-primary); margin-bottom: 4px;">
                                {{ currentTier?.label || '尚未取得定位' }}
                            </div>
                            <div style="font-size: 14px; color: var(--el-text-color-regular);">
                                {{ currentTier?.description || '請先於職涯資料輸入完整薪資。' }}
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserFormState } from './types/user';

// --- Props & Model ---
const props = defineProps<{
    metadata: any; // 傳入包含 opt_salary_decile_grade 的物件
}>();

// 使用 defineModel 接收完整的 userForm
const userForm = defineModel<UserFormState>({ required: true });

// --- 1. 計算目前的平均總開銷 (來自 creditCards) ---
const totalMonthlyExpense = computed(() => {
    const cards = userForm.value.creditCards;
    if (!Array.isArray(cards)) return 0;
    return cards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0);
});

// --- 2. 排名邏輯 (連動 opt_salary_decile_grade) ---
const salaryDecileList = computed(() => props.metadata?.opt_salary_decile_grade?.list || []);

// 找出目前的級距
const currentTier = computed(() => {
    const income = Number(userForm.value.career?.annualTotalIncome) || 0;
    if (income === 0 || !salaryDecileList.value.length) return null;

    return salaryDecileList.value.find((t: any) => {
        const min = t.rangeMin || 0;
        const max = t.rangeMax;
        if (max === null) return income >= min; // D10 最高級距
        return income >= min && income <= max;
    });
});

// 核心 PR 計算公式
const rankingText = computed(() => {
    if (!currentTier.value) return '--';
    
    // 取得 D 級數字 (從 "D1" 到 "D10")
    const levelStr = currentTier.value.code.replace('D', '');
    const level = parseInt(levelStr);
    
    /**
     * 修正 PR 邏輯 (Decile 與 PR 對應):
     * D1:  PR 0-10   (Top 100%)
     * D5:  PR 40-50  (Top 60%)
     * D9:  PR 80-90  (Top 20%)
     * D10: PR 90-100 (Top 10%)
     */
    const lowerPr = (level - 1) * 10;
    const upperPr = level * 10;
    const topPercentage = 100 - lowerPr;

    return `Top ${topPercentage}% (PR ${lowerPr}-${upperPr})`;
});

// --- 3. 生活營運率 (支出 / 實領) ---
const operationRate = computed(() => {
    const net = userForm.value.career?.monthlyNetIncome || 0;
    if (net <= 0) return 0;
    return Math.round((totalMonthlyExpense.value / net) * 100);
});

const statusLabel = computed(() => {
    const r = operationRate.value;
    if (r === 0) return '尚未設定開銷';
    if (r < 50) return '營運優異 (極高儲蓄力)';
    if (r < 70) return '穩健 (具投資餘裕)';
    if (r < 90) return '緊繃 (抗風險低)';
    return '高風險 (赤字營運)';
});

const statusColor = computed(() => {
    const r = operationRate.value;
    if (r < 70) return '#67C23A'; // Success
    if (r < 90) return '#E6A23C'; // Warning
    return '#F56C6C'; // Danger
});

// --- Helper ---
function formatNumber(num: number | undefined) {
    if (num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('zh-TW').format(Math.round(num));
}
</script>
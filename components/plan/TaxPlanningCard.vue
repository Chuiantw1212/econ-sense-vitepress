<template>
    <el-card shadow="never">
        <el-form label-position="top">
            <div style="margin-bottom: 20px; font-weight: bold; font-size: 16px; color: var(--el-text-color-primary);">
                ## 稅務規劃與理財建議 (Tax Planning)
            </div>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="全年總薪資 (Gross Income)">
                        <el-input :value="`NT$ ${formatNumber(annualGrossIncome)}`" disabled>
                            <template #suffix>
                                <span style="color: var(--el-text-color-secondary)">
                                    稅前
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估綜合所得淨額 (Taxable Income)">
                        <el-input :value="`NT$ ${formatNumber(estimatedNetIncome)}`" disabled>
                            <template #suffix>
                                <el-tooltip placement="top">
                                    <template #content>
                                        扣除項目估算：<br />
                                        - 免稅額: {{ formatNumber(deductions.exemption) }}<br />
                                        - 標準扣除額: {{ formatNumber(deductions.standard) }}<br />
                                        - 薪資特別扣除: {{ formatNumber(deductions.salary) }}<br />
                                        - 勞退自提(免稅): {{ formatNumber(deductions.pension) }}
                                    </template>
                                    <el-icon style="cursor: pointer;">
                                        <InfoFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="適用邊際稅率 (Marginal Tax Rate)">
                        <el-input :value="`${currentBracket.rate}%`" disabled>
                            <template #suffix>
                                <el-tag :type="getBracketColor(currentBracket.rate)" effect="dark">
                                    {{ currentBracket.label }}
                                </el-tag>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估應納稅額 (Estimated Tax)">
                        <el-input :value="`NT$ ${formatNumber(estimatedTaxAmount)}`" disabled>
                            <template #suffix>
                                <span style="color: #F56C6C; font-weight: bold;">
                                    有效稅率: {{ effectiveTaxRate }}%
                                </span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="稅務優化與理財建議">
                        <div
                            style="padding: 15px; border: 1px solid var(--el-border-color-lighter); background-color: var(--el-fill-color-light); border-radius: 4px; line-height: 1.6;">
                            <div
                                style="font-weight: bold; color: var(--el-color-primary); margin-bottom: 8px; font-size: 15px;">
                                <el-icon>
                                    <Idea />
                                </el-icon> {{ currentBracket.title }}
                            </div>
                            <div style="font-size: 14px; color: var(--el-text-color-regular); white-space: pre-line;">
                                {{ currentBracket.advice }}
                            </div>

                            <div v-if="pensionTaxSave > 0"
                                style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--el-border-color);">
                                <span style="font-size: 13px; color: #67C23A;">
                                    <el-icon>
                                        <Money />
                                    </el-icon> 勞退自提效益：目前自提已為您節省約 <b>NT$ {{ formatNumber(pensionTaxSave) }}</b> 的稅金。
                                </span>
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
import { InfoFilled, Idea, Money } from '@element-plus/icons-vue';
import type { UserFormState } from './types/user';
import { useIncomeTax } from '@/components/plan/composables/useIncomeTax';

// 定義 Model
const userForm = defineModel<UserFormState>({ required: true });

// 使用 Composable，傳入 reactive 的 career 物件
// computed 確保當 career 內數值變動時，composable 內部能收到更新
const careerRef = computed(() => userForm.value.career);
const {
    annualGrossIncome,
    estimatedNetIncome,
    deductions,
    currentBracket,
    estimatedTaxAmount,
    effectiveTaxRate,
    pensionTaxSave
} = useIncomeTax(careerRef);

// --- Helpers ---
const getBracketColor = (rate: number) => {
    if (rate <= 5) return 'success';
    if (rate <= 20) return 'warning';
    return 'danger';
};

function formatNumber(num: number | undefined) {
    if (num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('zh-TW').format(Math.round(num));
}
</script>
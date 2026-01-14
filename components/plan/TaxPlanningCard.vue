<template>
    <el-card shadow="never">
        <el-form label-position="top">
            <el-divider content-position="left">1. 年度所得結構</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="全年薪資所得 (Salary)">
                        <el-input :value="`NT$ ${formatNumber(annualSalaryIncome)}`" disabled>
                            <template #suffix>稅前</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="試算其他所得 (Other Income)">
                        <el-input-number v-model="userForm.tax.estimatedOtherIncome" :min="0" :step="10000"
                            style="width: 100%" placeholder="股利/租金" @change="debouncedSaveTax" />
                        <template #label>
                            <el-space>
                                <span>試算其他所得</span>
                                <el-tag size="small" type="info" effect="plain">股利/租金/兼職</el-tag>
                            </el-space>
                        </template>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="預估綜合所得淨額 (Taxable Income)">
                        <el-input :value="`NT$ ${formatNumber(estimatedNetIncome)}`" :readonly="true">
                            <template #suffix>
                                <el-tooltip placement="top">
                                    <template #content>
                                        總所得：{{ formatNumber(totalGrossIncome) }}<br />
                                        - 免稅額：{{ formatNumber(deductions.exemption) }}<br />
                                        - 標準扣除額：{{ formatNumber(deductions.standard) }}<br />
                                        - 薪資特別扣除：{{ formatNumber(deductions.salary) }}<br />
                                        - 勞退自提(免稅)：{{ formatNumber(deductions.pension) }}
                                    </template>
                                    <el-icon style="cursor: pointer; margin-left: 4px">
                                        <InfoFilled />
                                    </el-icon>
                                </el-tooltip>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">2. 稅務試算結果</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="適用邊際稅率">
                        <el-input :value="currentBracket ? `${(currentBracket.taxRate * 100).toFixed(0)}%` : '-'"
                            disabled>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="預估應納稅額">
                        <el-input :value="`NT$ ${formatNumber(estimatedTaxAmount)}`" disabled>
                            <template #suffix>
                                <el-text type="danger">有效稅率 {{ effectiveTaxRate }}%</el-text>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">3. 稅務優化與投資策略</el-divider>

            <div v-if="currentBracket" style="margin-top: 20px;">

                <el-row :gutter="16">
                    <el-col v-for="(rec, idx) in currentBracket.recommendations" :key="idx" :span="24"
                        style="margin-bottom: 16px;">
                        <el-card shadow="hover" :body-style="{ padding: '16px' }">
                            <template #header>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: bold;">{{ rec.name }}</span>
                                    <el-tag :type="getRecTypeColor(rec.type)" size="small" effect="light">
                                        {{ rec.type }}
                                    </el-tag>
                                </div>
                            </template>
                            <el-text size="small" style="color: var(--el-text-color-regular); line-height: 1.6;">
                                {{ rec.reason }}
                            </el-text>
                        </el-card>
                    </el-col>
                </el-row>
            </div>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { debounce } from 'lodash-es';
import { InfoFilled } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState } from './types/user';
import { useIncomeTax } from '@/components/plan/composables/useIncomeTax';

// --- Props & Model ---
const props = defineProps<{
    metadata: any;
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// 初始化 tax 物件
if (!userForm.value.tax) {
    userForm.value.tax = { estimatedOtherIncome: 0 };
}

// --- Composable ---
const careerRef = computed(() => userForm.value.career);
const taxRef = computed(() => userForm.value.tax);

const {
    annualSalaryIncome,
    totalGrossIncome,
    estimatedNetIncome,
    deductions,
    estimatedTaxAmount,
    effectiveTaxRate
} = useIncomeTax(careerRef, taxRef);

// --- Metadata Logic ---
const taxStrategies = computed(() => props.metadata?.opt_tax_strategy_model?.list || []);

const currentBracket = computed(() => {
    const net = estimatedNetIncome.value;

    if (!taxStrategies.value || taxStrategies.value.length === 0) return null;

    return taxStrategies.value.find((g: any) => {
        const min = g.rangeMin || 0;
        const max = g.rangeMax;
        if (max === null) return net >= min;
        return net >= min && net <= max;
    }) || taxStrategies.value[0];
});

// --- Auto Save ---
const debouncedSaveTax = debounce(async () => {
    try {
        await authFetch('/api/v1/user/tax', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userForm.value.tax)
        });
    } catch (e) {
        console.error('Tax save failed:', e);
    }
}, 800);

// --- Helpers ---
const getRecTypeColor = (type: string) => {
    switch (type) {
        case 'Investment': return 'primary';
        case 'TaxAction': return 'success';
        case 'RealEstate': return 'warning';
        case 'Alternative': return 'danger';
        case 'Education': return 'success';
        default: return 'info';
    }
};

function formatNumber(num: number | undefined) {
    if (num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('zh-TW').format(Math.round(num));
}
</script>
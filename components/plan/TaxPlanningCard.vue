<template>
    <el-card shadow="never">
        <el-form label-position="top">

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
                        <el-input-number 
                            v-model="userForm.tax.estimatedOtherIncome" 
                            :min="0" 
                            :step="10000" 
                            style="width: 100%"
                            placeholder="股利/租金/兼職"
                            @change="debouncedSaveTax"
                        />
                        <div style="font-size: 12px; color: #909399; line-height: 1.2; margin-top: 4px;">
                            包含股利、租金、利息或執行業務所得。此數據獨立儲存於稅務模組，會墊高稅基。
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="預估綜合所得淨額 (Taxable Income)">
                        <el-input :value="`NT$ ${formatNumber(estimatedNetIncome)}`" disabled size="large">
                            <template #prefix>
                                <span style="color: var(--el-text-color-primary); font-weight: bold;">
                                    計算基準
                                </span>
                            </template>
                            <template #suffix>
                                <el-tooltip placement="top">
                                    <template #content>
                                        總所得 ({{ formatNumber(totalGrossIncome) }}) 減去：<br/>
                                        - 免稅額: {{ formatNumber(deductions.exemption) }}<br/>
                                        - 標準扣除額: {{ formatNumber(deductions.standard) }}<br/>
                                        - 薪資特別扣除: {{ formatNumber(deductions.salary) }}<br/>
                                        - 勞退自提(免稅): {{ formatNumber(deductions.pension) }}
                                    </template>
                                    <el-icon style="cursor: pointer;"><InfoFilled /></el-icon>
                                </el-tooltip>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="適用邊際稅率 (Marginal Tax Rate)">
                        <el-input :value="currentBracket ? `${(currentBracket.taxRate * 100).toFixed(0)}%` : '-'" disabled>
                            <template #suffix>
                                <el-tag v-if="currentBracket" :type="getBracketColor(currentBracket.taxRate * 100)" effect="dark">
                                    {{ currentBracket.code }} {{ currentBracket.strategyName }}
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

                <el-col :span="24" v-if="currentBracket">
                    <el-form-item label="稅務優化與投資策略">
                        <div class="strategy-container">
                            <div class="strategy-header">
                                <el-icon class="icon"><Aim /></el-icon>
                                <span>{{ currentBracket.description }}</span>
                            </div>

                            <div v-for="(rec, idx) in currentBracket.recommendations" :key="idx" class="recommendation-item">
                                <div class="rec-title">
                                    <el-tag size="small" :type="getRecTypeColor(rec.type)" effect="plain">{{ rec.type }}</el-tag>
                                    {{ rec.name }}
                                </div>
                                <div class="rec-reason">
                                    {{ rec.reason }}
                                </div>
                            </div>
                            
                            <div v-if="pensionTaxSave > 0" class="pension-tip">
                                <span style="color: #67C23A; display: flex; align-items: center;">
                                    <el-icon style="margin-right: 4px;"><Money /></el-icon> 
                                    勞退自提效益：目前自提已為您節省約 <b>NT$ {{ formatNumber(pensionTaxSave) }}</b> 的稅金。
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
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { InfoFilled, Aim, Money } from '@element-plus/icons-vue';
import { useApi } from '@/components/plan/composables/useApi';
import type { UserFormState } from './types/user';
import { useIncomeTax } from '@/components/plan/composables/useIncomeTax';

// --- Props & Model ---
const props = defineProps<{
    metadata: any; // 必須包含 opt_tax_strategy_model
}>();

const userForm = defineModel<UserFormState>({ required: true });
const { authFetch } = useApi();

// 初始化 tax 物件 (防呆處理，確保 userForm.tax 存在)
if (!userForm.value.tax) {
    userForm.value.tax = { estimatedOtherIncome: 0 };
}

// --- Composable: 傳入 Career 與 Tax 兩個源頭 ---
const careerRef = computed(() => userForm.value.career);
const taxRef = computed(() => userForm.value.tax);

const { 
    annualSalaryIncome, 
    totalGrossIncome, // 總所得 (薪資 + 其他)
    estimatedNetIncome, 
    deductions, 
    estimatedTaxAmount, 
    effectiveTaxRate, 
    pensionTaxSave 
} = useIncomeTax(careerRef, taxRef);

// --- Metadata Logic (Tax Strategy) ---
const taxStrategies = computed(() => props.metadata?.opt_tax_strategy_model?.list || []);

// 根據 estimatedNetIncome (淨所得) 定位級距
const currentBracket = computed(() => {
    const net = estimatedNetIncome.value;
    if (!taxStrategies.value.length) return null;

    // 遍歷尋找落點
    return taxStrategies.value.find((g: any) => {
        const min = g.rangeMin || 0;
        const max = g.rangeMax;
        if (max === null) return net >= min; // G5 (最高級距)
        return net >= min && net <= max;
    }) || taxStrategies.value[0]; // Fallback to G1
});

// --- Auto Save (獨立儲存 Tax Entity) ---
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
const getBracketColor = (ratePercent: number) => {
    if (ratePercent <= 5) return 'success';
    if (ratePercent <= 12) return ''; // primary blue
    if (ratePercent <= 20) return 'warning';
    return 'danger';
};

const getRecTypeColor = (type: string) => {
    switch(type) {
        case 'Investment': return 'primary';
        case 'TaxAction': return 'success';
        case 'RealEstate': return 'warning';
        case 'Alternative': return 'danger';
        case 'Education': return 'info';
        case 'Management': return 'info';
        case 'Inheritance': return 'danger';
        default: return 'info';
    }
};

function formatNumber(num: number | undefined) {
    if (num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('zh-TW').format(Math.round(num));
}
</script>

<style scoped>
.strategy-container {
    padding: 16px;
    border: 1px solid var(--el-border-color-lighter);
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
}

.strategy-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    color: var(--el-color-primary);
    margin-bottom: 12px;
    font-size: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.recommendation-item {
    margin-bottom: 12px;
}

.rec-title {
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
}

.rec-reason {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
    padding-left: 4px;
    margin-left: 2px;
    border-left: 2px solid var(--el-border-color);
}

.pension-tip {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed var(--el-border-color);
    font-size: 13px;
}
</style>
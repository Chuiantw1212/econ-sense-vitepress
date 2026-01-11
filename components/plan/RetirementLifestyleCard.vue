<template>
    <el-card shadow="never" class="lifestyle-card">
        <el-form :model="localData" label-position="top" label-width="auto">
            <el-divider content-position="left">1. 生存基底校正</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="A. 原始月開銷基數 (信用卡平均)">
                        <el-input :value="formatMoney(baseMonthlyExpense)" disabled>
                            <template #suffix>元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="B. 生存基底留存率 (Retention Rate)">
                        <el-input :value="localData.baseRetentionRate" disabled style="width: 100%">
                            <template #suffix>%</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-alert type="info" :closable="false" show-icon style="margin-bottom: 18px;">
                        <template #title>
                            校正後生存底線 (Pure Base)： <b style="font-size: 1.1em;">{{ formatMoney(adjustedBaseExpense) }}</b>
                            元/月
                        </template>
                    </el-alert>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="居住狀態 (Housing Status)">
                        <el-select v-model="localData.housingStatus" placeholder="請選擇" style="width: 100%">
                            <el-option label="自有住宅 (需負擔修繕稅費)" value="owned" />
                            <el-option label="租屋 (需承擔租金通膨)" value="rented" />
                            <el-option label="養生村/老人公寓 (月費制)" value="senior_housing" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item :label="housingCostLabel">
                        <el-input-number v-model="localData.housingMonthly" :min="0" :step="1000" style="width: 100%"
                            :placeholder="housingBenchmarks[localData.housingStatus]?.amount.toString()" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">2. 圓夢與享樂 (外加於生存底線之上)</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="年度旅遊願景">
                        <el-select v-model="localData.travelStyle" placeholder="請選擇" style="width: 100%">
                            <el-option label="國內輕旅行 (約 3萬/年)" value="domestic" />
                            <el-option label="亞洲短程 (約 10萬/年)" value="asia" />
                            <el-option label="歐美長程 (約 30萬/年)" value="global" />
                            <el-option label="環遊世界 (約 100萬/年)" value="luxury" />
                            <el-option label="無特別規劃" value="none" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="興趣與社交 (高爾夫/攝影/聚餐)">
                        <el-input-number v-model="localData.hobbyMonthly" :min="0" :step="1000" style="width: 100%" />
                        <template #suffix>元/月</template>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">3. 預防醫學投資</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="健康促進預算 (健身/營養品)">
                        <el-input-number v-model="localData.healthInvestment" :min="0" :step="1000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="居家環境改造 (一次性)">
                        <el-input-number v-model="localData.homeRenovation" :min="0" :step="10000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-card shadow="never" class="summary-card">
                <el-row justify="space-between" align="middle">
                    <el-col :span="24" :sm="10">
                        <el-statistic title="活躍期每月總支出 (現值)" :value="totalMonthlyPv" precision="0">
                            <template #suffix>元</template>
                        </el-statistic>
                    </el-col>

                    <el-col :span="24" :sm="14" class="breakdown-col">
                        <div class="breakdown-label">費用結構：</div>
                        <el-space wrap :size="5" spacer="+">
                            <el-tag effect="plain" type="info">
                                生存 {{ formatMoney(adjustedBaseExpense + localData.housingMonthly) }}
                            </el-tag>
                            <el-tag effect="plain" type="warning">
                                圓夢 {{ formatMoney(monthlyTravelCost + localData.hobbyMonthly) }}
                            </el-tag>
                            <el-tag effect="plain" type="success">
                                健康 {{ formatMoney(localData.healthInvestment) }}
                            </el-tag>
                        </el-space>
                    </el-col>
                </el-row>
            </el-card>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import { Sunrise } from '@element-plus/icons-vue';
import type { UserFormState } from './types/user';
import { useApi } from '@/components/plan/composables/useApi';

const { authFetch } = useApi();
const model = defineModel<UserFormState>({ required: true });

// --- Interface Definition ---
interface RetirementLifestyle {
    baseRetentionRate: number;
    housingStatus: 'owned' | 'rented' | 'senior_housing';
    housingMonthly: number;
    generalInflation: number;
    travelStyle: 'none' | 'domestic' | 'asia' | 'global' | 'luxury';
    hobbyMonthly: number;
    healthInvestment: number;
    homeRenovation: number;
}

// --- Market Benchmarks ---
const housingBenchmarks = {
    owned: { amount: 5000 },
    rented: { amount: 20000 },
    senior_housing: { amount: 35000 }
};

// --- Data Proxy ---
const localData = computed({
    get: () => {
        const defaults: RetirementLifestyle = {
            baseRetentionRate: 80,
            housingStatus: 'owned',
            housingMonthly: 5000,
            generalInflation: 3.0,
            travelStyle: 'asia',
            hobbyMonthly: 5000,
            healthInvestment: 3000,
            homeRenovation: 150000
        };
        if (!model.value.retirementLifestyle) {
            model.value.retirementLifestyle = defaults;
        }
        return { ...defaults, ...model.value.retirementLifestyle };
    },
    set: (val: RetirementLifestyle) => {
        model.value.retirementLifestyle = val;
    }
});

// --- Smart Defaults Logic ---
watch(
    () => localData.value.housingStatus,
    (newStatus, oldStatus) => {
        if (!oldStatus) return;
        const currentAmount = localData.value.housingMonthly;
        const oldBenchmark = housingBenchmarks[oldStatus]?.amount;
        if (currentAmount === oldBenchmark || currentAmount === 0) {
            const newBenchmark = housingBenchmarks[newStatus];
            if (newBenchmark) {
                const newData = { ...localData.value };
                newData.housingMonthly = newBenchmark.amount;
                localData.value = newData;
            }
        }
    }
);

// --- Computed Helpers ---
const baseMonthlyExpense = computed(() => {
    const cards = model.value.creditCards;
    let total = 0;
    if (Array.isArray(cards)) {
        total = cards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0);
    }
    return total > 0 ? total : 30000;
});

const adjustedBaseExpense = computed(() => {
    return Math.round(baseMonthlyExpense.value * (localData.value.baseRetentionRate / 100));
});

const housingCostLabel = computed(() => {
    const map = { owned: '房屋修繕稅費 (月攤提)', rented: '每月房租 (租金)', senior_housing: '養生村月費' };
    return map[localData.value.housingStatus] || '居住成本';
});

const travelCosts: Record<string, number> = {
    none: 0, domestic: 2500, asia: 8300, global: 25000, luxury: 83000
};
const monthlyTravelCost = computed(() => travelCosts[localData.value.travelStyle] || 0);

const totalMonthlyPv = computed(() => {
    return adjustedBaseExpense.value
        + localData.value.housingMonthly
        + monthlyTravelCost.value
        + localData.value.hobbyMonthly
        + localData.value.healthInvestment;
});

function formatMoney(val: number) { return Math.round(val).toLocaleString(); }

// --- Auto Save ---
async function performSave() {
    const data = model.value.retirementLifestyle;
    if (data) {
        try {
            await authFetch('/api/v1/user/retirement-lifestyle', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
            });
        } catch (e) { console.error(e); }
    }
}
const debouncedSave = debounce(performSave, 800);
watch(() => model.value.retirementLifestyle, (n) => { if (n) debouncedSave(); }, { deep: true });
</script>

<style scoped>
.lifestyle-card {
    border: 1px solid var(--el-border-color-lighter);
}

/* Simplified Header Styles */
.simple-header {
    margin-bottom: 20px;
}

.simple-header h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon-simple {
    color: var(--el-color-primary);
    font-size: 20px;
}

.subtitle {
    margin: 0;
    font-size: 13px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
}

/* Summary Section */
.summary-card {
    margin-top: 30px;
    background-color: var(--el-color-primary-light-9);
    border: none;
}

.breakdown-col {
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
}

.breakdown-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 5px;
}

@media (max-width: 768px) {
    .breakdown-col {
        margin-top: 15px;
        align-items: flex-start;
    }
}
</style>
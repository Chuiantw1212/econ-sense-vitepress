<template>
    <el-card shadow="never" class="lifestyle-card">
        <el-form :model="localData" label-position="top" label-width="auto">

            <div class="simple-header">
                <div class="header-title">
                    <el-icon class="header-icon-simple">
                        <Sunrise />
                    </el-icon>
                    <span>Step 1: 退休生活風格 (65~75歲)</span>
                </div>
                <div class="subtitle">
                    依據《五級距模型》與《居住報告》校正您的真實生存成本。
                </div>
            </div>

            <el-divider content-position="left">1. 生存基底校正 (五級距模型)</el-divider>

            <el-row :gutter="20">
                <el-col :span="24">
                    <transition name="el-fade-in">
                        <el-alert v-if="autoQuintileMessage" type="success" :closable="false" show-icon
                            style="margin-bottom: 20px;">
                            <template #title>
                                {{ autoQuintileMessage }}
                            </template>
                        </el-alert>
                    </transition>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="A. 原始月開銷基數 (信用卡平均)">
                        <el-input :value="formatMoney(baseMonthlyExpense)" disabled>
                            <template #suffix>元/月</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="B. 財務身份 (生存留存率)">
                        <el-select v-model="localData.baseRetentionRate" placeholder="請選擇" style="width: 100%">
                            <el-option label="Q5: 高薪/高儲蓄族 (60%)" :value="60" />
                            <el-option label="Q4: 富裕階層 (70%)" :value="70" />
                            <el-option label="Q3: 中產階級 (80%)" :value="80" />
                            <el-option label="Q2: 小康邊緣 (90%)" :value="90" />
                            <el-option label="Q1: 基本生活族 (100%)" :value="100" />
                        </el-select>
                        <div class="helper-text-small" :class="quintileColorClass">
                            * {{ currentQuintileHint }}
                        </div>
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
                            <el-option v-for="opt in housingOptions" :key="opt.code" :label="opt.label"
                                :value="opt.code" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item :label="housingCostLabel">
                        <el-input-number v-model="localData.housingMonthly" :min="0" :step="1000" style="width: 100%"
                            :placeholder="currentHousingBenchmark?.toString()" />
                        <div class="helper-text-small">
                            {{ housingCostHint }}
                        </div>
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
                        <div class="helper-text-small">* 報告建議：浴室防滑與動線優化</div>
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
import { computed, watch, ref } from 'vue';
import { debounce } from 'lodash-es';
import { Sunrise } from '@element-plus/icons-vue';
import type { UserFormState } from './types/user';
import { useApi } from '@/components/plan/composables/useApi';

const { authFetch } = useApi();
const model = defineModel<UserFormState>({ required: true });

// [新增] 接收 metadata prop
const props = defineProps<{
    metadata?: any;
}>();

// --- Interface ---
interface RetirementLifestyle {
    baseRetentionRate: number;
    housingStatus: string; // Dynamic from metadata (e.g., 'OWN_HOME', 'RENTAL')
    housingMonthly: number;
    generalInflation: number;
    travelStyle: string;
    hobbyMonthly: number;
    healthInvestment: number;
    homeRenovation: number;
}

// --- Logic: Housing Options from Metadata ---
const housingOptions = computed(() => {
    return props.metadata?.opt_housing_mode?.list || [];
});

// 建立 Code -> Option 的快速查找表
const housingMap = computed(() => {
    const map: Record<string, any> = {};
    housingOptions.value.forEach((opt: any) => {
        map[opt.code] = opt;
    });
    return map;
});

// 當前選中模式的 Benchmark 金額 (預設使用 defaultMonthlyExpense)
const currentHousingBenchmark = computed(() => {
    const opt = housingMap.value[localData.value.housingStatus];
    return opt ? opt.defaultMonthlyExpense : 0;
});

// 動態標籤：依據不同模式顯示不同欄位名稱
const housingCostLabel = computed(() => {
    const code = localData.value.housingStatus;
    if (code === 'OWN_HOME') return '房屋修繕稅費 (月攤提)';
    if (code === 'RENTAL') return '每月房租 (租金)';
    return '機構月費 (含設施服務)';
});

// 動態提示：顯示 Metadata 中的 description
const housingCostHint = computed(() => {
    const opt = housingMap.value[localData.value.housingStatus];
    if (!opt) return '';
    // 如果有雙人價格差異，也可以顯示 (目前先顯示主要描述)
    // opt.coupleMonthlyExpense 可視需求加入提示
    return `* ${opt.description} (參考行情: ${formatMoney(opt.defaultMonthlyExpense)}/月)`;
});

// --- Logic: Auto-Detect Quintile ---
const autoQuintileMessage = ref('');

watch(
    () => model.value.career?.monthlyNetIncome,
    (monthlyNetIncome) => {
        if (!monthlyNetIncome || monthlyNetIncome <= 0) return;
        const estimatedAnnual = monthlyNetIncome * 12;
        let rate = 80;
        let label = '';

        if (estimatedAnnual > 1750000) {
            rate = 60;
            label = 'Q5 高薪族';
        } else if (estimatedAnnual > 1100000) {
            rate = 70;
            label = 'Q4 富裕族';
        } else if (estimatedAnnual > 800000) {
            rate = 80;
            label = 'Q3 中產族';
        } else if (estimatedAnnual > 500000) {
            rate = 90;
            label = 'Q2 小康族';
        } else {
            rate = 100;
            label = 'Q1 基本族';
        }

        if (localData.value.baseRetentionRate !== rate) {
            localData.value.baseRetentionRate = rate;
            const incomeStr = Math.round(monthlyNetIncome).toLocaleString();
            autoQuintileMessage.value = `🪄 偵測到月薪 $${incomeStr}，系統依五級距模型自動帶入「${label}」。`;
            setTimeout(() => { autoQuintileMessage.value = ''; }, 5000);
        }
    },
    { immediate: true }
);

// --- Dynamic Hint ---
const currentQuintileHint = computed(() => {
    const rate = localData.value.baseRetentionRate;
    switch (rate) {
        case 60: return '報告 Q5：高所得組 (前20%)。高額儲蓄與累進稅負移除，替代率需求最低。';
        case 70: return '報告 Q4：富裕階層 (前40%)。儲蓄率約 20%，生活品質優渥。';
        case 80: return '報告 Q3：中產階級 (中位數)。標準模型，扣除工作相關開銷。';
        case 90: return '報告 Q2：小康邊緣 (後40%)。儲蓄率微薄，開銷多為必要支出。';
        case 100: return '報告 Q1：基本生活 (後20%)。剛性需求極高，建議 100% 完全保留。';
        default: return '自訂比例';
    }
});

const quintileColorClass = computed(() => {
    const rate = localData.value.baseRetentionRate;
    if (rate <= 60) return 'text-success';
    if (rate >= 100) return 'text-warning';
    return 'text-info';
});

// --- Data Proxy ---
const localData = computed({
    get: () => {
        const defaults: RetirementLifestyle = {
            baseRetentionRate: 80,
            housingStatus: 'OWN_HOME', // Update default to match metadata code
            housingMonthly: 22000, // Match benchmark of OWN_HOME
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

// --- Smart Defaults for Housing (Autofill on Change) ---
watch(
    () => localData.value.housingStatus,
    (newStatus, oldStatus) => {
        if (!oldStatus) return;

        const currentAmount = localData.value.housingMonthly;
        // 取得舊選項的預設值，用來判斷用戶是否手動修改過
        const oldBenchmark = housingMap.value[oldStatus]?.defaultMonthlyExpense;

        // 如果目前金額等於舊預設值 (代表用戶沒改過)，或金額為 0，則自動更新為新預設值
        if (currentAmount === oldBenchmark || currentAmount === 0) {
            const newBenchmark = housingMap.value[newStatus]?.defaultMonthlyExpense;
            if (newBenchmark) {
                const newData = { ...localData.value };
                newData.housingMonthly = newBenchmark;
                localData.value = newData;
            }
        }
    }
);

// --- Computations ---
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

.simple-header {
    margin-bottom: 20px;
}

.header-title {
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

.helper-text-small {
    font-size: 12px;
    margin-top: 4px;
    line-height: 1.4;
    color: var(--el-text-color-secondary);
}

.text-success {
    color: var(--el-color-success);
}

.text-warning {
    color: var(--el-color-warning);
}

.text-info {
    color: var(--el-color-primary);
}

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
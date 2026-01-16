<template>
    <el-card shadow="hover" class="gap-card">
        <template #header>
            <div class="card-header">
                <div class="header-title">
                    <span>Step 5: 退休資產全景模擬</span>
                    <el-tag :type="summary.isSurplus ? 'success' : 'danger'" effect="dark" size="small">
                        {{ summary.isSurplus ? '資產充裕' : '資產將耗盡' }}
                    </el-tag>
                </div>
            </div>
        </template>

        <el-row :gutter="20" class="dashboard-row">
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">起始總資產 (Initial Assets)</div>
                    <div class="value success">NT$ {{ formatBigMoney(initialAssets) }}</div>
                    <div class="sub-label">勞退一次金 + 累積儲蓄</div>
                </div>
            </el-col>
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">年金總收入 (Total Income)</div>
                    <div class="value primary">NT$ {{ formatBigMoney(totalInflowSum) }}</div>
                    <div class="sub-label">勞保年金終身領取</div>
                </div>
            </el-col>
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">{{ summary.isSurplus ? '最終剩餘' : '耗盡年齡' }}</div>
                    <div class="value" :class="summary.isSurplus ? 'success' : 'danger'">
                        {{ summary.isSurplus ? `NT$ ${formatBigMoney(summary.finalAsset)}` : `${summary.depletionAge} 歲`
                        }}
                    </div>
                    <div class="sub-label">
                        <span v-if="!summary.isSurplus">
                            <el-icon>
                                <Warning />
                            </el-icon> 之後面臨資金缺口
                        </span>
                        <span v-else>足以安享晚年</span>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-divider content-position="left">資產存量與收支通膨模擬</el-divider>

        <div class="chart-wrapper">
            <RetirementAssetChart v-if="chartData" :data="chartData" />
            <el-empty v-else description="資料載入中..." />
        </div>

    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import type { UserFormState } from './types/user';
// 引入 Composable
import { useRetirementCalculator, type TimelineContext } from './composables/useRetirementCalculator';
// 引入 View 元件
import RetirementAssetChart, { type ChartPayload } from './charts/RetirementAssetChart.vue';

// --- Props & Model ---
const props = defineProps<{
    inflationRate?: number;
    roi?: number;
}>();

const userForm = defineModel<UserFormState>({ required: true });

// --- Composable 初始化 ---
const {
    getLaborPensionLumpSum,
    calcLaborInsuranceStream,
    calcGoGoExpenseStream,
    calcSlowGoExpenseStream,
    calcNoGoExpenseStream,
    calculateAssetStockSeries
} = useRetirementCalculator();

// --- 1. 計算上下文 (Context) ---
const context = computed<TimelineContext>(() => {
    const profile = userForm.value?.profile;
    const labor = userForm.value?.laborInsurance;
    const pension = userForm.value?.laborPension;

    const currentAge = profile?.currentAge ?? 40;
    const startSimulationAge = pension?.expectedRetirementAge ?? 65;
    const endSimulationAge = (labor?.expectedClaimAge ?? 65) + (labor?.predictedRemainingLife ?? 20);

    return {
        currentAge,
        startSimulationAge: Math.max(startSimulationAge, currentAge),
        endSimulationAge: Math.max(endSimulationAge, startSimulationAge + 1),
        inflationRate: (props.inflationRate ?? 2) / 100
    };
});

// --- 2. 透過 Composable 產生原始數據 ---
const initialAssets = computed(() => userForm.value ? getLaborPensionLumpSum(userForm.value) : 0);

const rawStreams = computed(() => {
    if (!userForm.value) return null;
    const form = userForm.value;
    const ctx = context.value;

    return {
        inflow: calcLaborInsuranceStream(form, ctx),
        outHousingLiving: calcGoGoExpenseStream(form, ctx), // 這裡包含 Go-Go 的所有生活費
        outMedical: calcSlowGoExpenseStream(form, ctx),     // 這裡包含 Slow-Go 的醫療
        outLtc: calcNoGoExpenseStream(form, ctx)            // 這裡包含 No-Go 的長照
    };
});

// 計算資產存量 (Stock)
const stockSeries = computed(() => {
    if (!rawStreams.value) return [];
    const s = rawStreams.value;
    return calculateAssetStockSeries(
        initialAssets.value,
        (props.roi ?? 3) / 100,
        [s.inflow],
        [s.outHousingLiving, s.outMedical, s.outLtc] // 將所有支出流合併計算
    );
});

// --- 3. 轉換為 Chart 元件需要的數據格式 (View Model Transformation) ---
const chartData = computed<ChartPayload | null>(() => {
    if (!rawStreams.value || stockSeries.value.length === 0) return null;

    const s = rawStreams.value;
    const stocks = stockSeries.value;

    // 提取每個 Series 的 amount 陣列
    return {
        labels: stocks.map(d => d.age.toString()),
        assets: stocks.map(d => Math.max(0, d.endBalance)), // 只顯示正資產
        incomes: s.inflow.map(d => d.amount),
        expenses: {
            // 這裡對應 Chart 元件的 Stack 層級
            // Living (GoGo + 跨階段的 Housing 其實在 Composable 已經拆分，這裡直接對應)
            // 為了讓圖表在各階段都有東西顯示，我們需要理解 Composable 回傳的是該年度的「總數」

            // 注意：因為 Composable 是分階段回傳 0 或數值，所以直接 mapping 即可
            living: s.outHousingLiving.map(d => d.amount),
            medical: s.outMedical.map(d => d.amount),
            ltc: s.outLtc.map(d => d.amount)
        }
    };
});

// --- 4. 統計摘要 (Summary) ---
const totalInflowSum = computed(() => stockSeries.value.reduce((sum, d) => sum + d.totalInflow, 0));

const summary = computed(() => {
    const data = stockSeries.value;
    if (data.length === 0) return { isSurplus: false, finalAsset: 0, depletionAge: null };

    const finalAsset = data[data.length - 1].endBalance;
    const depletionPoint = data.find(d => d.endBalance < 0);

    return {
        isSurplus: finalAsset >= 0,
        finalAsset,
        depletionAge: depletionPoint?.age || null
    };
});

// Formatter
const formatBigMoney = (val: number) => {
    const num = Math.round(val);
    if (Math.abs(num) > 100000000) return `${(num / 100000000).toFixed(2)} 億`;
    if (Math.abs(num) > 10000) return `${(num / 10000).toFixed(0)} 萬`;
    return num.toLocaleString();
};
</script>

<style scoped>
/* 樣式保持一致 */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.dashboard-row {
    margin-bottom: 24px;
}

.stat-item {
    text-align: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.stat-item .label {
    font-size: 13px;
    color: #606266;
    margin-bottom: 4px;
}

.stat-item .value {
    font-size: 20px;
    font-weight: bold;
    font-family: 'Roboto Mono', monospace;
}

.stat-item .value.danger {
    color: #F56C6C;
}

.stat-item .value.success {
    color: #67C23A;
}

.stat-item .value.primary {
    color: #409EFF;
}

.stat-item .sub-label {
    font-size: 11px;
    color: #909399;
    margin-top: 4px;
}

.chart-wrapper {
    margin-top: 20px;
}
</style>
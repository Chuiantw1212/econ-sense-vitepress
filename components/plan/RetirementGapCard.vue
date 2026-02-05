<template>
    <el-card shadow="hover" class="gap-card">

        <el-row :gutter="20" class="dashboard-row">
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">起始總資產 (Initial Stock)</div>
                    <div class="value success">NT$ {{ formatBigMoney(initialAssets) }}</div>
                    <div class="sub-label">勞退一次金 + 累積儲蓄</div>
                </div>
            </el-col>
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">年金總收入 (Total Income)</div>
                    <div class="value primary">NT$ {{ formatBigMoney(totalInflowSum) }}</div>
                    <div class="sub-label">勞保年金 (抗通膨成長)</div>
                </div>
            </el-col>
            <el-col :span="8" :xs="24">
                <div class="stat-item">
                    <div class="label">{{ summary.isSurplus ? '最終剩餘' : '耗盡年齡' }}</div>
                    <div class="value" :class="summary.isSurplus ? 'success' : 'danger'">
                        {{ summary.isSurplus ? `NT$ ${formatBigMoney(summary.finalAsset)}` : `${summary.depletionAge} 歲` }}
                    </div>
                    <div class="sub-label">
                        <span v-if="!summary.isSurplus">
                            <el-icon><Warning /></el-icon> 之後面臨資金缺口
                        </span>
                        <span v-else>足以安享晚年 (ROI: {{ currentRoi }}%)</span>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-divider content-position="left">資產存量與收支通膨模擬</el-divider>

        <div class="chart-wrapper">
            <RetirementAssetChart v-if="chartData" :data="chartData" />
            <el-empty v-else description="資料載入中..." />
        </div>

        <div class="chart-hint" v-if="chartData">
            <el-icon><InfoFilled /></el-icon>
            <span style="margin-left: 4px; font-size: 12px; color: #909399;">
                模擬從「勞退請領/退休年齡」開始。若早於「勞保年金」請領歲數，前幾年將無年金收入，資產消耗較快。
            </span>
        </div>

    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Warning, InfoFilled } from '@element-plus/icons-vue';
import type { UserFormState } from './types/user';
import { useRetirementCalculator, type TimelineContext } from './composables/useRetirementCalculator';
import RetirementAssetChart, { type ChartPayload } from './charts/RetirementAssetChart.vue';

const userForm = defineModel<UserFormState>({ required: true });

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

    // 起點設為「勞退預計退休年齡」(通常 60)。
    const startSimulationAge = pension?.expectedRetirementAge ?? 60;

    // 終點依然看勞保餘命
    const endSimulationAge = (labor?.expectedClaimAge ?? 65) + (labor?.predictedRemainingLife ?? 20);

    return {
        currentAge,
        startSimulationAge: Math.max(startSimulationAge, currentAge),
        endSimulationAge: Math.max(endSimulationAge, startSimulationAge + 1),
    };
});

// 從 UserForm 讀取退休後投資報酬率 (ROI)
const currentRoi = computed(() => userForm.value?.laborPension?.retirementRoi ?? 3);

// --- 2. 透過 Composable 產生原始數據 ---
const initialAssets = computed(() => userForm.value ? getLaborPensionLumpSum(userForm.value) : 0);

const rawStreams = computed(() => {
    if (!userForm.value) return null;
    const form = userForm.value;
    const ctx = context.value;

    return {
        inflow: calcLaborInsuranceStream(form, ctx),
        outHousingLiving: calcGoGoExpenseStream(form, ctx),
        outMedical: calcSlowGoExpenseStream(form, ctx),
        outLtc: calcNoGoExpenseStream(form, ctx)
    };
});

// 計算資產存量 (Stock)
const stockSeries = computed(() => {
    if (!rawStreams.value) return [];
    const s = rawStreams.value;
    
    // 使用 currentRoi 進行計算
    return calculateAssetStockSeries(
        initialAssets.value,
        currentRoi.value / 100, 
        [s.inflow],
        [s.outHousingLiving, s.outMedical, s.outLtc]
    );
});

// --- 3. 轉換為 Chart 元件需要的數據格式 ---
const chartData = computed<ChartPayload | null>(() => {
    if (!rawStreams.value || stockSeries.value.length === 0) return null;

    const s = rawStreams.value;
    const stocks = stockSeries.value;

    return {
        labels: stocks.map(d => d.age.toString()),
        assets: stocks.map(d => Math.max(0, d.endBalance)),
        incomes: s.inflow.map(d => d.amount),
        expenses: {
            living: s.outHousingLiving.map(d => d.amount),
            medical: s.outMedical.map(d => d.amount),
            ltc: s.outLtc.map(d => d.amount)
        }
    };
});

// --- 4. 統計摘要 ---
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

const formatBigMoney = (val: number) => {
    const num = Math.round(val);
    if (Math.abs(num) > 100000000) return `${(num / 100000000).toFixed(2)} 億`;
    if (Math.abs(num) > 10000) return `${(num / 10000).toFixed(0)} 萬`;
    return num.toLocaleString();
};
</script>

<style scoped>
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

.chart-hint {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
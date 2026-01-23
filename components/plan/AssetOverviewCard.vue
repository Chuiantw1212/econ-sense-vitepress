<template>
    <el-card shadow="never">

        <el-row :gutter="20" align="middle">
            <el-col :span="12" :xs="24">
                <el-statistic title="預估淨資產 (Net Worth)" :value="netWorth" :precision="0">
                    <template #prefix>NT$</template>
                </el-statistic>
            </el-col>

            <el-col :span="12" :xs="24">
                <div style="font-size: 12px; color: #909399; margin-bottom: 8px;">台北財富十分位 (Taipei Decile)</div>
                <div v-if="currentTier" style="display: flex; align-items: center; gap: 8px;">
                    <el-tag effect="dark" size="large" :type="getTierType(currentTier.code)">
                        {{ currentTier.label }}
                    </el-tag>
                </div>
                <div v-else style="font-size: 14px; color: #303133;">資料不足以評估</div>
            </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="40">
            <el-col :span="12" :xs="24">
                <div
                    style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #606266;">
                    <span>負債比率 (Debt Ratio)</span>
                    <span style="font-weight: bold;">{{ debtRatio }}%</span>
                </div>
                <el-progress :percentage="Math.min(debtRatio, 100)" :status="debtStatus" :stroke-width="12"
                    :show-text="false" />
                <div v-if="currentTier"
                    style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 12px; color: #909399;">
                    <span>同級平均: {{ currentTier.debtRatio }}%</span>
                    <span :class="debtRatio > currentTier.debtRatio ? 'text-danger' : 'text-success'">
                        {{ debtRatio > currentTier.debtRatio ? '高於平均' : '優於平均' }}
                    </span>
                </div>
            </el-col>

            <el-col :span="12" :xs="24">
                <div
                    style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #606266;">
                    <span>房產配置 (Real Estate %)</span>
                    <span style="font-weight: bold;">{{ reAllocation }}%</span>
                </div>
                <el-progress :percentage="Math.min(reAllocation, 100)" :color="reColors" :stroke-width="12"
                    :show-text="false" />
                <div v-if="currentTier"
                    style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 12px; color: #909399;">
                    <span>目前配置</span>
                    <span>同級模型: {{ currentTier.allocation.realEstate }}%</span>
                </div>
            </el-col>
        </el-row>

        <el-divider />

        <div v-if="currentTier">
            <div style="font-size: 14px; font-weight: bold; color: #303133; margin-bottom: 8px;">
                階層洞察 (Insight)
            </div>
            <div
                style="background-color: #f5f7fa; padding: 16px; border-radius: 4px; color: #606266; line-height: 1.6; font-size: 14px;">
                {{ currentTier.description }}
            </div>
        </div>

    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserFormState } from '@/components/plan/types/user'

// --- Interfaces ---
interface Allocation {
    realEstate: number;
    cash: number;
    securities: number;
    insurance: number;
}

interface DecileItem {
    code: string;
    label: string;
    netWorthRangeMin: number;
    netWorthRangeMax: number | null;
    debtRatio: number;
    allocation: Allocation;
    description: string;
}

interface Metadata {
    opt_taipei_wealth_decile?: {
        // strategic_concept 已移除
        list: DecileItem[];
    };
    [key: string]: any;
}

const props = defineProps<{ metadata: Metadata }>()
const formState = defineModel<UserFormState>({ required: true })

// --- 基礎計算工具 ---
const getList = (source: any) => (source && Array.isArray(source) ? source : [])

// 資產分類小計
const subtotals = computed(() => {
    const data = formState.value
    if (!data) return { portfolio: 0, realEstate: 0, business: 0 }

    const p = getList(data.portfolios).reduce((s: number, i: any) => s + ((Number(i.marketValue) || 0) * (Number(i.exchangeRate) || 1)), 0)
    const r = getList(data.realEstates).reduce((s: number, i: any) => s + (Number(i.totalPrice) || 0), 0)
    const b = getList(data.businesses).reduce((s: number, i: any) => s + (Number(i.acquisitionCost) || 0), 0)
    return { portfolio: p, realEstate: r, business: b }
})

const totalAssets = computed(() => subtotals.value.portfolio + subtotals.value.realEstate + subtotals.value.business)

const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const rl = getList(data.realEstates).reduce((s: number, i: any) => s + (Number(i.loanAmount) || 0), 0)
    const bl = getList(data.businesses).reduce((s: number, i: any) => s + (Number(i.loanAmount) || 0), 0)
    return rl + bl
})

const netWorth = computed(() => totalAssets.value - totalLiabilities.value)

const debtRatio = computed(() => {
    if (totalAssets.value <= 0) return 0
    return Math.round((totalLiabilities.value / totalAssets.value) * 1000) / 10
})

const reAllocation = computed(() => {
    if (totalAssets.value <= 0) return 0
    return Math.round((subtotals.value.realEstate / totalAssets.value) * 1000) / 10
})

// --- 戰略模型邏輯 ---
const modelData = computed(() => props.metadata?.opt_taipei_wealth_decile)

// 動態落點判定 (Range Matching)
const currentTier = computed(() => {
    const list = modelData.value?.list;
    if (!list || list.length === 0) return undefined;
    const nw = netWorth.value;

    return list.find(item => {
        const minCheck = nw >= item.netWorthRangeMin;
        const maxCheck = item.netWorthRangeMax === null ? true : nw < item.netWorthRangeMax;
        return minCheck && maxCheck;
    });
})

// 下一階層
const nextTier = computed(() => {
    const list = modelData.value?.list;
    const current = currentTier.value;
    if (!list || !current) return undefined;

    const idx = list.findIndex(i => i.code === current.code);
    if (idx >= 0 && idx < list.length - 1) {
        return list[idx + 1];
    }
    return undefined;
})

// --- UI 輔助 ---
const getTierType = (code: string) => {
    const num = parseInt(code.replace('D', ''));
    if (num <= 3) return 'danger';
    if (num <= 5) return 'warning';
    if (num <= 7) return 'primary';
    return 'success';
}

const debtStatus = computed(() => {
    const d = debtRatio.value;
    if (d < 30) return 'success';
    if (d < 60) return 'warning';
    return 'exception';
})

const reColors = [
    { color: '#67C23A', percentage: 40 },
    { color: '#E6A23C', percentage: 70 },
    { color: '#F56C6C', percentage: 100 }
]

const formatSimpleMoney = (val: number) => {
    if (val >= 100000000) return (val / 100000000).toFixed(1) + '億';
    if (val >= 10000) return (val / 10000).toFixed(0) + '萬';
    return val.toLocaleString();
}
</script>

<style scoped>
.text-danger {
    color: #F56C6C;
}

.text-success {
    color: #67C23A;
}
</style>
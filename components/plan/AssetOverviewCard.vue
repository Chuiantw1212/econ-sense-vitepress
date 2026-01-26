<template>
    <el-card shadow="never">
        <template #header>
            <el-row justify="space-between" align="middle">
                <span>資產結構戰略分析</span>
                <!-- <el-tag v-if="currentTier" effect="dark" :type="getTierType(currentTier.code)">
                    {{ currentTier.label }}
                </el-tag> -->
            </el-row>
        </template>

        <el-row :gutter="20">
            <el-col :span="8" :xs="24">
                <el-statistic title="預估淨值" :value="netWorth" :precision="0">
                    <template #prefix>NT$</template>
                </el-statistic>
            </el-col>
            <el-col :span="8" :xs="12">
                <el-statistic title="總資產" :value="totalAssets">
                    <template #prefix>$</template>
                </el-statistic>
            </el-col>
            <el-col :span="8" :xs="12">
                <el-statistic title="總負債" :value="totalLiabilities">
                    <template #prefix>$</template>
                </el-statistic>
            </el-col>
        </el-row>

        <el-alert v-if="currentTier" :title="`當前位於：${currentTier.label}`" type="info"
            :description="currentTier.description" show-icon :closable="false" style="margin-top: 20px" />

        <el-divider>資產結構與槓桿健康度</el-divider>

        <div v-for="(item, index) in unifiedHealthMetrics" :key="index">
            <el-row :gutter="20" align="middle">
                <el-col :span="7" :xs="24">
                    <el-space>
                        <el-icon v-if="item.icon === 'house'">
                            <House />
                        </el-icon>
                        <el-icon v-else-if="item.icon === 'money'">
                            <Money />
                        </el-icon>
                        <el-icon v-else>
                            <TrendCharts />
                        </el-icon>
                        <span style="font-weight: bold">{{ item.category }}</span>
                    </el-space>
                </el-col>

                <el-col :span="9" :xs="24">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
                        <span style="font-size: 13px; color: #606266">我的數值: <b>{{ item.userPct }}%</b></span>
                    </div>
                    <el-progress :percentage="Math.min(item.userPct, 100)" :color="item.color" :stroke-width="10"
                        :show-text="false" />
                </el-col>

                <el-col :span="4" :xs="12" style="text-align: center;">
                    <el-statistic title="同級參考" :value="item.refPct" suffix="%"
                        value-style="font-size: 14px; color: #909399" />
                </el-col>

                <el-col :span="4" :xs="12" style="text-align: right">
                    <el-tag :type="item.statusType" effect="plain">{{ item.statusText }}</el-tag>
                </el-col>
            </el-row>

            <el-divider v-if="index < unifiedHealthMetrics.length - 1" border-style="dashed" />
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { House, Money, TrendCharts } from '@element-plus/icons-vue'
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
        list: DecileItem[];
    };
    [key: string]: any;
}

const props = defineProps<{
    metadata: Metadata
}>()

const formState = defineModel<UserFormState>({ required: true })

// --- 輔助函式 ---
const getList = (source: any) => (source && Array.isArray(source) ? source : [])

// --- 核心計算 ---
const subtotals = computed(() => {
    const data = formState.value
    if (!data) return { portfolio: 0, realEstate: 0, business: 0 }

    const p = getList(data.portfolios).reduce((s, i) => s + ((Number(i.marketValue) || 0) * (Number(i.exchangeRate) || 1)), 0)
    const r = getList(data.realEstates).reduce((s, i) => s + (Number(i.totalPrice) || 0), 0)
    const b = getList(data.businesses).reduce((s, i) => s + (Number(i.acquisitionCost) || 0), 0)

    return { portfolio: p, realEstate: r, business: b }
})

const totalAssets = computed(() => subtotals.value.portfolio + subtotals.value.realEstate + subtotals.value.business)

const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const rl = getList(data.realEstates).reduce((s, i) => s + (Number(i.loanAmount) || 0), 0)
    const bl = getList(data.businesses).reduce((s, i) => s + (Number(i.loanAmount) || 0), 0)
    return rl + bl
})

const netWorth = computed(() => totalAssets.value - totalLiabilities.value)
const debtRatio = computed(() => totalAssets.value <= 0 ? 0 : Math.round((totalLiabilities.value / totalAssets.value) * 1000) / 10)

// --- 資產占比計算 ---
const reAllocation = computed(() => totalAssets.value <= 0 ? 0 : Math.round((subtotals.value.realEstate / totalAssets.value) * 1000) / 10)
const financialAllocation = computed(() => totalAssets.value <= 0 ? 0 : Math.round(((subtotals.value.portfolio + subtotals.value.business) / totalAssets.value) * 1000) / 10)

// --- 模型對照 (Decile Tier) ---
const currentTier = computed(() => {
    const list = props.metadata?.opt_taipei_wealth_decile?.list
    if (!list) return null

    const nw = netWorth.value
    return list.find(item => {
        const minCheck = nw >= item.netWorthRangeMin
        const maxCheck = item.netWorthRangeMax === null ? true : nw < item.netWorthRangeMax
        return minCheck && maxCheck
    })
})

// --- 統一健康指標數據生成 (Allocation + Leverage) ---
const unifiedHealthMetrics = computed(() => {
    if (!currentTier.value) return []

    const tierAlloc = currentTier.value.allocation
    const tierFinancialSum = tierAlloc.cash + tierAlloc.securities + tierAlloc.insurance

    // 1. 不動產比較
    const reDiff = reAllocation.value - tierAlloc.realEstate
    let reStatus = '適中'
    let reType = 'info'
    if (reDiff > 10) { reStatus = '過高 (僵化)'; reType = 'danger'; }
    else if (reDiff < -10) { reStatus = '偏低'; reType = 'warning'; }
    else { reStatus = '均衡'; reType = 'success'; }

    // 2. 金融資產比較
    const finDiff = financialAllocation.value - tierFinancialSum
    let finStatus = '適中'
    let finType = 'info'
    if (finDiff > 10) { finStatus = '充沛 (靈活)'; finType = 'success'; }
    else if (finDiff < -10) { finStatus = '不足'; finType = 'warning'; }

    // 3. 槓桿 (負債比) 比較
    const userDebt = debtRatio.value
    const refDebt = currentTier.value.debtRatio
    const debtDiff = userDebt - refDebt
    let debtStatus = '適中'
    let debtType = 'info'
    let debtColor = '#E6A23C' // 預設橙色

    if (debtDiff > 15) {
        debtStatus = '高槓桿'
        debtType = 'danger'
        debtColor = '#F56C6C'
    } else if (debtDiff < -15) {
        debtStatus = '保守穩健'
        debtType = 'success'
        debtColor = '#67C23A'
    } else {
        debtStatus = '常態區間'
        debtType = 'info'
        debtColor = '#409EFF'
    }

    return [
        {
            category: '不動產資產',
            icon: 'house',
            userPct: reAllocation.value,
            refPct: tierAlloc.realEstate,
            statusText: reStatus,
            statusType: reType,
            color: '#F56C6C' // 房產用紅色系代表僵化風險
        },
        {
            category: '金融與流動資產',
            icon: 'money',
            userPct: financialAllocation.value,
            refPct: tierFinancialSum,
            statusText: finStatus,
            statusType: finType,
            color: '#409EFF' // 金融用藍色系代表流動性
        },
        {
            category: '總負債比率',
            icon: 'chart',
            userPct: userDebt,
            refPct: refDebt,
            statusText: debtStatus,
            statusType: debtType,
            color: debtColor // 槓桿顏色動態變化
        }
    ]
})
</script>
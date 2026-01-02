<template>
    <el-card shadow="never">
        <el-form label-position="top">

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="預估淨資產 (Net Worth)">
                        <el-text size="large" tag="b" style="font-size: 28px;">{{ formatCurrency(netWorth) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="目前所處財富階層 (PR)">
                        <el-text v-if="currentTier" type="info"> {{ currentTier.label }}</el-text>
                        <el-text v-else type="info">資料不足以評估</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="我的資產活化率 (ROA)">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <el-text :type="roaStatus.color" tag="b" size="large" style="font-size: 24px;">
                                {{ roa.toFixed(2) }} %
                            </el-text>
                            <el-tag :type="roaStatus.color" effect="plain" size="small">
                                {{ roaStatus.label }}
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="同級目標基準 (Benchmark)">
                        <div v-if="currentTier">
                            <el-text tag="b" size="large">
                                {{ currentTier.performanceRoaMin }}% ~ {{ currentTier.performanceRoaMax || '∞' }}%
                            </el-text>
                        </div>
                        <el-text v-else type="info">-</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="我的自有資金回報 (ROE)">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <el-text :type="roeStatus.color" tag="b" size="large" style="font-size: 24px;">
                                {{ roe.toFixed(2) }} %
                            </el-text>
                            <el-tag :type="roeStatus.color" effect="plain" size="small">
                                {{ roeStatus.label }}
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="同級目標基準 (Benchmark)">
                        <div v-if="currentTier">
                            <el-text tag="b" size="large">
                                {{ currentTier.performanceRoeMin }}% ~ {{ currentTier.performanceRoeMax || '∞' }}%
                            </el-text>

                        </div>
                        <el-text v-else type="info">-</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="月被動淨效益 (含設算)">
                        <el-text type="success" tag="b">{{ formatCurrency(monthlyPassiveIncome) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="槓桿倍數 (Leverage)">
                        <el-text type="info">{{ leverage }} x</el-text>
                        <span style="font-size: 12px; color: #909399; margin-left: 8px;">(負債比 {{ debtRatio }}%)</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserFormState } from '@/components/plan/types/user'

// --- Types ---
interface WealthPrLevelItem {
    code: number;
    label: string;
    rangeMin: number;
    rangeMax: number | null;
    desc: string;
    performanceRoaMin: number;
    performanceRoaMax: number | null;
    performanceRoeMin: number;
    performanceRoeMax: number | null;
    performanceNote: string;
}

interface Metadata {
    opt_individual_wealth_pr_level?: {
        list: WealthPrLevelItem[];
    };
    [key: string]: any;
}

// --- Props & Model ---
const props = defineProps<{
    metadata: Metadata
}>()

const formState = defineModel<UserFormState>({ required: true })

// --- Helpers ---
const getList = (source: any) => {
    if (!source) return []
    if (Array.isArray(source)) return source
    if (Array.isArray(source.list)) return source.list
    return []
}

const formatCurrency = (val?: number) => {
    const num = Number(val) || 0
    return num.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })
}

// --- Core Calculations ---

// 1. 小計
const subtotals = computed(() => {
    const data = formState.value
    if (!data) return { portfolio: 0, realEstate: 0, business: 0 }

    const portfolio = getList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.marketValue) || 0) * (Number(item.exchangeRate) || 1)), 0)

    const realEstate = getList(data.realEstates).reduce((sum: number, item: any) =>
        sum + (Number(item.totalPrice) || 0), 0)

    const business = getList(data.businesses).reduce((sum: number, item: any) =>
        sum + (Number(item.acquisitionCost) || 0), 0)

    return {
        portfolio: Math.round(portfolio),
        realEstate: Math.round(realEstate),
        business: Math.round(business)
    }
})

// 2. 總資產 & 總負債 & 淨資產
const totalAssets = computed(() =>
    subtotals.value.portfolio + subtotals.value.realEstate + subtotals.value.business
)

const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const reLoan = getList(data.realEstates).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    const bizLoan = getList(data.businesses).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    return Math.round(reLoan + bizLoan)
})

const netWorth = computed(() => totalAssets.value - totalLiabilities.value)

// 3. 月被動淨效益 (投資現金流 + 自用設算淨益)
const monthlyPassiveIncome = computed(() => {
    const data = formState.value
    if (!data) return 0

    const pFlow = getList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.realizedPnl) || 0) / 12), 0)

    const rFlow = getList(data.realEstates).reduce((sum: number, item: any) => {
        const loan = Number(item.loanAmount) || 0
        const rate = Number(item.interestRate) || 0
        const interest = (loan * (rate / 100)) / 12

        const assessed = Number(item.assessedValue) || 0
        const taxRate = Number(item.holdingTaxRate) || 0
        const estimatedTax = assessed * (taxRate / 100)
        const actualTax = Number(item.actualHoldingCost) || 0
        const finalAnnualTax = actualTax > 0 ? actualTax : estimatedTax
        const monthlyTax = finalAnnualTax / 12
        const monthlyCost = interest + monthlyTax

        const revenue = Number(item.monthlyRent) || 0

        // 無論出租或自用，都計算淨效益 (自用為設算收入)
        if (item.usageType === 'rent') return sum + (revenue - monthlyCost)
        if (item.usageType === 'self') return sum + (revenue - monthlyCost)
        return sum - monthlyCost // 閒置
    }, 0)

    const bFlow = getList(data.businesses).reduce((sum: number, item: any) => {
        const income = Number(item.monthlyIncome) || 0
        const cost = Number(item.monthlyCost) || 0
        const interest = (Number(item.loanAmount) * (Number(item.loanInterestRate) / 100)) / 12
        return sum + (income - cost - interest)
    }, 0)

    return Math.round(pFlow + rFlow + bFlow)
})

// --- Ratios & PR Logic ---

const roa = computed(() => {
    if (totalAssets.value <= 0) return 0
    return ((monthlyPassiveIncome.value * 12) / totalAssets.value) * 100
})

const roe = computed(() => {
    if (netWorth.value <= 0) return 0
    return ((monthlyPassiveIncome.value * 12) / netWorth.value) * 100
})

const leverage = computed(() => {
    if (netWorth.value <= 0) return 0
    return (totalAssets.value / netWorth.value).toFixed(1)
})

const debtRatio = computed(() => {
    if (totalAssets.value <= 0) return 0
    return Math.round((totalLiabilities.value / totalAssets.value) * 100)
})

// 1. 找出當前 PR 階層
const currentTier = computed<WealthPrLevelItem | undefined>(() => {
    const list = props.metadata?.opt_individual_wealth_pr_level?.list;
    if (!list || list.length === 0) return undefined;

    const nw = netWorth.value;
    return list.find(item => {
        const minMatch = nw >= item.rangeMin;
        const maxMatch = item.rangeMax === null ? true : nw < item.rangeMax;
        return minMatch && maxMatch;
    });
})

// 2. ROA 動態評級 (vs Benchmark)
const roaStatus = computed(() => {
    const val = roa.value;
    const tier = currentTier.value;

    if (!tier) return { color: 'info', label: '無基準' };

    // 低於最小值 -> 不及格
    if (val < tier.performanceRoaMin) {
        return { color: 'danger', label: '低於同級水準' };
    }
    // 高於最大值 -> 優異
    if (tier.performanceRoaMax !== null && val > tier.performanceRoaMax) {
        return { color: 'success', label: '優於同級水準' };
    }
    // 介於中間 -> 合格
    return { color: 'primary', label: '符合同級水準' };
})

// 3. ROE 動態評級 (vs Benchmark)
const roeStatus = computed(() => {
    const val = roe.value;
    const tier = currentTier.value;

    if (!tier) return { color: 'info', label: '無基準' };

    if (val < tier.performanceRoeMin) {
        return { color: 'warning', label: '成長力不足' };
    }
    if (tier.performanceRoeMax !== null && val > tier.performanceRoeMax) {
        return { color: 'success', label: '高成長表現' };
    }
    return { color: 'primary', label: '穩健區間' };
})
</script>

<style scoped>
/* Zero CSS */
</style>
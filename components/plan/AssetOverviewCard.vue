<template>
    <el-card shadow="never">
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 18px;">資產總覽 (Net Worth)</span>
                <el-button link @click="togglePrivacy">
                    <el-icon :size="18">
                        <Hide v-if="hideAmount" />
                        <View v-else />
                    </el-icon>
                </el-button>
            </div>
        </template>

        <el-form label-position="top">

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="淨資產 (Net Worth)">
                        <el-text size="large" tag="b" style="font-size: 24px;">{{ formatCurrency(netWorth) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="資產活化率 (ROA)">
                        <div style="display: flex; align-items: baseline; gap: 8px;">
                            <el-text :type="roaStatus.color" tag="b" style="font-size: 24px;">
                                {{ roa.toFixed(2) }} %
                            </el-text>

                            <el-tooltip content="ROA 分子已納入「出租淨現金流」與「自用設算租金淨益」。若數值仍低，代表持有成本(利息/稅)過高或資產閒置。"
                                placement="top">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                            </el-tooltip>
                        </div>
                        <div style="margin-top: 4px;">
                            <el-tag size="small" :type="roaStatus.color" effect="dark">{{ roaStatus.label }}</el-tag>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider />

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="資產總額 (含自用)">
                        <el-text tag="b">{{ formatCurrency(totalAssets) }}</el-text>
                        <div v-if="vacantRealEstateValue > 0"
                            style="font-size: 12px; color: #E6A23C; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                            <el-icon>
                                <Warning />
                            </el-icon>
                            <span>其中 {{ formatCurrency(vacantRealEstateValue) }} 為完全閒置資產</span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="總負債">
                        <el-text type="danger">{{ formatCurrency(totalLiabilities) }}</el-text>
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            (負債比 {{ debtRatio }}%)
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="月被動淨效益 (含設算)">
                        <el-text type="success" tag="b">{{ formatCurrency(monthlyPassiveIncome) }}</el-text>
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            含投資現金流 + 自用設算淨益
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="自有資金回報率 (ROE)">
                        <el-text :type="roeColor">{{ roe.toFixed(2) }} %</el-text>
                        <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                            (槓桿倍數 {{ leverage }}x)
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider />

            <el-row :gutter="24">
                <el-col :span="8" :xs="24">
                    <el-form-item label="金融資產">
                        <el-text>{{ formatCurrency(subtotals.portfolio) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="不動產總值">
                        <el-text>{{ formatCurrency(subtotals.realEstate) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="商業資產">
                        <el-text>{{ formatCurrency(subtotals.business) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { View, Hide, InfoFilled, Warning } from '@element-plus/icons-vue'
import type { UserFormState } from '@/components/plan/types/user'

// ==========================================
// Model & State
// ==========================================
const formState = defineModel<UserFormState>({ required: true })
const hideAmount = ref(false)

// ==========================================
// Helper Functions
// ==========================================
const getList = (source: any) => {
    if (!source) return []
    if (Array.isArray(source)) return source
    if (Array.isArray(source.list)) return source.list
    return []
}

const formatCurrency = (val?: number) => {
    if (hideAmount.value) return '****'
    const num = Number(val) || 0
    return num.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })
}

// ==========================================
// Core Calculations
// ==========================================

// 1. 各類別小計
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

// 2. 總資產
const totalAssets = computed(() =>
    subtotals.value.portfolio + subtotals.value.realEstate + subtotals.value.business
)

// [閒置資產計算] 僅計算 usageType 為 vacant (閒置) 的部分
// 註：自用 (self) 現在被視為有產出效益(設算租金)，所以不算在閒置警告中
const vacantRealEstateValue = computed(() => {
    const data = formState.value
    if (!data) return 0
    return getList(data.realEstates)
        .filter((item: any) => item.usageType === 'vacant')
        .reduce((sum: number, item: any) => sum + (Number(item.totalPrice) || 0), 0)
})

// 3. 總負債
const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const reLoan = getList(data.realEstates).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    const bizLoan = getList(data.businesses).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    return Math.round(reLoan + bizLoan)
})

// 4. 淨資產
const netWorth = computed(() => totalAssets.value - totalLiabilities.value)

// 5. 月被動淨效益 (Monthly Passive Net Benefit)
// 包含：投資現金流 + 自用設算淨益
const monthlyPassiveIncome = computed(() => {
    const data = formState.value
    if (!data) return 0

    // (A) 金融資產: 已實現損益 / 12
    const pFlow = getList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.realizedPnl) || 0) / 12), 0)

    // (B) 不動產: 根據用途計算淨效益
    const rFlow = getList(data.realEstates).reduce((sum: number, item: any) => {
        // 1. 計算月持有成本 (利息 + 稅)
        const loan = Number(item.loanAmount) || 0
        const rate = Number(item.interestRate) || 0
        const interest = (loan * (rate / 100)) / 12

        // 稅金：優先使用實際稅額，否則使用預估
        const assessed = Number(item.assessedValue) || 0
        const taxRate = Number(item.holdingTaxRate) || 0
        const estimatedTax = assessed * (taxRate / 100)
        const actualTax = Number(item.actualHoldingCost) || 0
        const finalAnnualTax = actualTax > 0 ? actualTax : estimatedTax
        const monthlyTax = finalAnnualTax / 12

        const monthlyCost = interest + monthlyTax
        const revenue = Number(item.monthlyRent) || 0 // 租金或設算租金

        if (item.usageType === 'rent') {
            // 出租：淨現金流 = 租金 - 成本
            return sum + (revenue - monthlyCost)
        } else if (item.usageType === 'self') {
            // 自用：設算淨益 = 設算租金 - 成本 (代表自用省下的錢扣除持有成本後的效益)
            return sum + (revenue - monthlyCost)
        } else {
            // 閒置：淨流出 = 0 - 成本
            return sum - monthlyCost
        }
    }, 0)

    // (C) 商業: 淨利
    const bFlow = getList(data.businesses).reduce((sum: number, item: any) => {
        const income = Number(item.monthlyIncome) || 0
        const cost = Number(item.monthlyCost) || 0
        const interest = (Number(item.loanAmount) * (Number(item.loanInterestRate) / 100)) / 12
        return sum + (income - cost - interest)
    }, 0)

    return Math.round(pFlow + rFlow + bFlow)
})

// ==========================================
// Ratios
// ==========================================

const roa = computed(() => {
    if (totalAssets.value <= 0) return 0
    // 分子現在包含了設算租金的淨額，分母包含所有資產
    return ((monthlyPassiveIncome.value * 12) / totalAssets.value) * 100
})

const roaStatus = computed(() => {
    const val = roa.value
    // 因為計入了自用設算，標準稍微提高
    if (val < 1.0) return { color: 'danger', label: '低效 / 閒置' }
    if (val < 2.5) return { color: 'warning', label: '普通' }
    if (val < 5.0) return { color: 'primary', label: '良好' }
    return { color: 'success', label: '優秀' }
})

const roe = computed(() => {
    if (netWorth.value <= 0) return 0
    return ((monthlyPassiveIncome.value * 12) / netWorth.value) * 100
})

const roeColor = computed(() => {
    if (roe.value < 0) return 'danger'
    if (roe.value < 5) return 'info'
    if (roe.value < 10) return 'primary'
    return 'success'
})

const debtRatio = computed(() => {
    if (totalAssets.value <= 0) return 0
    return Math.round((totalLiabilities.value / totalAssets.value) * 100)
})

const leverage = computed(() => {
    if (netWorth.value <= 0) return 0
    return (totalAssets.value / netWorth.value).toFixed(1)
})

const togglePrivacy = () => {
    hideAmount.value = !hideAmount.value
}
</script>

<style scoped>
/* Zero CSS */
</style>
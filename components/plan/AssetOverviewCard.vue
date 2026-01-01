<template>
    <el-card shadow="never">
        <el-form label-position="top">

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="預估淨資產">
                        <el-text size="large" tag="b">{{ formatCurrency(netWorth) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="財務健康度">
                        <el-tag :type="debtHealth.type" effect="plain">{{ debtHealth.label }}</el-tag>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider />

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="資產總額">
                        <el-text>{{ formatCurrency(totalAssets) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="負債總額">
                        <el-text type="danger">{{ formatCurrency(totalLiabilities) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="月被動現金流">
                        <el-text type="success">{{ formatCurrency(monthlyPassiveIncome) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="資產報酬率 (ROA)">
                        <el-text type="info">{{ roa.toFixed(2) }} %</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="負債比率">
                        <el-text>{{ debtRatio }} %</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="槓桿倍數">
                        <el-text type="info">{{ leverage }} x</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider />

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="金融資產市值">
                        <el-text>{{ formatCurrency(subtotals.portfolio) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item label="不動產市值">
                        <el-text>{{ formatCurrency(subtotals.realEstate) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="12" :xs="24">
                    <el-form-item label="商業與副業投入">
                        <el-text>{{ formatCurrency(subtotals.business) }}</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                </el-col>
            </el-row>

        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { View, Hide } from '@element-plus/icons-vue'
import type { UserFormState } from '@/components/plan/types/user'

// ==========================================
// Model & State
// ==========================================
const formState = defineModel<UserFormState>({ required: true })
const hideAmount = ref(false)

// ==========================================
// Helper Functions
// ==========================================
// 安全陣列轉換 (防呆)
const safeList = (list: any) => Array.isArray(list) ? list : []

const formatCurrency = (val: number) => {
    if (hideAmount.value) return '****'
    return val.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })
}

// ==========================================
// Core Calculations (Computed)
// ==========================================

// 1. 各類別小計 (Subtotals)
const subtotals = computed(() => {
    const data = formState.value
    if (!data) return { portfolio: 0, realEstate: 0, business: 0 }

    // 金融: 市值(原幣) * 匯率 = 台幣市值
    const portfolio = safeList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.marketValue) || 0) * (Number(item.exchangeRate) || 1)), 0)

    // 不動產: 市價 (totalPrice)
    const realEstate = safeList(data.realEstates).reduce((sum: number, item: any) =>
        sum + (Number(item.totalPrice) || 0), 0)

    // 商業: 成本 (acquisitionCost)
    const business = safeList(data.businesses.list).reduce((sum: number, item: any) =>
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

// 3. 總負債
const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const reLoan = safeList(data.realEstates).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    const bizLoan = safeList(data.businesses).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    return Math.round(reLoan + bizLoan)
})

// 4. 淨資產
const netWorth = computed(() => totalAssets.value - totalLiabilities.value)

// 5. 月被動收入
const monthlyPassiveIncome = computed(() => {
    const data = formState.value
    if (!data) return 0

    // 金融: (年度已實現損益[台幣]) / 12
    // [修正] realizedPnl 已經是台幣，不乘匯率
    const pFlow = safeList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.realizedPnl) || 0) / 12), 0)

    // 房產: 收租物件的租金 (monthlyRent)
    const rFlow = safeList(data.realEstates).reduce((sum: number, item: any) => {
        if (item.usageType !== 'rent') return sum
        return sum + (Number(item.monthlyRent) || 0)
    }, 0)

    // 商業: (月收 - 月支 - 利息)
    const bFlow = safeList(data.businesses).reduce((sum: number, item: any) => {
        const income = Number(item.monthlyIncome) || 0
        const cost = Number(item.monthlyCost) || 0
        const interest = (Number(item.loanAmount) * (Number(item.loanInterestRate) / 100)) / 12
        return sum + (income - cost - interest)
    }, 0)

    return Math.round(pFlow + rFlow + bFlow)
})

// 6. 指標計算
const debtRatio = computed(() => {
    if (totalAssets.value === 0) return 0
    return Math.round((totalLiabilities.value / totalAssets.value) * 100)
})

const debtHealth = computed(() => {
    const r = debtRatio.value
    if (r === 0) return { type: 'success', label: '無負債' }
    if (r < 40) return { type: 'success', label: '健康' }
    if (r < 70) return { type: 'warning', label: '適中' }
    return { type: 'danger', label: '偏高' }
})

const roa = computed(() => {
    if (totalAssets.value === 0) return 0
    return ((monthlyPassiveIncome.value * 12) / totalAssets.value) * 100
})

const leverage = computed(() => {
    if (netWorth.value <= 0) return 0
    return (totalAssets.value / netWorth.value).toFixed(1)
})

// ==========================================
// UI Logic
// ==========================================
const togglePrivacy = () => {
    hideAmount.value = !hideAmount.value
}
</script>

<style scoped>
/* Zero CSS */
</style>
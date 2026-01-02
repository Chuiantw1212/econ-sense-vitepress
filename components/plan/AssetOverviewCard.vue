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
                            <el-text :type="roaStatus.color" tag="b" style="font-size: 24px;">{{ roa.toFixed(2) }}
                                %</el-text>

                            <el-tooltip content="計算包含所有自用與閒置房產。若數值過低，代表您有大量資產處於「睡眠狀態」，建議考慮出租以提升效益。" placement="top">
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
                        <div v-if="nonRentedRealEstateValue > 0"
                            style="font-size: 12px; color: #E6A23C; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                            <el-icon>
                                <Warning />
                            </el-icon>
                            <span>其中 {{ formatCurrency(nonRentedRealEstateValue) }} 未產生現金流</span>
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
                    <el-form-item label="月被動現金流">
                        <el-text type="success" tag="b">{{ formatCurrency(monthlyPassiveIncome) }}</el-text>
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

    // [關鍵] 包含所有不動產 (自用+投資)
    // 這是為了拉大分母，凸顯閒置成本
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

// 2. 總資產 (ROA 分母)
const totalAssets = computed(() =>
    subtotals.value.portfolio + subtotals.value.realEstate + subtotals.value.business
)

// [新增] 未產生租金的房產價值 (自用+閒置)
const nonRentedRealEstateValue = computed(() => {
    const data = formState.value
    if (!data) return 0
    // 計算 usageType 不是 'rent' 的所有房產總值
    return getList(data.realEstates)
        .filter((item: any) => item.usageType !== 'rent')
        .reduce((sum: number, item: any) => sum + (Number(item.totalPrice) || 0), 0)
})

// 3. 總負債 (同步包含所有房貸，因為分母已包含所有房產)
const totalLiabilities = computed(() => {
    const data = formState.value
    if (!data) return 0
    const reLoan = getList(data.realEstates).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    const bizLoan = getList(data.businesses).reduce((sum: number, item: any) => sum + (Number(item.loanAmount) || 0), 0)
    return Math.round(reLoan + bizLoan)
})

// 4. 淨資產
const netWorth = computed(() => totalAssets.value - totalLiabilities.value)

// 5. 月被動現金流 (分子：嚴格只算實際進帳)
const monthlyPassiveIncome = computed(() => {
    const data = formState.value
    if (!data) return 0

    const pFlow = getList(data.portfolios).reduce((sum: number, item: any) =>
        sum + ((Number(item.realizedPnl) || 0) / 12), 0)

    // [關鍵] 房產只算有出租的
    const rFlow = getList(data.realEstates).reduce((sum: number, item: any) => {
        if (item.usageType !== 'rent') return sum
        return sum + (Number(item.monthlyRent) || 0)
    }, 0)

    const bFlow = getList(data.businesses).reduce((sum: number, item: any) => {
        const income = Number(item.monthlyIncome) || 0
        const cost = Number(item.monthlyCost) || 0
        const interest = (Number(item.loanAmount) * (Number(item.loanInterestRate) / 100)) / 12
        return sum + (income - cost - interest)
    }, 0)

    return Math.round(pFlow + rFlow + bFlow)
})

// ==========================================
// Ratios (行為激勵設計)
// ==========================================

// ROA: (年現金流 / 總資產)
// 由於分母包含自用宅，若不活化資產，此數值會很低
const roa = computed(() => {
    if (totalAssets.value <= 0) return 0
    return ((monthlyPassiveIncome.value * 12) / totalAssets.value) * 100
})

// ROA 狀態判斷 (激勵用語)
const roaStatus = computed(() => {
    const val = roa.value
    // 基準參考：若包含自用宅，通常 2% 以上就算及格
    if (val < 1.0) return { color: 'danger', label: '沉睡中 (極低)' }
    if (val < 2.5) return { color: 'warning', label: '待活化 (偏低)' }
    if (val < 5.0) return { color: 'primary', label: '運作良好' }
    return { color: 'success', label: '資產高效' }
})

const roe = computed(() => {
    if (netWorth.value <= 0) return 0
    return ((monthlyPassiveIncome.value * 12) / netWorth.value) * 100
})

const roeColor = computed(() => {
    // 這裡的標準比較高，因為我們期待槓桿能放大收益
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
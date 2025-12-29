<script setup>
import { ref } from 'vue'
import { Delete, Plus, House } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

// --- 資料邏輯 ---
const properties = ref([
    {
        id: 1,
        name: '板橋新板特區',
        age: 10,
        size: 45.5,
        pricePerPing: 88,
        totalPrice: 40040000,
        assessedValue: 12000000,
        holdingTaxRate: 1.2,
        loanAmount: 32000000,
        interestRate: 2.1,
        usageType: 'rent',
        monthlyRent: 85000
    }
])

const addProperty = () => {
    properties.value.push({
        id: Date.now(),
        name: '',
        age: 0,
        size: 0,
        pricePerPing: 0,
        totalPrice: 0,
        assessedValue: 0,
        holdingTaxRate: 1.2,
        loanAmount: 0,
        interestRate: 2.06,
        usageType: 'self',
        monthlyRent: 0
    })
}

const removeProperty = (index, item) => {
    ElMessageBox.confirm('確定移除此筆不動產配置嗎？', '警告', { type: 'warning' })
        .then(() => properties.value.splice(index, 1))
        .catch(() => { })
}

// 邏輯：坪數 x 單價 = 總價 (總價欄位 disabled，不反向計算)
const calcTotalPrice = (item) => {
    if (item.pricePerPing && item.size) {
        item.totalPrice = Math.round(item.pricePerPing * item.size * 10000)
    } else {
        item.totalPrice = 0
    }
}

// Helpers (Formatters)
const formatCurrency = (val) => {
    if (!val && val !== 0) return '-'
    return `$ ${Math.round(val).toLocaleString()}`
}

const formatPercentage = (val) => {
    if (!val && val !== 0) return '-'
    return `${Number(val).toFixed(2)} %`
}

// Computations
const getDownPayment = (item) => Math.max(0, item.totalPrice - item.loanAmount)

const getMonthlyCost = (item) => {
    const rate = Number(item.interestRate) || 0
    const taxRate = Number(item.holdingTaxRate) || 0
    const interest = (item.loanAmount * (rate / 100)) / 12
    const tax = (item.assessedValue * (taxRate / 100)) / 12
    return Math.round(interest + tax)
}

const getNetCashFlow = (item) => {
    if (item.usageType !== 'rent') return -getMonthlyCost(item)
    return item.monthlyRent - getMonthlyCost(item)
}

const getCashOnCashReturn = (item) => {
    const downPayment = getDownPayment(item)
    if (downPayment <= 0) return 0
    const annualNetIncome = getNetCashFlow(item) * 12
    return (annualNetIncome / downPayment) * 100
}
</script>

<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="properties.length === 0" description="尚未配置不動產資產">
            <el-button type="primary" :icon="Plus" @click="addProperty">新增不動產</el-button>
        </el-empty>

        <el-card v-for="(item, index) in properties" :key="item.id" shadow="never">
            <el-form label-width="auto">

                <el-row justify="space-between" align="middle">
                    <el-col :span="20">
                        <el-space>
                            <el-icon :size="16">
                                <House />
                            </el-icon>
                            <span style="font-weight: bold; font-size: 16px;">不動產 {{ index + 1 }}</span>
                            <el-tag size="small"
                                :type="item.usageType === 'rent' ? 'warning' : (item.usageType === 'self' ? 'primary' : 'info')"
                                effect="plain">
                                {{ item.usageType === 'rent' ? '收租中' : (item.usageType === 'self' ? '自用' : '閒置') }}
                            </el-tag>
                        </el-space>
                    </el-col>
                    <el-col :span="4" style="text-align: right;">
                        <el-button type="danger" plain circle :icon="Delete" @click="removeProperty(index, item)" />
                    </el-col>
                </el-row>

                <el-divider />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="物件名稱">
                            <el-input v-model="item.name" placeholder="例：板橋自用宅" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="屋齡 (年)">
                            <el-input-number v-model="item.age" :min="0" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="權狀坪數">
                            <el-input-number v-model="item.size" :precision="2" style="width: 100%" :controls="false"
                                @change="calcTotalPrice(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="單價 (萬/坪)">
                            <el-input-number v-model="item.pricePerPing" :precision="1" style="width: 100%"
                                :controls="false" @change="calcTotalPrice(item)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="總價 (自動計算)">
                            <el-input :model-value="formatCurrency(item.totalPrice)" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="用途狀態">
                            <el-select v-model="item.usageType" style="width: 100%">
                                <el-option label="自用住宅" value="self" />
                                <el-option label="出租投資" value="rent" />
                                <el-option label="閒置資產" value="vacant" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">成本與財務 (Costs)</el-divider>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="公告/評定現值">
                            <el-input-number v-model="item.assessedValue" :step="10000" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="預估持有稅率">
                            <el-input v-model.number="item.holdingTaxRate" type="number" placeholder="0.0">
                                <template #suffix>%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="銀行貸款餘額">
                            <el-input-number v-model="item.loanAmount" :step="100000" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年利率">
                            <el-input v-model.number="item.interestRate" type="number" placeholder="0.0">
                                <template #suffix>%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="每月持有成本">
                            <el-input :model-value="formatCurrency(getMonthlyCost(item))" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">投資效益分析 (ROI)</el-divider>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="月租金收入">
                            <el-input-number v-model="item.monthlyRent" :step="1000" style="width: 100%"
                                controls-position="right" :disabled="item.usageType !== 'rent'" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="頭期款 (投入本金)">
                            <el-input :model-value="formatCurrency(getDownPayment(item))" disabled />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="每月淨現金流">
                            <el-input :model-value="formatCurrency(getNetCashFlow(item))" disabled />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="現金回報率 (ROI)">
                            <el-input
                                :model-value="item.usageType === 'rent' ? formatPercentage(getCashOnCashReturn(item)) : '-'"
                                disabled />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="properties.length > 0" type="primary" plain :icon="Plus" style="width: 100%;"
            @click="addProperty">
            新增不動產配置
        </el-button>

    </el-space>
</template>
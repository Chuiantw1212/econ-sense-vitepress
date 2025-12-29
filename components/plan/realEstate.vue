<script setup>
import { ref } from 'vue'
import { Delete, Plus, House, Money, Wallet } from '@element-plus/icons-vue'
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

        // 稅務相關
        assessedValue: 12000000, // 稅基
        holdingTaxRate: 1.2,     // 預估持有稅率 (房屋稅+地價稅)

        loanAmount: 32000000,
        interestRate: 2.1,
        usageType: 'rent',
        monthlyRent: 85000
    }
])

// 新增
const addProperty = () => {
    properties.value.push({
        id: Date.now(),
        name: '',
        age: 0,
        size: 0,
        pricePerPing: 0,
        totalPrice: 0,
        assessedValue: 0,
        holdingTaxRate: 1.2, // 預設平均值
        loanAmount: 0,
        interestRate: 2.06,
        usageType: 'self',
        monthlyRent: 0
    })
}

// 刪除
const removeProperty = (index, item) => {
    ElMessageBox.confirm('確定移除此筆不動產配置嗎？', '警告', { type: 'warning' })
        .then(() => properties.value.splice(index, 1))
        .catch(() => { })
}

// 連動計算：坪數 x 單價 = 總價
const calcTotalPrice = (item) => {
    if (item.pricePerPing && item.size) {
        item.totalPrice = Math.round(item.pricePerPing * item.size * 10000)
    }
}

// 連動計算：總價 / 坪數 = 單價
const calcUnitPrice = (item) => {
    if (item.totalPrice && item.size) {
        item.pricePerPing = parseFloat((item.totalPrice / 10000 / item.size).toFixed(1))
    }
}

// 輔助計算：月利息
const getMonthlyInterest = (item) => {
    return Math.round((item.loanAmount * (item.interestRate / 100)) / 12)
}

// 輔助計算：年持有稅 (房屋稅 + 地價稅)
const getAnnualTax = (item) => {
    return Math.round(item.assessedValue * (item.holdingTaxRate / 100))
}

// 輔助計算：每月平均持有稅成本
const getMonthlyTaxCost = (item) => {
    return Math.round(getAnnualTax(item) / 12)
}

// 輔助計算：淨現金流 (租金 - 利息 - 持有稅攤提)
const getNetIncome = (item) => {
    const rent = item.usageType === 'rent' ? item.monthlyRent : 0
    const interest = getMonthlyInterest(item)
    const taxCost = getMonthlyTaxCost(item) // 這裡把稅也扣掉，算得更精準
    return rent - interest - taxCost
}

// 輔助計算：年化投報率
const getYield = (item) => {
    if (!item.totalPrice) return 0
    // 年淨利 / 總成本
    const annualNetIncome = getNetIncome(item) * 12
    return (annualNetIncome / item.totalPrice * 100).toFixed(2)
}
</script>

<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="properties.length === 0" description="尚未配置不動產資產">
            <el-button type="primary" :icon="Plus" @click="addProperty">新增不動產</el-button>
        </el-empty>

        <el-card v-for="(item, index) in properties" :key="item.id" shadow="never">
            <el-form label-width="auto">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <el-icon>
                            <House />
                        </el-icon>
                        不動產 {{ index + 1 }}
                        <el-tag size="small" :type="item.usageType === 'rent' ? 'warning' : 'info'" effect="plain">
                            {{ item.usageType === 'rent' ? '收租中' : '自用/閒置' }}
                        </el-tag>
                    </span>
                    <el-button type="danger" plain circle :icon="Delete" @click="removeProperty(index, item)" />
                </div>

                <el-divider style="margin: 12px 0;" />

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
                                placeholder="坪" @change="calcTotalPrice(item)" />
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
                        <el-form-item label="總價 (市價)">
                            <el-input-number v-model="item.totalPrice" :step="100000" style="width: 100%"
                                controls-position="right" @change="calcUnitPrice(item)" />
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

                <el-divider content-position="left">稅務試算 (Tax Calculation)</el-divider>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="公告/評定現值 (稅基)">
                            <el-input-number v-model="item.assessedValue" :step="10000" style="width: 100%"
                                controls-position="right" placeholder="此金額將用於遺產稅/贈與稅計算基礎" />
                            <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                                * 此數值為「房屋評定現值」與「土地公告現值」之總和，作為遺產稅、贈與稅之計算基準。
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="預估持有稅率 (%)">
                            <div style="display: flex; gap: 8px; width: 100%; align-items: center;">
                                <el-input-number v-model="item.holdingTaxRate" :precision="2" :step="0.1"
                                    style="flex-grow: 1;" :controls="false" />
                                <el-tooltip content="通常約為公告現值的 1.0% ~ 1.5% (含房屋稅與地價稅)" placement="top">
                                    <el-icon color="#909399">
                                        <InfoFilled />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="預估年持有稅 (成本)">
                            <el-tag type="warning" effect="plain" style="width: 100%; justify-content: start;">
                                支出 ${{ getAnnualTax(item).toLocaleString() }} / 年
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">財務槓桿 (Financial Leverage)</el-divider>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="貸款餘額">
                            <el-input-number v-model="item.loanAmount" :step="100000" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年利率 (%)">
                            <el-input-number v-model="item.interestRate" :precision="2" :step="0.1" style="width: 100%"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20"
                    style="background-color: var(--el-fill-color-lighter); padding-top: 18px; border-radius: 4px; margin-top: 10px; margin-left: 0; margin-right: 0;">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="月租金收入">
                            <el-input-number v-model="item.monthlyRent" :step="1000" style="width: 100%"
                                controls-position="right" :disabled="item.usageType !== 'rent'" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :xs="24">
                        <el-form-item label="每月淨現金流 (稅後)">
                            <el-tag style="width: 100%; justify-content: start;" disable-transitions
                                :type="getNetIncome(item) > 0 ? 'success' : 'danger'" effect="dark">
                                <span v-if="item.usageType === 'rent'">
                                    {{ getNetIncome(item) >= 0 ? '+' : '' }} ${{ getNetIncome(item).toLocaleString() }}
                                </span>
                                <span v-else>
                                    - ${{ (getMonthlyInterest(item) + getMonthlyTaxCost(item)).toLocaleString() }}
                                    (利息+稅)
                                </span>
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-card>

        <el-button v-if="properties.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addProperty">
            新增不動產配置
        </el-button>

    </el-space>
</template>
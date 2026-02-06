<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="!realEstates || realEstates.length === 0" description="尚未配置不動產資產">
            <el-button type="primary" :icon="Plus" @click="addProperty">
                新增不動產
            </el-button>
        </el-empty>

        <el-card v-for="(item, index) in realEstates" :key="item.id || `re-${index}`" shadow="never">
            <el-form label-width="auto">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <el-icon>
                            <House />
                        </el-icon>
                        不動產 {{ index + 1 }}

                        <el-tag size="small"
                            :type="item.usageType === 'rent' ? 'warning' : (item.usageType === 'self' ? 'primary' : 'info')"
                            effect="plain">
                            {{ item.usageType === 'rent' ? '收租中' : (item.usageType === 'self' ? '自用' : '閒置') }}
                        </el-tag>

                        <el-tag v-if="!item.id" size="small" type="warning" effect="plain" round>
                            {{ isGuest ? '離線試算' : '未同步' }}
                        </el-tag>
                    </span>
                    <el-button type="danger" plain circle :icon="Delete" @click="removeProperty(index, item)" />
                </div>

                <el-divider style="margin: 12px 0;" />

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="物件名稱">
                            <el-input v-model="item.name" placeholder="例：板橋自用宅" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="屋齡 (年)">
                            <el-input-number v-model="item.age" :min="0" style="width: 100%" controls-position="right"
                                @change="handleUpdate(item)" />
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
                            <el-select v-model="item.usageType" style="width: 100%" @change="handleUpdate(item)">
                                <el-option label="自用住宅" value="self" />
                                <el-option label="出租投資" value="rent" />
                                <el-option label="閒置資產" value="vacant" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">房屋稅</el-divider>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="公告/評定現值">
                            <el-input-number v-model="item.assessedValue" :step="10000" style="width: 100%"
                                controls-position="right" placeholder="稅務計算基礎" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="預估持有稅率">
                            <el-input v-model.number="item.holdingTaxRate" type="number" placeholder="1.2"
                                @change="handleUpdate(item)">
                                <template #suffix>%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="試算年持有成本">
                            <el-input :model-value="formatCurrency(getEstimatedAnnualTax(item))" disabled
                                placeholder="自動試算" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="實際支付房屋稅 (年)">
                            <el-input-number v-model="item.actualHoldingCost" :step="1000" style="width: 100%"
                                controls-position="right" placeholder="請填寫實際稅單金額以核對" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="差異檢核 (地價稅)">
                            <el-tag v-if="item.actualHoldingCost > 0"
                                :type="getEstimatedAnnualTax(item) - item.actualHoldingCost >= 0 ? 'success' : 'warning'"
                                effect="plain" style="width: 100%; justify-content: start;">
                                {{ (getEstimatedAnnualTax(item) - item.actualHoldingCost) >= 0 ? '安全' : '預估偏低' }}
                                (差額: ${{ Math.abs(getEstimatedAnnualTax(item) - item.actualHoldingCost).toLocaleString()
                                }})
                            </el-tag>
                            <el-tag v-else type="info" effect="plain" style="width: 100%; justify-content: start;">
                                尚未輸入實際稅額
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">房貸</el-divider>

                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="銀行貸款餘額">
                            <el-input-number v-model="item.loanAmount" :step="100000" style="width: 100%"
                                controls-position="right" @change="handleUpdate(item)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="年利率">
                            <el-input v-model.number="item.interestRate" type="number" placeholder="2.06"
                                @change="handleUpdate(item)">
                                <template #suffix>%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="每月總持有成本 (試算)">
                            <el-input :model-value="formatCurrency(getMonthlyCost(item))" disabled>
                                <template #prefix>月均攤提：</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">效益分析 (ROI)</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item>
                            <template #label>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>{{ item.usageType === 'self' ? '設算租金' : '月租金收入' }}</span>
                                    <el-tooltip v-if="item.usageType === 'self'"
                                        content="請填入若此房出租可獲得的市場租金，用於計算真實資產效益 (ROA)。" placement="top">
                                        <el-icon>
                                            <InfoFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                            <el-input-number v-model="item.monthlyRent" :step="1000" style="width: 100%"
                                controls-position="right" :disabled="item.usageType === 'vacant'"
                                :placeholder="item.usageType === 'self' ? '請填寫同地段租金' : '實際租金'"
                                @change="handleUpdate(item)" />
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

        <el-button v-if="realEstates && realEstates.length > 0" type="primary" plain :icon="Plus"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addProperty">
            新增不動產配置
        </el-button>

    </el-space>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Delete, Plus, House, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UserRealEstate } from './types/user'
import { useApi } from '@/components/plan/composables/useApi'
// [引入] UserPlan 以判斷身分
import { useUserPlan } from '@/components/plan/composables/useUserPlan'

// --- 雙向綁定 ---
const realEstates = defineModel<UserRealEstate[]>({
    required: true,
    default: []
})

// --- API & State ---
const { authFetch } = useApi()
const { loggedInUser } = useUserPlan()

// 判斷是否為訪客
const isGuest = computed(() => !loggedInUser.value.uid)

// --- Lifecycle ---
onMounted(() => {
    // 簡單的資料初始化，確保有預設值
    if (realEstates.value) {
        realEstates.value.forEach(item => {
            if (item.actualHoldingCost === undefined) {
                item.actualHoldingCost = 0
            }
        })
    }
})

// --- Actions (樂觀更新模式) ---

/**
 * 新增不動產
 */
async function addProperty() {
    const currentList = realEstates.value || []

    const newProperty: UserRealEstate = {
        id: "", // 離線 ID
        name: '新物件',
        age: 0,
        size: 0,
        pricePerPing: 0,
        totalPrice: 0,
        assessedValue: 0,
        holdingTaxRate: 1.2,
        actualHoldingCost: 0,
        loanAmount: 0,
        interestRate: 2.06,
        usageType: 'self',
        monthlyRent: 0
    }

    // 1. [UI 優先] 強制響應更新
    realEstates.value = [...currentList, newProperty]

    // 2. [訪客攔截]
    if (isGuest.value) {
        return
    }

    // 3. [背景同步]
    try {
        const res = await authFetch('/api/v1/user/real-estates', { method: 'POST', body: newProperty })
        if (res && res.ok) {
            const rawData = await res.json()
            // 回填 ID
            const lastIndex = realEstates.value.length - 1
            if (lastIndex >= 0) {
                Object.assign(realEstates.value[lastIndex], rawData)
            }
        }
    } catch (e) {
        console.warn('新增不動產連線失敗，保留為本地資料', e)
    }
}

/**
 * 移除不動產
 */
async function removeProperty(index: number, item: UserRealEstate) {
    // 1. [UI 優先] 立即移除
    const newList = [...realEstates.value]
    newList.splice(index, 1)
    realEstates.value = newList

    // 2. [訪客/離線攔截]
    if (isGuest.value || !item.id) {
        return
    }

    // 3. [背景同步]
    try {
        authFetch(`/api/v1/user/real-estates/${item.id}`, { method: 'DELETE' })
            .catch(e => console.warn('背景刪除失敗', e))
        ElMessage.success('已移除項目')
    } catch (e) {
        console.warn(e)
    }
}

/**
 * 更新 (欄位變更時觸發)
 */
async function handleUpdate(item: UserRealEstate) {
    // 1. [訪客/離線攔截]
    if (isGuest.value || !item.id) return

    // 2. [背景同步]
    try {
        await authFetch(`/api/v1/user/real-estates/${item.id}`, {
            method: 'PUT',
            body: item
        })
    } catch (e) {
        console.warn('Update failed', e)
    }
}

function calcTotalPrice(item: UserRealEstate) {
    if (item.pricePerPing && item.size) {
        item.totalPrice = Math.round(item.pricePerPing * item.size * 10000)
    } else {
        item.totalPrice = 0
    }
    // 計算完觸發更新
    handleUpdate(item)
}

// --- Helpers & Computations (保持不變) ---
function formatCurrency(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '-'
    return `$ ${Math.round(val).toLocaleString()}`
}

function formatPercentage(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '-'
    return `${Number(val).toFixed(2)} %`
}

function getEstimatedAnnualTax(item: UserRealEstate): number {
    const taxRate = Number(item.holdingTaxRate) || 0
    return Math.round(item.assessedValue * (taxRate / 100))
}

function getMonthlyCost(item: UserRealEstate): number {
    const rate = Number(item.interestRate) || 0
    const interest = (item.loanAmount * (rate / 100)) / 12
    const annualTax = (item.actualHoldingCost && item.actualHoldingCost > 0)
        ? item.actualHoldingCost
        : getEstimatedAnnualTax(item)
    return Math.round(interest + (annualTax / 12))
}

function getDownPayment(item: UserRealEstate): number {
    return Math.max(0, item.totalPrice - item.loanAmount)
}

function getNetCashFlow(item: UserRealEstate): number {
    if (item.usageType !== 'rent') return -getMonthlyCost(item)
    return item.monthlyRent - getMonthlyCost(item)
}

function getCashOnCashReturn(item: UserRealEstate): number {
    const downPayment = getDownPayment(item)
    if (downPayment <= 0) return 0
    const annualNetIncome = getNetCashFlow(item) * 12
    return (annualNetIncome / downPayment) * 100
}
</script>
<template>
    <el-space direction="vertical" fill size="large" style="width: 100%">

        <el-empty v-if="realEstates.length === 0" description="尚未配置不動產資產">
            <el-button type="primary" :icon="Plus" :loading="isAdding" @click="addProperty">
                新增不動產
            </el-button>
        </el-empty>

        <el-card v-for="(item, index) in realEstates" :key="item.id" shadow="never">
            <el-form label-width="auto">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <el-icon>
                            <House />
                        </el-icon>
                        不動產 {{ index + 1 }}
                        <el-tag size="small" type="info" effect="plain">
                            {{ item.usageType === 'rent' ? '收租中' : (item.usageType === 'self' ? '自用' : '閒置') }}
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

        <el-button v-if="realEstates.length > 0" type="primary" plain :icon="Plus" :loading="isAdding"
            style="width: 100%; margin-top: 8px; border-style: dashed;" @click="addProperty">
            新增不動產配置
        </el-button>

    </el-space>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Delete, Plus, House } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { UserRealEstate } from './types/user'
// 引入 API 模組
import { useApi } from '@/components/plan/composables/useApi'

// --- 1. 定義 Props 與 Emits ---
const props = defineProps<{
    modelValue: UserRealEstate[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: UserRealEstate[]): void
}>()

// --- 2. 初始化 API 與狀態 ---
const { authFetch } = useApi()
const realEstates = ref<UserRealEstate[]>([])
const isAdding = ref(false) // Loading 狀態

// --- 3. 雙向綁定同步機制 ---
watch(() => props.modelValue, function (newVal) {
    if (newVal) {
        realEstates.value = newVal
    }
}, { immediate: true })

watch(realEstates, function (newVal) {
    emit('update:modelValue', newVal)
}, { deep: true })


// --- 核心邏輯 Function ---

/**
 * 非同步新增：呼叫 API 建立不動產
 * POST /api/v1/user/real-estates (不帶 Body)
 * 由後端產生預設資料並回傳完整物件
 */
async function addProperty() {
    if (isAdding.value) return
    isAdding.value = true

    try {
        const res = await authFetch('/api/v1/user/real-estates', {
            method: 'POST'
        })

        // ★★★ 修正點：加入 Null Check 與 狀態碼檢查 ★★★
        if (!res) {
            throw new Error('無法取得回應 (Response is null)')
        }

        if (!res.ok) {
            throw new Error(`新增失敗，伺服器回應代碼: ${res.status}`)
        }

        // 確定 res 存在且 ok 後，再解析 JSON
        const newProperty: UserRealEstate = await res.json()

        realEstates.value.push(newProperty)
        ElMessage.success('已新增不動產項目')

    } catch (e) {
        console.error('Add property failed:', e)
        ElMessage.error('新增失敗，請檢查網路連線')
    } finally {
        isAdding.value = false
    }
}

/**
 * 移除指定的不動產配置
 */
async function removeProperty(index: number, item: UserRealEstate) {
    try {
        // 1. 呼叫後端 API 進行刪除
        await authFetch(`/api/v1/user/real-estates/${item.id}`, {
            method: 'DELETE'
        })

        // 2. API 成功後，才移除本地資料
        realEstates.value.splice(index, 1)
        ElMessage.success('已移除項目')

    } catch (e) {
        console.error('Delete property failed:', e)
        ElMessage.error('刪除失敗，請稍後再試')
    }
}

/**
 * 連動計算：坪數 x 單價 = 總價
 */
function calcTotalPrice(item: UserRealEstate) {
    if (item.pricePerPing && item.size) {
        item.totalPrice = Math.round(item.pricePerPing * item.size * 10000)
    } else {
        item.totalPrice = 0
    }
}

// --- 格式化工具 Helpers ---

function formatCurrency(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '-'
    return `$ ${Math.round(val).toLocaleString()}`
}

function formatPercentage(val: number | undefined): string {
    if (val === undefined || isNaN(val)) return '-'
    return `${Number(val).toFixed(2)} %`
}

// --- 數值計算 Computations ---

function getDownPayment(item: UserRealEstate): number {
    return Math.max(0, item.totalPrice - item.loanAmount)
}

function getMonthlyCost(item: UserRealEstate): number {
    const rate = Number(item.interestRate) || 0
    const taxRate = Number(item.holdingTaxRate) || 0
    const interest = (item.loanAmount * (rate / 100)) / 12
    const tax = (item.assessedValue * (taxRate / 100)) / 12
    return Math.round(interest + tax)
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

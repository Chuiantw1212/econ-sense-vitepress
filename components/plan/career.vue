<template>
    <el-card shadow="never">
        <template #header>
            職業收入
        </template>
        <el-form label-width="auto" :model="localModel">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="本薪" required>
                        <el-input-number v-model="localModel.monthlyBaseSalary" :min="0" :step="1000"
                            style="width: 100%" @change="handleChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本薪">
                        <el-text>{{ formatNumber(localModel.monthlyBaseSalary) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 伙食津貼">
                        <el-text>3,000 (免稅)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他津貼">
                        <el-input-number v-model="localModel.regionalAllowance" :min="0" :step="1000"
                            style="width: 100%" @change="handleChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 其他津貼">
                        <el-text>{{ formatNumber(localModel.regionalAllowance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="勞退自提率(%)">
                        <el-input-number v-model="pensionSelfRate" :min="0" :max="6" style="width: 100%"
                            @change="handleChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞退自提">
                        <el-text>{{ formatNumber(pensionAmount) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞保自付">
                        <el-text>{{ formatNumber(localModel.socialInsurance?.personalPremium) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 健保自付">
                        <el-text>{{ formatNumber(localModel.healthInsurancePremium) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他扣款">
                        <el-input-number v-model="localModel.employeeWelfareFundAmount" :min="0" :step="100"
                            style="width: 100%" @change="handleChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 其他扣款">
                        <el-text>{{ formatNumber(localModel.employeeWelfareFundAmount) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="= 每月實領">
                        <el-text>
                            {{ formatNumber(netIncome) }}
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

// --- 資料介面定義 (需與父層一致) ---
export interface CareerProfile {
    monthlyBaseSalary: number;      // 本薪
    regionalAllowance: number;      // 其他津貼
    mealAllowance: number;          // 伙食津貼 (固定 3000)
    employeeWelfareFundAmount: number; // 其他扣款 (福利金等)

    socialInsurance: {
        personalPremium: number;      // 勞保自付
        insuredSalary: number;        // 投保薪資
    };

    pension: {
        employeeMonthlyContribution: number; // 勞退自提金額
    };

    healthInsurancePremium: number; // 健保自付
}

// --- Props 與 Emits 定義 ---
const props = defineProps<{
    modelValue: CareerProfile // 接收父層資料
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: CareerProfile): void
    (e: 'trigger-save'): void // 通知父層發送 API 更新請求
}>()

// --- 資料代理 (Data Proxy) ---
// 透過 computed 的 setter 攔截修改，確保資料流向正確
const localModel = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
        emit('trigger-save') // 資料變更時，通知父層儲存
    }
})

// --- 內部狀態 (UI Helper) ---
const pensionSelfRate = ref(0) // 勞退自提率 (0% - 6%)

// 監聽自提率變動，計算金額並寫回資料
watch(pensionSelfRate, (newRate) => {
    const base = localModel.value.socialInsurance.insuredSalary || localModel.value.monthlyBaseSalary
    const amount = Math.round(base * (newRate / 100))

    // 更新特定欄位 (建立新物件以觸發 Reactivity)
    const updatedData = {
        ...localModel.value,
        pension: {
            ...localModel.value.pension,
            employeeMonthlyContribution: amount
        }
    }
    localModel.value = updatedData
})

// --- 計算邏輯 (基於 Props) ---

// 1. 勞退自提金額 (直接讀取資料)
const pensionAmount = computed(() => localModel.value.pension?.employeeMonthlyContribution || 0)

// 2. 實領薪資計算
const netIncome = computed(() => {
    const data = localModel.value
    const income = (data.monthlyBaseSalary || 0) +
        (data.mealAllowance || 0) +
        (data.regionalAllowance || 0)

    const deduction = (data.pension?.employeeMonthlyContribution || 0) +
        (data.socialInsurance?.personalPremium || 0) +
        (data.healthInsurancePremium || 0) +
        (data.employeeWelfareFundAmount || 0)

    return income - deduction
})

// --- 工具函式 ---
const formatNumber = (num: number) => {
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('zh-TW').format(num)
}

// 處理數值變更的通用函式 (用於 input-number @change)
// 這能確保每次微調數字都觸發父層更新
const handleChange = () => {
    // 由於 localModel 是 computed，直接 v-model 綁定深層屬性 (如 localModel.monthlyBaseSalary) 
    // 在 Vue 3 有時會直接修改到物件參照。
    // 為了確保 trigger-save 被觸發，我們可以在 @change 呼叫此函式
    emit('trigger-save')
}
</script>

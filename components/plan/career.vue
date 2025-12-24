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
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本薪">
                        <el-text>{{ formatNumber(localModel.monthlyBaseSalary) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="+ 伙食津貼">
                        <el-text>3,000 (免稅)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他津貼">
                        <el-input-number v-model="localModel.otherAllowance" :min="0" :step="1000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 其他津貼">
                        <el-text>{{ formatNumber(localModel.otherAllowance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="勞退自提率(%)">
                        <el-input-number v-model="localModel.pensionRate" :min="0" :max="6" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞退自提">
                        <el-text>{{ formatNumber(localModel.pensionAmount) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="員工認股(自提)">
                        <el-input-number v-model="localModel.stockDeduction" :min="0" :step="1000" style="width: 100%"
                            placeholder="每月扣款金額" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 認股扣款">
                        <el-text>{{ formatNumber(localModel.stockDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="公司加碼(公提)">
                        <el-input-number v-model="localModel.stockCompanyMatch" :min="0" :step="1000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="資產累積">
                        <el-text type="info">
                            + {{ formatNumber(localModel.stockCompanyMatch) }} (不影響實領)
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞保自付">
                        <el-text>{{ formatNumber(localModel.laborInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="- 健保自付">
                        <el-text>{{ formatNumber(localModel.healthInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他扣款">
                        <el-input-number v-model="localModel.otherDeduction" :min="0" :step="100" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 其他扣款">
                        <el-text>{{ formatNumber(localModel.otherDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="= 每月實領">
                        <el-text>
                            {{ formatNumber(monthlyNetIncome) }}
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </el-card>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
// import type { CareerProfile } from './types/user';
interface CareerProfile {
    monthlyBaseSalary: number;
    otherAllowance: number;
    laborInsurance: number;
    healthInsurance: number;
    otherDeduction: number;

    // 更新：Rate 和 Amount 都存入資料庫
    pensionRate: number;
    pensionAmount: number;

    // 員工認股 (保留前一版功能)
    stockDeduction: number;
    stockCompanyMatch: number;
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

// 移除原本的 const pensionRate = ref(0)
// 改用 Watch 監聽：當「本薪」或「提撥率」變動時，自動計算「提撥金額」並寫入 model
watch(
    [() => localModel.value.monthlyBaseSalary, () => localModel.value.pensionRate],
    ([newSalary, newRate]) => {
        const base = newSalary || 0
        const rate = newRate || 0
        const calculatedAmount = Math.round(base * (rate / 100))

        // 只有當計算結果與當前儲存值不同時才更新，避免非必要的寫入
        if (localModel.value.pensionAmount !== calculatedAmount) {
            localModel.value = {
                ...localModel.value,
                pensionAmount: calculatedAmount
            }
        }
    },
    { immediate: true } // 初始化時立即執行一次，確保金額正確
)

// 2. 實領薪資計算
const monthlyNetIncome = computed(() => {
    const income = (localModel.value.monthlyBaseSalary || 0) +
        (localModel.value.otherAllowance || 0) +
        3000

    const deductions = (localModel.value.pensionAmount || 0) +
        (localModel.value.stockDeduction || 0) +
        (localModel.value.laborInsurance || 0) +
        (localModel.value.healthInsurance || 0) +
        (localModel.value.otherDeduction || 0)

    return income - deductions
})

// --- 工具函式 ---
const formatNumber = (num: number) => {
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('zh-TW').format(num)
}
</script>

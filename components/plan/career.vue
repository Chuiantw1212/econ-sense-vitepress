<template>
    <el-card shadow="never">
        <el-form label-width="auto" :model="career">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="本薪" required>
                        <el-input-number v-model="career.baseSalary" :min="0" :step="1000" style="width: 100%"
                            @change="handleCalcAndSave" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本薪">
                        <el-text>{{ formatNumber(career.baseSalary) }}</el-text>
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
                        <el-input-number v-model="career.otherAllowance" :min="0" :step="1000" style="width: 100%"
                            @change="handleCalcAndSave" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 其他津貼">
                        <el-text>{{ formatNumber(career.otherAllowance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="勞退自提率(%)">
                        <el-input-number v-model="career.pensionRate" :min="0" :max="6" style="width: 100%"
                            @change="handleCalcAndSave" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞退自提">
                        <el-text>{{ formatNumber(career.pensionAmount) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞保自付">
                        <el-text>{{ formatNumber(career.laborInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="健保眷屬人數">
                        <el-input-number v-model="career.dependents" :min="0" :max="3" :step="1" style="width: 100%"
                            @change="handleCalcAndSave" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 健保自付">
                        <el-text>{{ formatNumber(career.healthInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他扣款">
                        <el-input-number v-model="career.otherDeduction" :min="0" :step="100" style="width: 100%"
                            @change="handleSaveOnly" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 其他扣款">
                        <el-text>{{ formatNumber(career.otherDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="員工認股(自提)">
                        <el-input-number v-model="career.stockDeduction" :min="0" :step="1000" style="width: 100%"
                            placeholder="每月扣款金額" @change="handleSaveOnly" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 認股扣款">
                        <el-text>{{ formatNumber(career.stockDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="公司加碼(公提)">
                        <el-input-number v-model="career.stockCompanyMatch" :min="0" :step="1000" style="width: 100%"
                            @change="handleSaveOnly" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="資產累積">
                        <el-text type="info">
                            + {{ formatNumber(career.stockCompanyMatch) }} (不影響實領)
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="= 每月實領">
                        <el-text size="large" tag="b" color="primary">
                            {{ formatNumber(career.monthlyNetIncome) }}
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="center">薪資結構視覺化</el-divider>

            <CareerChart :data="career" />

        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import type { UserCareer } from './types/user'
import { useApi } from '@/components/plan/composables/useApi'
import CareerChart from './charts/CareerChart.vue'

// Composables
import { useLaborPension } from '@/components/plan/composables/useLaborPension'
import { useLaborInsurance } from '@/components/plan/composables/useLaborInsurance'
import { useHealthInsurance } from '@/components/plan/composables/useHealthInsurance'

// --- 1. Define Model (包含 monthlyNetIncome) ---
const career = defineModel<UserCareer>({
    required: true,
    default: () => ({
        baseSalary: 0,
        otherAllowance: 0,
        laborInsurance: 0,
        healthInsurance: 0,
        otherDeduction: 0,
        pensionRate: 0,
        pensionAmount: 0,
        stockDeduction: 0,
        stockCompanyMatch: 0,
        dependents: 0,
        monthlyNetIncome: 0,
    })
})

const { authFetch } = useApi()

// 初始化 Composables (用於勞健保計算邏輯)
const pension = useLaborPension(0, 0)
const labor = useLaborInsurance(0)
const health = useHealthInsurance(0, 0)

// --- 2. 核心計算邏輯：實領金額 (每月淨收入) ---

/**
 * 計算並將結果寫入 career.monthlyNetIncome
 * 公式：(本薪 + 其他津貼 + 伙食) - (勞退自提 + 認股 + 勞保 + 健保 + 其他扣款)
 */
function updateMonthlyNetIncome() {
    const m = career.value
    const income = (m.baseSalary || 0) + (m.otherAllowance || 0) + 3000
    const deductions =
        (m.pensionAmount || 0) +
        (m.stockDeduction || 0) +
        (m.laborInsurance || 0) +
        (m.healthInsurance || 0) +
        (m.otherDeduction || 0)

    career.value.monthlyNetIncome = income - deductions
}

// --- 3. 存檔與事件處理 ---

/**
 * 執行存檔
 */
const performSave = debounce(async () => {
    try {
        const res = await authFetch('/api/v1/user/career', {
            method: 'PUT',
            body: career.value
        })
        if (!res || !res.ok) {
            console.error(`Career update failed: ${res?.status}`)
        }
    } catch (e) {
        console.error('Career save error:', e)
    }
}, 500)

/**
 * 情境 A: 欄位變動僅影響淨利 (不涉及勞健保級距)
 */
function handleSaveOnly() {
    updateMonthlyNetIncome()
    performSave()
}

/**
 * 情境 B: 變動涉及勞健保計算級距與最終淨利
 */
function handleCalcAndSave() {
    // 1. 計算勞健保基礎
    const basis = (career.value.baseSalary || 0) + (career.value.otherAllowance || 0) + 3000

    // 2. 更新 Composable 輸入值
    pension.actualWage.value = basis
    pension.selfRate.value = career.value.pensionRate || 0
    labor.actualWage.value = basis
    health.actualWage.value = basis
    health.dependents.value = career.value.dependents || 0

    // 3. 回寫計算結果到 Model
    career.value.pensionAmount = pension.selfAmount.value
    career.value.laborInsurance = labor.personalPremium.value
    career.value.healthInsurance = health.personalPremium.value

    // 4. 更新最終實領金額並存檔
    updateMonthlyNetIncome()
    performSave()
}

// --- Helpers ---
const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return '0'
    return new Intl.NumberFormat('zh-TW').format(num)
}
</script>
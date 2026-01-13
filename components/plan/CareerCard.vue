<template>
    <el-card shadow="never">
        <el-form label-width="auto" :model="career">

            <el-divider content-position="left">1. 每月常態性薪資</el-divider>

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
                        <el-input-number v-model="career.pensionPersonalRate" :min="0" :max="6" style="width: 100%"
                            @change="handleCalcAndSave" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞退自提">
                        <el-text>{{ formatNumber(career.pensionPersonalAmount) }}</el-text>
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
            
            <CareerChart :data="career" />

            <el-divider content-position="left">2. 年度獎金與總薪資</el-divider>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="年終/非經常性">
                        <el-input-number v-model="career.annualBonus" :min="0" :step="5000" style="width: 100%"
                            @change="handleSaveOnly" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="全年總薪資">
                        <el-text>
                            {{ formatNumber(career.annualTotalIncome) }}
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
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

// --- 1. Define Model ---
const career = defineModel<UserCareer>({
    required: true,
    default: () => ({
        baseSalary: 0,
        otherAllowance: 0,
        laborInsurance: 0,
        healthInsurance: 0,
        otherDeduction: 0,

        // --- Pension Group ---
        pensionPersonalRate: 0,
        pensionPersonalAmount: 0,
        pensionEmployerAmount: 0,
        pensionTotalAmount: 0,
        // ---------------------

        stockDeduction: 0,
        stockCompanyMatch: 0,
        dependents: 0,
        monthlyNetIncome: 0,

        // [新增]
        annualBonus: 0,
        annualTotalIncome: 0
    })
})

const { authFetch } = useApi()

// 初始化 Composables
const pension = useLaborPension(0, 0)
const labor = useLaborInsurance(0)
const health = useHealthInsurance(0, 0)

// --- 2. 核心計算邏輯 ---

/**
 * 更新 月實領 & 年總薪資
 */
function updateTotals() {
    const m = career.value

    // 1. 每月全薪 (Monthly Gross)
    const monthlyGross = (m.baseSalary || 0) + (m.otherAllowance || 0) + 3000 // 含伙食

    // 2. 每月扣項 (Monthly Deductions)
    const deductions =
        (m.pensionPersonalAmount || 0) +
        (m.stockDeduction || 0) +
        (m.laborInsurance || 0) +
        (m.healthInsurance || 0) +
        (m.otherDeduction || 0)

    // 3. 更新每月實領 (Net)
    career.value.monthlyNetIncome = monthlyGross - deductions

    // 4. [新增] 更新全年總薪資 (Annual Gross)
    // 邏輯：月全薪 * 12 + 年終獎金
    // 這是剛性支出模型 (D1-D10) 判斷階層的依據
    career.value.annualTotalIncome = (monthlyGross * 12) + (m.annualBonus || 0)
}

// --- 3. 存檔與事件處理 ---

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

function handleSaveOnly() {
    updateTotals()
    performSave()
}

/**
 * 計算所有保險與退休金
 */
function handleCalcAndSave() {
    // 1. 計算全薪
    const basis = (career.value.baseSalary || 0) + (career.value.otherAllowance || 0) + 3000

    // 2. 更新 Composable
    pension.actualWage.value = basis
    pension.selfRate.value = career.value.pensionPersonalRate || 0
    labor.actualWage.value = basis
    health.actualWage.value = basis
    health.dependents.value = career.value.dependents || 0

    // 3. 回寫計算結果
    career.value.pensionPersonalAmount = pension.selfAmount.value
    career.value.pensionEmployerAmount = pension.employerAmount.value

    // 計算總提撥
    career.value.pensionTotalAmount =
        pension.selfAmount.value + pension.employerAmount.value

    // 更新勞健保
    career.value.laborInsurance = labor.personalPremium.value
    career.value.healthInsurance = health.personalPremium.value

    // 4. 更新總額並存檔
    updateTotals()
    performSave()
}

// --- Helpers ---
const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return '0'
    return new Intl.NumberFormat('zh-TW').format(num)
}
</script>
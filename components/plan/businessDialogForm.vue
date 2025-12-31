<template>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">

        <el-divider content-position="left">基本資料</el-divider>

        <el-row :gutter="24">
            <el-col :span="12" :xs="24">
                <el-form-item label="名稱" prop="name">
                    <el-input v-model="formData.name" placeholder="例如：設備租賃" />
                </el-form-item>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-form-item label="稅務" prop="taxCategory">
                    <el-select v-model="formData.taxCategory" placeholder="請選擇" style="width: 100%">
                        <el-option label="免稅" value="exempt" />
                        <el-option label="推計 6%" value="deemed_6" />
                        <el-option label="核實申報" value="verified" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-form-item label="啟用日" prop="startDate">
                    <el-date-picker v-model="formData.startDate" type="date" placeholder="選擇日期" format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD" style="width: 100%" @change="updateForm" />
                </el-form-item>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-form-item label="預估年限" prop="projectYears">
                    <el-input-number v-model="formData.projectYears" :min="1" :max="50" style="width: 100%"
                        controls-position="right" @input="updateForm" />
                </el-form-item>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-form-item label="初始成本" prop="acquisitionCost">
                    <el-input-number v-model="formData.acquisitionCost" :min="0" :step="10000" style="width: 100%"
                        controls-position="right" @input="updateForm" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-divider content-position="left">營收與成本</el-divider>

        <el-row>
            <el-col :span="24">
                <el-form-item label="收入模式" prop="incomeMode">
                    <el-radio-group v-model="formData.incomeMode" size="small" @change="updateForm">
                        <el-radio-button label="monthly">輸入月均</el-radio-button>
                        <el-radio-button label="total">累計回推</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="24">
            <el-col :span="12" :xs="24">
                <template v-if="formData.incomeMode === 'monthly'">
                    <el-form-item label="月收入" prop="monthlyIncome">
                        <el-input-number v-model="formData.monthlyIncome" :min="0" :step="1000" style="width: 100%"
                            controls-position="right" @input="updateForm" />
                    </el-form-item>
                </template>

                <template v-else>
                    <el-form-item label="累計營收" prop="totalAccumulatedIncome"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
                        <el-input-number v-model="formData.totalAccumulatedIncome" :min="0" :step="10000"
                            style="width: 100%" placeholder="至今總額" controls-position="right" @input="updateForm" />
                    </el-form-item>

                    <el-form-item label="推算月均">
                        <el-input-number v-model="formData.monthlyIncome" style="width: 100%" disabled
                            :controls="false" />
                        <div class="calc-info" v-if="displayMonths > 0">
                            (營運 {{ displayMonths }} 個月)
                        </div>
                    </el-form-item>
                </template>
            </el-col>

            <el-col :span="12" :xs="24">
                <el-form-item label="月成本" prop="monthlyCost">
                    <el-input-number v-model="formData.monthlyCost" :min="0" :step="500" style="width: 100%"
                        controls-position="right" @input="updateForm" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-divider content-position="left">融資貸款</el-divider>

        <el-row :gutter="24">
            <el-col :span="12" :xs="24">
                <el-form-item label="貸款額" prop="loanAmount">
                    <el-input-number v-model="formData.loanAmount" :min="0" :step="50000" style="width: 100%"
                        controls-position="right" @input="updateForm" />
                </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
                <el-form-item label="年利率 %" prop="loanInterestRate">
                    <el-input-number v-model="formData.loanInterestRate" :min="0" :max="20" :precision="2" :step="0.1"
                        style="width: 100%" controls-position="right" @input="updateForm" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-divider content-position="left">試算結果 (本金歸零模型)</el-divider>

        <el-row :gutter="24">
            <el-col :span="8" :xs="24">
                <el-form-item label="預估月淨利">
                    <el-input-number v-model="displayNetProfit" disabled :controls="false" style="width: 100%"
                        :class="displayNetProfit >= 0 ? 'input-success' : 'input-danger'" />
                </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
                <el-form-item label="回本時間">
                    <el-input v-model="displayPaybackPeriod" disabled style="width: 100%"
                        input-style="text-align: right;" />
                    <div class="calc-info">自有資金回收期</div>
                </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
                <el-form-item label="IRR">
                    <el-input v-model="displayIRR" disabled style="width: 100%" input-style="text-align: right;"
                        :class="isPositiveROI ? 'input-success' : 'input-danger'" />
                    <div class="calc-info">{{ formData.projectYears || 5 }}年期/殘值0</div>
                </el-form-item>
            </el-col>
        </el-row>

    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserBusiness } from './types/user'

const formData = defineModel<UserBusiness>({ required: true })
const formRef = ref<FormInstance>()

const displayNetProfit = ref(0)
const displayPaybackPeriod = ref('-')
const displayIRR = ref('0.0%')
const isPositiveROI = ref(true)
const displayMonths = ref(0)

const rules: FormRules = {
    name: [{ required: true, message: '必填', trigger: 'blur' }],
    taxCategory: [{ required: true, message: '必選', trigger: 'change' }],
    startDate: [{ required: true, message: '必選', trigger: 'change' }],
    projectYears: [{ required: true, message: '必填', trigger: 'blur' }], // 新增規則
    acquisitionCost: [{ required: true, message: '必填', trigger: 'blur' }],
    monthlyIncome: [{ required: true, message: '必填', trigger: 'blur' }],
    monthlyCost: [{ required: true, message: '必填', trigger: 'blur' }]
}

const updateForm = () => {
    calculateIncome()
    calculateResult()
}

const calculateIncome = () => {
    if (!formData.value.startDate) {
        displayMonths.value = 0
        return
    }
    const parts = formData.value.startDate.split('-')
    if (parts.length < 2) return

    const startYear = parseInt(parts[0])
    const startMonth = parseInt(parts[1])
    const now = new Date()
    const months = (now.getFullYear() - startYear) * 12 + ((now.getMonth() + 1) - startMonth)
    displayMonths.value = months <= 0 ? 1 : months

    if (formData.value.incomeMode === 'total') {
        const total = formData.value.totalAccumulatedIncome || 0
        formData.value.monthlyIncome = Math.round(total / displayMonths.value)
    }
}

const calculateResult = () => {
    const income = formData.value.monthlyIncome || 0
    const cost = formData.value.monthlyCost || 0
    const loan = formData.value.loanAmount || 0
    const rate = formData.value.loanInterestRate || 0
    const acquisition = formData.value.acquisitionCost || 0
    // 使用用戶輸入的年限，預設 5 年
    const yearsProjection = formData.value.projectYears || 5

    const monthlyInterest = Math.round(loan * (rate / 100) / 12)
    const netProfit = income - cost - monthlyInterest
    displayNetProfit.value = netProfit

    const equity = acquisition - loan

    // 回本時間計算
    if (equity <= 0) {
        displayPaybackPeriod.value = '即時回本(無本)'
    } else if (netProfit <= 0) {
        displayPaybackPeriod.value = '無法回本'
    } else {
        const monthsToBreakEven = equity / netProfit
        const years = Math.floor(monthsToBreakEven / 12)
        const months = Math.ceil(monthsToBreakEven % 12)
        if (years > 0) {
            displayPaybackPeriod.value = `${years}年${months}個月`
        } else {
            displayPaybackPeriod.value = `${months}個月`
        }
    }

    // IRR 計算 (動態年限)
    if (equity <= 0) {
        displayIRR.value = netProfit > 0 ? '∞' : '虧損'
        isPositiveROI.value = netProfit > 0
    } else if (netProfit <= 0) {
        displayIRR.value = '虧損'
        isPositiveROI.value = false
    } else {
        const annualProfit = netProfit * 12

        let min = 0
        let max = 100
        let guess = 0

        for (let i = 0; i < 50; i++) {
            guess = (min + max) / 2
            let npv = -equity
            // 迴圈改用 yearsProjection
            for (let t = 1; t <= yearsProjection; t++) {
                npv += annualProfit / Math.pow(1 + guess, t)
            }

            if (Math.abs(npv) < 1) break
            if (npv > 0) {
                min = guess
            } else {
                max = guess
            }
        }

        const irrPercentage = guess * 100
        displayIRR.value = irrPercentage.toFixed(1) + '%'
        isPositiveROI.value = true
    }
}

onMounted(() => {
    // 預設給 5 年，優化 UX
    if (!formData.value.projectYears) {
        formData.value.projectYears = 5
    }
    updateForm()
})

const validate = async () => {
    if (!formRef.value) return false
    return formRef.value.validate()
}
const clearValidate = () => formRef.value?.clearValidate()

defineExpose({ validate, clearValidate })
</script>

<style scoped>
:deep(.el-input__inner) {
    text-align: right;
}

:deep(.el-input__inner[type="text"]) {
    text-align: left;
}

.calc-info {
    font-size: 12px;
    color: #909399;
    position: absolute;
    right: 0;
    bottom: -18px;
    line-height: 1;
    white-space: nowrap;
}

:deep(.input-success .el-input__inner) {
    color: var(--el-color-success);
    font-weight: bold;
}

:deep(.input-danger .el-input__inner) {
    color: var(--el-color-danger);
    font-weight: bold;
}
</style>
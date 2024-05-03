<template>
    <div>
        <h3 id="_職業試算" tabindex="-1">職業試算<a class="header-anchor" href="#職業試算"
                aria-label="Permalink to &quot;職業試算&quot;">&ZeroWidthSpace;</a></h3>
        <el-card>
            <el-form label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="本薪" required>
                            <el-input-number v-model="career.monthlyBasicSalary" :min="0"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="伙食津貼">
                            <el-text>{{ Number(career.foodExpense).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="職工福利金">
                            <el-text> {{ Number(career.employeeWelfareFund).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="勞退提繳工資" required>
                            <el-input-number v-model="career.pension.salary" :min="career.pension.salaryMin"
                                :max="150000" @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提繳工資查詢">
                            <a href="https://www.bli.gov.tw/0108097.html" target="_blank" tabIndex="-1">勞動部勞工保險局</a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="健保負擔">
                            <el-text> {{ Number(career.healthInsutancePremium).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="勞退自提率(%)" required>
                            <el-input-number v-model="career.pension.rate" @change="calculateCareer($event)" :min="0"
                                :max="6" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="勞退月提繳">
                            <el-text>{{ Number(career.pension.monthlyContribution).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="勞保提繳工資" required>
                            <el-input-number v-model="career.insurance.salary" :min="0" :max="45800"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="勞保勞工負擔">
                            <el-text>{{ Number(career.insurance.expense).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月實領試算">
                            <el-text> {{ Number(career.monthlyNetPayEstimated).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="年實領/12">
                            <el-input-number v-model="career.monthlyNetPay" :min="0"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="月支出" required>
                            <el-input-number v-model="career.monthlyExpense" :min="0"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月實領 - 月支出">
                            <el-text>{{ Number(career.monthlySaving).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>
                                假設薪資成長率永遠剛好抵銷通膨
                            </li>
                            <li>
                                月提繳查詢：<a href="https://www.bli.gov.tw/0013083.html" target="_blank">勞動部勞工保險局</a>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </template>
            <canvas v-show="career.monthlyBasicSalary" id="incomeChart"></canvas>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
let incomeChartInstance = ref<Chart>()
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        }
    },
    config: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const career = computed(() => {
    return props.modelValue
})
function calculateCareer(options: any = { propagate: true }) {
    const { propagate = true } = options
    try {
        calculateEmployeeWelfareFund()
        calculateInsuranceSalary()
        calculateInsuranceExpense()
        calculatePensionSalary()
        calculateCareerPensionContribution()
        calculateHealthPremiumByPension()
        debounce(() => {
            drawChartAndCalculateIncome(propagate)
        })(propagate)
    } catch (error) {
        console.log(error.message || error)
    }
}
// 減項計算
function calculateEmployeeWelfareFund() {
    const { monthlyBasicSalary, } = career.value
    career.value.employeeWelfareFund = Math.floor(monthlyBasicSalary * 0.5 / 100)
}
function calculateHealthPremiumByPension() {
    const { salary, salaryMin } = career.value.pension
    const salaryBasis = Math.max(salary, salaryMin)
    const healthInsutancePremiumRate = 5.17 / 100
    const employeeContributionRate = 30 / 100
    career.value.healthInsutancePremium = Math.ceil(salaryBasis * healthInsutancePremiumRate * employeeContributionRate)
}
// 勞保計算
function calculateInsuranceSalary() {
    if (career.value.monthlyBasicSalary) {
        career.value.insurance.salaryMin = Math.min(45800, career.value.monthlyBasicSalary)
    }
    if (!career.value.insurance.salary) {
        career.value.insurance.salary = career.value.insurance.salaryMin
    }
}
function calculateInsuranceExpense() {
    const { salary, } = career.value.insurance
    const insuranceRate = 12 / 100
    const premiumRate = 20 / 100
    career.value.insurance.expense = Math.ceil(salary * insuranceRate * premiumRate)
}
// 勞退計算
function calculatePensionSalary() {
    const { monthlyBasicSalary, foodExpense, } = career.value
    const salaryMin = monthlyBasicSalary + foodExpense
    career.value.pension.salaryMin = salaryMin
    career.value.pension.salary = Math.max(career.value.pension.salary, salaryMin)
}
function calculateCareerPensionContribution() {
    const { salary, salaryMin, rate } = career.value.pension
    const salaryBasis = Math.max(salary, salaryMin)
    const maxContribution = Math.min(salaryBasis, props.config.maxPensionSalary)
    career.value.pension.monthlyContributionEmployee = Math.floor(maxContribution * rate / 100)
    career.value.pension.monthlyContribution = Math.floor(maxContribution * (6 + rate) / 100)
}
// 投資計算
function calculateMonthlySaving() {
    const { monthlyNetPay = 0, monthlyExpense = 0, monthlyNetPayEstimated } = career.value
    const monthlyNetPayBasis = monthlyNetPay || monthlyNetPayEstimated
    career.value.monthlySaving = Math.floor(monthlyNetPayBasis - monthlyExpense)
}
// 畫圖
function drawChartAndCalculateIncome(propagate = false) {
    // 繪製圖表
    let pv = 0
    let fv = 0
    const dataAndDataIndex: any[] = []
    fv = career.value.monthlyBasicSalary
    dataAndDataIndex.push({
        label: '本薪',
        data: [pv, fv],
        datasetIndex: 0,
    })

    pv = fv
    fv += career.value.foodExpense
    dataAndDataIndex.push({
        label: '伙食津貼',
        data: [pv, fv],
        datasetIndex: 0,
    })

    pv = fv
    fv -= career.value.employeeWelfareFund
    dataAndDataIndex.push({
        label: '職工福利金',
        data: [pv, fv],
        datasetIndex: 1,
    })

    pv = fv
    fv -= career.value.healthInsutancePremium
    dataAndDataIndex.push({
        label: '健保',
        data: [pv, fv],
        datasetIndex: 1,
    })

    pv = fv
    fv -= career.value.insurance.expense
    dataAndDataIndex.push({
        label: '勞保',
        data: [pv, fv],
        datasetIndex: 1,
    })

    pv = fv
    fv -= career.value.pension.monthlyContributionEmployee
    dataAndDataIndex.push({
        label: '勞退',
        data: [pv, fv],
        datasetIndex: 1,
    })

    career.value.monthlyNetPayEstimated = fv
    calculateMonthlySaving()
    fv = career.value.monthlyNetPay || fv
    dataAndDataIndex.push({
        label: '月實領',
        data: [fv, 0],
        datasetIndex: 0,
    })

    if (career.value.monthlyExpense) {
        pv = fv
        fv -= career.value.monthlyExpense
        dataAndDataIndex.push({
            label: '月支出',
            data: [pv, fv],
            datasetIndex: 1,
        })
    }

    if (0 <= fv) {
        dataAndDataIndex.push({
            label: '定期定額',
            data: [fv, 0],
            datasetIndex: 0,
        })
    }

    const labels = dataAndDataIndex.map(item => item.label)
    const data0 = dataAndDataIndex.map(item => {
        if (item.datasetIndex === 0) {
            return item.data
        } else {
            return [0, 0]
        }
    })
    const data1 = dataAndDataIndex.map(item => {
        if (item.datasetIndex === 1) {
            return item.data
        } else {
            return [0, 0]
        }
    })

    const data = {
        labels: labels,
        datasets: [
            {
                label: '應付月薪',
                data: data0,
            },
            {
                label: '應扣項目',
                data: data1
            },
        ]
    }
    if (propagate) {
        emits('update:modelValue', career)
    }

    if (incomeChartInstance.value) {
        incomeChartInstance.value.data = data
        incomeChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('incomeChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: tooltipFormat,
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    })
    incomeChartInstance = shallowRef(chartInstance)
}
function tooltipFormat(tooltipItems) {
    const { raw } = tooltipItems
    const variedValue = raw[1] - raw[0]
    return Number(variedValue).toLocaleString()
}

const debounceId = ref()
function debounce(func, delay = 100) {
    return (immediate) => {
        clearTimeout(debounceId.value)
        if (immediate) {
            func()
        } else {
            debounceId.value = setTimeout(() => {
                debounceId.value = undefined
                func()
            }, delay)
        }
    }
}

defineExpose({
    calculateCareer,
})
</script>
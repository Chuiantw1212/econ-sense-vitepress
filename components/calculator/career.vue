<template>
    <div>
        <h3 id="_職業試算" tabindex="-1">職業試算<a class="header-anchor" href="#職業試算"
                aria-label="Permalink to &quot;職業試算&quot;">&ZeroWidthSpace;</a></h3>
        <el-card>
            <el-form label-width="auto">
                <el-row v-if="profile.insuranceType === 'entrepreneur'">
                    <el-col :span="12">
                        <el-form-item label="僱傭員工數" required>
                            <el-input-number v-model="career.headCount" :min="0" @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row v-if="profile.insuranceType === 'entrepreneur'">
                    <el-col :span="12">
                        <el-form-item label="投保單位">
                            <econSelect v-model="career.laborInsuranceType" :options="laborInsuranceTypeOptions"
                                :disabled="!career.headCount || career.headCount >= 5"
                                @change="calculateCareer($event)">
                            </econSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="career.laborInsuranceType === 'union'" :label="`職業災害費率`">
                            <el-text>目前皆以{{ accidentInsurance.premiumRate }}%計算</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="career.laborInsuranceType === 'company'">
                    <el-col :span="12">
                        <el-form-item label="本薪" required>
                            <el-input-number v-model="career.monthlyBasicSalary" :min="0" :step="1000"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="+ 伙食津貼">
                            <el-text>{{ Number(foodExpense).toLocaleString() }} (免稅)</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="career.laborInsuranceType === 'company'">
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="- 職工福利金">
                            <el-text> {{ Number(career.employeeWelfareFund).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="career.laborInsuranceType === 'union'">
                    <el-col :span="12">
                        <el-form-item label="本薪" required>
                            <el-input-number v-model="career.monthlyBasicSalary" :min="0" :step="1000"
                                @change="calculateCareer($event)" />
                        </el-form-item>
                        <!-- <el-form-item label="健保提繳工資">
                            <el-text> {{ Number(healInsurance.salary).toLocaleString() }}</el-text>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="- 健保自付額">
                            <el-text> {{ Number(healInsurance.contribution).toLocaleString() }}</el-text>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item v-if="career.laborInsuranceType === 'company'" label="勞退提繳工資">
                            <el-text> {{ Number(laborPension.salary).toLocaleString() }}</el-text>
                        </el-form-item> -->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="career.laborInsuranceType === 'company'" label="勞退自提率(%)">
                            <el-input-number v-model="career.pension.rate" :disabled="!career.monthlyBasicSalary"
                                @change="calculateCareer($event)" :min="0" :max="6" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="career.laborInsuranceType === 'company'" label="- 勞退月提繳">
                            <el-text>{{ Number(career.pension.monthlyContribution).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="勞保提繳工資">
                            <el-text> {{ Number(career.insurance.salary).toLocaleString() }}</el-text>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="`- 勞保自付額`">
                            <el-text>{{ Number(career.insurance?.expense).toLocaleString() }} (負擔率{{
                    laborInsurace.premiumRate[career.laborInsuranceType] }}%)</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="= 月實領試算">
                            <el-text> {{ Number(career.monthlyNetPayEstimated).toLocaleString() }}</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="年實領 / 12">
                            <el-input-number v-model="career.monthlyNetPay" :min="0"
                                :disabled="!career.monthlyBasicSalary" @change="calculateCareer($event)" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="月支出" required>
                            <el-input-number v-model="career.monthlyExpense" :min="0" :step="1000"
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
                                包含獎金等等不固定薪資、以及投資股利等等後的稅後所得/12，是計算每月可投資金額的基礎。
                            </li>
                            <li>
                                假設薪資成長率永遠剛好抵銷通膨
                            </li>
                            <li>
                                月提繳查詢：<a href="https://www.bli.gov.tw/0013083.html" target="_blank">勞動部勞工保險局</a>
                            </li>
                            <li>
                                勞保投保薪資分級表：<a href="https://www.bli.gov.tw/0100493.html" target="_blank">勞動部勞工保險局</a>
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
import { ref, computed, shallowRef, reactive } from 'vue'
import Chart from 'chart.js/auto';
import econSelect from '../econSelect.vue'
let incomeChartInstance = ref<Chart>()
const emits = defineEmits(['update:modelValue'])
const laborInsuranceTypeOptions = [
    {
        label: '公司',
        value: 'company'
    },
    {
        label: '職業工會',
        value: 'union'
    }
]
const laborInsurace = reactive({
    ordinaryAccidentRate: 11,
    employeementRate: 1,
    accidentRate: 0.11,
    premiumRate: {
        company: 20,
        union: 60
    }
})
const foodExpense = 3000
const laborPension = reactive({
    salary: 0,
})
const accidentInsurance = {
    premiumRate: 0.11 // 職業災害保險費率
}
const laborInsuranceLevels = [
    27470, 27600, 28800,
    30300, 31800, 33300, 34800, 36300, 38200,
    40100, 42000, 43900, 45800
]
const onlyLaborInsurance = [
    1500, 3000, 4500, 6000, 7500, 8700, 9900, 11100, 12540, 13500, 15840, 16500, 17280, 17880, 19047,
    20008, 21009, 22000, 23100, 24000, 25250, 26400,
]
const laborAndHealthInsurance = [
    27470, 27600, 28800,
    30300, 31800, 33300, 34800, 36300, 38200,
    40100, 42000, 43900, 45800, 48200,
    50600, 53000, 55400, 57800,
    60800, 63800, 66800, 69800,
    72800, 76500,
    80200, 83900, 87600,
    92100, 96600,
    10110, 105600, 110100, 115500,
    120900, 126300, 131700, 137100, 142500, 147900, 150000,
]
const entrepreneurHealthLevel = {
    0: 6, // 33300
    1: 6, // 33300
    2: 6, // 33300
    3: 6, // 33300
    4: 8, // 36300
    5: 13, // 45800
}
const onlyHealthInsurance = [
    156400, 162800, 169200,
    175600, 182000, 189500,
    197000, 204500, 212000,
    219500,
]
const healInsurance = reactive({
    salary: 0,
    premiumRate: 5.17, // 健保費用率
    contributionShare: {
        company: 30,
        union: 60,
    },
    employeeContributionRate: 30,
    contribution: 0,
})
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    profile: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
})
const career = computed(() => {
    return props.modelValue
})
function calculateCareer(options: any = { propagate: true }) {
    const { propagate = true } = options
    try {
        calculateInsuranceType()
        calculateEmployeeWelfareFund()
        calculateInsuranceSalary()
        calculateInsuranceExpense()
        calculatePensionSalary()
        calculateCareerPensionContribution()
        calculateHealthPremium()
        debounce(() => {
            drawChartAndCalculateIncome(propagate)
        })(propagate)
    } catch (error) {
        console.log(error.message || error)
    }
}
function calculateInsuranceType() {
    const { monthlyBasicSalary } = career.value
    if (!monthlyBasicSalary) {
        career.value.pension.rate = 0
    }
    const { insuranceType } = props.profile
    if (!insuranceType) {
        return
    }
    switch (insuranceType) {
        case 'employee':
            career.value.laborInsuranceType = 'company'
            break;
        case 'entrepreneur':
            const { headCount, } = career.value
            if (headCount === 0) {
                career.value.laborInsuranceType = 'union'
                career.value.pension.rate = 0
            }
            if (headCount >= 5) {
                career.value.laborInsuranceType = 'company'
            }
            break;
        default: {
            break;
        }
    }
}
// 減項計算
function calculateEmployeeWelfareFund() {
    if (career.value.laborInsuranceType === 'company') {
        const { monthlyBasicSalary, } = career.value
        career.value.employeeWelfareFund = Math.floor(monthlyBasicSalary * 0.5 / 100)
    } else {
        career.value.employeeWelfareFund = 0
    }
}
function calculateHealthPremium() {
    const { monthlyBasicSalary, headCount } = career.value
    const { laborInsuranceType } = career.value
    let healthSalaryMin = monthlyBasicSalary
    if (laborInsuranceType === 'company') {
        healthSalaryMin += foodExpense
    }
    const insuranceSalaryLevel = [
        ...laborAndHealthInsurance,
        ...onlyHealthInsurance,
    ]
    if (props.profile.insuranceType === 'entrepreneur') {
        if (laborInsuranceType === 'company') {
            const healthLevel = entrepreneurHealthLevel[headCount] - 1// 記得從0索引
            const legalMinSalary = insuranceSalaryLevel[healthLevel]
            healthSalaryMin = Math.max(healthSalaryMin, legalMinSalary)
        }
    }
    let healthInsuranceSalary = insuranceSalaryLevel.find(salaryLevel => {
        return salaryLevel >= healthSalaryMin
    })
    if (!healthInsuranceSalary) {
        healthInsuranceSalary = insuranceSalaryLevel.slice(-1)[0]
    }
    healInsurance.salary = healthInsuranceSalary
    // 計算健保支出
    let healthInsuranceContribution = healthInsuranceSalary
    const { premiumRate, contributionShare } = healInsurance
    healthInsuranceContribution *= premiumRate / 100
    healthInsuranceContribution *= contributionShare[laborInsuranceType] / 100
    healInsurance.contribution = Math.ceil(healthInsuranceContribution)
}
// 勞保計算
function calculateInsuranceSalary() {
    const { monthlyBasicSalary } = career.value
    const insuranceSalary = laborInsuranceLevels.find((value: number) => {
        return monthlyBasicSalary <= value
    })
    if (!insuranceSalary) {
        career.value.insurance.salary = laborInsuranceLevels.slice(-1)[0]
    } else {
        career.value.insurance.salary = insuranceSalary
    }
}
function calculateInsuranceExpense() {
    const { salary = 0, } = career.value.insurance
    if (!salary) {
        return
    }
    const { ordinaryAccidentRate, employeementRate, accidentRate } = laborInsurace
    let insuranceRate = ordinaryAccidentRate
    if (career.value.laborInsuranceType === 'union') {
        insuranceRate += accidentRate
    } else {
        insuranceRate += employeementRate
    }
    insuranceRate /= 100
    const premiumRate = laborInsurace.premiumRate[career.value.laborInsuranceType] / 100
    career.value.insurance.expense = Math.ceil(salary * insuranceRate * premiumRate) // 無條件進位?
}
// 勞退計算
function calculatePensionSalary() {
    const { monthlyBasicSalary, } = career.value
    let pensionSalaryMin = monthlyBasicSalary
    if (career.value.laborInsuranceType === 'company') {
        pensionSalaryMin += foodExpense
    }
    const insuranceSalaryLevel = [
        ...onlyLaborInsurance,
        ...laborAndHealthInsurance,
    ]
    const pensionSalary = insuranceSalaryLevel.find(value => {
        return value >= pensionSalaryMin
    })
    if (pensionSalary) {
        laborPension.salary = pensionSalary
    } else {
        laborPension.salary = insuranceSalaryLevel[insuranceSalaryLevel.length - 1]
    }
}
function calculateCareerPensionContribution() {
    const { rate } = career.value.pension
    const { salary } = laborPension
    const { insuranceType } = props.profile
    if (!salary || !insuranceType) {
        return
    }
    const maxLaborInsuranceSalary = laborAndHealthInsurance[laborAndHealthInsurance.length - 1]
    const laborInsuranceSalary = Math.min(salary, maxLaborInsuranceSalary)
    career.value.pension.monthlyContributionEmployee = Math.floor(laborInsuranceSalary * rate / 100)
    switch (insuranceType) {
        case 'employee':
            career.value.pension.monthlyContribution = Math.floor(laborInsuranceSalary * (6 + rate) / 100)
            break;
        case 'entrepreneur':
            career.value.pension.monthlyContribution = Math.floor(laborInsuranceSalary * (rate) / 100)
            break;
    }
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

    if (career.value.laborInsuranceType === 'company') {
        pv = fv
        fv += foodExpense
        dataAndDataIndex.push({
            label: '伙食津貼',
            data: [pv, fv],
            datasetIndex: 0,
        })
    }

    if (career.value.employeeWelfareFund) {
        pv = fv
        fv -= career.value.employeeWelfareFund
        dataAndDataIndex.push({
            label: '職工福利金',
            data: [pv, fv],
            datasetIndex: 1,
        })
    }

    pv = fv
    fv -= healInsurance.contribution
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
    if (career.value.pension.monthlyContributionEmployee) {
        fv -= career.value.pension.monthlyContributionEmployee
        dataAndDataIndex.push({
            label: '勞退',
            data: [pv, fv],
            datasetIndex: 1,
        })
    }

    career.value.monthlyNetPayEstimated = fv
    calculateMonthlySaving()
    fv = career.value.monthlyNetPay || fv
    dataAndDataIndex.push({
        label: '月實領',
        data: [0, fv],
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
            data: [0, fv],
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
        emits('update:modelValue', career.value)
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
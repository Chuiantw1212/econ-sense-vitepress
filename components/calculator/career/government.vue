<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="俸點" required>
                        <econSelect v-model="career.payPoint" :options="pointOfPayOptions" @change="calculateCareer()">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="俸額">
                        <el-text>{{ Number(career.monthlyBasicSalary).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主管加給">
                        <econSelect v-model="career.supervisorRank" :options="supervisorAllowanceOptins"
                            :disabled="!career.payPoint" placeholder="無加給" @change="calculateCareer">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 主管加給額">
                        <el-text>{{ Number(career.supervisorAllowance).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="專業加給">
                        <econSelect v-model="career.professionalRank" :options="professionalAllowanceOptions"
                            :disabled="!career.payPoint" placeholder="無加給" @change="calculateCareer">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 專業加給額">
                        <el-text>{{ Number(career.professionalAllowance).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="地域加給">
                        <el-input-number v-model="career.regionalAllowance" :min="0" :disabled="!career.payPoint"
                            @change="calculateCareer">
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 地域加給額">
                        <el-text>{{ Number(career.regionalAllowance).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="= 奉給總額">
                        <el-text>{{ Number(career.monthlyTotalSalary).toLocaleString() }}</el-text>
                        <!-- <el-text>{{ Number(career.insurance.salary).toLocaleString() }}</el-text> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="退撫自提率(%)">
                        <el-input-number v-model="career.pension.rate" :disabled="!career.payPoint" :min="0" :max="5.25"
                            @change="calculateCareer($event)" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 退撫自提">
                        <el-text>{{ Number(career.pension.monthlyContributionEmployee).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 健保自付額">
                        <el-text> {{ Number(healInsurance.contribution).toLocaleString() }}</el-text>
                    </el-form-item>

                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="`- 公保自付額`">
                        <el-text>{{ Number(civilServantInsurance.expense).toLocaleString() }} (負擔率{{
                            civilServantInsurance.employeeContributionRate }}%)</el-text>
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
                        <el-input-number v-model="career.monthlyNetPay" :min="0" :step="1000"
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
                            資料更新日期113(2024)年: <a href="https://www.dgpa.gov.tw/information?uid=108&pid=11768"
                                target="_blank">歷年全國軍公教員工待遇支給要點</a>
                        </li>

                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
        <canvas v-show="career.monthlyBasicSalary" id="governmentIncomeChart"></canvas>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive } from 'vue'
import {
    healthInsuranceConfig,
    pointOfPayOptions,
    payRanks,
    supervisorAllowanceOptins,
    professionalAllowanceOptions,
    supervisorAllowanceRanks,
    professoinalAllowanceRanks,
    laborAndHealthInsurance,
    onlyHealthInsurance,
} from './config.js'
import Chart from 'chart.js/auto';
import econSelect from '../../econSelect.vue'
const emits = defineEmits(['update:modelValue'])
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
const civilServantInsurance = reactive({
    premiumRate: 7.83,
    employeeContributionRate: 35,
    expense: 0,
})
const healInsurance = reactive({
    salaryRate: 87.04,
    salary: 0,
    contribution: 0,
    premiumRate: 5.17, // 健保費用率
    contributionShare: {
        company: 30,
    },
})
Object.assign(healInsurance, healthInsuranceConfig)
// hooks
const career = computed(() => {
    return props.modelValue
})
// methods
function calculateCareer(options: any = { propagate: true }) {
    const { propagate = true } = options
    try {
        calculateMonthlyBasic()
        calculateAllowance()
        calculateMonthlyTotal()
        calculateHealthInsurance()
        calculateCareerInsurance()
        calculatePension()
        calculateMonthlySaving()
        debounce(() => {
            drawChartAndCalculateIncome(propagate)
        })(propagate)
    } catch (error) {
        console.log(error.message || error)
    }
}
function calculateMonthlySaving() {
    const { monthlyNetPay = 0, monthlyExpense = 0, monthlyNetPayEstimated } = career.value
    const monthlyNetPayBasis = monthlyNetPay || monthlyNetPayEstimated
    if (monthlyNetPayBasis) {
        career.value.monthlySaving = Math.floor(monthlyNetPayBasis - monthlyExpense)
    } else {
        career.value.monthlySaving = 0
    }
}
function calculateMonthlyBasic() {
    const { payPoint } = career.value
    if (payPoint) {
        const index = pointOfPayOptions.findIndex(item => {
            return item.value === payPoint
        })
        career.value.monthlyBasicSalary = payRanks[index]
    } else {
        career.value.monthlyBasicSalary = 0
    }
}
function calculateMonthlyTotal() {
    const { monthlyBasicSalary, insurance, pension, supervisorAllowance, professionalAllowance } = career.value
    career.value.monthlyTotalSalary = monthlyBasicSalary + supervisorAllowance + professionalAllowance
}
function calculateCareerInsurance() {
    const { monthlyBasicSalary, } = career.value
    const { premiumRate, employeeContributionRate } = civilServantInsurance
    civilServantInsurance.expense = Math.round(monthlyBasicSalary * premiumRate / 100 * employeeContributionRate / 100)
}
function calculatePension() {
    const { payPoint, pension } = career.value
    if (payPoint) {
        const index = pointOfPayOptions.findIndex(item => {
            return item.value === payPoint
        })
        const pensionBaseSalary = payRanks[index]
        career.value.insurance.salary = Math.round(pensionBaseSalary)
        const monthlyContributionEmployee = Math.round(pensionBaseSalary * 2 * pension.rate / 100)
        const monthlyContributionGovernment = Math.round(pensionBaseSalary * 2 * 0.15 * 0.35)
        career.value.pension.monthlyContributionEmployee = monthlyContributionEmployee
        career.value.pension.monthlyContribution = monthlyContributionEmployee + monthlyContributionGovernment
    } else {
        career.value.pension.monthlyContribution = 0
        career.value.insurance.salary = 0
    }
}
function calculateHealthInsurance() {
    /**
     * 
     * https://www.houli.taichung.gov.tw/media/782793/%E5%85%AC%E6%95%99%E4%BA%BA%E5%93%A1%E7%B5%A6%E8%88%87%E7%B0%A1%E6%98%8E%E8%A1%A8-%E5%AE%9A%E7%89%88.pdf
     */
    const { monthlyBasicSalary, supervisorAllowance, professionalAllowance } = career.value
    if (!monthlyBasicSalary) {
        healInsurance.salary = 0
        healInsurance.contribution = 0
        return
    }
    const { salaryRate } = healInsurance
    const healthSalaryMin = Math.round((monthlyBasicSalary + supervisorAllowance + professionalAllowance) * salaryRate / 100)
    const insuranceSalaryLevel = [
        ...laborAndHealthInsurance,
        ...onlyHealthInsurance,
    ]
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
    healthInsuranceContribution *= contributionShare.company / 100
    healInsurance.contribution = Math.ceil(healthInsuranceContribution)
}

function calculateAllowance() {
    const { supervisorRank, professionalRank } = career.value
    if (supervisorRank) {
        const index = supervisorAllowanceOptins.findIndex(item => {
            return item.value === supervisorRank
        })
        career.value.supervisorAllowance = supervisorAllowanceRanks[index]
    } else {
        career.value.supervisorAllowance = 0
    }
    if (professionalRank) {
        const index = professionalAllowanceOptions.findIndex(item => {
            return item.value === professionalRank
        })
        career.value.professionalAllowance = professoinalAllowanceRanks[index]
    } else {
        career.value.professionalAllowance = 0
    }
}
// 畫圖
let governmentChatInstance = ref<Chart>()
function drawChartAndCalculateIncome(propagate = false) {
    if (propagate) {
        emits('update:modelValue', career.value)
    }
    const { monthlyBasicSalary, insurance, pension, supervisorAllowance, professionalAllowance } = career.value
    // 繪製圖表
    let pv = 0
    let fv = 0
    const dataAndDataIndex: any[] = []
    fv = monthlyBasicSalary + supervisorAllowance + professionalAllowance
    dataAndDataIndex.push({
        label: '奉給總額',
        data: [pv, fv],
        datasetIndex: 0,
    })

    pv = fv
    if (pension.monthlyContributionEmployee) {
        fv -= pension.monthlyContributionEmployee
        dataAndDataIndex.push({
            label: '退撫',
            data: [pv, fv],
            datasetIndex: 1,
        })
    }
    if (monthlyBasicSalary) {
        career.value.monthlyNetPayEstimated = fv
    } else {
        career.value.monthlyNetPayEstimated = 0
    }

    pv = fv
    fv -= healInsurance.contribution
    dataAndDataIndex.push({
        label: '健保',
        data: [pv, fv],
        datasetIndex: 1,
    })

    pv = fv
    fv -= civilServantInsurance.expense
    dataAndDataIndex.push({
        label: '公保',
        data: [pv, fv],
        datasetIndex: 1,
    })

    if (monthlyBasicSalary) {
        career.value.monthlyNetPayEstimated = fv
    }
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
    // if (propagate) {
    //     emits('update:modelValue', career.value)
    // }

    if (governmentChatInstance.value) {
        governmentChatInstance.value.data = data
        governmentChatInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('governmentIncomeChart')
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
    governmentChatInstance = shallowRef(chartInstance)
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
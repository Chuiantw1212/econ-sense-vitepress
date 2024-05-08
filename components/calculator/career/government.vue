<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="年功俸點" required>
                        <econSelect v-model="career.seniorityPayPoint" :options="pointOfPayOptions"
                            @change="calculateCareer()">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年功俸額">
                        <el-text>{{ Number(career.monthlyBasicSalary).toLocaleString() }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主管加給">
                        <econSelect v-model="career.supervisorRank" :options="supervisorAllowanceOptins"
                            @change="calculateCareer">
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
                            @change="calculateCareer">
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
                        <el-input-number v-model="career.regionalAllowance" @change="calculateCareer">
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
                    <el-form-item label="本俸點" required>
                        <econSelect v-model="career.payPoint" :options="pointOfPayOptions" @change="calculateCareer()">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- <el-form-item label="本俸額">
                        <el-text>{{ Number(career.pension.monthlyContributionEmployee).toLocaleString() }}</el-text>
                    </el-form-item> -->
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="退撫自提率(%)">
                        <el-input-number v-model="career.pension.rate" @change="calculateCareer($event)" :min="0"
                            :max="5.25" />
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
                    <!-- <el-form-item label="勞保提繳工資">
                            <el-text> {{ Number(career.insurance.salary).toLocaleString() }}</el-text>
                        </el-form-item> -->
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
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>
                            資料更新日期113(2024)年
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
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
    // laborInsuranceLevels,
    // onlyLaborInsurance,
    laborAndHealthInsurance,
    onlyHealthInsurance,
    // entrepreneurHealthInsuranceLevel,
} from './config.js'
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
        calculateHealthInsurance()
        calculateCareerInsurance()
        calculatePension()
        calculateNetPay()
        debounce(() => {
            drawChartAndCalculateIncome(propagate)
        })(propagate)
    } catch (error) {
        console.log(error.message || error)
    }
}
function calculateNetPay() {
    const { monthlyBasicSalary, pension, supervisorAllowance, professionalAllowance, regionalAllowance } = career.value
    const { monthlyContribution } = pension
    const { contribution } = healInsurance
    const { expense } = civilServantInsurance
    career.value.monthlyNetPayEstimated = monthlyBasicSalary
        + supervisorAllowance + professionalAllowance + regionalAllowance
        - monthlyContribution - contribution - expense
}
function calculateMonthlyBasic() {
    const { seniorityPayPoint } = career.value
    if (seniorityPayPoint) {
        const index = pointOfPayOptions.findIndex(item => {
            return item.value === seniorityPayPoint
        })
        career.value.monthlyBasicSalary = payRanks[index]
    } else {
        career.value.monthlyBasicSalary = 0
    }
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
        const monthlyContributionEmployee = Math.round(pensionBaseSalary * 2 * pension.rate / 100)
        const monthlyContributionGovernment = Math.round(pensionBaseSalary * 2 * 0.15 * 0.35)
        career.value.pension.monthlyContributionEmployee = monthlyContributionEmployee
        career.value.pension.monthlyContribution = monthlyContributionEmployee + monthlyContributionGovernment
    } else {
        career.value.pension.monthlyContribution = 0
    }
}
function calculateHealthInsurance() {
    const { monthlyBasicSalary, supervisorAllowance, professionalAllowance } = career.value
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
function drawChartAndCalculateIncome(propagate = false) {
    if (propagate) {
        emits('update:modelValue', career.value)
    }
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
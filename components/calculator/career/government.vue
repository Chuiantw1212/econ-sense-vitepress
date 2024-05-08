<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="薪俸點" required>
                        <econSelect v-model="career.monthlyBasicSalary" :options="payOptions"
                            @change="calculateCareer()">
                        </econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="薪俸額">
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
                    <el-form-item label="健保提繳工資">
                        <el-text> {{ Number(healInsurance.salary).toLocaleString() }}</el-text>
                    </el-form-item>
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
    payOptions,
    supervisorAllowanceOptins,
    professionalAllowanceOptions,
    supervisorAllowanceRanks,
    professoinalAllowanceRanks
} from './config.js'
import econSelect from '../../econSelect.vue'
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
const healInsurance = reactive({
    salaryRate: 87.04,
    salary: 0,
    contribution: 0,
    // premiumRate: 5.17, // 健保費用率
    // contributionShare: {
    //     company: 30,
    //     union: 60,
    // },
    // employeeContributionRate: 30,
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
        calculateAllowance()
        debounce(() => {
            // drawChartAndCalculateIncome(propagate)
        })(propagate)
    } catch (error) {
        console.log(error.message || error)
    }
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
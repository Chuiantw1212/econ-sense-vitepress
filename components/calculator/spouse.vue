<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="結婚年">
                        <econSelect v-model="spouse.yearOfMarriage" placeholder="無配偶" :options="marriageYearOptions"
                            @change="calculatecSpouse()"></econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="spouse.yearOfMarriage && spouse.marriageLength > 0" label="已婚年數">
                        <el-text>{{ spouse.marriageLength }} 歲</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出生年">
                        <econSelect v-model="spouse.yearOfBirth" placeholder="無配偶" :options="marriageYearOptions"
                            :disabled="!spouse.yearOfMarriage" @change="calculatecSpouse()"></econSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="試算年齡">
                        <el-text>{{ spouse.age }} 歲</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="家庭貢獻/月">
                        <el-input-number v-model="spouse.monthlyContribution" :min="0" :step="1000"
                            :disabled="!spouse.yearOfMarriage" @change="calculatecSpouse($event)" />
                    </el-form-item>
                    <!-- <el-form-item label="婚禮預算">
                        <el-input-number v-model="spouse.weddingExpense" @change="calculatecSpouse()" />
                    </el-form-item> -->
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <!-- <canvas v-show="!unableToDraw" id="spouseChart"></canvas> -->
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { computed, ref, shallowRef, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import econSelect from '../econSelect.vue'
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
    },
})
const birthYearOptions = ref<any[]>([])
const marriageYearOptions = ref<any[]>([])
// hooks
onMounted(() => {
    setBirthYearOptions()
    setMarriageYears()
})

const spouse = computed(() => {
    return props.modelValue
})
const unableToDraw = computed(() => {
    // const { presentAsset, irr, yearsToRetirement } = security.value
    // const { monthlySaving } = props.career
    // const noPv = !presentAsset
    // const noPmt = !monthlySaving
    // const noIY = !irr
    // const noN = !yearsToRetirement
    // return (noPv && noPmt) || noIY || noN
    return false
})
// methods
function setBirthYearOptions() {
    const year = new Date().getFullYear()
    for (let i = 0; i < 60; i++) {
        const calculateYear = Number(year) - i - 18
        birthYearOptions.value.push({
            label: calculateYear,
            value: calculateYear
        })
    }
}
function setMarriageYears() {
    const currentYear = new Date().getFullYear()
    const beforeYears = []
    const afterYears = []
    for (let i = 0; i < 40; i++) {
        const afterYear = currentYear + i
        afterYears.push({
            label: afterYear,
            value: afterYear
        })
        if (i !== 0) {
            const beforeYear = currentYear - i
            beforeYears.push({
                label: beforeYear,
                value: beforeYear
            })
        }
    }
    marriageYearOptions.value = [...afterYears.reverse(), ...beforeYears,]
}
function calculatecSpouse(options: any = { propagate: true }) {
    const { yearOfMarriage } = spouse.value
    if (!yearOfMarriage) {
        spouse.value.age = 0
        spouse.value.monthlyContribution = 0
        spouse.value.yearOfBirth = ''
    }
    calculateYearOfMarriage()
    calculateMarriageAge()

    const { propagate = true } = options
    debounce(() => {
        drawMarriageChart(propagate)
    })(propagate)
}

function calculateYearOfMarriage() {
    const { yearOfMarriage } = spouse.value
    if (yearOfMarriage) {
        spouse.value.marriageLength = props.config.currentYear - yearOfMarriage
    } else {
        spouse.value.marriageLength = 0
    }
}
function calculateMarriageAge() {
    const { yearOfBirth } = spouse.value
    if (yearOfBirth) {
        spouse.value.age = props.config.currentYear - yearOfBirth
    } else {
        spouse.value.age = 0
    }
}

let spouseChartInstance = ref<Chart>()
function drawMarriageChart(propagate = true) {
    if (unableToDraw.value) {
        return
    }
    if (propagate) {
        emits('update:modelValue', spouse.value)
    }

    const chartData = {
        datasets: [],
        labels: []
    }

    if (spouseChartInstance.value) {
        spouseChartInstance.value.data = chartData
        spouseChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('spouseChart')
    if (ctx) {
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
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
        spouseChartInstance = shallowRef(chartInstance)
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
    calculatecSpouse,
})
</script>
<style lang="scss" scoped>
.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}
</style>
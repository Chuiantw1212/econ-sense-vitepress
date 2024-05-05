<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="結婚年">
                        <select v-model="spouse.yearOfMarriage" class="form__select" placeholder="請選擇"
                            @change="calculatecSpouse()" style="width: 130px">
                            <option label="無配偶" value=""></option>
                            <option v-for="year in marriageYearOptions" :key="year" :label="String(year)"
                                :value="year" />
                        </select>
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
                    <el-form-item v-if="spouse.yearOfMarriage" label="出生年">
                        <select v-model="spouse.yearOfBirth" class="form__select" placeholder="請選擇"
                            :disabled="!spouse.yearOfMarriage" @change="calculatecSpouse()" style="width: 130px">
                            <option label="無配偶" value=""></option>
                            <option v-for="year in birthYearOptions" :key="year" :label="String(year)" :value="year" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="spouse.yearOfMarriage" label="試算年齡">
                        <el-text>{{ spouse.age }} 歲</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item v-if="spouse.yearOfMarriage" label="家庭貢獻/月">
                        <el-input-number v-model="spouse.monthlyContribution" :min="0" :step="1000"
                            @change="calculatecSpouse($event)" />
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
import Chart from 'chart.js/auto';
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
const birthYearOptions = ref<number[]>([])
const marriageYearOptions = ref<number[]>([])
// hooks
onMounted(() => {
    setBirthYearOptions()
    setMarriageYears()
})

const spouse = computed(() => {
    return props.modelValue
})
const unableToDraw = computed(() => {
    // const { presentAsset, irr, period } = investment.value
    // const { monthlySaving } = props.career
    // const noPv = !presentAsset
    // const noPmt = !monthlySaving
    // const noIY = !irr
    // const noN = !period
    // return (noPv && noPmt) || noIY || noN
    return false
})
// methods
function setBirthYearOptions() {
    const year = new Date().getFullYear()
    for (let i = 0; i < 60; i++) {
        birthYearOptions.value.push(Number(year) - i - 18)
    }
}
function setMarriageYears() {
    const currentYear = new Date().getFullYear()
    const beforeYears = []
    const afterYears = []
    for (let i = 0; i < 20; i++) {
        afterYears.push(currentYear + i)
        if (i !== 0) {
            beforeYears.push(currentYear - i)
        }
    }
    marriageYearOptions.value = [...afterYears.reverse(), ...beforeYears,]
}
function calculatecSpouse(options: any = { propagate: true }) {
    const { yearOfMarriage } = spouse.value
    if (!yearOfMarriage) {
        spouse.value.age = 0
        spouse.value.monthlyContribution = 0
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
    spouse.value.marriageLength = props.config.currentYear - yearOfMarriage
}
function calculateMarriageAge() {
    const { yearOfBirth } = spouse.value
    spouse.value.age = props.config.currentYear - yearOfBirth
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
.form__select {
    all: unset;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 130px;
    padding: 0 15px;

    &:disabled {
        background-color: rgb(245, 247, 250);
    }
}

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
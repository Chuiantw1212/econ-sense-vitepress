<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="17">
                    <el-form-item label="房屋總價">
                        <el-text v-if="estate.totalPriceEstimated">= 單價({{ estatePrice.unitPrice }}萬/坪) x 權狀({{
                    estateSize.floorSize }}坪) = {{
                    Number(Math.floor(estate.totalPriceEstimated / 10000)).toLocaleString() }} 萬</el-text>
                        <el-input-number v-else v-model="estate.totalPrice" :min="0" :step="1000000"
                            @change="calculateMortgage({ setDownpay: true })" />
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item>
                        <el-button v-if="!estate.totalPriceEstimated" @click="emits('open')">點此估算總價</el-button>
                        <el-button v-if="estate.totalPriceEstimated" @click="resetTotalPrice()">取消估價並自行調整</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="頭期款占總價">
                        <el-slider v-model="estate.downpayPercent" :marks="downpayMarks" :min="0"
                            @change="calculateMortgage({ setDownpay: true })" />
                    </el-form-item>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="預估頭期款">
                        <el-input-number v-model="estate.downpayGoal" :min="0" :step="estate.downpayGoalStep" required
                            @change="calculateMortgage({ setTotalPrice: true })" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="career.monthlyBasicSalary" label="月實領 - 月支出">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備資產">
                        <el-text>
                            {{ Number(Math.floor(security.presentAsset / 10000)).toLocaleString() }} 萬
                        </el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="!unableToDrawChart" label="預期籌措時間">
                        <el-text>{{ config.currentYear + estate.yearsToDownpay }}
                            ({{ estate.yearsToDownpay }}年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas v-show="!unableToDrawChart" id="savingDownpayChart"></canvas>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="購屋西元年">
                        <el-input-number v-model="estate.downpayYear" @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="購屋時總價">
                        <el-text>{{ Number(Math.floor(estate.downpayTotalPrice / 10000)).toLocaleString() }}
                            萬</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="試算利息(%)">
                        <el-input-number v-model="estate.interestRate" :min="0" :step="0.25"
                            @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="estate.downpayYear" label="預估貸款">
                        <el-text>{{ Number(Math.floor(estate.loanAmount / 10000)).toLocaleString() }} 萬</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="貸款年期">
                        <el-input-number v-model="estate.loanTerm" :min="0" @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房貸利息" prop="floorSize">
                        <el-text>{{ Number(estate.monthlyRepay).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明">
                    <ul>
                        <li>
                            假設依靠投資籌措頭期款
                        </li>
                        <li>
                            假設房價增幅速度與通膨持平
                        </li>
                        <li>
                            試算房貸利息來源：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行擔保放款融通利率</a>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { computed, ref, shallowRef, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto';
const emits = defineEmits(['update:modelValue', 'reset', 'open'])
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
    career: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    estateSize: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    security: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    }
})
// hooks
const downpayMarks = ref({})
onMounted(() => {
    setTotalPriceMarks()
})
const estate = computed(() => {
    return props.modelValue
})
const unableToDrawChart = computed(() => {
    const { monthlySaving } = props.career
    const { irr, } = props.security
    const { downpayGoal } = estate.value
    const { presentAsset } = props.security
    const noPv = !presentAsset
    const negativePmt = monthlySaving <= 0
    const noN = !irr
    const noFv = !downpayGoal
    return noPv || negativePmt || noN || noFv
})
// methods
function resetTotalPrice() {
    emits('reset')
}
function calculateMortgage(options: any = { propagate: true }) {
    const { propagate = true, setDownpay = false, setTotalPrice = false } = options
    calculateTotalPriceEstimated()
    if (setDownpay) {
        calculateDownpayGoal()
    }
    if (setTotalPrice) {
        calculateTotalPrice()
        calculateDownpayGoalPercent()
    }
    // draw chart
    const dataRes = drawDownpayChart()
    calculateMonthlyRepay()
    const { headCount } = props.parenting
    const { singleBedRoom, doubleBedRoom } = props.estateSize
    if (headCount > singleBedRoom + doubleBedRoom * 2) {
        if (!errorMssage.pending()) {
            errorMssage()
        }
    }
    if (setDownpay || setTotalPrice) {
        calculateDownpayYear()
    }
    if (propagate) {
        emits('update:modelValue', estate.value)
    }
    return dataRes
}
function calculateTotalPrice() {
    const { downpayPercent, downpayGoal } = estate.value
    if (downpayPercent) {
        estate.value.totalPrice = Math.floor(downpayGoal / downpayPercent * 100)
    }
}
function calculateTotalPriceEstimated() {
    const { unitPrice, } = props.estatePrice
    const { floorSize, } = props.estateSize
    if (unitPrice && floorSize) {
        const totalPriceEstimated = Math.floor(Number(unitPrice) * Number(floorSize) * 10000)
        estate.value.totalPriceEstimated = totalPriceEstimated
        estate.value.totalPrice = totalPriceEstimated
    }
}
function setTotalPriceMarks() {
    for (let i = 0; i < 10; i++) {
        downpayMarks.value[i * 10] = `${i * 10}%`
    }
}
function calculateDownpayGoal() {
    const { totalPriceEstimated, totalPrice, downpayPercent } = estate.value
    const priceCalculated = totalPriceEstimated || totalPrice
    estate.value.downpayGoalStep = Math.floor(priceCalculated / 10)
    estate.value.downpayGoal = Math.floor(priceCalculated * downpayPercent / 100)
    if (!estate.value.downpayPercent) {
        estate.value.downpayPercent = 20
    }
}
function calculateDownpayGoalPercent() {
    const { totalPriceEstimated, totalPrice, downpayGoal } = estate.value
    const price = totalPriceEstimated || totalPrice
    if (price) {
        if (downpayGoal) {
            const downpayPercent = downpayGoal / price * 100
            estate.value.downpayPercent = Math.ceil(downpayPercent)
        } else {
            estate.value.downpayPercent = 0
        }
    }
}
function calculateLoanAmount() {
    const { downpayTotalPrice, downpayGoal } = estate.value
    if (!downpayTotalPrice || !downpayGoal) {
        return
    }
    const loanAmount = downpayTotalPrice - downpayGoal
    estate.value.loanAmount = Math.ceil(loanAmount)
}
function calculateMonthlyRepay(): number {
    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const { interestRate, loanTerm, loanAmount } = estate.value
    if (!interestRate || !loanTerm || !loanAmount) {
        return
    }
    const monthlyInterestRate = interestRate / 100 / 12
    const monthCount = loanTerm * 12
    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1
    const averageRepayRate = fraction / deno
    const monthlyRepay = Math.ceil(loanAmount * averageRepayRate)
    estate.value.monthlyRepay = monthlyRepay
    return monthlyRepay
}

let downPayChartInstance = ref<Chart>()
const debounceId = ref()
function drawDownpayChart() {
    if (unableToDrawChart.value) {
        return
    }
    const { irr, } = props.security
    const { inflationRate, currentYear } = props.config
    const {
        downpayGoal,
        downpayYear,
        totalPrice,
        totalPriceEstimated,
        loanTerm,
        interestRate
    } = estate.value
    const { presentAsset } = props.security
    const { monthlySaving } = props.career
    const irrModifier: number = 1 + irr / 100
    const inflationRatio: number = 1 + inflationRate / 100

    let pv: number = presentAsset
    let pmt: number = 0
    if (monthlySaving) {
        pmt = monthlySaving * 12
    }
    let fv: number = 0
    let goal: number = downpayGoal
    let downpayTotalPrice: number = totalPrice || totalPriceEstimated

    const labels: string[] = []
    const estateDebtData: number[] = []
    const preparedDownpayData: number[] = []
    const annualSavingData: number[] = []
    const estateTotalPrice: number[] = []

    let period = 0
    do {
        pmt *= inflationRatio
        goal *= inflationRatio
        downpayTotalPrice *= inflationRatio

        fv = pv * irrModifier
        preparedDownpayData.push(Math.floor(fv))
        fv += pmt
        annualSavingData.push(Math.floor(pmt))
        labels.push(currentYear + ++period)
        estateTotalPrice.push(Math.floor(goal))
        pv = fv
    } while (fv < goal)

    estate.value.yearsToDownpay = period
    estate.value.downpayYearEstimated = props.config.currentYear + period
    if (downpayYear > estate.value.downpayYearEstimated) {
        for (let i = 0; i < downpayYear - estate.value.downpayYearEstimated; i++) {
            pmt *= inflationRatio
            goal *= inflationRatio
            downpayTotalPrice *= inflationRatio

            fv = pv * irrModifier
            preparedDownpayData.push(Math.floor(fv))
            fv += pmt
            annualSavingData.push(Math.floor(pmt))
            labels.push(currentYear + ++period)
            estateTotalPrice.push(Math.floor(goal))
            pv = fv
        }
    }
    estate.value.downpayTotalPrice = Math.floor(downpayTotalPrice)
    calculateLoanAmount()

    // 計算房貸債務
    const calculatedMonthlyRepay = calculateMonthlyRepay()
    let loanRemains = estate.value.loanAmount
    const monthlyInterestRate = interestRate / 100 / 12
    const monthCount = loanTerm * 12
    for (let i = 0; i < monthCount; i++) {
        const monthlyRepayInterest = loanRemains * monthlyInterestRate
        const monthlyRepayPrinciple = calculatedMonthlyRepay - monthlyRepayInterest
        loanRemains -= monthlyRepayPrinciple
        if (i % 12 === 11) {
            loanRemains = Math.max(0, loanRemains)
            estateDebtData.push(Math.ceil(-loanRemains))
        }
    }

    const datasets = [
        {
            label: '已備增值',
            data: preparedDownpayData,
            stack: '已備',
        },
        {
            label: '預估頭期款',
            data: estateTotalPrice,
            stack: '應備',
        }
    ]
    if (monthlySaving) {
        datasets.push({
            label: '儲蓄投資',
            data: annualSavingData,
            stack: '已備',
        })
    }
    const chartData = {
        labels,
        datasets,
    }

    if (downPayChartInstance.value) {
        clearTimeout(debounceId.value)
        debounceId.value = setTimeout(() => {
            debounceId.value = undefined
            downPayChartInstance.value.data = chartData
            downPayChartInstance.value.update()
        }, 150)
    } else {
        const ctx: any = document.getElementById('savingDownpayChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: formatNumber,
                        }
                    }
                },
            }
        })
        downPayChartInstance = shallowRef(chartInstance)
    }
    const exportData = {
        estateDebtData
    }
    return JSON.parse(JSON.stringify(exportData))
}
function formatNumber(tooltipItems) {
    const { raw, } = tooltipItems
    let formatRaw: string | number = Math.ceil(raw / 10000)
    formatRaw = Number(formatRaw).toLocaleString()
    return `${formatRaw}萬`
}
function calculateDownpayYear() {
    const { yearsToDownpay } = estate.value
    if (yearsToDownpay) {
        const minBuyHouseYear = props.config.currentYear + estate.value.yearsToDownpay
        estate.value.downpayYear = Math.max(minBuyHouseYear, estate.value.downpayYear)
    }
}

import { ElMessage, } from 'element-plus'
import { throttle, debounce } from './lodash.js'
const errorMssage = throttle(() => {
    // ElMessage.error('房屋：家徒四壁！')
}, 4000)

defineExpose({
    calculateMortgage,
})
</script>
<style lang="scss">
.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular) !important;
        background: white !important;
    }
}
</style>
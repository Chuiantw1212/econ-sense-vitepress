<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="18">
                    <el-form-item label="房屋總價">
                        <el-text v-if="mortgage.totalPriceEstimated">= 單價({{ estatePrice.unitPrice }}萬/坪) x 權狀({{
                            estateSize.floorSize }}坪) = {{
                                Number(Math.floor(mortgage.totalPriceEstimated / 10000)).toLocaleString() }} 萬</el-text>
                        <el-input-number v-else v-model="mortgage.totalPrice" :min="0" :step="1000000"
                            @change="calculateMortgage({ setDownpay: true })" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item>
                        <el-button v-if="!mortgage.totalPriceEstimated" @click="emits('open')">點此估算總價</el-button>
                        <el-button v-if="mortgage.totalPriceEstimated" @click="resetTotalPrice()">取消並自行調整</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="頭期款占總價">
                        <el-slider v-model="mortgage.downpayPercent" :marks="downpayMarks" :min="0"
                            @change="calculateMortgage({ setDownpay: true })" />
                    </el-form-item>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="預估頭期款">
                        <el-input-number v-model="mortgage.downpayGoal" :min="0" :step="mortgage.downpayGoalStep"
                            required @change="calculateMortgage({ setTotalPrice: true })" />
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
                            {{ Number(Math.floor(asset.presentAsset / 10000)).toLocaleString() }} 萬
                        </el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="!unableToDrawChart" label="預期籌措時間">
                        <el-text>{{ config.currentYear + mortgage.yearsToDownpay }}
                            ({{ mortgage.yearsToDownpay }}年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas v-show="!unableToDrawChart" id="savingDownpayChart"></canvas>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="購屋西元年">
                        <el-input-number v-model="mortgage.downpayYear" @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="購屋時總價">
                        <el-text>{{ Number(Math.floor(mortgage.downpayTotalPrice / 10000)).toLocaleString() }}
                            萬</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="試算利息(%)">
                        <el-input-number v-model="mortgage.interestRate" :min="0" :step="0.25"
                            @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="mortgage.downpayYear" label="預估貸款">
                        <el-text>{{ Number(Math.floor(mortgage.loanAmount / 10000)).toLocaleString() }} 萬</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="貸款年期">
                        <el-input-number v-model="mortgage.loanTerm" :min="0" @change="calculateMortgage()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房貸利息" prop="floorSize">
                        <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1">
                    <ul>
                        <li>
                            假設依靠投資籌措頭期款
                        </li>
                        <li>
                            試算利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率</a>
                        </li>
                        <li>
                            假設房價增幅速度與通膨持平
                        </li>
                        <li>
                            購屋西元年歸零可回歸籌措頭期款模式
                        </li>
                        <li>
                            單價資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html"
                                target="_blank">財團法人金融聯合徵信中心
                                OpenAPI
                            </a>
                        </li>
                    </ul>
                    <table class="table">
                        <tr>
                            <th>空間</th>
                            <th>參考平方公尺</th>
                            <th>參考依據</th>
                        </tr>
                        <tr>
                            <td>雙人房</td>
                            <td>19</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13"
                                    target="_blank">
                                    觀光旅館建築及設備標準
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>單人房</td>
                            <td>13</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13"
                                    target="_blank">
                                    觀光旅館建築及設備標準
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>衛浴</td>
                            <td>4</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070115&flno=295"
                                    target="_blank">
                                    建築技術規則建築設計施工編
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>廚房</td>
                            <td>2~4</td>
                            <td>
                                <a href="https://www.pro360.com.tw/category/kitchen_decorating#:~:text=%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BB%9A%E5%85%B7%E9%85%8D%E7%BD%AE%E5%B0%8D,%E8%BC%83%E5%A5%BD%E7%9A%84%E4%BD%BF%E7%94%A8%E9%AB%94%E9%A9%97%E3%80%82"
                                    target="_blank">
                                    廚房空間如何規劃？廚房設計4大攻略及範例圖片參考｜PRO360達人網
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>餐廳+客廳</td>
                            <td>1/人</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060009&flno=322"
                                    target="_blank">
                                    職業安全衛生設施規則
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>其他室內空間</td>
                            <td>30</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0070037&flno=10"
                                    target="_blank">
                                    幼兒園及其分班基本設施設備標準
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>陽台</td>
                            <td>10%</td>
                            <td>
                                <a href="https://law.moj.gov.tw/LawClass/LawSingleRela.aspx?PCODE=D0070115&FLNO=162&ty=L"
                                    target="_blank">
                                    建築技術規則建築設計施工編
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>車位</td>
                            <td>24.75</td>
                            <td>
                                <a href="https://tnews.cc/ur/newscon25045.htm" target="_blank">
                                    研商「精進建物測繪登記相關業務」第 2 次會議紀錄
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>公設比</td>
                            <td>預設35%</td>
                            <td>
                                <a href="https://www.google.com/search?q=%E5%85%AC%E8%A8%AD%E6%AF%94" target="_blank">
                                    Google搜索
                                </a>
                            </td>
                        </tr>
                    </table>
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
    asset: {
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
const mortgage = computed(() => {
    return props.modelValue
})
const unableToDrawChart = computed(() => {
    const { monthlySaving } = props.career
    const { irr, } = props.asset
    const { downpayGoal } = mortgage.value
    const { presentAsset } = props.asset
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
    debounce(() => {
        drawDownpayChart(propagate)
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
    })(propagate)
}
function calculateTotalPrice() {
    const { downpayPercent, downpayGoal } = mortgage.value
    if (downpayPercent) {
        mortgage.value.totalPrice = Math.floor(downpayGoal / downpayPercent * 100)
    }
}
function calculateTotalPriceEstimated() {
    const { unitPrice, } = props.estatePrice
    const { floorSize, } = props.estateSize
    if (unitPrice && floorSize) {
        const totalPriceEstimated = Math.floor(Number(unitPrice) * Number(floorSize) * 10000)
        mortgage.value.totalPriceEstimated = totalPriceEstimated
        mortgage.value.totalPrice = totalPriceEstimated
    }
}
function setTotalPriceMarks() {
    for (let i = 0; i < 10; i++) {
        downpayMarks.value[i * 10] = `${i * 10}%`
    }
}
function calculateDownpayGoal() {
    const { totalPriceEstimated, totalPrice, downpayPercent } = mortgage.value
    const priceCalculated = totalPriceEstimated || totalPrice
    mortgage.value.downpayGoalStep = Math.floor(priceCalculated / 10)
    mortgage.value.downpayGoal = Math.floor(priceCalculated * downpayPercent / 100)
    if (!mortgage.value.downpayPercent) {
        mortgage.value.downpayPercent = 20
    }
}
function calculateDownpayGoalPercent() {
    const { totalPriceEstimated, totalPrice, downpayGoal } = mortgage.value
    const price = totalPriceEstimated || totalPrice
    if (price) {
        if (downpayGoal) {
            const downpayPercent = downpayGoal / price * 100
            mortgage.value.downpayPercent = Math.ceil(downpayPercent)
        } else {
            mortgage.value.downpayPercent = 0
        }
    }
}
function calculateLoanAmount() {
    const { downpayTotalPrice, downpayGoal } = mortgage.value
    if (!downpayTotalPrice || !downpayGoal) {
        return
    }
    const loanAmount = downpayTotalPrice - downpayGoal
    mortgage.value.loanAmount = Math.ceil(loanAmount)
}
function calculateMonthlyRepay() {
    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const { interestRate, loanTerm, loanAmount } = mortgage.value
    if (!interestRate || !loanTerm || !loanAmount) {
        return
    }
    const monthlyInterestRate = interestRate / 100 / 12
    const monthCount = loanTerm * 12
    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1
    const averageRepayRate = fraction / deno
    mortgage.value.monthlyRepay = Math.ceil(loanAmount * averageRepayRate)
}

let downPayChartInstance = ref<Chart>()
function drawDownpayChart(propagate = false) {
    if (propagate) {
        emits('update:modelValue', mortgage.value)
    }
    if (unableToDrawChart.value) {
        return
    }
    const { irr, } = props.asset
    const { inflationRate, currentYear } = props.config
    const {
        downpayGoal,
        downpayYear,
        totalPrice,
        totalPriceEstimated,
        monthlyRepay,
        loanAmount,
        loanTerm,
        interestRate
    } = mortgage.value
    const { presentAsset } = props.asset
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
    const mortgageDebtData: number[] = []
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

    mortgage.value.yearsToDownpay = period
    mortgage.value.downpayYearEstimated = props.config.currentYear + period
    if (downpayYear > mortgage.value.downpayYearEstimated) {
        for (let i = 0; i < downpayYear - mortgage.value.downpayYearEstimated; i++) {
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
    mortgage.value.downpayTotalPrice = Math.floor(downpayTotalPrice)
    calculateLoanAmount()

    // 計算房貸債務
    let loanRemains = mortgage.value.loanAmount
    const monthlyInterestRate = interestRate / 100 / 12
    const monthCount = loanTerm * 12
    for (let i = 0; i < monthCount; i++) {
        const monthlyRepayInterest = loanRemains * monthlyInterestRate
        const monthlyRepayPrinciple = monthlyRepay - monthlyRepayInterest
        loanRemains -= monthlyRepayPrinciple
        if (i % 12 === 11) {
            loanRemains = Math.max(0, loanRemains)
            mortgageDebtData.push(Math.ceil(loanRemains))
        }
    }
    mortgage.value.debtData = mortgageDebtData

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
        downPayChartInstance.value.data = chartData
        downPayChartInstance.value.update()
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
    return mortgageDebtData
}
function formatNumber(tooltipItems) {
    const { raw, } = tooltipItems
    let formatRaw: string | number = Math.ceil(raw / 10000)
    formatRaw = Number(formatRaw).toLocaleString()
    return `${formatRaw}萬`
}
function calculateDownpayYear() {
    const { yearsToDownpay } = mortgage.value
    if (yearsToDownpay) {
        const minBuyHouseYear = props.config.currentYear + mortgage.value.yearsToDownpay
        mortgage.value.downpayYear = Math.max(minBuyHouseYear, mortgage.value.downpayYear)
    }
}

import { ElMessage, } from 'element-plus'
import { throttle, debounce } from './lodash.js'
const errorMssage = throttle(() => {
    ElMessage.error('房屋：家徒四壁！')
}, 4000)

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
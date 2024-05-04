<template>
    <div>
        <h3 id="_投資資產試算" tabindex="-1">投資資產試算<a class="header-anchor" href="#投資資產試算"
                aria-label="Permalink to &quot;投資資產試算&quot;">&ZeroWidthSpace;</a></h3>

        <el-card>
            <el-form label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="資產配置">
                            <el-radio-group v-model="investment.allocationETF" @change="calculateAsset()">
                                <el-radio v-for="(label, key) in config.porfolioLabels" :value="key">{{ label
                                    }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="投資報酬率">
                            <el-slider v-model="investment.stockPercentage" :marks="allocationQuartileMarks"
                                :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <br />
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="已備資產" @change="calculateAsset()">
                            <el-input-number v-model="investment.presentAsset" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="儲蓄投資" @change="calculateAsset()">
                            <el-text>{{ Number(career.monthlySaving).toLocaleString() }} NTD / 月</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-collapse>
                    <el-collapse-item title="點此快速調整目標(日期&支出)" :border="true">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="購屋西元年">
                                    <el-input-number v-model="mortgage.buyHouseYear" @change="calculateAsset()" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="房貸利息" @change="calculateAsset()">
                                    <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD / 月</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="第一隻西元年">
                                    <el-input-number v-model="parenting.firstBornYear" :min="0"
                                        @change="calculateAsset($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="月開支(隻/每年)">
                                    <el-input-number v-model="parenting.childAnnualExpense" :min="0"
                                        @change="calculateAsset($event)" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="第二隻西元年">
                                    <el-input-number v-model="parenting.secondBornYear" :min="0"
                                        @change="calculateAsset($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
                <!-- <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="房貸利息" @change="calculateAsset()">
                            <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD / 月</el-text>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <canvas v-show="!unableToDraw" id="assetChart"></canvas>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>將日期歸零，則視同取消計算項目。</li>
                            <li>因版面有限，只計算退休前資產累積。</li>
                            <li>育兒支出總額為扣除配偶貢獻後的結果。</li>
                        </ul>
                        <table class="table">
                            <tr>
                                <th>參考標的</th>
                                <th>資產配置</th>
                                <th>來源網址</th>
                            </tr>
                            <tr>
                                <td>AOA</td>
                                <td>股8債2</td>
                                <td>
                                    <a href="https://www.ishares.com/us/products/239729/ishares-aggressive-allocation-etf"
                                        target="_blank">
                                        來源網址
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>AOR</td>
                                <td>股6債4</td>
                                <td>
                                    <a href="https://www.ishares.com/us/products/239756/ishares-growth-allocation-etf"
                                        target="_blank">
                                        來源網址
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>AOM</td>
                                <td>股4債6</td>
                                <td>
                                    <a href="https://www.ishares.com/us/products/239765/ishares-moderate-allocation-etf"
                                        target="_blank">
                                        來源網址
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>AOK</td>
                                <td>股2債8</td>
                                <td>
                                    <a href="https://www.ishares.com/us/products/239733/ishares-conservative-allocation-etf"
                                        target="_blank">
                                        來源網址
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </el-collapse-item>
                </el-collapse>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive } from 'vue'
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
    career: {
        type: Object,
        default: () => {
            return {}
        }
    },
    mortgage: {
        type: Object,
        default: () => {
            return {}
        }
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        }
    },
    retirement: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const allocationQuartileMarks = reactive({})
const investment = computed(() => {
    return props.modelValue
})
function calculateAsset(options: any = { propagate: true }) {
    calculateInvestmentPeriod()
    calculatePortfolio()

    const { propagate = true } = options
    debounce(() => {
        drawLifeAssetChart(propagate)
    })(propagate)
}
function calculatePortfolio() {
    const { allocationETF } = investment.value
    const { portfolioIRR, porfolioLabels } = props.config
    const allocationLabels = Object.keys(porfolioLabels)
    const allocationIndex = allocationLabels.findIndex(label => label === allocationETF)
    const stockPercentage = Math.floor((allocationIndex + 1) * 20)
    investment.value.stockPercentage = stockPercentage
    investment.value.irr = portfolioIRR[allocationETF]
    allocationLabels.forEach((label, index) => {
        const irr = portfolioIRR[label]
        const stockPercentage = Math.floor((index + 1) * 20)
        allocationQuartileMarks[stockPercentage] = `IRR: ${irr}`
    })
}
function calculateInvestmentPeriod() {
    investment.value.period = props.retirement.yearToRetirement
}

const unableToDraw = computed(() => {
    const { presentAsset, irr, period } = investment.value
    const { monthlySaving } = props.career
    const noPv = !presentAsset
    const noPmt = !monthlySaving
    const noIY = !irr
    const noN = !period
    return (noPv && noPmt) || noIY || noN
})

let investmentChartInstance = ref<Chart>()
function drawLifeAssetChart(propagate = true) {
    if (unableToDraw.value) {
        return
    }
    const { presentAsset, irr, period } = investment.value
    const { buyHouseYear, downPayment, monthlyRepay, loanTerm } = props.mortgage
    const { currentYear, inflationRate } = props.config
    const irrModifier = 1 + irr / 100

    const inflatoinRatio = 1 + inflationRate / 100
    let inflationModifier = 1

    let pv = presentAsset
    let fv = 0
    const labels: number[] = []
    const datasetData: number[] = []
    const investingData: number[] = []
    const mortgageData: number[] = []
    const downpayData: number[] = []
    const childExpenseData: number[] = []

    for (let year = currentYear; year < currentYear + period; year++) {
        inflationModifier *= inflatoinRatio
        /**
         * 影響存量重大事件
         */
        if (year === buyHouseYear) {
            const inflatedDownpay = downPayment * inflationModifier
            pv -= inflatedDownpay
            downpayData.push(inflatedDownpay)
        } else {
            downpayData.push(0)
        }
        /**
         * 會受到通膨影響的PMT
         */
        // 執業收支 
        const { monthlySaving } = props.career
        const annualSaving = monthlySaving * 12
        investingData.push(annualSaving)
        let calculatedPmt = annualSaving * inflationModifier

        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense, spouseMonthlyContribution } = props.parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const hasFirstBorn = currentYear <= firstBornYear && firstBornYear <= year && year < firstBornEndYear
        const hasSecondBorn = currentYear <= secondBornYear && secondBornYear && secondBornYear <= year && year < secondBornEndYear
        let childExpense = 0
        if (hasFirstBorn) {
            childExpense += childAnnualExpense * inflationModifier
        }
        if (hasSecondBorn) {
            childExpense += childAnnualExpense * inflationModifier
        }
        if (hasFirstBorn || hasSecondBorn) {
            const spouseAnnualContribution = spouseMonthlyContribution * 12 * inflationModifier
            childExpense -= spouseAnnualContribution
            calculatedPmt -= childExpense
            childExpenseData.push(Math.floor(childExpense))
        } else {
            childExpenseData.push(0)
        }
        // 加計通貨膨脹
        calculatedPmt *= inflationModifier
        /**
         * 不受到通膨影響的PMT
         */
        // 房貸利息影響每月儲蓄
        const mortgageStartYear = buyHouseYear
        const mortgageEndYear = buyHouseYear + loanTerm
        let mortgagePmt = 0
        if (mortgageStartYear <= year && year < mortgageEndYear) {
            mortgagePmt = monthlyRepay * 12
        }
        calculatedPmt -= mortgagePmt
        mortgageData.push(Math.floor(mortgagePmt))

        // 計算複利終值
        fv = pv * irrModifier + calculatedPmt
        datasetData.push(Math.floor(fv))
        labels.push(year)
        pv = fv
    }
    const datasets = [
        {
            label: '資產存量',
            data: datasetData,
        },
        // {
        //     label: '定期定額',
        //     data: investingData,
        // }
    ]
    const hasChildExpense = childExpenseData.some(value => value !== 0)
    if (hasChildExpense) {
        datasets.push({
            label: '育兒支出',
            data: childExpenseData,
        })
    }
    if (buyHouseYear) {
        datasets.push({
            label: '房貸支出',
            data: mortgageData,
        })
        datasets.push({
            label: '頭期款',
            data: downpayData,
        })
    }
    const chartData = {
        datasets,
        labels
    }
    if (propagate) {
        emits('update:modelValue', investment.value)
    }

    if (investmentChartInstance.value) {
        investmentChartInstance.value.data = chartData
        investmentChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('assetChart')
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
    investmentChartInstance = shallowRef(chartInstance)
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
    calculateAsset,
});
</script>
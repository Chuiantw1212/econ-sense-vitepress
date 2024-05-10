<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="ETF配置">
                        <el-radio-group v-model="asset.allocationETF" @change="calculateAsset()">
                            <el-radio v-for="(label, key) in config.porfolioLabels" :value="key">{{ label
                                }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="投資報酬率">
                        <el-slider v-model="asset.stockPercentage" :marks="allocationQuartileMarks" :disabled="true" />
                    </el-form-item>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備資產">
                        <el-input-number v-model="asset.presentAsset" :min="0" :step="100000" :disabled="isFormDisabled"
                            @change="calculateAsset()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="定期定額">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} NTD / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="isFormDisabled">
                <el-col>
                    <el-form-item label="圖表繪製前提">
                        <el-text type="danger">
                            填寫基本資料、職業試算、退休試算
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas v-show="!unableToDraw" id="assetChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>將日期歸零，則視同取消計算項目。</li>
                        <li>因版面有限，只計算退休前資產累積。</li>
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
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive, watch } from 'vue'
import Chart from 'chart.js/auto';
import { ElMessage, } from 'element-plus'
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
    spouse: {
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
const legalInterestRate = 16
// hooks
const asset = computed(() => {
    return props.modelValue
})
const isFormDisabled = computed(() => {
    const { yearToRetirement } = props.retirement
    const { monthlyBasicSalary } = props.career
    return !yearToRetirement || !monthlyBasicSalary
})
watch(() => props.config.portfolioIRR, () => {
    setPortfolioMarks()
}, { deep: true })
// methods
function setPortfolioMarks() {
    const { portfolioIRR, porfolioLabels } = props.config
    const allocationLabels = Object.keys(porfolioLabels)
    allocationLabels.forEach((label, index) => {
        const irr = portfolioIRR[label]
        const stockPercentage = Math.floor((index + 1) * 20)
        allocationQuartileMarks[stockPercentage] = `IRR: ${irr}`
    })
}
function calculateAsset(options: any = { propagate: true }) {
    setPortfolioMarks()
    calculateInvestmentPeriod()
    calculatePortfolio()
    const { propagate = true } = options
    debounce(() => {
        drawLifeAssetChart(propagate)
    })(propagate)
}
function calculatePortfolio() {
    const { allocationETF } = asset.value
    const { portfolioIRR, porfolioLabels } = props.config
    const allocationLabels = Object.keys(porfolioLabels)
    const allocationIndex = allocationLabels.findIndex(label => label === allocationETF)
    const stockPercentage = Math.floor((allocationIndex + 1) * 20)
    asset.value.stockPercentage = stockPercentage
    asset.value.irr = portfolioIRR[allocationETF]

}
function calculateInvestmentPeriod() {
    asset.value.period = props.retirement.yearToRetirement
}

const unableToDraw = computed(() => {
    const { presentAsset, irr, period } = asset.value
    const { monthlySaving } = props.career
    const noPv = !presentAsset
    const noPmt = !monthlySaving
    const noIY = !irr
    const noN = !period
    return (noPv && noPmt) || noIY || noN
})

let assetChartInstance = ref<Chart>()
function drawLifeAssetChart(propagate = true) {
    if (propagate) {
        emits('update:modelValue', asset.value)
    }
    if (unableToDraw.value) {
        return
    }
    const { presentAsset, irr, period } = asset.value
    const { downpayYear, downpay, monthlyRepay, loanTerm, downpayGoal, totalPrice } = props.mortgage
    const { currentYear, inflationRate } = props.config
    const { monthlyContribution } = props.spouse
    const spouseAnnualContribution = monthlyContribution * 12
    const irrModifier = 1 + irr / 100
    const inflatoinRatio = 1 + inflationRate / 100
    let valueModifier = 1

    let pv = presentAsset
    let fv = 0
    const labels: number[] = []
    const datasetData: number[] = []
    const investingData: number[] = []
    const mortgageData: number[] = []
    const downpayData: number[] = []
    const estateData: number[] = []
    const spouseContribution: number[] = []
    const childExpenseData: number[] = []

    for (let year = currentYear; year < currentYear + period; year++) {
        valueModifier *= inflatoinRatio
        /**
         * 影響存量重大事件
         */
        if (year === downpayYear) {
            const calculatedDownpay = downpayGoal || downpay
            const inflatedDownpay = calculatedDownpay * valueModifier
            pv -= inflatedDownpay
            downpayData.push(Math.floor(-inflatedDownpay))
        } else {
            downpayData.push(0)
        }
        /**
         * 會受到通膨影響的PMT
         */
        // 執業收支 
        const { monthlySaving } = props.career
        const annualSaving = monthlySaving * 12
        let calculatedPmt = annualSaving * valueModifier
        investingData.push(calculatedPmt)

        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense } = props.parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const hasFirstBorn = currentYear <= firstBornYear && firstBornYear <= year && year < firstBornEndYear
        const hasSecondBorn = currentYear <= secondBornYear && secondBornYear && secondBornYear <= year && year < secondBornEndYear
        let childExpense = 0
        if (hasFirstBorn) {
            childExpense += childAnnualExpense * valueModifier
        }
        if (hasSecondBorn) {
            childExpense += childAnnualExpense * valueModifier
        }
        if (hasFirstBorn || hasSecondBorn) {
            const inflatedContribution = Math.floor(spouseAnnualContribution * valueModifier)
            childExpense -= inflatedContribution
            calculatedPmt -= childExpense
            spouseContribution.push(inflatedContribution)
            childExpenseData.push(Math.floor(-childExpense))
        } else {
            spouseContribution.push(0)
            childExpenseData.push(0)
        }
        // 加計通貨膨脹
        calculatedPmt *= valueModifier
        /**
         * 不受到通膨影響的PMT
         */
        // 房貸利息影響每月儲蓄
        const mortgageStartYear = downpayYear
        const mortgageEndYear = downpayYear + loanTerm
        let mortgagePmt = 0
        let inflatedTotalPrice = 0
        if (mortgageStartYear <= year && fv > 0) {
            if (year < mortgageEndYear) {
                mortgagePmt = monthlyRepay * 12
            }
            inflatedTotalPrice = Math.floor(totalPrice * valueModifier)
        }
        estateData.push(inflatedTotalPrice)
        mortgageData.push(Math.floor(-mortgagePmt))
        calculatedPmt -= mortgagePmt

        // 計算複利終值
        fv = pv * irrModifier
        datasetData.push(Math.floor(fv))
        fv += calculatedPmt
        if (fv <= 0) {
            fv = 0
            valueModifier = 0
        }

        labels.push(year)
        pv = fv
    }
    if (fv <= 0) {
        ElMessage.error('財務危機！')
    } else {
        ElMessage.closeAll()
    }
    const datasets = [
        {
            label: 'ETF增值',
            data: datasetData,
        },
    ]

    datasets.push({
        label: '定期定額',
        data: investingData,
    })
    const hasChildExpense = childExpenseData.some(value => value !== 0)
    if (hasChildExpense) {
        datasets.push({
            label: '育兒支出',
            data: childExpenseData,
        })
    }
    if (downpayYear && downpayYear < currentYear + period) {
        datasets.push({
            label: '房貸支出',
            data: mortgageData,
        })
        datasets.push({
            label: '頭期款',
            data: downpayData,
        })
        // datasets.push({
        //     label: '房地產',
        //     data: estateData,
        // })
    }
    const chartData = {
        datasets,
        labels
    }

    if (assetChartInstance.value) {
        assetChartInstance.value.data = chartData
        assetChartInstance.value.update()
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
    assetChartInstance = shallowRef(chartInstance)
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
<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="ETF配置">
                        <el-radio-group v-model="security.allocationETF" @change="calculateSecurity()">
                            <el-radio v-for="(label, key) in config.porfolioLabels" :value="key">{{ label
                                }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="投資報酬率">
                        <el-slider v-model="security.stockPercentage" :marks="allocationQuartileMarks"
                            :disabled="true" />
                    </el-form-item>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備資產">
                        <el-input-number v-model="security.presentAsset" :min="0" :step="100000"
                            :disabled="isFormDisabled" @change="calculateSecurity()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="定期定額">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="isFormDisabled">
                <el-col>
                    <el-form-item label="圖表繪製前提">
                        <el-text type="danger">
                            填寫基本資料、職業試算、退休試算
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas v-show="!unableToDraw" id="securityChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>將日期歸零，則視同取消計算項目。</li>
                        <li>因版面有限，只計算退休前資產累積。</li>
                    </ul>
                    <table class="table">
                        <thead>
                            <tr>
                                <td>參考標的</td>
                                <td>資產配置</td>
                                <td>來源網址</td>
                            </tr>
                        </thead>
                        <tbody>
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
                        </tbody>
                    </table>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive, watch } from 'vue'
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
    profile: {
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
// hooks
const security = computed(() => {
    return props.modelValue
})
const isFormDisabled = computed(() => {
    const { yearsToRetirement } = props.retirement
    const { monthlyBasicSalary } = props.career
    return !yearsToRetirement || !monthlyBasicSalary
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

const debounceId = ref()
async function calculateSecurity(options: any = { propagate: true }) {
    setPortfolioMarks()
    calculateInvestmentPeriod()
    calculatePortfolio()
    const principleData = await drawLifeAssetChart()
    const { propagate = true } = options
    if (propagate) {
        emits('update:modelValue', security.value)
    }
    return await principleData
}
function calculatePortfolio() {
    const { allocationETF } = security.value
    const { portfolioIRR, porfolioLabels } = props.config
    const allocationLabels = Object.keys(porfolioLabels)
    const allocationIndex = allocationLabels.findIndex(label => label === allocationETF)
    const stockPercentage = Math.floor((allocationIndex + 1) * 20)
    security.value.stockPercentage = stockPercentage
    security.value.irr = portfolioIRR[allocationETF]

}
function calculateInvestmentPeriod() {
    security.value.yearsToRetirement = props.retirement.yearsToRetirement
}

const unableToDraw = computed(() => {
    const { presentAsset, irr, yearsToRetirement } = security.value
    const { monthlySaving } = props.career
    const noPv = !presentAsset
    const noPmt = !monthlySaving
    const noIY = !irr
    const noN = !yearsToRetirement
    return (noPv && noPmt) || noIY || noN
})

let securityChartInstance = ref<Chart>()
function drawLifeAssetChart() {
    if (unableToDraw.value) {
        return
    }
    const { presentAsset, irr } = security.value
    const { downpayYear, downpay, monthlyRepay, loanTerm, downpayGoal, totalPrice } = props.mortgage
    const { currentYear, inflationRate } = props.config
    const { monthlyContribution } = props.spouse
    const { yearsToRetirement, yearOfRetire, lifeExpectancy } = props.retirement
    const spouseAnnualContribution = monthlyContribution * 12
    const inflatoinRatio = 1 + inflationRate / 100
    let valueModifier = 1

    let pv = presentAsset
    let fv = 0
    const labels: number[] = []
    const principleData: number[] = []
    const securityAppreciationData: number[] = []
    const securityAssetData: number[] = []
    const investingData: number[] = []
    const estateData: number[] = []
    const downpayData: number[] = []
    const mortgageData: number[] = []
    const spouseContribution: number[] = []
    const childExpenseData: number[] = []

    for (let i = 1; i <= yearsToRetirement + lifeExpectancy + 1; i++) {
        const simYear = currentYear + i
        valueModifier *= inflatoinRatio
        /**
         * 影響存量重大事件
         */
        if (simYear === downpayYear) {
            const calculatedDownpay = downpayGoal || downpay
            const inflatedDownpay = calculatedDownpay * valueModifier
            pv -= inflatedDownpay
            downpayData.push(Math.floor(-inflatedDownpay))
        } else {
            downpayData.push(0)
        }

        let calculatedPmt = 0
        /**
         * 不受到通膨影響的PMT
         */
        // 房貸利息影響每月儲蓄
        const mortgageStartYear = downpayYear
        const mortgageEndYear = downpayYear + loanTerm
        let mortgagePmt = 0
        let downpayTotalPrice = 0
        if (mortgageStartYear <= simYear && fv > 0) {
            if (simYear < mortgageEndYear) {
                mortgagePmt = monthlyRepay * 12
            }
            downpayTotalPrice = Math.floor(totalPrice * valueModifier)
        }
        estateData.push(downpayTotalPrice)
        mortgageData.push(Math.floor(-mortgagePmt))
        calculatedPmt -= mortgagePmt
        /**
         * 會受到通膨影響的PMT
         */
        // 執業收支 
        const { monthlySaving } = props.career
        if (simYear <= yearOfRetire) {
            const annualSaving = monthlySaving * 12 * valueModifier
            investingData.push(Math.floor(annualSaving))
            calculatedPmt += annualSaving
        }

        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense } = props.parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const hasFirstBorn = currentYear <= firstBornYear && firstBornYear <= simYear && simYear < firstBornEndYear
        const hasSecondBorn = currentYear <= secondBornYear && secondBornYear && secondBornYear <= simYear && simYear < secondBornEndYear
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

        // 計算複利終值
        const principle = pv
        principleData.push(Math.floor(principle))
        const appreciation = principle * irr / 100
        securityAppreciationData.push(Math.floor(appreciation))
        fv = principle + appreciation
        securityAssetData.push(Math.floor(fv))
        fv += calculatedPmt
        if (fv <= 0) {
            fv = 0
            valueModifier = 0
        }

        labels.push(simYear)
        pv = fv
    }
    const datasets = [
        {
            label: 'ETF',
            data: securityAssetData.slice(0, yearsToRetirement),
        },
        // {
        //     label: '增值',
        //     data: securityAppreciationData.slice(0, yearsToRetirement),
        // },
    ]

    datasets.push({
        label: '定期定額',
        data: investingData,
    })
    const hasChildExpense = childExpenseData.some(value => value !== 0)
    if (hasChildExpense) {
        datasets.push({
            label: '育兒支出',
            data: childExpenseData.slice(0, yearsToRetirement),
        })
    }
    if (downpayYear && downpayYear < yearOfRetire) {
        datasets.push({
            label: '房貸支出',
            data: mortgageData.slice(0, yearsToRetirement),
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
        labels: labels.slice(0, yearsToRetirement)
    }
    clearTimeout(debounceId.value)
    debounceId.value = setTimeout(async () => {
        // 派送訊息
        if (fv <= 0) {
            if (!errorMssage.pending()) {
                errorMssage()
            }
        }
        // 繪圖
        if (securityChartInstance.value) {
            debounceId.value = undefined
            securityChartInstance.value.data = chartData
            securityChartInstance.value.update()
        } else {
            const ctx: any = document.getElementById('securityChart')
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
            securityChartInstance = shallowRef(chartInstance)
        }
    }, 250)
    const exportData = {
        securityAppreciationData,
        securityAssetData,
    }
    return JSON.parse(JSON.stringify(exportData))
}

import { ElMessage, } from 'element-plus'
import { throttle } from './lodash.js'
const errorMssage = throttle(() => {
    ElMessage.error('資產：一貧如洗！')
}, 4000)

defineExpose({
    calculateSecurity,
})
</script>
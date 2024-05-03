<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="資產配置">
                        <el-radio-group v-model="investment.allocationETF" @change="calculateAsset()">
                            <el-radio v-for="(label, key) in config.porfolioLabels" :value="key">{{ label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="投資報酬率">
                        <el-slider v-model="investment.stockPercentage" :marks="investment.allocationQuartileMarks"
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
                    <el-form-item label="每月儲蓄投資" @change="calculateAsset()">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} NTD / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備資產" @change="calculateAsset()">
                        <el-input-number v-model="investment.presentAsset" :min="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="每月房貸利息" @change="calculateAsset()">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} NTD / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas id="assetChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
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
import { ref, computed, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
let assetChartInstance = ref<Chart>()
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
    }
})
const investment = computed(() => {
    return props.modelValue
})
function calculateAsset() {
    const { allocationETF } = investment.value
    if (!allocationETF) {
        return
    }
    const { portfolioIRR, porfolioLabels } = props.config
    investment.value.irr = portfolioIRR[allocationETF]
    const allocationLabels = Object.keys(porfolioLabels)
    const allocationIndex = allocationLabels.findIndex(label => label === allocationETF)
    const stockPercentage = Math.floor((allocationIndex + 1) * 20)
    investment.value.stockPercentage = stockPercentage
    allocationLabels.forEach((label, index) => {
        const irr = portfolioIRR[label]
        const stockPercentage = Math.floor((index + 1) * 20)
        investment.value.allocationQuartileMarks[stockPercentage] = `IRR: ${irr}`
    })
    debounce(() => {
        drawLifeAssetChart()
    })()
}

let investmentChartInstance = ref<Chart>()
function drawLifeAssetChart() {
    const { presentAsset, irr, period } = investment.value
    const irrModifier = 1 + irr / 100
    const { currentYear, inflationRate } = props.config

    const inflatoinRatio = 1 + inflationRate / 100
    let inflationModifier = 1

    let pv = presentAsset
    let fv = 0 // fv = pv * irr + pmt
    const labels: number[] = []
    const datasetData: number[] = []

    for (let year = currentYear; year < currentYear + period; year++) {
        // 影響存量重大事件
        const { buyHouseYear, downPayment, monthlyRepay, loanTerm } = props.mortgage
        if (year === buyHouseYear) {
            pv -= downPayment * inflationModifier
        }
        // 執業收支 
        const { monthlySaving } = props.career
        let calculatedPmt = monthlySaving

        // 育兒開支影響每月儲蓄
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense, spouseMonthlyContribution } = props.parenting
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const hasFirstBorn = currentYear <= firstBornYear && firstBornYear <= year && year < firstBornEndYear
        const hasSecondBorn = currentYear <= secondBornYear && secondBornYear && secondBornYear <= year && year < secondBornEndYear
        if (hasFirstBorn) {
            calculatedPmt -= childAnnualExpense
        }
        if (hasSecondBorn) {
            calculatedPmt -= childAnnualExpense
        }
        if (hasFirstBorn || hasSecondBorn) {
            calculatedPmt += spouseMonthlyContribution * 12
        }

        // 房貸利息影響每月儲蓄
        const mortgageStartYear = buyHouseYear
        const mortgageEndYear = buyHouseYear + loanTerm
        let mortgagePmt = 0
        if (mortgageStartYear <= year && year < mortgageEndYear) {
            mortgagePmt = monthlyRepay * 12
        }

        // 計算複利終值
        fv = pv * irrModifier + (calculatedPmt * inflatoinRatio) + mortgagePmt
        labels.push(year)
        datasetData.push(Math.floor(pv))
        // 參數漸變
        pv = fv
        inflationModifier *= inflatoinRatio
    }
    const chartData = {
        datasets: [
            {
                label: '退休前資產存量',
                data: datasetData,
            }
        ],
        labels
    }

    if (investmentChartInstance.value) {
        investmentChartInstance.value.data = chartData
        investmentChartInstance.value.update()
        return
    }

    const ctx: any = document.getElementById('assetChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData
    })
    investmentChartInstance = shallowRef(chartInstance)
}

const debounceId = ref(null)
function debounce(func, delay = 100) {
    return () => {
        clearTimeout(debounceId.value)
        debounceId.value = setTimeout(() => {
            debounceId.value = undefined
            func()
        }, delay)
    }
}

defineExpose({
    calculateAsset,
});
</script>
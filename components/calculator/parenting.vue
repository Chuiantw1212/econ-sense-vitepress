<template>
    <div>
        <h3 id="_育兒試算" tabindex="-1">育兒試算<a class="header-anchor" href="#育兒試算"
                aria-label="Permalink to &quot;育兒試算&quot;">&ZeroWidthSpace;</a></h3>
        <el-card>
            <el-form label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="月開支(隻/每年)" required>
                            <el-input-number v-model="parenting.childAnnualExpense" :min="0"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="房屋可容納人數">
                            <el-text>{{ parenting.headCount }} 人</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="養到幾歲放生" required>
                            <el-input-number v-model="parenting.independantAge" :min="18"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="第一隻西元年" required>
                            <el-input-number v-model="parenting.firstBornYear" :min="0"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="第二隻西元年">
                            <el-input-number v-model="parenting.secondBornYear" :min="0"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="配偶貢獻/月">
                            <el-input-number v-model="parenting.spouseMonthlyContribution" :min="0"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="壽險已備">
                            <el-input-number v-model="parenting.lifeInsurance" :min="0"
                                @change="calculateParenting($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="資產投報率">
                            <el-text>{{ config.portfolioIRR[investment.allocationETF] }} %</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <canvas v-show="parenting.firstBornYear" id="parentingChart"></canvas>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>
                                因為缺少資料集或是相關api，故此部分資料會較為粗糙。
                            </li>
                            <li>
                                出生西元年設定0則不列入計算
                            </li>
                            <li>
                                保險事故日期假定為長子出生年，且投資報酬率比照原先資產配置
                            </li>
                            <li>
                                扶養成本會受到通膨影響
                            </li>
                            <li>資料來源：
                                <a href="https://www.stat.gov.tw/News_Content.aspx?n=3908&s=231908">
                                    主計總處統計專區 家庭收支調查 統計表 調查報告 平均每戶家庭收支按家庭組織型態別分
                                </a>
                            </li>
                        </ul>
                        <table class="table">
                            <tr>
                                <th>2021年家庭組織</th>
                                <th>雙親</th>
                                <th>核心</th>
                            </tr>
                            <tr>
                                <td>平均每戶人數</td>
                                <td>2.00</td>
                                <td>3.62</td>
                            </tr>
                            <tr>
                                <td>平均每戶就業人數</td>
                                <td>0.70</td>
                                <td>1.85</td>
                            </tr>
                            <tr>
                                <td>消費支出</td>
                                <td>652,023</td>
                                <td>1,028,621</td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    平均每位受扶養者帶來的支出： <br>
                                    (核心消費支出 - 雙親消費支出) / (核心每戶人數 - 核心就業人數) = 212,767
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
import { ref, computed, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
let parentingChartInstance = ref<Chart>()
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
    investment: {
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
})
const parenting = computed(() => {
    return props.modelValue
})
function calculateParenting(options: any = { propagate: true }) {
    const { propagate = true } = options
    debounce(() => {
        drawParentingChart(propagate)
    })(propagate)
}
function drawParentingChart(propagate = true) {
    // 繪製圖
    const { inflationRate } = props.config
    const inflationRatio = 1 + inflationRate / 100
    let inflationModifier = 1
    const { firstBornYear, secondBornYear, independantAge, childAnnualExpense, lifeInsurance, spouseMonthlyContribution } = parenting.value

    // 計算投資報酬率
    const investmentIrr = 1 + props.investment.irr / 100
    // 計算家庭人口
    let headCount = 1 // 自己
    if (spouseMonthlyContribution) {
        headCount += 1
    }
    if (firstBornYear) {
        headCount += 1
    }
    if (secondBornYear) {
        headCount += 1
    }
    parenting.value.headCount = headCount
    const firstBornEndYear = firstBornYear + independantAge
    const secondBornEndYear = secondBornYear + independantAge
    const parentingDuration = Math.max(firstBornYear, secondBornYear) - firstBornYear + independantAge
    const labels: number[] = []
    const firstBornData: number[][] = []
    const secondBornData: number[][] = []
    const lifeInsuranceEquity: number[][] = []
    const lifeInsuranceCash: number[][] = []
    // let cash = lifeInsurance
    let pv = lifeInsurance
    let fv = 0

    for (let i = 0; i < parentingDuration; i++) {
        const simYear = firstBornYear + i
        labels.push(simYear)

        const inflatedChildExpense = Math.floor(childAnnualExpense * inflationModifier)
        let pmt = 0
        const hasFirstBorn = firstBornYear && firstBornYear <= simYear && simYear < firstBornEndYear
        if (hasFirstBorn) {
            pmt -= inflatedChildExpense
            firstBornData.push([0, inflatedChildExpense])
        } else {
            firstBornData.push([0, 0])
        }
        const hasSecondBorn = secondBornYear && secondBornYear <= simYear && simYear < secondBornEndYear
        if (hasSecondBorn) {
            secondBornData.push([-pmt, - (pmt - inflatedChildExpense)]) // 負負得正
            pmt -= inflatedChildExpense
        } else {
            secondBornData.push([0, 0])
        }
        if (hasFirstBorn && hasSecondBorn) {
            pmt += spouseMonthlyContribution
        }

        fv = pv * investmentIrr + pmt
        lifeInsuranceEquity.push([pmt, Math.floor(fv)])
        // cash = cash + pmt
        // lifeInsuranceCash.push([pmt, Math.floor(cash)])

        inflationModifier *= inflationRatio
        pv = fv
    }
    const datasets: {
        label: string,
        data: number[][],
        fill: boolean,
        tension: number
    }[] = []
    const tension = 0.5
    if (firstBornYear) {
        datasets.push({
            label: '長子', // 用"子"來抓資料格式
            data: firstBornData,
            fill: true,
            tension,
        })
    }
    if (secondBornYear) {
        datasets.push({
            label: '次子', // 用"子"來抓資料格式
            data: secondBornData,
            fill: true,
            tension,
        })
    }
    if (lifeInsurance) {
        datasets.push({
            label: '壽險+投資',
            data: lifeInsuranceEquity,
            fill: true,
            tension,
        })
        // datasets.push({
        //     label: '壽險不投資',
        //     data: lifeInsuranceCash,
        //     fill: true,
        //     tension,
        // })
    }

    const data: any = {
        labels,
        datasets,
    }

    // 儲存參數
    if (propagate) {
        emits('update:modelValue', parenting.value)
    }

    if (parentingChartInstance.value) {
        parentingChartInstance.value.data = data
        parentingChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('parentingChart')
    const chartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: showChildAge,
                        footer: showChildExpense
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
            }
        }
    })
    parentingChartInstance = shallowRef(chartInstance)
}
function showChildAge(tooltipItems) {
    const { raw, dataIndex, dataset, } = tooltipItems
    const { label } = dataset
    const { independantAge } = parenting.value
    const secondValue = raw[1]
    if (label.includes('子')) {
        const zeros = dataset.data.slice(0, independantAge).filter(value => value[1] === 0)
        const age = dataIndex - zeros.length + 1
        if (age >= 0) {
            const formatAge = Math.max(0, age)
            return `${dataset.label}: ${formatAge}歲`
        } else {
            return '未出生'
        }
    } else {
        const formatValue = Number(secondValue).toLocaleString()
        return `年末結餘：${formatValue}`
    }
}
function showChildExpense(tooltipItems) {
    const { raw, dataset } = tooltipItems[0]
    const { label } = dataset
    const fisrtValue = raw[0]
    const secondValue = raw[1]
    if (label.includes('子')) {
        const formatExpense = Number(secondValue - fisrtValue).toLocaleString()
        return `支出： ${formatExpense}`
    } else {
        const formatValue = Number(fisrtValue).toLocaleString()
        return `總支出： ${formatValue}`
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
    calculateParenting,
})
</script>
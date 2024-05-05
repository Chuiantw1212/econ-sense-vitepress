<template>
    <el-card>
        <el-form label-width="auto">
            <el-row v-if="estatePrice.totalPrice">
                <el-col :span="18">
                    <el-form-item label="總價">
                        <el-text>= 單價({{ estatePrice.unitPrice }}萬/坪) x 權狀({{ estateSize.floorSize }}坪) = {{
                            Number(estatePrice.totalPrice).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item>
                        <el-button @click="resetTotalPrice()">取消總價試算結果</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="estatePrice.totalPrice">
                <el-col :span="23">
                    <el-form-item label="頭期款占總價">
                        <el-slider v-model="estatePrice.budgetGoal" :marks="downpayMarks" :min="estatePrice.downpayMin"
                            :max="estatePrice.downpayMax" :step="downpayStep" @change="calculateBudgetPeriod()" />
                    </el-form-item>
                </el-col>
            </el-row>
            <br v-if="estatePrice.totalPrice" />
            <el-row>
                <el-col :span="12">
                    <el-form-item label="參考頭期款">
                        <el-input-number v-model="estatePrice.budgetGoal" :min="0" :step="downpayStep"
                            @change="calculateBudgetPeriod()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="!unableToDrawChart" label="預期籌措時間">
                        <el-text>{{ config.currentYear + estatePrice.yearsToDownpay }}
                            ({{ estatePrice.yearsToDownpay }}年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備頭期款">
                        <el-input-number v-model="estatePrice.budget" :min="0" :step="200000"
                            @change="calculateBudgetPeriod()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-show="career.monthlyBasicSalary" label="月實領 - 月支出">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas v-show="!unableToDrawChart" id="savingDownpayChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>
                            假設依靠投資籌措頭期款
                        </li>
                        <li>
                            假設房價增幅速度與通膨持平
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
import { computed, ref, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
const emits = defineEmits(['update:modelValue', 'reset'])
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
    investment: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    mortgage: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    }
})

const downpayMarks = ref({})
const downpayStep = ref(1)
const estatePrice = computed(() => {
    return props.modelValue
})
const unableToDrawChart = computed(() => {
    const { monthlyBasicSalary } = props.career
    const { irr, } = props.investment
    const { budget, budgetGoal } = estatePrice.value
    const noPv = !budget
    const noPmt = !monthlyBasicSalary
    const noN = !irr
    const noFv = !budgetGoal

    return (noPv && noPmt) || noN || noFv
})
function resetTotalPrice() {
    emits('reset')
}

function calculateBudgetPeriod(options: any = { propagate: true }) {
    calculateTotalPrice()
    calculateDownpayMarks()
    const { propagate = true } = options
    debounce(() => {
        drawDownpayChart(propagate)
    })(propagate)
}

function calculateTotalPrice() {
    const { unitPrice, } = estatePrice.value
    const { floorSize, } = props.estateSize
    if (unitPrice && floorSize) {
        const beforeFormatPrice = Number(unitPrice) * Number(floorSize) * 10000
        estatePrice.value.totalPrice = beforeFormatPrice
    }
}
function calculateDownpayMarks() {
    const { totalPrice } = estatePrice.value
    estatePrice.value.downpayMin = 0
    estatePrice.value.downpayMax = totalPrice
    if (totalPrice) {
        downpayStep.value = Math.floor(totalPrice * 0.1)
    } else {
        downpayStep.value = 200000
    }
    const newDownpayMarks = {}
    for (let i = 0; i <= 10; i++) {
        const price = Math.floor(totalPrice / 10 * (i))
        newDownpayMarks[price] = `${i * 10}%`
    }
    downpayMarks.value = newDownpayMarks
}

let downPayChartInstance = ref<Chart>()
function drawDownpayChart(propagate = false) {
    if (unableToDrawChart.value) {
        return
    }
    if (propagate) {
        emits('update:modelValue', estatePrice.value)
    }

    const { irr, } = props.investment
    const { inflationRate, currentYear } = props.config
    const { budget, totalPrice, budgetGoal } = estatePrice.value
    const { monthlyBasicSalary } = props.career
    const irrModifier: number = 1 + irr / 100
    const inflationRatio: number = 1 + inflationRate / 100

    let pv: number = budget
    let pmt: number = 0
    if (monthlyBasicSalary) {
        pmt = props.career.monthlySaving * 12
    }
    let fv: number = 0
    let goal: number = 0

    if (budgetGoal) {
        goal = budgetGoal
    } else {
        goal = Number(totalPrice) * 0.3
    }

    const labels: string[] = []
    const dataSetData: number[] = []
    const estateTotalPrice: number[] = []

    let period = 0
    do {
        pmt *= inflationRatio
        goal *= inflationRatio

        fv = pv * irrModifier + pmt
        labels.push(currentYear + ++period)
        dataSetData.push(Math.floor(fv))
        estateTotalPrice.push(Math.floor(goal))
        pv = fv
    } while (fv < goal)

    calculateYearsToDownpay(period)
    const chartData = {
        labels,
        datasets: [
            {
                label: '已備頭期款',
                data: dataSetData,
            },
            {
                label: '參考頭期款',
                data: estateTotalPrice,
            }
        ],
    }

    if (downPayChartInstance.value) {
        downPayChartInstance.value.data = chartData
        downPayChartInstance.value.update()
        return
    }

    const ctx: any = document.getElementById('savingDownpayChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData
    })
    downPayChartInstance = shallowRef(chartInstance)
}
function calculateYearsToDownpay(years) {
    estatePrice.value.yearsToDownpay = years
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
    calculateBudgetPeriod,
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
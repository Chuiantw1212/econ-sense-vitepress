<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="已備頭期款">
                        <el-input-number v-model="estatePrice.budget" :min="0" :step="200000"
                            @change="calculateTotalPrice($event)" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="定期定額">
                        <el-text>{{ Number(career.monthlySaving).toLocaleString() }} / 月</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="預估頭期款">
                        <el-text>{{ Number(mortgage.downPayment).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="存到頭期款">
                        <el-text>{{ config.currentYear + estatePrice.yearsToDownpay }}
                            ({{ estatePrice.yearsToDownpay }}年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="12">
                    <el-form-item label="預估總價">
                        <el-text>{{ Number(estatePrice.totalPrice).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="存到預估總價30%">
                        <el-text>{{ config.currentYear + estatePrice.yearsToDownpay }}
                            ({{ estatePrice.yearsToDownpay }}年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <canvas id="savingDownpayChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
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

const estatePrice = computed(() => {
    return props.modelValue
})

function calculateTotalPrice(options: any = { propagate: true }) {
    const { propagate = true } = options
    const { unitPrice, } = estatePrice.value
    const { floorSize, } = props.estateSize
    if (!unitPrice || !floorSize) {
        return
    }
    const beforeFormatPrice = Number(unitPrice) * Number(floorSize) * 10000
    estatePrice.value.totalPrice = beforeFormatPrice
    debounce(() => {
        drawDownpayChart(propagate)
    })(propagate)
}

let downPayChartInstance = ref<Chart>()
function drawDownpayChart(propagate = false) {
    const { budget, totalPrice } = estatePrice.value
    const { downPayment } = props.mortgage
    if (propagate) {
        emits('update:modelValue', estatePrice)
    }
    const { irr, } = props.investment
    const { inflationRate, currentYear } = props.config

    const irrModifier = 1 + irr / 100
    const inflationRatio = 1 + inflationRate / 100

    let pv = budget
    let pmt = props.career.monthlySaving * 12
    let fv = 0
    let goal = 0
    if (downPayment) {
        goal = downPayment
    } else {
        goal = Number(totalPrice) * 0.3
    }

    const labels: string[] = []
    const dataSetData: number[] = []
    let estateTotalPrice: number[] = []
    let period = 0
    do {
        pmt *= inflationRatio
        goal *= inflationRatio

        fv = pv * irrModifier + pmt
        labels.push(currentYear + ++period)
        dataSetData.push(Math.floor(fv))
        estateTotalPrice.push(goal)
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
                label: '目標頭期款',
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
    calculateTotalPrice,
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

:deep(.my-label) {
    background: white;
}

:deep(.my-content) {
    background: white;
}
</style>
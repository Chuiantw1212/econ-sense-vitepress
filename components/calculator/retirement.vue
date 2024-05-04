<template>
    <div>
        <h3 id="_退休試算" tabindex="-1">退休試算<a class="header-anchor" href="#退休試算"
                aria-label="Permalink to &quot;退休試算&quot;">&ZeroWidthSpace;</a></h3>
        <el-card>
            <el-form label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="計畫退休年齡">
                            <el-input-number v-model="retirement.age" :min="60" :max="70"
                                @change="calculateRetirement($event)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="距離退休">
                            <el-text>{{ retirement.yearToRetirement }} 年</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退休後餘命">
                            <el-text>{{ retirement.lifeExpectancy }} 年</el-text>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-collapse>
                    <el-collapse-item title="查詢勞保局E化服務系統後設定" :border="true">

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="目前勞保投保年資">
                                    <el-input-number v-model="retirement.insurance.presentSeniority" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="預估屆退年資">
                                    <el-text>{{ retirement.insurance.futureSeniority }} 年</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="預估勞保年金">
                                    <el-text>{{ Number(retirement.insurance.monthlyAnnuity).toLocaleString() }} /
                                        月</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="餘命 x 年金">
                                    <el-text>{{ Number(retirement.insurance.annuitySum).toLocaleString() }}</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="retirement.insurance.survivorPension">
                            <el-col :span="12">
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="預估遺囑年金">
                                    <el-text>{{ Number(retirement.insurance.survivorPension).toLocaleString() }} /
                                        月</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="顧主提繳累計">
                                    <el-input-number v-model="retirement.pension.employerContribution" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="個人提繳累計">
                                    <el-input-number v-model="retirement.pension.employeeContrubution" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="顧主提繳收益">
                                    <el-input-number v-model="retirement.pension.employerContributionIncome" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="個人提繳收益">
                                    <el-input-number v-model="retirement.pension.employeeContrubutionIncome" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="勞退十年收益率">
                                    <el-input-number v-model="retirement.pension.irrOverDecade" :min="0"
                                        @change="calculateRetirement($event)" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="預估勞退總額">
                                    <el-text>{{ Number(retirement.pension.totalValue).toLocaleString() }}</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                            </el-col>
                            <el-col :span="12">
                                <el-form-item v-if="retirement.pension.tax" label="預估勞退稅基">
                                    <el-text>{{ Number(retirement.pension.tax).toLocaleString() }}</el-text>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
                <br />
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="退休品質">
                            <el-radio-group v-model="retirement.qualityLevel" @change="calculateRetirement($event)">
                                <el-radio v-for="(item, key) in config.retirementQuartile" :value="key + 1">{{
                                    item.label
                                    }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23">
                        <el-form-item label="退休月支出">
                            <el-slider v-model="retirement.percentileRank" :marks="expenseQuartileMarks"
                                :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <br />
                <canvas v-show="!unableToDraw" id="pensionChart"></canvas>
            </el-form>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="試算說明" name="1" :border="true">
                        <ul>
                            <li>
                                假設勞退皆為一次領，且領後的再投資報酬率打平勞動基金
                            </li>
                            <li>
                                勞保勞退查詢：<a href="https://edesk.bli.gov.tw/me/#/na/login">勞保局E化服務系統</a>
                            </li>
                            <li>
                                勞退收益率：<a
                                    href="https://www.pension.org.tw/index.php/2018-10-03-15-11-09/2019-02-13-00-01-00"
                                    target="_blank">中華民國退休基金協會</a>
                            </li>
                            <li>退休開支：
                                <a href="https://www.stat.gov.tw/News_Content.aspx?n=3908&s=231908">
                                    主計總處統計專區 家庭收支調查 統計表 調查報告 平均每戶家庭收支按家庭組織型態別分
                                </a>
                            </li>
                        </ul>
                        <table class="table">
                            <tr>
                                <th>
                                    <div>65歲及以上</div>
                                    <div>按戶數五等分位組</div>
                                </th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                            </tr>
                            <tr>
                                <td>平均每戶人數</td>
                                <td>1.62</td>
                                <td>1.98</td>
                                <td>2.22</td>
                                <td>2.64</td>
                                <td>3.07</td>
                            </tr>
                            <tr>
                                <td>消費支出</td>
                                <td>380,421</td>
                                <td>614,536</td>
                                <td>772,725</td>
                                <td>961,375</td>
                                <td>1,335,663</td>
                            </tr>
                            <tr>
                                <td>平均每人消費支出</td>
                                <td>234,827</td>
                                <td>310,371</td>
                                <td>348,074</td>
                                <td>364,157</td>
                                <td>435,069</td>
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
interface IOptionItem {
    label: string,
    value: string | number | boolean,
}
let pensionChartInstance = ref<Chart>()
const emits = defineEmits(['update:modelValue', 'change'])
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
    profile: {
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
    }
})
const expenseQuartileMarks = reactive({})

const retirement = computed(() => {
    return props.modelValue
})
function calculateRetirement(options: any = { propagate: true }) {
    const { propagate = true } = options
    calculateExpenseQuartileMarks()
    calculateRetireLife()
    calculateFutureSeniority()
    calculateInsuranceMonthlyAnnuity()
    calculateRetirementExpense()
    debounce(() => {
        drawRetirementAssetChart(propagate)
    })(propagate)
}
function calculateExpenseQuartileMarks() {
    props.config.retirementQuartile.forEach((item, index) => {
        const { value } = item
        const percentileRank = (index + 1) * 20 - 10
        const retirementMonthlyExpense = Number(value) / 12
        expenseQuartileMarks[percentileRank] = Number(Math.floor(retirementMonthlyExpense)).toLocaleString()
    })
}
function calculateRetireLife() {
    const { age: currentAge, lifeExpectancy } = props.profile
    const { age: retireAge } = retirement.value
    if (currentAge && lifeExpectancy && retireAge) {
        retirement.value.yearToRetirement = retireAge - currentAge
        const rawNumber = lifeExpectancy - retirement.value.yearToRetirement
        const maxZero = Math.max(0, rawNumber)
        retirement.value.lifeExpectancy = props.config.toFixed(maxZero)
    }
}
function calculateFutureSeniority() {
    const { presentSeniority } = retirement.value.insurance
    const rawNumber = presentSeniority + retirement.value.age - props.profile.age
    retirement.value.insurance.futureSeniority = Math.floor(rawNumber)
}
function calculateInsuranceMonthlyAnnuity() { // presentSeniority
    const { lifeExpectancy, age } = retirement.value
    const { presentSeniority, futureSeniority, } = retirement.value.insurance
    const { salary } = props.career.insurance
    if (!age || !futureSeniority || !salary) {
        return
    }
    const ageModifier: number = 1 + (Number(age) - 65) * 0.04
    const formulaOne: number = (Number(salary) * Number(futureSeniority) * 0.775 / 100 + 3000) * ageModifier
    const formulaTwo: number = (Number(salary) * Number(futureSeniority) * 1.55 / 100) * ageModifier
    retirement.value.insurance.monthlyAnnuity = Math.floor(Math.max(formulaOne, formulaTwo))
    if (presentSeniority >= 15) { // 遺囑年金 https://www.bli.gov.tw/0007867.html
        retirement.value.insurance.survivorPension = Math.floor(retirement.value.insurance.monthlyAnnuity / 2)
    } else {
        retirement.value.insurance.survivorPension = 0
    }
    if (lifeExpectancy) { // 勞保年金請領總和
        retirement.value.insurance.annuitySum = Math.floor(retirement.value.insurance.monthlyAnnuity * 12 * Number(lifeExpectancy))
    }
}
function calculateRetirementExpense() {
    const { qualityLevel } = retirement.value
    if (!qualityLevel || !props.config.retirementQuartile.length) {
        return
    }
    retirement.value.percentileRank = qualityLevel * 20 - 10
    const selectedItem: IOptionItem = props.config.retirementQuartile[qualityLevel - 1]
    retirement.value.annualExpense = Number(selectedItem.value)
}

const unableToDraw = computed(() => {
    const { monthlyContribution } = props.career.pension
    const {
        irrOverDecade
    } = retirement.value.pension
    const {
        yearToRetirement,
        lifeExpectancy,
        annualExpense,
    } = retirement.value
    const {
        monthlyAnnuity,
    } = retirement.value.insurance
    const noBefore = !monthlyContribution || !irrOverDecade || !yearToRetirement
    const noAfter = !lifeExpectancy || !annualExpense || !monthlyAnnuity
    return noBefore || noAfter
})
async function drawRetirementAssetChart(propagate = false) {
    if (unableToDraw.value) {
        return
    }
    // 常數參數
    const {
        employerContribution,
        employeeContrubution,
        employerContributionIncome,
        employeeContrubutionIncome,
        irrOverDecade
    } = retirement.value.pension
    const { monthlyContribution } = props.career.pension
    const {
        yearToRetirement,
        lifeExpectancy,
        annualExpense,
    } = retirement.value
    const {
        monthlyAnnuity,
    } = retirement.value.insurance

    // 計算資料
    const inflationRate = 1 + props.config.inflationRate / 100
    let inflationModifier = 1

    let pv = employerContribution + employeeContrubution + employerContributionIncome + employeeContrubutionIncome
    const n = yearToRetirement
    const pensionContribution = monthlyContribution * 12
    const pensionIrr = 1 + (irrOverDecade / 100)
    let fv = 0 // fv = pv * n + pmt

    const labels: number[] = []
    const datasetData: number[] = []

    // 退休前資產累積
    for (let i = 0; i < n; i++) {
        const calculatedYear = props.config.currentYear + i
        labels.push(calculatedYear)

        const pmt = pensionContribution * inflationModifier
        fv = Math.floor(pv * pensionIrr + pmt)
        datasetData.push(Math.floor(fv))

        pv = fv
        inflationModifier *= inflationRate
    }
    calculatePensionFinalValue(fv)

    // 退休後退休支出
    let insuranceAnnuityInflationModifier = 1
    for (let i = 0; i < lifeExpectancy; i++) {
        inflationModifier *= inflationRate
        insuranceAnnuityInflationModifier *= inflationRate

        const annutalAnnuity = monthlyAnnuity * 12 * insuranceAnnuityInflationModifier
        const inflatedAnnualExpense = annualExpense * inflationModifier
        const pmt = annutalAnnuity - inflatedAnnualExpense

        fv = Math.floor(pv * pensionIrr + pmt)
        const calculatedYear = props.config.currentYear + n + i
        labels.push(calculatedYear)
        datasetData.push(Math.floor(fv))
        pv = fv
    }
    const chartData = {
        datasets: [
            {
                label: '退休金存量',
                data: datasetData,
            }
        ],
        labels
    }
    // 儲存參數
    if (propagate) {
        emits('update:modelValue', retirement.value)
    }
    // 繪圖
    if (pensionChartInstance.value) {
        pensionChartInstance.value.data = chartData
        pensionChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('pensionChart')
    const chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData
    })
    pensionChartInstance = shallowRef(chartInstance)
}
function calculatePensionFinalValue(fv = 0) {
    retirement.value.pension.totalValue = Number(fv)
    const { futureSeniority } = retirement.value.insurance
    const taxFreeLevel = 19.8 * 10000 * futureSeniority
    const taxHalfLevel = 39.8 * 10000 * futureSeniority
    let taxBasis = retirement.value.pension.totalValue
    taxBasis -= taxFreeLevel
    const taxHalf = Math.max(0, taxBasis) / 2
    taxBasis -= taxHalfLevel
    const taxFull = Math.max(0, taxBasis) / 2
    retirement.value.pension.tax = Math.floor(taxHalf + taxFull)
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
    calculateRetirement,
});
</script>
<template>
    <el-card>
        <el-form label-width="auto">
            <el-row v-if="isFormDisabled">
                <el-col>
                    <el-form-item label="表單開放前提">
                        <el-text type="danger">
                            填寫基本資料、職業試算
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="計畫退休年齡">
                        <el-input-number v-model="retirement.age" :min="60" :max="70" :disabled="isFormDisabled"
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
                <el-collapse-item :title="detailTitle[profile.careerInsuranceType]" :disabled="isFormDisabled">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="目前投保年資">
                                <el-input-number v-model="retirement.insurance.presentSeniority" :min="0"
                                    @change="calculateRetirement()" />
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
                            <el-form-item label="請領方式">
                                <econSelect v-model="retirement.pension.type" @change="calculateRetirement()"
                                    style="width: 130px" :options="cilvilServantRetireOptions">
                                </econSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="每月年金">
                                <el-text v-if="['employee', 'entrepreneur'].includes(profile.careerInsuranceType)">{{
                Number(retirement.insurance.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                                <el-text v-if="['civilServant',].includes(profile.careerInsuranceType)">{{
                Number(retirement.pension.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="餘命 x 年金現值">
                                <el-text>{{ Number(retirement.annuitySum).toLocaleString() }}</el-text>
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
                            <el-form-item label="強制提繳累計">
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
                            <el-form-item label="強制提繳收益">
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
                            <el-form-item label="預估一次退總額">
                                <el-text>{{ Number(retirement.pension.lumpSum).toLocaleString() }}</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="retirement.pension.tax" label="預估一次退稅基">
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
                        <el-radio-group v-model="retirement.qualityLevel" @change="calculateRetirement($event)"
                            :disabled="isFormDisabled">
                            <el-radio v-for="(item, key) in config.retirementQuartile" :value="key + 1">{{
                item.label
            }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="退休月支出">
                        <el-slider v-model="retirement.percentileRank" :marks="expenseQuartileMarks" :disabled="true" />
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
                            勞退收益率：<a href="https://www.pension.org.tw/index.php/2018-10-03-15-11-09/2019-02-13-00-01-00"
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
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive } from 'vue'
import Chart from 'chart.js/auto';
import econSelect from '../econSelect.vue'
interface IOptionItem {
    label: string,
    value: string | number | boolean,
}
let pensionChartInstance = ref<Chart>()
const activeNames = ref(['1'])
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
const detailTitle = {
    'civilServant': '查詢人事服務網ECPA後設定',
    'employee': '查詢勞保局E化服務系統後設定',
    'entrepreneur': '查詢勞保局E化服務系統後設定',
}
const cilvilServantRetireOptions = [
    {
        label: '一次退休金',
        value: 'lumpSum',
    },
    {
        label: '月退休金',
        value: 'annuity',
    },
    {
        label: '兼領',
        value: 'halfAndHalf',
    }
]
// hooks
const retirement = computed(() => {
    return props.modelValue
})
const isFormDisabled = computed(() => {
    const { lifeExpectancy } = props.profile
    const { monthlyBasicSalary } = props.career
    return !lifeExpectancy || !monthlyBasicSalary
})
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
    const monthlyAnnuity = retirement.value.insurance.monthlyAnnuity || retirement.value.pension.monthlyAnnuity
    const noBefore = !monthlyContribution || !irrOverDecade || !yearToRetirement
    const noAfter = !lifeExpectancy || !annualExpense || !monthlyAnnuity
    return noBefore || noAfter
})
// methods
function calculateRetirement(options: any = { propagate: true }) {
    calculateExpenseQuartileMarks()
    calculateRetireLife()
    calculateFutureSeniority()
    const { careerInsuranceType } = props.profile
    switch (careerInsuranceType) {
        case "employee":
        case "entrepreneur": {
            calculateLaborInsuranceMonthlyAnnuity()
            break;
        }
        case "civilServant": {
            calculateCivilServantRetirement()
            break;
        }
    }
    calculateRetirementExpense()

    const { propagate = true } = options
    debounce(() => {
        drawRetirementAssetChart(propagate)
    })(propagate)
}
function calculateCivilServantRetirement() {
    const { futureSeniority, } = retirement.value.insurance
    const { type, } = retirement.value.pension
    const { salary } = props.career.insurance
    if (!futureSeniority || !salary) {
        return
    }
    /**
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0080034&flno=29
     * 公務人員所具退撫新制實施後任職年資應給與之退休金，依第二十七條所定退休金計算基準與基數內涵，按下列標準計給：
     * 一、一次退休金：按照任職年資，每任職一年，給與一又二分之一個基數，最高三十五年，給與五十三個基數；退休審定總年資超過三十五年者，自第三十六年起，每增加一年，增給一個基數，最高給與六十個基數。其退休年資未滿一年之畸零月數，按畸零月數比率計給；未滿一個月者，以一個月計。
     * 二、月退休金：按照任職年資，每任職一年，照基數內涵百分之二給與，最高三十五年，給與百分之七十；退休審定總年資超過三十五年者，自第三十六年起，每增一年，照基數內涵百分之一給與，最高給與百分之七十五。其退休年資未滿一年之畸零月數，按畸零月數比率計給；未滿一個月者，以一個月計。
     */
    const baseSalary = salary * 2
    let lumpSum = 0
    if (futureSeniority <= 35) {
        lumpSum = 1.5 * futureSeniority
        lumpSum = Math.min(53, lumpSum)
    } else {
        lumpSum = 1.5 * 35
        lumpSum += 1 * (futureSeniority - 35)
        lumpSum = Math.min(60, lumpSum)
    }
    lumpSum *= baseSalary

    let monthlyAnnuity = 0
    let incomeReplacementMaxRatio = 0
    if (futureSeniority <= 35) {
        monthlyAnnuity += 2 * futureSeniority
        // 替代率天花板
        incomeReplacementMaxRatio = 30 + (futureSeniority - 15) * 1.5
    } else {
        monthlyAnnuity += 2 * 35
        monthlyAnnuity += (futureSeniority - 35)
        monthlyAnnuity = Math.min(75, monthlyAnnuity)
        // 替代率天花板
        incomeReplacementMaxRatio = 60 + (futureSeniority - 35) * 0.5
    }
    /**
     * 再計算月退休金
     */
    switch (type) {
        case 'lumpSum': {
            retirement.value.pension.lumpSum = Math.floor(lumpSum)
            retirement.value.pension.monthlyAnnuity = 0
            break;
        }
        case 'annuity': {
            retirement.value.pension.lumpSum = 0
            monthlyAnnuity = Math.min(incomeReplacementMaxRatio, monthlyAnnuity)
            monthlyAnnuity *= baseSalary / 100
            retirement.value.pension.monthlyAnnuity = Math.floor(monthlyAnnuity)
            break;
        }
        case 'halfAndHalf': {
            incomeReplacementMaxRatio /= 2
            monthlyAnnuity = Math.min(incomeReplacementMaxRatio, monthlyAnnuity)
            monthlyAnnuity *= baseSalary / 100
            retirement.value.pension.lumpSum = Math.floor(lumpSum / 2)
            retirement.value.pension.monthlyAnnuity = Math.floor(monthlyAnnuity)
            break;
        }
    }
    const { lifeExpectancy, age } = retirement.value
    const inflationRate = 1 + props.config.inflationRate / 100
    const pvModifier = Math.pow(inflationRate, age - 60)
    retirement.value.annuitySum = Math.floor(monthlyAnnuity * 12 * Number(lifeExpectancy) / pvModifier)
    retirement.value.insurance.annuity = 0 // 避免勞保資料干擾
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
        retirement.value.lifeExpectancy = Number(Number(maxZero).toFixed(2))
    }
}
function calculateFutureSeniority() { // 退休時年資
    const { presentSeniority } = retirement.value.insurance
    const rawNumber = presentSeniority + retirement.value.age - props.profile.age
    retirement.value.insurance.futureSeniority = rawNumber.toFixed(2)
}
function calculateLaborInsuranceMonthlyAnnuity() {
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
        const inflationRate = 1 + props.config.inflationRate / 100
        const pvModifier = Math.pow(inflationRate, age - 60)
        retirement.value.annuitySum = Math.floor(retirement.value.insurance.monthlyAnnuity * 12 * Number(lifeExpectancy) / pvModifier)
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
    const monthlyAnnuity = retirement.value.insurance.monthlyAnnuity || retirement.value.pension.monthlyAnnuity

    // 計算資料
    const inflationRate = 1 + props.config.inflationRate / 100
    let inflationModifier = 1

    let pv = employerContribution + employeeContrubution + employerContributionIncome + employeeContrubutionIncome
    const n = yearToRetirement
    const pensionContribution = monthlyContribution * 12
    const pensionIrr = 1 + (irrOverDecade / 100)
    let fv = 0 // fv = pv * n + pmt

    const labels: number[] = []
    const pensionData: number[][] = []
    const annualAnnuityData: number[][] = []
    const retirementAnnualExpenseData: number[][] = []

    // 退休前資產累積
    for (let i = 0; i < n; i++) {
        const calculatedYear = props.config.currentYear + i
        labels.push(calculatedYear)
        annualAnnuityData.push([0, 0])
        retirementAnnualExpenseData.push([0, 0])

        const pmt = pensionContribution * inflationModifier
        fv = Math.floor(pv * pensionIrr + pmt)
        pensionData.push([0, Math.floor(fv)])

        pv = fv
        inflationModifier *= inflationRate
    }

    const { careerInsuranceType } = props.profile
    if (['employee', 'entrepreneur'].includes(careerInsuranceType)) {
        calculateLaborPensionLumpSum(fv)
    }

    // 退休後退休支出
    let insuranceAnnuityInflationModifier = 1
    for (let i = 0; i < lifeExpectancy; i++) {
        inflationModifier *= inflationRate
        insuranceAnnuityInflationModifier *= inflationRate

        const annutalAnnuity = Math.floor(monthlyAnnuity * 12 * insuranceAnnuityInflationModifier)
        annualAnnuityData.push([0, annutalAnnuity])
        const inflatedAnnualExpense = Math.floor(annualExpense * inflationModifier)
        retirementAnnualExpenseData.push([0, -inflatedAnnualExpense])
        const pmt = annutalAnnuity - inflatedAnnualExpense

        fv = Math.floor(pv * pensionIrr + pmt)
        fv = Math.max(0, fv)
        pensionData.push([0, Math.floor(fv)])
        const calculatedYear = props.config.currentYear + n + i
        labels.push(calculatedYear)
        pv = fv
    }
    // 繪圖
    const tension = 0.5
    const chartData: any = {
        datasets: [
            {
                label: '勞退一次領+投資',
                data: pensionData,
                fill: true,
                tension,
            },
            {
                label: '勞保年金',
                data: annualAnnuityData,
                fill: true,
                tension,
            },
            {
                label: '退休支出',
                data: retirementAnnualExpenseData,
                fill: true,
                tension,
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
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    stacked: true,
                },
                // y: { // 要部份stacked，部分overlap
                //     stacked: true,
                // },
            }
        }
    })
    pensionChartInstance = shallowRef(chartInstance)
}
function calculateLaborPensionLumpSum(fv = 0) {
    retirement.value.pension.lumpSum = Number(fv)
    const { futureSeniority } = retirement.value.insurance
    const taxFreeLevel = 19.8 * 10000 * futureSeniority
    const taxHalfLevel = 39.8 * 10000 * futureSeniority
    let taxBasis = retirement.value.pension.lumpSum
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
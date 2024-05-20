<template>
    <el-card>
        <el-form label-width="auto">
            <el-row v-show="isFormDisabled">
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
                        <el-input-number v-model="retirement.age" :min="Math.max(60, profile.age)" :max="70"
                            :disabled="isFormDisabled" @change="calculateRetirement($event)" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="退休年">
                        <el-text>{{ retirement.yearOfRetire }} ({{ retirement.yearsToRetirement }} 年後)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="退休後餘命">
                        <el-text>{{ retirement.lifeExpectancy }} 年
                            ({{ Math.ceil(retirement.yearOfRetire + retirement.lifeExpectancy) }})</el-text>
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
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="每月年金">
                                <el-text>{{
                                    Number(retirement.insurance.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="餘命x年金現值">
                                <el-text>{{ Number(retirement.annuitySum).toLocaleString() }}</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="雇主提繳累計">
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
                            <el-form-item label="雇主提繳收益">
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
                            <el-form-item label="退休金IRR">
                                <el-input-number v-model="retirement.pension.irrOverDecade" :min="0"
                                    @change="calculateRetirement($event)" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一次領總額">
                                <el-text>{{ Number(retirement.pension.lumpsum).toLocaleString() }}</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一次領稅基">
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
                            假設勞退皆為一次領，且領後的再投資報酬率打平相關職業退休基金
                        </li>
                        <!-- <li>
                            餘命x年金現值是為了讓大家理解延後退休並不如第一印象中的"賺"，只有提早領的年金才會被通膨調整
                        </li> -->
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
const emits = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    profile: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    career: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    estate: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    }
})
const expenseQuartileMarks = reactive({})
const detailTitle = {
    'civilServant': '查詢人事服務網ECPA後設定',
    'employee': '查詢勞保局E化服務系統後設定',
    'entrepreneur': '查詢勞保局E化服務系統後設定',
}
const cilvilServantPensionOptions = [
    {
        label: '一次退休金',
        value: 'lumpsum',
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
const cilvilServantInsuranceOptions = [
    {
        label: '一次養老給付',
        value: 'lumpsum',
    },
    {
        label: '養老年金',
        value: 'annuity',
    },
]
// hooks
const retirement = computed(() => {
    return props.modelValue
})
const isFormDisabled = computed(() => {
    const { monthlyBasicSalary, } = props.career
    const { careerInsuranceType } = props.profile
    return !monthlyBasicSalary || !careerInsuranceType
})
const unableToDraw = computed(() => {
    const { monthlyBasicSalary } = props.career
    const {
        irrOverDecade
    } = retirement.value.pension
    const {
        annualExpense,
    } = retirement.value
    const noIncome = !monthlyBasicSalary
    const noBefore = !irrOverDecade
    const noAfter = !annualExpense
    return noIncome || noBefore || noAfter
})
// methods
async function calculateRetirement(options: any = { propagate: true }) {
    resetData()
    calculateExpenseQuartileMarks()
    const { propagate = true } = options
    await calculateRetireLife()
    calculateFutureSeniority()
    const { careerInsuranceType } = props.profile
    switch (careerInsuranceType) {
        case "employee":
        case "entrepreneur": {
            calculateLaborInsuranceMonthlyAnnuity()
            calculateAnnuitySum()
            calculateLaborSurvivorAnnuity()
            break;
        }
        case "civilServant": {
            calculateCivilServantInsurance()
            calculateAnnuitySum()
            break;
        }
    }
    calculateRetirementExpense()
    const pensionLumpSumData = await drawRetirementAssetChart()
    if (propagate) {
        emits('update:modelValue', retirement.value)
    }
    return pensionLumpSumData
}
function resetData() {
    retirement.value.insurance.annuity = 0
    retirement.value.insurance.survivorAnnuity = 0
    retirement.value.insurance.incomeReplacementMaxRatio = 0
    retirement.value.insurance.benefitRatioEstimated = 0
    retirement.value.insurance.benefitRatio = 0
    retirement.value.insurance.monthlyAnnuity = 0
    retirement.value.insurance.lumpsum = 0
    retirement.value.pension.tax = 0
    retirement.value.pension.monthlyAnnuity = 0
    retirement.value.pension.lumpsum = 0
}
function calculateCivilServantInsurance(): number {
    /**
     * 公保法第16條
     * 第二項
     * 一、一次養老給付：保險年資每滿一年，給付一點二個月；最高以給付四十二個月為限。但辦理優惠存款者，最高以三十六個月為限。
     * 二、養老年金給付：保險年資每滿一年，在給付率百分之零點七五（以下簡稱基本年金率）至百分之一點三（以下簡稱上限年金率）之間核給養老年金給付，
     * 最高採計三十五年；其總給付率最高為百分之四十五點五。但中華民國一百十二年七月一日以後初次參加本保險者，最高採計四十年；其總給付率最高為百分之五十二。
     *     
     * 第三項
     * 依第一項規定請領養老給付之被保險人符合下列條件之一者，給與養老年金給付：
     * 一、繳付本保險保險費滿十五年以上且年滿六十五歲。
     * 二、繳付本保險保險費滿二十年以上且年滿六十歲。
     * 三、繳付本保險保險費滿三十年以上且年滿五十五歲。
     * 
     * 第八項
     * 依第四項規定按基本年金率計給養老年金給付之被保險人，其每月退休（職、伍）給與，加計每月可領養老年金給付之總和，
     * 不得超過其最後在職加保投保俸（薪）額二倍之百分之八十；
     * 超過者，應調降公保養老年金給付，或得選擇不請領養老年金給付而請領一次養老給付；一經領受，不得變更。
     *
     * 第十三項
     * 第八項之給付率自公務人員及公立學校教職員退撫法律制定通過後，另行調整。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=16
     */
    /**
     * 公保法第17條
     * 
     * 第一項
     * 被保險人依前條第三項規定請領養老年金給付者，其每月退休（職、伍）給與，加計每月可領養老年金給付之總和，
     * 不得超過其最後在職加保投保俸（薪）額二倍之一定百分比（以下簡稱退休年金給與上限）。
     * 一、保險年資十五年以下，每滿一年，以百分之二計；第十六年起，每滿一年，以百分之二點五計，最高增至百分之八十。
     * 二、保險年資未滿六個月者，以六個月計；滿六個月以上未滿一年者，以一年計。
     * 
     * 第四項 (EN：月退一次領仍可能吃掉養老給付)
     * 第一項所定每月退休（職、伍）給與，包含下列內涵：
     * 一、被保險人支（兼）領之月退休（職、伍）給與或類此之非一次性離退給與。
     * 二、被保險人支（兼）領之一次性退休（職、伍）給與、資遣給與、年資結算金或類此之一次性離退給與，應依平均餘命，按月攤提併入每月退休給與計算。
     * 三、被保險人依規定領有其支（兼）領一次退休（職、伍）給與之每月優惠存款利息。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=17
     */
    /**
     * 公保法第18條
     * 被保險人保險年資滿十五年，未符合第十六條養老年金給付請領資格者，得提前五年請領養老年金給付，每提前一年，依第十六條規定計算之給付金額減給百分之四，最多減給百分之二十。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=18
     */
    /**
     * 公保法第19條
     * 依第十七條規定計得之每月可領養老年金給付，其保險年資每滿一年之給付率低於基本年金率時，仍應按基本年金率計給；超過上限年金率時，應按上限年金率計給。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=19
     */
    const { age, yearsToRetirement } = retirement.value
    const { salary } = props.career.insurance
    const { futureSeniority, } = retirement.value.insurance
    const {
        employerContribution,
        employeeContrubution,
        employerContributionIncome,
        employeeContrubutionIncome,
        irrOverDecade,
    } = retirement.value.pension
    if (futureSeniority < 15) {
        return 0
    }
    let monthlyAnnuity = 0
    // 計算公保一次領或年金
    const baseSalary = salary * 2
    const seniorityOptions = [30, 20, 15]
    const ageIndex = seniorityOptions.find(seniority => {
        return seniority >= futureSeniority
    }) || 2
    const ageOptions = [55, 60, 65]
    const standardAge = ageOptions[ageIndex]
    let ageModifier: number = 1 + (Number(age) - standardAge) * 0.04
    ageModifier = Math.min(1.2, ageModifier)
    ageModifier = Math.max(0.8, ageModifier)
    // 計算年金替代率上限
    let incomeReplacementMaxRatio = 0
    if (futureSeniority <= 15) {
        incomeReplacementMaxRatio = futureSeniority * 2
    } else {
        const maxFutureSeniority = Math.min(40, futureSeniority)
        incomeReplacementMaxRatio = 30 + (maxFutureSeniority - 15) * 2.5
    }
    // 用退休金一次領推估公保年金給付上限
    const pensionPV = employerContribution + employeeContrubution + employerContributionIncome + employeeContrubutionIncome
    const endPerformance = Math.pow((1 + irrOverDecade / 100), yearsToRetirement)
    const pensionFV = pensionPV * endPerformance
    const pensionIncomeReplacementRatio = calculateLumpsumIncomeReplacementRatio(pensionFV)
    incomeReplacementMaxRatio -= pensionIncomeReplacementRatio
    retirement.value.insurance.incomeReplacementMaxRatio = incomeReplacementMaxRatio
    // 用替代率上限回推給付率並增減給
    const insuranceAnnuityMax = incomeReplacementMaxRatio * baseSalary
    let benefitRatio = insuranceAnnuityMax / baseSalary / futureSeniority
    retirement.value.insurance.benefitRatioEstimated = benefitRatio
    benefitRatio = Math.max(0.75, benefitRatio)
    benefitRatio = Math.min(1.3, benefitRatio)
    retirement.value.insurance.benefitRatio = benefitRatio
    monthlyAnnuity = Math.round(baseSalary * futureSeniority * benefitRatio / 100 * ageModifier)
    retirement.value.insurance.monthlyAnnuity = monthlyAnnuity
}
function calculateLumpsumIncomeReplacementRatio(lumpsum) {
    const { salary } = props.career.insurance
    const { lifeExpectancy } = retirement.value
    const baseSalary = salary * 2
    const lifeExpectancyMonths = lifeExpectancy * 12
    const lumpSumPerMonth = lumpsum / lifeExpectancyMonths
    const lumpsumIncomeReplacementRatio = lumpSumPerMonth / baseSalary * 100
    retirement.value.pension.lumpsumIncomeReplacementRatio = lumpsumIncomeReplacementRatio
    return lumpsumIncomeReplacementRatio
}
function calculateExpenseQuartileMarks() {
    props.config.retirementQuartile.forEach((item, index) => {
        const { value } = item
        const percentileRank = (index + 1) * 20 - 10
        const retirementMonthlyExpense = Number(value) / 12
        expenseQuartileMarks[percentileRank] = Number(Math.floor(retirementMonthlyExpense)).toLocaleString()
    })
}

const oldRetireAge = ref(0)
const oldCurrentAge = ref(0)
const oldGender = ref(null)
async function calculateRetireLife() {
    const { age: currentAge, gender } = props.profile
    const { age: retireAge } = retirement.value
    const { currentYear } = props.config
    if (!currentAge || !retireAge) {
        return
    }
    const sameAge = currentAge === oldCurrentAge.value
    const sameRetire = retireAge === oldRetireAge.value
    const sameGender = gender === oldGender.value
    if (sameAge && sameRetire && sameGender) {
        return
    }
    // debounce
    oldRetireAge.value = retireAge
    oldCurrentAge.value = currentAge
    oldGender.value = gender
    // debounce end
    const yearsToRetirement = retireAge - currentAge
    retirement.value.yearsToRetirement = yearsToRetirement
    const yearOfRetire = currentYear + yearsToRetirement
    retirement.value.yearOfRetire = yearOfRetire
    const { VITE_BASE_URL } = import.meta.env
    const res = await fetch(`${VITE_BASE_URL}/calculate/lifeExpectancy`, {
        method: 'post',
        body: JSON.stringify({
            ceYear: yearOfRetire,
            age: retireAge,
            gender,
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    const lifeExpectancy = await res.json()
    retirement.value.lifeExpectancy = lifeExpectancy
    retirement.value.longevity = currentAge + yearsToRetirement + lifeExpectancy
}
function calculateFutureSeniority() { // 退休時年資
    const { presentSeniority } = retirement.value.insurance
    const futureSeniority = presentSeniority + retirement.value.age - props.profile.age
    retirement.value.insurance.futureSeniority = futureSeniority
}
function calculateLaborInsuranceMonthlyAnnuity(): number {
    const { lifeExpectancy, age } = retirement.value
    const { futureSeniority, } = retirement.value.insurance
    const { salary } = props.career.insurance
    if (!age || !futureSeniority || !salary) {
        return 0
    }
    let ageModifier: number = 1 + (Number(age) - 65) * 0.04
    ageModifier = Math.min(1.2, ageModifier)
    ageModifier = Math.max(0.8, ageModifier)
    const formulaOne: number = (Number(salary) * Number(futureSeniority) * 0.775 / 100 + 3000) * ageModifier
    const formulaTwo: number = (Number(salary) * Number(futureSeniority) * 1.55 / 100) * ageModifier
    const monthlyAnnuity = Math.floor(Math.max(formulaOne, formulaTwo))
    retirement.value.insurance.monthlyAnnuity = monthlyAnnuity
}
function calculateAnnuitySum() {
    const { lifeExpectancy, age } = retirement.value
    const { monthlyAnnuity } = retirement.value.insurance
    if (lifeExpectancy) { // 勞保年金請領總和
        const inflationRate = 1 + props.config.inflationRate / 100
        const pvModifier = Math.pow(inflationRate, age - 60)
        retirement.value.annuitySum = Math.floor(monthlyAnnuity * 12 * Number(lifeExpectancy) / pvModifier)
    }
    return monthlyAnnuity
}
function calculateLaborSurvivorAnnuity() {
    const { presentSeniority, } = retirement.value.insurance
    const { salary } = props.career.insurance
    if (!presentSeniority || !salary) {
        return
    }
    let survivorAnnuity: number = (Number(salary) * Number(presentSeniority) * 1.55 / 100)
    survivorAnnuity = Math.max(3000, survivorAnnuity)
    retirement.value.insurance.survivorAnnuity = Math.floor(survivorAnnuity)
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

const debounceId = ref()
async function drawRetirementAssetChart() {
    if (unableToDraw.value) {
        return
    }
    // 常數參數
    const { monthlyContribution = 0, monthlyContributionSelf = 0 } = props.career.pension
    const { currentYear } = props.config
    const {
        yearsToRetirement,
        lifeExpectancy,
        annualExpense,
        insurance,
        pension,
    } = retirement.value
    const {
        employerContribution,
        employeeContrubution,
        employerContributionIncome,
        employeeContrubutionIncome,
        irrOverDecade,
        // lumpsum,
    } = retirement.value.pension
    const monthlyAnnuity = Number(insurance.monthlyAnnuity) + Number(pension.monthlyAnnuity)
    const { downpayYear, loanTerm, monthlyRepay } = props.estate
    const loanEndYear = downpayYear + loanTerm
    // 計算資料
    const inflationRate = 1 + props.config.inflationRate / 100
    let inflationModifier = 1

    let pv = 0
    const n = yearsToRetirement
    const pensionContribution = (monthlyContribution + monthlyContributionSelf) * 12
    const pensionIrr = 1 + (irrOverDecade / 100)
    let fv = 0

    const labels: number[] = []
    const pensionLumpSumData: number[] = []
    const annualAnnuityData: number[] = []
    const retirementAnnualExpenseData: number[] = []
    const estateData: number[] = []

    pv = employerContribution + employeeContrubution + employerContributionIncome + employeeContrubutionIncome
    // 退休前資產累積
    for (let i = 1; i <= n; i++) {
        const pmt = pensionContribution * inflationModifier
        pv *= pensionIrr
        fv = Math.floor(pv + pmt)
        // /** 驗算勞動退休金累積可用 */
        // pensionLumpSumData.push(Math.floor(fv))
        // estateData.push(0)
        // const calculatedYear = currentYear + i
        // labels.push(calculatedYear)
        // annualAnnuityData.push(0)
        // retirementAnnualExpenseData.push(0)
        // 更新變數
        inflationModifier *= inflationRate
        pv = fv
    }

    calculatePensionLumpsumTax(fv)

    // 退休後退休支出
    let insuranceAnnuityInflationModifier = 1
    let pmt = 0
    let inflatedAnnualExpense = 0
    for (let i = 1; i <= lifeExpectancy + 1; i++) {
        // 更新參數
        inflationModifier *= inflationRate
        insuranceAnnuityInflationModifier *= inflationRate
        // 現值增值
        fv = Math.floor(pv * pensionIrr)
        pensionLumpSumData.push(Math.floor(fv))
        // 年金收入計算
        const annutalAnnuity = Math.floor(monthlyAnnuity * 12 * insuranceAnnuityInflationModifier)
        pmt = annutalAnnuity
        annualAnnuityData.push(annutalAnnuity)
        // 退休生活計算
        inflatedAnnualExpense = Math.floor(annualExpense * inflationModifier)
        retirementAnnualExpenseData.push(-inflatedAnnualExpense)
        pmt -= inflatedAnnualExpense
        // 未還完的房貸支出
        const simYear = currentYear + yearsToRetirement + i
        const annualRepay = monthlyRepay * 12
        if (loanEndYear >= simYear) {
            pmt -= annualRepay
            estateData.push(-annualRepay)
        } else {
            estateData.push(0)
        }
        // 更新參數
        fv = Math.max(0, fv + pmt)
        if (fv <= 0) {
            fv = 0
            inflationModifier = 0
            insuranceAnnuityInflationModifier = 0
        }
        const calculatedYear = currentYear + n + i
        labels.push(calculatedYear)
        pv = fv
    }
    // 繪圖
    const tension = 0.5
    const datasets = [
        {
            label: '一次領',
            data: pensionLumpSumData,
            fill: true,
            tension,
        },
        {
            label: '年金',
            data: annualAnnuityData,
            fill: true,
            tension,
        },
        {
            label: '退休支出',
            data: retirementAnnualExpenseData,
            fill: true,
            tension,
        },
    ]
    const hasMortgage = estateData.some(data => data)
    if (hasMortgage) {
        datasets.push({
            label: '房貸支出',
            data: estateData,
            fill: true,
            tension,
        })
    }
    const chartData: any = {
        datasets,
        labels
    }
    clearTimeout(debounceId.value)
    debounceId.value = setTimeout(() => {
        // 錯誤訊息
        if (fv <= 0) {
            if (!errorMssage.pending()) {
                errorMssage()
            }
        }
        // 繪圖
        if (pensionChartInstance.value) {
            pensionChartInstance.value.data = chartData
            pensionChartInstance.value.update()
        } else {
            const ctx: any = document.getElementById('pensionChart')
            const chartInstance = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: { // 要部份stacked，部分overlap
                            stacked: true,
                        },
                    }
                }
            })
            pensionChartInstance = shallowRef(chartInstance)
        }
    }, 250)
    return {
        pensionLumpSumData: JSON.parse(JSON.stringify(pensionLumpSumData))
    }
}

function calculatePensionLumpsumTax(fv = 0) {
    retirement.value.pension.lumpsum = Number(fv)
    const { futureSeniority } = retirement.value.insurance
    const taxFreeLevel = 19.8 * 10000 * futureSeniority
    const taxHalfLevel = 39.8 * 10000 * futureSeniority
    let taxBasis = retirement.value.pension.lumpsum
    taxBasis -= taxFreeLevel
    const taxHalf = Math.max(0, taxBasis) / 2
    taxBasis -= taxHalfLevel
    const taxFull = Math.max(0, taxBasis) / 2
    retirement.value.pension.tax = Math.floor(taxHalf + taxFull)
}

import { ElMessage, } from 'element-plus'
import { throttle, } from './lodash.js'
const errorMssage = throttle(() => {
    ElMessage.error('退休：晚節不保！')
}, 4000)

defineExpose({
    calculateRetirement,
});
</script>
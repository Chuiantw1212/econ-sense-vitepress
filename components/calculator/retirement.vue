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
                        <el-text>{{ retirement.lifeExpectancy }} 年</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-collapse>
                <el-collapse-item v-if="['civilServant',].includes(profile.careerInsuranceType)" title="查詢人事服務網ECPA後設定"
                    :disabled="isFormDisabled">
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
                            <el-form-item label="退休金請領方式">
                                <econSelect v-model="retirement.pension.requestType" @change="calculateRetirement()"
                                    style="width: 130px" :options="cilvilServantPensionOptions">
                                </econSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一次領總額">
                                <el-text v-if="retirement.pension.requestType !== 'annuity'">{{
                Number(retirement.pension.lumpSum
                ).toLocaleString() }}
                                </el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <!-- <el-form-item label="請領時餘命">
                                <el-text>{{
                Number(retirement.lifeExpectancy).toLocaleString() }} 年</el-text>
                            </el-form-item> -->
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一次領換算替代率">
                                <el-text>{{
                Number(retirement.pension.incomeReplacementRatio).toFixed(1) }} %</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="retirement.pension.requestType !== 'lumpSum'">
                        <el-col :span="12">
                            <el-form-item label="退休金替代率上限">
                                <el-text>{{
                Number(retirement.pension.incomeReplacementMaxRatio).toLocaleString() }} %</el-text>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="每月退休金">
                                <el-text>{{
                Number(retirement.pension.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="公保請領方式">
                                <econSelect v-model="retirement.insurance.requestType" @change="calculateRetirement()"
                                    style="width: 130px" :options="cilvilServantInsuranceOptions">
                                </econSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="公保替代率餘額">
                                <el-text>{{
                Number(retirement.insurance.incomeReplacementMaxRatio).toFixed(1) }}
                                    %</el-text>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="每月養老給付">
                                <el-text>{{
                Number(retirement.pension.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="公保給付率">
                                <el-text>
                                    {{
                Number(retirement.insurance.benefitRatio).toFixed(1) }}
                                    ({{ Number(retirement.insurance.benefitRatioEstimated).toFixed(1) }})
                                    %</el-text>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="每月養老給付">
                                <el-text>{{
                Number(retirement.pension.monthlyAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item v-if="['employee', 'entrepreneur'].includes(profile.careerInsuranceType)"
                    title="查詢勞保局E化服務系統後設定" :disabled="isFormDisabled">
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
                            <el-form-item label="餘命 x 年金現值">
                                <el-text>{{ Number(retirement.annuitySum).toLocaleString() }}</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="parenting.firstBornYear">
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="預估遺囑年金">
                                <el-text>{{ Number(retirement.insurance.survivorAnnuity).toLocaleString() }} /
                                    月</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template>
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
                    </template>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item v-if="['employee', 'entrepreneur'].includes(profile.careerInsuranceType)"
                                label="退休金IRR">
                                <el-input-number v-model="retirement.pension.irrOverDecade" :min="0"
                                    @change="calculateRetirement($event)" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="一次領總額">
                                <el-text>{{ Number(retirement.pension.lumpSum).toLocaleString() }}</el-text>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="retirement.pension.tax" label="一次領稅基">
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
const cilvilServantInsuranceOptions = [
    {
        label: '一次養老給付',
        value: 'lumpSum',
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
    const { monthlyBasicSalary } = props.career
    return !monthlyBasicSalary
})
const unableToDraw = computed(() => {
    const { monthlyBasicSalary } = props.career
    const {
        irrOverDecade
    } = retirement.value.pension
    const {
        yearsToRetirement,
        annualExpense,
    } = retirement.value
    const noIncome = !monthlyBasicSalary
    const noBefore = !irrOverDecade || !yearsToRetirement
    const noAfter = !annualExpense
    return noIncome || noBefore || noAfter
})
// methods
async function calculateRetirement(options: any = { propagate: true }) {
    resetData()
    calculateExpenseQuartileMarks()
    await calculateRetireLife()
    calculateFutureSeniority()
    const { careerInsuranceType } = props.profile
    switch (careerInsuranceType) {
        case "employee":
        case "entrepreneur": {
            calculateLaborInsuranceMonthlyAnnuity()
            calculateLaborSurvivorAnnuity()
            break;
        }
        case "civilServant": {
            /**
             * 台糖試算專題 (EN：公教人員的退撫有多重天花板)
             * https://www.taisugar.com.tw/Monthly/CPN.aspx?ms=1397&p=13385448&s=13385467
             */
            calculateCivilServantPension()
            calculateCivilServantInsurance()
            break;
        }
    }
    calculateRetirementExpense()
    const { propagate = true } = options
    const pensionLumpSumDataPromise = new Promise((resolve) => {
        customDebounce(async () => {
            const pensionLumpSumData = await drawRetirementAssetChart(propagate)
            resolve(pensionLumpSumData)
        })(false)
        // 儲存參數
        if (propagate) {
            emits('update:modelValue', retirement.value)
        }
    })
    return pensionLumpSumDataPromise
}
function calculateCivilServantInsurance() {
    /**
     * 公保法第16條第二項
     * 養老給付之請領方式及給與標準如下：
     * 一、一次養老給付：保險年資每滿一年，給付一點二個月；最高以給付四十二個月為限。但辦理優惠存款者，最高以三十六個月為限。
     * 二、養老年金給付：保險年資每滿一年，在給付率百分之零點七五（以下簡稱基本年金率）至百分之一點三（以下簡稱上限年金率）之間核給養老年金給付，
     * 最高採計三十五年；其總給付率最高為百分之四十五點五。但中華民國一百十二年七月一日以後初次參加本保險者，最高採計四十年；其總給付率最高為百分之五十二。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=16#:~:text=%E4%B8%80%E3%80%81%E4%B8%80%E6%AC%A1%E9%A4%8A%E8%80%81%E7%B5%A6%E4%BB%98%EF%BC%9A%E4%BF%9D%E9%9A%AA,%E5%9B%9B%E5%8D%81%E4%BA%94%E9%BB%9E%E4%BA%94%E3%80%82
     */
    /**
     * 公保法第16條
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
    const { futureSeniority, } = retirement.value.insurance
    const { incomeReplacementRatio: pensionIncomeReplacementRatio } = retirement.value.pension
    let incomeReplacementMaxRatio = 0
    if (futureSeniority <= 15) {
        incomeReplacementMaxRatio = futureSeniority * 2
    } else {
        incomeReplacementMaxRatio = 30 + (futureSeniority - 15) * 2.5
    }
    incomeReplacementMaxRatio -= pensionIncomeReplacementRatio
    retirement.value.insurance.incomeReplacementMaxRatio = incomeReplacementMaxRatio

    const { salary } = props.career.insurance
    const baseSalary = salary * 2
    const insuranceAnnuityMax = incomeReplacementMaxRatio * baseSalary
    let benefitRatio = insuranceAnnuityMax / baseSalary / futureSeniority
    retirement.value.insurance.benefitRatioEstimated = benefitRatio
    benefitRatio = Math.max(0.75, benefitRatio)
    benefitRatio = Math.min(1.3, benefitRatio)
    retirement.value.insurance.benefitRatio = benefitRatio
    // 際可領年金給付率=養老年金上限÷10年平均保俸÷公保年資

    /**
     * 公保法第18條
     * 被保險人保險年資滿十五年，未符合第十六條養老年金給付請領資格者，得提前五年請領養老年金給付，每提前一年，依第十六條規定計算之給付金額減給百分之四，最多減給百分之二十。
     */
    /**
     * 公保法第19條
     * 依第十七條規定計得之每月可領養老年金給付，其保險年資每滿一年之給付率低於基本年金率時，仍應按基本年金率計給；超過上限年金率時，應按上限年金率計給。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0070001&flno=19
     */
    // const { futureSeniority, } = retirement.value.insurance
    // const { monthlyAnnuity = 0, } = retirement.value.pension
    // let incomeReplacementMaxRatio = 0
    // if (futureSeniority <= 15) {

    // }
    // // 養老年金上限=退休年金給與上限－每月退休給與
    // // const insuranceAnnuityMax = monthlyAnnuity - 
    // if (futureSeniority <= 35) {
    //     incomeReplacementMaxRatio = 30 + (futureSeniority - 15) * 1.5
    // } else {
    //     incomeReplacementMaxRatio = 60 + (futureSeniority - 35) * 0.5
    // }
}
function calculateCivilServantPension() {
    const { futureSeniority, } = retirement.value.insurance
    const { requestType, } = retirement.value.pension
    const { salary } = props.career.insurance
    const { lifeExpectancy } = retirement.value
    if (!futureSeniority || !salary || !requestType) {
        retirement.value.pension.monthlyAnnuity = 0
        return
    }
    /**
     * 退撫法第29條
     * 公務人員所具退撫新制實施後任職年資應給與之退休金，依第二十七條所定退休金計算基準與基數內涵，按下列標準計給：
     * 一、一次退休金：按照任職年資，每任職一年，給與一又二分之一個基數，最高三十五年，給與五十三個基數；退休審定總年資超過三十五年者，自第三十六年起，每增加一年，增給一個基數，最高給與六十個基數。其退休年資未滿一年之畸零月數，按畸零月數比率計給；未滿一個月者，以一個月計。
     * 二、月退休金：按照任職年資，每任職一年，照基數內涵百分之二給與，最高三十五年，給與百分之七十；退休審定總年資超過三十五年者，自第三十六年起，每增一年，照基數內涵百分之一給與，最高給與百分之七十五。其退休年資未滿一年之畸零月數，按畸零月數比率計給；未滿一個月者，以一個月計。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0080034&flno=29
     */
    /**
     * 退撫法第37條
     * 本法公布"施行前"退休生效者之每月退休所得，於本法公布施行後，不得超過依替代率上限計算之金額。
     * 前項替代率應依退休人員審定之退休年資，照附表三所定替代率計算，
     * 任職滿十五年者，替代率為百分之四十五，其後每增加一年，替代率增給百分之一點五，最高增至三十五年，為百分之七十五。
     * 未滿一年之畸零年資，按比率計算；未滿一個月者，以一個月計。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0080034&flno=37
     */
    /**
     * 退撫法第38條
     * 本法公布"施行後"退休生效者之每月退休所得，不得超過依替代率上限計算之金額。
     * 前項替代率應依退休人員審定之退休年資，照附表三所定替代率計算；任職滿十五年至第三十五年者，照前條第二項規定辦理；(EN：就是75%)
     * 超過第三十五年者，每增加一年，增給百分之零點五，最高增至四十年止。未滿一年之畸零年資，按比率計算；未滿一個月者，以一個月計。(EN：這邊是給延後退休的選擇)
     */
    /**
     * 退撫法第39條
     * 退休人員每月退休所得，依第三十六條規定調降優存利息後，仍超出附表三所定各年度替代率上限者，應依下列順序，扣減每月退休所得，至不超過其替代率上限所得金額止：
     * 一、每月所領公保一次養老給付或一次退休金"優存利息"。
     * 二、退撫新制實施前年資所計得之月退休金（含月補償金）。
     * 三、退撫新制實施後年資所計得之月退休金。
     * https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=S0080034&flno=39
     * 年資十五年：30.0% ~ 年資四十年：62.5%
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
        // 退休金替代率天花板
        incomeReplacementMaxRatio = 30 + (futureSeniority - 15) * 1.5
    } else {
        monthlyAnnuity += 2 * 35
        monthlyAnnuity += (futureSeniority - 35)
        monthlyAnnuity = Math.min(75, monthlyAnnuity)
        // 退休金替代率天花板
        incomeReplacementMaxRatio = 60 + (futureSeniority - 35) * 0.5
        incomeReplacementMaxRatio = Math.min(62.5, incomeReplacementMaxRatio)
    }
    /**
     * 再計算月退休金
     */
    switch (requestType) {
        case 'lumpSum': {
            retirement.value.pension.lumpSum = Math.floor(lumpSum)
            monthlyAnnuity = 0
            retirement.value.pension.monthlyAnnuity = monthlyAnnuity
            retirement.value.pension.incomeReplacementMaxRatio = 0
            break;
        }
        case 'annuity': {
            retirement.value.pension.lumpSum = 0
            monthlyAnnuity = Math.min(incomeReplacementMaxRatio, monthlyAnnuity)
            monthlyAnnuity *= baseSalary / 100
            retirement.value.pension.monthlyAnnuity = Math.floor(monthlyAnnuity)
            retirement.value.pension.incomeReplacementMaxRatio = incomeReplacementMaxRatio
            break;
        }
        case 'halfAndHalf': {
            incomeReplacementMaxRatio /= 2
            monthlyAnnuity = Math.min(incomeReplacementMaxRatio, monthlyAnnuity)
            monthlyAnnuity *= baseSalary / 100
            lumpSum /= 2
            retirement.value.pension.lumpSum = Math.floor(lumpSum)
            retirement.value.pension.monthlyAnnuity = Math.floor(monthlyAnnuity)
            retirement.value.pension.incomeReplacementMaxRatio = incomeReplacementMaxRatio
            break;
        }
    }
    const lifeExpectancyMonths = lifeExpectancy * 12
    lumpSum /= lifeExpectancyMonths
    retirement.value.pension.incomeReplacementRatio = lumpSum / baseSalary * 100
}
function resetData() {
    // 避免資料干擾
    retirement.value.insurance.annuity = 0
    retirement.value.pension.tax = 0
    retirement.value.insurance.survivorAnnuity = 0
}
function calculateExpenseQuartileMarks() {
    props.config.retirementQuartile.forEach((item, index) => {
        const { value } = item
        const percentileRank = (index + 1) * 20 - 10
        const retirementMonthlyExpense = Number(value) / 12
        expenseQuartileMarks[percentileRank] = Number(Math.floor(retirementMonthlyExpense)).toLocaleString()
    })
}
async function calculateRetireLife() {
    const { age: currentAge, gender } = props.profile
    const { age: retireAge } = retirement.value
    const { currentYear } = props.config
    if (!currentAge || !retireAge) {
        return
    }
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
}
function calculateFutureSeniority() { // 退休時年資
    const { presentSeniority } = retirement.value.insurance
    const futureSeniority = presentSeniority + retirement.value.age - props.profile.age
    retirement.value.insurance.futureSeniority = futureSeniority
}
function calculateLaborInsuranceMonthlyAnnuity() {
    const { lifeExpectancy, age } = retirement.value
    const { futureSeniority, } = retirement.value.insurance
    const { salary } = props.career.insurance
    if (!age || !futureSeniority || !salary) {
        return
    }
    const ageModifier: number = 1 + (Number(age) - 65) * 0.04
    const formulaOne: number = (Number(salary) * Number(futureSeniority) * 0.775 / 100 + 3000) * ageModifier
    const formulaTwo: number = (Number(salary) * Number(futureSeniority) * 1.55 / 100) * ageModifier
    retirement.value.insurance.monthlyAnnuity = Math.floor(Math.max(formulaOne, formulaTwo))
    if (lifeExpectancy) { // 勞保年金請領總和
        const inflationRate = 1 + props.config.inflationRate / 100
        const pvModifier = Math.pow(inflationRate, age - 60)
        retirement.value.annuitySum = Math.floor(retirement.value.insurance.monthlyAnnuity * 12 * Number(lifeExpectancy) / pvModifier)
    }
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
        irrOverDecade,
        lumpSum,
    } = retirement.value.pension
    const { monthlyContribution = 0, monthlyContributionSelf = 0 } = props.career.pension
    const { currentYear } = props.config
    const {
        yearsToRetirement,
        lifeExpectancy,
        annualExpense,
    } = retirement.value
    const monthlyAnnuity = retirement.value.insurance.monthlyAnnuity || retirement.value.pension.monthlyAnnuity
    const { downpayYear, loanTerm, monthlyRepay } = props.estate
    const loanEndYear = downpayYear + loanTerm
    // 計算資料
    const inflationRate = 1 + props.config.inflationRate / 100
    let inflationModifier = 1

    let pv = 0
    const n = yearsToRetirement
    const pensionContribution = (monthlyContribution + monthlyContributionSelf) * 12
    const pensionIrr = 1 + (irrOverDecade / 100)
    let fv = 0 // fv = pv * n + pmt

    const labels: number[] = []
    const pensionLumpSumData: number[] = []
    const annualAnnuityData: number[] = []
    const retirementAnnualExpenseData: number[] = []
    const estateData: number[] = []

    const { careerInsuranceType } = props.profile
    if (['employee', 'entrepreneur'].includes(careerInsuranceType)) {
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
        calculateLaborPensionLumpSum(fv)
    }
    if (['civilServant',].includes(careerInsuranceType)) {
        pv = lumpSum
        for (let i = 0; i < n; i++) {
            inflationModifier *= inflationRate
        }
    }

    // 退休後退休支出
    let insuranceAnnuityInflationModifier = 1
    let pmt = 0
    let inflatedAnnualExpense = 0
    for (let i = 1; i <= lifeExpectancy + 1; i++) {
        inflationModifier *= inflationRate
        insuranceAnnuityInflationModifier *= inflationRate
        // 年金收入計算
        const annutalAnnuity = Math.floor(monthlyAnnuity * 12 * insuranceAnnuityInflationModifier)
        annualAnnuityData.push(annutalAnnuity)
        inflatedAnnualExpense = Math.floor(annualExpense * inflationModifier)
        retirementAnnualExpenseData.push(-inflatedAnnualExpense)
        pmt = annutalAnnuity - inflatedAnnualExpense
        // 未還完的房貸支出
        const simYear = currentYear + yearsToRetirement + i
        const annualRepay = monthlyRepay * 12
        if (loanEndYear >= simYear) {
            pmt -= annualRepay
            estateData.push(-annualRepay)
        } else {
            estateData.push(0)
        }
        // fv
        fv = Math.floor(pv * pensionIrr)
        pensionLumpSumData.push(Math.floor(fv))
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
    if (fv <= 0) {
        if (!errorMssage.pending()) {
            errorMssage()
        }
    }
    // 繪圖
    const tension = 0.5
    const datasets = [
        {
            label: '一次領+投資',
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
        }
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
    return {
        pensionLumpSumData
    }
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

import { ElMessage, } from 'element-plus'
import { throttle, debounce } from './lodash.js'
const errorMssage = throttle(() => {
    ElMessage.error('退休：晚節不保！')
}, 4000)

const debounceId = ref()
function customDebounce(func, delay = 100) {
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
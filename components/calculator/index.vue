<template>
    <el-dialog v-model="config.loadingDialogVisible" title="等待伺服器開機" width="500">
        <div>此為免費服務，伺服器開機需10秒左右來準備以下必須資料。</div>
        <ul>
            <li>餘命運算</li>
            <li>2023聯徵房地資料契約</li>
            <li>央行擔保放款融通利率</li>
        </ul>
        <div>完成後此提示會自動關閉。就可以開始使用了。</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="backToCalendar()">放棄使用</el-button>
                <el-button v-loading="true" :disabled="true" type="primary"
                    @click="config.loadingDialogVisible = false">
                    下一步
                </el-button>
            </div>
        </template>
    </el-dialog>

    <Profile v-model="profile" :user="user" :config="config" ref="ProfileRef" @sign-out="signOut()"
        @update:modelValue="onProfileChanged()"></Profile>

    <h2 id="_2. 我可以FIRE嗎？" tabindex="-1">2. 我可以FIRE嗎？<a class="header-anchor" href="#2. 我可以FIRE嗎？"
            aria-label="Permalink to &quot;2. 我可以FIRE嗎？&quot;">&ZeroWidthSpace;</a></h2>
    財務安全的理財方式，將退休前與退休後的資產分開計算。退休先有保障，當上流老人，再用退休前資產去試算是否可以推關。

    <Career v-model="career" :user="user" :config="config" ref="CareerRef" @update:modelValue="onCareerChanged()">
    </Career>

    <Retirement v-model="retirement" :config="config" :profile="profile" ref="RetirementRef"
        @update:model-value="onRetirementChanged()">
    </Retirement>

    <h2 id="_3. 五子登科" tabindex="-1">3. 五子登科</h2>
    用退休前資產試算是否能過關。

    <Investment v-model="investment" :config="config" :profile="profile" :career="career" :parenting="parenting"
        :mortgage="mortgage" ref="InvestmentRef" @update:model-value="onInvestmentChanged()">
    </Investment>

    <Estate>
        <template v-slot:size>
            <EstateSize v-model="estateSize" :config="config" :parenting="parenting" ref="estateSizeRef"
                @update:model-value="onEstateSizeChanged()"></EstateSize>
        </template>
        <!-- <template v-slot:price>
            <EstatePrice v-model="estatePrice"></EstatePrice>
        </template> -->
    </Estate>

    <h3 id="_結婚試算" tabindex="-1">結婚試算<a class="header-anchor" href="#結婚試算"
            aria-label="Permalink to &quot;結婚試算&quot;">&ZeroWidthSpace;</a></h3>
    <h3 id="_育兒試算" tabindex="-1">育兒試算<a class="header-anchor" href="#育兒試算"
            aria-label="Permalink to &quot;育兒試算&quot;">&ZeroWidthSpace;</a></h3>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="配婚出生年">
                        <select v-model="profile.yearOfBirth" class="form__select" placeholder="請選擇"
                            style="width: 130px">
                            <option label="請選擇" value=""></option>
                            <option v-for="year in config.birthYearOptions" :key="year" :label="String(year)"
                                :value="year" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="現配偶婚年">
                        <select v-model="profile.yearOfBirth" class="form__select" placeholder="請選擇"
                            style="width: 130px">
                            <option label="請選擇" value=""></option>
                            <option v-for="year in config.marriageYearOptions" :key="year" :label="String(year)"
                                :value="year" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="配偶貢獻">
                        <el-input-number v-model="parenting.spouseMonthlyContribution" :min="0"
                            @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="配偶貢獻">
                        <el-input-number v-model="parenting.spouseMonthlyContribution" :min="0"
                            @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房屋可容納人數">
                        <el-text>{{ estateSize.doubleBedRoom * 2 + estateSize.singleBedRoom }} 人</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="月開支(隻/每年)" required>
                        <el-input-number v-model="parenting.childAnnualExpense" :min="0"
                            @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="養到幾歲放生" required>
                        <el-input-number v-model="parenting.independantAge" :min="18" @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="第一隻西元年">
                        <el-input-number v-model="parenting.firstBornYear" :min="0" @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="第二隻西元年">
                        <el-input-number v-model="parenting.secondBornYear" :min="0" @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="壽險已備">
                        <el-input-number v-model="parenting.insurance" :min="0" @change="drawLifeAssetChart()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="資產投報率">
                        <el-text>{{ config.portfolioIRR[investment.allocationETF] }} %</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <canvas id="parentingChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    因為缺少資料集或是相關api，故此部分資料會較為粗糙。
                    <ul>
                        <li>
                            出生西元年設定0則不列入計算
                        </li>
                        <li>
                            保險事故日期假定為長子出生年，且投資報酬率比照原先資產配置
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


    <h3 id="_購屋貸款試算" tabindex="-1">購屋貸款試算</h3>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="購屋西元年">
                        <el-input-number v-model="mortgage.buyHouseYear" @change="onBuyHouseYearChanged()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估貸款成數">
                        <a href="https://member.jcic.org.tw/main_member/MorgageQuery.aspx" target="_blank">住宅貸款統計查詢網</a>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="貸款比例(%)">
                        <el-input-number v-model="mortgage.loanPercent" :min="0" :max="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估貸款">
                        <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                </el-col>
                <el-col :span="12">
                    <el-form-item label="預估頭期款">
                        <el-text>{{ Number(mortgage.downPayment).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="試算利息(%)">
                        <el-input-number v-model="mortgage.interestRate" :min="0" @change="calculateMortgate()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="貸款年期">
                        <el-input-number v-model="mortgage.loanTerm" :min="0" @change="calculateMortgate()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="每月還款金額" prop="floorSize">
                        <el-text>{{ Number(mortgage.monthlyRepay).toLocaleString() }} NTD</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    <ul>
                        <li>
                            試算利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率</a>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import firebase from 'firebase/compat/app';
import { onMounted, ref, reactive, watch, nextTick, onBeforeUnmount, computed, shallowRef } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import Chart from 'chart.js/auto';
import Profile from './profile.vue'
import Career from './career.vue'
import Retirement from './retirement.vue'
import Investment from './investment.vue'
import Estate from './estate.vue'
import EstateSize from './estateSize.vue'
// import EstatePrice from './estatePrice.vue'
const ProfileRef = ref()
const CareerRef = ref()
const RetirementRef = ref()
const InvestmentRef = ref()
const estateSizeRef = ref()
const { VITE_BASE_URL } = import.meta.env
interface IOptionItem {
    label: string,
    value: string | number | boolean,
}
// 用戶與權限
const user = reactive({
    displayName: '註冊用戶',
    email: '',
    photoURL: '',
    uid: '',
    id: '',
})
async function initializeApp() {
    await firebase.initializeApp({
        apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
        authDomain: "econ-sense-9a250.firebaseapp.com",
        projectId: "econ-sense-9a250",
        storageBucket: "econ-sense-9a250.appspot.com",
        messagingSenderId: "449033690264",
        appId: "1:449033690264:web:f5e419118030eb3afe44ed",
        measurementId: "G-19NFT8GVCZ"
    })
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            await setIdToken(false)
            await getUserFormSync(false)
            // await initializeCalculator()
            return
        }
        const { displayName, email, photoURL, uid } = firebaseUser
        await setIdToken(firebaseUser)

        user.photoURL = photoURL || ''
        user.uid = uid
        user.email = email || ''
        user.displayName = displayName || '註冊用戶'
        ProfileRef.value.toggleSignInDialog(false)
        const userForm = await getUserFormSync(firebaseUser)
        user.id = userForm.id // 告訴authFetch可以更新資料了，避免初始資料錯誤覆蓋原有資料
        initializeCalculator()
    })
}
const idToken = ref()
const idTokenIntervalId = ref()
async function setIdToken(currentUser) {
    if (currentUser) {
        idToken.value = await currentUser.getIdToken(true)
    } else {
        idToken.value = null
        clearInterval(idTokenIntervalId.value)
    }
}
async function authFetch(appendUrl, options) {
    const currentUser = await firebase.auth().currentUser
    if (!currentUser) {
        return // 離線使用或未登入
    }
    if (options.body && !user.id) {
        return // 避免初始化資料覆蓋回noSQL
    }
    const defaultOptions: any = {
        method: 'get',
        headers: {
            Authorization: `Bearer ${idToken.value}`,
        }
    }
    defaultOptions.method = options.method
    if (options.body) {
        defaultOptions.body = JSON.stringify(options.body)
        Object.assign(defaultOptions.headers, {
            'Content-Type': 'application/json'
        })
    }
    Object.assign(defaultOptions.headers, options.headers)
    const res = await fetch(VITE_BASE_URL + appendUrl, defaultOptions)
    if (res.status !== 200) {
        const result = await res.text()
        if (result.includes('auth/id-token-expired')) {
            const currentUser = await firebase.auth()?.currentUser
            await setIdToken(currentUser)
            authFetch(appendUrl, options)
        } else {
            ElMessage(result || res.statusText)
        }
        return
    }
    return res
}
async function signOut() {
    await firebase.auth().signOut()
    for (let key in user) {
        user[key] = ''
    }
}
// 主要從資料庫來的設定檔案
const config = reactive({
    // primitive types
    currentYear: new Date().getFullYear(),
    inflationRate: 2,
    maxPensionSalary: 150000,
    // array types
    genders: [],
    counties: [],
    buildingTypes: [],
    buildingAges: [],
    retirementQuartile: [],
    birthYearOptions: [],
    marriageYearOptions: [],
    // object types
    townMap: {},
    portfolioIRR: {},
    porfolioLabels: {
        aok: '股2債8',
        aom: '股4債6',
        aor: '股6債4',
        aoa: '股8債2',
    },
    // Dialog
    loadingDialogVisible: false,
    loginDialogVisible: false,
    isFullScreen: false,
    toFixed: (value, digit = 2) => {
        return Number(Number(value).toFixed(digit))
    }
})
const loadingDialogVisible = ref(false)
async function setSelecOptionSync() {
    loadingDialogVisible.value = true
    try {
        // 靜態的設定檔案
        const selectRes = await fetch(`${VITE_BASE_URL}/select`)
        const selectResJson = await selectRes.json()
        config.counties = selectResJson.counties || []
        config.buildingTypes = selectResJson.buildingTypes || []
        config.buildingAges = selectResJson.buildingAges || []
        config.genders = selectResJson.genders || []
        config.retirementQuartile = selectResJson.retirementQuartile || []
        config.retirementQuartile.forEach((item, index) => {
            const { value } = item
            const percentileRank = (index + 1) * 20 - 10
            const retirementMonthlyExpense = Number(value) / 12
            retirement.expenseQuartileMarks[percentileRank] = Number(Math.floor(retirementMonthlyExpense)).toLocaleString()
        })
        Object.assign(config.townMap, selectResJson.townMap)
        // 由爬蟲抓回的設定
        const bankConfigRes = await fetch(`${VITE_BASE_URL}/bank/config`)
        const bankConfigResJson = await bankConfigRes.json()
        mortgage.interestRate = bankConfigResJson.interestRate
        Object.assign(config.portfolioIRR, bankConfigResJson.portfolioIRR)

        const year = new Date().getFullYear()
        for (let i = 0; i < 60; i++) {
            config.birthYearOptions.push(Number(year) - i - 18)
            config.marriageYearOptions.push(Number(year) - i)
        }
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert('Google Cloud App Engine無回應', {
            confirmButtonText: '回講座排程',
            callback: () => {
                backToCalendar()
            },
        })
    } finally {
        loadingDialogVisible.value = false
    }
}
function backToCalendar() {
    window?.location.replace('/calendar')
}
async function getUserFormSync(firebaseUser) {
    const initForm = {
        profile: {},
        career: {},
        retirement: {
            age: 65,
            pension: {
                employeeContrubution: 0,
                employeeContrubutionIncome: 0,
                employerContribution: 0,
                employerContributionIncome: 0,
                irrOverDecade: 4.76
            },
            percentileRank: 50,
            qualityLevel: 3
        },
        investment: {
            allocationETF: 'aok',
            stockPercentage: 20,
        },
        parenting: {
            childAnnualExpense: 212767,
            independantAge: 18,
            insurance: 0,
        },
        estatePrice: {},
        estateSize: {
            publicRatio: 35,
            bathroom: 1,
            livingRoom: 1,
            balcany: 1,
            parkingSpace: 1
        },
        mortgage: {
            loanPercent: 80,
            loanTerm: 25,
        },
    }
    let userForm = {
        id: ''
    }
    try {
        if (firebaseUser) {
            const { uid } = firebaseUser
            const res = await authFetch(`/user/${uid}`, {
                method: 'post'
            })
            userForm = await res?.json()
        }
    } catch (error) {
        const res = await authFetch(`/user/new`, {
            method: 'post'
        })
        userForm = await res?.json()
    } finally {
        Object.assign(initForm, userForm)
        Object.assign(profile, initForm.profile)
        Object.assign(career, initForm.career)
        Object.assign(retirement, initForm.retirement)
        Object.assign(investment, initForm.investment)
        Object.assign(estatePrice, initForm.estatePrice)
        Object.assign(estateSize, initForm.estateSize)
        Object.assign(mortgage, initForm.mortgage)
        Object.assign(parenting, initForm.parenting)
    }
    return userForm
}
async function initializeCalculator() {
    await ProfileRef.value.calculateProfile()
    await CareerRef.value.calculateCareer()
    await RetirementRef.value.calculateRetirement()
    await InvestmentRef.value.calculateAsset()
    await estateSizeRef.value.calculateEstateSize()
    if (estatePrice.county) {
        towns.value = config.townMap[estatePrice.county]
    }
    await getUnitPriceSync()
    calculateMortgate() // will calculate asset
}
// 基本資料
const profile = reactive({
    id: '', // 避免登入判斷錯誤
    yearOfBirth: '',
    dateOfBirth: '',
    gender: '',
    age: 0,
    lifeExpectancy: 0,
})
function onProfileChanged() {
    // 儲存參數
    authFetch(`/user/profile`, {
        method: 'put',
        body: profile,
    })
    // 影響其他
    retirement.yearToRetirement = retirement.age - profile.age
    const lifeExpectancy = profile.lifeExpectancy - retirement.yearToRetirement
    retirement.lifeExpectancy = Number(Number().toFixed(2))
    RetirementRef.value.calculateRetirement(false)
}
// 職業試算
const career = reactive({
    monthlyBasicSalary: 0,
    foodExpense: 3000,
    employeeWelfareFund: 0,
    pension: {
        salary: 0,
        salaryMin: 0,
        rate: 0,
        monthlyContribution: 0,
        monthlyContributionEmployee: 0,
    },
    healthInsutancePremium: 0,
    insurance: {
        salary: 0,
        salaryMin: 0,
        expense: 0,
    },
    monthlyNetPayEstimated: 0,
    monthlyNetPay: 0,
    monthlyExpense: 0,
    monthlySaving: 0,
})
function onCareerChanged() {
    // 儲存參數
    authFetch(`/user/career`, {
        method: 'put',
        body: career,
    })
    // 影響其他
    retirement.insurance.salary = career.insurance.salary
    retirement.pension.monthlyContribution = career.pension.monthlyContribution
    RetirementRef.value.calculateRetirement()
    InvestmentRef.value.calculateAsset()
}
// 退休試算
const retirement = reactive({
    age: 60,
    yearToRetirement: 0,
    lifeExpectancy: 0,
    expenseQuartileMarks: {},
    // 勞保
    insurance: {
        salary: 0,
        presentSeniority: 0, // 6.9
        futureSeniority: 0,
        monthlyAnnuity: 0,
        annuitySum: 0,
    },
    // 勞退
    pension: {
        monthlyContribution: 0,
        employeeContrubution: 0,
        employeeContrubutionIncome: 0,
        employerContribution: 0,
        employerContributionIncome: 0,
        irrOverDecade: 4.76,
        finalValue: 0,
        tax: 0,
    },
    // 退休水準
    qualityLevel: 0,
    percentileRank: 0,
    annualExpense: 0,
})
function onRetirementChanged() {
    // 儲存參數
    authFetch(`/user/retirement`, {
        method: 'put',
        body: retirement,
    })
    // 影響其他
    investment.period = retirement.yearToRetirement
}
// 投資試算
const investment = reactive({
    allocationETF: '',
    irr: 0,
    stockPercentage: 0,
    presentAsset: 0,
    averaging: 0,
    allocationQuartileMarks: {},
    period: 0,
})
function onInvestmentChanged() {
    authFetch(`/user/investment`, {
        method: 'put',
        body: investment,
    })
}
// 育兒試算
const parenting = reactive({
    childAnnualExpense: 0,
    spouseMonthlyContribution: 0,
    independantAge: 0,
    firstBornYear: 0,
    secondBornYear: 0,
    insurance: 0,
    headCount: 0,
})
let parentingChartInstance = ref<Chart>()
watch(() => parenting, () => {
    drawParentingChart()
}, { deep: true })
function drawParentingChart() {
    debounce(() => {
        // 儲存參數
        authFetch(`/user/parenting`, {
            method: 'put',
            body: parenting,
        })
        // 繪製圖
        let inflationModifier = 1
        const { firstBornYear, secondBornYear, independantAge, childAnnualExpense, insurance, spouseMonthlyContribution } = parenting
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
        parenting.headCount = headCount
        const firstBornEndYear = firstBornYear + independantAge
        const secondBornEndYear = secondBornYear + independantAge
        const parentingDuration = Math.max(firstBornYear, secondBornYear) - firstBornYear + independantAge
        const labels: number[] = []
        const firstBornData: number[][] = []
        const secondBornData: number[][] = []
        const asssetData: number[][] = []
        let insuranceAsset = insurance
        for (let i = 0; i < parentingDuration; i++) {
            const simYear = firstBornYear + i
            labels.push(simYear)
            const inflatedExpense = Math.floor(childAnnualExpense * inflationModifier)
            let totalExpense = 0
            if (firstBornYear && firstBornYear <= simYear && simYear < firstBornEndYear) {
                firstBornData.push([0, inflatedExpense])
                totalExpense += inflatedExpense
            } else {
                firstBornData.push([0, 0])
            }
            if (secondBornYear && secondBornYear <= simYear && simYear < secondBornEndYear) {
                secondBornData.push([totalExpense, totalExpense + inflatedExpense])
                totalExpense += inflatedExpense
            } else {
                secondBornData.push([0, 0])
            }
            insuranceAsset += spouseMonthlyContribution
            insuranceAsset -= totalExpense
            asssetData.push([totalExpense, Math.floor(insuranceAsset)])
            insuranceAsset = insuranceAsset * (1 + investment.irr / 100)
            inflationModifier *= 1 + config.inflationRate / 100
        }
        const datasets = []
        const tension = 0.5
        if (firstBornData) {
            datasets.push({
                label: '長子',
                data: firstBornData,
                fill: true,
                tension,
            })
        }
        if (secondBornYear) {
            datasets.push({
                label: '次子',
                data: secondBornData,
                fill: true,
                tension,
            })
        }
        if (insurance) {
            datasets.push({
                label: '壽險+投資',
                data: asssetData,
                fill: true,
                tension,
            })
        }

        const data: any = {
            labels,
            datasets,
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
    }, 'parenting')()
}
function showChildAge(tooltipItems) {
    const { raw, dataIndex, dataset, datasetIndex } = tooltipItems
    const secondValue = raw[1]
    if ([0, 1].includes(datasetIndex)) {
        const zeros = dataset.data.slice(0, parenting.independantAge).filter(value => value[1] === 0)
        const age = dataIndex - zeros.length + 1
        if (age >= 0) {
            const formatAge = Math.max(0, age)
            return `${dataset.label}: ${formatAge}歲`
        } else {
            return '未出生'
        }
    } else {
        const formatValue = Number(secondValue).toLocaleString()
        return `年末剩餘：${formatValue}`
    }
}
function showChildExpense(tooltipItems) {
    const { raw, datasetIndex } = tooltipItems[0]
    const fisrtValue = raw[0]
    const secondValue = raw[1]
    if ([0, 1].includes(datasetIndex)) {
        const formatExpense = Number(secondValue - fisrtValue).toLocaleString()
        return `支出： ${formatExpense}`
    } else {
        const formatValue = Number(fisrtValue).toLocaleString()
        return `總支出： ${formatValue}`
    }
}
// 購屋分析
const estatePrice = reactive({
    county: '',
    town: '',
    buildingType: '',
    buildingAge: '',
    hasParking: '',
    count: 0,
    pr25: 0,
    pr75: 100,
    average: 0,
})
const buildingUnitPrice = ref(0)
let unitPriceMarks: {
    [key: string]: string
} = reactive({
    0: 'PR25：？',
    100: 'PR75：？'
})
const buildingLoading = ref(false)
const towns = ref([])
const hasParkingOptions = ref([
    { label: '含', value: true },
    { label: '不含', value: false },
])
const buildingRules = reactive({
    county: { required: true, message: '請選擇', },
    town: { required: true, message: '請選擇', },
})
function onCountyChanged() {
    estatePrice.town = ''
    towns.value = []
    if (estatePrice.county) {
        towns.value = config.townMap[estatePrice.county]
    }
    getUnitPriceSync()
}
function onTownChanged() {
    getUnitPriceSync()
}
function onBuildingTypeChanged() {
    getUnitPriceSync()
}
function onBuildingAgeChanged() {
    getUnitPriceSync()
}
function onHasParkingChanged() {
    if (estatePrice.hasParking) {
        estateSize.parkingSpace = Math.max(1, estateSize.parkingSpace)
    }
    getUnitPriceSync()
}
async function getUnitPriceSync() {
    const { county, town, buildingType, buildingAge } = estatePrice
    if (county && town) {
        buildingLoading.value = true
        const res = await fetch(`${VITE_BASE_URL}/calculate/unitPrice`, {
            method: 'post',
            body: JSON.stringify(estatePrice),
            headers: { 'Content-Type': 'application/json' }
        })
        buildingLoading.value = false
        const resJson = await res.json()
        Object.assign(estatePrice, resJson)

        const { pr25, pr75, average } = resJson
        if (!average) {
            ElMessage('資料筆數過少，請調整查詢條件')
            return
        }
        unitPriceMarks = {}
        unitPriceMarks[pr25] = `PR25: ${pr25}`
        unitPriceMarks[pr75] = `PR75: ${pr75}`
        unitPriceMarks[average] = `平均：${average}`
        buildingUnitPrice.value = average
        calculateTotalPrice()
    }
}
// 購屋分析2
const estateSize = reactive({
    doubleBedRoom: 0,
    singleBedRoom: 0,
    bathroom: 0,
    livingRoom: 0,
    publicRatio: 0,
    mainBuilding: 0,
    balcany: 0,
    outBuilding: 0,
    floorSize: 0,
    parkingSpace: 0,
    parkingSize: 0,
    headCount: 0,
})
const totalHousePrice = ref(0)
function onEstateSizeChanged() {
    calculateTotalPrice()
}
async function onParkingSpaceChanged() {
    if (!estateSize.parkingSpace) {
        estatePrice.hasParking = ''
    }
    await getUnitPriceSync()
    calculateEstateSize()
}
function calculateEstateSize() {

}
function calculateTotalPrice() {
    if (!buildingUnitPrice.value || !estateSize.floorSize) {
        return
    }
    // 儲存參數
    debounce(() => {
        authFetch(`/user/estatePrice`, {
            method: 'put',
            body: estatePrice,
        })
    }, 'estatePrice')()
    debounce(() => {
        authFetch(`/user/estateSize`, {
            method: 'put',
            body: estateSize,
        })
    }, 'estateSize')()
    const beforeFormatPrice = Number(buildingUnitPrice.value) * Number(estateSize.floorSize)
    totalHousePrice.value = Number(beforeFormatPrice.toFixed(2))
    calculateMortgate()
}
// 房屋貸款試算
const mortgage = reactive({
    buyHouseYear: 0,
    loanPercent: 0,
    interestRate: 0,
    loanTerm: 0,
    downPayment: 0,
    loanAmount: 0,
    monthlyRepay: 0,
})
async function calculateMortgate() {
    const { loanPercent, loanTerm } = mortgage
    if (!totalHousePrice.value || !loanPercent || !loanTerm) {
        return
    }
    debounce(() => {
        // 儲存參數
        authFetch(`/user/mortgage`, {
            method: 'put',
            body: mortgage,
        })
    }, 'mortgage')()
    const loanAmount = totalHousePrice.value * mortgage.loanPercent * 100
    mortgage.loanAmount = loanAmount
    const downPayment = totalHousePrice.value * 10000 - loanAmount
    mortgage.downPayment = downPayment

    /**
     * 本息平均攤還
     * https://zh.wikipedia.org/zh-tw/%E6%9C%AC%E6%81%AF%E5%B9%B3%E5%9D%87%E6%94%A4%E9%82%84
     */
    const monthlyInterestRate = mortgage.interestRate / 100 / 12
    const monthCount = mortgage.loanTerm * 12

    const part = Math.pow(1 + monthlyInterestRate, monthCount)
    const fraction = part * monthlyInterestRate
    const deno = part - 1

    const averageRepayRate = fraction / deno
    mortgage.monthlyRepay = Math.floor(loanAmount * averageRepayRate)
    // drawLifeAssetChart()
}
// 沒什麼會去動到的Mounted&Debounce放底下
onMounted(async () => {
    initializeApp()
    await setSelecOptionSync()
    nextTick(() => {
        // initializeCalculator()
        window?.addEventListener('resize', onResize)
    })
})
onBeforeUnmount(() => {
    window?.removeEventListener('resize', onResize)
})
function onResize() {
    config.isFullScreen = window?.innerWidth < 768
}
const debounceIdGroup = reactive({})
function debounce(func, label = '', delay = 100) {
    return (...args) => {
        clearTimeout(debounceIdGroup[label])
        debounceIdGroup[label] = setTimeout(() => {
            debounceIdGroup[label] = undefined
            func()
        }, delay)
    }
}
</script>
<style lang="scss" scoped>
.form__select {
    all: unset;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 130px;
    padding: 0 15px;

    &:disabled {
        background-color: rgb(245, 247, 250);
    }
}

.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
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

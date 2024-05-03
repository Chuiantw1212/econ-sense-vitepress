<template>
    <div>
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

        <Career v-model="career" :user="user" :config="config" ref="CareerRef" @update:modelValue="onCareerChanged()">
        </Career>

        <Retirement v-model="retirement" :config="config" :profile="profile" ref="RetirementRef"
            @update:modelValue="onRetirementChanged()">
        </Retirement>

        <h2 id="_3. 五子登科" tabindex="-1">3. 五子登科<a class="header-anchor" href="#3. 五子登科"
                aria-label="Permalink to &quot;3. 五子登科&quot;">&ZeroWidthSpace;</a></h2>

        <Investment v-model="investment" :config="config" :profile="profile" :career="career" :parenting="parenting"
            :mortgage="mortgage" ref="InvestmentRef" @update:model-value="onInvestmentChanged()">
        </Investment>

        <h3 id="_結婚試算" tabindex="-1">結婚試算<a class="header-anchor" href="#結婚試算"
                aria-label="Permalink to &quot;結婚試算&quot;">&ZeroWidthSpace;</a></h3>

        <Parenting v-model="parenting" :config="config" :investment="investment" :estateSize="estateSize"
            ref="ParentingRef" @update:model-value="onParentingChanged()">
        </Parenting>

        <h3 id="_購屋總價試算" tabindex="-1">購屋總價試算<a class="header-anchor" href="#購屋總價試算"
                aria-label="Permalink to &quot;購屋總價試算&quot;">&ZeroWidthSpace;</a></h3>

        <EstatePrice v-model="estatePrice" :config="config" :estateSize="estateSize" ref="EstatePriceRef"
            @update:model-value="onEstatePriceChanged()">
        </EstatePrice>
        <br />
        <EstateSize v-model="estateSize" :config="config" :parenting="parenting" :estatePrice="estatePrice"
            ref="EstateSizeRef">
        </EstateSize>
        <br />
        <Estate v-model="estatePrice" :career="career" :estateSize="estateSize" :mortgage="mortgage"
            :investment="investment" :config="config" ref="EstateRef" @reset="resetTotalPrice()"
            @update:model-value="onEstateBudgetChanged()">
        </Estate>

        <Mortgage v-model="mortgage" :config="config" :estatePrice="estatePrice" ref="MortgageRef"
            @update:model-value="onMortgageChanged()">
        </Mortgage>
    </div>
</template>
<script setup lang="ts">
import firebase from 'firebase/compat/app';
import { onMounted, ref, reactive, nextTick, onBeforeUnmount, watch } from 'vue'
import { ElMessage, ElMessageBox, } from 'element-plus'
import Profile from './profile.vue'
import Career from './career.vue'
import Retirement from './retirement.vue'
import Investment from './investment.vue'
import Estate from './estate.vue'
import Parenting from './parenting.vue'
import EstateSize from './estateSize.vue'
import EstatePrice from './estatePrice.vue'
import Mortgage from './mortgage.vue'
const ProfileRef = ref()
const CareerRef = ref()
const RetirementRef = ref()
const InvestmentRef = ref()
const ParentingRef = ref()
const EstateSizeRef = ref()
const EstatePriceRef = ref()
const EstateRef = ref()
const MortgageRef = ref()
const { VITE_BASE_URL } = import.meta.env
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
async function setIdToken(currentUser) {
    if (currentUser) {
        idToken.value = await currentUser.getIdToken(true)
    } else {
        idToken.value = null
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
    location.reload()
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
                irrOverDecade: 4.76,
                totalValue: 0,
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
            lifeInsurance: 0,
        },
        estatePrice: {},
        estateSize: {
            publicRatio: 35,
            bathroom: 1,
            livingRoom: 1,
            balcany: 1,
            parkingSpace: 1,
            budgetGoal: 0,
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
    await ProfileRef.value.calculateProfile({
        propagate: true,
    })
    await CareerRef.value.calculateCareer({
        propagate: true,
    })
    await RetirementRef.value.calculateRetirement({
        propagate: true,
    })
    await InvestmentRef.value.calculateAsset({
        propagate: true,
    })
    await EstateSizeRef.value.calculateEstateSize({
        propagate: true,
    })
    await EstatePriceRef.value.calculateUnitPrice({
        propagate: true,
    })
    await EstateRef.value.calculateBudgetPeriod({
        propagate: true,
    })
    await MortgageRef.value.calculateMortgage({
        propagate: true,
    })
    // calculateMortgate() // will calculate asset
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
    authFetch(`/user/profile`, {
        method: 'put',
        body: profile,
    })
    retirement.yearToRetirement = retirement.age - profile.age
    const lifeExpectancy = profile.lifeExpectancy - retirement.yearToRetirement
    retirement.lifeExpectancy = Number(Number(lifeExpectancy).toFixed(2))
    RetirementRef.value.calculateRetirement({
        propagate: false,
    })
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
    authFetch(`/user/career`, {
        method: 'put',
        body: career,
    })
    retirement.insurance.salary = career.insurance.salary
    retirement.pension.monthlyContribution = career.pension.monthlyContribution
    RetirementRef.value.calculateRetirement({
        propagate: false,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
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
        totalValue: 0,
        tax: 0,
    },
    // 退休水準
    qualityLevel: 0,
    percentileRank: 0,
    annualExpense: 0,
})
function onRetirementChanged() {
    authFetch(`/user/retirement`, {
        method: 'put',
        body: retirement,
    })
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
    ParentingRef.value.calculateParenting({
        propagate: false,
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
function onParentingChanged() {
    authFetch(`/user/parenting`, {
        method: 'put',
        body: parenting,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
}
// 購屋單價與總價
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
    unitPrice: 0,
    totalPrice: 0,
    budget: 0,
    budgetGoal: 0,
    downpayMin: 0,
    downpayMax: 100,
    yearsToDownpay: 0,
})
function resetTotalPrice() {
    estatePrice.county = ''
    estatePrice.town = ''
    estatePrice.pr25 = 0
    estatePrice.pr75 = 100
    estatePrice.average = 0
    estatePrice.unitPrice = 0
    estatePrice.totalPrice = 0
}
async function onEstatePriceChanged() {
    authFetch(`/user/estatePrice`, {
        method: 'put',
        body: estatePrice,
    })
    await EstateSizeRef.value.calculateEstateSize({
        propagate: false,
    })
    await EstateRef.value.calculateBudgetPeriod({
        propagate: false,
    })
}
async function onEstateBudgetChanged() {
    authFetch(`/user/estatePrice`, {
        method: 'put',
        body: estatePrice,
    })
}
const estateSize = reactive({
    doubleBedRoom: 0,
    singleBedRoom: 1,
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
watch(() => estateSize, async (newValue, oldValue) => {
    const hasChangeParkingSpace = newValue.parkingSpace !== oldValue.parkingSpace
    const toZero = newValue.parkingSpace === 0
    if (hasChangeParkingSpace && toZero) {
        estatePrice.hasParking = ''
        await EstatePriceRef.value.calculateUnitPrice({
            propagate: true,
        })
    }
    if (EstateRef.value) {
        await EstateRef.value.calculateBudgetPeriod({
            propagate: false,
        })
    }
}, { deep: true })
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
function onMortgageChanged() {
    authFetch(`/user/mortgage`, {
        method: 'put',
        body: mortgage,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
}
// 沒什麼會去動到的Mounted&Debounce放底下
onMounted(async () => {
    await initializeApp()
    await setSelecOptionSync()
    await getUserFormSync(false)
    nextTick(() => {
        initializeCalculator()
        window?.addEventListener('resize', onResize)
        window.scrollTo(0, 0)
    })
})
onBeforeUnmount(() => {
    window?.removeEventListener('resize', onResize)
})
function onResize() {
    config.isFullScreen = window?.innerWidth < 768
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

<template>
    <div>
        <el-dialog v-model="loadingDialogVisible" title="等待伺服器開機" width="500">
            <div>此為免費服務，伺服器開機5秒~12秒左右來準備以下必須資料。</div>
            <ul>
                <li>餘命運算</li>
                <li>2023聯徵房地資料契約</li>
                <li>央行擔保放款融通利率</li>
                <li>而且有時候會故障卡死......╮（╯＿╰）╭</li>
            </ul>
            <div>當此提示順利地自動關閉。就可以開始使用了。</div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="backToCalendar()">放棄使用</el-button>
                    <el-button v-loading="true" :disabled="true" type="primary" @click="loadingDialogVisible = false">
                        下一步
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <Profile v-model="userForm.profile" :user="user" :config="config" ref="ProfileRef" @sign-out="signOut()"
            @upload="setUserAndInitialize($event, { showMessage: true })" @update:modelValue="onProfileChanged()">
        </Profile>

        <h2 id="_我可以FIRE嗎？" tabindex="-1">我可以FIRE嗎？<a class="header-anchor" href="#我可以FIRE嗎？"
                aria-label="Permalink to &quot;我可以FIRE嗎？&quot;">&ZeroWidthSpace;</a></h2>

        <h3 id="_職業試算" tabindex="-1">職業試算<a class="header-anchor" href="#職業試算"
                aria-label="Permalink to &quot;職業試算&quot;">&ZeroWidthSpace;</a></h3>
        <CareerLabor v-if="['employee', 'entrepreneur'].includes(userForm.profile.careerInsuranceType)"
            v-model="userForm.career" :config="config" :profile="userForm.profile" ref="CareerRef"
            @update:modelValue="onCareerChanged()">
        </CareerLabor>
        <CareerGovernment v-if="userForm.profile.careerInsuranceType === 'civilServant'" v-model="userForm.career"
            :config="config" :profile="userForm.profile" ref="CareerRef" @update:modelValue="onCareerChanged()">
        </CareerGovernment>

        <h3 id="_退休試算" tabindex="-1">退休試算<a class="header-anchor" href="#退休試算"
                aria-label="Permalink to &quot;退休試算&quot;">&ZeroWidthSpace;</a></h3>
        <Retirement v-model="userForm.retirement" :config="config" :career="userForm.career" :profile="userForm.profile"
            ref="RetirementRef" @update:modelValue="onRetirementChanged()">
        </Retirement>

        <h2 id="_五子登科" tabindex="-1">五子登科<a class="header-anchor" href="#五子登科"
                aria-label="Permalink to &quot;五子登科&quot;">&ZeroWidthSpace;</a></h2>
        <h3 id="_投資資產試算" tabindex="-1">投資資產試算<a class="header-anchor" href="#投資資產試算"
                aria-label="Permalink to &quot;投資資產試算&quot;">&ZeroWidthSpace;</a></h3>
        <Investment v-model="userForm.investment" :config="config" :profile="userForm.profile" :career="userForm.career"
            :spouse="userForm.spouse" :parenting="userForm.parenting" :mortgage="userForm.mortgage"
            :retirement="userForm.retirement" ref="InvestmentRef" @update:model-value="onInvestmentChanged()">
        </Investment>

        <h3 id="_結婚試算" tabindex="-1">配偶試算<a class="header-anchor" href="#配偶試算"
                aria-label="Permalink to &quot;結婚試算&quot;">&ZeroWidthSpace;</a></h3>
        <Spouse v-model="userForm.spouse" :config="config" ref="SpouseRef" @update:model-value="onSpouseChanged()">
        </Spouse>

        <h3 id="_育兒試算" tabindex="-1">育兒試算<a class="header-anchor" href="#育兒試算"
                aria-label="Permalink to &quot;育兒試算&quot;">&ZeroWidthSpace;</a></h3>
        <Parenting v-model="userForm.parenting" :config="config" :career="userForm.career"
            :retirement="userForm.retirement" :spouse="userForm.spouse" :investment="userForm.investment"
            :estateSize="userForm.estateSize" :mortgage="userForm.mortgage" ref="ParentingRef"
            @update:model-value="onParentingChanged()">
        </Parenting>

        <h3 id="_購屋試算" tabindex="-1">購屋試算<a class="header-anchor" href="#購屋試算"
                aria-label="Permalink to &quot;購屋試算&quot;">&ZeroWidthSpace;</a></h3>
        <Mortgage v-model="userForm.mortgage" :config="config" :career="userForm.career"
            :estateSize="userForm.estateSize" :investment="userForm.investment" :estatePrice="userForm.estatePrice"
            ref="MortgageRef" @update:model-value="onMortgageChanged()" @open="openEstateCalculator()"
            @reset="resetTotalPrice()">
        </Mortgage>

        <el-dialog :modelValue="estateCalculatorVisiable" title="估算總價" :lock-scroll="true"
            @close="estateCalculatorVisiable = false">
            <EstateDialogContent :config="config" :estateSize="userForm.estateSize" :estatePrice="userForm.estatePrice"
                :parenting="userForm.parenting" ref="EstateRef" @close="estateCalculatorVisiable = false"
                @confirm="onDialogConfirm($event)">
            </EstateDialogContent>
        </el-dialog>

        <h2 id="_試算結果" tabindex="-1">試算結果<a class="header-anchor" href="#試算結果"
                aria-label="Permalink to &quot;試算結果&quot;">&ZeroWidthSpace;</a></h2>

        <DataCenter @export="exportUserForm()"></DataCenter>
    </div>
</template>
<script setup lang="ts">
import firebase from 'firebase/compat/app';
import { onMounted, ref, reactive, nextTick, } from 'vue'
import { ElMessage, ElMessageBox, } from 'element-plus'
import Profile from './profile.vue'
import CareerLabor from './career/labor.vue'
import CareerGovernment from './career/government.vue'
import Retirement from './retirement.vue'
import Investment from './investment.vue'
import Spouse from './spouse.vue'
import Parenting from './parenting.vue'
import Mortgage from './mortgage.vue'
import EstateDialogContent from './estateDialog.vue'
import DataCenter from './dataCenter.vue'
const { VITE_BASE_URL } = import.meta.env
const ProfileRef = ref()
const CareerRef = ref()
const RetirementRef = ref()
const InvestmentRef = ref()
const SpouseRef = ref()
const ParentingRef = ref()
const EstateRef = ref()
const MortgageRef = ref()
// 主要從資料庫來的設定檔案
const config = reactive({
    // primitive types
    currentYear: new Date().getFullYear(),
    inflationRate: 2,
    // array types
    genders: [],
    counties: [],
    buildingTypes: [],
    buildingAges: [],
    retirementQuartile: [],
    // object types
    townMap: {},
    portfolioIRR: {},
    porfolioLabels: {
        aok: '股2債8',
        aom: '股4債6',
        aor: '股6債4',
        aoa: '股8債2',
    },
    toFixed: (value, digit = 2) => { // deprecated
        return Number(Number(value).toFixed(digit))
    }
})
const loadingDialogVisible = ref(false)
async function setSelecOptionSync() {
    loadingDialogVisible.value = true
    try {
        const bankConfigPromises = [
            fetch(`${VITE_BASE_URL}/select`),
            fetch(`${VITE_BASE_URL}/bank/config/interestRate`),
            fetch(`${VITE_BASE_URL}/bank/config/portfolioIrr`),
        ]
        const bankConfigRes = await Promise.all(bankConfigPromises)
        // 靜態的設定檔案
        const selectRes = await bankConfigRes[0]
        const selectResJson = await selectRes.json()
        config.counties = selectResJson.counties || []
        config.buildingTypes = selectResJson.buildingTypes || []
        config.buildingAges = selectResJson.buildingAges || []
        config.genders = selectResJson.genders || []
        config.retirementQuartile = selectResJson.retirementQuartile || []
        Object.assign(config.townMap, selectResJson.townMap)
        // 由爬蟲抓回的設定
        const interestRate = await bankConfigRes[1].json()
        userForm.mortgage.interestRate = interestRate
        const ishareCoreETFs = await bankConfigRes[2].json()
        const portfolioIRR = {}
        ishareCoreETFs.forEach(etf => {
            portfolioIRR[etf.label] = etf.value
        })
        Object.assign(config.portfolioIRR, portfolioIRR)
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.msssage || 'Google Cloud App Engine無回應', {
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
async function getUserFromServer(firebaseUser) {
    let responseForm = {
        id: ''
    }
    let showMessage = false
    try {
        if (firebaseUser) {
            const { uid } = firebaseUser
            const res = await authFetch(`/user/${uid}`, {
                method: 'post'
            })
            responseForm = await res?.json()
            showMessage = true
        }
    } catch (error) {
        ElMessage(error.message || error)
        const res = await authFetch(`/user/new`, {
            method: 'post'
        })
        responseForm = await res?.json()
        showMessage = true
    } finally {
        user.id = responseForm.id
        setUserAndInitialize(responseForm, {
            showMessage
        })
    }
    return userForm
}
function setUserAndInitialize(form, { showMessage = false }) {
    for (let key in form) {
        if (userForm[key]) {
            Object.assign(userForm[key], form[key])
        }
    }
    nextTick(async () => {
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
        await SpouseRef.value.calculatecSpouse({
            propagate: true,
        })
        await ParentingRef.value.calculateParenting({
            propagate: true,
        })
        await MortgageRef.value.calculateMortgage({
            propagate: true,
        })
        if (showMessage) {
            ElMessage('載入成功')
        }
        window.scrollTo(0, 0)
    })
}

// 使用者表單集成匯出使用 - 有許多參數是只有前端會使用，後端不紀錄
const userForm = reactive({
    profile: {
        id: '', // 避免登入判斷錯誤
        yearOfBirth: '',
        dateOfBirth: '',
        gender: '',
        age: 0,
        lifeExpectancy: 0,
        yearOfMarriage: '',
        careerInsuranceType: 'civilServant',
    },
    career: {
        headCount: 0,
        monthlyBasicSalary: 0,
        employeeWelfareFund: 0,
        insuredUnit: 'company',
        insurance: {
            salary: 0,
            presentSeniority: 0, // 6.9
            futureSeniority: 0,
            expense: 0,
        },
        pension: {
            salary: 0,
            rate: 0,
            monthlyContribution: 0,
            monthlyContributionEmployee: 0,
        },
        healthInsutancePremium: 0,
        monthlyNetPayEstimated: 0,
        monthlyNetPay: 0,
        monthlyExpense: 0,
        monthlySaving: 0,
    },
    retirement: {
        age: 65,
        lifeExpectancy: 0,
        yearToRetirement: 0,
        insurance: {
            annuitySum: 0,
            monthlyAnnuity: 0,
            presentSeniority: 0,
            futureSeniority: 0
        },
        pension: {
            employeeContrubution: 0,
            employeeContrubutionIncome: 0,
            employerContribution: 0,
            employerContributionIncome: 0,
            irrOverDecade: 4.76,
            totalValue: 0,
        },
        percentileRank: 50,
        qualityLevel: 3,
        expenseQuartileMarks: {},
    },
    investment: {
        allocationETF: 'aok',
        stockPercentage: 20,
        irr: 0,
        presentAsset: 0,
        averaging: 0,
        period: 0,
    },
    spouse: {
        yearOfMarriage: '',
        marriageLength: 0,
        monthlyContribution: 0,
        weddingExpense: 0,
        yearOfBirth: '',
    },
    parenting: {
        childAnnualExpense: 212767,
        spouseMonthlyContribution: 0,
        independantAge: 18,
        firstBornYear: 0,
        secondBornYear: 0,
        insurance: 0,
        headCount: 0,
        lifeInsurance: 0,
    },
    mortgage: {
        downpayPercent: 20,
        loanTerm: 20,
        totalPriceEstimated: 0,
        interestRate: 0,
        loanAmount: 0,
        totalPrice: 0,
        downpay: 0,
        downpayGoal: 0,
        monthlyRepay: 0,
        downpayYear: 0,
    },
    estatePrice: {
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
    },
    estateSize: {
        publicRatio: 0,
        bathroom: 0,
        livingRoom: 0,
        balcany: 0,
        parkingSpace: 0,
        doubleBedRoom: 0,
        singleBedRoom: 1,
        mainBuilding: 0,
        outBuilding: 0,
        floorSize: 0,
        parkingSize: 0,
        headCount: 0,
    }
})
async function onProfileChanged() {
    authFetch(`/user/profile`, {
        method: 'put',
        body: userForm.profile,
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
}
// 職業試算
function onCareerChanged() {
    authFetch(`/user/career`, {
        method: 'put',
        body: userForm.career,
    })
    RetirementRef.value.calculateRetirement({
        propagate: false,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
    MortgageRef.value.calculateMortgage({
        propagate: false,
    })
}
// 退休試算
function onRetirementChanged() {
    authFetch(`/user/retirement`, {
        method: 'put',
        body: userForm.retirement,
    })
    InvestmentRef.value.calculateAsset({
        propagate: true,
    })
}
// 投資試算
function onInvestmentChanged() {
    authFetch(`/user/investment`, {
        method: 'put',
        body: userForm.investment,
    })
    ParentingRef.value.calculateParenting({
        propagate: false,
    })
    MortgageRef.value.calculateMortgage({
        propagate: true,
    })
}
// 配偶試算
function onSpouseChanged() {
    authFetch(`/user/spouse`, {
        method: 'put',
        body: userForm.spouse,
    })
    ParentingRef.value.calculateParenting({
        propagate: false,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
}
// 育兒試算
function onParentingChanged() {
    authFetch(`/user/parenting`, {
        method: 'put',
        body: userForm.parenting,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
}
// 購屋單價與總價
const estateCalculatorVisiable = ref(false)
function resetTotalPrice() {
    Object.assign(userForm.estatePrice, {
        county: '',
        town: '',
        pr25: 0,
        pr75: 100,
        average: 0,
        unitPrice: 0,
    })
    userForm.mortgage.totalPriceEstimated = 0
    authFetch(`/user/estatePrice`, {
        method: 'put',
        body: userForm.estatePrice,
    })
}
function openEstateCalculator() {
    estateCalculatorVisiable.value = true
}
function onDialogConfirm(newValue) {
    estateCalculatorVisiable.value = false
    Object.assign(userForm.estatePrice, newValue.estatePrice)
    Object.assign(userForm.estateSize, newValue.estateSize)
    authFetch(`/user/estatePrice`, {
        method: 'put',
        body: userForm.estatePrice,
    })
    authFetch(`/user/estateSize`, {
        method: 'put',
        body: userForm.estateSize,
    })
    MortgageRef.value.calculateMortgage({
        propagate: true,
        setDownpay: true,
    })
}
// 房屋貸款試算
function onMortgageChanged() {
    authFetch(`/user/mortgage`, {
        method: 'put',
        body: userForm.mortgage,
    })
    InvestmentRef.value.calculateAsset({
        propagate: false,
    })
}
// 資料匯出
async function exportUserForm() {
    const res = await fetch(`${VITE_BASE_URL}/user/type`, {
        method: 'get',
    })
    const userFormType = await res.json()
    const copiedResult = copyObjectValue(userForm, userFormType)
    const date = new Date().toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    const fileName = `${date}-開源財務規劃.json`
    saveAsJson(fileName, copiedResult,)
}
const saveAsJson = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    link.click()
    link.remove()
};
function copyObjectValue(valueRefObj, keyRefObj) {
    const copiedResult = {}
    for (let key in keyRefObj) {
        const valueChecked = keyRefObj[key]
        if (typeof valueChecked === 'object') {
            const result = copyObjectValue(valueRefObj[key], keyRefObj[key])
            copiedResult[key] = result
        } else {
            const primitiveValue = valueRefObj[key]
            if (![null, undefined].includes(primitiveValue)) {
                copiedResult[key] = primitiveValue
            }
        }
    }
    return copiedResult
}
// 沒什麼會去動到的Mounted&Debounce放底下
onMounted(async () => {
    await import('firebaseui')
    await initializeApp()
    await setSelecOptionSync()
})
// 用戶與權限
const user = reactive({
    displayName: '註冊用戶',
    email: '',
    photoURL: '',
    uid: '',
    id: '',
})
async function initializeApp() {
    const firebaseApp: any = await firebase.initializeApp({
        apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
        authDomain: "econ-sense-9a250.firebaseapp.com",
        projectId: "econ-sense-9a250",
        storageBucket: "econ-sense-9a250.appspot.com",
        messagingSenderId: "449033690264",
        appId: "1:449033690264:web:f5e419118030eb3afe44ed",
        measurementId: "G-19NFT8GVCZ"
    })
    firebaseApp.firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            await setIdToken(false)
            await getUserFromServer(false)
            return
        }
        const { displayName, email, photoURL, uid } = firebaseUser
        await setIdToken(firebaseUser)
        user.photoURL = photoURL || ''
        user.uid = uid
        user.email = email || ''
        user.displayName = displayName || '註冊用戶'
        ProfileRef.value?.toggleSignInDialog(false)
        await getUserFromServer(firebaseUser)
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
</style>

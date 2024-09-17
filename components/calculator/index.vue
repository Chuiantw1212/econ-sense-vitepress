<template>
    <div>
        <ClientOnly>
            <el-dialog v-model="loadingDialogVisible" title="等待伺服器開機" width="375">
                <div>此為免費服務，伺服器開機5秒~12秒準備以下資料。</div>
                <ul>
                    <li>餘命運算</li>
                    <li>2023聯徵房地資料契約</li>
                    <li>央行擔保放款融通利率</li>
                </ul>
                <div>當此提示順利地自動關閉。就可以開始使用了。</div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button type="danger" @click="backToCalendar()">放棄使用</el-button>
                        <el-button v-loading="true" :disabled="true" type="primary"
                            @click="loadingDialogVisible = false">
                            下一步
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </ClientOnly>

        <h2 id="_基本資料" tabindex="-1">
            基本資料
            <a class="header-anchor" href="#基本資料" aria-label="Permalink to &quot;基本資料&quot;">&ZeroWidthSpace;</a>
        </h2>
        <ClientOnly>
            <Profile v-model="userForm.profile" :user="user" :config="config" ref="ProfileRef" @sign-out="signOut()"
                @upload="setUserAndInitialize($event, { showMessage: true })" @update:modelValue="onProfileChanged()">
            </Profile>
        </ClientOnly>

        <h2 id="_我可以FIRE嗎？" tabindex="-1">我可以FIRE嗎？<a class="header-anchor" href="#我可以FIRE嗎？"
                aria-label="Permalink to &quot;我可以FIRE嗎？&quot;">&ZeroWidthSpace;</a></h2>

        <h3 id="_職業試算" tabindex="-1">職業試算<a class="header-anchor" href="#職業試算"
                aria-label="Permalink to &quot;職業試算&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <CareerLabor v-if="['', 'employee', 'entrepreneur'].includes(userForm.profile.careerInsuranceType)"
                v-model="userForm.career" :config="config" :profile="userForm.profile" ref="CareerRef"
                @update:modelValue="onCareerChanged()">
            </CareerLabor>
            <CareerGovernment v-if="userForm.profile.careerInsuranceType === 'civilServant'" v-model="userForm.career"
                :config="config" :profile="userForm.profile" ref="CareerRef" @update:modelValue="onCareerChanged()">
            </CareerGovernment>
        </ClientOnly>

        <h3 id="_退休試算" tabindex="-1">退休試算<a class="header-anchor" href="#退休試算"
                aria-label="Permalink to &quot;退休試算&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <Retirement v-model="userForm.retirement" :config="config" :career="userForm.career"
                :parenting="userForm.parenting" :profile="userForm.profile" :estate="userForm.estate"
                ref="RetirementRef" @update:modelValue="onRetirementChanged()">
            </Retirement>
        </ClientOnly>

        <h2 id="_五子登科" tabindex="-1">五子登科<a class="header-anchor" href="#五子登科"
                aria-label="Permalink to &quot;五子登科&quot;">&ZeroWidthSpace;</a></h2>
        <h3 id="_資產試算" tabindex="-1">證券試算<a class="header-anchor" href="#證券試算"
                aria-label="Permalink to &quot;證券試算&quot;">&ZeroWidthSpace;</a></h3>

        <ClientOnly>
            <Asset v-model="userForm.security" :config="config" :profile="userForm.profile" :career="userForm.career"
                :spouse="userForm.spouse" :parenting="userForm.parenting" :estate="userForm.estate"
                :retirement="userForm.retirement" ref="SecurityRef" @update:model-value="onSecurityChanged()">
            </Asset>
        </ClientOnly>

        <h3 id="_結婚試算" tabindex="-1">配偶試算<a class="header-anchor" href="#配偶試算"
                aria-label="Permalink to &quot;結婚試算&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <Spouse v-model="userForm.spouse" :config="config" ref="SpouseRef" @update:model-value="onSpouseChanged()">
            </Spouse>
        </ClientOnly>

        <h3 id="_家庭責任試算" tabindex="-1">家庭責任試算<a class="header-anchor" href="#家庭責任試算"
                aria-label="Permalink to &quot;家庭責任試算&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <Parenting v-model="userForm.parenting" :config="config" :career="userForm.career"
                :retirement="userForm.retirement" :spouse="userForm.spouse" :security="userForm.security"
                :estateSize="userForm.estateSize" :estate="userForm.estate" ref="ParentingRef"
                @update:model-value="onParentingChanged()">
            </Parenting>
        </ClientOnly>

        <h3 id="_購屋試算" tabindex="-1">房地產試算<a class="header-anchor" href="#房地產試算"
                aria-label="Permalink to &quot;房地產試算&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <Mortgage v-model="userForm.estate" :config="config" :career="userForm.career"
                :estateSize="userForm.estateSize" :security="userForm.security" :parenting="userForm.parenting"
                :estatePrice="userForm.estatePrice" ref="MortgageRef" @update:model-value="onMortgageChanged()"
                @open="openEstateCalculator()" @reset="resetTotalPrice()">
            </Mortgage>
            <el-dialog :modelValue="estateCalculatorVisiable" title="估算總價" :lock-scroll="true"
                @close="estateCalculatorVisiable = false">
                <EstateDialogContent :config="config" :estateSize="userForm.estateSize"
                    :estatePrice="userForm.estatePrice" :parenting="userForm.parenting" ref="EstateRef"
                    @close="estateCalculatorVisiable = false" @confirm="onDialogConfirm($event)">
                </EstateDialogContent>
            </el-dialog>
        </ClientOnly>

        <h2 id="_試算結果" tabindex="-1">試算結果<a class="header-anchor" href="#試算結果"
                aria-label="Permalink to &quot;試算結果&quot;">&ZeroWidthSpace;</a></h2>
        <h3 id="_一生資產負債" tabindex="-1">一生資產負債表<a class="header-anchor" href="#一生資產負債表"
                aria-label="Permalink to &quot;一生資產負債表&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <LifeAsset v-model="userForm.profile" :config="config" :career="userForm.career"
                :retirement="userForm.retirement" :spouse="userForm.spouse" :security="userForm.security"
                :estateSize="userForm.estateSize" :parenting="userForm.parenting" :estatePrice="userForm.estatePrice"
                :estate="userForm.estate" ref="LifeAssetRef">
            </LifeAsset>
        </ClientOnly>

        <h3 id="_報告與資料匯出" tabindex="-1">故事與匯出<a class="header-anchor" href="#故事與匯出"
                aria-label="Permalink to &quot;故事與匯出&quot;">&ZeroWidthSpace;</a></h3>
        <ClientOnly>
            <Story v-model="userForm.profile" :config="config" :career="userForm.career"
                :retirement="userForm.retirement" :spouse="userForm.spouse" :security="userForm.security"
                :estateSize="userForm.estateSize" :parenting="userForm.parenting" :estatePrice="userForm.estatePrice"
                :estate="userForm.estate" ref="StoryRef" @update:modelValue="onProfileChanged()"
                @export="exportUserForm()">
            </Story>
        </ClientOnly>
        <br>
    </div>
</template>
<script setup lang="ts">
/**
 * 技術難點，卡片之間互相有交互資料連動，
 * 要在避免無線迴圈的狀況下正確更新關聯資料。
 * 目前卡片的debounce150ms，初始化的間隔抓200ms，看起來是正常的。
 */
import firebase from 'firebase/compat/app'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { onMounted, ref, reactive, nextTick, } from 'vue'
import { ElMessage, ElMessageBox, } from 'element-plus'
import Profile from './profile.vue'
import CareerLabor from './career/labor.vue'
import CareerGovernment from './career/government.vue'
import Retirement from './retirement.vue'
import Asset from './security.vue'
import Spouse from './spouse.vue'
import Parenting from './parenting.vue'
import Mortgage from './estate.vue'
import EstateDialogContent from './estateDialog.vue'
// 財務報告區
import FreedomRate from './report/freedomRate.vue'
import LifeAsset from './report/lifeAsset.vue'
import Story from './report/story.vue'
const { VITE_BASE_URL } = import.meta.env
const ProfileRef = ref()
const CareerRef = ref()
const RetirementRef = ref()
const SecurityRef = ref()
const SpouseRef = ref()
const ParentingRef = ref()
const EstateRef = ref()
const MortgageRef = ref()
const LifeAssetRef = ref()
const StoryRef = ref()
// 主要從資料庫來的設定檔案
const config = reactive({
    isSelectReady: false,
    // primitive types
    currentYear: new Date().getFullYear(),
    inflationRate: 2,
    // array types
    genders: [],
    counties: [],
    buildingTypes: [],
    buildingAges: [],
    retirementQuartile: [],
    insuranceTypes: [],
    // object types
    townMap: {},
    portfolioIRR: {},
    porfolioLabels: {
        aok: '股2債8',
        aom: '股4債6',
        aor: '股6債4',
        aoa: '股8債2',
    },
})
const loadingDialogVisible = ref(false)
async function setSelecOptionSync() {
    if (config.isSelectReady) {
        return
    }
    try {
        const bankConfigPromises = [
            fetch(`${VITE_BASE_URL}/meta/select`),
            fetch(`${VITE_BASE_URL}/finance/interestRate`),
            fetch(`${VITE_BASE_URL}/finance/portfolioIrr`),
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
        config.insuranceTypes = selectResJson.insuranceTypes || []
        Object.assign(config.townMap, selectResJson.townMap)
        // 由爬蟲抓回的設定
        const interestRate = await bankConfigRes[1].json()
        userForm.estate.interestRate = interestRate
        const ishareCoreETFs = await bankConfigRes[2].json()
        const portfolioIRR = {}
        ishareCoreETFs.forEach(etf => {
            portfolioIRR[etf.label] = etf.value
        })
        Object.assign(config.portfolioIRR, portfolioIRR)
        config.isSelectReady = true
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.msssage || 'Google Cloud App Engine無回應', {
            confirmButtonText: '回講座排程',
            callback: () => {
                backToCalendar()
            },
        })
    }
}
function backToCalendar() {
    window?.location.replace('/calendar')
}
async function getUserFromServer(firebaseUser) {
    const selectPromise = setSelecOptionSync()
    let responseForm = {
        id: ''
    }
    let showMessage = false
    try {
        if (firebaseUser) {
            const res = await authFetch(`/plan`, {
                method: 'get'
            })
            responseForm = await res?.json()
            showMessage = true
        }
    } catch (error) {
        ElMessage(error.message || error)
        const res = await authFetch(`/plan/new`, {
            method: 'post'
        })
        responseForm = await res?.json()
        showMessage = true
    } finally {
        user.id = responseForm?.id
        await selectPromise // 效能並行優化，等到select完成再進行下一步
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
        // Backward compatible since 2024/05/10
        if (form.investment) {
            Object.assign(userForm.security, form.investment)
        }
        if (form.asset) {
            Object.assign(userForm.security, form.asset)
        }
        if (form.security) {
            Object.assign(userForm.security, form.security)
        }
        if (form.mortgage) {
            Object.assign(userForm.security, form.mortgage)
        }
        if (form.estate) {
            Object.assign(userForm.security, form.estate)
        }
    }
    nextTick(async () => {
        await ProfileRef.value.calculateProfile()
        changeAllCards({
            propagate: true
        })
        setTimeout(() => {
            changeAllCards({
                propagate: false
            })
            if (showMessage) {
                ElMessage.info('載入成功')
            }
            loadingDialogVisible.value = false
        }, 200)
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
        careerInsuranceType: '',
        story: '',
    },
    career: {
        headCount: 0,
        monthlyBasicSalary: 0,
        employeeWelfareFund: 0,
        insuredUnit: 'company',
        regionalAllowance: 0,
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
        yearsToRetirement: 0,
        yearOfRetire: 0,
        annuitySum: 0,
        insurance: {
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
            lumpSum: 0,
        },
        percentileRank: 50,
        qualityLevel: 3,
        expenseQuartileMarks: {},
    },
    security: {
        allocationETF: 'aok',
        stockPercentage: 20,
        irr: 0,
        presentAsset: 0,
        averaging: 0,
    },
    spouse: {
        yearOfMarriage: '',
        marriageLength: 0,
        monthlyContribution: 0,
        weddingExpense: 0,
        yearOfBirth: '',
        monthlyNetPay: 0,
        monthlyExpense: 0,
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
    estate: {
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
        downpayTotalPrice: 0,
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
    authFetch(`/plan/profile`, {
        method: 'put',
        body: userForm.profile,
    })
    changeAllCards({
        profile: true
    })
}
// 職業試算
function onCareerChanged() {
    authFetch(`/plan/career`, {
        method: 'put',
        body: userForm.career,
    })
    changeAllCards({
        career: true
    })
}
// 退休試算
function onRetirementChanged() {
    authFetch(`/plan/retirement`, {
        method: 'put',
        body: userForm.retirement,
    })
    changeAllCards({
        retirement: true
    })
}
// 投資試算
function onSecurityChanged() {
    authFetch(`/plan/security`, {
        method: 'put',
        body: userForm.security,
    })
    changeAllCards({
        security: true
    })
}
// 配偶試算
function onSpouseChanged() {
    authFetch(`/plan/spouse`, {
        method: 'put',
        body: userForm.spouse,
    })
    changeAllCards({
        spouse: true
    })
}
// 家庭責任試算
function onParentingChanged() {
    authFetch(`/plan/parenting`, {
        method: 'put',
        body: userForm.parenting,
    })
    changeAllCards({
        parenting: true
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
    userForm.estatePrice.county = ''
    userForm.estatePrice.town = ''
    userForm.estatePrice.unitPrice = 0
    userForm.estate.totalPriceEstimated = 0
    authFetch(`/plan/estatePrice`, {
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
    authFetch(`/plan/estatePrice`, {
        method: 'put',
        body: userForm.estatePrice,
    })
    authFetch(`/plan/estateSize`, {
        method: 'put',
        body: userForm.estateSize,
    })
    changeAllCards({
        dialog: true
    })
}
// 房屋貸款試算
function onMortgageChanged() {
    authFetch(`/plan/estate`, {
        method: 'put',
        body: userForm.estate,
    })
    changeAllCards({})
}
async function changeAllCards(from) {
    const {
        propagate = false,
    } = from
    if (!from.career) {
        await CareerRef.value.calculateCareer({
            propagate,
        })
    }
    let retirementRes = {
        pensionLumpSumData: []
    }
    retirementRes = await RetirementRef.value.calculateRetirement({
        propagate,
    })
    let securityRes = {
        securityAssetData: []
    }
    securityRes = await SecurityRef.value.calculateSecurity({
        propagate,
    })
    if (!from.spouse) {
        await SpouseRef.value.calculatecSpouse({
            propagate,
        })
    }
    if (!from.parenting) {
        await ParentingRef.value.calculateParenting({
            propagate,
        })
    }
    let estateRes = {
        estateDebtData: []
    }
    estateRes = await MortgageRef.value.calculateMortgage({
        propagate,
        setDownpay: true,
    })
    LifeAssetRef.value.calculateLifeAsset({
        retirementAsset: retirementRes?.pensionLumpSumData,
        securityAssetData: securityRes?.securityAssetData,
        estateDebtData: estateRes?.estateDebtData
    })
}
// 資料匯出
async function exportUserForm() {
    const res = await fetch(`${VITE_BASE_URL}/interface/plan`, {
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
    window.firebase = firebase
    await initializeApp()
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
    try {
        loadingDialogVisible.value = true
        await firebase.initializeApp({
            apiKey: "AIzaSyDzxiXnAvtkAW5AzoV-CsBLNbryVJZrGqI",
            authDomain: "econ-sense-9a250.firebaseapp.com",
            projectId: "econ-sense-9a250",
            storageBucket: "econ-sense-9a250.appspot.com",
            messagingSenderId: "449033690264",
            appId: "1:449033690264:web:f5e419118030eb3afe44ed",
            measurementId: "G-19NFT8GVCZ"
        })
        const auth = getAuth()
        onAuthStateChanged(auth, async (firebaseUser) => {
            loadingDialogVisible.value = true
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
    } catch (error) {
        console.log(error.message || error)
    }
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
    const auth = getAuth()
    const currentUser = auth.currentUser
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
            const auth = getAuth();
            const currentUser = auth.currentUser
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

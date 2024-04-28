---
outline: deep
---

# 一生財務試算 (WIP)

1. 台灣唯一開源的財務規劃計算機。一切數字有憑有據，不賣商品賣事實。
2. 工程師可藉由開源的前後端程式碼學習Javscript (<a href="https://github.com/Chuiantw1212/econ-sense-vitepress" target="_blank">前端開源</a> + <a href="https://github.com/Chuiantw1212/econ-sense-ap-fastify-typescript" target="_blank">後端開源</a>)。
3. 民眾可以快速建立生涯財務觀念，並提共回饋意見。

## 1. 基本資料

<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>基本資料</span>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="profile" :rules="profileRules" label-width="auto">
        <el-form-item label="出生日期" prop="dateOfBirth">
             <el-date-picker
                v-model="profile.dateOfBirth"
                type="date"
                placeholder="選擇出生日期"
                @change="handleDateOfBirthChanged($event)"
            />
        </el-form-item>
        <el-form-item label="性別" prop="gender">
            <el-select v-model="profile.gender" placeholder="請選擇" @change="handleGenderChanged($event)">
                <el-option v-for="item in genders":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="試算年齡" prop="lifeExpectancy">
            <el-input-number v-model="profile.age" :min="0" :max="120" :disabled="true"/>
        </el-form-item>
        <el-form-item label="預估餘命" prop="lifeExpectancy">
            <el-input-number v-model="profile.lifeExpectancy" :min="0" :max="120" :disabled="true"/>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <ul>
                    <li>
                        預期餘命：<a href="https://data.gov.tw/dataset/39493" target="_blank">預期壽命推估</a>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

## 2. 需求試算

<!-- <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    Check all
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedNeeds"
    @change="handleCheckedNeedsChange"
  >
    <el-checkbox v-for="need in needs" :key="need" :label="need" :value="need">
      {{ need }}
    </el-checkbox>
</el-checkbox-group> -->
<br v-if="checkedNeeds.includes('housing')"/>
<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>購屋總價試算</span>
      </div>
    </template>
    <el-form ref="ruleFormRef" v-loading="buildingLoading" :model="building" :rules="buildingRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="居住縣市" prop="county">
                    <el-select v-model="building.county" placeholder="請選擇" @change="onCountyChanged($event)">
                        <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行政區" prop="town">
                    <el-select v-model="building.town" placeholder="請選擇" :disabled="!building.county" @change="onTownChanged($event)">
                        <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="建物類別" prop="buildingType">
                    <el-select v-model="building.buildingType" placeholder="請選擇" :disabled="!building.town"  @change="onBuildingTypeChanged($event)">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingTypes":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="屋齡[年]" prop="buildingAge">
                    <el-select v-model="building.buildingAge" placeholder="請選擇" :disabled="!building.town" @change="onBuildingAgeChanged($event)">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in buildingAges":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="含車位" prop="hasParking">
                    <el-select v-model="building.hasParking" placeholder="請選擇" @change="onHasParkingChanged($event)">
                        <el-option label="不限" value=""></el-option>
                        <el-option v-for="item in hasParkingOptions":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="資料筆數" prop="unitPrice">
                    <el-text>{{ Number(building.count).toLocaleString(undefined) }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22">
                <el-form-item label="單價(萬/坪)" prop="unitPrice">
                    <el-slider v-model="buildingUnitPrice" :min="building.pr25" :max="building.pr75" :marks="unitPriceMarks" :disabled="!building.average" @change="calculateTotalPrice($event)"/>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <br/>
    <el-form ref="ruleFormRef" :model="room" :rules="roomRules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="雙人房數量">
                    <el-input-number v-model="room.doubleBedRoom" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="單人房數量">
                    <el-input-number v-model="room.singleBedRoom" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="餐廳+客廳">
                    <el-input-number v-model="room.diningRoom" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="衛浴數量">
                    <el-input-number v-model="room.bathroom" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <!-- <el-col :span="12">
                <el-form-item label="廚房">
                    <el-input-number v-model="room.kitchen" :disabled="true" :min="1" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col> -->
            <el-col :span="12">
                <el-form-item label="公設比(%)" >
                    <el-input-number v-model="room.publicRatio" :min="0" @change="calculateFloorSize()"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估主建實坪" prop="floorSize">
                    <el-text>{{ room.mainBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估附屬建物" prop="floorSize">
                    <el-text>{{ room.outBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col v-if="building.hasParking" :span="12">
                <el-form-item label="預估車位權狀" prop="floorSize">
                    <el-text>{{ room.parkingSize }} 坪</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估權狀坪數" prop="floorSize">
                    <el-text>{{ room.floorSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="總價" prop="unitPrice">
            <el-text>{{ Number(totalHousePrice).toLocaleString() }} 萬</el-text>
        </el-form-item>
    </el-form>
    <!-- <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    Check all
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedNeeds"
    @change="handleCheckedNeedsChange"
  >
    <el-checkbox v-for="need in needs" :key="need" :label="need" :value="need">
      {{ need }}
    </el-checkbox>
</el-checkbox-group> -->
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                單價資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html" target="_blank">財團法人金融聯合徵信中心 OpenAPI
                </a>
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
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13" target="_blank">
                                觀光旅館建築及設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>單人房</td>
                        <td>13</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13" target="_blank">
                                觀光旅館建築及設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>衛浴</td>
                        <td>4</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070115&flno=295" target="_blank">
                                建築技術規則建築設計施工編
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>廚房</td>
                        <td>2~4</td>
                        <td>
                            <a href="https://www.pro360.com.tw/category/kitchen_decorating#:~:text=%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BB%9A%E5%85%B7%E9%85%8D%E7%BD%AE%E5%B0%8D,%E8%BC%83%E5%A5%BD%E7%9A%84%E4%BD%BF%E7%94%A8%E9%AB%94%E9%A9%97%E3%80%82" target="_blank">
                                廚房空間如何規劃？廚房設計4大攻略及範例圖片參考｜PRO360達人網
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>餐廳+客廳</td>
                        <td>1/人</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060009&flno=322" target="_blank">
                                職業安全衛生設施規則
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>其他室內空間</td>
                        <td>30</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0070037&flno=10" target="_blank">
                                幼兒園及其分班基本設施設備標準
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>陽台</td>
                        <td>10%</td>
                        <td>
                            <a href="https://law.moj.gov.tw/LawClass/LawSingleRela.aspx?PCODE=D0070115&FLNO=162&ty=L" target="_blank">
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
<br v-if="checkedNeeds.includes('housing')"/>
<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>購屋貸款試算</span>
      </div>
    </template>
    <el-form label-width="auto">
        <el-row>
            <el-col>
                <el-form-item label="預估利息">
                    <el-input-number v-model="interestRate" :min="0"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form-item label="貸款比例(%)">
                    <el-input-number v-model="mortgage.loanPercent" :min="0" :max="100"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="預估頭期款" prop="floorSize">
                    <el-text>{{ Number(mortgage.downPayment).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估貸款" prop="floorSize">
                    <el-text>{{ Number(mortgage.loanAmount).toLocaleString() }}</el-text>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                預估利息：<a href="https://www.cbc.gov.tw/tw/lp-370-1.html" target="_blank">央行貼放利率
                </a>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('parenting')"/>
<el-card v-if="checkedNeeds.includes('parenting')">
    <template #header>
      <div class="card-header">
        <span>育兒試算</span>
      </div>
    </template>
    <template #footer>
        <ul>
            <li>資料來源：
                <a href="https://data.gov.tw/dataset/108265">
                    家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分
                </a>
            </li>
            <li>
                藉由夫妻與核心的支出與人口差異，粗估家庭中每個需要受照顧的人口平均每月需要多少支出。
            </li>
        </ul>
    </template>
</el-card>
<br v-if="checkedNeeds.includes('retirement')"/>
<el-card v-if="checkedNeeds.includes('retirement')">
    <template #header>
      <div class="card-header">
        <span>退休試算</span>
      </div>
    </template>
    <template #footer>
        <ul>
            <li>資料來源：
                <a href="https://data.gov.tw/dataset/108265">
                    家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分
                </a>
            </li>
            <li>
                用65歲以上家戶支出除以該戶人數，藉此粗估每個長輩的平均開支。
            </li>
        </ul>
    </template>
</el-card>

## 財務行為試算

### 儲蓄與投資

<el-card>
    <el-form label-width="auto">
        <el-row>
            <el-col>
                <el-form-item label="股債比">
                    <el-radio-group v-model="investment.allocation" @change="handleAllocationChanged($event)">
                        <el-radio :value="'aoa'">股8債2</el-radio>
                        <el-radio :value="'aor'">股6債4</el-radio>
                        <el-radio :value="'aom'">股4債6</el-radio>
                        <el-radio :value="'aok'">股2債8</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="已備資產" >
                    <el-input-number v-model="investment.assetAmount" :min="0"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="月儲蓄">
                    <el-input-number v-model="investment.monthlySaving" :min="0"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="計畫購屋年">
                    <el-input-number v-model="investment.buyHouseYear" :min="2024" :max="2124"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form-item label="貸款比例(%)">
                    <el-input-number v-model="mortgage.loanPercent" :min="0" :max="100"/>
                </el-form-item>
            </el-col>
        </el-row>
        <canvas id="myChart"></canvas>
        <el-row>
            <el-col>
            </el-col>
        </el-row>
    </el-form>
    <template #footer>
        <el-collapse>
            <el-collapse-item title="資料說明" name="1" :border="true">
                <table class="table">
                    <tr>
                        <th>參考標的</th>
                        <th>股債比</th>
                        <th>來源網址</th>
                    </tr>
                    <tr>
                        <td>AOA</td>
                        <td>股8債2</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239729/ishares-aggressive-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOR</td>
                        <td>股6債4</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239756/ishares-growth-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOM</td>
                        <td>股4債6</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239765/ishares-moderate-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>AOK</td>
                        <td>股2債8</td>
                        <td>
                            <a href="https://www.ishares.com/us/products/239733/ishares-conservative-allocation-etf" target="_blank">
                                來源網址
                            </a>
                        </td>
                    </tr>
                </table>
            </el-collapse-item>
        </el-collapse>
    </template>
</el-card>

<script setup>
import { onMounted, ref, reactive, watch,} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Chart from 'chart.js/auto';
// 設定檔案
const counties = ref([])
const townMap = reactive({})
const buildingTypes = ref([])
const buildingAges = ref([])
const genders = ref([])
const interestRate = ref(0)
const portfolioIRR = reactive({})
onMounted(() => {
    setSelecOptions()
    calculateFloorSize()
})
async function setSelecOptions(){
    try {
        const selectRes = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
        const selectResJson = await selectRes.json()
        counties.value = selectResJson.counties || []
        buildingTypes.value = selectResJson.buildingTypes || []
        buildingAges.value = selectResJson.buildingAges || []
        genders.value = selectResJson.genders || []
        Object.assign(townMap, selectResJson.townMap)

        const bankConfigRes = await fetch(`${import.meta.env.VITE_BASE_URL}/bank/config`)
        const bankConfigResJson = await bankConfigRes.json()
        interestRate.value = bankConfigResJson.interestRate
        Object.assign(portfolioIRR, bankConfigResJson.portfolioIRR)
    }
    catch (error) {
        // https://element-plus.org/en-US/component/message-box.html#message-box
        ElMessageBox.alert(error.message, {
        confirmButtonText: '回講座排程',
        callback: (action) => {
                window.location.replace('/calendar');
            },
        })
    }
    await calculateLifeExpectancy()
    getUnitPrice()
    calculateDownPayment()
    createLifeFinanceChart()
}
// 基本資料
const profile = reactive({
    dateOfBirth: '1990-12-12',
    gender: 'M',
    age: 0,
})
const profileRules = reactive({
    dateOfBirth:{ required: true, message: '請選擇', },
    gender: { required: true, message: '請選擇', },
})
function handleDateOfBirthChanged() {
    calculateLifeExpectancy()
}
function handleGenderChanged() {
    calculateLifeExpectancy()
}
async function calculateLifeExpectancy() {
    const { dateOfBirth, gender, age } = profile
    if(dateOfBirth && gender){
        const ceYear = new Date().getFullYear()
        const yearOfBirth = dateOfBirth.slice(0,4)
        const calculateAge = ceYear - yearOfBirth
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/lifeExpectancy`, {
            method: 'post',
            body: JSON.stringify({
                ceYear,
                age:calculateAge,
                gender,
            }),
            headers: {'Content-Type': 'application/json'}
        })

        profile.age = calculateAge
        profile.lifeExpectancy = await res.json()
    }
}
// 需求分析
const needs = ref(['housing', 'parenting', 'retirement'])
const checkedNeeds = ref(['housing',])
const checkAll = ref(false)
const isIndeterminate = ref(true)
const needMap = {
    housing: '購屋',
    parenting: '育兒',
    retirement: '退休',
}
const handleCheckAllChange = (val) => {
  checkedCities.value = val ? needs : []
  isIndeterminate.value = false
}
const handleCheckedNeedsChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === needs.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < needs.length
}
// 購屋分析
const building = reactive({
    county: 'A',
    town: '63000110',
    buildingType: '',
    buildingAge: '',
    hasParking: '',
    count: 0,
    pr25: 0,
    pr75: 100,
    average: 0,
})
const buildingUnitPrice = ref(0)
let unitPriceMarks = reactive({
    0: 'PR25：？',
    100: 'PR75：？'
})
const buildingLoading = ref(false)
const towns = ref([])
const hasParkingOptions = ref([
    { label: '含', value: true },
    { label: '不含', value: false},
])
const buildingRules = reactive({
    county: { required: true, message: '請選擇', },
    town: { required: true, message: '請選擇', },
})
function onCountyChanged(county) {
    building.town = ''
    towns.value = []
    if(county) {
        towns.value = townMap[county]
    }
    getUnitPrice()
}
function onTownChanged() {
    getUnitPrice()
}
function onBuildingTypeChanged() {
    getUnitPrice()
}
function onBuildingAgeChanged() {
    getUnitPrice()
}
function onHasParkingChanged(hasParkingValue) {
    getUnitPrice()
}
async function getUnitPrice() {
    const {county, town, buildingType, buildingAge} = building
    if(county && town) {
        try {
            buildingLoading.value = true
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/unitPrice`, {
                method: 'post',
                body: JSON.stringify(building),
                headers: {'Content-Type': 'application/json'}
            })
            const resJson = await res.json()
            Object.assign(building, resJson)

            const { pr25, pr75, average } = resJson
            if(!average) {
                ElMessage('資料筆數過少，請調整查詢條件')
                return
            }
            unitPriceMarks = {}
            unitPriceMarks[pr25] = `PR25: ${pr25}`
            unitPriceMarks[pr75] = `PR75: ${pr75}`
            unitPriceMarks[average] = `平均：${average}`
            buildingUnitPrice.value = average
            calculateTotalPrice()
        } catch (error) {
            alert(error.message||error)
        } finally {
            buildingLoading.value = false
        }
    }
}
// 購屋分析2
const room = reactive({
    doubleBedRoom: 1,
    singleBedRoom: 2,
    bathroom: 2,
    diningRoom: 1,
    publicRatio: 35,
    mainBuilding: 0,
    outBuilding: 0,
    floorSize: 0,
    parkingSize: 0,
})
const totalHousePrice = ref(0)
const roomRules = {
    doubleBedRoom: { required: true, message: '請選擇', },
    singleBedRoom: { required: true, message: '請選擇', },
    bathroom:  { required: true, message: '請選擇', },
    publicRatio: { required: true, message: '請選擇', },
}
function calculateFloorSize() {
    const { doubleBedRoom, singleBedRoom, bathroom, diningRoom, publicRatio } = room

    const fortmatRatio = 0.3025
    const baseInteriorSize = 30 * fortmatRatio
    const doubleRoomSize = doubleBedRoom * 19 * fortmatRatio
    const singleRoomSize = singleBedRoom * 13 * fortmatRatio
    const bathRoomSize = bathroom * 4 * fortmatRatio
    const headCount = 2 * doubleBedRoom + singleBedRoom
    const diningTableSize = Math.max(2, headCount) * diningRoom *  fortmatRatio

    // 主建物只包含室內空間
    room.mainBuilding = Number(Number(baseInteriorSize + doubleRoomSize + singleRoomSize + bathRoomSize + diningTableSize).toFixed(2))

    // 附屬建築比如陽台
    const balcanyPercent = 0.1 // 10%
    room.outBuilding = Number(Number(room.mainBuilding * balcanyPercent).toFixed(2))

    // 公設比計算
    const publicRatioPercent = 1 + publicRatio / 100

    // 停車位權狀
    const parkingSize = 24.75 * fortmatRatio * publicRatioPercent
    room.parkingSize = Number(Number(parkingSize).toFixed(2))

    // 權狀坪數
    let floorSize = (room.mainBuilding + room.outBuilding) * publicRatioPercent
    if(building.hasParking) {
        floorSize += room.parkingSize
    }
    room.floorSize = Number(Number(floorSize).toFixed(2))
    calculateTotalPrice()
}
function calculateTotalPrice() {
    if(buildingUnitPrice.value && room.floorSize){
        const beforeFormatPrice =  Number(buildingUnitPrice.value) * Number(room.floorSize)
        totalHousePrice.value = Number(beforeFormatPrice.toFixed(2))
        calculateDownPayment()
    }
}
// 房屋貸款試算
const mortgage = reactive({
    loanPercent: 70,
    downPayment: 0,
    loanAmount: 0,
})
function calculateDownPayment() {
    if(totalHousePrice.value){
        mortgage.loanAmount = totalHousePrice.value *　mortgage.loanPercent * 100
        mortgage.downPayment =  totalHousePrice.value * 10000 - mortgage.loanAmount
    }
}
// 投資試算
const investment = reactive({
    allocation: 'aoa',
    assetAmount: 1000000,
    buyHouseYear: new Date().getFullYear(),
    monthlySaving: 3000,
    chartInstance: null, 
})
function handleAllocationChanged() {
    createLifeFinanceChart()
}
function createLifeFinanceChart() {
    let pv = investment.assetAmount
    const irr = portfolioIRR[investment.allocation]
    let fv = 0 // fv = pv * irr + pmt
    let year = new Date().getFullYear()
    let pmt = investment.monthlySaving * 12
    const labels = []
    const datasetData = []
    for(let i = year;i < year + profile.lifeExpectancy; i++) {
        labels.push(i)
        datasetData.push(pv)
        fv = pv * (1 + irr / 100) + pmt
        pv = fv
    }
    if(investment.chartInstance) {
        investment.chartInstance.destroy();
    }
    const ctx = document.getElementById('myChart')
    investment.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: '一生資產試算',
                    data: datasetData,
                }
            ],
            labels
        }
    })
}
</script>
<style lang="scss" scoped>
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

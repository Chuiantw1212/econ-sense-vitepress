---
outline: deep
---

# 一生財務試算 (WIP)

1. 台灣唯一開源的網頁版財務規劃計算機。一切數字有憑有據，不賣商品賣事實。
2. 工程師也可藉由開源的前後端程式碼學習Javscript (Vue + Fastify + Firebase)。
3. 民眾可以快速建立生涯財務觀念，並提共回饋意見。

## 1. 基本資料

<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>基本資料</span>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="出生日期" prop="dateOfBirth">
             <el-date-picker
                v-model="form.dateOfBirth"
                type="date"
                placeholder="選擇出生日期"
                @change="handleDateOfBirthChanged($event)"
            />
        </el-form-item>
        <el-form-item label="性別" prop="gender">
            <el-select v-model="form.gender" placeholder="請選擇" @change="handleGenderChanged($event)">
                <el-option v-for="item in genders":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="試算年齡" prop="lifeExpectancy">
            <el-input-number v-model="form.age" :min="0" :max="120" :disabled="true"/>
        </el-form-item>
        <el-form-item label="預估餘命" prop="lifeExpectancy">
            <el-input-number v-model="form.lifeExpectancy" :min="0" :max="120" :disabled="true"/>
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
        <span>買房試算</span>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="building" :rules="rules" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="居住縣市" required prop="county">
                    <el-select v-model="building.county" placeholder="請選擇" @change="setTown($event)">
                        <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行政區" required prop="town">
                    <el-select v-model="building.town" placeholder="請選擇" :disabled="!building.county">
                        <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="建物類別" required prop="buildingType">
                    <el-select v-model="building.buildingType" placeholder="請選擇">
                        <el-option v-for="item in buildingTypes":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="屋齡[年]" required prop="buildingAge">
                    <el-select v-model="building.buildingAge" placeholder="請選擇">
                        <el-option v-for="item in buildingAges":key="item.value":label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="單價" prop="unitPrice">
            <el-input-number v-model="building.unitPrice" :min="0" :disabled="true"/>
            <el-slider v-model="building.unitPrice" range :marks="marks"  :disabled="true"/>
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="雙人房數量">
                    <el-input-number v-model="building.doubleBedRoom" :min="0" :max="120"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="單人房數量">
                    <el-input-number v-model="building.singleBedRoom" :min="0" :max="120"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="衛浴數量">
                    <el-input-number v-model="building.bathroom" :min="0" :max="120"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="公設比" prop=publicRatio>
                    <el-input-number v-model="building.publicRatio" :min="0" :max="120"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="預估合理權狀" prop="floorSize">
            <el-input-number v-model="building.floorSize" :min="0" :disabled="true"/>
        </el-form-item>
        <el-form-item label="總價" prop="unitPrice">
            <el-input-number v-model="building.unitPrice" :min="0" :disabled="true"/>
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
    <!-- <template #footer>
        <el-button type="info" @click="calculateMortgage(ruleFormRef)">試算總價與利息</el-button>
        資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html">財團法人金融聯合徵信中心 OpenAPI</a>
    </template> -->

<br v-if="checkedNeeds.includes('parenting')"/>
<el-card v-if="checkedNeeds.includes('parenting')">
    <template #header>
      <div class="card-header">
        <span>育兒試算</span>
      </div>
    </template>
    <el-form :model="form" label-width="auto">
        <el-form-item label="縣市" :span="10">
            <el-select v-model="form.county" placeholder="請選擇" @change="setTown($event)">
                <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="行政區" :span="10">
            <el-select v-model="form.town" placeholder="請選擇">
                <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
    </el-form>
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
    <el-form :model="form" label-width="auto">
        <el-form-item label="縣市" :span="10">
            <el-select v-model="form.county" placeholder="請選擇" @change="setTown($event)">
                <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="行政區" :span="10">
            <el-select v-model="form.town" placeholder="請選擇">
                <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
    </el-form>
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
    <el-form :model="form" label-width="auto">
    </el-form>
    <template #footer>
        資料來源：<a href="https://data.gov.tw/dataset/108265">家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分</a>
    </template>
</el-card>

<script setup>
import { onMounted, ref, reactive, watch,} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 設定檔案
const counties = ref([])
const townMap = reactive({})
const buildingTypes = ref([])
const buildingAges = ref([])
const genders = ref([])
onMounted(() => {
    setSelecOptions()
})
async function setSelecOptions(){
    try {
        if(import.meta.env.MODE==='development'){
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
            const resJson = await res.json()
            counties.value = resJson.counties || []
            buildingTypes.value = resJson.buildingTypes || []
            buildingAges.value = resJson.buildingAges || []
            genders.value = resJson.genders || []
            Object.assign(townMap, resJson.townMap)
        }
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
}
// 基本資料
const form = reactive({
    dateOfBirth: '1990-12-12',
    gender: 'M',
    age: '',
})

const building = reactive({
    county: '',
    town: '',
    buildingType: '',
    buildingAge: '',
    doubleBedRoom: 0,
    singleBedRoom: 0,
    bathroom: 0,
    publicRatio: 35,
})

const rules = reactive({
    dateOfBirth:{ required: true, message: '請選擇', },
    gender: { required: true, message: '請選擇', },
    county: { required: true, message: '請選擇', },
    town: { required: true, message: '請選擇', },
    buildingType:  { required: true, message: '請選擇', },
    buildingAge: { required: true, message: '請選擇', },
})
function handleDateOfBirthChanged() {
    calculateLifeExpectancy()
}
function handleGenderChanged() {
    calculateLifeExpectancy()
}
async function calculateLifeExpectancy() {
    const { dateOfBirth, gender, age } = form
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

        form.age = calculateAge
        form.lifeExpectancy = await res.json()
    }
}
// 需求分析
const needs = ref(['housing', 'parenting', 'retirement'])
const checkedNeeds = ref(['housing',])
const checkAll = ref(false)
const isIndeterminate = ref(true)
const needMap = {
    housing: '買房',
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
//
const towns = ref([])
// hooks
// methods
const ruleFormRef = ref()
async function calculateMortgage(formEl){
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/mortgage/contract`, {
        method: 'post',
        body: JSON.stringify(form),
        headers: {'Content-Type': 'application/json'}
    })
}
function setTown(county){
    towns.value = []
    if(county) {
        towns.value = townMap[county]
    }
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

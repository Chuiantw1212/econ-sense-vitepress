---
outline: deep
---

# 一生財務試算 (WIP)

1. 台灣唯一開源的線上個人財務規劃。一切數字有憑有據，不賣商品賣真相。
2. 工程師也可藉由開源的前後端程式碼學習Javscript。
3. 民眾也可以快速建立生涯財務觀念

## 基本資料
<!-- {{form}} -->
<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">

<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>必填寫資料</span>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="出生日期" required prop="dateOfBirth">
             <el-date-picker
                v-model="form.dateOfBirth"
                type="date"
                placeholder="選擇出生日期"
                @change="handleDateOfBirthChanged($event)"
            />
        </el-form-item>
        <el-form-item label="性別" required prop="gender">
            <el-select v-model="form.gender" placeholder="請選擇" @change="handleGenderChanged($event)">
                <el-option v-for="item in genders":key="item.value":label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="預估餘命" required prop="lifeExpectancy">
            <el-input-number v-model="form.lifeExpectancy" :min="0" :max="120" />
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

## 需求試算

目前只做到買房試算。

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
    <el-form-item label="居住縣市" required prop="county">
        <el-select v-model="form.county" placeholder="請選擇" @change="setTown($event)">
            <el-option v-for="item in counties":key="item.value":label="item.label" :value="item.value"/>
        </el-select>
    </el-form-item>
    <el-form-item label="行政區" required prop="town">
        <el-select v-model="form.town" placeholder="請選擇" :disabled="!form.county">
            <el-option v-for="item in towns":key="item.value":label="item.label" :value="item.value"/>
        </el-select>
    </el-form-item>
    <el-form-item label="建物類別" required prop="buildingType">
        <el-select v-model="form.buildingType" placeholder="請選擇">
            <el-option v-for="item in buildingTypes":key="item.value":label="item.label" :value="item.value"/>
        </el-select>
    </el-form-item>
    <el-form-item label="屋齡[年]" required prop="buildingAge">
        <el-select v-model="form.buildingAge" placeholder="請選擇">
            <el-option v-for="item in buildingAges":key="item.value":label="item.label" :value="item.value"/>
        </el-select>
    </el-form-item>
    <template #footer>
        <el-button type="info" @click="calculateMortgage(ruleFormRef)">試算總價與利息</el-button>
        <!-- 資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html">財團法人金融聯合徵信中心 OpenAPI</a> -->
    </template>
</el-card>

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

</el-form>

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
    county: '',
    town: '',
    buildingType: '',
    buildingAge: ''
})
const rules = reactive({
    dateOfBirth:{ required: true, message: '請選擇', },
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
    const { dateOfBirth, gender } = form
    if(dateOfBirth && gender){
        const ceYear = new Date().getFullYear()
        const yearOfBirth = dateOfBirth.slice(0,4)
        const age = ceYear - yearOfBirth
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calculate/lifeExpectancy`, {
            method: 'post',
            body: JSON.stringify({
                ceYear,
                age,
                gender,
            }),
            headers: {'Content-Type': 'application/json'}
        })
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
<style scoped>
:deep(.my-label) {
  background: white;
}
:deep(.my-content) {
  background: white;
}
</style>

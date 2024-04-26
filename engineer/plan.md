# 一生財務試算 (WIP)

自己做一個開源的個人財務計算機。要的是數字有憑有據，不低估也不高估自身財務狀況。

## 需求試算

<el-checkbox
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
</el-checkbox-group>
<br v-if="checkedNeeds.includes('housing')"/>
<el-card v-if="checkedNeeds.includes('housing')">
    <template #header>
      <div class="card-header">
        <span>買房試算</span>
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
        資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html">財團法人金融聯合徵信中心 OpenAPI</a>
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
        資料來源：<a href="https://data.gov.tw/dataset/108265">家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分</a>
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
        資料來源：<a href="https://data.gov.tw/dataset/108265">家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分</a>
    </template>
</el-card>

## 財務行為試算

### 儲蓄與投資

<el-card>
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
        資料來源：<a href="https://data.gov.tw/dataset/108265">家庭收支調查-平均每戶可支配所得及消費支出依可支配所得按戶數五等分位分及經濟戶長年齡組別分</a>
    </template>
</el-card>

<!-- <el-button plain @click="open">Click to open the Message Box</el-button> -->

<script setup>
import { onMounted, ref, reactive,} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const needs = ref(['housing', 'parenting', 'retirement'])
const checkedNeeds = ref(['housing', 'parenting', 'retirement'])
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

const counties = ref([])
const townMap = reactive({})
const towns = ref([])
const form = reactive({
    county:'',
    town:'',
})
// hooks
onMounted(async () => {
    let baseURL = ''
    try {
        if(import.meta.env.MODE==='development'){
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
            const resJson = await res.json()
            counties.value = resJson.counties ||[]
            Object.assign(townMap, resJson.townMap)
        }
        throw new Error("連線失敗")
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
})
// methods
function setTown(county){
    towns.value = []
    if(county) {
        towns.value = townMap[county]
    }
}
</script>

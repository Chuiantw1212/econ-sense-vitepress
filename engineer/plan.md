# 一生財務試算 (WIP)

自己做一個開源的個人財務計算機。

<el-card>
    <template #header>
      <div class="card-header">
        <span>房貸試算</span>
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

<script setup>
import { onMounted, ref, reactive} from 'vue'
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
    if(import.meta.env.MODE==='development'){
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/select`)
        const resJson = await res.json()
        counties.value = resJson.counties
        Object.assign(townMap, resJson.townMap)
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

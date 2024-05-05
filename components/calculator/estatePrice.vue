<template>
    <el-card>
        <el-form v-loading="estatePriceLoading" ref="ruleFormRef" label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="居住縣市" required>
                        <select v-model="estatePrice.county" class="form__select" placeholder="請選擇"
                            @change="onCountyChanged()">
                            <option label="請選擇" value=""></option>
                            <option v-for="item in config.counties" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="行政區" required>
                        <select v-model="estatePrice.town" class="form__select" placeholder="請選擇"
                            :disabled="!estatePrice.county" @change="calculateUnitPrice()">
                            <option label="請選擇" value=""></option>
                            <option v-for="item in towns" :key="item.value" :label="item.label" :value="item.value" />
                        </select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="屋齡[年]">
                        <select v-model="estatePrice.buildingAge" class="form__select" placeholder="請選擇"
                            :disabled="!estatePrice.town" @change="calculateUnitPrice()">
                            <option label="不限" value=""></option>
                            <option v-for="item in config.buildingAges" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="建物類別">
                        <select v-model="estatePrice.buildingType" class="form__select" placeholder="請選擇"
                            :disabled="!estatePrice.town" @change="calculateUnitPrice()">
                            <option label="不限" value=""></option>
                            <option v-for="item in config.buildingTypes" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="含車位">
                        <select v-model="estatePrice.hasParking" class="form__select" placeholder="請選擇"
                            @change="calculateUnitPrice()">
                            <option label="不限" value=""></option>
                            <option v-for="(item, index) in hasParkingOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="資料筆數">
                        <el-text>{{ Number(estatePrice.count).toLocaleString(undefined) }} 筆</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="23">
                    <el-form-item label="單價(萬/坪)">
                        <el-slider v-model="estatePrice.unitPrice" :min="estatePrice.pr25" :max="estatePrice.pr75"
                            :marks="unitPriceMarks" :disabled="!estatePrice.average" show-input
                            @change="updateEstateUnitPrice()" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { ElMessage, } from 'element-plus'
const { VITE_BASE_URL } = import.meta.env
const emits = defineEmits(['update:modelValue'])
const towns = ref([])
const hasParkingOptions = ref([
    { label: '含', value: true },
    { label: '不含', value: false },
])
const estatePriceLoading = ref(false)
let unitPriceMarks: {
    [key: string]: string
} = reactive({
    0: 'PR25：？',
    100: 'PR75：？'
})
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        }
    },
    config: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const estatePrice = computed(() => {
    return props.modelValue
})
function onCountyChanged() {
    estatePrice.value.town = ''
    towns.value = []
    calculateUnitPrice({
        propagate: true,
    })
}
async function calculateUnitPrice(options: any = { propagate: true }) {
    const { county } = estatePrice.value
    if (county) {
        towns.value = props.config.townMap[county]
    }

    const { propagate = true } = options
    const unitPricePromise = new Promise((resolve) => {
        debounce(async () => {
            const unitPrice = await getUnitPriceSync(propagate)
            resolve(unitPrice)
        })(propagate)
    })
    await unitPricePromise
}
function updateEstateUnitPrice() {
    emits('update:modelValue', estatePrice.value)
}
async function getUnitPriceSync(propagate = false) {
    const { county, town, } = estatePrice.value
    if (!county || !town) {
        return
    }
    estatePriceLoading.value = true
    const res = await fetch(`${VITE_BASE_URL}/calculate/unitPrice`, {
        method: 'post',
        body: JSON.stringify(estatePrice.value),
        headers: { 'Content-Type': 'application/json' }
    })
    estatePriceLoading.value = false
    const resJson = await res.json()
    Object.assign(estatePrice.value, resJson)

    const { pr25, pr75, average } = resJson
    if (!average) {
        ElMessage('資料筆數過少，請調整查詢條件')
        return
    }
    unitPriceMarks = {}
    unitPriceMarks[pr25] = `後: ${pr25}`
    unitPriceMarks[pr75] = `前: ${pr75}`
    unitPriceMarks[average] = `均：${average}` // 避免文字重疊
    estatePrice.value.unitPrice = average

    if (propagate) {
        emits('update:modelValue', estatePrice.value)
    }
    return estatePrice.value.unitPrice // 回傳再回傳
}

const debounceId = ref()
function debounce(func, delay = 100) {
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
    calculateUnitPrice,
})
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
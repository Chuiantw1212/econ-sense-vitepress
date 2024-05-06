<template>
    <div>
        <EstatePrice v-model="estatePrice" :config="config" :estateSize="estateSize" ref="EstatePriceRef"
            @update:model-value="onEstatePriceChanged()">
        </EstatePrice>
        <br />
        <EstateSize v-model="estateSize" :config="config" :parenting="parenting" :estatePrice="estatePrice"
            ref="EstateSizeRef">
        </EstateSize>
        <br />
        <el-row>
            <el-col :span="18">
                <el-form-item label="房屋總價">
                    <el-text>= 單價({{ estatePrice.unitPrice }}萬/坪) x 權狀({{
            estateSize.floorSize }}坪) = {{
            Number(tempTotalPrice).toLocaleString() }} NTD</el-text>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item>
                    <el-button @click="confirmUpdate()">確認帶回</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, onMounted, nextTick, watch } from 'vue'
import EstateSize from './estateSize.vue'
import EstatePrice from './estatePrice.vue'
const emits = defineEmits(['update:modelValue', 'confirm'])
const EstateSizeRef = ref()
const EstatePriceRef = ref()
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    estateSize: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        },
        required: true,
    },
})
const estateSize = ref({
    floorSize: 0,
    parkingSpace: 0,
    hasParking: ''
})
const estatePrice = ref({
    hasParking: '',
    unitPrice: 0,
})

async function onEstatePriceChanged() {
    EstateSizeRef.value.calculateEstateSize({
        propagate: false,
    })
    calculateTempPrice()
}
watch(() => estateSize.value, async (newValue, oldValue) => {
    const hasChangeParkingSpace = newValue.parkingSpace !== oldValue.parkingSpace
    const toZero = newValue.parkingSpace === 0
    if (hasChangeParkingSpace && toZero) {
        estatePrice.value.hasParking = ''
        await EstatePriceRef.value.calculateUnitPrice({
            propagate: true,
        })
    }
    calculateTempPrice()
}, { deep: true })

const tempTotalPrice = ref(0)
function calculateTempPrice() {
    const { unitPrice } = estatePrice.value
    const { floorSize } = estateSize.value
    if (unitPrice && floorSize) {
        tempTotalPrice.value = Math.floor(unitPrice * floorSize * 10000)
    }
}
async function calculateEstate() {
    await EstatePriceRef.value.calculateUnitPrice({
        propagate: true,
    })
    await EstateSizeRef.value.calculateEstateSize({
        propagate: true,
    })
    calculateTempPrice()
}
function confirmUpdate() {
    emits('confirm', {
        estatePrice: estatePrice.value,
        estateSize: estateSize.value,
    })
}
onMounted(() => {
    estatePrice.value = JSON.parse(JSON.stringify(props.estatePrice))
    estateSize.value = JSON.parse(JSON.stringify(props.estateSize))
    nextTick(() => {
        calculateEstate()
    })
})
</script>
<template>
    <el-form ref="ruleFormRef" label-width="auto">
        <el-row>
            <el-col :span="12">
                <el-form-item label="雙人房數量">
                    <el-input-number v-model="estateSize.doubleBedRoom" :min="0" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item v-if="parenting.headCount" label="房屋應容納人數">
                    <el-text>{{ parenting.headCount }} 人</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="單人房數量">
                    <el-input-number v-model="estateSize.singleBedRoom" :min="0" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="房屋可容納人數">
                    <el-text>{{ estateSize.doubleBedRoom * 2 + estateSize.singleBedRoom }} 人</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="客廳+餐廳">
                    <el-input-number v-model="estateSize.livingRoom" :min="1" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="衛浴數量">
                    <el-input-number v-model="estateSize.bathroom" :min="1" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估主建實坪">
                    <el-text>{{ estateSize.mainBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="陽台數量">
                    <el-input-number v-model="estateSize.balcany" :min="0" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估附屬建物">
                    <el-text>{{ estateSize.outBuilding }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="estatePrice.hasParking">
            <el-col :span="12">
                <el-form-item label="車位數量">
                    <el-input-number v-model="estateSize.parkingSpace" :min="0" @change="onParkingSpaceChanged()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估車位權狀">
                    <el-text>{{ estateSize.parkingSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="公設比(%)">
                    <el-input-number v-model="estateSize.publicRatio" :min="0" @change="calculateEstateSize()" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="預估權狀坪數">
                    <el-text>{{ estateSize.floorSize }} 坪</el-text>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
                <el-form-item label="總價">
                    <el-text>{{ Number(totalHousePrice).toLocaleString() }} 萬</el-text>
                </el-form-item>
            </el-col>
        </el-row> -->
    </el-form>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
const emits = defineEmits(['update:modelValue'])
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
    parenting: {
        type: Object,
        default: () => {
            return {}
        }
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const estateSize = computed(() => {
    return props.modelValue
})
function calculateEstateSize() {
    debounce(() => {
        debounceCalculate()
    })()
}
function debounceCalculate() {
    const { doubleBedRoom, singleBedRoom, bathroom, livingRoom, publicRatio, balcany, parkingSpace } = estateSize.value
    const headCount = 2 * doubleBedRoom + singleBedRoom
    estateSize.value.headCount = headCount

    const fortmatRatio = 0.3025
    const baseInteriorSize = 30 * fortmatRatio
    const doubleRoomSize = doubleBedRoom * 19 * fortmatRatio
    const singleRoomSize = singleBedRoom * 13 * fortmatRatio
    const bathRoomSize = bathroom * 4 * fortmatRatio
    const diningTableSize = Math.max(2, headCount) * livingRoom * fortmatRatio

    // 主建物只包含室內空間
    const mainBuilding = props.config.toFixed(baseInteriorSize + doubleRoomSize + singleRoomSize + bathRoomSize + diningTableSize)
    estateSize.value.mainBuilding = mainBuilding

    // 附屬建築比如陽台
    const balcanyPercent = 0.1 * balcany // 10%
    const outBuilding = props.config.toFixed(mainBuilding * balcanyPercent)
    estateSize.value.outBuilding = outBuilding

    // 公設比計算
    const publicRatioPercent = 1 + publicRatio / 100


    // 權狀坪數
    let floorSize = (mainBuilding + outBuilding) * publicRatioPercent
    // 停車位權狀
    if (props.estatePrice.hasParking) {
        const parkingSize = 24.75 * parkingSpace * fortmatRatio * publicRatioPercent
        estateSize.value.parkingSize = Number(Number(parkingSize).toFixed(2))
        floorSize += parkingSize
    }
    estateSize.value.floorSize = Number(Number(floorSize).toFixed(2))
}

const debounceId = ref(null)
function debounce(func, delay = 100) {
    return () => {
        clearTimeout(debounceId.value)
        debounceId.value = setTimeout(() => {
            debounceId.value = undefined
            func()
        }, delay)
    }
}

defineExpose({
    calculateEstateSize,
});
</script>
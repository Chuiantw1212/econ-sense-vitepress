<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="雙人房數量">
                        <el-input-number v-model="estateSize.doubleBedRoom" :min="0" @change="calculateEstateSize()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="家庭成員數">
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
                        <el-text :type="sizeType">{{ estateSize.doubleBedRoom * 2 + estateSize.singleBedRoom }}
                            人</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客廳+餐廳">
                        <el-input-number v-model="estateSize.livingRoom" :min="0" @change="calculateEstateSize()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="衛浴數量">
                        <el-input-number v-model="estateSize.bathroom" :min="0" @change="calculateEstateSize()" />
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
            <el-row v-show="estatePrice.hasParking">
                <el-col :span="12">
                    <el-form-item label="車位數量">
                        <el-input-number v-model="estateSize.parkingSpace" :min="0" @change="calculateEstateSize()" />
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
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明">
                    <table class="table">
                        <thead>
                            <tr>
                                <td>空間</td>
                                <td>參考平方公尺</td>
                                <td>參考依據</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>雙人房</td>
                                <td>19</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13"
                                        target="_blank">
                                        觀光旅館建築及設備標準
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>單人房</td>
                                <td>13</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0110021&flno=13"
                                        target="_blank">
                                        觀光旅館建築及設備標準
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>衛浴</td>
                                <td>4</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070115&flno=295"
                                        target="_blank">
                                        建築技術規則建築設計施工編
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>廚房</td>
                                <td>2~4</td>
                                <td>
                                    <a href="https://www.pro360.com.tw/category/kitchen_decorating#:~:text=%E4%B8%8D%E5%90%8C%E7%9A%84%E5%BB%9A%E5%85%B7%E9%85%8D%E7%BD%AE%E5%B0%8D,%E8%BC%83%E5%A5%BD%E7%9A%84%E4%BD%BF%E7%94%A8%E9%AB%94%E9%A9%97%E3%80%82"
                                        target="_blank">
                                        廚房空間如何規劃？廚房設計4大攻略及範例圖片參考｜PRO360達人網
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>餐廳+客廳</td>
                                <td>1/人</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060009&flno=322"
                                        target="_blank">
                                        職業安全衛生設施規則
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>其他室內空間</td>
                                <td>30</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=H0070037&flno=10"
                                        target="_blank">
                                        幼兒園及其分班基本設施設備標準
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>陽台</td>
                                <td>10%</td>
                                <td>
                                    <a href="https://law.moj.gov.tw/LawClass/LawSingleRela.aspx?PCODE=D0070115&FLNO=162&ty=L"
                                        target="_blank">
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
                                    <a href="https://www.google.com/search?q=%E5%85%AC%E8%A8%AD%E6%AF%94"
                                        target="_blank">
                                        Google搜索
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
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
        },
        required: true,
    }
})
const estateSize = computed(() => {
    return props.modelValue
})
const sizeType = computed(() => {
    const { headCount } = props.parenting
    const { doubleBedRoom, singleBedRoom } = estateSize.value
    const size = doubleBedRoom * 2 + singleBedRoom
    if (size >= headCount) {
        return ''
    } else {
        return 'danger'
    }
})
function calculateEstateSize(options: any = { propagate: true, skipDebounce: false }) {
    const { propagate = true, } = options
    debounce(() => {
        debounceCalculate(propagate)
    })(propagate)
}
function debounceCalculate(propagate = false) {
    const { doubleBedRoom, singleBedRoom, bathroom, livingRoom, publicRatio, balcany, parkingSpace } = estateSize.value
    // 家庭人數
    const headCount = 2 * doubleBedRoom + singleBedRoom
    estateSize.value.headCount = headCount
    // 計算空間
    const fortmatRatio = 0.3025
    const baseInteriorSize = 30 * fortmatRatio
    const doubleRoomSize = doubleBedRoom * 19 * fortmatRatio
    const singleRoomSize = singleBedRoom * 13 * fortmatRatio
    const bathRoomSize = bathroom * 4 * fortmatRatio
    const diningTableSize = Math.max(2, headCount) * livingRoom * fortmatRatio

    // 主建物只包含室內空間
    const mainBuilding = baseInteriorSize + doubleRoomSize + singleRoomSize + bathRoomSize + diningTableSize
    const formatmMinBuilding = Number(Number(mainBuilding).toFixed(2))
    estateSize.value.mainBuilding = formatmMinBuilding

    // 附屬建築比如陽台
    const balcanyPercent = 0.1 * balcany // 10%
    const outBuilding = mainBuilding * balcanyPercent
    const formatOutBuilding = Number(Number(outBuilding).toFixed(2))
    estateSize.value.outBuilding = formatOutBuilding

    // 公設比計算
    const publicRatioPercent = 1 + publicRatio / 100


    // 權狀坪數
    let floorSize = (mainBuilding + outBuilding) * publicRatioPercent
    // 停車位權狀
    if (props.estatePrice.hasParking) {
        const miumumParkingSpace = Math.max(1, parkingSpace)
        estateSize.value.parkingSpace = miumumParkingSpace
        const parkingSize = 24.75 * miumumParkingSpace * fortmatRatio * publicRatioPercent
        estateSize.value.parkingSize = Number(Number(parkingSize).toFixed(2))
        floorSize += parkingSize
    }
    estateSize.value.floorSize = Number(Number(floorSize).toFixed(2))

    if (propagate) {
        emits('update:modelValue', estateSize.value)
    }
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
    calculateEstateSize,
});
</script>
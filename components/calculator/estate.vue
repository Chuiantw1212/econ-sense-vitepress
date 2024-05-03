<template>
    <el-card>
        <el-form label-width="auto">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="頭期款預算">
                        <el-input-number v-model="estatePrice.budget" :min="0" @change="onBudgetChanged()" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="試算總價">
                        <el-text>{{ estatePrice.totalPrice }} NTD</el-text>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="試算說明" name="1" :border="true">
                    單價資料來源：<a href="https://www.jcic.org.tw/openapi/swagger/index.html" target="_blank">財團法人金融聯合徵信中心
                        OpenAPI
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
    estateSize: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const estatePrice = computed(() => {
    return props.modelValue
})
function onBudgetChanged() {
    emits('update:modelValue', estatePrice)
}
function calculateTotalPrice(options: any = { propagate: true }) {
    const { propagate = true } = options
    const { unitPrice } = estatePrice.value
    const { floorSize } = props.estateSize
    if (!unitPrice || !floorSize) {
        return
    }
    const beforeFormatPrice = Number(unitPrice) * Number(floorSize)
    estatePrice.value.totalPrice = Number(beforeFormatPrice.toFixed(2))
    if (propagate) {
        emits('update:modelValue', estatePrice)
    }
}
defineExpose({
    calculateTotalPrice,
})
</script>
<style lang="scss">
.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular) !important;
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
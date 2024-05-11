<template>
    <el-card v-loading="storyLoading">
        <template #header>
            <div class="card-header card-header--custom">
                <span>回顧與匯出
                </span>
                <div>
                    <el-button v-if="!profile.story" @click="generatStory">用15秒產生回顧</el-button>
                    <el-button v-else @click="generatStory">重新產生回顧</el-button>
                    <el-button @click="exportUserForm()">匯出</el-button>
                </div>
            </div>
        </template>
        <el-form label-width="auto">
            <div v-if="profile.story" v-html="profile.story">

            </div>
            <div v-else>
                點選右上角，讓我們回顧......
            </div>
            <canvas id="lifeAssetChart"></canvas>
        </el-form>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="匯出說明" name="1">
                    匯出給不敢登入又想保留紀錄的用戶使用。
                    <ul>
                        <li>按下匯出，會取得一包"開源財務規劃.json"。</li>
                        <li>下次使用就可直接匯入</li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
const { VITE_BASE_URL } = import.meta.env
const emits = defineEmits(['update:modelValue', 'export'])
const storyLoading = ref(false)
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    config: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    career: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    asset: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    spouse: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    mortgage: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    parenting: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    retirement: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
    estatePrice: {
        type: Object,
        default: () => {
            return {}
        },
        required: true
    },
})
const profile = computed(() => {
    return props.modelValue
})
// methods
let assetChartInstance = ref<Chart>()
function calculateLifeAssetChart(payload) {
    const {
        retirementAsset,
        secutiryAsset,
    } = payload

    console.log({
        retirementAsset,
        secutiryAsset
    })

    const { irr } = props.asset
    const { currentYear, inflationRate } = props.config
    const { downpayTotalPrice, debtData = [], downpayYear } = props.mortgage
    const { irrOverDecade } = props.retirement.pension
    const { yearsToRetirement, yearOfRetire } = props.retirement
    const { lifeExpectancy } = profile.value


    const datasets = []
    const assetData: number[] = []
    const estateAsset: number[] = []
    const estateDebtData: number[] = []
    const retireAssetData: number[] = []
    const labels: number[] = []
    const inflationModifier = 1 + inflationRate / 100
    let inflatedEstateAsset = downpayTotalPrice

    for (let i = 0; i < lifeExpectancy - 1; i++) {
        const year = currentYear + 1 + i
        labels.push(year)
        // data
        const secutiryValue = secutiryAsset[i]
        assetData.push(secutiryValue)
        inflatedEstateAsset *= inflationModifier
        // retirement
        if (year > yearOfRetire) {
            const retireAssetValue = retirementAsset.shift()
            retireAssetData.push(Math.floor(retireAssetValue))
        } else {
            retireAssetData.push(0)
        }
        // estate
        if (year > downpayYear) {
            estateAsset.push(Math.floor(inflatedEstateAsset))
            const debtValue = debtData.shift()
            estateDebtData.push(-debtValue)
        } else {
            estateAsset.push(0)
            estateDebtData.push(0)
        }
    }
    //
    const tension = 0.5
    datasets.push({
        label: '證券資產',
        data: assetData,
        fill: true,
        tension,
    })
    datasets.push({
        label: '房貸負債',
        data: estateDebtData,
        fill: true,
        tension,
    })
    datasets.push({
        label: '房地產',
        data: estateAsset,
        fill: true,
        tension,
    })
    datasets.push({
        label: '退休金',
        data: retireAssetData,
        fill: true,
        tension,
    })
    //
    const chartData = {
        datasets,
        labels,
    }
    if (assetChartInstance.value) {
        assetChartInstance.value.data = chartData
        assetChartInstance.value.update()
    } else {
        const ctx: any = document.getElementById('lifeAssetChart')
        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        })
        assetChartInstance = shallowRef(chartInstance)
    }
}
async function generatStory() {
    storyLoading.value = true
    const humanStory = getHumanStory()
    const res = await fetch(`${VITE_BASE_URL}/chat/story`, {
        method: 'post',
        body: JSON.stringify(humanStory),
        headers: { 'Content-Type': 'application/json' }
    })
    const resJson = await res.text()
    storyLoading.value = false
    profile.value.story = resJson
    emits('update:modelValue', profile.value)
}

function getHumanStory() {
    const { spouse, parenting, mortgage, estatePrice, career, retirement } = props
    const { counties = [], insuranceTypes = [], townMap = {} } = props.config
    const { longevity, yearOfBirth, careerInsuranceType } = profile.value
    const { careerHeadCount, } = career
    const { age: retireAge, qualityLevel, insurance } = retirement
    const { yearOfMarriage } = spouse
    const { headCount, independantAge } = parenting
    const { downpayYear } = mortgage
    const { county, town } = estatePrice

    let story = ``
    // profile
    story += `你於${Math.floor(yearOfBirth)}年，誕生到個世界上，`
    story += `於${Math.floor(yearOfBirth + longevity)}年時，悄悄的離開，`
    story += `在這${Math.floor(longevity)}間，你有著屬於自己的故事。`
    // career
    const insuranceTypeItem = insuranceTypes.find(item => item.value === careerInsuranceType)
    if (insuranceTypeItem) {
        story += `畢業後，你選擇成為一個${insuranceTypeItem.label}，`
    }
    if (careerHeadCount) {// 企業主
        story += `成立了${careerHeadCount}人公司，`
    }
    if (insurance.futureSeniority) {
        story += `競競業業的工作持續了${Math.floor(insurance.futureSeniority)}年。`
    }
    // spouse
    if (yearOfMarriage) {
        story += `感情方面，你在${yearOfMarriage}年時，遇見你的真愛，`
    }
    if (headCount > 1) {
        story += `你們共組了${headCount}人的家庭，`
    }
    if (independantAge) {
        story += `並將照顧子女的責任，延續到他們${independantAge}歲了為止。`
    }
    // mortgage
    if (downpayYear) {
        story += `${downpayYear}年是你置產的時間，這得來不易的安居地`
        if (county) {
            const countyItem = counties.find(item => item.value === county)
            if (countyItem) {
                story += `坐落於${countyItem.label}`
                if (town) {
                    const towns = townMap[county]
                    const townItem = towns.find(item => item.value === town)
                    if (townItem) {
                        story += `${townItem.label}，`
                    }
                }
            }
        }
        story += `為你提供了一切生活所需。`
    }
    const qualityLevelLabel = ['清貧', '尚可', '普通', '不錯', '優渥']
    story += `你在${retireAge}歲時選擇退休，並維持著${qualityLevelLabel[qualityLevel - 1]}的退休生活，直到生命的最後一天。`
    return story
}
async function exportUserForm() {
    emits('export')
}

defineExpose({
    calculateLifeAssetChart,
})
</script>
<style lang="scss">
.card-header--custom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header__btnGroup {
        display: flex;
        gap: 8px;
    }
}
</style>
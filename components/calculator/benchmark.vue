<template>
    <el-card>
        <template #header>
            <div class="card-header card-header--custom">
                <span>回顧與匯出
                </span>
                <div>
                    <el-button v-loading="storyLoading" @click="generatStory">回顧</el-button>
                    <el-button @click="exportUserForm()">匯出</el-button>
                </div>
            </div>
        </template>
        <el-form label-width="auto">
            <div v-if="modelValue.profile.story" v-html="modelValue.profile.story">

            </div>
            <div v-else>
                點選右上角，讓我們回顧......
            </div>
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
import { ref, computed, shallowRef, reactive, watch } from 'vue'
const { VITE_BASE_URL } = import.meta.env
const emits = defineEmits(['update:modelValue', 'export'])
const storyLoading = ref(false)
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
const userForm = computed(() => {
    return props.modelValue
})

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
    userForm.value.profile.story = resJson
    emits('update:modelValue', userForm.value)
}

function getHumanStory() {
    const { profile, spouse, parenting, mortgage, estatePrice, career, retirement } = userForm.value
    const { counties = [], insuranceTypes = [], townMap = {} } = props.config

    const { yearOfBirth, age: profileAge, lifeExpectancy: profilelifeExpectancy, careerInsuranceType } = profile

    const { careerHeadCount, } = career
    const { age: retireAge, qualityLevel, futureSeniority, insurance } = retirement

    const { yearOfMarriage } = spouse
    const { headCount, independantAge } = parenting
    const { downpayYear } = mortgage
    const { county, town } = estatePrice

    const totalAge = profileAge + profilelifeExpectancy
    let story = ``
    // profile
    story += `你於${Math.floor(yearOfBirth)}年，來到個世界上，`
    story += `於${Math.floor(yearOfBirth + totalAge)}年時，悄悄的離開，`
    story += `在這${Math.floor(totalAge)}間，你有著屬於自己的故事。`
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
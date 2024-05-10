<template>
    <el-card>
        <template #header>
            <div class="card-header card-header--custom">
                <span>財務回顧
                </span>
            </div>
        </template>
        <el-form label-width="auto">
            <!-- {{config.counties}} -->
            {{ meetChatGpt() }}
            <!-- <p>你享壽{{ userForm.profile.age + userForm.profile.lifeExpectancy }}歲，</p>
            <p>在{{ userForm.spouse.yearOfMarriage }}年時，遇見你的真愛，</p>
            <p></p> -->
            <!-- <el-row>
                <el-col :span="12">
                    <el-form-item label="享壽">
                        {{ userForm.profile.age + userForm.profile.lifeExpectancy }} 歲
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>

                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>
    </el-card>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, reactive, watch } from 'vue'
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

function meetChatGpt() {
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
    story += `你於${yearOfBirth}年，來到個世界上，`
    story += `於${yearOfBirth + totalAge}年時，悄悄的離開，`
    story += `在這${totalAge}間，你有著屬於自己的故事。`
    // career
    const insuranceTypeItem = insuranceTypes.find(item => item.value === careerInsuranceType)
    if (insuranceTypeItem) {
        story += `畢業後，你選擇成為一個${insuranceTypeItem.label}，`
    }
    if (careerHeadCount) {// 企業主
        story += `成立了${careerHeadCount}人公司，`
    }
    if (insurance.futureSeniority) {
        story += `競競業業的工作了${insurance.futureSeniority}年，並在${retireAge}歲時選擇退休。`
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
    story += `你維持著${qualityLevelLabel[qualityLevel - 1]}的退休生活，直到生命的最後一天。`
    return story
}
</script>
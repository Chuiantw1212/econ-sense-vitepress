<template>
    <el-card class=card>
        <el-form label-width="auto">
            <el-row class="card__row">
                <el-button type="primary" @click="generateHusband()">生成父</el-button>
                <el-button type="primary" @click="generateWife()">生成母</el-button>
            </el-row>
            <br>
            <table class="table">
                <thead>
                    <tr>
                        <td>染色體與對數</td>
                        <td>父</td>
                        <td>母</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>TT</td>
                        <td>{{ husband.filter(pair => pair === 'TT').length }}對</td>
                        <td>{{ wife.filter(pair => pair === 'TT').length }}對</td>
                    </tr>
                    <tr>
                        <td>Tt</td>
                        <td>{{ husband.filter(pair => pair === 'Tt').length }}對</td>
                        <td>{{ wife.filter(pair => pair === 'Tt').length }}對</td>
                    </tr>
                    <tr>
                        <td>tt</td>
                        <td>{{ husband.filter(pair => pair === 'tt').length }}對</td>
                        <td>{{ wife.filter(pair => pair === 'tt').length }}對</td>
                    </tr>
                </tbody>
            </table>
            <el-collapse>
                <el-collapse-item title="展開父母染色體">
                    <table class="table">
                        <thead>
                            <tr>
                                <td>父親</td>
                                <td>母親</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(number, index) in 46 - 1" :key="index">
                                <td>{{ husband[number] }}</td>
                                <td>{{ wife[number] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-collapse-item>
            </el-collapse>
            <br>
            <el-row class="card__row">
                <el-button type="primary" @click="generateChild()">生小孩</el-button>
            </el-row>
            <br>
            <el-row>
                <table class="table">
                    <thead>
                        <tr>
                            <td>比較</td>
                            <td>與父親</td>
                            <td>與母親</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>相似度</td>
                            <td>{{ husbandSimilarity }}%</td>
                            <td>{{ wifeSimilarity }}%</td>
                        </tr>
                        <tr>
                            <td>叛逆度</td>
                            <td>{{ 100 - husbandSimilarity }}%</td>
                            <td>{{ 100 - wifeSimilarity }}%</td>
                        </tr>
                    </tbody>
                </table>
            </el-row>
            <el-collapse>
                <el-collapse-item title="展開孩子染色體">
                    <table class="table">
                        <thead>
                            <tr>
                                <td>染色體</td>
                                <td>表現</td>
                                <td>表現與父相同</td>
                                <td>表現與母相同</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(pair, index) in child" :key="index">
                                <td>{{ pair }}</td>
                                <td>{{ pair[0] }}</td>
                                <td>{{ pair[0] === husband[index][0] ? '是' : '否' }}</td>
                                <td>{{ pair[0] === wife[index][0] ? '是' : '否' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <template #footer>
            <ul>
                <li>
                    人類染色體有46對，區分顯性隱性，此處以Tt表示。
                </li>
                <li>
                    假設一對染色體影響一個獨立特徵。
                </li>
            </ul>
        </template>
    </el-card>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const husband = ref([])
const wife = ref([])
const child = ref([])
const husbandSimilarity = ref(0)
const wifeSimilarity = ref(0)
const rebelIndex = ref(0)
onMounted(() => {
    generateHusband()
    generateWife()
    generateChild()
})
function generateHusband() {
    husband.value = []
    let pair: string = ''
    for (let i = 0; i < 46; i++) {
        const seed = Math.random()
        if (seed >= 0.75) {
            pair = 'TT'
        } else if (seed >= 0.25) {
            pair = 'Tt'
        } else {
            pair = 'tt'
        }
        husband.value.push(pair)
    }
}
function generateWife() {
    wife.value = []
    let pair: string = ''
    for (let i = 0; i < 46; i++) {
        const seed = Math.random()
        if (seed >= 0.75) {
            pair = 'TT'
        } else if (seed >= 0.25) {
            pair = 'Tt'
        } else {
            pair = 'tt'
        }
        wife.value.push(pair)
    }
}
function generateChild() {
    child.value = []
    for (let i = 0; i < 46; i++) {
        let pair: string = ''
        // first
        const first = Math.random()
        if (first >= 0.5) {
            pair += husband.value[i][0]
            const second = Math.random()
            if (second >= 0.5) {
                pair += wife.value[i][0]
            } else {
                pair += wife.value[i][1]
            }
        } else {
            pair += wife.value[i][0]
            const second = Math.random()
            if (second >= 0.5) {
                pair += husband.value[i][0]
            } else {
                pair += husband.value[i][1]
            }
        }
        // set
        child.value.push(pair)
    }
    // 相似度
    let husbandCount = 0
    for (let i = 0; i < 46; i++) {
        const childDominance = child.value[i][0]
        const husbandDominance = husband.value[i][0]
        if (childDominance === husbandDominance) {
            husbandCount += 1
        }
    }
    husbandSimilarity.value = Math.floor(husbandCount / 46 * 100)
    // 
    let wifeCount = 0
    for (let i = 0; i < 46; i++) {
        const childDominance = child.value[i][0]
        const wifeDominance = wife.value[i][0]
        if (childDominance === wifeDominance) {
            wifeCount += 1
        }
    }
    wifeSimilarity.value = Math.floor(wifeCount / 46 * 100)
    // //
    // let rebelCount = 0
    // for (let i = 0; i < 46; i++) {
    //     const childDominance = child.value[i][0]
    //     const husbandDominance = husband.value[i][0]
    //     const wifeDominance = wife.value[i][0]
    //     if (childDominance !== husbandDominance && childDominance !== wifeDominance) {
    //         rebelCount += 1
    //     }
    // }
    // rebelIndex.value = Math.floor(rebelCount / 46 * 100)
}
</script>
<style lang="scss" scoped>
.card__row {
    display: flex;
    justify-content: center;
}
</style>
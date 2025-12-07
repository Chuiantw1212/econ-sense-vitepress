<template>
    <h2 id="心火七職測驗" tabindex="-1">心火七職測驗 <a class="header-anchor" href="#心火七職測驗"
            aria-label="Permalink to &quot;心火七職測驗&quot;">&ZeroWidthSpace;</a></h2>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>選20~30個感興趣的關鍵字 (已選{{ selectedKeywords.length }}個)</span>
                <el-button @click="selectedKeywords = []">重做測驗</el-button>
            </div>
        </template>
        <el-row>
            <el-checkbox-group v-model="selectedKeywords">
                <el-checkbox v-for="(item, index) in shuffledKeywords" :key="index" :label="item.label"
                    :value="item.label" @change="drawCharts()" />
            </el-checkbox-group>
        </el-row>
        <br />
        <canvas id="core7"></canvas>
        <div class="buttonGroup">
            <el-button v-if="isAnalyzed || selectedKeywords.length >= 20" class="form__button" type="primary"
                :disabled="selectedKeywords.length < 10" @click="shareRadar()">分享雷達圖</el-button>
        </div>
        <template #footer>
            <el-collapse>
                <el-collapse-item title="說明">
                    <ul>
                        <li>
                            資料來源：<a href="https://www.onetcenter.org/dictionary/28.3/excel/riasec_keywords.html"
                                target="_blank">O*NET RIASEC Keywords</a>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card>
</template>
<script setup lang="ts">
interface hollandItem {
    'Element Name': string,
    'Keyword Zh': string,
}
interface interestItemDesign {
    label?: string,
    OISum?: number,
    OIs?: number[]
    IHs?: string[],
    similarity?: number,
    alternateName?: string,
    jobZone?: number,
}

import Chart from 'chart.js/auto';
import Fuse from 'fuse.js'
import html2canvas from 'html2canvas';
import { ref, shallowRef, onMounted } from 'vue'
import { ElMessage, } from 'element-plus'
const shuffledKeywords = ref<any[]>([])
const selectedKeywords = ref<any[]>([])
const core7Codes = ref<{
    label: string,
    value: 'Hunter' | 'Gatherer' | 'Helper' | 'Keeper' | 'Maker' | 'Dreamer' | 'Elder'
}[]>([
    {
        label: '狩獵者',
        value: 'Hunter'
    },
    {
        label: '採集者',
        value: 'Gatherer'
    },
    {
        label: '助人者',
        value: 'Helper'
    },
    {
        label: '傳夢人',
        value: 'Dreamer',
    },
    {
        label: '守夜人',
        value: 'Keeper'
    },
    {
        label: '工匠',
        value: 'Maker'
    },
    {
        label: '長老',
        value: 'Elder'
    },
])
const userHollandVectors = ref<number[]>([])
const selectedCodes = ref<string[]>([])
const selectedCodesOrigin = ref<string[]>([])
const interestOccupationItems = ref<interestItemDesign[]>([])
const recommendOccupations = ref<interestItemDesign[]>([])
const pagedTotalOccupations = ref<number>(0)
const pagedOccupations = ref<interestItemDesign[]>([])
const currentPage = ref<number>(1)
const userKeyword = ref<string>('')
const fuseInstance = ref()
const isAnalyzed = ref<boolean>(false)
const fullscreenLoading = ref<boolean>(false)
let core7Instance = ref<Chart>()

// hooks
onMounted(async () => {
    await initializeKeywords()
});

// methods
async function shareTable() {
    fullscreenLoading.value = true
    const occupationTable = document.querySelector<HTMLTableElement>('#occupationTable')
    const canvas = await html2canvas(occupationTable)
    await callNavigatorShare(canvas)
    fullscreenLoading.value = false
}
function shareRadar() {
    fullscreenLoading.value = true
    const core7Canvas = core7Instance.value.canvas
    callNavigatorShare(core7Canvas)
    fullscreenLoading.value = false
}
async function callNavigatorShare(canvas) {
    if (!navigator.share) {
        ElMessage.info('不支援Web Share API')
        return
    }
    const dataUrl = canvas.toDataURL();
    const blob = await (await fetch(dataUrl)).blob();
    const filesArray = [
        new File(
            [blob],
            'riasec.png',
            {
                type: blob.type,
                lastModified: new Date().getTime()
            }
        )
    ];


    const shareConfig = {
        files: filesArray,
        title: '心火七職測驗',
        url: `${window.location.href}?openExternalBrowser=1` || 'https://en-chu.com?openExternalBrowser=1',
        text: '透過七種人類原型角色，探索你內在的行動偏好與生存天性，產出專屬雷達圖！',
    }

    try {
        navigator.share(shareConfig);
    } catch (error) {
        ElMessage.info(error.message || error)
    }
}
function setPagedOccupations() {
    const keyword = String(userKeyword.value).trim()
    if (keyword) {
        fuseInstance.value.setCollection(recommendOccupations.value)
        const searchResult = fuseInstance.value.search(keyword)
        pagedTotalOccupations.value = searchResult.length
        let pagedResult = searchResult.map(search => search.item)
        pagedResult.sort((a, b) => {
            const similarityA = a.similarity || 0
            const similarityB = b.similarity || 0
            return similarityB - similarityA
        })
        pagedResult = pagedResult.slice((currentPage.value - 1) * 10, (currentPage.value) * 10)
        pagedOccupations.value = pagedResult
    } else {
        const result = recommendOccupations.value.slice((currentPage.value - 1) * 10, (currentPage.value) * 10)
        pagedTotalOccupations.value = recommendOccupations.value.length
        pagedOccupations.value = result
    }
}
async function onHollandCodeChanged() {
    currentPage.value = 1
    setRecommendOccupations()
    setPagedOccupations()
}
async function setRecommendOccupations() {
    recommendOccupations.value = []
    interestOccupationItems.value.forEach(item => {
        item.similarity = 0
        const { OIs = [] } = item
        const similarity = manhattanDistance(OIs, userHollandVectors.value)
        item.similarity = Math.max(Math.round(similarity), 0)
    })
    interestOccupationItems.value.sort((a, b) => {
        const similarityA = a.similarity || 0
        const similarityB = b.similarity || 0
        return similarityB - similarityA
    })

    if (!selectedCodes.value.length) {
        recommendOccupations.value = interestOccupationItems.value
        return
    }
    const filteredItems = interestOccupationItems.value.filter(item => {
        const hasMatchedCode = selectedCodes.value.every(code => {
            return item.IHs?.includes(code)
        })
        return hasMatchedCode
    })
    recommendOccupations.value = filteredItems
}
function manhattanDistance(vectorsA: number[], verctorsB: number[]) {
    let diffSum = 0
    vectorsA.forEach((valueA, index) => {
        const valueB = verctorsB[index]
        const diff = (valueA - valueB) / 100 * (valueA - valueB) / 100
        diffSum += diff
    })
    return (1 - Math.sqrt(diffSum)) * 100
}
async function initializeKeywords() {
    const keywordsResponse = await fetch("growth/core7Keywords.json");
    const keywordsJson: hollandItem[] = await keywordsResponse.json();
    const formatKeywords = keywordsJson.map((item: hollandItem) => {
        return {
            label: item['Keyword Zh'],
            value: item['Element Name']
        }
    })
    const firstShuffledResult: {
        label: string,
        value: string,
    }[] = shuffle(formatKeywords)
    const twoWords = firstShuffledResult.filter(item => item.label.length === 2)
    const threeWords = firstShuffledResult.filter(item => item.label.length === 3)
    const fourWords = firstShuffledResult.filter(item => item.label.length >= 4)
    shuffledKeywords.value = [...twoWords, ...threeWords, ...fourWords]
}
function drawCharts() {
    // set user holland vectors
    const hollandCodeKeywords: string[] = selectedKeywords.value.map((selectedLabel: string) => {
        const selectedItem = shuffledKeywords.value.find(item => {
            return item.label === selectedLabel
        })
        return selectedItem?.value || ''
    })
    const core7Raw = {
        'Hunter': 0,
        'Gatherer': 0,
        'Helper': 0,
        'Dreamer': 0,
        'Keeper': 0,
        'Maker': 0,
        'Elder': 0,
    }
    hollandCodeKeywords.forEach(value => {
        const code = value
        core7Raw[code] += 1
    })
    const riasecVectors: number[] = []
    for (let key in core7Raw) {
        let count = core7Raw[key]
        count = count / selectedKeywords.value.length * 100
        count = Math.round(count)
        riasecVectors.push(count)
    }
    // set holland code selected
    const dataValues = riasecVectors
    selectedCodes.value = []
    dataValues.forEach((value, index) => {
        if (value >= 17) {
            const hollanCodeItem = core7Codes.value[index]
            selectedCodes.value.push(hollanCodeItem.value)
        }
    })
    if (selectedCodes.value.length > 3) {
        selectedCodes.value = []
        dataValues.forEach((value, index) => {
            if (value >= 33) {
                const hollanCodeItem = core7Codes.value[index]
                selectedCodes.value.push(hollanCodeItem.value)
            }
        })
    }
    selectedCodesOrigin.value = [...selectedCodes.value]
    const riasecAdjustVectors: number[] = []
    for (let key in core7Raw) {
        let count = core7Raw[key] + 1
        const deno = selectedKeywords.value.length + 6
        count = count / deno * 100
        riasecAdjustVectors.push(count)
    }
    userHollandVectors.value = riasecAdjustVectors
    onHollandCodeChanged()
    // update chart
    const data: any = {
        labels: ['狩獵者', '採集者', '助人者', '傳夢人', '守夜人', '工匠', '長老',],
        datasets: [{
            label: '心火七職',
            data: riasecVectors,
        }],
    }
    if (core7Instance.value) {
        core7Instance.value.data = data
        core7Instance.value.update()
        return
    }
    const ctx: any = document.getElementById('core7')
    const chartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: showPercent,
                    }
                },
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '心火七職雷達圖'
                }
            }
        },
    })
    core7Instance = shallowRef(chartInstance) as any
}
function showPercent(tooltipItems) {
    const { raw, dataset, } = tooltipItems
    const fisrtValue = raw
    return `${fisrtValue}%`
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
</script>
<style lang="scss" scoped>
.table {
    * {
        border-color: var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: white !important;
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
}
</style>
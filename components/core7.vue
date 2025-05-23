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
            <!-- <el-button v-else class="form__button" type="primary" :disabled="selectedKeywords.length < 10"
                @click="forwardToTable()">前往職務適性比較</el-button> -->
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
    <!-- <h2 id="職務適性比較" tabindex="-1">職務適性比較 <a class="header-anchor" href="#職務適性比較"
            aria-label="Permalink to &quot;職務適性比較&quot;">&ZeroWidthSpace;</a></h2>
    <el-card>
        <el-form-item label="何倫碼">
            <el-checkbox-group v-model="selectedCodes">
                <el-checkbox v-for="(code, index) in core7Codes" :key="index" :label="`${code.label}(${code.value})`"
                    :disabled="selectedCodes.length >= 3 && !selectedCodes.includes(code.value)" :value="code.value"
                    @change="onHollandCodeChanged()" />
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="進階篩選">
            <el-input v-model="userKeyword" placeholder="請輸入想探索的職務名稱" clearable @input="onKeywordChanged()" />
        </el-form-item>
        <table id="occupationTable" class="table">
            <thead>
                <tr>
                    <th>專業頭銜</th>
                    <th>求職門檻</th>
                    <th>何倫碼</th>
                    <th v-if="selectedKeywords.length">潛力指數</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, index) in pagedOccupations" :key="index">
                    <tr>
                        <td>{{ item.label }}</td>
                        <td>{{ item.jobZone }}</td>
                        <td>{{ item.IHs?.join('') }}</td>
                        <td v-if="selectedKeywords.length">{{ item.similarity }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="example-pagination-block">
            <el-pagination v-model:current-page="currentPage" layout="prev, pager, next" :page-size="10"
                :total="pagedTotalOccupations" @change="setPagedOccupations()" />
        </div>
        <div class="buttonGroup">
            <el-button class="form__button" type="primary" :disabled="selectedKeywords.length < 10"
                @click="shareRadar()">分享雷達圖</el-button>
            <el-button v-loading.fullscreen.lock="fullscreenLoading" class="form__button" type="primary"
                :disabled="selectedKeywords.length < 10" @click="shareTable()">分享此頁表格</el-button>
        </div>
        <template #footer>
            <el-collapse v-model="occupationCollapse">
                <el-collapse-item title="求職門檻分數查表" name="1">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>分數</th>
                                <th>教育程度參考</th>
                                <th>工作經驗參考</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>不限</td>
                                <td>數天或數月的訓練</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>高中職</td>
                                <td>數月~1年</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>技職教育/在職經驗/二專/五專</td>
                                <td>1~2年</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>學士學位</td>
                                <td>多年工作經驗</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>碩士及以上</td>
                                <td>自證的實績</td>
                            </tr>
                        </tbody>
                    </table>
                </el-collapse-item>
                <el-collapse-item title="說明">
                    <ul>
                        <li>
                            使用ChatGpt進行機翻。搜索欄除了中文也可以使用英文進行篩選。
                        </li>
                        <li>
                            維基百科的說明：<a target="_blank"
                                href="https://zh.wikipedia.org/zh-tw/%E9%9C%8D%E7%88%BE%E8%98%AD%E5%85%AD%E9%82%8A%E5%BD%A2#:~:text=%E9%9C%8D%E7%88%BE%E8%98%AD%E5%85%AD%E9%82%8A%E5%BD%A2%EF%BC%88%E8%8B%B1%E8%AA%9E%EF%BC%9AHolland%20Hexagon%2F,%E5%80%8B%E4%BA%BA%E4%BA%BA%E6%A0%BC%E7%89%B9%E8%B3%AA%E7%9A%84%E8%81%B7%E6%A5%AD%E3%80%82">霍爾蘭六邊形</a>
                        </li>
                        <li>
                            潛力指數使用<a target="_blank"
                                href="https://zh.wikipedia.org/zh-tw/%E6%9B%BC%E5%93%88%E9%A0%93%E8%B7%9D%E9%9B%A2">曼哈頓距離</a>計算
                        </li>
                        <li>
                            資料來源：<a href="https://www.onetcenter.org/dictionary/28.3/excel/interests.html"
                                target="_blank">O*NET Interests</a>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </template>
    </el-card> -->
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
const occupationCollapse = ref<string[]>([])
const isAnalyzed = ref<boolean>(false)
const fullscreenLoading = ref<boolean>(false)
let core7Instance = ref<Chart>()

// hooks
onMounted(async () => {
    await initializeKeywords()
    // await initializeInterests()
    // initizlieFuzzySearch()
    // drawCharts()
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
    if (selectedCodesOrigin.value.length) {
        const core7CodeString = selectedCodesOrigin.value.join()
        const userLabels = core7Codes.value.filter(item => {
            return selectedCodesOrigin.value.includes(item.value)
        }).map(item => item.label).join('、')
        shareConfig.text = `我的Holland Code是${core7CodeString}，這代表我更傾向於${userLabels}職業。快來測試你的職業性格吧！`
    }

    try {
        navigator.share(shareConfig);
    } catch (error) {
        ElMessage.info(error.message || error)
    }
}
function forwardToTable() {
    isAnalyzed.value = true
    const cardAdapt = document.querySelector('#職務適性比較')
    cardAdapt.scrollIntoView({
        behavior: "smooth",
    })
}
function onKeywordChanged() {
    currentPage.value = 1
    setPagedOccupations()
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
function initizlieFuzzySearch() {
    const options = {
        location: 4,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        threshold: 0.4,
        distance: 100,
        keys: ['label', 'alternateName']
    }
    const fuse = new Fuse(recommendOccupations.value, options)
    fuseInstance.value = fuse
}
async function initializeInterests() {
    const interestResponse = await fetch("core7.json");
    console.log({
        interestResponse
    })
    // const interestJson = await interestResponse.json();
    // interestOccupationItems.value = interestJson
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
<template>
    <div>
        <h2 id="興趣何綸碼測驗" tabindex="-1">興趣何綸碼測驗 <a class="header-anchor" href="#興趣何綸碼測驗"
                aria-label="Permalink to &quot;興趣何綸碼測驗&quot;">&ZeroWidthSpace;</a></h2>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>建議選10~20個關鍵字 (已選{{ selectedKeywords.length }}個)</span>
                </div>
            </template>
            <el-row>
                <el-checkbox-group v-model="selectedKeywords">
                    <el-checkbox v-for="(item, index) in shuffledKeywords" :key="index" :label="item.label"
                        :value="item.label" @change="drawCharts()" />
                </el-checkbox-group>
            </el-row>
            <br />
            <canvas id="hollandChart"></canvas>
            <div class="buttonGroup">
                <el-button class="form__button" type="primary" :disabled="selectedKeywords.length < 10"
                    @click="shareResult()">分享結果</el-button>
            </div>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="說明">
                        <ul>
                            <li>
                                資料來源：<a href="https://www.onetcenter.org/dictionary/28.3/excel/riasec_keywords.html"
                                    target="_blank">RIASEC Keywords</a>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </template>
        </el-card>
        <h2 id="職務適性比較" tabindex="-1">職務適性比較 <a class="header-anchor" href="#職務適性比較"
                aria-label="Permalink to &quot;職務適性比較&quot;">&ZeroWidthSpace;</a></h2>
        <el-card>
            <el-form-item label="何倫碼分類">
                <el-checkbox-group v-model="selectedCodes">
                    <el-checkbox v-for="(code, index) in hollandCodes" :key="index"
                        :label="`${code.label}(${code.value})`"
                        :disabled="selectedCodes.length >= 3 && !selectedCodes.includes(code.value)" :value="code.value"
                        @change="onHollandCodeChanged()" />
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="搜索職務">
                <el-input v-model="userKeyword" placeholder="請輸入職務名稱" clearable @input="onKeywordChanged()" />
            </el-form-item>
            <table class="table">
                <tr>
                    <th>專業頭銜</th>
                    <th>求職門檻</th>
                    <th>何倫碼</th>
                    <th v-if="selectedKeywords.length">潛力指數</th>
                </tr>
                <tr v-for="(item, index) in pagedOccupations" :key="index">
                    <td>{{ item.label }}</td>
                    <td>{{ item.jobZone }}</td>
                    <td>{{ item.IHs?.join('') }}</td>
                    <td v-if="selectedKeywords.length">{{ item.similarity }}</td>
                </tr>
            </table>
            <div class="example-pagination-block">
                <el-pagination v-model:current-page="currentPage" layout="prev, pager, next" :page-size="10"
                    :total="pagedTotalOccupations" @change="setPagedOccupations()" />
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
                                潛力指數使用<a
                                    href="https://zh.wikipedia.org/zh-tw/%E6%9B%BC%E5%93%88%E9%A0%93%E8%B7%9D%E9%9B%A2">曼哈頓距離</a>計算
                            </li>
                            <li>
                                使用ChatGpt進行機翻。搜索欄除了中文也可以使用英文進行篩選。
                            </li>
                            <li>
                                資料來源：<a href="https://www.onetcenter.org/dictionary/28.3/excel/interests.html"
                                    target="_blank">Interests</a>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </template>
        </el-card>
    </div>
</template>
<script setup lang="ts">
interface hollandItem {
    'Element Name': string,
    'Keyword': string,
}
interface interestItem {
    "O*NET-SOC Code": string, // 不重要
    "Title": string, // 重要
    "Element ID": string, // 不重要
    "Element Name": string, // First Interest High-Point, Second Interest High-Point, Third Interest High-Point
    "Scale ID": string, // OI, IH
    "Scale Name": string, // 不重要
    "Data Value": number, // 1~6代表RIASEC, 要跟ScaleID一起看
    "Date": string, // 不重要
    "Domain Source": string, // 不重要
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
import { ref, shallowRef, onMounted } from 'vue'
const shuffledKeywords = ref<any[]>([])
const selectedKeywords = ref<any[]>([])
const hollandCodes = ref<{
    label: string,
    value: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}[]>([
    {
        label: '實做型',
        value: 'R'
    },
    {
        label: '研究型',
        value: 'I'
    },
    {
        label: '藝術型',
        value: 'A'
    },
    {
        label: '社會型',
        value: 'S'
    },
    {
        label: '企業型',
        value: 'E'
    },
    {
        label: '事務型',
        value: 'C'
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
const occupationCollapse = ref<string[]>(['1'])

let hollandChartInstance = ref<Chart>()
// hooks
onMounted(async () => {
    await initializeKeywords()
    await initializeInterests()
    initizlieFuzzySearch()
    drawCharts()
    // translateTitle()
});
// methods
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
    const interestResponse = await fetch("interests.min.json");
    const interestJson = await interestResponse.json();
    interestOccupationItems.value = interestJson
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
    const keywordsResponse = await fetch("keywords.json");
    const keywordsJson: hollandItem[] = await keywordsResponse.json();
    const formatKeywords = keywordsJson.map((item: hollandItem) => {
        return {
            label: item.Keyword,
            value: item['Element Name']
        }
    })
    shuffledKeywords.value = shuffle(formatKeywords)
}
function drawCharts() {
    const hollandCodeKeywords: string[] = selectedKeywords.value.map((selectedLabel: string) => {
        const selectedItem = shuffledKeywords.value.find(item => {
            return item.label === selectedLabel
        })
        return selectedItem?.value || ''
    })
    const riasec = {
        'R': 0,
        'I': 0,
        'A': 0,
        'S': 0,
        'E': 0,
        'C': 0,
    }
    hollandCodeKeywords.forEach(value => {
        const code = value[0]
        riasec[code] += 1
    })
    for (let key in riasec) {
        // %化
        let count = riasec[key]
        count = count / selectedKeywords.value.length * 100
        riasec[key] = Math.round(count)
    }
    userHollandVectors.value = Object.values(riasec)
    //
    const data: any = {
        labels: ['實做型', '研究型', '藝術型', '社會型', '企業型', '事務型'],
        datasets: [{
            label: '興趣何綸碼',
            data: Object.values(riasec),
        }],
    }
    // set holland code selected
    const dataValues = Object.values(riasec)
    selectedCodes.value = []
    dataValues.forEach((value, index) => {
        if (value >= 20) {
            const hollanCodeItem = hollandCodes.value[index]
            selectedCodes.value.push(hollanCodeItem.value)
        }
    })
    if (selectedCodes.value.length > 3) {
        selectedCodes.value = []
        dataValues.forEach((value, index) => {
            if (value >= 33) {
                const hollanCodeItem = hollandCodes.value[index]
                selectedCodes.value.push(hollanCodeItem.value)
            }
        })
    }
    selectedCodesOrigin.value = [...selectedCodes.value]
    onHollandCodeChanged()
    // update chart
    if (hollandChartInstance.value) {
        hollandChartInstance.value.data = data
        hollandChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('hollandChart')
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
                    text: '何倫碼分佈圖'
                }
            }
        },
    })
    hollandChartInstance = shallowRef(chartInstance) as any
}
async function shareResult() {
    const canvasElement = hollandChartInstance.value.canvas
    const dataUrl = canvasElement.toDataURL();
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

    const hollandCodeString = selectedCodesOrigin.value.join()

    const userLabels = hollandCodes.value.filter(item => {
        return selectedCodesOrigin.value.includes(item.value)
    }).map(item => item.label).join('、')

    const shareConfig = {
        files: filesArray,
        title: '合理的理想職涯',
        text: `我的Holland Code是${hollandCodeString}，這代表我更傾向於${userLabels}職業。快來測試你的職業性格吧！`,
        url: window.location.href || 'https://econ-sense.com',
    }

    navigator.share(shareConfig);
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
async function translateTitle() {
    const interestResponse = await fetch("interests.min.json")
    const interestJson: interestItemDesign[] = await interestResponse.json()
    const alternatNames = interestJson.map(item => item.alternateName)
    const promises: any[] = []
    // for (let i = 100; i < interestJson.length; i += 5) {
    //     const slicedAlternatNames = alternatNames.slice(i, i + 5)
    //     const res = await fetch(`${VITE_BASE_URL}/chat/translate`, {
    //         method: 'post',
    //         body: JSON.stringify(slicedAlternatNames),
    //         headers: { 'Content-Type': 'application/json' }
    //     })
    //     const promise = new Promise(async (resolve) => {
    //         const titleRes = await res?.json()
    //         for (let j = 0; j < 5; j++) {
    //             if (interestJson[i + j]) {
    //                 interestJson[i + j].label = titleRes[j]
    //             }
    //         }
    //         resolve(titleRes)
    //     })
    //     promises.push(promise)
    // }
    // await Promise.all(promises)
    // find jobZone 
    const jobZoneRes = await fetch("jobZones.json")
    const jobZoneJson = await jobZoneRes.json()
    interestJson.forEach(interestItem => {
    })
    // format
    const formatResult = interestJson.map((interestItem) => {
        const { alternateName } = interestItem
        console.log({
            alternateName
        })
        if (alternateName) {
            const matchItem = jobZoneJson.find(jobZoneItem => {
                return jobZoneItem.Title === alternateName
            })
            console.log({
                matchItem
            })
            if (matchItem) {
                interestItem.jobZone = matchItem['Job Zone']
            }
        }
        return {
            ...interestItem,
            label: interestItem.label?.trim()
        }
    })
    downloadObjectAsJson(formatResult);
}
async function minimizeInterests() {
    // interests
    const interestResponse = await fetch("interests.json")
    const interestJson: interestItem[] = await interestResponse.json()
    const formatInterests = interestJson.map((item: interestItem) => {
        return {
            "O*NET-SOC Code": item['O*NET-SOC Code'],
            Title: item.Title,
            "Element Name": item["Element Name"],
            "Scale ID": item["Scale ID"],
            "Data Value": item["Data Value"],
        }
    })
    const minimumJson: { [key: string]: interestItemDesign } = {}
    formatInterests.forEach((item) => {
        const Title = item.Title
        if (!minimumJson[Title]) {
            const newItem: interestItemDesign = {}
            minimumJson[Title] = newItem
        }
        if (item['Scale ID'] === 'OI') {
            if (minimumJson[Title].OISum) {
                minimumJson[Title].OISum += item['Data Value']
            } else {
                minimumJson[Title].OISum = item['Data Value']
            }
            minimumJson[Title].OISum = Number(minimumJson[Title].OISum.toFixed(2))
            const dataValue = item['Data Value']
            if (minimumJson[Title].OIs) {
                // RIASEC一定照順序
                minimumJson[Title].OIs.push(dataValue)
            } else {
                minimumJson[Title].OIs = [dataValue]
            }
        }
        if (item['Scale ID'] === 'IH') {
            const codes = [null, 'R', 'I', 'A', 'S', 'E', 'C']
            const index = item['Data Value']
            const code = codes[index] || ''
            if (code) {
                if (minimumJson[Title].IHs) {
                    minimumJson[Title].IHs.push(code)
                } else {
                    minimumJson[Title].IHs = [code]
                }
            }
        }
    })

    const minimumItems: interestItemDesign[] = []
    Object.keys(minimumJson).forEach((Title, index) => {
        const item = minimumJson[Title]
        const deno = item.OISum
        if (deno) {
            item.OIs = item.OIs?.map(value => {
                return Number((value / deno * 100).toFixed(1))
            })
            delete item.OISum
        }
        // const label = translatedTitle[index] || ''
        minimumItems.push({
            label: '',
            alternateName: Title,
            ...item,
        })
    })


    downloadObjectAsJson(minimumItems, 'interests.raw');
}
function downloadObjectAsJson(exportObj, exportName = 'test') {
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

.form__button {
    width: 100%;
    margin-top: 16px;
}
</style>
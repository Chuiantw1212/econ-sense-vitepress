<template>
    <div>
        <h2 id="興趣何綸碼測驗" tabindex="-1">興趣何綸碼測驗 <a class="header-anchor" href="#興趣何綸碼測驗"
                aria-label="Permalink to &quot;興趣何綸碼測驗&quot;">&ZeroWidthSpace;</a></h2>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>建議至少選10個關鍵字</span>
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
            <el-checkbox-group v-model="selectedCodes">
                <el-checkbox v-for="(code, index) in hollandCodes" :key="index" :label="code.label" :value="code.value"
                    @change="updateOccupationSimilarity()" />
            </el-checkbox-group>
            <table class="table">
                <tr>
                    <th>專業頭銜</th>
                    <th>何倫碼</th>
                    <th>潛力指數</th>
                </tr>
                <tr v-for="(item, index) in pagedOccupations" :key="index">
                    <td>{{ item.label }}</td>
                    <td>{{ item.IHs.join(', ') }}</td>
                    <td>{{ item.similarity }}</td>
                </tr>
            </table>
            <div class="example-pagination-block">
                <el-pagination v-model:current-page="currentPage" :page-size="10"
                    :total="recommendOccupations.length" />
            </div>
            <template #footer>
                <el-collapse>
                    <el-collapse-item title="說明">
                        <ul>
                            <li>
                                沒空翻譯
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
}
const { VITE_BASE_URL } = import.meta.env
import { computed } from '@vue/reactivity';
import Chart from 'chart.js/auto';
import { ref, shallowRef, onMounted } from 'vue'
const shuffledKeywords = ref<any[]>([])
// ["分析","解決問題","研究","學習","思考","知識","幫助","教學","溝通","商業","資訊","安排","想法","建造","事實","程序","電子產品","建議","細節","音樂"]
const selectedKeywords = ref<any[]>(["分析", "解決問題", "研究", "學習", "思考", "知識", "幫助", "教學", "溝通", "商業", "資訊", "安排", "想法", "建造", "事實", "程序", "電子產品", "建議", "細節", "音樂", "文件"])
const hollandCodes = ref<any[]>([
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
const interestOccupationItems = ref<interestItemDesign[]>([])
const recommendOccupations = ref<interestItemDesign[]>([])
const currentPage = ref<number>(1)

let hollandChartInstance = ref<Chart>()
// hooks
onMounted(async () => {
    await initializeKeywords()
    translateTitle()
    drawCharts()
    // await initializeInterests()
});
const pagedOccupations = computed(() => {
    const result = recommendOccupations.value.slice((currentPage.value - 1) * 10, (currentPage.value) * 10)
    return result
})
// methods
async function initializeInterests() {
    const interestResponse = await fetch("interest.min.json");
    const interestJson = await interestResponse.json();
    for (let occupation in interestJson) {
        const { IHs = [], OIs = [] } = interestJson[occupation]
        interestOccupationItems.value.push({
            label: occupation,
            OIs,
            IHs
        })
    }
    updateOccupationSimilarity()
}
async function updateOccupationSimilarity() {
    recommendOccupations.value = []
    if (!selectedCodes.value.length) {
        return
    }
    const filteredItems = interestOccupationItems.value.filter(item => {
        const hasMatchedCode = selectedCodes.value.every(code => {
            return item.IHs?.includes(code)
        })
        return hasMatchedCode
    })
    filteredItems.forEach(item => {
        const { OIs = [] } = item
        const similarity = manhattanDistance(OIs, userHollandVectors.value)
        item.similarity = Math.round(similarity)
    })
    filteredItems.sort((a, b) => {
        const similarityA = a.similarity || 0
        const similarityB = b.similarity || 0
        return similarityB - similarityA
    })
    console.log(recommendOccupations.value.length)
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
function cosineSimilarity(vectorsA: number[], verctorsB: number[]) {
    if (vectorsA.length !== verctorsB.length) {
        return 0
    }
    // 
    let fraction = 0
    vectorsA.forEach((valueA, index) => {
        const valueB = verctorsB[index]
        fraction += (valueA * valueB)
    })
    //
    let denoA = vectorsA.reduce((sum, value) => {
        return sum + (value * value)
    }, 0)
    denoA = Math.sqrt(denoA)
    //
    let denoB = verctorsB.reduce((sum, value) => {
        return sum + (value * value)
    }, 0)
    denoB = Math.sqrt(denoB)
    const finalDeno = denoA * denoB
    //
    const similarity = Math.min((fraction / finalDeno), 1)
    return similarity
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
    // 設定前三
    const dataValues = Object.values(riasec)
    dataValues.forEach((value, index) => {
        if (value >= 20) {
            const hollanCodeItem = hollandCodes.value[index]
            selectedCodes.value.push(hollanCodeItem.value)
        }
    })
    // 
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
                    text: 'RIASEC興趣分佈圖'
                }
            }
        },
    })
    hollandChartInstance = shallowRef(chartInstance) as any
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
    const labels = interestJson.map(item => item.label)
    const alternatNames = interestJson.map(item => item.alternateName)
    const promises: any[] = []
    for (let i = 0; i < interestJson.length; i += 5) {
        const slicedLabels = labels.slice(i, i + 5)
        const slicedAlternatNames = alternatNames.slice(i, i + 5)
        const isEmpty = slicedLabels.every(value => !value)
        if (isEmpty) {
            console.log({ i })
            const res = await fetch(`${VITE_BASE_URL}/chat/translate`, {
                method: 'post',
                body: JSON.stringify(slicedAlternatNames),
                headers: { 'Content-Type': 'application/json' }
            })
            const promise = new Promise(async (resolve) => {
                const titleRes = await res?.json()
                for (let j = 0; j < 5; j++) {
                    if (interestJson[i + j]) {
                        interestJson[i + j].label = titleRes[j]
                    }
                }
                resolve(titleRes)
            })
            promises.push(promise)
        }
    }
    await Promise.all(promises)
    downloadObjectAsJson(interestJson);
}
async function minimizeInterests() {
    // interests
    const interestResponse = await fetch("interests.json")
    const interestJson: interestItem[] = await interestResponse.json()
    const formatInterests = interestJson.map((item: interestItem) => {
        return {
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


    downloadObjectAsJson(minimumItems);
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
</style>
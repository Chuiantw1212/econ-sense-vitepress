<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>興趣關鍵字 (建議至少選10個)</span>
            </div>
        </template>
        <el-row>
            <el-checkbox-group v-model="selectedValues">
                <el-checkbox v-for="(item, index) in shuffledItems" :key="index" :label="item.label" :value="item.label"
                    @change="drawCharts()" />
            </el-checkbox-group>
        </el-row>
        <br />
        <canvas id="hollandChart"></canvas>
    </el-card>
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
    IHs?: string[]
    // OI1: number,
    // OI2: number,
    // OI3: number,
    // IH1: string, // RIASEC
    // IH2: string, // RIASEC
    // IH3: string, // RIASEC
}
import Chart from 'chart.js/auto';
import { ref, shallowRef, onMounted } from 'vue'
const shuffledItems = ref<any[]>([])
const selectedValues = ref<any[]>([])
let hollandChartInstance = ref<Chart>()
// hooks
onMounted(async () => {
    initializeKeywords()
    initializeInterests()
});
// methods
async function initializeKeywords() {
    const keywordsResponse = await fetch("keywords.json");
    const keywordsJson: hollandItem[] = await keywordsResponse.json();
    const formatKeywords = keywordsJson.map((item: hollandItem) => {
        return {
            label: item.Keyword,
            value: item['Element Name']
        }
    })
    shuffledItems.value = shuffle(formatKeywords)
}
async function initializeInterests() {
    // interests
    const interestResponse = await fetch("interests.json")
    const interestJson: interestItem[] = await interestResponse.json()
    const formatInterests = interestJson.slice(0, 30).map((item: interestItem) => {
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
    for (let Title in minimumJson) {
        const item = minimumJson[Title]
        const deno = item.OISum
        if (deno) {
            item.OIs = item.OIs?.map(value => {
                return value / deno * 100
            })
        }
    }
    console.log({
        minimumJson
    })
}
function drawCharts() {
    const hollandCodes: string[] = selectedValues.value.map((selectedLabel: string) => {
        const selectedItem = shuffledItems.value.find(item => {
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
    hollandCodes.forEach(value => {
        const code = value[0]
        riasec[code] += 1
    })
    for (let key in riasec) {
        // %化
        let count = riasec[key]
        count = count / selectedValues.value.length * 100
        riasec[key] = Math.round(count)
    }
    const data: any = {
        labels: Object.keys(riasec),
        datasets: [{
            label: '興趣何綸碼',
            data: Object.values(riasec),
        }],
    }
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
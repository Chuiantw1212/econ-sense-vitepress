<template>
    <h2 id="愛之語測驗" tabindex="-1">愛之語測驗 <a class="header-anchor" href="#愛之語測驗"
            aria-label="Permalink to &quot;愛之語測驗&quot;">&ZeroWidthSpace;</a></h2>
    <el-card>
        <div class="card-header">
            <span>選10~15個感興趣的關鍵字 (已選{{ selectedKeywords.length }}個)</span>
        </div>
        <el-row>
            <el-checkbox-group v-model="selectedKeywords">
                <el-checkbox v-for="(item, index) in shuffledKeywords" :key="index" :label="item.label"
                    :value="item.label" :disabled="!selectedKeywords.includes(item.label) && selectedKeywords.length >= 15"
                    @change="drawCharts()" />
            </el-checkbox-group>
        </el-row>
        <br />
        <canvas id="loveLanguageChart"></canvas>
        <div class="buttonGroup">
            <el-button class="form__button" type="primary" :disabled="selectedKeywords.length < 10"
                @click="shareRadar()">分享雷達圖</el-button>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import Chart from 'chart.js/auto';
const shuffledKeywords = ref<any[]>([])
const selectedKeywords = ref<any[]>([])
import { ElMessage, } from 'element-plus'
const selectedCodes = ref<string[]>([])
const fullscreenLoading = ref<boolean>(false)
let loveLanguageChartInstance = ref<Chart>()
const loveLanguageCodes = ref<{
    label: string,
    value: 'Words' | 'Service' | 'Gifts' | 'Time' | 'Touch'
}[]>([
    {
        label: '肯定的言詞',
        value: 'Words'
    },
    {
        label: '服務的行動',
        value: 'Service'
    },
    {
        label: '接受禮物',
        value: 'Gifts'
    },
    {
        label: '精心的時刻',
        value: 'Time'
    },
    {
        label: '身體的接觸',
        value: 'Touch'
    }
])
const questions = ref(
    [
        { "label": "稱讚", "value": "Words" },
        { "label": "鼓勵", "value": "Words" },
        { "label": "感謝", "value": "Words" },
        { "label": "誇獎", "value": "Words" },
        { "label": "認同", "value": "Words" },
        { "label": "肯定", "value": "Words" },

        { "label": "幫忙", "value": "Service" },
        { "label": "煮飯", "value": "Service" },
        { "label": "打掃", "value": "Service" },
        { "label": "照顧", "value": "Service" },
        { "label": "修理", "value": "Service" },
        { "label": "安排", "value": "Service" },

        { "label": "贈禮", "value": "Gifts" },
        { "label": "驚喜", "value": "Gifts" },
        { "label": "紀念品", "value": "Gifts" },
        { "label": "心意", "value": "Gifts" },
        { "label": "精選", "value": "Gifts" },
        { "label": "收藏品", "value": "Gifts" },

        { "label": "專注時間", "value": "Time" },
        { "label": "深度對話", "value": "Time" },
        { "label": "共享經歷", "value": "Time" },
        { "label": "約會時光", "value": "Time" },
        { "label": "散步", "value": "Time" },
        { "label": "觀看電影", "value": "Time" },

        { "label": "擁抱", "value": "Touch" },
        { "label": "親吻", "value": "Touch" },
        { "label": "撫摸", "value": "Touch" },
        { "label": "牽手", "value": "Touch" },
        { "label": "依偎", "value": "Touch" },
        { "label": "按摩", "value": "Touch" }
    ])
onMounted(() => {
    initializeInterests()
})
async function initializeInterests() {
    const shuffledResult: {
        label: string,
        value: string,
    }[] = shuffle(questions.value)
    const twoWords = shuffledResult.filter(item => item.label.length === 2)
    const threeWords = shuffledResult.filter(item => item.label.length === 3)
    const fourWords = shuffledResult.filter(item => item.label.length >= 4)
    shuffledKeywords.value = [...twoWords, ...threeWords, ...fourWords]
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
function drawCharts() {
    // set user holland vectors
    const hollandCodeKeywords: string[] = selectedKeywords.value.map((selectedLabel: string) => {
        const selectedItem = shuffledKeywords.value.find(item => {
            return item.label === selectedLabel
        })
        return selectedItem?.value || ''
    })
    const riasecRaw = {
        'Words': 0,
        'Service': 0,
        'Gifts': 0,
        'Time': 0,
        'Touch': 0,
    }
    hollandCodeKeywords.forEach(value => {
        riasecRaw[value] += 1
    })
    const riasecVectors: number[] = []
    for (let key in riasecRaw) {
        let count = riasecRaw[key]
        count = count / selectedKeywords.value.length * 100
        count = Math.round(count)
        riasecVectors.push(count)
    }
    // set holland code selected
    console.log(riasecVectors)
    const dataValues = riasecVectors
    // selectedCodes.value = []
    // dataValues.forEach((value, index) => {
    //     if (value >= 17) {
    //         const hollanCodeItem = loveLanguageCodes.value[index]
    //         selectedCodes.value.push(hollanCodeItem.value)
    //     }
    // })
    // if (selectedCodes.value.length > 3) {
    //     selectedCodes.value = []
    //     dataValues.forEach((value, index) => {
    //         if (value >= 33) {
    //             const hollanCodeItem = loveLanguageCodes.value[index]
    //             selectedCodes.value.push(hollanCodeItem.value)
    //         }
    //     })
    // }
    // selectedCodesOrigin.value = [...selectedCodes.value]
    const riasecAdjustVectors: number[] = []
    for (let key in riasecRaw) {
        let count = riasecRaw[key] + 1
        const deno = selectedKeywords.value.length + 6
        count = count / deno * 100
        riasecAdjustVectors.push(count)
    }
    // userHollandVectors.value = riasecAdjustVectors
    // onHollandCodeChanged()
    // update chart
    const data: any = {
        labels: loveLanguageCodes.value.map(item => item.label),
        datasets: [{
            label: '愛之語光譜',
            data: riasecVectors,
        }],
    }
    if (loveLanguageChartInstance.value) {
        loveLanguageChartInstance.value.data = data
        loveLanguageChartInstance.value.update()
        return
    }
    const ctx: any = document.getElementById('loveLanguageChart')
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
                    text: '愛之語光譜'
                }
            }
        },
    })
    loveLanguageChartInstance = shallowRef(chartInstance) as any
}
function showPercent(tooltipItems) {
    const { raw, dataset, } = tooltipItems
    const fisrtValue = raw
    return `${fisrtValue}%`
}
function shareRadar() {
    fullscreenLoading.value = true
    const hollandChartCanvas = loveLanguageChartInstance.value.canvas
    callNavigatorShare(hollandChartCanvas)
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
        title: 'NLP的愛之語',
        url: `${window.location.href}?openExternalBrowser=1` || 'https://econ-sense.com?openExternalBrowser=1',
        text: '快來測試你的愛之語吧！',
    }
    shareConfig.text = `快來測試你的愛之語吧！`
    // if (selectedCodesOrigin.value.length) {
    //     const hollandCodeString = selectedCodesOrigin.value.join()
    //     const userLabels = hollandCodes.value.filter(item => {
    //         return selectedCodesOrigin.value.includes(item.value)
    //     }).map(item => item.label).join('、')
    // }

    try {
        navigator.share(shareConfig);
    } catch (error) {
        ElMessage.info(error.message || error)
    }
}
</script>
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
        <canvas id="hollandChart"></canvas>
    </el-card>
</template>
<script setup lang="ts">
interface hollandItem {
    'Element Name': string,
    'Keyword': string,
}
import Chart from 'chart.js/auto';
import { ref, shallowRef, onMounted } from 'vue'
const shuffledItems = ref<any[]>([])
const selectedValues = ref<any[]>([])
let hollandChartInstance = ref<Chart>()
// hooks
onMounted(async () => {
    const response = await fetch("keywords.json");
    const jsonFormat: hollandItem[] = await response.json();
    const formatResult = jsonFormat.map((item: hollandItem) => {
        return {
            label: item.Keyword,
            value: item['Element Name']
        }
    })
    shuffledItems.value = shuffle(formatResult)
});
// methods
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
    const { raw, dataIndex, dataset, } = tooltipItems
    const fisrtValue = raw
    const { label } = dataset
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
<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>興趣職業關鍵字</span>
            </div>
        </template>
        <el-checkbox-group v-model="selectedValues">
            <el-checkbox v-for="(item, index) in shuffledItems" :key="index" :label="item.label" :value="item.label"
                @change="drawCharts()" />
        </el-checkbox-group>
        <canvas id="hollandChart"></canvas>
    </el-card>
</template>
<script setup lang="ts">
interface hollandItem {
    label: string,
    values: string[]
}
import Chart from 'chart.js/auto';
import { ref, computed, shallowRef, onMounted } from 'vue'
const shuffledItems = ref<any[]>([])
const selectedValues = ref<any[]>([])
let hollandChartInstance = ref<Chart>()
// hooks
onMounted(async () => {
    const response = await fetch("/keywords.json");
    const jsonFormat: hollandItem[] = await response.json();
    shuffledItems.value = shuffle(jsonFormat)
});
// methods
function drawCharts() {
    const hollandCodes: string[][] = selectedValues.value.map((selectedLabel: string) => {
        console.log({
            selectedLabel
        })
        const selectedItem = datasets.find(item => {
            return item.label === selectedLabel
        })
        console.log({
            selectedItem
        })
        return selectedItem?.value || []
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
        value.forEach(code => {
            riasec[code] += 1
        })
    })
    // const datasets: {
    //     label: string,
    //     data: number[][],
    //     fill: boolean,
    //     tension: number
    // }[] = []
    console.log(Object(riasec))
    const data: any = {
        labels: ['R', 'I', 'A', 'S', 'E', 'C'],
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
        type: 'doughnut',
        data: data,
    })
    hollandChartInstance = shallowRef(chartInstance) as any
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
const datasets = [
    {
        label: '機械/電子',
        value: ['R']
    },
    {
        label: '建築/木工',
        value: ['R']
    },
    {
        label: '交通/機械操作',
        value: ['R']
    },
    {
        label: '體力/手工勞動',
        value: ['R']
    },
    {
        label: '軍警消防',
        value: ['R']
    },
    {
        label: '農業',
        value: ['R']
    },
    {
        label: '自然/戶外',
        value: ['R']
    },
    {
        label: '動物照顧',
        value: ['R', 'S']
    },
    {
        label: '競技',
        value: ['R', 'E']
    },
    {
        label: '工程',
        value: ['R',]
    },
    {
        label: '物理科學',
        value: ['I',]
    },
    {
        label: '生命科學',
        value: ['I',]
    },
    {
        label: '醫學',
        value: ['I',]
    },
    {
        label: '社會科學',
        value: ['I', 'S']
    },
    {
        label: '人文科學',
        value: ['I', 'A']
    },
    {
        label: '數學/統計',
        value: ['I', 'C']
    },
    {
        label: '資訊科技',
        value: ['C']
    },
    {
        label: '視覺藝術',
        value: ['A']
    },
    {
        label: '應用藝術與設計',
        value: ['A']
    },
    {
        label: '表演藝術',
        value: ['A']
    },
    {
        label: '音樂',
        value: ['A']
    },
    {
        label: '自由書寫',
        value: ['A']
    },
    {
        label: '媒體',
        value: ['A']
    },
    {
        label: '烹飪',
        value: ['A', 'S']
    },
    {
        label: '教學/教育',
        value: ['S']
    },
    {
        label: '社會服務/公益',
        value: ['S']
    },
    {
        label: '醫療服務',
        value: ['I', 'S']
    },
    {
        label: '宗教活動',
        value: ['S', 'E']
    },
    {
        label: '對人服務',
        value: ['S',]
    },
    {
        label: '專業諮詢',
        value: ['S', 'E']
    },
    {
        label: '商業發起',
        value: ['E']
    },
    {
        label: '銷售',
        value: ['E']
    },
    {
        label: '行銷/廣告',
        value: ['A', 'E']
    },
    {
        label: '金融',
        value: ['E', 'C']
    },
    {
        label: '會計',
        value: ['C']
    },
    {
        label: '人力資源',
        value: ['S', 'C']
    },
    {
        label: '辦公室工作',
        value: ['C']
    },
    {
        label: '管理/行政',
        value: ['E']
    },
    {
        label: '公開演講',
        value: ['E']
    },
    {
        label: '政治',
        value: ['E']
    },
    {
        label: '法律',
        value: ['E']
    },
]
</script>
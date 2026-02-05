<template>
    <div class="chart-container">
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
// 1. 引入 Chart.js 的型別定義
import type { ChartData, ChartOptions } from 'chart.js'
import { debounce } from 'lodash-es'
import type { UserCareer } from '../types/user'

const props = defineProps<{
    data: UserCareer
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
// 2. 明確指定這是一個 Bar Chart 的實例
const chartInstance = shallowRef<Chart<'bar'> | null>(null)

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-TW').format(Math.round(num))
}

const renderChart = debounce(() => {
    if (!canvasRef.value) return

    const m = props.data
    let pv = 0
    let fv = 0
    // 這裡明確定義 data 是 tuple [number, number]
    const nodes: { label: string, data: [number, number], type: 0 | 1 }[] = []

    // ... (中間計算邏輯保持不變) ...
    // 1. 本薪
    fv = m.baseSalary || 0
    nodes.push({ label: '本薪', data: [pv, fv], type: 0 })

    // 2. 伙食津貼
    pv = fv
    fv += 3000
    nodes.push({ label: '伙食津貼', data: [pv, fv], type: 0 })

    // 3. 其他津貼
    if ((m.otherAllowance || 0) > 0) {
        pv = fv
        fv += m.otherAllowance
        nodes.push({ label: '其他津貼', data: [pv, fv], type: 0 })
    }

    // 扣除項目
    const deductions = [
        { label: '健保', val: m.healthInsurance },
        { label: '勞保', val: m.laborInsurance },
        { label: '勞退自提', val: m.pensionPersonalAmount },
        { label: '員工認股', val: m.stockDeduction },
        { label: '其他扣款', val: m.otherDeduction }
    ]

    deductions.forEach(d => {
        if ((d.val || 0) > 0) {
            pv = fv
            fv -= d.val
            nodes.push({ label: d.label, data: [pv, fv], type: 1 })
        }
    })

    // 月實領
    nodes.push({ label: '月實領', data: [0, fv], type: 0 })

    // --- 修正開始 ---

    const labels = nodes.map(n => n.label)

    // 3. 在 map 時使用 `as [number, number]` 強制轉型為元組
    // Dataset 0: 收入
    const dataIncome = nodes.map(n => n.type === 0 ? n.data : [0, 0] as [number, number])

    // Dataset 1: 支出
    const dataDeduction = nodes.map(n => n.type === 1 ? n.data : [0, 0] as [number, number])

    // 4. 明確定義 chartData 的型別為 ChartData<'bar'>
    // 這樣 TypeScript 就知道 datasets 裡面可以放 borderSkipped 等屬性
    const chartData: ChartData<'bar'> = {
        labels,
        datasets: [
            {
                label: '收入/結餘',
                data: dataIncome,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false, // 這是 Bar Chart 專屬屬性
            },
            {
                label: '扣除項目',
                data: dataDeduction,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            }
        ]
    }

    // 5. Options 也建議加上型別 (非必須但推薦)
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        // 這裡 raw 需要斷言，因為可能是 number 或 [number, number]
                        const raw = context.raw as [number, number]
                        const val = Math.abs(raw[1] - raw[0])
                        return `${context.dataset.label}: ${formatNumber(val)}`
                    }
                }
            },
            legend: { display: true, position: 'bottom' }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    }

    // 初始化或更新圖表
    if (chartInstance.value) {
        chartInstance.value.data = chartData
        chartInstance.value.update()
    } else {
        chartInstance.value = new Chart(canvasRef.value, {
            type: 'bar', // 這裡必須與泛型 <'bar'> 吻合
            data: chartData,
            options: chartOptions
        })
    }
}, 300)

watch(() => props.data, () => {
    renderChart()
}, { deep: true })

onMounted(() => {
    renderChart()
})
</script>

<style scoped>
.chart-container {
    height: 300px;
    position: relative;
    width: 100%;
}
</style>
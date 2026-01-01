<template>
    <el-card shadow="never" v-loading="loading">
        <template #header>
            資產效能矩陣
        </template>

        <div v-if="hasData" class="chart-container">
            <canvas ref="canvasRef"></canvas>
        </div>

        <div v-else class="h-64 flex justify-center items-center">
            <el-empty description="暫無營運中資產數據" />
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    type ChartConfiguration
} from 'chart.js'

import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from '../types/user'

Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend, Title)

// ==========================================
// 1. 狀態與資料
// ==========================================
const { authFetch } = useApi()
const loading = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const rawList = ref<UserBusiness[]>([])
const hasData = computed(() => rawList.value.length > 0)

// ==========================================
// 2. 輔助函式
// ==========================================

const parsePercent = (val?: string | number): number => {
    if (typeof val === 'number') return val
    if (!val || val === '-') return 0
    return parseFloat(String(val).replace(/[%,\s]/g, '')) || 0
}

const calculateRadius = (item: UserBusiness) => {
    const income = Number(item.monthlyIncome) || 0
    if (income <= 0) return 4
    return Math.max(5, Math.min(30, Math.log(income) * 3.5))
}

// 智慧軸距計算 (保持不變)
const getSmartRange = (values: number[], paddingPercent = 0.1) => {
    if (values.length === 0) return { min: 0, max: 10 }
    let min = Math.min(...values)
    let max = Math.max(...values)

    if (min === max) {
        if (min === 0) return { min: 0, max: 10 }
        return { min: min * 0.8, max: max * 1.2 }
    }

    const range = max - min
    const padding = range * paddingPercent
    return { min: min - padding, max: max + padding }
}

// ==========================================
// 3. API 獲取
// ==========================================
const fetchData = async () => {
    loading.value = true
    try {
        const res = await authFetch('/api/v1/user/businesses', {
            method: 'GET',
            params: { currentPage: 1, pageSize: 1000 }
        })

        if (res && res.ok) {
            const json = await res.json()
            const allItems: UserBusiness[] = json.list || []
            rawList.value = allItems.filter(item => Number(item.monthlyIncome) > 0)

            if (rawList.value.length > 0) {
                await nextTick()
                renderChart()
            } else {
                if (chartInstance) chartInstance.destroy()
            }
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('無法載入數據')
    } finally {
        loading.value = false
    }
}

// ==========================================
// 4. Plugins
// ==========================================

const gradientBgPlugin = {
    id: 'gradientBg',
    beforeDraw(chart: Chart) {
        const { ctx, chartArea } = chart
        if (!chartArea) return
        const { left, top, width, height, bottom } = chartArea

        ctx.save()
        // 垂直漸層：上綠下紅
        const gradient = ctx.createLinearGradient(0, top, 0, bottom)
        gradient.addColorStop(0, 'rgba(220, 252, 231, 0.7)')
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
        gradient.addColorStop(1, 'rgba(254, 226, 226, 0.7)')

        ctx.fillStyle = gradient
        ctx.fillRect(left, top, width, height)
        ctx.strokeStyle = '#E5E7EB'
        ctx.strokeRect(left, top, width, height)
        ctx.restore()
    }
}

const thresholdLinePlugin = {
    id: 'thresholdLine',
    beforeDatasetsDraw(chart: Chart) {
        const { ctx, chartArea, scales: { y } } = chart
        if (!chartArea || !y) return

        const targetValue = 3
        const yPixel = y.getPixelForValue(targetValue)

        // [關鍵修正]：如果 3% 的位置在繪圖區之外，直接 return 不繪製
        // 這樣就不會發生線畫在圖表外面的情況
        if (yPixel < chartArea.top || yPixel > chartArea.bottom) return

        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#EF4444'
        ctx.setLineDash([6, 4])

        ctx.moveTo(chartArea.left, yPixel)
        ctx.lineTo(chartArea.right, yPixel)
        ctx.stroke()

        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'right'
        ctx.fillText('IRR 3% (不良資產分界)', chartArea.right - 10, yPixel - 8)

        ctx.restore()
    }
}

// ==========================================
// 5. 繪圖邏輯
// ==========================================
const renderChart = () => {
    if (!canvasRef.value) return
    if (chartInstance) chartInstance.destroy()

    const dataPoints = rawList.value.map(item => ({
        x: Number(item.acquisitionCost) || 0,
        y: parsePercent(item.irr),
        r: calculateRadius(item),
        raw: item
    }))

    const xValues = dataPoints.map(p => p.x)
    const yValues = dataPoints.map(p => p.y)

    const xRange = getSmartRange(xValues, 0.05)
    const yRange = getSmartRange(yValues, 0.1)

    // [已刪除] 這裡移除了強制 yRange 包含 3 的邏輯
    // 現在 Y 軸會完全依照資料的最大最小值來呈現，最大化空間利用率

    const config: ChartConfiguration = {
        type: 'scatter',
        data: {
            datasets: [{
                label: '資產項目',
                data: dataPoints,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
                hoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 10 },
            scales: {
                x: {
                    title: { display: true, text: '投入成本 ($)' },
                    grid: { display: false },
                    min: xRange.min,
                    max: xRange.max,
                    ticks: {
                        maxTicksLimit: 6,
                        callback: (val) => `${parseFloat((Number(val) / 10000).toFixed(1))}萬`
                    }
                },
                y: {
                    title: { display: true, text: 'IRR (%)' },
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    min: yRange.min,
                    max: yRange.max,
                    ticks: {
                        callback: (val) => `${parseFloat(Number(val).toFixed(1))}%`
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#4B5563',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 10,
                    intersect: false,
                    callbacks: {
                        label: (ctx) => {
                            const raw = (ctx.raw as any).raw as UserBusiness
                            return [
                                `項目: ${raw.name}`,
                                `IRR : ${raw.irr || '-'}`,
                                `成本: $${Number(raw.acquisitionCost).toLocaleString()}`,
                                `月收: $${Number(raw.monthlyIncome).toLocaleString()}`,
                                `ROI : ${raw.roi || '-'}`
                            ]
                        }
                    }
                }
            }
        },
        plugins: [gradientBgPlugin, thresholdLinePlugin]
    }

    chartInstance = new Chart(canvasRef.value, config)
}

onMounted(() => {
    fetchData()
})

onUnmounted(() => {
    if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}
</style>
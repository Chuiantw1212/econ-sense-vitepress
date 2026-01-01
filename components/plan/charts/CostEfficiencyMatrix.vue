<template>
    <el-card shadow="never" v-loading="loading">
        <template #header>
            資產效能矩陣 (動態聚焦)
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
// 2. 輔助函式 (移除 Jitter，保留基礎運算)
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

/**
 * [新功能] 智慧計算軸距範圍
 * @param values 所有的數據點陣列
 * @param paddingPercent 邊界留白比例 (預設 10%)
 * @returns { min, max }
 */
const getSmartRange = (values: number[], paddingPercent = 0.1) => {
    if (values.length === 0) return { min: 0, max: 10 }

    let min = Math.min(...values)
    let max = Math.max(...values)

    // 特殊情況：所有數據都一樣 (Variance = 0)
    if (min === max) {
        // 如果數值是 0，就給 0~10
        if (min === 0) return { min: 0, max: 10 }
        // 否則上下各抓 20%
        return { min: min * 0.8, max: max * 1.2 }
    }

    const range = max - min
    const padding = range * paddingPercent

    return {
        min: min - padding,
        max: max + padding
    }
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

            // 過濾掉 monthlyIncome 為 0 的標的
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
// 4. 背景漸層 Plugin (垂直漸層)
// ==========================================
const gradientBgPlugin = {
    id: 'gradientBg',
    beforeDraw(chart: Chart) {
        const { ctx, chartArea } = chart
        if (!chartArea) return

        const { left, right, top, bottom, width, height } = chartArea

        ctx.save()

        // 垂直漸層：這會自動適應目前的 Y 軸視圖
        // 這意味著：在當前的顯示範圍內，"相對"較高的就是綠色，"相對"較低的就是紅色
        const gradient = ctx.createLinearGradient(0, top, 0, bottom)

        gradient.addColorStop(0, 'rgba(220, 252, 231, 0.7)') // 上 (綠)
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)') // 中 (白)
        gradient.addColorStop(1, 'rgba(254, 226, 226, 0.7)') // 下 (紅)

        ctx.fillStyle = gradient
        ctx.fillRect(left, top, width, height)

        ctx.strokeStyle = '#E5E7EB'
        ctx.strokeRect(left, top, width, height)

        ctx.restore()
    }
}

// ==========================================
// 5. 繪圖邏輯 (動態軸距核心)
// ==========================================
const renderChart = () => {
    if (!canvasRef.value) return
    if (chartInstance) chartInstance.destroy()

    // 1. 準備真實數據 (移除 Jitter)
    const dataPoints = rawList.value.map(item => ({
        x: Number(item.acquisitionCost) || 0,
        y: parsePercent(item.roi),
        r: calculateRadius(item),
        raw: item
    }))

    // 2. 計算動態軸距 (Smart Scaling)
    const xValues = dataPoints.map(p => p.x)
    const yValues = dataPoints.map(p => p.y)

    // X軸留白 5%
    const xRange = getSmartRange(xValues, 0.05)
    // Y軸留白 10% (讓 ROI 差異更明顯)
    const yRange = getSmartRange(yValues, 0.1)

    const config: ChartConfiguration = {
        type: 'scatter',
        data: {
            datasets: [{
                label: '營運中資產',
                data: dataPoints,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
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
                    // [核心] 動態套用計算出的範圍
                    min: xRange.min,
                    max: xRange.max,
                    ticks: {
                        callback: (val) => `${Number(val) / 10000}萬`
                    }
                },
                y: {
                    title: { display: true, text: 'ROI (%)' },
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    // [核心] 動態套用計算出的範圍
                    min: yRange.min,
                    max: yRange.max
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
                    // 因為現在是真實座標，若點還是很密，開啟 intersect: false 比較好選取
                    intersect: false,
                    callbacks: {
                        label: (ctx) => {
                            const raw = (ctx.raw as any).raw as UserBusiness
                            return [
                                `項目: ${raw.name}`,
                                `成本: $${Number(raw.acquisitionCost).toLocaleString()}`,
                                `ROI : ${raw.roi || '-'}`,
                                `IRR : ${raw.irr || '-'}`,
                                `月收: $${Number(raw.monthlyIncome).toLocaleString()}`
                            ]
                        }
                    }
                }
            }
        },
        plugins: [gradientBgPlugin]
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
<template>
    <el-card shadow="never">
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
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
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
import type { MetadataMap } from '../types/metadata'
import type { UserBusiness } from '../types/user'

Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend, Title)

// ==========================================
// 1. Props & Model
// ==========================================

// [修改] 使用 defineModel 接收資料
// 預設為空陣列，避免未傳入時報錯
const list = defineModel<UserBusiness[]>({ default: [] })

const props = withDefaults(defineProps<{
    metadata: MetadataMap,
}>(), {
    metadata: () => ({})
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// [修改] 計算屬性：過濾掉 monthlyIncome <= 0 的資料 (保留原有的過濾邏輯)
const validList = computed(() => {
    return list.value.filter(item => Number(item.monthlyIncome) > 0)
})

const hasData = computed(() => validList.value.length > 0)

// ==========================================
// 2. 監聽與生命週期
// ==========================================

// [修改] 監聽 Model 資料變化，自動重繪
watch(() => list.value, async () => {
    await nextTick()
    if (hasData.value) {
        renderChart()
    } else if (chartInstance) {
        chartInstance.destroy()
    }
}, { deep: true })

// 監聽 Metadata 變化 (顏色設定改變時重繪)
watch(() => props.metadata.opt_group_id, () => {
    if (hasData.value) renderChart()
}, { deep: true })

onMounted(() => {
    if (hasData.value) {
        renderChart()
    }
})

onUnmounted(() => {
    if (chartInstance) chartInstance.destroy()
})

// ==========================================
// 3. 輔助函式 (保持不變)
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

// 顏色查找 Helper
const getGroupColor = (groupId?: number | string) => {
    if (!groupId || !props.metadata.opt_group_id?.list) return 'rgba(59, 130, 246, 0.6)'
    // 注意：這裡假設 metadata key 為 'value' 或 'code'，請依您的 metadata 結構調整
    // 前一版是用 value，若您確定改為 code 則用 code，此處使用寬鬆比對
    const option = props.metadata.opt_group_id.list.find((opt: any) => (opt.code == groupId || opt.value == groupId))
    return (option as any)?.color || 'rgba(59, 130, 246, 0.6)'
}

// 標籤查找 Helper
const getGroupLabel = (groupId?: number | string) => {
    if (!groupId || !props.metadata.opt_group_id?.list) return '未分類'
    const option = props.metadata.opt_group_id.list.find((opt: any) => (opt.code == groupId || opt.value == groupId))
    return option?.label || '未分類'
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

    // [修改] 使用 validList (已過濾的資料) 進行繪圖
    const dataPoints = validList.value.map(item => ({
        x: Number(item.acquisitionCost) || 0,
        y: parsePercent(item.irr),
        r: calculateRadius(item),
        raw: item
    }))

    const xValues = dataPoints.map(p => p.x)
    const yValues = dataPoints.map(p => p.y)

    const xRange = getSmartRange(xValues, 0.05)
    const yRange = getSmartRange(yValues, 0.1)

    const config: ChartConfiguration = {
        type: 'scatter',
        data: {
            datasets: [{
                label: '資產項目',
                data: dataPoints,
                backgroundColor: (ctx) => {
                    const raw = (ctx.raw as any)?.raw as UserBusiness
                    return getGroupColor(raw?.groupId)
                },
                borderColor: '#FFFFFF',
                borderWidth: 2,
                hoverBackgroundColor: (ctx) => {
                    const raw = (ctx.raw as any)?.raw as UserBusiness
                    return getGroupColor(raw?.groupId)
                },
                hoverBorderColor: '#374151',
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
                        labelColor: (ctx) => {
                            const raw = (ctx.raw as any).raw as UserBusiness
                            return {
                                borderColor: '#fff',
                                backgroundColor: getGroupColor(raw.groupId),
                                borderWidth: 2,
                                borderRadius: 2,
                            }
                        },
                        label: (ctx) => {
                            const raw = (ctx.raw as any).raw as UserBusiness
                            const groupLabel = getGroupLabel(raw.groupId)
                            return [
                                `[${groupLabel}] ${raw.name}`,
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
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}
</style>
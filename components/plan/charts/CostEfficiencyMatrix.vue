<template>
    <el-card shadow="never" v-loading="loading">
        <template #header>
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-bold text-lg text-gray-700">資產效能矩陣</span>
                </div>
                <!-- <el-button circle icon="Refresh" @click="fetchData" title="重新整理" /> -->
            </div>
        </template>

        <div v-if="hasData" class="chart-container">
            <canvas ref="canvasRef"></canvas>
        </div>

        <div v-else class="h-64 flex justify-center items-center">
            <el-empty description="暫無資產數據，無法分析" />
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

// 引用您的 API Hook
import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from '../types/user'

// 註冊 Chart.js 必要元件
Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend, Title)

// ==========================================
// 1. 狀態管理
// ==========================================
const { authFetch } = useApi()
const loading = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 本地暫存資料
const rawList = ref<UserBusiness[]>([])

const hasData = computed(() => rawList.value.length > 0)

// ==========================================
// 2. 輔助函式 (資料處理)
// ==========================================

// 解析 ROI 字串轉數字
const parseROI = (roiStr?: string) => {
    if (!roiStr || roiStr === '-') return -5
    if (roiStr.includes('虧損')) return -10
    if (roiStr.includes('∞')) return 35 // 無本生意給高分
    return parseFloat(roiStr.replace('%', ''))
}

// 計算月淨現金流
const getNetCashFlow = (item: any) => {
    const income = Number(item.monthlyIncome) || 0
    const cost = Number(item.monthlyCost) || 0
    const loan = Number(item.loanAmount) || 0
    const rate = Number(item.loanInterestRate) || 0
    const interest = Math.round(loan * (rate / 100) / 12)
    return income - cost - interest
}

// ==========================================
// 3. API 資料獲取
// ==========================================
const fetchData = async () => {
    loading.value = true
    try {
        const res = await authFetch('/api/v1/user/businesses', {
            method: 'GET',
            params: {
                currentPage: 1,
                pageSize: 100
            }
        })

        if (res && res.ok) {
            const json = await res.json()
            rawList.value = json.list || []

            // 關鍵修正：確保有資料後，等待 DOM 渲染 Canvas 完畢再繪圖
            if (rawList.value.length > 0) {
                await nextTick()
                renderChart()
            }
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('無法載入圖表數據')
    } finally {
        loading.value = false
    }
}
// ==========================================
// 4. Chart.js 繪圖邏輯
// ==========================================
const renderChart = () => {
    // 雙重檢查：確保 DOM 已存在
    if (!canvasRef.value) {
        console.warn('Canvas ref is null, chart render skipped.')
        return
    }

    if (chartInstance) {
        chartInstance.destroy()
    }

    // 1. 資料轉換
    const workingList = rawList.value.filter(item => !!item.monthlyIncome)
    const points = workingList.map(item => {
        const cashFlow = getNetCashFlow(item)
        // 增加防呆：確保半徑不為 NaN
        const safeRadius = isNaN(cashFlow) ? 4 : Math.max(4, Math.min(25, Math.log(Math.max(1, cashFlow)) * 3))

        return {
            x: Number(item.acquisitionCost) || 0,
            y: parseROI(item.roi),
            r: safeRadius,
            raw: { ...item, cashFlow }
        }
    })

    // 2. 計算平均值 (防呆：分母為 0 時回傳 0)
    const count = points.length
    const avgCost = count > 0 ? points.reduce((sum, p) => sum + p.x, 0) / count : 0
    const avgROI = count > 0 ? points.reduce((sum, p) => sum + p.y, 0) / count : 0

    // 3. 定義十字象限插件 (TypeScript 友善寫法)
    const quadrantPlugin: any = {
        id: 'quadrants',
        beforeDraw(chart: Chart) {
            const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart

            // 確保 Scale 存在才繪製
            if (!x || !y) return

            const xPixel = x.getPixelForValue(avgCost)
            const yPixel = y.getPixelForValue(avgROI)

            ctx.save()
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = '#9CA3AF'
            ctx.setLineDash([6, 6])

            // 繪製垂直線 (平均成本) - 確保在繪圖區內
            if (xPixel >= left && xPixel <= right) {
                ctx.moveTo(xPixel, top)
                ctx.lineTo(xPixel, bottom)
            }
            // 繪製水平線 (平均 ROI)
            if (yPixel >= top && yPixel <= bottom) {
                ctx.moveTo(left, yPixel)
                ctx.lineTo(right, yPixel)
            }
            ctx.stroke()

            // 標註文字
            ctx.fillStyle = '#6B7280'
            ctx.font = '12px Arial'
            ctx.fillText(`平均成本: $${Math.round(avgCost / 10000)}萬`, xPixel + 5, top + 15)
            // 稍微調整 ROI 文字位置，避免被圖表邊緣切掉
            ctx.fillText(`平均 ROI: ${avgROI.toFixed(1)}%`, right - 90, yPixel - 5)

            ctx.restore()
        }
    }

    // 4. 設定與渲染
    const config: ChartConfiguration = {
        type: 'scatter',
        data: {
            datasets: [{
                label: '資產分佈',
                data: points,
                // ... (顏色邏輯保持不變)
                backgroundColor: (ctx) => {
                    const p = ctx.raw as any
                    if (!p) return '#ccc'
                    if (p.y < 0) return 'rgba(239, 68, 68, 0.7)'
                    if (p.y < 10) return 'rgba(234, 179, 8, 0.7)'
                    return 'rgba(34, 197, 94, 0.7)'
                },
                borderColor: (ctx) => {
                    const p = ctx.raw as any
                    if (!p) return '#ccc'
                    if (p.y < 0) return '#EF4444'
                    if (p.y < 10) return '#EAB308'
                    return '#22C55E'
                },
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverBorderColor: '#000'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 20 }, // 增加 padding 避免文字切邊
            plugins: {
                legend: { display: false },
                tooltip: {
                    // ... (Tooltip 邏輯保持不變)
                    callbacks: {
                        label: (ctx) => {
                            const raw = (ctx.raw as any).raw
                            return [
                                `名稱: ${raw.name}`,
                                `成本: $${Number(raw.acquisitionCost).toLocaleString()}`,
                                `ROI: ${raw.roi || '-'}`,
                                `月淨流: $${raw.cashFlow.toLocaleString()}`
                            ]
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: '投入成本 (Cost)' },
                    grid: { display: false },
                    ticks: {
                        callback: (val) => `$${Number(val) / 10000}萬`
                    }
                },
                y: {
                    title: { display: true, text: '年化 ROI (%)' },
                    grid: { display: false }
                }
            }
        },
        plugins: [quadrantPlugin]
    }

    chartInstance = new Chart(canvasRef.value, config)
}

// ==========================================
// 5. 生命週期
// ==========================================
onMounted(() => {
    fetchData()
})

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}

/* 圖例顏色球 */
.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.bg-green {
    background-color: rgba(34, 197, 94, 0.8);
}

.bg-yellow {
    background-color: rgba(234, 179, 8, 0.8);
}

.bg-red {
    background-color: rgba(239, 68, 68, 0.8);
}
</style>
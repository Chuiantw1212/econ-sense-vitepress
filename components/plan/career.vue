<template>
    <el-card shadow="never">
        <template #header>
            職業收入
        </template>
        <el-form label-width="auto" :model="modelValue">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="本薪" required>
                        <el-input-number v-model="modelValue.baseSalary" :min="0" :step="1000" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="本薪">
                        <el-text>{{ formatNumber(modelValue.baseSalary) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="+ 伙食津貼">
                        <el-text>3,000 (免稅)</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他津貼">
                        <el-input-number v-model="modelValue.otherAllowance" :min="0" :step="1000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="+ 其他津貼">
                        <el-text>{{ formatNumber(modelValue.otherAllowance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="勞退自提率(%)">
                        <el-input-number v-model="modelValue.pensionRate" :min="0" :max="6" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞退自提">
                        <el-text>{{ formatNumber(modelValue.pensionAmount) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="- 勞保自付">
                        <el-text>{{ formatNumber(modelValue.laborInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="健保眷屬人數">
                        <el-input-number v-model="modelValue.dependents" :min="0" :max="3" :step="1"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 健保自付">
                        <el-text>{{ formatNumber(modelValue.healthInsurance) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="其他扣款">
                        <el-input-number v-model="modelValue.otherDeduction" :min="0" :step="100" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 其他扣款">
                        <el-text>{{ formatNumber(modelValue.otherDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="員工認股(自提)">
                        <el-input-number v-model="modelValue.stockDeduction" :min="0" :step="1000" style="width: 100%"
                            placeholder="每月扣款金額" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="- 認股扣款">
                        <el-text>{{ formatNumber(modelValue.stockDeduction) }}</el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="公司加碼(公提)">
                        <el-input-number v-model="modelValue.stockCompanyMatch" :min="0" :step="1000"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="資產累積">
                        <el-text type="info">
                            + {{ formatNumber(modelValue.stockCompanyMatch) }} (不影響實領)
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="12">
                    <el-form-item label="= 每月實領">
                        <el-text>
                            {{ formatNumber(monthlyNetIncome) }}
                        </el-text>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-divider content-position="center">薪資結構視覺化</el-divider>
            <div style="height: 300px; position: relative;">
                <canvas id="incomeChart"></canvas>
            </div>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { computed, watch, reactive, onMounted, shallowRef } from 'vue'
import { debounce } from 'lodash-es'
import { UserCareer } from './types/user'

// Composables
import { useLaborPension } from '@/components/plan/composables/useLaborPension'
import { useLaborInsurance } from '@/components/plan/composables/useLaborInsurance'
import { useHealthInsurance } from '@/components/plan/composables/useHealthInsurance'

// Chart.js 相關引入
import Chart from 'chart.js/auto'

// --- Props & Emits ---
const props = defineProps<{ modelValue: UserCareer }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: UserCareer): void }>()

// --- 1. State Management ---
const defaultState: UserCareer = {
    baseSalary: 0,
    otherAllowance: 0,
    laborInsurance: 0,
    healthInsurance: 0,
    otherDeduction: 0,
    pensionRate: 0,
    pensionAmount: 0,
    stockDeduction: 0,
    stockCompanyMatch: 0,
    dependents: 0,
}

const formState = reactive<UserCareer>({ ...defaultState })

// --- 2. Composables ---
const pension = useLaborPension(0, 0)
const labor = useLaborInsurance(0)
const health = useHealthInsurance(0, 0)

// --- 3. Chart 相關變數與邏輯 ---
const incomeChartInstance = shallowRef<Chart | null>(null)

// 繪製/更新圖表的核心函式
const drawChart = debounce(() => {
    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement
    if (!ctx) return

    // 準備數據變數
    let pv = 0 // Past Value (起點)
    let fv = 0 // Future Value (終點/水位)

    // 用來存放 Chart.js 需要的資料結構
    // 格式: { label: string, data: [start, end], datasetIndex: 0 | 1 }
    // datasetIndex 0 = 收入/實領 (綠色系)
    // datasetIndex 1 = 扣除項 (紅色系)
    const dataNodes: { label: string, data: [number, number], datasetIndex: 0 | 1 }[] = []

    // 1. 本薪 (Income)
    fv = formState.baseSalary || 0
    dataNodes.push({ label: '本薪', data: [pv, fv], datasetIndex: 0 })

    // 2. 伙食津貼 (Income)
    if (true) { // 伙食津貼固定有
        pv = fv
        fv += 3000
        dataNodes.push({ label: '伙食津貼', data: [pv, fv], datasetIndex: 0 })
    }

    // 3. 其他津貼 (Income)
    if (formState.otherAllowance > 0) {
        pv = fv
        fv += formState.otherAllowance
        dataNodes.push({ label: '其他津貼', data: [pv, fv], datasetIndex: 0 })
    }

    // --- 開始扣款 ---

    // 4. 健保 (Deduction)
    if (formState.healthInsurance > 0) {
        pv = fv
        fv -= formState.healthInsurance
        dataNodes.push({ label: '健保', data: [pv, fv], datasetIndex: 1 })
    }

    // 5. 勞保 (Deduction)
    if (formState.laborInsurance > 0) {
        pv = fv
        fv -= formState.laborInsurance
        dataNodes.push({ label: '勞保', data: [pv, fv], datasetIndex: 1 })
    }

    // 6. 勞退自提 (Deduction)
    if (formState.pensionAmount > 0) {
        pv = fv
        fv -= formState.pensionAmount
        dataNodes.push({ label: '勞退自提', data: [pv, fv], datasetIndex: 1 })
    }

    // 7. 員工認股 (Deduction)
    if (formState.stockDeduction > 0) {
        pv = fv
        fv -= formState.stockDeduction
        dataNodes.push({ label: '員工認股', data: [pv, fv], datasetIndex: 1 })
    }

    // 8. 其他扣款 (Deduction)
    if (formState.otherDeduction > 0) {
        pv = fv
        fv -= formState.otherDeduction
        dataNodes.push({ label: '其他扣款', data: [pv, fv], datasetIndex: 1 })
    }

    // --- 結算 ---

    // 9. 月實領 (Result)
    // 直接從 0 拉到目前的 fv水位
    dataNodes.push({ label: '月實領', data: [0, fv], datasetIndex: 0 })


    // --- 轉換為 Chart.js 格式 ---
    const labels = dataNodes.map(item => item.label)

    // Dataset 0: 收入/正向
    const dataIncome = dataNodes.map(item => {
        return item.datasetIndex === 0 ? item.data : [0, 0] as [number, number]
    }) // 用 [0,0] 佔位
    // Dataset 1: 支出/負向
    const dataDeduction = dataNodes.map(item => {
        return item.datasetIndex === 1 ? item.data : [0, 0] as [number, number]
    })

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '收入/結餘',
                data: dataIncome,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: '扣除項目',
                data: dataDeduction,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const raw = context.raw; // [start, end]
                        const val = Math.abs(raw[1] - raw[0]);
                        return `${context.dataset.label}: ${formatNumber(val)}`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'bottom' as const
            }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    }

    // 渲染或更新
    if (incomeChartInstance.value) {
        incomeChartInstance.value.data = chartData
        incomeChartInstance.value.update()
    } else {
        incomeChartInstance.value = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: chartOptions
        })
    }
}, 300)


// --- 4. Logic Binding & Watchers ---

const insuredSalaryBasis = computed(() => {
    const base = formState.baseSalary || 0
    const other = formState.otherAllowance || 0
    return base + other + 3000
})

// Input Binding
watch(
    [insuredSalaryBasis, () => formState.pensionRate, () => formState.dependents],
    ([newBasis, newPensionRate, newDependents]) => {
        pension.actualWage.value = newBasis
        labor.actualWage.value = newBasis
        health.actualWage.value = newBasis
        pension.selfRate.value = newPensionRate || 0
        health.dependents.value = newDependents || 0
    },
    { immediate: true }
)

// Output Binding & Chart Update
watch(
    [
        pension.selfAmount, labor.personalPremium, health.personalPremium,
        // 監聽所有會影響圖表的數值變動
        () => formState.baseSalary,
        () => formState.otherAllowance,
        () => formState.stockDeduction,
        () => formState.otherDeduction
    ],
    ([pAmount, lAmount, hAmount]) => {
        // 1. 更新數值
        if (formState.pensionAmount !== pAmount) formState.pensionAmount = pAmount
        if (formState.laborInsurance !== lAmount) formState.laborInsurance = lAmount
        if (formState.healthInsurance !== hAmount) formState.healthInsurance = hAmount

        // 2. 觸發繪圖 (因為有 debounce，所以頻繁觸發沒關係)
        drawChart()
    },
    { immediate: true }
)


// --- 5. Data Sync ---
watch(() => props.modelValue, (newVal) => {
    if (!newVal) return
    formState.baseSalary = newVal.baseSalary ?? 0
    formState.otherAllowance = newVal.otherAllowance ?? 0
    formState.pensionRate = newVal.pensionRate ?? 0
    formState.dependents = newVal.dependents ?? 0
    formState.stockDeduction = newVal.stockDeduction ?? 0
    formState.stockCompanyMatch = newVal.stockCompanyMatch ?? 0
    formState.otherDeduction = newVal.otherDeduction ?? 0
    // 這裡也會觸發 formState 變動 -> 進而觸發上面的 Output Binding watch -> drawChart
}, { immediate: true, deep: true })


// Debounce Emit
const emitUpdate = debounce((newState: UserCareer) => {
    emit('update:modelValue', { ...newState })
}, 500)

watch(formState, (newState) => {
    emitUpdate(newState)
}, { deep: true })


// --- Lifecycle ---
onMounted(() => {
    // 確保 DOM 渲染完畢後繪製第一次
    setTimeout(() => {
        drawChart()
    }, 100)
})


// --- Helpers ---
const monthlyNetIncome = computed(() => {
    const m = formState
    const income = (m.baseSalary || 0) + (m.otherAllowance || 0) + 3000
    const deductions = (m.pensionAmount || 0) +
        (m.stockDeduction || 0) +
        (m.laborInsurance || 0) +
        (m.healthInsurance || 0) +
        (m.otherDeduction || 0)
    return income - deductions
})

const formatNumber = (num: number) => {
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('zh-TW').format(num)
}
</script>
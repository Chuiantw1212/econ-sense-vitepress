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

        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { computed, watch, reactive } from 'vue'
import { debounce } from 'lodash-es'
import { UserCareer } from './types/user'

// Composables
import { useLaborPension } from '@/components/plan/composables/useLaborPension'
import { useLaborInsurance } from '@/components/plan/composables/useLaborInsurance'
import { useHealthInsurance } from '@/components/plan/composables/useHealthInsurance'

// --- Props & Emits ---
const props = defineProps<{ modelValue: UserCareer }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: UserCareer): void }>()

// --- 1. State Management (狀態管理) ---
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

// 使用 reactive 作為本地緩存，解決 Element Plus 輸入卡頓問題
const formState = reactive<UserCareer>({ ...defaultState })

// --- 2. Composables (計算核心) ---
// 初始化傳入 0 即可，後續由 Watcher 驅動
const pension = useLaborPension(0, 0)
const labor = useLaborInsurance(0)
const health = useHealthInsurance(0, 0)

// --- 3. Logic Binding (邏輯綁定) ---

// [A] 計算投保薪資基準 (本薪 + 津貼 + 伙食費 3000)
const insuredSalaryBasis = computed(() => {
    // 1. 取得本薪與其他津貼
    const base = formState.baseSalary || 0
    const other = formState.otherAllowance || 0

    // 2. ★ 關鍵修正：必須加上 3000 伙食津貼
    // 因為勞健保是看「全薪」(包含免稅的伙食費)
    const food = 3000

    // 3. 算出總額 (例如 72000 + 0 + 3000 = 75000)
    // 這樣 75000 就會去對應 76500 的級距，算出 1187
    return base + other + food
})

// [B] Input Binding: UI 輸入 -> 驅動 Composables
// 包含: 投保薪資變動、費率變動、眷屬變動
watch(
    [insuredSalaryBasis, () => formState.pensionRate, () => formState.dependents],
    ([newBasis, newPensionRate, newDependents]) => {
        // 更新所有 Composable 的薪資基準
        pension.actualWage.value = newBasis
        labor.actualWage.value = newBasis
        health.actualWage.value = newBasis

        // 更新其他參數
        pension.selfRate.value = newPensionRate || 0
        health.dependents.value = newDependents || 0
    },
    { immediate: true } // ★ 關鍵：初始化時立即執行，確保算出初始金額
)

// [C] Output Binding: Composables 算出結果 -> 寫回 formState
// 包含: 勞退、勞保、健保
watch(
    [pension.selfAmount, labor.personalPremium, health.personalPremium],
    ([pAmount, lAmount, hAmount]) => {
        // 防呆寫入，避免迴圈
        if (formState.pensionAmount !== pAmount) formState.pensionAmount = pAmount
        if (formState.laborInsurance !== lAmount) formState.laborInsurance = lAmount
        if (formState.healthInsurance !== hAmount) formState.healthInsurance = hAmount
    },
    { immediate: true } // ★ 關鍵：確保初始計算結果能寫入 formState
)

// --- 4. Data Synchronization (資料同步) ---

// [Server -> Local] 
// 只同步「輸入項」，保留本地計算出的「結果項」(避免 Race Condition 導致歸零)
watch(() => props.modelValue, (newVal) => {
    if (!newVal) return

    // 只取用 User 輸入的欄位
    formState.baseSalary = newVal.baseSalary ?? 0
    formState.otherAllowance = newVal.otherAllowance ?? 0
    formState.pensionRate = newVal.pensionRate ?? 0
    formState.dependents = newVal.dependents ?? 0

    formState.stockDeduction = newVal.stockDeduction ?? 0
    formState.stockCompanyMatch = newVal.stockCompanyMatch ?? 0
    formState.otherDeduction = newVal.otherDeduction ?? 0

    // 注意：laborInsurance, healthInsurance, pensionAmount 由本地 Composable 掌控
}, { immediate: true, deep: true })

// [Local -> Server]
// Debounce 防止頻繁寫入資料庫
const emitUpdate = debounce((newState: UserCareer) => {
    emit('update:modelValue', { ...newState })
}, 500)

watch(formState, (newState) => {
    emitUpdate(newState)
}, { deep: true })

// --- 5. Helpers (顯示用) ---
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
<template>
    <el-card shadow="never" class="saving-card">
        <el-row :gutter="20" justify="space-between" align="bottom">
            <el-col :span="7">
                <el-statistic title="薪資實拿" :value="takeHomePay">

                </el-statistic>
            </el-col>

            <el-col :span="1" class="operator">-</el-col>

            <el-col :span="7">
                <el-statistic title="月均消費" :value="totalExpenses" value-style="color: #f56c6c">
                </el-statistic>
            </el-col>

            <el-col :span="1" class="operator">=</el-col>

            <el-col :span="8">
                <el-statistic title="每月結餘" :value="netSavings"
                    :value-style="{ color: savingStatus.color, fontWeight: 'bold' }">
                    <template #suffix>
                        <el-tag :type="savingStatus.type" size="small" effect="light" class="status-tag">
                            {{ savingStatus.label }}
                        </el-tag>
                    </template>
                </el-statistic>
            </el-col>
        </el-row>

        <el-divider style="margin: 20px 0 15px 0" />

        <div class="rate-section">
            <div class="rate-header">
                <span class="rate-title">儲蓄率 (Saving Rate)</span>
                <span class="rate-value" :style="{ color: savingStatus.color }">{{ savingRate.toFixed(1) }}%</span>
            </div>
            <el-progress :percentage="clampedSavingRate" :stroke-width="12" :color="savingStatus.color"
                :show-text="false" />
        </div>

        <el-alert v-if="savingRate < 10" title="儲蓄警告：現金留存率極低，財富累積速度遲滯。" type="error" :closable="false" show-icon
            style="margin-top: 15px" />
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserCareer, UserCreditCard } from './types/user'

const props = defineProps<{
    career: UserCareer;
    creditCards: UserCreditCard[];
}>()

interface SavingStatus {
  type: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  color: string;
  label: string;
}

// --- 計算邏輯 (保持不變) ---
const grossSalary = computed(() => (Number(props.career.baseSalary) || 0) + (Number(props.career.otherAllowance) || 0))
const totalDeductions = computed(() => {
    const c = props.career
    return (Number(c.laborInsurance) || 0) + (Number(c.healthInsurance) || 0) +
        (Number(c.pensionAmount) || 0) + (Number(c.stockDeduction) || 0) + (Number(c.otherDeduction) || 0)
})
const takeHomePay = computed(() => grossSalary.value - totalDeductions.value)
const totalExpenses = computed(() => props.creditCards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0))
const netSavings = computed(() => takeHomePay.value - totalExpenses.value)
const savingRate = computed(() => grossSalary.value <= 0 ? 0 : (netSavings.value / grossSalary.value) * 100)
const clampedSavingRate = computed(() => Math.min(100, Math.max(0, savingRate.value)))

const savingStatus = computed<SavingStatus>(() => {
  const rate = savingRate.value
  if (rate <= 0) return { type: 'danger', color: '#F56C6C', label: '赤字' }
  if (rate < 15) return { type: 'warning', color: '#E6A23C', label: '薄弱' }
  if (rate < 30) return { type: 'primary', color: '#409EFF', label: '穩健' }
  return { type: 'success', color: '#67C23A', label: '卓越' }
})

const formatNumber = (num: number) => new Intl.NumberFormat('zh-TW').format(num)
</script>

<style scoped>
.saving-card {
    border-radius: 12px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-weight: 700;
    color: #303133;
}

.operator {
    text-align: center;
    font-size: 20px;
    color: #c0c4cc;
    padding-bottom: 12px;
}

.sub-info {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
}

.rate-section {
    margin-top: 5px;
}

.rate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.rate-title {
    font-size: 13px;
    color: #606266;
}

.rate-value {
    font-weight: bold;
    font-size: 16px;
}

.status-tag {
    margin-left: 8px;
    vertical-align: middle;
}
</style>
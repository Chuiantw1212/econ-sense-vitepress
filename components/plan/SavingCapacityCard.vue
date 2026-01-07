<template>
    <el-card shadow="never" class="class-status-card">
        <div class="math-formula">
            <div class="f-item">
                <div class="f-label">薪資實拿</div>
                <div class="f-value">{{ formatNumber(takeHomePay) }}</div>
            </div>
            <div class="f-op">-</div>
            <div class="f-item">
                <div class="f-label">月均支出</div>
                <div class="f-value danger">{{ formatNumber(totalExpenses) }}</div>
            </div>
            <div class="f-op">=</div>
            <div class="f-item">
                <div class="f-label">每月結餘</div>
                <div class="f-value result" :style="{ color: savingStatus.color }">
                    {{ formatNumber(netSavings) }}
                </div>
            </div>
        </div>

        <div class="level-identity">
            <div class="identity-top">
                <span class="candidate-tag" :style="{ backgroundColor: savingStatus.color }">
                    {{ savingStatus.level }} 候選資格
                </span>
                <span class="rate-display" :style="{ color: savingStatus.color }">
                    {{ savingRate.toFixed(1) }}% <small>儲蓄率</small>
                </span>
            </div>
            <div class="segmented-bar">
                <div v-for="i in 5" :key="i" class="bar-segment"
                    :style="{ backgroundColor: i <= savingStatus.activeSegments ? savingStatus.color : '#f0f2f5' }">
                </div>
            </div>
        </div>

        <div class="strategic-diagnosis">
            <div class="diagnosis-grid">
                <div class="diag-column">
                    <div class="diag-header">
                        <el-icon>
                            <Monitor />
                        </el-icon> 長期財富定位
                    </div>
                    <div class="diag-main-text">{{ savingStatus.predictionTitle }}</div>
                </div>

                <div class="v-divider"></div>

                <div class="diag-column">
                    <div class="diag-header">
                        <el-icon>
                            <Connection />
                        </el-icon> 階級紮根關鍵
                    </div>
                    <div class="diag-main-text" :style="{ color: savingStatus.color }">
                        {{ savingStatus.rootingSkill }}
                    </div>
                </div>
            </div>

            <div class="strategy-advice">
                {{ savingStatus.rootingAdvice }}
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Monitor, Connection } from '@element-plus/icons-vue'
import type { UserCareer, UserCreditCard } from './types/user'

const props = defineProps<{
    career: UserCareer;
    creditCards: UserCreditCard[];
}>()

interface SavingStatus {
    level: string;
    activeSegments: number;
    color: string;
    predictionTitle: string;
    rootingSkill: string;
    rootingAdvice: string;
}

// --- 核心計算邏輯 ---
const grossSalary = computed(() => (Number(props.career.baseSalary) || 0) + (Number(props.career.otherAllowance) || 0))
const totalDeductions = computed(() => {
    const c = props.career
    return (Number(c.laborInsurance) || 0) + (Number(c.healthInsurance) || 0) +
        (Number(c.pensionPersonalAmount) || 0) + (Number(c.stockDeduction) || 0) + (Number(c.otherDeduction) || 0)
})
const takeHomePay = computed(() => grossSalary.value - totalDeductions.value)
const totalExpenses = computed(() => props.creditCards.reduce((sum, card) => sum + (Number(card.averageMonthlyExpense) || 0), 0))
const netSavings = computed(() => takeHomePay.value - totalExpenses.value)
const savingRate = computed(() => grossSalary.value <= 0 ? 0 : (netSavings.value / grossSalary.value) * 100)

// --- 階級診斷數據 ---
const savingStatus = computed<SavingStatus>(() => {
    const r = savingRate.value
    if (r < 0) return {
        level: 'L1', activeSegments: 1, color: '#f56c6c',
        predictionTitle: 'PR 10 以下 (脆弱層)', rootingSkill: '現金流止血',
        rootingAdvice: '目前處於結構性崩潰邊緣。紮根前提是徹底切斷信貸依賴，停止財務熵增。'
    }
    if (r < 15) return {
        level: 'L2', activeSegments: 2, color: '#e6a23c',
        predictionTitle: 'PR 10 - 30 (工薪層)', rootingSkill: '勞動力轉化',
        rootingAdvice: '此儲蓄率僅能對抗通膨。紮根需靠大幅提升主動收入級距，積累原始資本。'
    }
    if (r < 30) return {
        level: 'L3', activeSegments: 3, color: '#409eff',
        predictionTitle: 'PR 50 - 70 (典型中產)', rootingSkill: '防禦性配置',
        rootingAdvice: '已具備中產門檻。紮根需靠正確的資產經營，避免在景氣波動中被階級收割。'
    }
    if (r < 45) return {
        level: 'L4', activeSegments: 4, color: '#67c23a',
        predictionTitle: 'PR 80 - 90 (富裕中產)', rootingSkill: '複利引擎運作',
        rootingAdvice: '候選資格優異。紮根關鍵在於建立自動化資產系統，讓資產規模脫離勞動力束縛。'
    }
    return {
        level: 'L5', activeSegments: 5, color: '#34d399',
        predictionTitle: 'PR 95 - 99 (頂層富豪)', rootingSkill: '結構性財富固化',
        rootingAdvice: '抗熵力極強。紮根在於建立跨週期的資產架構，達成財富的自我複製與傳承。'
    }
})

const formatNumber = (num: number) => new Intl.NumberFormat('zh-TW').format(num)
</script>

<style scoped>
/* 算式區 */
.math-formula {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0 25px 0;
}

.f-item {
    text-align: center;
    flex: 1;
}

.f-label {
    font-size: 11px;
    color: #909399;
    margin-bottom: 6px;
}

.f-value {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.f-value.danger {
    color: #f56c6c;
}

.f-value.result {
    font-size: 24px;
    font-weight: 800;
}

.f-op {
    color: #dcdfe6;
    font-size: 18px;
}

/* 階級進度區 */
.level-identity {
    margin-bottom: 30px;
}

.identity-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.candidate-tag {
    color: white;
    font-size: 11px;
    font-weight: 900;
    padding: 2px 10px;
    border-radius: 6px;
    letter-spacing: 1px;
}

.rate-display {
    font-size: 20px;
    font-weight: 800;
}

.rate-display small {
    font-size: 11px;
    font-weight: normal;
    color: #909399;
}

.segmented-bar {
    display: flex;
    gap: 6px;
}

.bar-segment {
    height: 8px;
    flex: 1;
    border-radius: 4px;
    background-color: #f0f2f5;
}

/* 下半部對稱診斷區 */
.strategic-diagnosis {
    padding-top: 25px;
    border-top: 1px solid #f2f3f5;
}

.diagnosis-grid {
    display: flex;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 25px;
}

.diag-column {
    flex: 1;
    text-align: center;
    padding: 0 10px;
}

.v-divider {
    width: 1px;
    background-color: #f0f2f5;
    margin: 5px 0;
}

.diag-header {
    font-size: 11px;
    color: #909399;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.diag-main-text {
    font-size: 17px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.3;
}

.strategy-advice {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
    line-height: 1.6;
    padding: 16px 20px;
    background-color: #f9fafb;
    border-radius: 12px;
    text-align: center;
    /* 為了配合對稱感，建議文字也置中 */
}

/* 移除 el-statistic 預設樣式干擾 */
:deep(.el-statistic__head) {
    margin-bottom: 8px;
}
</style>
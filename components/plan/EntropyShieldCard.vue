<template>
    <el-card shadow="never" class="class-status-card">
        <div class="math-formula">
            <div class="f-item">
                <div class="f-label">月均總開支</div>
                <div class="f-value danger">{{ formatCurrency(monthlyBurnRate) }}</div>
            </div>
            <div class="f-op">×</div>
            <div class="f-item">
                <div class="f-label">防禦倍數</div>
                <div class="f-value">12 <small>個月</small></div>
            </div>
            <div class="f-op">=</div>
            <div class="f-item">
                <div class="f-label">理想抗熵水位</div>
                <div class="f-value result" :style="{ color: shieldStatus.color }">
                    {{ formatCurrency(targetLevel) }}
                </div>
            </div>
        </div>

        <div class="level-identity">
            <div class="identity-top">
                <span class="candidate-tag" :style="{ backgroundColor: shieldStatus.color }">
                    {{ shieldStatus.level }} 水位認證
                </span>
                <span class="rate-display" :style="{ color: shieldStatus.color }">
                    {{ shieldStatus.title }}
                </span>
            </div>
            <div class="segmented-bar">
                <div v-for="i in 5" :key="i" class="bar-segment"
                    :style="{ backgroundColor: i <= shieldStatus.activeSegments ? shieldStatus.color : '#f0f2f5' }">
                </div>
            </div>
        </div>

        <div class="strategic-diagnosis">
            <div class="diagnosis-grid">
                <div class="diag-column">
                    <div class="diag-header">
                        <el-icon>
                            <Monitor />
                        </el-icon> 目前實質水位
                    </div>
                    <div class="diag-main-text">{{ formatCurrency(totalLiquidAssets) }}</div>
                    <div class="diag-sub-text">流動性資產總計</div>
                </div>

                <div class="v-divider"></div>

                <div class="diag-column">
                    <div class="diag-header">
                        <el-icon>
                            <Connection />
                        </el-icon> 系統防禦韌性
                    </div>
                    <div class="diag-main-text" :style="{ color: shieldStatus.color }">
                        {{ shieldStatus.rootingSkill }}
                    </div>
                    <div class="diag-sub-text">可支撐 {{ bufferMonths.toFixed(1) }} 個月</div>
                </div>
            </div>

            <div class="strategy-advice">
                <div v-for="(para, index) in shieldStatus.rootingAdvice" :key="index" class="advice-para">
                    {{ para }}
                </div>

                <div v-if="gapAmount > 0" class="gap-note" :style="{ borderTopColor: shieldStatus.color + '30' }">
                    距離「12 個月理想水位」尚缺 <span>{{ formatCurrency(gapAmount) }}</span>
                </div>
                <div v-else class="gap-note success">
                    <el-icon>
                        <CircleCheck />
                    </el-icon> 已達成 100% 理想防禦水位
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Monitor, Connection, CircleCheck } from '@element-plus/icons-vue'
import type { UserFormState } from './types/user'

const state = defineModel<UserFormState>({ required: true })

interface ShieldStatus {
    level: string;
    activeSegments: number;
    color: string;
    title: string;
    rootingSkill: string;
    rootingAdvice: string[];
}

// --- 核心計算邏輯 ---

// 1. 月均消耗速率 (Burn Rate)
const monthlyBurnRate = computed(() => {
    return state.value.creditCards.reduce((sum, c) => sum + (Number(c.averageMonthlyExpense) || 0), 0)
})

// 2. 理想抗熵水位 (以 12 個月為終極目標)
const targetLevel = computed(() => monthlyBurnRate.value * 12)

// 3. 目前流動資產 (Cash + Portfolio)
const totalLiquidAssets = computed(() => {
    return state.value.portfolios.reduce((sum, p) => sum + (Number(p.marketValue || 0) * Number(p.exchangeRate || 1)), 0)
})

// 4. 水位百分比與月數
const bufferMonths = computed(() => {
    if (monthlyBurnRate.value <= 0) return totalLiquidAssets.value > 0 ? 99 : 0
    return totalLiquidAssets.value / monthlyBurnRate.value
})

const gapAmount = computed(() => Math.max(0, targetLevel.value - totalLiquidAssets.value))

// --- 水位診斷數據 ---
const shieldStatus = computed<ShieldStatus>(() => {
    const m = bufferMonths.value

    if (m < 3) return {
        level: 'L1', activeSegments: 1, color: '#f56c6c', title: '水位枯竭',
        rootingSkill: '極低抗風險力',
        rootingAdvice: [
            '目前資產水位處於「乾枯期」，無法應付任何突發的系統性熵增。',
            '在水位回升至 3 個月標竿前，系統隨時有崩潰風險。建議立即凍結非必要開支，鎖定現金。'
        ]
    }
    if (m < 6) return {
        level: 'L2', activeSegments: 2, color: '#e6a23c', title: '警戒水位',
        rootingSkill: '脆弱防禦系統',
        rootingAdvice: [
            '資產水位僅能維持基本生存，缺乏階級紮根所需的心理韌性。',
            '此階段的重心應放在「資產蓄水」，而非盲目追求投報率。穩固的水位是 L2 跨越 L3 的唯一跳板。'
        ]
    }
    if (m < 9) return {
        level: 'L3', activeSegments: 3, color: '#409eff', title: '標準水位',
        rootingSkill: '穩定抗熵能力',
        rootingAdvice: [
            '水位已達中產階級安全標準，具備應對中短期震盪的防禦力。',
            '你已拿到「資產經營」的入場券。在維持此水位的基礎上，可開始將溢出的結餘導向複利引擎。'
        ]
    }
    if (m < 12) return {
        level: 'L4', activeSegments: 4, color: '#67c23a', title: '充沛水位',
        rootingSkill: '強韌階級防禦',
        rootingAdvice: [
            '資產水位趨於飽和，系統具備極佳的容錯空間。',
            '高度的水位讓你具備「跨週期」的等待能力，能在市場非理性波動時保持絕對冷靜，這是紮根富裕層的關鍵。'
        ]
    }
    return {
        level: 'L5', activeSegments: 5, color: '#34d399', title: '抗熵溢流',
        rootingSkill: '策略性主動權',
        rootingAdvice: [
            '資產水位已溢出理想防禦線，意味著你獲得了人生的「決策主動權」。',
            '你不需要為了生存而被迫變賣資產。現在是進行結構性佈局、追求階級永續的最佳時機。'
        ]
    }
})

const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(num)
}
</script>

<style scoped>
.class-status-card {
    border-radius: 16px;
}

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

.f-value small {
    font-size: 11px;
    font-weight: normal;
    color: #909399;
}

.f-op {
    color: #dcdfe6;
    font-size: 18px;
}

/* 進度刻度區 */
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
    font-size: 18px;
    font-weight: 800;
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
    transition: background-color 0.5s ease;
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
    font-size: 18px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.3;
}

.diag-sub-text {
    font-size: 11px;
    color: #909399;
    margin-top: 4px;
}

/* 底部建議 (段落化) */
.strategy-advice {
    font-size: 15px;
    font-weight: 500;
    color: #4b5563;
    line-height: 1.6;
    padding: 16px 24px;
    background-color: #f9fafb;
    border-radius: 12px;
    text-align: left;
}

.advice-para {
    margin-bottom: 10px;
}

.advice-para:last-child {
    margin-bottom: 0;
}

/* 水位差距提醒 */
.gap-note {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #dcdfe6;
    font-size: 13px;
    color: #909399;
    text-align: center;
}

.gap-note span {
    color: #303133;
    font-weight: 800;
}

.gap-note.success {
    color: #67c23a;
    font-weight: bold;
    border-top: none;
}
</style>
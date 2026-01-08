<template>
    <el-card shadow="never">

        <el-form label-position="top">

            <el-divider content-position="left">基礎參數設定</el-divider>

            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="真實月開銷基數 (Base)">
                        <el-input-number v-model="baseExpense" :step="1000" style="width: 100%"
                            controls-position="right" />
                        <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 4px;">
                            * 不含房租與教養費的純生活費
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="居住成本還原 (Housing Correction)">
                        <el-select v-model="housingKey" style="width: 100%">
                            <el-option v-for="opt in housingOptions" :key="opt.value" :label="opt.label"
                                :value="opt.value">
                                <span style="float: left">{{ opt.label }}</span>
                                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                                    +{{ opt.cost.toLocaleString() }}
                                </span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="活躍期圓夢係數 (Lifestyle)">
                        <el-input-number v-model="lifestyleRate" :min="1.0" :max="2.0" :step="0.1" style="width: 100%"
                            controls-position="right" />
                        <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 4px;">
                            * 1.1 代表增加 10% 旅遊娛樂預算
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="12" :xs="24">
                    <el-form-item label="高齡醫療公積金 (Aging Medical)">
                        <el-select v-model="medicalKey" style="width: 100%">
                            <el-option label="健保優先型 (+3,000/月)" value="basic" />
                            <el-option label="品質加強型 (+6,000/月)" value="enhanced" />
                            <el-option label="高端醫療型 (+10,000/月)" value="premium" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">
                <el-icon style="vertical-align: middle; margin-right: 4px">
                    <Sunny />
                </el-icon>
                <span>階段一：活躍圓夢期 (65-75歲)</span>
            </el-divider>

            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <el-form-item label="生活費 (含圓夢加成)">
                        <el-input :value="formatMoney(baseExpense * lifestyleRate)" disabled style="width: 100%">
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="居住成本還原">
                        <el-input :value="formatMoney(housingCost)" disabled style="width: 100%">
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="每月總支出預估">
                        <el-input :value="formatMoney(activeTotal)" disabled style="width: 100%">
                            <template #prefix>
                                <span style="color: var(--el-color-primary); font-weight: bold;">●</span>
                            </template>
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-divider content-position="left">
                <el-icon style="vertical-align: middle; margin-right: 4px">
                    <Moon />
                </el-icon>
                <span>階段二：沈澱靜養期 (75-85歲)</span>
            </el-divider>

            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <el-form-item label="生活費 (活動力下降 90%)">
                        <el-input :value="formatMoney(baseExpense * 0.9)" disabled style="width: 100%">
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="高齡醫療 + 居住還原">
                        <el-input :value="formatMoney(medicalCost + housingCost)" disabled style="width: 100%">
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :xs="24">
                    <el-form-item label="每月總支出預估">
                        <el-input :value="formatMoney(passiveTotal)" disabled style="width: 100%">
                            <template #prefix>
                                <span style="color: var(--el-color-info); font-weight: bold;">●</span>
                            </template>
                            <template #suffix>元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-alert type="info" :closable="false" show-icon style="margin-top: 10px;">
                <template #title>
                    85歲後將自動切換至「失能照護模式 (Care Scenario)」計算，費用結構將完全不同。
                </template>
            </el-alert>

        </el-form>
    </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

// --- State Definitions ---

const baseExpense = ref(36300)
const lifestyleRate = ref(1.1)

// 居住還原設定
const housingKey = ref('inherit')
const housingOptions = [
    { value: 'none', label: '維持現狀 (家人付)', cost: 0 },
    { value: 'inherit', label: '自有/繼承 (水電修繕)', cost: 5000 },
    { value: 'rent', label: '轉為租屋', cost: 20000 }
]

// 高齡醫療設定
const medicalKey = ref('basic')
const medicalOptions = {
    basic: 3000,
    enhanced: 6000,
    premium: 10000
}

// --- Computed Values ---

const housingCost = computed(() => {
    const opt = housingOptions.find(o => o.value === housingKey.value)
    return opt ? opt.cost : 0
})

const medicalCost = computed(() => {
    return medicalOptions[medicalKey.value] || 0
})

// 階段一總額
const activeTotal = computed(() => {
    const lifestyleAmt = Math.round(baseExpense.value * lifestyleRate.value)
    return lifestyleAmt + housingCost.value
})

// 階段二總額
const passiveTotal = computed(() => {
    const reducedBase = Math.round(baseExpense.value * 0.9)
    return reducedBase + housingCost.value + medicalCost.value
})

// --- Utilities ---

const formatMoney = (val) => {
    if (!val && val !== 0) return '-'
    return Math.round(val).toLocaleString()
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
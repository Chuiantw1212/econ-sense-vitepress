<template>
    <div class="business-manager">
        <el-row :gutter="12" class="dashboard-summary">
            <el-col :span="8" :xs="24">
                <div class="stat-card">
                    <div class="label">資產總規模</div>
                    <div class="value">{{ formatCurrency(summary.totalCost) }}</div>
                </div>
            </el-col>
            <el-col :span="8" :xs="12">
                <div class="stat-card">
                    <div class="label">預估月淨利</div>
                    <div class="value highlight">
                        {{ summary.totalNetFlow > 0 ? '+' : '' }}{{ formatCurrency(summary.totalNetFlow) }}
                    </div>
                </div>
            </el-col>
            <el-col :span="8" :xs="12">
                <div class="stat-card">
                    <div class="label">加權 ROI</div>
                    <div class="value">{{ summary.avgRoi }}%</div>
                </div>
            </el-col>
        </el-row>

        <div class="action-bar">
            <span class="list-title">資產列表 ({{ businessList.length }})</span>
            <el-button type="primary" :icon="Plus" @click="openEditor(null)">
                新增資產
            </el-button>
        </div>

        <el-table :data="businessList" style="width: 100%" stripe @row-click="openEditor" class="clickable-table">
            <el-table-column label="資產名稱" min-width="140">
                <template #default="{ row }">
                    <span style="font-weight: 500;">{{ row.name || '未命名' }}</span>
                    <div class="mobile-subtitle">{{ row.startDate }} 啟用</div>
                </template>
            </el-table-column>

            <el-table-column label="稅務類別" width="110" align="center">
                <template #default="{ row }">
                    <el-tag :type="getTaxTag(row.taxCategory)" size="small" effect="plain">
                        {{ getTaxLabel(row.taxCategory) }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="投入成本" width="120" align="right" class-name="hidden-xs-only">
                <template #default="{ row }">
                    {{ formatNumber(row.acquisitionCost) }}
                </template>
            </el-table-column>

            <el-table-column label="月淨現金流" width="120" align="right">
                <template #default="{ row }">
                    <span
                        :style="{ color: getNetCashFlow(row) >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
                        {{ formatNumber(getNetCashFlow(row)) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column width="60" align="center">
                <template #default>
                    <el-icon color="#909399">
                        <EditPen />
                    </el-icon>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="isDialogVisible" :title="isEditMode ? '編輯資產項目' : '新增資產項目'" :width="dialogWidth"
            destroy-on-close align-center append-to-body>

            <el-form label-position="top" :model="formState" class="detail-form">

                <el-divider content-position="left">基本設定</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="資產名稱">
                            <el-input v-model="formState.name" placeholder="例：屏東太陽能 A區" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="稅務類別">
                            <el-select v-model="formState.taxCategory" style="width: 100%">
                                <el-option label="推計所得 6%" value="deemed_6" />
                                <el-option label="核實申報" value="verified" />
                                <el-option label="免稅" value="exempt" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="初始取得成本">
                            <el-input-number v-model="formState.acquisitionCost" :step="10000" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="開始營運年月">
                            <el-date-picker v-model="formState.startDate" type="month" value-format="YYYY-MM"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">營收與成本</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="月平均收入">
                            <el-input-number v-model="formState.monthlyIncome" :step="1000" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="月維運成本">
                            <el-input-number v-model="formState.monthlyCost" :step="500" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">融資貸款</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="貸款餘額">
                            <el-input-number v-model="formState.loanAmount" :step="100000" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="24">
                        <el-form-item label="貸款年利率 (%)">
                            <el-input-number v-model="formState.loanInterestRate" :step="0.1" :precision="2"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div
                    style="margin-top: 24px; padding: 20px 16px; background-color: var(--el-fill-color-light); border-radius: 8px;">
                    <el-row :gutter="20">
                        <el-col :span="12" :xs="12">
                            <el-statistic title="預估月淨利">
                                <template #formatter>
                                    <span :style="{
                                        color: tempNetFlow >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)',
                                        fontWeight: 'bold',
                                        fontSize: '18px'
                                    }">
                                        {{ formatCurrency(tempNetFlow) }}
                                    </span>
                                </template>
                            </el-statistic>
                        </el-col>

                        <el-col :span="12" :xs="12">
                            <el-statistic title="應稅所得 (年)">
                                <template #formatter>
                                    <span style="font-size: 18px; font-weight: 500;">
                                        {{ formatCurrency(tempTaxableIncome) }}
                                    </span>
                                </template>
                            </el-statistic>
                        </el-col>
                    </el-row>
                </div>

            </el-form>

            <template #footer>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <el-button v-if="isEditMode" type="danger" link @click="handleDelete">
                            刪除此項目
                        </el-button>
                    </div>
                    <div>
                        <el-button @click="isDialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="isSaving" @click="handleSave">
                            確認儲存
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Plus, EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UserBusiness } from './types/user'
import { useApi } from '@/components/plan/composables/useApi'

// --- 1. Model & State ---
const businessList = defineModel<UserBusiness[]>({ required: true, default: [] })

const { authFetch } = useApi()
const isDialogVisible = ref(false)
const isSaving = ref(false)
const isEditMode = ref(false)
const dialogWidth = ref('600px') // 預設寬度

// 編輯中的暫存物件
const formState = ref<UserBusiness>(createEmptyBusiness())

// --- 2. Dashboard Summary ---
const summary = computed(() => {
    let totalCost = 0
    let totalNetFlow = 0
    let totalEquity = 0

    businessList.value.forEach(item => {
        totalCost += (item.acquisitionCost || 0)
        totalNetFlow += getNetCashFlow(item)
        totalEquity += ((item.acquisitionCost || 0) - (item.loanAmount || 0))
    })

    const annualProfit = totalNetFlow * 12
    const avgRoi = totalEquity > 0 ? (annualProfit / totalEquity * 100).toFixed(2) : '0.00'

    return { totalCost, totalNetFlow, avgRoi }
})

// --- 3. Actions ---

function openEditor(row: UserBusiness | null) {
    if (row) {
        isEditMode.value = true
        formState.value = JSON.parse(JSON.stringify(row))
    } else {
        isEditMode.value = false
        formState.value = createEmptyBusiness()
    }
    isDialogVisible.value = true
}

async function handleSave() {
    isSaving.value = true
    try {
        const method = isEditMode.value ? 'PUT' : 'POST'
        const url = isEditMode.value
            ? `/api/v1/user/business/${formState.value.id}`
            : `/api/v1/user/business`

        const res = await authFetch(url, {
            method: method,
            body: formState.value
        })

        if (!res || !res.ok) throw new Error('Save failed')

        const savedItem: UserBusiness = await res.json()

        if (isEditMode.value) {
            const idx = businessList.value.findIndex(item => item.id === savedItem.id)
            if (idx !== -1) businessList.value[idx] = savedItem
        } else {
            businessList.value.push(savedItem)
        }

        ElMessage.success('儲存成功')
        isDialogVisible.value = false
    } catch (e) {
        console.error(e)
        ElMessage.error('儲存失敗')
    } finally {
        isSaving.value = false
    }
}

function handleDelete() {
    ElMessageBox.confirm(`確定刪除「${formState.value.name}」？`, '警告', { type: 'warning' })
        .then(async () => {
            if (!formState.value.id) return
            try {
                await authFetch(`/api/v1/user/business/${formState.value.id}`, { method: 'DELETE' })

                const idx = businessList.value.findIndex(item => item.id === formState.value.id)
                if (idx !== -1) businessList.value.splice(idx, 1)

                ElMessage.success('已刪除')
                isDialogVisible.value = false
            } catch (e) {
                ElMessage.error('刪除失敗')
            }
        })
        .catch(() => { })
}

// --- 4. Helpers & Calcs ---

function createEmptyBusiness(): UserBusiness {
    return {
        name: '',
        taxCategory: 'deemed_6',
        acquisitionCost: 0,
        startDate: new Date().toISOString().slice(0, 7),
        monthlyIncome: 0,
        monthlyCost: 0,
        loanAmount: 0,
        loanInterestRate: 0
    }
}

function getNetCashFlow(item: UserBusiness): number {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

const tempNetFlow = computed(() => getNetCashFlow(formState.value))
const tempTaxableIncome = computed(() => {
    const revenue = (formState.value.monthlyIncome || 0) * 12
    if (formState.value.taxCategory === 'deemed_6') {
        return Math.round(revenue * 0.06)
    }
    return 0
})

function formatCurrency(val: number): string {
    return `$ ${Math.round(val).toLocaleString()}`
}

function formatNumber(val: number | undefined): string {
    return val ? val.toLocaleString() : '0'
}

function getTaxTag(cat: string) {
    const map: Record<string, string> = { deemed_6: 'warning', verified: 'primary', exempt: 'success' }
    return map[cat] || 'info'
}

function getTaxLabel(cat: string) {
    const map: Record<string, string> = { deemed_6: '推計6%', verified: '核實', exempt: '免稅' }
    return map[cat] || '-'
}

// --- RWD Dialog Width ---
const checkWidth = () => {
    // 手機版給 90% 或 95%，電腦版給固定 600px 即可
    dialogWidth.value = window.innerWidth < 768 ? '95%' : '600px'
}
onMounted(() => {
    checkWidth()
    window.addEventListener('resize', checkWidth)
})
onUnmounted(() => window.removeEventListener('resize', checkWidth))

</script>

<style scoped>
.business-manager {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Dashboard Cards */
.stat-card {
    background-color: var(--el-bg-color);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);
    text-align: center;
    box-shadow: var(--el-box-shadow-light);
    margin-bottom: 8px;
}

.stat-card .label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
}

.stat-card .value {
    font-size: 18px;
    font-weight: bold;
    color: var(--el-text-color-primary);
}

.stat-card .value.highlight {
    color: var(--el-color-success);
}

/* Action Bar */
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
}

.list-title {
    font-weight: bold;
    font-size: 16px;
}

/* Table Styles */
.clickable-table {
    cursor: pointer;
}

.mobile-subtitle {
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.text-success {
    color: var(--el-color-success);
}

.text-danger {
    color: var(--el-color-danger);
}

/* Dialog Calc Box */
.calc-box {
    margin-top: 10px;
    padding: 12px;
    background-color: var(--el-fill-color-light);
    border-radius: 6px;
    border: 1px dashed var(--el-border-color);
}

.calc-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 14px;
}

.calc-row .highlight {
    font-weight: bold;
}

.note {
    color: var(--el-text-color-secondary);
}

/* RWD */
@media (max-width: 768px) {
    .hidden-xs-only {
        display: none;
    }
}
</style>
<template>
    <div class="business-table-container">

        <el-row :gutter="12" class="mb-4">
            <el-col :span="8" :xs="24">
                <el-card shadow="never" class="stat-card">
                    <div class="stat-label">資產總規模</div>
                    <div class="stat-value">{{ formatCurrency(summary.totalCost) }}</div>
                </el-card>
            </el-col>
            <el-col :span="8" :xs="12">
                <el-card shadow="never" class="stat-card">
                    <div class="stat-label">預估月淨利</div>
                    <div class="stat-value" :class="summary.totalNetFlow >= 0 ? 'text-success' : 'text-danger'">
                        {{ summary.totalNetFlow > 0 ? '+' : '' }}{{ formatCurrency(summary.totalNetFlow) }}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8" :xs="12">
                <el-card shadow="never" class="stat-card">
                    <div class="stat-label">加權 ROI (年)</div>
                    <div class="stat-value">{{ summary.avgRoi }}%</div>
                </el-card>
            </el-col>
        </el-row>

        <div class="mb-2">
            <h3 class="text-lg font-bold text-gray-700 m-0">商業與副業資產 ({{ tableData.length }})</h3>
        </div>

        <template v-if="tableData.length > 0">
            <el-table :data="tableData" style="width: 100%" stripe
                :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
                <el-table-column label="名稱" min-width="140">
                    <template #default="{ row }">
                        <div class="font-medium text-gray-800">{{ row.name }}</div>
                        <div class="text-xs text-gray-400">{{ row.startDate }} 啟用</div>
                    </template>
                </el-table-column>

                <el-table-column label="投入成本" width="120" align="right" class-name="hidden-xs-only">
                    <template #default="{ row }">
                        {{ formatNumber(row.acquisitionCost) }}
                    </template>
                </el-table-column>

                <el-table-column label="月淨現金流" width="120" align="right">
                    <template #default="{ row }">
                        <span :class="getNetCashFlow(row) >= 0 ? 'text-success' : 'text-danger'"
                            class="font-mono font-bold">
                            {{ formatNumber(getNetCashFlow(row)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="年化投報" width="120" align="right">
                    <template #default="{ row }">
                        <span :class="getRoiColor(row)" class="font-mono font-bold">
                            {{ getAnnualROI(row) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">
                            編輯
                        </el-button>
                        <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">
                            刪除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" plain :icon="Plus" style="width: 100%; margin-top: 8px; border-style: dashed;"
                @click="handleCreate">
                新增資產項目
            </el-button>
        </template>

        <template v-else>
            <el-empty description="暫無商業或副業資產">
                <el-button type="primary" :icon="Plus" @click="handleCreate">立即新增</el-button>
            </el-empty>
        </template>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯資產項目' : '新增資產項目'" width="600px" destroy-on-close
            align-center append-to-body :close-on-click-modal="false">
            <BusinessDialogForm ref="formComponentRef" v-model="currentBusiness" />

            <template #footer>
                <div class="flex justify-end gap-2">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit">
                        確認儲存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from './types/user'
import BusinessDialogForm from './businessDialogForm.vue'

const { authFetch } = useApi()

// ==========================================
// 1. 資料模型
// ==========================================
const tableData = defineModel<UserBusiness[]>({ required: true, default: [] })

// ==========================================
// 2. 狀態管理
// ==========================================
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formComponentRef = ref<InstanceType<typeof BusinessDialogForm>>()

const createDefaultBusiness = (): UserBusiness => ({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    taxCategory: 'exempt',
    acquisitionCost: 0,
    incomeMode: 'monthly',
    totalAccumulatedIncome: 0,
    monthlyIncome: 0,
    monthlyCost: 0,
    loanAmount: 0,
    loanInterestRate: 0
})

const currentBusiness = reactive<UserBusiness>(createDefaultBusiness())

// ==========================================
// 3. 計算邏輯
// ==========================================
const getNetCashFlow = (item: UserBusiness) => {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

const summary = computed(() => {
    let totalCost = 0
    let totalNetFlow = 0
    let totalEquity = 0

    tableData.value.forEach(item => {
        totalCost += (item.acquisitionCost || 0)
        totalNetFlow += getNetCashFlow(item)
        totalEquity += Math.max(0, (item.acquisitionCost || 0) - (item.loanAmount || 0))
    })

    const annualProfit = totalNetFlow * 12
    const avgRoi = totalEquity > 0 ? (annualProfit / totalEquity * 100).toFixed(2) : '0.00'

    return { totalCost, totalNetFlow, avgRoi }
})

// ==========================================
// 4. 操作邏輯
// ==========================================
const handleCreate = () => {
    isEdit.value = false
    Object.assign(currentBusiness, createDefaultBusiness())
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

const handleEdit = (row: UserBusiness) => {
    isEdit.value = true
    Object.assign(currentBusiness, JSON.parse(JSON.stringify(row)))
    dialogVisible.value = true
    nextTick(() => formComponentRef.value?.clearValidate())
}

const handleDelete = (row: UserBusiness) => {
    ElMessageBox.confirm(`確定刪除「${row.name}」嗎？`, '警告', {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        if (!row.id) return
        try {
            await authFetch(`/api/v1/user/businesses/${row.id}`, { method: 'DELETE' })

            const index = tableData.value.findIndex(item => item.id === row.id)
            if (index !== -1) {
                tableData.value.splice(index, 1)
            }
            ElMessage.success('已刪除')
        } catch (e) {
            ElMessage.error('刪除失敗')
        }
    }).catch(() => { })
}

const handleSubmit = async () => {
    const isValid = await formComponentRef.value?.validate()
    if (!isValid) return

    submitting.value = true
    try {
        const method = isEdit.value ? 'PUT' : 'POST'
        const url = isEdit.value
            ? `/api/v1/user/businesses/${currentBusiness.id}`
            : `/api/v1/user/businesses`

        const res = await authFetch(url, {
            method,
            body: currentBusiness
        })

        if (res && res.ok) {
            const savedItem: UserBusiness = await res.json()

            if (isEdit.value) {
                const index = tableData.value.findIndex(item => item.id === savedItem.id)
                if (index !== -1) {
                    tableData.value[index] = savedItem
                }
            } else {
                tableData.value.push(savedItem)
            }

            ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
            dialogVisible.value = false
        } else {
            throw new Error('API Error')
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('儲存失敗')
    } finally {
        submitting.value = false
    }
}

// ==========================================
// 5. Helpers
// ==========================================
const formatCurrency = (val: number) => `$${val.toLocaleString()}`
const formatNumber = (val: number) => val?.toLocaleString() || '0'

// 計算年化投報 (Cash-on-Cash Return)
const getAnnualROI = (row: UserBusiness) => {
    const acquisition = row.acquisitionCost || 0
    const loan = row.loanAmount || 0
    const equity = acquisition - loan // 自有資金

    const monthlyNet = getNetCashFlow(row)

    // 特殊情況處理：全額貸或超額貸 (無本生意)
    if (equity <= 0) {
        if (monthlyNet > 0) return '∞'   // 無本獲利
        if (monthlyNet < 0) return '虧損' // 無本虧損
        return '0.0%'
    }

    const annualNet = monthlyNet * 12
    const roi = (annualNet / equity) * 100

    return roi.toFixed(1) + '%'
}

// 判斷投報率顏色
const getRoiColor = (row: UserBusiness) => {
    // 簡單邏輯：只要淨利是正的，投報率顯示綠色，否則紅色
    return getNetCashFlow(row) >= 0 ? 'text-success' : 'text-danger'
}
</script>

<style scoped>
.business-table-container {
    padding: 0;
}

.stat-card {
    text-align: center;
    border-radius: 8px;
    background-color: #fff;
}

.stat-label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
}

.text-success {
    color: var(--el-color-success);
}

.text-danger {
    color: var(--el-color-danger);
}

@media (max-width: 768px) {
    .hidden-xs-only {
        display: none;
    }
}
</style>
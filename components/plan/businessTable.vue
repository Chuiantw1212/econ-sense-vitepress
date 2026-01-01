<template>
    <div class="business-table-container">

        <el-button type="primary" plain :icon="Plus" style="width: 100%; border-style: dashed;" @click="handleCreate">
            新增資產項目
        </el-button>

        <el-card v-if="tableData.length > 0" style="margin-top:16px">
            <el-table :data="paginatedData" style="width: 100%; margin-top:16px" stripe show-overflow-tooltip
                :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">

                <el-table-column type="index" :index="indexMethod" label="#" width="60" align="center" />

                <el-table-column label="名稱" prop="name" width="120" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div class="font-medium text-gray-800 truncate-text">{{ row.name }}</div>
                    </template>
                </el-table-column>

                <el-table-column label="投入成本" align="right" min-width="110" class-name="hidden-xs-only">
                    <template #default="{ row }">
                        {{ formatNumber(row.acquisitionCost) }}
                    </template>
                </el-table-column>

                <el-table-column label="月淨現金流" align="right" min-width="110">
                    <template #default="{ row }">
                        <span :class="getNetCashFlow(row) >= 0 ? 'text-success' : 'text-danger'"
                            class="font-mono font-bold">
                            {{ formatNumber(getNetCashFlow(row)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="IRR" align="right" min-width="90">
                    <template #default="{ row }">
                        <span :class="getRateColor(row.irr)" class="font-mono font-bold">
                            {{ row.irr || '-' }}
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

            <template #footer>
                <div class="pagination-container">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[5, 10, 20, 50]" :background="true" layout="total, sizes, prev, pager, next"
                        :total="tableData.length" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </template>
        </el-card>

        <el-card v-else>
            <el-empty description="暫無商業或副業資產">
                <el-button type="primary" :icon="Plus" @click="handleCreate">立即新增</el-button>
            </el-empty>
        </el-card>

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

// 分頁狀態
const currentPage = ref(1)
const pageSize = ref(10)

const createDefaultBusiness = (): UserBusiness => ({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    projectYears: 5,
    taxCategory: 'exempt',
    acquisitionCost: 0,
    incomeMode: 'monthly',
    totalAccumulatedIncome: 0,
    monthlyIncome: 0,
    monthlyCost: 0,
    loanAmount: 0,
    loanInterestRate: 0,
    roi: '-',
    irr: '-'
})

const currentBusiness = reactive<UserBusiness>(createDefaultBusiness())

// ==========================================
// 3. 計算邏輯
// ==========================================

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return tableData.value.slice(start, end)
})

const indexMethod = (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1
}

const getNetCashFlow = (item: UserBusiness) => {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

// ==========================================
// 4. 操作邏輯
// ==========================================

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

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
                if (paginatedData.value.length === 0 && currentPage.value > 1) {
                    currentPage.value--
                }
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
                const lastPage = Math.ceil(tableData.value.length / pageSize.value)
                if (lastPage > currentPage.value) {
                    currentPage.value = lastPage
                }
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
const formatNumber = (val: number) => val?.toLocaleString() || '0'

const getRateColor = (val?: string) => {
    if (!val || val === '-') return ''
    if (val.includes('虧損') || val.includes('-')) {
        if (val.includes('虧損')) return 'text-danger'
        const num = parseFloat(val.replace(/[^\d.-]/g, ''))
        if (!isNaN(num) && num < 0) return 'text-danger'
    }
    return 'text-success'
}
</script>

<style scoped>
.business-table-container {
    padding: 0;
}

.text-success {
    color: var(--el-color-success);
}

.text-danger {
    color: var(--el-color-danger);
}

.truncate-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 分頁容器樣式：靠右對齊 */
.pagination-container {
    display: flex;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .hidden-xs-only {
        display: none;
    }

    .pagination-container {
        justify-content: center;
    }
}
</style>
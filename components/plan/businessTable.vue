<template>
    <div class="business-table-container">


        <el-card v-if="pageData.list && pageData.list.length > 0">
            <el-table :data="pageData.list" style="width: 100%" stripe show-overflow-tooltip
                :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">

                <el-table-column type="index" :index="indexMethod" label="#" align="center" />

                <el-table-column label="名稱" prop="name" min-width="130" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div class="font-medium text-gray-800 truncate-text">{{ row.name }}</div>
                    </template>
                </el-table-column>

                <el-table-column label="投入成本" align="right" class-name="hidden-xs-only">
                    <template #default="{ row }">
                        {{ formatNumber(row.acquisitionCost) }}
                    </template>
                </el-table-column>

                <el-table-column label="月現金流" align="right">
                    <template #default="{ row }">
                        <span :class="getNetCashFlow(row) >= 0 ? 'text-success' : 'text-danger'"
                            class="font-mono font-bold">
                            {{ formatNumber(getNetCashFlow(row)) }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="IRR" align="right">
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
                    <el-pagination :current-page="pageData.currentPage" :page-size="pageData.pageSize"
                        :total="pageData.total" :page-sizes="[5, 10, 20, 50]" :background="true"
                        layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </template>
        </el-card>

        <el-card v-else>
            <el-empty description="暫無商業或副業資產">
                <el-button type="primary" :icon="Plus" @click="handleCreate">立即新增</el-button>
            </el-empty>
        </el-card>

        <div style="height: 24px;"></div>

        <el-button type="primary" plain :icon="Plus" style="width: 100%; border-style: dashed;" @click="handleCreate">
            新增資產項目
        </el-button>

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
import { ref, reactive, nextTick } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useApi } from '@/components/plan/composables/useApi'
import type { UserBusiness } from './types/user'
import type { PaginatedResponse } from './types/util'
import BusinessDialogForm from './businessDialogForm.vue'

const { authFetch } = useApi()

// ==========================================
// 1. 資料模型 (Props & Emits)
// ==========================================
// 修改：接收完整的後端分頁物件
const pageData = defineModel<PaginatedResponse<UserBusiness>>({
    required: true,
    default: () => ({ list: [], total: 0, currentPage: 1, pageSize: 10, totalPages: 0 })
})

// 新增：定義事件，讓父層知道何時該重新打 API
const emit = defineEmits<{
    (e: 'change-page', page: number, pageSize: number): void
    (e: 'refresh'): void
}>()

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

// 序號計算：依賴後端回傳的 currentPage 與 pageSize
const indexMethod = (index: number) => {
    const { currentPage, pageSize } = pageData.value
    return (currentPage - 1) * pageSize + index + 1
}

const getNetCashFlow = (item: UserBusiness) => {
    const income = item.monthlyIncome || 0
    const cost = item.monthlyCost || 0
    const interest = Math.round((item.loanAmount || 0) * (item.loanInterestRate || 0) / 100 / 12)
    return income - cost - interest
}

// ==========================================
// 4. 操作邏輯 (分頁)
// ==========================================

const handleSizeChange = (val: number) => {
    // 當每頁筆數改變，通常回到第一頁，並通知父層
    emit('change-page', 1, val)
}

const handleCurrentChange = (val: number) => {
    // 當頁碼改變，通知父層抓取該頁資料
    emit('change-page', val, pageData.value.pageSize)
}

// ==========================================
// 5. 操作邏輯 (CRUD)
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

            // 修改：刪除成功後，不再自己 splice array，而是通知父層 refresh
            // 因為刪除一筆資料會影響總頁數和總筆數，後端重算最準
            ElMessage.success('已刪除')
            emit('refresh')

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
            // 修改：儲存成功後，直接通知父層 refresh 重抓資料
            // 這樣可以確保排序正確，並且如果新增後導致換頁，也能由父層邏輯處理
            ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
            dialogVisible.value = false
            emit('refresh')
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
// 6. Helpers
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
/* 維持原樣式 */
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

.pagination-container {
    margin-top: 16px;
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